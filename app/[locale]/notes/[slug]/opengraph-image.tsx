import { getNoteFrontmatter, isNoteSlug } from "@/lib/notes";
import { createOgImage, ogContentType, ogSize } from "@/lib/og/template";
import { PERSON } from "@/lib/site";
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

  if (!isNoteSlug(slug)) {
    return createOgImage({ title: PERSON.shortName });
  }

  try {
    const frontmatter = await getNoteFrontmatter(safeLocale, slug);
    return createOgImage({
      title: frontmatter.title,
      subtitle: frontmatter.summary,
    });
  } catch {
    return createOgImage({ title: PERSON.shortName });
  }
}
