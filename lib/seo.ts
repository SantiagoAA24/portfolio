import { getPathname } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";
import { getSiteUrl, PERSON } from "@/lib/site";
import type { Metadata } from "next";

export type SeoPathname =
  | "/"
  | "/contact"
  | "/notes"
  | "/research"
  | "/styleguide"
  | `/work/${string}`
  | `/notes/${string}`;

type BuildMetadataArgs = {
  locale: string;
  pathname: SeoPathname;
  title: string | { absolute: string };
  description: string;
  robots?: Metadata["robots"];
};

function absoluteUrl(pathname: string): string {
  return `${getSiteUrl()}${pathname}`;
}

function languageAlternates(pathname: SeoPathname): Record<string, string> {
  const languages: Record<string, string> = {};

  for (const locale of routing.locales) {
    const path = getPathname({ locale, href: pathname });
    languages[locale] = absoluteUrl(path);
  }

  languages["x-default"] = absoluteUrl(
    getPathname({ locale: routing.defaultLocale, href: pathname }),
  );

  return languages;
}

const ogLocaleMap: Record<string, string> = {
  en: "en_US",
  es: "es_ES",
};

export function buildMetadata({
  locale,
  pathname,
  title,
  description,
  robots,
}: BuildMetadataArgs): Metadata {
  const canonicalPath = getPathname({ locale, href: pathname });
  const url = absoluteUrl(canonicalPath);
  const languages = languageAlternates(pathname);
  const ogLocale = ogLocaleMap[locale] ?? "en_US";
  const alternateLocale = routing.locales
    .filter((l) => l !== locale)
    .map((l) => ogLocaleMap[l] ?? l);

  const titleForOg =
    typeof title === "string" ? title : title.absolute;

  return {
    metadataBase: new URL(getSiteUrl()),
    title,
    description,
    alternates: {
      canonical: canonicalPath,
      languages,
    },
    openGraph: {
      type: "website",
      siteName: PERSON.shortName,
      locale: ogLocale,
      alternateLocale,
      url,
      title: titleForOg,
      description,
    },
    twitter: {
      card: "summary_large_image",
      title: titleForOg,
      description,
    },
    robots,
  };
}
