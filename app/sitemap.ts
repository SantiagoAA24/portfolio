import { getPathname } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";
import { getAllNoteMeta } from "@/lib/notes";
import type { SeoPathname } from "@/lib/seo";
import { getSiteUrl } from "@/lib/site";
import { getWorkSlugs } from "@/lib/work";
import type { MetadataRoute } from "next";

const STATIC_PATHS: SeoPathname[] = ["/", "/contact", "/notes", "/research"];

function absoluteUrl(pathname: string): string {
  return `${getSiteUrl()}${pathname}`;
}

function languageAlternates(pathname: SeoPathname): Record<string, string> {
  const languages: Record<string, string> = {};
  for (const locale of routing.locales) {
    languages[locale] = absoluteUrl(getPathname({ locale, href: pathname }));
  }
  return languages;
}

function entry(
  locale: string,
  pathname: SeoPathname,
  lastModified?: Date,
): MetadataRoute.Sitemap[number] {
  return {
    url: absoluteUrl(getPathname({ locale, href: pathname })),
    lastModified,
    alternates: {
      languages: languageAlternates(pathname),
    },
  };
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const workSlugs = getWorkSlugs();
  const entries: MetadataRoute.Sitemap = [];

  for (const locale of routing.locales) {
    for (const pathname of STATIC_PATHS) {
      entries.push(entry(locale, pathname));
    }

    for (const slug of workSlugs) {
      entries.push(entry(locale, `/work/${slug}`));
    }

    const notes = await getAllNoteMeta(locale);
    for (const note of notes) {
      if (note.draft) continue;
      const lastModified = note.date ? new Date(note.date) : undefined;
      entries.push(
        entry(
          locale,
          `/notes/${note.slug}`,
          lastModified && !Number.isNaN(lastModified.getTime())
            ? lastModified
            : undefined,
        ),
      );
    }
  }

  return entries;
}
