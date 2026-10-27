import { getTranslations } from "next-intl/server";
import { Chip, Pipeline } from "@/components";
import { Link } from "@/i18n/navigation";
import { homeKeyToSlug, type HomeWorkKey } from "@/lib/work";
import styles from "./home.module.css";

const caseKeys: HomeWorkKey[] = ["intelisoft", "candelasoft", "akontrol"];

export async function FeaturedWork() {
  const t = await getTranslations("Home.work");

  return (
    <section id="work" aria-labelledby="work-heading">
      <div className={`${styles.inner} ${styles.sectionPadTightBottom}`}>
        <p className={styles.sectionLabel}>{t("label")}</p>
        <h2 id="work-heading" className={`h2 ${styles.sectionTitle}`}>
          {t("title")}
        </h2>
      </div>

      <div className={`${styles.inner} ${styles.workList}`}>
        {caseKeys.map((key, index) => (
          <WorkCase
            key={key}
            caseKey={key}
            isLast={index === caseKeys.length - 1}
          />
        ))}
      </div>
    </section>
  );
}

async function WorkCase({
  caseKey,
  isLast,
}: {
  caseKey: HomeWorkKey;
  isLast: boolean;
}) {
  const t = await getTranslations(`Home.work.items.${caseKey}`);
  const tw = await getTranslations("Home.work");
  const chips = t.raw("chips") as string[];
  const slug = homeKeyToSlug[caseKey];

  return (
    <article
      className={
        isLast ? `${styles.workItem} ${styles.workItemLast}` : styles.workItem
      }
    >
      <div className={styles.workText}>
        <p className={`meta ${styles.muted}`}>{t("meta")}</p>
        <h3 className={`h3 ${styles.workTitle}`}>{t("title")}</h3>
        <p className={`body ${styles.workBody}`}>{t("body")}</p>
      </div>
      <div className={styles.workVisual}>
        <div className={styles.workPipeline}>
          {caseKey === "intelisoft" ? (
            <Pipeline aria-hidden>
              <Pipeline.Step>{t("pipeline.question")}</Pipeline.Step>
              <Pipeline.Arrow />
              <Pipeline.Step accent>{t("pipeline.semantic")}</Pipeline.Step>
              <span className={styles.pipelinePlus} aria-hidden>
                +
              </span>
              <Pipeline.Step accent>{t("pipeline.structured")}</Pipeline.Step>
              <Pipeline.Arrow />
              <Pipeline.Step>{t("pipeline.llm")}</Pipeline.Step>
              <Pipeline.Arrow />
              <Pipeline.Step>{t("pipeline.answer")}</Pipeline.Step>
            </Pipeline>
          ) : null}
          {caseKey === "candelasoft" ? (
            <Pipeline aria-hidden>
              <Pipeline.Step>{t("pipeline.robot")}</Pipeline.Step>
              <Pipeline.Arrow />
              <Pipeline.Step accent>{t("pipeline.vision")}</Pipeline.Step>
              <Pipeline.Arrow />
              <Pipeline.Step>{t("pipeline.fastapi")}</Pipeline.Step>
              <Pipeline.Arrow />
              <Pipeline.Step accent>{t("pipeline.realtime")}</Pipeline.Step>
              <Pipeline.Arrow />
              <Pipeline.Step>{t("pipeline.ui")}</Pipeline.Step>
            </Pipeline>
          ) : null}
          {caseKey === "akontrol" ? (
            <Pipeline aria-hidden>
              <Pipeline.Step>{t("pipeline.figma")}</Pipeline.Step>
              <Pipeline.Arrow />
              <Pipeline.Step accent>{t("pipeline.react")}</Pipeline.Step>
              <Pipeline.Arrow />
              <Pipeline.Step>{t("pipeline.fastapi")}</Pipeline.Step>
              <Pipeline.Arrow />
              <Pipeline.Step accent>{t("pipeline.postgres")}</Pipeline.Step>
              <Pipeline.Arrow />
              <Pipeline.Step>{t("pipeline.docker")}</Pipeline.Step>
            </Pipeline>
          ) : null}
        </div>
        <div className={styles.workChips}>
          {chips.map((chip) => (
            <Chip key={chip}>{chip}</Chip>
          ))}
        </div>
        <p className={`meta ${styles.workOutcome}`}>
          {tw("outcomePrefix")} {tw("outcomePlaceholder")}
        </p>
        <Link className={styles.workLink} href={`/work/${slug}`}>
          {tw("caseStudy")}
        </Link>
      </div>
    </article>
  );
}
