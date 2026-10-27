import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import type { NoteSlug } from "@/lib/notes";
import styles from "./home.module.css";

const noteItems: { key: "semantic" | "hexagonal" | "physics"; slug: NoteSlug }[] =
  [
    { key: "semantic", slug: "semantic-search-chatbot" },
    { key: "hexagonal", slug: "hexagonal-backend" },
    { key: "physics", slug: "physics-debugging" },
  ];

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
          {noteItems.map(({ key, slug }) => (
            <Link
              key={key}
              href={`/notes/${slug}`}
              className={`card ${styles.noteCard}`}
            >
              <p className={styles.noteMeta}>{t(`items.${key}.meta`)}</p>
              <p className={styles.noteTitle}>{t(`items.${key}.title`)}</p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
