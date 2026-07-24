"use client";

import type { ReactNode } from "react";
import { BottomNav } from "./BottomNav";

export function AppShell({
  children,
  title,
  subtitle,
}: {
  children: ReactNode;
  title?: string;
  subtitle?: string;
}) {
  return (
    <div className="phone-shell">
      <div className="ambient ambient-a" aria-hidden />
      <div className="ambient ambient-b" aria-hidden />
      <header className="app-header">
        <p className="brand">Weekly Word</p>
        {title ? <h1 className="page-title">{title}</h1> : null}
        {subtitle ? <p className="page-sub">{subtitle}</p> : null}
      </header>
      <main className="app-main">{children}</main>
      <BottomNav />
    </div>
  );
}
