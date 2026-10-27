import { getTranslations } from "next-intl/server";

export async function Footer() {
  const t = await getTranslations("Footer");

  return (
    <footer className="site-footer">
      <div className="site-footer__inner">
        <span>{t("copyright")}</span>
        <span>{t("location")}</span>
      </div>
    </footer>
  );
}
