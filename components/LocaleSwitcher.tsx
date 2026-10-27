"use client";

import { useLocale, useTranslations } from "next-intl";
import { Link, usePathname } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";

export function LocaleSwitcher() {
  const t = useTranslations("LocaleSwitch");
  const locale = useLocale();
  const pathname = usePathname();

  return (
    <div className="locale-switch" aria-label={t("ariaLabel")} role="group">
      {routing.locales.map((code) => {
        const active = code === locale;
        return (
          <Link
            key={code}
            href={pathname}
            locale={code}
            className={
              active
                ? "locale-switch__option locale-switch__option--active"
                : "locale-switch__option"
            }
            aria-label={
              code === "en"
                ? `${t("en")}, ${t("enAria")}`
                : `${t("es")}, ${t("esAria")}`
            }
            aria-current={active ? "true" : undefined}
          >
            {code === "en" ? t("en") : t("es")}
          </Link>
        );
      })}
    </div>
  );
}
