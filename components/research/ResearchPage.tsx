import { getTranslations } from "next-intl/server";
import { Button, Card, Label, Stat } from "@/components";
import { Link } from "@/i18n/navigation";
import styles from "./research.module.css";

const ARXIV_ABS = "https://arxiv.org/abs/2502.04271";
const ARXIV_PDF = "https://arxiv.org/pdf/2502.04271";

const AREA_KEYS = ["qaoa", "nqfs", "vqdd"] as const;
const BACKGROUND_KEYS = [
  "physics",
  "researcher",
  "ai",
  "diploma",
] as const;
const PRINCIPLE_KEYS = ["first", "measure", "explain"] as const;

export async function ResearchPage() {
  const t = await getTranslations("Research");

  return (
    <main className={styles.page}>
      <header className={styles.hero}>
        <div className={styles.inner}>
          <p className={styles.breadcrumb}>
            <Link href="/" className={styles.breadcrumbLink}>
              {t("breadcrumbHome")}
            </Link>
            {t("breadcrumbCurrent")}
          </p>
          <p className={styles.pageLabel}>{t("label")}</p>
          <h1 className={`h1 ${styles.title}`}>
            {t("titleBefore")}
            <span className={styles.titleAccent}>{t("titleAccent")}</span>
          </h1>
          <p className={`lead ${styles.lead}`}>{t("lead")}</p>
        </div>

        <div className={styles.inner}>
          <div className={styles.stats}>
            <Stat
              className={styles.statCell}
              value={t("stats.preprintsValue")}
              caption={t("stats.preprintsCaption")}
            />
            <Stat
              className={styles.statCell}
              value={t("stats.posterValue")}
              caption={t("stats.posterCaption")}
            />
            <Stat
              className={styles.statCell}
              value={t("stats.yearsValue")}
              caption={t("stats.yearsCaption")}
            />
            <Stat
              className={styles.statCell}
              value={t("stats.degreeValue")}
              caption={t("stats.degreeCaption")}
            />
          </div>
        </div>
      </header>

      <section className={styles.section} aria-labelledby="publications-heading">
        <div className={styles.inner}>
          <p className={styles.sectionLabel}>{t("publications.label")}</p>
          <h2 id="publications-heading" className={`h2 ${styles.sectionTitle}`}>
            {t("publications.title")}
          </h2>
          <div className={styles.pubGrid}>
            <Card className={styles.paperCard}>
              <Label accent>{t("publications.paperLabel")}</Label>
              <h3 className={styles.paperTitle}>{t("publications.paperTitle")}</h3>
              <p className={styles.paperAuthors}>
                {t("publications.paperAuthors")}
              </p>
              <p className={styles.paperSummary}>
                {t("publications.paperSummary")}
              </p>
              <div className={styles.paperActions}>
                <Button
                  variant="primary"
                  href={ARXIV_ABS}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {t("publications.arxivCta")}
                </Button>
                <Button
                  variant="outline"
                  href={ARXIV_PDF}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {t("publications.pdfCta")}
                </Button>
              </div>
            </Card>
            <div className={styles.posterCard}>
              <p className={styles.posterLabel}>{t("publications.posterLabel")}</p>
              <h3 className={styles.posterTitle}>
                {t("publications.posterTitle")}
              </h3>
              <p className={styles.posterBody}>{t("publications.posterBody")}</p>
            </div>
          </div>
        </div>
      </section>

      <section className={styles.section} aria-labelledby="areas-heading">
        <div className={styles.inner}>
          <p className={styles.sectionLabel}>{t("areas.label")}</p>
          <h2 id="areas-heading" className={`h2 ${styles.sectionTitle}`}>
            {t("areas.title")}
          </h2>
          <div className={styles.areasGrid}>
            {AREA_KEYS.map((key) => (
              <Card key={key} className={styles.areaCard}>
                <p className={styles.areaMeta}>{t(`areas.items.${key}.meta`)}</p>
                <h3 className={styles.areaTitle}>
                  {t(`areas.items.${key}.title`)}
                </h3>
                <p className={styles.areaBody}>{t(`areas.items.${key}.body`)}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section
        className={styles.backgroundSection}
        aria-labelledby="background-heading"
      >
        <div className={`${styles.inner} ${styles.backgroundInner}`}>
          <div className={styles.backgroundIntro}>
            <p className={styles.sectionLabel}>{t("background.label")}</p>
            <h2 id="background-heading" className={`h2 ${styles.sectionTitle}`}>
              {t("background.title")}
            </h2>
          </div>
          <div className={styles.timeline}>
            {BACKGROUND_KEYS.map((key) => (
              <div key={key} className={styles.timelineRow}>
                <span className={styles.timelineDates}>
                  {t(`background.items.${key}.dates`)}
                </span>
                <div className={styles.timelineBody}>
                  <div className={styles.timelineTitle}>
                    {t(`background.items.${key}.title`)}
                  </div>
                  <div className={styles.timelinePlace}>
                    {t(`background.items.${key}.place`)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className={styles.principles} aria-labelledby="principles-heading">
        <div className={styles.inner}>
          <p className={styles.sectionLabel}>{t("principles.label")}</p>
          <h2 id="principles-heading" className={`h2 ${styles.sectionTitle}`}>
            {t("principles.title")}
          </h2>
          <div className={styles.principlesGrid}>
            {PRINCIPLE_KEYS.map((key) => (
              <div key={key} className={styles.principleCard}>
                <div className={styles.principleTitle}>
                  {t(`principles.items.${key}.title`)}
                </div>
                <p className={styles.principleBody}>
                  {t(`principles.items.${key}.body`)}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className={styles.cta} aria-labelledby="research-cta-heading">
        <div className={`${styles.inner} ${styles.ctaInner}`}>
          <h2 id="research-cta-heading" className={styles.ctaTitle}>
            {t("cta.title")}
          </h2>
          <div className={styles.ctaActions}>
            <Link href="/contact" className="btn btn-primary">
              {t("cta.contact")}
            </Link>
            <Link href="/#work" className="btn btn-outline">
              {t("cta.work")}
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
