import { getTranslations, setRequestLocale } from "next-intl/server";
import { Suspense } from "react";

type Props = {
  params: Promise<{ locale: string }>;
};

export default function NotesPage({ params }: Props) {
  return (
    <Suspense fallback={<MainShell />}>
      <NotesContent params={params} />
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

async function NotesContent({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("Stubs");

  return (
    <MainShell>
      <h1 className="h1">{t("notesTitle")}</h1>
      <p
        className="body"
        style={{ marginTop: "var(--space-4)", color: "var(--text-muted)" }}
      >
        {t("notesBody")}
      </p>
    </MainShell>
  );
}
