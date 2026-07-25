"use client";

import type { ReactNode } from "react";
import Image from "next/image";
import { BottomNav } from "./BottomNav";
import { useLocale } from "@/context/LocaleProvider";

export function AppShell({
  children,
  title,
  subtitle,
  headerRight,
}: {
  children: ReactNode;
  title?: string;
  subtitle?: string;
  headerRight?: ReactNode;
}) {
  const { t } = useLocale();

  return (
    <div className="phone-shell">
      <div className="ambient ambient-a" aria-hidden />
      <div className="ambient ambient-b" aria-hidden />
      <div className="ambient ambient-c" aria-hidden />
      <header className="app-header">
        <div className="row-between" style={{ alignItems: "flex-start" }}>
          <p className="brand">
            <Image
              src="/logo-icon.png"
              alt=""
              width={28}
              height={28}
              className="brand-mark"
            />
            {t("brand")}
          </p>
          {headerRight ? (
            <div className="header-right">{headerRight}</div>
          ) : null}
        </div>
        {title ? <h1 className="page-title">{title}</h1> : null}
        {subtitle ? <p className="page-sub">{subtitle}</p> : null}
      </header>
      <main className="app-main">{children}</main>
      <BottomNav />
    </div>
  );
}
