import Image from "next/image";
import { getTranslations } from "next-intl/server";
import type { ReactNode } from "react";
import { Card } from "@/components";
import { Link } from "@/i18n/navigation";
import type { NoteFrontmatter } from "@/lib/notes";
import styles from "./notes.module.css";

const LINKEDIN_URL =
  "https://www.linkedin.com/in/andres-santiago-acevedo-mancera";

type Props = {
  frontmatter: NoteFrontmatter;
  readingMinutes: number;
  nextTitle?: string;
  children: ReactNode;
};

function categoryPathSegment(category: NoteFrontmatter["category"]): string {
  return category.toLowerCase();
}

export async function NoteLayout({
  frontmatter,
  readingMinutes,
  nextTitle,
  children,
}: Props) {
  const t = await getTranslations("Notes.article");

  const tA11y = await getTranslations("A11y");

  return (
    <main id="main-content">
    <article className={styles.article}>
      <header className={styles.articleHeader}>
        <div className={styles.measure}>
          <p className={styles.breadcrumb}>
            <Link href="/notes" className={styles.breadcrumbLink}>
              {t("breadcrumbNotes")}
            </Link>
            {` / ${categoryPathSegment(frontmatter.category)}`}
          </p>
          <span className={`chip ${styles.categoryChip}`}>
            {frontmatter.category}
          </span>
          <h1 className={styles.articleTitle}>{frontmatter.title}</h1>
          <p className={styles.articleSummary}>{frontmatter.summary}</p>
          <div className={styles.byline}>
            <Image
              src="/portrait.png"
              alt={t("portraitAlt")}
              width={44}
              height={44}
              className={styles.avatar}
              sizes="44px"
            />
            <div className={styles.bylineCopy}>
              <div className={styles.bylineName}>{t("authorName")}</div>
              <div className={styles.bylineMeta}>
                {t("byline", {
                  date: frontmatter.date,
                  minutes: readingMinutes,
                })}
              </div>
            </div>
            <a
              className={styles.shareLink}
              href={LINKEDIN_URL}
              target="_blank"
              rel="noopener noreferrer"
            >
              {t("shareLinkedIn")}
              <span className="sr-only"> {tA11y("opensInNewTab")}</span>
            </a>
          </div>
        </div>
      </header>

      <div className={`${styles.measure} ${styles.prose}`}>{children}</div>

      <div className={styles.authorCardWrap}>
        <div className={styles.measure}>
          <Card className={styles.authorCard}>
            <Image
              src="/portrait.png"
              alt={t("portraitAlt")}
              width={72}
              height={72}
              className={styles.authorAvatar}
              sizes="72px"
            />
            <div className={styles.authorCopy}>
              <div className={styles.authorName}>{t("writtenBy")}</div>
              <p className={styles.authorBio}>{t("authorBio")}</p>
            </div>
            <Link href="/contact" className="btn btn-primary">
              {t("getInTouch")}
            </Link>
          </Card>
        </div>
      </div>

      <section className={styles.next} aria-label={t("nextNote")}>
        <div className={`${styles.inner} ${styles.nextInner}`}>
          <div>
            {frontmatter.nextSlug && nextTitle ? (
              <>
                <p className={styles.nextLabel}>{t("nextNote")}</p>
                <Link
                  href={`/notes/${frontmatter.nextSlug}`}
                  className={styles.nextTitle}
                >
                  {nextTitle}{" "}
                  <span className={styles.nextArrow} aria-hidden>
                    →
                  </span>
                </Link>
              </>
            ) : null}
          </div>
          <Link href="/notes" className="btn btn-outline">
            {t("allNotes")}
          </Link>
        </div>
      </section>
    </article>
    </main>
  );
}
