"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { AppShell } from "@/components/AppShell";
import { GlassCard } from "@/components/ui/GlassCard";
import { Button } from "@/components/ui/Button";
import { useApp } from "@/context/AppProvider";
import { useLocale } from "@/context/LocaleProvider";

function JoinInner() {
  const router = useRouter();
  const params = useSearchParams();
  const { joinGroup, groupId } = useApp();
  const { t } = useLocale();
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [triedAuto, setTriedAuto] = useState(false);

  useEffect(() => {
    const fromUrl = params.get("code");
    if (fromUrl) setCode(fromUrl);
  }, [params]);

  useEffect(() => {
    if (triedAuto) return;
    const fromUrl = params.get("code");
    if (!fromUrl) return;
    setTriedAuto(true);
    setBusy(true);
    void joinGroup(fromUrl)
      .then(() => router.replace("/group"))
      .catch((e) => {
        setError(e instanceof Error ? e.message : t("join.fail"));
      })
      .finally(() => setBusy(false));
  }, [params, joinGroup, router, triedAuto, t]);

  useEffect(() => {
    if (groupId && triedAuto) router.replace("/group");
  }, [groupId, triedAuto, router]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError("");
    try {
      await joinGroup(code);
      router.replace("/group");
    } catch (err) {
      setError(err instanceof Error ? err.message : t("join.fail"));
    } finally {
      setBusy(false);
    }
  }

  return (
    <AppShell title={t("join.title")} subtitle={t("join.subtitle")}>
      <GlassCard>
        <form onSubmit={onSubmit}>
          <div className="field">
            <label>{t("join.code")}</label>
            <input
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder={t("join.code")}
              autoCapitalize="characters"
            />
          </div>
          {error ? (
            <p className="hint" style={{ color: "var(--accent-deep)" }}>
              {error}
            </p>
          ) : (
            <p className="hint">{t("join.hint")}</p>
          )}
          <Button
            type="submit"
            style={{ width: "100%", marginTop: 12 }}
            disabled={busy || !code.trim()}
          >
            {busy ? t("join.joining") : t("join.join")}
          </Button>
        </form>
      </GlassCard>
    </AppShell>
  );
}

export default function JoinPage() {
  const { t } = useLocale();
  return (
    <Suspense
      fallback={
        <AppShell title={t("join.title")} subtitle={t("loading")}>
          <GlassCard>
            <p className="empty">…</p>
          </GlassCard>
        </AppShell>
      }
    >
      <JoinInner />
    </Suspense>
  );
}
