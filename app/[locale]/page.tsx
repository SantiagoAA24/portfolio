import { Link } from "@/i18n/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Suspense } from "react";

type Props = {
  params: Promise<{ locale: string }>;
};

export default function Home({ params }: Props) {
  return (
    <Suspense fallback={<MainShell />}>
      <HomeContent params={params} />
    </Suspense>
  );
}

function MainShell({ children }: { children?: React.ReactNode }) {
  return (
    <main
      style={{
        maxWidth: "var(--container-max)",
        margin: "0 auto",
        padding: "var(--space-24) var(--container-gutter)",
      }}
    >
      {children}
    </main>
  );
}

async function HomeContent({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("Home");

  return (
    <MainShell>
      <h1 className="h1">{t("title")}</h1>
      <p
        className="lead"
        style={{ marginTop: "var(--space-4)", color: "var(--text-muted)" }}
      >
        {t("lead")}
      </p>
      <p className="body" style={{ marginTop: "var(--space-8)" }}>
        <Link href="/styleguide" style={{ color: "var(--accent)" }}>
          {t("styleguide")}
        </Link>
      </p>
    </MainShell>
  );
}
