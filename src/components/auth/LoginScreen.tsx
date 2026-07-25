"use client";

import { useState } from "react";
import { AppShell } from "@/components/AppShell";
import { GlassCard } from "@/components/ui/GlassCard";
import { Button } from "@/components/ui/Button";
import { useAuth } from "@/context/AuthProvider";
import { useLocale } from "@/context/LocaleProvider";

export function LoginScreen() {
  const { signInWithGoogle } = useAuth();
  const { t } = useLocale();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function onGoogle() {
    setLoading(true);
    setError("");
    try {
      await signInWithGoogle();
    } catch (e) {
      setError(e instanceof Error ? e.message : t("login.fail"));
      setLoading(false);
    }
  }

  return (
    <div className="phone-shell">
      <div className="ambient ambient-a" aria-hidden />
      <div className="ambient ambient-b" aria-hidden />
      <div className="ambient ambient-c" aria-hidden />
      <header className="app-header">
        <p className="brand">{t("brand")}</p>
        <h1 className="page-title">{t("tagline")}</h1>
        <p className="page-sub">{t("taglinePrayer")}</p>
      </header>
      <main className="app-main">
        <GlassCard>
          <p className="pill">{t("login.start")}</p>
          <p className="hint" style={{ margin: "12px 0 16px" }}>
            {t("login.blurb")}
          </p>
          <Button
            style={{ width: "100%" }}
            onClick={onGoogle}
            disabled={loading}
          >
            {loading ? t("login.googleLoading") : t("login.google")}
          </Button>
          {error ? (
            <p
              className="hint"
              style={{ marginTop: 12, color: "var(--accent-deep)" }}
            >
              {error}
            </p>
          ) : null}
        </GlassCard>
        <GlassCard>
          <p className="tiny">{t("login.privacy")}</p>
        </GlassCard>
      </main>
    </div>
  );
}

/** Dev fallback when Supabase env is missing */
export function ConfigMissingScreen() {
  const { t } = useLocale();
  return (
    <AppShell title={t("config.title")} subtitle={t("config.subtitle")}>
      <GlassCard>
        <p className="hint">{t("config.body")}</p>
        <p className="hint" style={{ marginTop: 10 }}>
          {t("config.setup")}
        </p>
      </GlassCard>
    </AppShell>
  );
}
