import { setRequestLocale } from "next-intl/server";
import { Suspense } from "react";
import {
  AiDemo,
  Contact,
  FeaturedWork,
  Hero,
  RecentNotes,
  Research,
  Stack,
} from "@/components/home";

type Props = {
  params: Promise<{ locale: string }>;
};

export default function Home({ params }: Props) {
  return (
    <Suspense fallback={<main />}>
      <HomeContent params={params} />
    </Suspense>
  );
}

async function HomeContent({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <main>
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
