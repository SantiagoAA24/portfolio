import { getTranslations } from "next-intl/server";
import { Card } from "@/components";
import styles from "./home.module.css";

const noteKeys = ["semantic", "hexagonal", "physics"] as const;

export async function RecentNotes() {
  const t = await getTranslations("Home.notes");

  return (
    <section
      id="notes"
      className={styles.notesBorder}
      aria-labelledby="notes-heading"
    >
      <div className={`${styles.inner} ${styles.sectionPad}`}>
        <p className={styles.sectionLabel}>{t("label")}</p>
        <h2 id="notes-heading" className={`h2 ${styles.sectionTitle}`}>
          {t("title")}
        </h2>
        <div className={styles.notesGrid}>
          {noteKeys.map((key) => (
            <Card key={key} as="a" href="#" className={styles.noteCard}>
              <p className={styles.noteMeta}>{t(`items.${key}.meta`)}</p>
              <p className={styles.noteTitle}>{t(`items.${key}.title`)}</p>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
