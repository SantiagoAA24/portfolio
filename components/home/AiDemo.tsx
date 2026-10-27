import { getTranslations } from "next-intl/server";
import styles from "./home.module.css";

export async function AiDemo() {
  const t = await getTranslations("Home.aiDemo");

  return (
    <section
      id="ai-demo"
      className={styles.aiDemo}
      aria-labelledby="ai-demo-heading"
    >
      <div
        className={`${styles.inner} ${styles.sectionPad} ${styles.aiDemoInner}`}
      >
        <div className={styles.aiDemoCopy}>
          <p className={styles.sectionLabel}>{t("label")}</p>
          <h2 id="ai-demo-heading" className={`h2 ${styles.sectionTitle}`}>
            {t("title")}
          </h2>
          <p className={`body-lg ${styles.aiDemoBody}`}>{t("body")}</p>
          <p className={`meta ${styles.aiDemoNote}`}>{t("placeholderNote")}</p>
        </div>

        <div className={styles.terminal} aria-hidden>
          <div className={styles.terminalBar}>
            <span className={styles.terminalDot} />
            <span className={styles.terminalDot} />
            <span className={styles.terminalDot} />
            <span className={styles.terminalTitle}>{t("terminalTitle")}</span>
          </div>
          <div className={styles.terminalBody}>
            <div className={styles.bubbleUser}>{t("sampleQuestion")}</div>
            <div className={styles.bubbleAssistant}>
              {t("sampleAnswer")}
              <div className={styles.citations}>
                <span className={styles.citation}>{t("citation1")}</span>
                <span className={styles.citation}>{t("citation2")}</span>
              </div>
            </div>
            <div className={styles.suggestions}>
              <span className={styles.suggestion}>{t("suggestion1")}</span>
              <span className={styles.suggestion}>{t("suggestion2")}</span>
            </div>
          </div>
          <div className={styles.terminalForm}>
            <input
              className={styles.terminalInput}
              type="text"
              aria-label={t("inputAria")}
              placeholder={t("inputPlaceholder")}
              disabled
              readOnly
            />
            <button type="button" className={styles.terminalAsk} disabled>
              {t("ask")}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
