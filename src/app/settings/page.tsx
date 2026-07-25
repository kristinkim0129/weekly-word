"use client";

import { useEffect, useState, type ReactNode } from "react";
import { AppShell } from "@/components/AppShell";
import { MemberAvatar } from "@/components/MemberAvatar";
import { GlassCard } from "@/components/ui/GlassCard";
import { Button } from "@/components/ui/Button";
import { useApp } from "@/context/AppProvider";
import { useAuth } from "@/context/AuthProvider";
import { useLocale } from "@/context/LocaleProvider";
import type { Locale } from "@/lib/i18n/messages";
import { realTomorrowKey, setAsDateOverride } from "@/lib/demo-data";

type SectionId = "avatar" | "name" | "language" | "nudge" | "local";

const AVATAR_EMOJI_OPTIONS = [
  "🙏",
  "✝️",
  "🕊️",
  "💛",
  "🌿",
  "✨",
  "🌅",
  "📖",
  "🌾",
  "🌸",
  "🌙",
  "⭐",
  "🌈",
  "🫶",
  "😊",
  "😇",
  "🌱",
  "🔥",
  "💧",
  "🎵",
  "🏡",
  "☀️",
  "🍀",
  "🦋",
] as const;

export default function SettingsPage() {
  const { state, setNudgeTime, setDisplayName, setAvatarEmoji } = useApp();
  const { signOut, user } = useAuth();
  const { t, locale, setLocale } = useLocale();
  const [nameDraft, setNameDraft] = useState(state.settings.displayName);
  const [nameSaved, setNameSaved] = useState(false);
  const [emojiSaved, setEmojiSaved] = useState(false);
  const [isLocal, setIsLocal] = useState(false);
  const [openSection, setOpenSection] = useState<SectionId | null>(null);

  const me = state.members.find((m) => m.isMe);
  const photoUrl =
    me?.avatarUrl ||
    (typeof user?.user_metadata?.avatar_url === "string"
      ? user.user_metadata.avatar_url
      : null) ||
    (typeof user?.user_metadata?.picture === "string"
      ? user.user_metadata.picture
      : null);

  useEffect(() => {
    setNameDraft(state.settings.displayName);
  }, [state.settings.displayName]);

  useEffect(() => {
    const host = window.location.hostname;
    setIsLocal(host === "localhost" || host === "127.0.0.1");
  }, []);

  function saveName() {
    const next = nameDraft.trim() || t("settings.defaultName");
    setNameDraft(next);
    setDisplayName(next);
    setNameSaved(true);
    window.setTimeout(() => setNameSaved(false), 1200);
  }

  function pickEmoji(emoji: string) {
    setAvatarEmoji(emoji);
    setEmojiSaved(true);
    window.setTimeout(() => setEmojiSaved(false), 1200);
  }

  function clearEmoji() {
    setAvatarEmoji(null);
    setEmojiSaved(true);
    window.setTimeout(() => setEmojiSaved(false), 1200);
  }

  async function enableNotifications() {
    if (!("Notification" in window)) {
      alert(t("settings.notifyUnsupported"));
      return;
    }
    const permission = await Notification.requestPermission();
    if (permission === "granted") {
      new Notification(t("brand"), {
        body: t("settings.notifyBody", { time: state.settings.nudgeTime }),
      });
    }
  }

  function toggleSection(id: SectionId) {
    setOpenSection((current) => (current === id ? null : id));
  }

  return (
    <AppShell title={t("settings.title")} subtitle={t("settings.subtitle")}>
      <SettingsSection
        id="avatar"
        title={t("settings.avatar")}
        open={openSection === "avatar"}
        onToggle={() => toggleSection("avatar")}
        expandLabel={t("settings.expandSection")}
        collapseLabel={t("settings.collapseSection")}
      >
        <div className="avatar-picker-preview">
          <MemberAvatar
            name={state.settings.displayName}
            src={photoUrl}
            emoji={state.settings.avatarEmoji}
            size={56}
          />
          <div>
            <p className="tiny" style={{ margin: 0 }}>
              {t("settings.avatarPreview")}
            </p>
            <p className="hint" style={{ margin: "4px 0 0" }}>
              {emojiSaved
                ? t("settings.avatarSaved")
                : t("settings.avatarHint")}
            </p>
          </div>
        </div>
        <div className="emoji-picker" role="listbox" aria-label={t("settings.avatar")}>
          {AVATAR_EMOJI_OPTIONS.map((emoji) => {
            const selected = state.settings.avatarEmoji === emoji;
            return (
              <button
                key={emoji}
                type="button"
                role="option"
                aria-selected={selected}
                className={`emoji-option ${selected ? "active" : ""}`}
                onClick={() => pickEmoji(emoji)}
              >
                {emoji}
              </button>
            );
          })}
        </div>
        {state.settings.avatarEmoji ? (
          <button
            type="button"
            className="btn btn-soft"
            style={{ width: "100%", marginTop: 10 }}
            onClick={clearEmoji}
          >
            {t("settings.avatarClear")}
          </button>
        ) : null}
      </SettingsSection>

      <SettingsSection
        id="name"
        title={t("settings.name")}
        open={openSection === "name"}
        onToggle={() => toggleSection("name")}
        expandLabel={t("settings.expandSection")}
        collapseLabel={t("settings.collapseSection")}
      >
        <div className="field">
          <label htmlFor="settings-name">{t("settings.name")}</label>
          <input
            id="settings-name"
            value={nameDraft}
            onChange={(e) => setNameDraft(e.target.value)}
            onBlur={saveName}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.currentTarget.blur();
              }
            }}
            placeholder={t("settings.namePh")}
            maxLength={24}
          />
        </div>
        <p className="tiny" style={{ marginTop: 4 }}>
          {nameSaved
            ? t("settings.nameSaved")
            : user?.email
              ? user.email
              : t("settings.nameHint")}
        </p>
      </SettingsSection>

      <SettingsSection
        id="language"
        title={t("settings.language")}
        open={openSection === "language"}
        onToggle={() => toggleSection("language")}
        expandLabel={t("settings.expandSection")}
        collapseLabel={t("settings.collapseSection")}
      >
        <div className="lang-options">
          {(
            [
              { id: "ko" as Locale, label: t("lang.ko") },
              { id: "en" as Locale, label: t("lang.en") },
            ] as const
          ).map((opt) => (
            <button
              key={opt.id}
              type="button"
              className={`lang-option ${locale === opt.id ? "active" : ""}`}
              onClick={() => setLocale(opt.id)}
            >
              <span className="lang-option-label">{opt.label}</span>
            </button>
          ))}
        </div>
        <p className="hint" style={{ marginTop: 10 }}>
          {t("settings.languageHint")}
        </p>
      </SettingsSection>

      <SettingsSection
        id="nudge"
        title={t("settings.nudge")}
        open={openSection === "nudge"}
        onToggle={() => toggleSection("nudge")}
        expandLabel={t("settings.expandSection")}
        collapseLabel={t("settings.collapseSection")}
      >
        <div className="field">
          <label htmlFor="settings-nudge-time">{t("settings.nudgeTime")}</label>
          <input
            id="settings-nudge-time"
            type="time"
            value={state.settings.nudgeTime}
            onChange={(e) => setNudgeTime(e.target.value)}
          />
        </div>
        <button
          type="button"
          className="btn btn-soft"
          style={{ width: "100%" }}
          onClick={enableNotifications}
        >
          {t("settings.notifyAllow")}
        </button>
        <p className="hint" style={{ marginTop: 10 }}>
          {t("settings.notifyHint")}
        </p>
      </SettingsSection>

      <GlassCard>
        <Button
          variant="ghost"
          style={{ width: "100%" }}
          onClick={() => void signOut()}
        >
          {t("settings.signOut")}
        </Button>
      </GlassCard>

      {isLocal ? (
        <SettingsSection
          id="local"
          title={t("settings.localTest")}
          open={openSection === "local"}
          onToggle={() => toggleSection("local")}
          expandLabel={t("settings.expandSection")}
          collapseLabel={t("settings.collapseSection")}
        >
          <p className="hint" style={{ margin: "0 0 12px" }}>
            {t("settings.localHint")}
          </p>
          <Button
            type="button"
            style={{ width: "100%", marginBottom: 8 }}
            onClick={() => {
              setAsDateOverride(realTomorrowKey());
              window.location.href = "/";
            }}
          >
            {t("settings.nextDay")}
          </Button>
          <Button
            type="button"
            variant="soft"
            style={{ width: "100%" }}
            onClick={() => {
              setAsDateOverride(null);
              window.location.href = "/";
            }}
          >
            {t("settings.todayReset")}
          </Button>
        </SettingsSection>
      ) : null}
    </AppShell>
  );
}

function SettingsSection({
  id,
  title,
  open,
  onToggle,
  expandLabel,
  collapseLabel,
  children,
}: {
  id: SectionId;
  title: string;
  open: boolean;
  onToggle: () => void;
  expandLabel: string;
  collapseLabel: string;
  children: ReactNode;
}) {
  const panelId = `settings-section-${id}`;

  return (
    <GlassCard>
      <button
        type="button"
        className="archive-week-head"
        aria-expanded={open}
        aria-controls={panelId}
        aria-label={`${title}. ${open ? collapseLabel : expandLabel}`}
        onClick={onToggle}
      >
        <p className="pill">{title}</p>
        <span className="archive-chevron" aria-hidden>
          {open ? "▴" : "▾"}
        </span>
      </button>
      {open ? (
        <div id={panelId} className="archive-detail">
          {children}
        </div>
      ) : null}
    </GlassCard>
  );
}
