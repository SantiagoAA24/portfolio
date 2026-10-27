import { CaseStudyLayout } from "@/components/work/CaseStudyLayout";
import { routing } from "@/i18n/routing";
import { buildMetadata } from "@/lib/seo";
import {
  getCase,
  getWorkSlugs,
  isWorkSlug,
  type WorkSlug,
} from "@/lib/work";
import { hasLocale } from "next-intl";
import { setRequestLocale } from "next-intl/server";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

type Props = {
  params: Promise<{ locale: string; slug: string }>;
};

export function generateStaticParams() {
  const slugs = getWorkSlugs();
  return routing.locales.flatMap((locale) =>
    slugs.map((slug) => ({ locale, slug })),
  );
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params;
  if (!hasLocale(routing.locales, locale) || !isWorkSlug(slug)) {
    return {};
  }

  try {
    const { frontmatter } = await getCase(locale, slug);
    return buildMetadata({
      locale,
      pathname: `/work/${slug}`,
      title: frontmatter.title,
      description: frontmatter.lead,
    });
  } catch {
    return {};
  }
}

export default async function WorkCasePage({ params }: Props) {
  const { locale, slug } = await params;
  if (!hasLocale(routing.locales, locale) || !isWorkSlug(slug)) {
    notFound();
  }

  setRequestLocale(locale);

  let frontmatter;
  let content;
  try {
    ({ frontmatter, content } = await getCase(locale, slug as WorkSlug));
  } catch {
    notFound();
  }

  return (
    <CaseStudyLayout slug={slug} frontmatter={frontmatter}>
      {content}
    </CaseStudyLayout>
  );
}
