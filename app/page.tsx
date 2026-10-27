import Link from "next/link";

export default function Home() {
  return (
    <main
      style={{
        maxWidth: "var(--container-max)",
        margin: "0 auto",
        padding: "var(--space-24) var(--container-gutter)",
      }}
    >
      <h1 className="h1">Santiago Acevedo</h1>
      <p className="lead" style={{ marginTop: "var(--space-4)", color: "var(--text-muted)" }}>
        Fullstack engineer building AI products.
      </p>
      <p className="body" style={{ marginTop: "var(--space-8)" }}>
        <Link href="/styleguide" style={{ color: "var(--accent)" }}>
          Open styleguide →
        </Link>
      </p>
    </main>
  );
}
