import { Button, Card, Chip, Label, Pipeline, Stat } from "@/components";
import styles from "./styleguide.module.css";

const palette = [
  { name: "bg", varName: "--bg" },
  { name: "surface", varName: "--surface" },
  { name: "surface-sunken", varName: "--surface-sunken" },
  { name: "line", varName: "--line" },
  { name: "line-strong", varName: "--line-strong" },
  { name: "text", varName: "--text" },
  { name: "text-body", varName: "--text-body" },
  { name: "text-muted", varName: "--text-muted" },
  { name: "accent", varName: "--accent" },
  { name: "on-accent", varName: "--on-accent" },
  { name: "accent-cyan", varName: "--accent-cyan" },
  { name: "accent-lavender", varName: "--accent-lavender" },
] as const;

const typeStyles = [
  {
    name: "display-xl",
    className: "display-xl",
    sample: "Let’s talk.",
  },
  {
    name: "h1",
    className: "h1",
    sample: "Fullstack engineer building AI products",
  },
  {
    name: "h2",
    className: "h2",
    sample: "Three projects, built end to end.",
  },
  {
    name: "h2-article",
    className: "h2-article",
    sample: "What I built",
  },
  {
    name: "h3",
    className: "h3",
    sample: "AI chatbot for enterprise data",
  },
  {
    name: "h4",
    className: "h4",
    sample: "Why semantic search and structured queries together",
  },
  {
    name: "lead",
    className: "lead",
    sample: "A chatbot that answers questions and generates reports.",
  },
  {
    name: "body-lg",
    className: "body-lg",
    sample: "I joined the frontend of an internal engineering-process platform.",
  },
  {
    name: "body",
    className: "body",
    sample: "Semantic search over enterprise data.",
  },
  {
    name: "small",
    className: "small",
    sample: "I usually reply within a few days.",
  },
  {
    name: "label",
    className: "label",
    sample: "01 — SELECTED WORK",
  },
  {
    name: "meta",
    className: "meta",
    sample: "01 · Intelisoft · Energy-sector platform",
  },
  {
    name: "button",
    className: "button",
    sample: "Read case study →",
  },
] as const;

export default function StyleguidePage() {
  return (
    <main className={styles.page}>
      <Label accent>00 — Design system</Label>
      <h1 className={`h1 ${styles.sectionTitle}`}>Terminal styleguide</h1>
      <p className={`lead ${styles.lead}`}>
        Palette, type scale and base components from the Terminal design system.
      </p>

      <section className={styles.section} aria-labelledby="palette-heading">
        <Label accent>01 — Palette</Label>
        <h2 id="palette-heading" className={`h2 ${styles.sectionTitle}`}>
          Color
        </h2>
        <div className={styles.swatchGrid}>
          {palette.map((token) => (
            <div key={token.name} className={styles.swatch}>
              <div
                className={styles.swatchChip}
                style={{ background: `var(${token.varName})` }}
                aria-hidden
              />
              <p className={`meta ${styles.swatchMeta}`}>{token.name}</p>
              <p className="meta" style={{ color: "var(--text-muted)" }}>
                {token.varName}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className={styles.section} aria-labelledby="type-heading">
        <Label accent>02 — Type</Label>
        <h2 id="type-heading" className={`h2 ${styles.sectionTitle}`}>
          Typography
        </h2>
        <div className={styles.typeStack}>
          {typeStyles.map((style) => (
            <div key={style.name} className={styles.typeSample}>
              <p className={`meta ${styles.typeMeta}`}>{style.name}</p>
              <p className={style.className}>{style.sample}</p>
            </div>
          ))}
        </div>
      </section>

      <section className={styles.section} aria-labelledby="components-heading">
        <Label accent>03 — Components</Label>
        <h2 id="components-heading" className={`h2 ${styles.sectionTitle}`}>
          Base UI
        </h2>

        <h3 className="h4" style={{ marginTop: "var(--space-8)" }}>
          Button
        </h3>
        <div className={styles.row}>
          <Button variant="primary" href="#">
            Download CV (EN) ↓
          </Button>
          <Button variant="outline" href="#">
            Contact me →
          </Button>
        </div>

        <h3 className="h4" style={{ marginTop: "var(--space-8)" }}>
          Chip
        </h3>
        <div className={styles.row}>
          <Chip>OpenAI API</Chip>
          <Chip>React</Chip>
          <Chip href="#" active>
            All
          </Chip>
          <Chip href="#">AI</Chip>
        </div>

        <h3 className="h4" style={{ marginTop: "var(--space-8)" }}>
          Label
        </h3>
        <div className={styles.row}>
          <Label accent>01 — Selected work</Label>
          <Label>On this page</Label>
        </div>

        <h3 className="h4" style={{ marginTop: "var(--space-8)" }}>
          Card
        </h3>
        <div className={styles.cardRow}>
          <Card className={styles.cardFlex}>
            <Label accent>Decision</Label>
            <p className={`h4 ${styles.cardTitle}`}>
              How the answers stay grounded
            </p>
            <p className={`body ${styles.cardBody}`}>
              [Describe how you reduced made-up answers.]
            </p>
          </Card>
          <Card dashed className={styles.cardFlex}>
            <p className="h4">More notes are on the way.</p>
            <p className={`body ${styles.cardBody}`}>Follow along on LinkedIn.</p>
          </Card>
        </div>

        <h3 className="h4" style={{ marginTop: "var(--space-8)" }}>
          Pipeline
        </h3>
        <div className={styles.pipelineBand}>
          <Label className={styles.pipelineLabel}>Architecture · simplified</Label>
          <Pipeline>
            <Pipeline.Step>User question</Pipeline.Step>
            <Pipeline.Arrow />
            <div className={styles.parallel}>
              <Pipeline.Step accent>Semantic search</Pipeline.Step>
              <Pipeline.Step accent>Structured queries</Pipeline.Step>
            </div>
            <Pipeline.Arrow />
            <Pipeline.Step>LLM · OpenAI API</Pipeline.Step>
            <Pipeline.Arrow />
            <Pipeline.Step>Answer or report</Pipeline.Step>
          </Pipeline>
          <p className={`small ${styles.pipelineNote}`}>
            Question in, grounded answer or report out.
          </p>
        </div>

        <h3 className="h4" style={{ marginTop: "var(--space-8)" }}>
          Stat
        </h3>
        <div className={styles.statRow}>
          <Stat
            className={styles.statCell}
            value="2022"
            caption="Shipping products since"
          />
          <Stat
            className={styles.statCell}
            value="3"
            caption="Countries with clients"
          />
          <Stat className={styles.statCell} value="1" caption="arXiv preprint" />
        </div>
      </section>
    </main>
  );
}
