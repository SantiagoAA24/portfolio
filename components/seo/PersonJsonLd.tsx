import { getPathname } from "@/i18n/navigation";
import {
  getSiteUrl,
  PERSON,
  personEmailMailto,
  personImageUrl,
} from "@/lib/site";
import { getTranslations } from "next-intl/server";

type Props = {
  locale: string;
};

export async function PersonJsonLd({ locale }: Props) {
  const t = await getTranslations({ locale, namespace: "Contact" });
  const url = `${getSiteUrl()}${getPathname({ locale, href: "/" })}`;

  const data = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: PERSON.fullName,
    alternateName: PERSON.shortName,
    url,
    image: personImageUrl(),
    email: personEmailMailto(),
    jobTitle: t("role"),
    sameAs: [PERSON.linkedInUrl],
    address: {
      "@type": "PostalAddress",
      addressLocality: PERSON.locality,
      addressCountry: PERSON.country,
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
