import { getTranslations } from "next-intl/server";
import { Button } from "@/components";
import styles from "./home.module.css";

const LINKEDIN_URL =
  "https://www.linkedin.com/in/andres-santiago-acevedo-mancera";

export async function Contact() {
  const t = await getTranslations("Home.contact");
  const tA11y = await getTranslations("A11y");
  const email = t("email");

  return (
    <section
      id="contact"
      className={styles.contact}
      aria-labelledby="contact-heading"
    >
      <div className={`${styles.inner} ${styles.contactPad}`}>
        <p className={styles.sectionLabel}>{t("label")}</p>
        <h2 id="contact-heading" className={styles.contactTitle}>
          {t("title")}
        </h2>
        <a className={styles.contactEmail} href={`mailto:${email}`}>
          {email}
        </a>
        <div className={styles.contactActions}>
          <Button
            variant="outline"
            href={LINKEDIN_URL}
            target="_blank"
            rel="noopener noreferrer"
          >
            {t("linkedin")}
            <span className="sr-only"> {tA11y("opensInNewTab")}</span>
          </Button>
          <span className="btn btn-outline" aria-disabled="true">
            {t("github")}
          </span>
          <Button variant="primary" href="/cv/en.pdf">
            {t("cvEn")}
          </Button>
          <Button variant="outline" href="/cv/es.pdf">
            {t("cvEs")}
          </Button>
        </div>
      </div>
    </section>
  );
}
