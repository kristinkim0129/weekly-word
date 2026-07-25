"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useLocale } from "@/context/LocaleProvider";
import type { MessageKey } from "@/lib/i18n/t";

const items: { href: string; labelKey: MessageKey; icon: string }[] = [
  { href: "/", labelKey: "nav.today", icon: "◎" },
  { href: "/capture", labelKey: "nav.capture", icon: "✎" },
  { href: "/group", labelKey: "nav.group", icon: "♡" },
  { href: "/archive", labelKey: "nav.archive", icon: "▤" },
  { href: "/settings", labelKey: "nav.me", icon: "◌" },
];

export function BottomNav() {
  const pathname = usePathname();
  const { t } = useLocale();

  return (
    <nav className="bottom-nav" aria-label={t("nav.aria")}>
      {items.map((item) => {
        const active =
          item.href === "/"
            ? pathname === "/"
            : pathname.startsWith(item.href);
        return (
          <Link
            key={item.href}
            href={item.href}
            className={`nav-item ${active ? "active" : ""}`}
          >
            <span className="nav-icon" aria-hidden>
              {item.icon}
            </span>
            <span>{t(item.labelKey)}</span>
          </Link>
        );
      })}
    </nav>
  );
}
