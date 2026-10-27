import Image from "next/image";
import { getLocale, getTranslations } from "next-intl/server";
import { Button, Stat } from "@/components";
import styles from "./home.module.css";

export async function Hero() {
  const t = await getTranslations("Home.hero");
  const locale = await getLocale();

  return (
    <section aria-labelledby="hero-heading">
      <div className={`${styles.inner} ${styles.heroTop}`}>
        <div className={styles.heroCopy}>
          <div className={styles.heroStatus}>
            <span className={styles.heroStatusDot} aria-hidden />
            <span className={styles.heroStatusLabel}>{t("status")}</span>
          </div>
          <h1 id="hero-heading" className={`h1 ${styles.heroTitle}`}>
            {t("titleBefore")}
            <span className={styles.accent}>{t("titleAccent")}</span>
            {t("titleAfter")}
          </h1>
          <p className={styles.heroLead}>{t("lead")}</p>
          <div className={styles.heroCtas}>
            <Button variant="primary" href={`/cv/${locale}.pdf`}>
              {t("ctaCv")}
            </Button>
            <Button variant="outline" href="#contact">
              {t("ctaContact")}
            </Button>
          </div>
        </div>

        <div className={styles.heroAside}>
          <Image
            src="/portrait.png"
            alt={t("portraitAlt")}
            width={200}
            height={200}
            priority
            className={styles.portrait}
            sizes="200px"
          />
          <div className={styles.whoami} aria-label={t("whoami.prompt")}>
            <div className={styles.whoamiPrompt}>{t("whoami.prompt")}</div>
            <WhoamiRow
              label={t("whoami.locationKey")}
              value={t("whoami.locationValue")}
            />
            <WhoamiRow
              label={t("whoami.stackKey")}
              value={t("whoami.stackValue")}
            />
            <WhoamiRow label={t("whoami.aiKey")} value={t("whoami.aiValue")} />
            <WhoamiRow
              label={t("whoami.researchKey")}
              value={t("whoami.researchValue")}
            />
            <WhoamiRow
              label={t("whoami.statusKey")}
              value={t("whoami.statusValue")}
              accent
            />
          </div>
        </div>
      </div>

      <div className={styles.statsBand}>
        <div className={`${styles.inner} ${styles.statsInner}`}>
          <div className={styles.statCell}>
            <Stat
              value={t("stats.shippingValue")}
              caption={t("stats.shippingCaption")}
            />
          </div>
          <div className={`${styles.statCell} ${styles.statCellDivider}`}>
            <Stat
              value={t("stats.countriesValue")}
              caption={t("stats.countriesCaption")}
            />
          </div>
          <div className={`${styles.statCell} ${styles.statCellDivider}`}>
            <Stat
              value={t("stats.arxivValue")}
              caption={t("stats.arxivCaption")}
            />
          </div>
        </div>
      </div>
    </section>
  );
}

function WhoamiRow({
  label,
  value,
  accent,
}: {
  label: string;
  value: string;
  accent?: boolean;
}) {
  return (
    <div className={styles.whoamiRow}>
      <span className={styles.whoamiKey}>{label}</span>
      <span className={accent ? styles.accent : undefined}>{value}</span>
    </div>
  );
}
