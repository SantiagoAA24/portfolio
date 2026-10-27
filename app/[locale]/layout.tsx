import { Footer, Header } from "@/components";
import { routing } from "@/i18n/routing";
import { buildMetadata } from "@/lib/seo";
import { PERSON } from "@/lib/site";
import { hasLocale } from "next-intl";
import { NextIntlClientProvider } from "next-intl";
import { getMessages, getTranslations, setRequestLocale } from "next-intl/server";
import { Inter, JetBrains_Mono, Space_Grotesk } from "next/font/google";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import type { ReactNode } from "react";
import "../globals.css";

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
});

type Props = {
  children: ReactNode;
  params: Promise<{ locale: string }>;
};

// Locale layout must read `params` for <html lang>. Opt out of instant-shell
// validation for this segment; pages underneath stay independently validated.
export const instant = false;

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Meta" });
  const base = buildMetadata({
    locale,
    pathname: "/",
    title: {
      absolute: t("title"),
    },
    description: t("description"),
  });

  return {
    ...base,
    title: {
      default: t("title"),
      template: `%s · ${PERSON.shortName}`,
    },
  };
}

export default async function LocaleLayout({ children, params }: Props) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  setRequestLocale(locale);
  const messages = await getMessages();

  return (
    <html
      lang={locale}
      className={`${spaceGrotesk.variable} ${inter.variable} ${jetbrainsMono.variable}`}
    >
      <body>
        <NextIntlClientProvider messages={messages}>
          <Header />
          {children}
          <Footer />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
