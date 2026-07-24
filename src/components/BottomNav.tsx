"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const items = [
  { href: "/", label: "오늘", icon: "◎" },
  { href: "/capture", label: "기록", icon: "✎" },
  { href: "/group", label: "함께", icon: "♡" },
  { href: "/archive", label: "보관", icon: "▤" },
  { href: "/settings", label: "나", icon: "◌" },
];

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="bottom-nav" aria-label="주요 메뉴">
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
            <span>{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
