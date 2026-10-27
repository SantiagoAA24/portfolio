import { NoteLayout } from "@/components/notes/NoteLayout";
import { routing } from "@/i18n/routing";
import {
  getNote,
  getNoteFrontmatter,
  getNoteSlugs,
  isNoteSlug,
  type NoteSlug,
} from "@/lib/notes";
import { buildMetadata } from "@/lib/seo";
import { hasLocale } from "next-intl";
import { setRequestLocale } from "next-intl/server";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

type Props = {
  params: Promise<{ locale: string; slug: string }>;
};

export function generateStaticParams() {
  const slugs = getNoteSlugs();
  return routing.locales.flatMap((locale) =>
    slugs.map((slug) => ({ locale, slug })),
  );
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params;
  if (!hasLocale(routing.locales, locale) || !isNoteSlug(slug)) {
    return {};
  }

  try {
    const frontmatter = await getNoteFrontmatter(locale, slug);
    return buildMetadata({
      locale,
      pathname: `/notes/${slug}`,
      title: frontmatter.title,
      description: frontmatter.summary,
      robots: frontmatter.draft
        ? { index: false, follow: false }
        : undefined,
    });
  } catch {
    return {};
  }
}

export default async function NoteSlugPage({ params }: Props) {
  const { locale, slug } = await params;
  if (!hasLocale(routing.locales, locale) || !isNoteSlug(slug)) {
    notFound();
  }

  setRequestLocale(locale);

  let frontmatter;
  let content;
  let readingMinutes;
  try {
    ({ frontmatter, content, readingMinutes } = await getNote(
      locale,
      slug as NoteSlug,
    ));
  } catch {
    notFound();
  }

  let nextTitle: string | undefined;
  if (frontmatter.nextSlug) {
    try {
      const next = await getNoteFrontmatter(locale, frontmatter.nextSlug);
      nextTitle = next.title;
    } catch {
      nextTitle = undefined;
    }
  }

  return (
    <NoteLayout
      frontmatter={frontmatter}
      readingMinutes={readingMinutes}
      nextTitle={nextTitle}
    >
      {content}
    </NoteLayout>
  );
}
