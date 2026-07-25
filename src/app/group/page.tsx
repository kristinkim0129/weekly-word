"use client";

import { useState } from "react";
import Link from "next/link";
import { AppShell } from "@/components/AppShell";
import { PrayerArrows } from "@/components/PrayerArrows";
import { GlassCard } from "@/components/ui/GlassCard";
import { Button } from "@/components/ui/Button";
import { useApp } from "@/context/AppProvider";
import { useAuth } from "@/context/AuthProvider";
import { useLocale } from "@/context/LocaleProvider";
import {
  formatGroupPeriod,
  invitePath,
  MAX_GROUP_MEMBERS,
} from "@/lib/groups";
import { formatWeekdayOnly } from "@/lib/dates";
import type { GroupPeriodPreset } from "@/lib/types";
import type { MessageKey } from "@/lib/i18n/t";

const PERIOD_KEYS: { id: GroupPeriodPreset; labelKey: MessageKey }[] = [
  { id: "h1", labelKey: "group.periodH1" },
  { id: "h2", labelKey: "group.periodH2" },
  { id: "year", labelKey: "group.periodYear" },
  { id: "short", labelKey: "group.periodShort" },
  { id: "custom", labelKey: "group.periodCustom" },
];

export default function GroupPage() {
  const { user } = useAuth();
  const { t } = useLocale();
  const {
    state,
    groupId,
    inviteCode,
    activeGroup,
    pastGroups,
    addCheer,
    createMyGroup,
    joinGroup,
    leaveMyGroup,
    endMyGroupSeason,
  } = useApp();
  const [text, setText] = useState("");
  const [joinCode, setJoinCode] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [mode, setMode] = useState<"idle" | "create" | "join">("idle");
  const [name, setName] = useState("");
  const [preset, setPreset] = useState<GroupPeriodPreset>("h1");
  const [customStart, setCustomStart] = useState("");
  const [customEnd, setCustomEnd] = useState("");
  const [copied, setCopied] = useState(false);
  const [inviteOpen, setInviteOpen] = useState(false);
  const [endingSeason, setEndingSeason] = useState(false);
  const [endConfirmText, setEndConfirmText] = useState("");

  const endPhrase = t("group.endPhrase");

  async function onCheer(e: React.FormEvent) {
    e.preventDefault();
    if (!text.trim()) return;
    setError("");
    try {
      await addCheer(text.slice(0, 80));
      setText("");
    } catch (err) {
      setError(err instanceof Error ? err.message : t("group.shareFail"));
    }
  }

  async function onCreate(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError("");
    try {
      await createMyGroup({
        name: name.trim() || t("group.defaultName"),
        periodPreset: preset,
        startsAt: preset === "custom" ? customStart || undefined : undefined,
        endsAt: preset === "custom" ? customEnd || null : undefined,
        periodLabel:
          preset === "custom"
            ? customStart && customEnd
              ? `${customStart} ~ ${customEnd}`
              : t("group.periodCustom")
            : undefined,
      });
      setMode("idle");
      setName("");
    } catch (err) {
      setError(err instanceof Error ? err.message : t("group.createFail"));
    } finally {
      setBusy(false);
    }
  }

  async function onJoin(e: React.FormEvent) {
    e.preventDefault();
    if (!joinCode.trim()) return;
    setBusy(true);
    setError("");
    try {
      await joinGroup(joinCode);
      setJoinCode("");
      setMode("idle");
    } catch (err) {
      setError(err instanceof Error ? err.message : t("group.joinFail"));
    } finally {
      setBusy(false);
    }
  }

  async function copyInvite() {
    if (!inviteCode) return;
    const url =
      typeof window !== "undefined"
        ? `${window.location.origin}${invitePath(inviteCode)}`
        : invitePath(inviteCode);
    const label = activeGroup?.name ?? t("group.title");
    const payload = t("group.invitePayload", {
      name: label,
      code: inviteCode,
      url,
    });
    try {
      await navigator.clipboard.writeText(payload);
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    } catch {
      alert(payload);
    }
  }

  if (!groupId || !activeGroup) {
    return (
      <AppShell title={t("group.title")} subtitle={t("group.subtitleEmpty")}>
        <GlassCard>
          <p className="hint" style={{ marginBottom: 12 }}>
            {t("group.intro")}
          </p>
          <div className="row" style={{ gap: 8 }}>
            <Button
              type="button"
              style={{ flex: 1 }}
              onClick={() => setMode("create")}
              disabled={busy}
            >
              {t("group.start")}
            </Button>
            <Button
              type="button"
              variant="soft"
              style={{ flex: 1 }}
              onClick={() => setMode("join")}
              disabled={busy}
            >
              {t("group.joinCode")}
            </Button>
          </div>
        </GlassCard>

        {mode === "create" ? (
          <GlassCard>
            <p className="pill">{t("group.newSeason")}</p>
            <form onSubmit={onCreate} style={{ marginTop: 12 }}>
              <div className="field">
                <label>{t("group.name")}</label>
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder={t("group.namePh")}
                  maxLength={24}
                />
              </div>
              <div className="field">
                <label>{t("group.period")}</label>
                <select
                  value={preset}
                  onChange={(e) =>
                    setPreset(e.target.value as GroupPeriodPreset)
                  }
                >
                  {PERIOD_KEYS.map((o) => (
                    <option key={o.id} value={o.id}>
                      {t(o.labelKey)}
                    </option>
                  ))}
                </select>
              </div>
              {preset === "custom" ? (
                <div className="row" style={{ gap: 8 }}>
                  <div className="field" style={{ flex: 1 }}>
                    <label>{t("group.startDate")}</label>
                    <input
                      type="date"
                      value={customStart}
                      onChange={(e) => setCustomStart(e.target.value)}
                      required
                    />
                  </div>
                  <div className="field" style={{ flex: 1 }}>
                    <label>{t("group.endDate")}</label>
                    <input
                      type="date"
                      value={customEnd}
                      onChange={(e) => setCustomEnd(e.target.value)}
                    />
                  </div>
                </div>
              ) : null}
              <Button type="submit" style={{ width: "100%" }} disabled={busy}>
                {busy ? t("group.creating") : t("group.createCta")}
              </Button>
            </form>
          </GlassCard>
        ) : null}

        {mode === "join" ? (
          <GlassCard>
            <p className="pill">{t("group.inviteCode")}</p>
            <form onSubmit={onJoin} style={{ marginTop: 12 }}>
              <div className="field">
                <input
                  value={joinCode}
                  onChange={(e) => setJoinCode(e.target.value)}
                  placeholder="a1b2c3d4"
                  autoCapitalize="characters"
                />
              </div>
              <Button
                type="submit"
                style={{ width: "100%" }}
                disabled={busy || !joinCode.trim()}
              >
                {t("group.join")}
              </Button>
            </form>
          </GlassCard>
        ) : null}

        {pastGroups.length > 0 ? (
          <GlassCard>
            <p className="pill">{t("group.pastSeasons")}</p>
            <p className="hint" style={{ margin: "8px 0 12px" }}>
              {t("group.pastHint")}
            </p>
            {pastGroups.map((g) => (
              <div
                key={g.id}
                className="member-chip"
                style={{ marginBottom: 8 }}
              >
                <div>
                  <strong>{g.name}</strong>
                  <div className="tiny">
                    {formatGroupPeriod(g)}
                    {g.status === "ended"
                      ? ` · ${t("group.ended")}`
                      : ` · ${t("group.left")}`}
                  </div>
                </div>
              </div>
            ))}
          </GlassCard>
        ) : null}

        {error ? (
          <p className="hint" style={{ color: "var(--accent-deep)" }}>
            {error}
          </p>
        ) : null}
      </AppShell>
    );
  }

  return (
    <AppShell
      title={t("group.title")}
      subtitle={`${activeGroup.name} · ${formatGroupPeriod(activeGroup)}`}
      headerRight={
        <button
          type="button"
          className="header-invite-btn"
          onClick={() => setInviteOpen(true)}
        >
          {t("group.invite")}
        </button>
      }
    >
      {inviteOpen ? (
        <div
          className="invite-overlay"
          role="dialog"
          aria-modal="true"
          aria-label={t("group.invite")}
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setInviteOpen(false);
              setEndingSeason(false);
              setEndConfirmText("");
            }
          }}
        >
          <div className="invite-sheet">
            <div className="invite-sheet-head">
              <div>
                <p className="pill">{t("group.invite")}</p>
                <p className="hint" style={{ marginTop: 8 }}>
                  {t("group.membersCount", {
                    name: activeGroup.name,
                    n: state.members.length,
                    max: MAX_GROUP_MEMBERS,
                  })}
                </p>
              </div>
              <button
                type="button"
                className="invite-sheet-close"
                aria-label={t("group.cancel")}
                onClick={() => {
                  setInviteOpen(false);
                  setEndingSeason(false);
                  setEndConfirmText("");
                }}
              >
                ×
              </button>
            </div>

            <div className="row" style={{ flexWrap: "wrap", marginBottom: 12 }}>
              {state.members.map((m) => (
                <span key={m.id} className="pill">
                  {m.name}
                  {m.isMe ? ` · ${t("group.me")}` : ""}
                </span>
              ))}
            </div>

            {inviteCode ? (
              <div
                className="member-chip"
                style={{ alignItems: "center", marginBottom: 4 }}
              >
                <div>
                  <strong>{t("group.inviteCode")}</strong>
                  <div
                    className="tiny"
                    style={{
                      fontFamily: "ui-monospace, monospace",
                      letterSpacing: "0.08em",
                      fontSize: "1.15rem",
                      marginTop: 4,
                    }}
                  >
                    {inviteCode}
                  </div>
                  <div className="tiny" style={{ marginTop: 4 }}>
                    {t("group.inviteHint")}
                  </div>
                </div>
                <Button type="button" variant="soft" onClick={copyInvite}>
                  {copied ? t("group.copied") : t("group.copyLink")}
                </Button>
              </div>
            ) : null}

            <div className="row" style={{ gap: 8, marginTop: 12 }}>
              <button
                type="button"
                className="btn btn-soft"
                style={{ flex: 1 }}
                disabled={busy}
                onClick={async () => {
                  if (!confirm(t("group.leaveConfirm"))) return;
                  setBusy(true);
                  setError("");
                  try {
                    await leaveMyGroup();
                    setInviteOpen(false);
                  } catch (e) {
                    setError(
                      e instanceof Error ? e.message : t("group.leaveFail"),
                    );
                  } finally {
                    setBusy(false);
                  }
                }}
              >
                {t("group.leave")}
              </button>
              {activeGroup.createdBy === user?.id && !endingSeason ? (
                <button
                  type="button"
                  className="btn btn-soft"
                  style={{ flex: 1 }}
                  disabled={busy}
                  onClick={() => {
                    setEndingSeason(true);
                    setEndConfirmText("");
                  }}
                >
                  {t("group.endSeason")}
                </button>
              ) : null}
            </div>

            {endingSeason && activeGroup.createdBy === user?.id ? (
              <div
                style={{
                  marginTop: 12,
                  padding: 12,
                  borderRadius: 14,
                  background: "color-mix(in srgb, var(--ink) 4%, white)",
                  border: "1px solid color-mix(in srgb, var(--ink) 10%, white)",
                }}
              >
                <p className="hint" style={{ margin: "0 0 8px" }}>
                  {t("group.endHint")}
                </p>
                <p
                  className="tiny"
                  style={{
                    margin: "0 0 8px",
                    fontFamily: "ui-monospace, monospace",
                  }}
                >
                  {endPhrase}
                </p>
                <div className="field" style={{ marginBottom: 8 }}>
                  <input
                    value={endConfirmText}
                    onChange={(e) => setEndConfirmText(e.target.value)}
                    placeholder={endPhrase}
                    autoComplete="off"
                  />
                </div>
                <div className="row" style={{ gap: 8 }}>
                  <button
                    type="button"
                    className="btn btn-soft"
                    style={{ flex: 1 }}
                    disabled={busy}
                    onClick={() => {
                      setEndingSeason(false);
                      setEndConfirmText("");
                    }}
                  >
                    {t("group.cancel")}
                  </button>
                  <button
                    type="button"
                    className="btn btn-soft"
                    style={{ flex: 1 }}
                    disabled={busy || endConfirmText !== endPhrase}
                    onClick={async () => {
                      setBusy(true);
                      setError("");
                      try {
                        await endMyGroupSeason();
                        setEndingSeason(false);
                        setEndConfirmText("");
                        setInviteOpen(false);
                      } catch (e) {
                        setError(
                          e instanceof Error ? e.message : t("group.endFail"),
                        );
                      } finally {
                        setBusy(false);
                      }
                    }}
                  >
                    {t("group.endDo")}
                  </button>
                </div>
              </div>
            ) : null}
          </div>
        </div>
      ) : null}

      <GlassCard>
        <p className="pill">{t("group.cheer")}</p>
        <form onSubmit={onCheer} style={{ marginTop: 12 }}>
          <div className="field">
            <input
              value={text}
              onChange={(e) => setText(e.target.value)}
              maxLength={80}
              placeholder={t("group.cheerPh")}
            />
          </div>
          <Button
            type="submit"
            style={{ width: "100%" }}
            disabled={!text.trim()}
          >
            {t("group.share")}
          </Button>
        </form>
        <div style={{ marginTop: 14 }}>
          {state.cheers.length === 0 ? (
            <p className="empty">{t("group.firstCheer")}</p>
          ) : (
            state.cheers.map((c) => (
              <div key={c.id} className="feed-item">
                <div className="feed-meta">
                  {formatWeekdayOnly(c.createdAt)}
                </div>
                <div>{c.text}</div>
              </div>
            ))
          )}
        </div>
      </GlassCard>

      <Link href="/questions" className="archive-link-card">
        <GlassCard>
          <div className="row-between">
            <div>
              <p className="pill">{t("group.questions")}</p>
              <p className="hint" style={{ marginTop: 8 }}>
                {t("group.questionsHint")}
              </p>
            </div>
            <span aria-hidden style={{ color: "var(--accent-deep)" }}>
              →
            </span>
          </div>
        </GlassCard>
      </Link>

      <GlassCard>
        <p className="pill">
          {t("group.prayerLog", { name: activeGroup.name })}
        </p>
        {state.tokens.length === 0 ? (
          <p className="empty" style={{ marginTop: 12 }}>
            {t("group.noPrayers")}
          </p>
        ) : (
          <PrayerArrows tokens={state.tokens} />
        )}
      </GlassCard>

      {error ? (
        <p className="hint" style={{ color: "var(--accent-deep)" }}>
          {error}
        </p>
      ) : null}
    </AppShell>
  );
}
