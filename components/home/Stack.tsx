import { getTranslations } from "next-intl/server";
import styles from "./home.module.css";

const columns = ["frontend", "backend", "ai", "infra"] as const;

export async function Stack() {
  const t = await getTranslations("Home.stack");

  return (
    <section
      id="stack"
      className={styles.stackBorder}
      aria-labelledby="stack-heading"
    >
      <div className={`${styles.inner} ${styles.sectionPad}`}>
        <p className={styles.sectionLabel}>{t("label")}</p>
        <h2 id="stack-heading" className={`h2 ${styles.sectionTitle}`}>
          {t("title")}
        </h2>
        <div className={styles.stackGrid}>
          {columns.map((col) => {
            const items = t.raw(`${col}.items`) as string[];
            const accent = col === "ai";
            return (
              <div key={col} className={styles.stackCol}>
                <div
                  className={
                    accent
                      ? `label ${styles.stackColTitleAccent}`
                      : `label ${styles.stackColTitle}`
                  }
                >
                  {t(`${col}.title`)}
                </div>
                <ul className={styles.stackList}>
                  {items.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
