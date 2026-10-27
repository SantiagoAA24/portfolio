import { NotesListPage } from "@/components/notes/NotesListPage";
import { routing } from "@/i18n/routing";
import { hasLocale } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";

type Props = {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ category?: string | string[] }>;
};

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) {
    return {};
  }

  const t = await getTranslations({ locale, namespace: "Notes" });
  return {
    title: t("metaTitle"),
    description: t("metaDescription"),
  };
}

export default function NotesRoute({ params, searchParams }: Props) {
  return (
    <Suspense>
      <NotesContent params={params} searchParams={searchParams} />
    </Suspense>
  );
}

async function NotesContent({ params, searchParams }: Props) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  setRequestLocale(locale);

  const resolved = await searchParams;
  const raw = resolved.category;
  const categoryParam = Array.isArray(raw) ? raw[0] : raw;

  return <NotesListPage locale={locale} categoryParam={categoryParam} />;
}
