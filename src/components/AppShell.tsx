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
      <div className="app-bg" aria-hidden>
        <Image
          src="/landing-bg.png"
          alt=""
          fill
          priority
          sizes="430px"
          className="app-bg-img"
        />
        <div className="app-bg-veil" />
        <div className="app-bg-shine" />
      </div>
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
