import { getTranslations } from "next-intl/server";
import { Card } from "@/components";
import { Link } from "@/i18n/navigation";
import {
  filterNotesByCategory,
  getAllNoteMeta,
  getFeaturedNote,
  isNoteCategory,
  type NoteCategory,
  type NoteMeta,
} from "@/lib/notes";
import styles from "./notes.module.css";

const LINKEDIN_URL =
  "https://www.linkedin.com/in/andres-santiago-acevedo-mancera";

const FILTERS = [
  { key: "All" as const, messageKey: "all" as const, href: "/notes" },
  {
    key: "AI" as const,
    messageKey: "ai" as const,
    href: "/notes?category=AI",
  },
  {
    key: "Architecture" as const,
    messageKey: "architecture" as const,
    href: "/notes?category=Architecture",
  },
  {
    key: "Career" as const,
    messageKey: "career" as const,
    href: "/notes?category=Career",
  },
];

type Props = {
  locale: string;
  categoryParam?: string;
};

function categoryLabelKey(
  category: NoteCategory,
): "ai" | "architecture" | "career" {
  if (category === "AI") return "ai";
  if (category === "Architecture") return "architecture";
  return "career";
}

export async function NotesListPage({ locale, categoryParam }: Props) {
  const t = await getTranslations("Notes");
  const active: NoteCategory | "All" =
    categoryParam && isNoteCategory(categoryParam) ? categoryParam : "All";

  const allNotes = await getAllNoteMeta(locale);
  const notes = filterNotesByCategory(allNotes, active);
  const featured = getFeaturedNote(allNotes, active);

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
          <nav className={styles.filters} aria-label={t("filters.ariaLabel")}>
            {FILTERS.map((filter) => {
              const isActive = active === filter.key;
              return (
                <Link
                  key={filter.key}
                  href={filter.href}
                  className={
                    isActive
                      ? `chip chip-active ${styles.filterChip}`
                      : `chip ${styles.filterChip}`
                  }
                  aria-current={isActive ? "page" : undefined}
                >
                  {t(`filters.${filter.messageKey}`)}
                </Link>
              );
            })}
          </nav>
        </div>
      </header>

      {featured ? (
        <section className={styles.featuredSection} aria-label={t("featured", {
          category: t(`filters.${categoryLabelKey(featured.category)}`),
        })}>
          <div className={styles.inner}>
            <FeaturedNoteCard note={featured} />
          </div>
        </section>
      ) : null}

      <section className={styles.listSection} aria-labelledby="all-notes-heading">
        <div className={styles.inner}>
          <h2 id="all-notes-heading" className={styles.listHeading}>
            {t("allNotes")}
          </h2>
          {notes.map((note) => (
            <NoteListItem key={note.slug} note={note} />
          ))}
        </div>
      </section>

      <section className={styles.comingSoon} aria-labelledby="coming-soon-heading">
        <div className={styles.inner}>
          <Card dashed className={styles.comingSoonCard}>
            <div>
              <h2 id="coming-soon-heading" className={styles.comingSoonTitle}>
                {t("comingSoonTitle")}
              </h2>
              <p className={styles.comingSoonBody}>{t("comingSoonBody")}</p>
            </div>
            <a
              className="btn btn-outline"
              href={LINKEDIN_URL}
              target="_blank"
              rel="noopener noreferrer"
            >
              {t("linkedin")}
            </a>
          </Card>
        </div>
      </section>
    </main>
  );
}

async function FeaturedNoteCard({ note }: { note: NoteMeta }) {
  const t = await getTranslations("Notes");
  const category = t(`filters.${categoryLabelKey(note.category)}`);

  return (
    <Link href={`/notes/${note.slug}`} className={`card ${styles.featuredCard}`}>
      <div className={styles.featuredCopy}>
        <p className={styles.featuredMeta}>
          {t("featured", { category })}
        </p>
        <h2 className={styles.featuredTitle}>{note.title}</h2>
        <p className={styles.featuredSummary}>{note.summary}</p>
        <p className={styles.featuredByline}>
          {note.date} · {t("minRead", { minutes: note.readingMinutes })}
        </p>
        <p className={styles.featuredCta}>{t("readNote")}</p>
      </div>
      <div className={styles.featuredPipeline} aria-hidden>
        <div className={styles.pipelineStep}>{t("pipeline.question")}</div>
        <div className={`${styles.pipelineStep} ${styles.pipelineStepAccent}`}>
          {t("pipeline.middle")}
        </div>
        <div className={styles.pipelineStep}>{t("pipeline.answer")}</div>
      </div>
    </Link>
  );
}

async function NoteListItem({ note }: { note: NoteMeta }) {
  const t = await getTranslations("Notes");
  const category = t(`filters.${categoryLabelKey(note.category)}`);

  return (
    <Link href={`/notes/${note.slug}`} className={styles.listItem}>
      <span className={styles.listMeta}>
        {t("listMeta", { date: note.date, category })}
      </span>
      <span className={styles.listTitle}>{note.title}</span>
      <span className={styles.listArrow} aria-hidden>
        →
      </span>
    </Link>
  );
}
