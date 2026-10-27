import { ResearchPage } from "@/components/research/ResearchPage";
import { routing } from "@/i18n/routing";
import { buildMetadata } from "@/lib/seo";
import { hasLocale } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";

type Props = {
  params: Promise<{ locale: string }>;
};

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) {
    return {};
  }

  const t = await getTranslations({ locale, namespace: "Research" });
  return buildMetadata({
    locale,
    pathname: "/research",
    title: t("metaTitle"),
    description: t("metaDescription"),
  });
}

export default function ResearchRoute({ params }: Props) {
  return (
    <Suspense>
      <ResearchContent params={params} />
    </Suspense>
  );
}

async function ResearchContent({ params }: Props) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  setRequestLocale(locale);
  return <ResearchPage />;
}
