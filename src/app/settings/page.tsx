"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { AppShell } from "@/components/AppShell";
import { MemberAvatar } from "@/components/MemberAvatar";
import { GlassCard } from "@/components/ui/GlassCard";
import { Button } from "@/components/ui/Button";
import { useApp } from "@/context/AppProvider";
import { useAuth } from "@/context/AuthProvider";
import { useLocale } from "@/context/LocaleProvider";
import { AVATAR_EMOJI_OPTIONS } from "@/lib/avatars";
import type { Locale } from "@/lib/i18n/messages";
import { realTomorrowKey, setAsDateOverride } from "@/lib/demo-data";

type SectionId = "avatar" | "name" | "language" | "nudge" | "local";

const AVATAR_FOLD_KEY = "me-fold-avatar-section";

function markAvatarFoldNextVisit() {
  try {
    sessionStorage.setItem(AVATAR_FOLD_KEY, "1");
  } catch {
    // ignore
  }
}

export default function SettingsPage() {
  const {
    state,
    setNudgeTime,
    setDisplayName,
    setAvatarEmoji,
    setAvatarPhoto,
    clearAvatarPhoto,
  } = useApp();
  const { signOut, user } = useAuth();
  const { t, locale, setLocale } = useLocale();
  const [nameDraft, setNameDraft] = useState(state.settings.displayName);
  const [nameSaved, setNameSaved] = useState(false);
  const [avatarSaved, setAvatarSaved] = useState(false);
  const [avatarError, setAvatarError] = useState("");
  const [uploading, setUploading] = useState(false);
  const [isLocal, setIsLocal] = useState(false);
  const [openSection, setOpenSection] = useState<SectionId | null>(() => {
    try {
      return sessionStorage.getItem(AVATAR_FOLD_KEY) === "1" ? null : "avatar";
    } catch {
      return "avatar";
    }
  });
  const fileRef = useRef<HTMLInputElement>(null);
  const avatarChangedRef = useRef(false);

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

  useEffect(() => {
    return () => {
      if (avatarChangedRef.current) markAvatarFoldNextVisit();
    };
  }, []);

  function flashSaved() {
    setAvatarSaved(true);
    window.setTimeout(() => setAvatarSaved(false), 1400);
  }

  function noteAvatarChanged() {
    avatarChangedRef.current = true;
    markAvatarFoldNextVisit();
  }

  function saveName() {
    const next = nameDraft.trim() || t("settings.defaultName");
    setNameDraft(next);
    setDisplayName(next);
    setNameSaved(true);
    window.setTimeout(() => setNameSaved(false), 1200);
  }

  async function pickEmoji(emoji: string) {
    setAvatarError("");
    try {
      await setAvatarEmoji(emoji);
      noteAvatarChanged();
      flashSaved();
    } catch (e) {
      setAvatarError(
        e instanceof Error ? e.message : t("errors.avatarSaveFail"),
      );
    }
  }

  async function clearEmoji() {
    setAvatarError("");
    try {
      await setAvatarEmoji(null);
      noteAvatarChanged();
      flashSaved();
    } catch (e) {
      setAvatarError(
        e instanceof Error ? e.message : t("errors.avatarSaveFail"),
      );
    }
  }

  async function onPickPhoto(file: File | null) {
    if (!file) return;
    setAvatarError("");
    setUploading(true);
    try {
      await setAvatarPhoto(file);
      noteAvatarChanged();
      flashSaved();
    } catch (e) {
      setAvatarError(
        e instanceof Error ? e.message : t("errors.avatarUploadFail"),
      );
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  }

  async function onClearPhoto() {
    setAvatarError("");
    try {
      await clearAvatarPhoto();
      noteAvatarChanged();
      flashSaved();
    } catch (e) {
      setAvatarError(
        e instanceof Error ? e.message : t("errors.avatarSaveFail"),
      );
    }
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

  const customPhoto =
    typeof me?.avatarUrl === "string" &&
    me.avatarUrl.includes("/storage/v1/object/public/avatars/");

  return (
    <AppShell title={t("settings.title")} subtitle={t("settings.subtitle")}>
      <SettingsSection
        id="avatar"
        title={t("settings.avatar")}
        open={openSection === "avatar"}
        onToggle={() => toggleSection("avatar")}
        expandLabel={t("settings.expandSection")}
        collapseLabel={t("settings.collapseSection")}
        leading={
          <MemberAvatar
            name={state.settings.displayName}
            src={photoUrl}
            emoji={state.settings.avatarEmoji}
            size={28}
          />
        }
      >
        <div className="avatar-picker-preview">
          <MemberAvatar
            name={state.settings.displayName}
            src={photoUrl}
            emoji={state.settings.avatarEmoji}
            size={64}
          />
          <div>
            <p className="tiny" style={{ margin: 0 }}>
              {t("settings.avatarPreview")}
            </p>
            <p className="hint" style={{ margin: "4px 0 0" }}>
              {avatarSaved
                ? t("settings.avatarSaved")
                : t("settings.avatarHint")}
            </p>
          </div>
        </div>

        <input
          ref={fileRef}
          type="file"
          accept="image/jpeg,image/png,image/webp,image/gif"
          hidden
          onChange={(e) => void onPickPhoto(e.target.files?.[0] ?? null)}
        />
        <div className="avatar-photo-actions">
          <Button
            type="button"
            variant="soft"
            style={{ flex: 1 }}
            disabled={uploading}
            onClick={() => fileRef.current?.click()}
          >
            {uploading ? t("settings.avatarUploading") : t("settings.avatarUpload")}
          </Button>
          {customPhoto ? (
            <Button
              type="button"
              variant="ghost"
              style={{ flex: 1 }}
              disabled={uploading}
              onClick={() => void onClearPhoto()}
            >
              {t("settings.avatarClearPhoto")}
            </Button>
          ) : null}
        </div>

        <p className="week-meta-label" style={{ marginTop: 14 }}>
          {t("settings.avatarEmojiLabel")}
        </p>
        <div
          className="emoji-picker"
          role="listbox"
          aria-label={t("settings.avatarEmojiLabel")}
        >
          {AVATAR_EMOJI_OPTIONS.map((emoji) => {
            const selected = state.settings.avatarEmoji === emoji;
            return (
              <button
                key={emoji}
                type="button"
                role="option"
                aria-selected={selected}
                className={`emoji-option ${selected ? "active" : ""}`}
                onClick={() => void pickEmoji(emoji)}
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
            onClick={() => void clearEmoji()}
          >
            {t("settings.avatarClear")}
          </button>
        ) : null}
        {avatarError ? (
          <p
            className="hint"
            style={{ marginTop: 10, color: "var(--accent-deep)" }}
          >
            {avatarError}
          </p>
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
  leading,
  children,
}: {
  id: SectionId;
  title: string;
  open: boolean;
  onToggle: () => void;
  expandLabel: string;
  collapseLabel: string;
  leading?: ReactNode;
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
        <div className="row" style={{ gap: 8, minWidth: 0 }}>
          {leading}
          <p className="pill" style={{ margin: 0 }}>
            {title}
          </p>
        </div>
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
