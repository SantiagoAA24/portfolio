import { getTranslations } from "next-intl/server";
import { Card, Label } from "@/components";
import { Link } from "@/i18n/navigation";
import styles from "./home.module.css";

const ARXIV_URL = "https://arxiv.org/abs/2502.04271";

export async function Research() {
  const t = await getTranslations("Home.research");

  return (
    <section id="research" aria-labelledby="research-heading">
      <div
        className={`${styles.inner} ${styles.sectionPad} ${styles.researchInner}`}
      >
        <div className={styles.researchCopy}>
          <p className={styles.sectionLabel}>{t("label")}</p>
          <h2 id="research-heading" className={`h2 ${styles.sectionTitle}`}>
            <Link href="/research" className={styles.sectionTitleLink}>
              {t("title")}
            </Link>
          </h2>
          <p className={`body-lg ${styles.researchBody}`}>{t("body")}</p>
        </div>

        <div className={styles.researchCards}>
          <Card className={styles.preprintCard}>
            <Label accent>{t("preprintLabel")}</Label>
            <h3 className={`h4 ${styles.preprintTitle}`}>{t("preprintTitle")}</h3>
            <p className={styles.preprintAuthors}>{t("preprintAuthors")}</p>
            <a
              className={styles.preprintLink}
              href={ARXIV_URL}
              target="_blank"
              rel="noopener noreferrer"
            >
              {t("preprintLink")}
            </a>
          </Card>
          <div className={styles.posterCard}>
            <p className={`label ${styles.muted}`}>{t("posterLabel")}</p>
            <p className={styles.posterTitle}>{t("posterTitle")}</p>
          </div>
        </div>
      </div>
    </section>
  );
}
