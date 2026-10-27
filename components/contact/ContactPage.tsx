import { Button, Label } from "@/components";
import { Link } from "@/i18n/navigation";
import { getTranslations } from "next-intl/server";
import Image from "next/image";
import { ContactForm } from "./ContactForm";
import styles from "./contact.module.css";

const LINKEDIN_URL =
  "https://www.linkedin.com/in/andres-santiago-acevedo-mancera";

const LOOKING_FOR_KEYS = ["remote", "ai", "english"] as const;

export async function ContactPage() {
  const t = await getTranslations("Contact");
  const email = t("email");

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
          <p className={styles.pageLabel}>
            <Label accent>{t("label")}</Label>
          </p>
          <h1 className={`display-xl ${styles.title}`}>
            {t("titleBefore")}
            <span className={styles.titleAccent}>{t("titleAccent")}</span>
          </h1>
          <p className={`lead ${styles.lead}`}>{t("lead")}</p>
        </div>
      </header>

      <div className={`${styles.inner} ${styles.body}`}>
        <aside className={styles.aside}>
          <div className={styles.profile}>
            <Image
              src="/portrait.png"
              alt={t("portraitAlt")}
              width={96}
              height={96}
              className={styles.portrait}
            />
            <div>
              <div className={styles.fullName}>{t("fullName")}</div>
              <div className={styles.role}>{t("role")}</div>
            </div>
          </div>

          <div className={styles.lookingFor}>
            <div className={styles.lookingForLabel}>
              <Label accent>{t("lookingForLabel")}</Label>
            </div>
            <ul className={styles.lookingForList}>
              {LOOKING_FOR_KEYS.map((key) => (
                <li key={key} className={styles.lookingForItem}>
                  {t(`lookingFor.${key}`)}
                </li>
              ))}
            </ul>
          </div>

          <dl className={styles.rows}>
            <div className={styles.row}>
              <dt className={styles.rowLabel}>{t("rows.email")}</dt>
              <dd>
                <a className={styles.rowValue} href={`mailto:${email}`}>
                  {email}
                </a>
              </dd>
            </div>
            <div className={styles.row}>
              <dt className={styles.rowLabel}>{t("rows.linkedin")}</dt>
              <dd>
                <a
                  className={styles.rowValue}
                  href={LINKEDIN_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {t("linkedin")}
                </a>
              </dd>
            </div>
            <div className={styles.row}>
              <dt className={styles.rowLabel}>{t("rows.github")}</dt>
              <dd>
                <span className={styles.rowValue}>{t("github")}</span>
              </dd>
            </div>
            <div className={styles.row}>
              <dt className={styles.rowLabel}>{t("rows.location")}</dt>
              <dd>
                <span className={styles.rowValue}>{t("location")}</span>
              </dd>
            </div>
            <div className={styles.row}>
              <dt className={styles.rowLabel}>{t("rows.languages")}</dt>
              <dd>
                <span className={styles.rowValue}>{t("languages")}</span>
              </dd>
            </div>
            <div className={styles.row}>
              <dt className={styles.rowLabel}>{t("rows.availability")}</dt>
              <dd>
                <span className={styles.rowValue}>{t("availability")}</span>
              </dd>
            </div>
          </dl>

          <div className={styles.cvActions}>
            <Button variant="primary" href="/cv/en.pdf" download>
              {t("cvEn")}
            </Button>
            <Button variant="outline" href="/cv/es.pdf" download>
              {t("cvEs")}
            </Button>
          </div>
        </aside>

        <div className={styles.formCol}>
          <ContactForm />
        </div>
      </div>
    </main>
  );
}
