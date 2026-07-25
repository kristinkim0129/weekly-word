"use client";

import type { ReactNode } from "react";
import { usePathname } from "next/navigation";
import {
  ConfigMissingScreen,
  LoginScreen,
} from "@/components/auth/LoginScreen";
import { LanguageSelectScreen } from "@/components/auth/LanguageSelectScreen";
import { AppProvider } from "@/context/AppProvider";
import { useAuth } from "@/context/AuthProvider";
import { useLocale } from "@/context/LocaleProvider";

export function AuthGate({ children }: { children: ReactNode }) {
  const { ready, configured, user } = useAuth();
  const { ready: localeReady, locale, t } = useLocale();
  const pathname = usePathname();
  const path =
    pathname ||
    (typeof window !== "undefined" ? window.location.pathname : "");

  // Public / preview routes — no login
  if (
    path === "/dev-preview" ||
    path === "/storyboard" ||
    path === "/app-store-shots" ||
    path === "/privacy" ||
    path === "/support"
  ) {
    return <>{children}</>;
  }

  if (!ready || !localeReady) {
    return (
      <div className="flex min-h-dvh items-center justify-center text-[var(--ink-soft)]">
        {t("loading")}
      </div>
    );
  }

  if (!locale) {
    return <LanguageSelectScreen />;
  }

  if (!configured) {
    return <ConfigMissingScreen />;
  }

  if (!user) {
    return <LoginScreen />;
  }

  return <AppProvider>{children}</AppProvider>;
}
