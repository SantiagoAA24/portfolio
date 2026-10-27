import { getLocale, getTranslations } from "next-intl/server";
import { Button } from "@/components/Button";
import { Link } from "@/i18n/navigation";
import { LocaleSwitcher } from "./LocaleSwitcher";
import { SiteNav } from "./SiteNav";

export async function Header() {
  const t = await getTranslations("Header");
  const locale = await getLocale();

  return (
    <header className="site-header">
      <div className="site-header__inner">
        <Link href="/" className="site-header__brand">
          <span className="site-header__mark" aria-hidden="true" />
          {t("brand")}
        </Link>
        <SiteNav />
        <div className="site-header__actions">
          <LocaleSwitcher />
          <Button
            variant="outline"
            href={`/cv/${locale}.pdf`}
            className="site-header__cv"
          >
            {t("cv")}
          </Button>
        </div>
      </div>
    </header>
  );
}
