import { getLocale, getTranslations } from "next-intl/server";
import type { ReactNode } from "react";
import { Button, Label, Pipeline } from "@/components";
import { Link } from "@/i18n/navigation";
import type {
  ArchitectureNode,
  CaseFrontmatter,
  WorkSlug,
} from "@/lib/work";
import styles from "./case-study.module.css";

const TOC_IDS = [
  "context",
  "problem",
  "built",
  "decisions",
  "outcome",
] as const;

type Props = {
  slug: WorkSlug;
  frontmatter: CaseFrontmatter;
  children: ReactNode;
};

function isParallel(
  node: ArchitectureNode,
): node is { parallel: { label: string; accent?: boolean }[] } {
  return "parallel" in node;
}

function ArchitectureFlow({ nodes }: { nodes: ArchitectureNode[] }) {
  return (
    <Pipeline>
      {nodes.map((node, index) => {
        const key = isParallel(node)
          ? node.parallel.map((s) => s.label).join("+")
          : node.label;

        return (
          <span key={key} className={styles.archNode}>
            {index > 0 ? <Pipeline.Arrow /> : null}
            {isParallel(node) ? (
              <span className={styles.pipelineStack}>
                {node.parallel.map((step) => (
                  <Pipeline.Step key={step.label} accent={step.accent}>
                    {step.label}
                  </Pipeline.Step>
                ))}
              </span>
            ) : (
              <Pipeline.Step accent={node.accent}>{node.label}</Pipeline.Step>
            )}
          </span>
        );
      })}
    </Pipeline>
  );
}

function titleParts(title: string, accent: string): {
  before: string;
  accent: string;
  after: string;
} {
  const index = title.indexOf(accent);
  if (index === -1) {
    return { before: title, accent: "", after: "" };
  }
  return {
    before: title.slice(0, index),
    accent,
    after: title.slice(index + accent.length),
  };
}

export async function CaseStudyLayout({ slug, frontmatter, children }: Props) {
  const t = await getTranslations("Work");
  const locale = await getLocale();
  const order = String(frontmatter.order).padStart(2, "0");
  const parts = titleParts(frontmatter.title, frontmatter.titleAccent);
  const stackText = frontmatter.stackSummary.join(" · ");

  const nextHref =
    frontmatter.next.kind === "case" && frontmatter.next.slug
      ? `/work/${frontmatter.next.slug}`
      : (frontmatter.next.path ?? "/research");

  return (
    <main id="main-content">
    <article className={styles.page}>
      <header className={styles.header}>
        <div className={styles.inner}>
          <p className={styles.breadcrumb}>
            <Link href="/#work" className={styles.breadcrumbLink}>
              {t("breadcrumbWork")}
            </Link>
            {` / ${order} · ${slug}`}
          </p>
          <p className={styles.category}>{frontmatter.category}</p>
          <h1 className={`h1 ${styles.title}`}>
            {parts.before}
            {parts.accent ? (
              <span className={styles.titleAccent}>{parts.accent}</span>
            ) : null}
            {parts.after}
          </h1>
          <p className={`lead ${styles.lead}`}>{frontmatter.lead}</p>
        </div>

        <div className={styles.inner}>
          <dl className={styles.meta}>
            <div className={styles.metaCell}>
              <dt className={styles.metaLabel}>{t("meta.role")}</dt>
              <dd className={styles.metaValue}>{frontmatter.role}</dd>
            </div>
            <div className={styles.metaCell}>
              <dt className={styles.metaLabel}>{t("meta.context")}</dt>
              <dd className={styles.metaValue}>{frontmatter.context}</dd>
            </div>
            <div className={styles.metaCell}>
              <dt className={styles.metaLabel}>{frontmatter.metaThird.label}</dt>
              <dd
                className={
                  frontmatter.metaThird.accent
                    ? `${styles.metaValue} ${styles.metaValueAccent}`
                    : styles.metaValue
                }
              >
                {frontmatter.metaThird.value}
              </dd>
            </div>
            <div className={styles.metaCell}>
              <dt className={styles.metaLabel}>{t("meta.stack")}</dt>
              <dd className={styles.metaValue}>{stackText}</dd>
            </div>
          </dl>
        </div>
      </header>

      <section className={styles.architectureWrap} aria-labelledby="architecture-heading">
        <div className={styles.inner}>
          <div className={styles.architecture}>
            <h2 id="architecture-heading" className={`label ${styles.architectureLabel}`}>
              {t("architecture")}
            </h2>
            <div className={styles.architectureRows}>
              {frontmatter.architecture.rows.map((row, rowIndex) => (
                <ArchitectureFlow
                  key={`arch-row-${rowIndex}`}
                  nodes={row}
                />
              ))}
            </div>
            <p className={styles.architectureCaption}>
              {frontmatter.architecture.caption}
            </p>
          </div>
        </div>
      </section>

      <div className={`${styles.inner} ${styles.article}`}>
        <aside className={styles.toc}>
          <Label className={styles.tocLabel}>{t("onThisPage")}</Label>
          <nav aria-label={t("onThisPage")}>
            <ol className={styles.tocList}>
              {TOC_IDS.map((id, index) => (
                <li key={id}>
                  <a className={styles.tocLink} href={`#${id}`}>
                    {`${String(index + 1).padStart(2, "0")} ${t(`toc.${id}`)}`}
                  </a>
                </li>
              ))}
            </ol>
          </nav>
        </aside>
        <div className={styles.prose}>{children}</div>
      </div>

      <section className={styles.next}>
        <div className={`${styles.inner} ${styles.nextInner}`}>
          <div>
            <p className={styles.nextLabel}>{frontmatter.next.label}</p>
            <Link href={nextHref} className={styles.nextTitle}>
              {frontmatter.next.title}{" "}
              <span className={styles.nextTitleArrow} aria-hidden>
                →
              </span>
            </Link>
          </div>
          <Link href="/#work" className="btn btn-outline">
            {t("allWork")}
          </Link>
        </div>
      </section>

      <section className={styles.contact}>
        <div className={`${styles.inner} ${styles.contactInner}`}>
          <h2 className={`h2 ${styles.contactTitle}`}>
            {frontmatter.contactHeadline}
          </h2>
          <div className={styles.contactActions}>
            <Link href="/contact" className="btn btn-primary">
              {t("getInTouch")}
            </Link>
            <Button variant="outline" href={`/cv/${locale}.pdf`}>
              {t("cv")}
            </Button>
          </div>
        </div>
      </section>
    </article>
    </main>
  );
}
