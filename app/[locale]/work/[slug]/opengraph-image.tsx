import { createOgImage, ogContentType, ogSize } from "@/lib/og/template";
import { PERSON } from "@/lib/site";
import { getCase, isWorkSlug } from "@/lib/work";
import { routing } from "@/i18n/routing";
import { hasLocale } from "next-intl";

export const alt = PERSON.shortName;
export const size = ogSize;
export const contentType = ogContentType;

type Props = {
  params: Promise<{ locale: string; slug: string }>;
};

export default async function Image({ params }: Props) {
  const { locale, slug } = await params;
  const safeLocale = hasLocale(routing.locales, locale)
    ? locale
    : routing.defaultLocale;

  if (!isWorkSlug(slug)) {
    return createOgImage({ title: PERSON.shortName });
  }

  try {
    const { frontmatter } = await getCase(safeLocale, slug);
    return createOgImage({
      title: frontmatter.title,
      subtitle: frontmatter.lead,
    });
  } catch {
    return createOgImage({ title: PERSON.shortName });
  }
}
