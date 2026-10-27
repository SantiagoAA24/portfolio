"use client";

import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import { Link, usePathname } from "@/i18n/navigation";

const items = [
  { key: "work" as const, href: "/#work", hash: "work" },
  { key: "aiDemo" as const, href: "/#ai-demo", hash: "ai-demo" },
  { key: "research" as const, href: "/#research", hash: "research" },
  { key: "stack" as const, href: "/#stack", hash: "stack" },
  { key: "notes" as const, href: "/#notes", hash: "notes" },
  { key: "contact" as const, href: "/#contact", hash: "contact" },
];

export function SiteNav() {
  const t = useTranslations("Nav");
  const pathname = usePathname();
  const [hash, setHash] = useState("");

  useEffect(() => {
    const sync = () => setHash(window.location.hash.replace(/^#/, ""));
    sync();
    window.addEventListener("hashchange", sync);
    return () => window.removeEventListener("hashchange", sync);
  }, [pathname]);

  const isHome = pathname === "/";

  return (
    <nav className="site-nav" aria-label={t("ariaLabel")}>
      {items.map((item) => {
        const active = isHome && hash === item.hash;

        return (
          <Link
            key={item.key}
            href={item.href}
            className={
              active ? "site-nav__link site-nav__link--active" : "site-nav__link"
            }
            aria-current={active ? "page" : undefined}
          >
            {t(item.key)}
          </Link>
        );
      })}
    </nav>
  );
}
