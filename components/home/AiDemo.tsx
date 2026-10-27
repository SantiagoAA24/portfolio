import { AiDemoChatLazy } from "@/components/home/AiDemoChatLazy";
import { getChatMaxInputChars } from "@/lib/rag/env";
import { getTranslations } from "next-intl/server";
import styles from "./home.module.css";

export async function AiDemo() {
  const t = await getTranslations("Home.aiDemo");
  const maxInputChars = getChatMaxInputChars();

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
        </div>

        <AiDemoChatLazy maxInputChars={maxInputChars} />
      </div>
    </section>
  );
}