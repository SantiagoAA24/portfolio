import { createOgImage, ogContentType, ogSize } from "@/lib/og/template";
import { PERSON } from "@/lib/site";
import { routing } from "@/i18n/routing";
import { hasLocale } from "next-intl";
import { getTranslations } from "next-intl/server";

export const alt = PERSON.shortName;
export const size = ogSize;
export const contentType = ogContentType;

type Props = {
  params: Promise<{ locale: string }>;
};

export default async function Image({ params }: Props) {
  const { locale } = await params;
  const safeLocale = hasLocale(routing.locales, locale)
    ? locale
    : routing.defaultLocale;
  const t = await getTranslations({ locale: safeLocale, namespace: "Meta" });

  return createOgImage({
    title: PERSON.shortName,
    subtitle: t("ogRole"),
  });
}
