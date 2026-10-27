import {
  AiDemo,
  Contact,
  FeaturedWork,
  Hero,
  RecentNotes,
  Research,
  Stack,
} from "@/components/home";
import { PersonJsonLd } from "@/components/seo/PersonJsonLd";
import { buildMetadata } from "@/lib/seo";
import { getTranslations, setRequestLocale } from "next-intl/server";
import type { Metadata } from "next";
import { Suspense } from "react";

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Meta" });
  return buildMetadata({
    locale,
    pathname: "/",
    title: { absolute: t("title") },
    description: t("description"),
  });
}

export default function Home({ params }: Props) {
  return (
    <Suspense fallback={<main id="main-content" />}>
      <HomeContent params={params} />
    </Suspense>
  );
}

async function HomeContent({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <main id="main-content">
      <PersonJsonLd locale={locale} />
      <Hero />
      <FeaturedWork />
      <AiDemo />
      <Research />
      <Stack />
      <RecentNotes />
      <Contact />
    </main>
  );
}
