"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { AppShell } from "@/components/AppShell";
import { GlassCard } from "@/components/ui/GlassCard";
import { Button } from "@/components/ui/Button";
import { useApp } from "@/context/AppProvider";
import { useLocale } from "@/context/LocaleProvider";

function Visibility({ kind }: { kind: "private" | "shared" }) {
  const { t } = useLocale();
  return (
    <span className={`vis-tag ${kind}`}>
      {kind === "private" ? t("capture.private") : t("capture.shared")}
    </span>
  );
}

function formatSavedAt(iso: string, dateLocale: string) {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  return d.toLocaleDateString(dateLocale, {
    year: "numeric",
    month: "long",
    day: "numeric",
    weekday: "short",
  });
}

export default function CapturePage() {
  const { currentWeek, saveCapture } = useApp();
  const { t, dateLocale } = useLocale();
  const router = useRouter();
  const existing = currentWeek;
  const [editing, setEditing] = useState(!existing);

  const [scripture, setScripture] = useState(existing?.scripture ?? "");
  const [briefPoint, setBriefPoint] = useState(existing?.briefPoint ?? "");
  const [firstThought, setFirstThought] = useState(
    existing?.firstThought ?? "",
  );
  const [notes, setNotes] = useState(existing?.notes ?? "");
  const [prayerRequest, setPrayerRequest] = useState(
    existing?.prayerRequest ?? "",
  );
  const [meditationPoint, setMeditationPoint] = useState(
    existing?.meditationPoint ?? "",
  );
  const [practice, setPractice] = useState(existing?.practice ?? "");
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!scripture.trim() || !briefPoint.trim() || !firstThought.trim()) {
      setError(t("capture.required"));
      return;
    }
    setSaving(true);
    setError("");
    try {
      await saveCapture({
        scripture: scripture.trim(),
        briefPoint: briefPoint.trim(),
        firstThought: firstThought.trim(),
        notes: notes.trim() || undefined,
        prayerRequest: prayerRequest.trim() || undefined,
        meditationPoint: meditationPoint.trim() || undefined,
        practice: practice.trim() || undefined,
      });
      setEditing(false);
      router.push("/");
    } catch (err) {
      setError(err instanceof Error ? err.message : t("capture.saveFail"));
    } finally {
      setSaving(false);
    }
  }

  if (existing && !editing) {
    const savedLabel = formatSavedAt(
      existing.updatedAt || existing.createdAt,
      dateLocale,
    );
    return (
      <AppShell title={t("capture.title")} subtitle={t("capture.subtitle")}>
        <GlassCard>
          <Button
            type="button"
            style={{ width: "100%" }}
            onClick={() => setEditing(true)}
          >
            {t("capture.reSave")}
          </Button>
          <div style={{ marginTop: 18 }}>
            <p className="pill">{t("capture.thisWeek")}</p>
            {savedLabel ? (
              <p className="tiny" style={{ margin: "10px 0 8px" }}>
                {t("capture.saved", { date: savedLabel })}
              </p>
            ) : null}
            <h2
              className="word-verse"
              style={{ marginTop: savedLabel ? 0 : 12 }}
            >
              {existing.scripture}
            </h2>
            <p style={{ margin: "0 0 6px", fontWeight: 600 }}>
              {existing.briefPoint}
            </p>
            <p className="hint">{existing.firstThought}</p>
            {existing.meditationPoint ? (
              <p className="hint" style={{ marginTop: 8 }}>
                {t("capture.meditation", { text: existing.meditationPoint })}
              </p>
            ) : null}
            {existing.practice ? (
              <p className="hint" style={{ marginTop: 4 }}>
                {t("capture.practice", { text: existing.practice })}
              </p>
            ) : null}
            {existing.prayerRequest ? (
              <p className="hint" style={{ marginTop: 4 }}>
                {t("capture.prayer", { text: existing.prayerRequest })}
              </p>
            ) : null}
          </div>
        </GlassCard>
      </AppShell>
    );
  }

  return (
    <AppShell title={t("capture.title")} subtitle={t("capture.subtitle")}>
      <GlassCard>
        <form onSubmit={onSubmit}>
          <div className="field">
            <label>
              {t("capture.scripture")} <span className="req">*</span>
            </label>
            <input
              value={scripture}
              onChange={(e) => setScripture(e.target.value)}
              placeholder={t("capture.scripturePh")}
            />
          </div>

          <div className="field">
            <label>
              {t("capture.brief")} <span className="req">*</span>{" "}
              <Visibility kind="private" />
            </label>
            <input
              value={briefPoint}
              onChange={(e) => setBriefPoint(e.target.value)}
              placeholder={t("capture.briefPh")}
            />
          </div>

          <div className="field">
            <label>
              {t("capture.first")} <span className="req">*</span>{" "}
              <Visibility kind="private" />
            </label>
            <textarea
              value={firstThought}
              onChange={(e) => setFirstThought(e.target.value)}
              placeholder={t("capture.firstPh")}
            />
          </div>

          <div className="field">
            <label>
              {t("capture.notes")} <Visibility kind="private" />
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder={t("capture.notesPh")}
            />
          </div>

          <div className="field">
            <label>
              {t("capture.prayerReq")} <Visibility kind="shared" />
            </label>
            <input
              value={prayerRequest}
              onChange={(e) => setPrayerRequest(e.target.value)}
              placeholder={t("capture.prayerPh")}
            />
          </div>

          <div className="field">
            <label>
              {t("capture.medPoint")} <Visibility kind="shared" />
            </label>
            <input
              value={meditationPoint}
              onChange={(e) => setMeditationPoint(e.target.value)}
              placeholder={t("capture.medPh")}
            />
          </div>

          <div className="field">
            <label>
              {t("capture.practiceLabel")} <Visibility kind="shared" />
            </label>
            <input
              value={practice}
              onChange={(e) => setPractice(e.target.value)}
              placeholder={t("capture.practicePh")}
            />
          </div>

          {error ? (
            <p className="hint" style={{ color: "var(--accent-deep)" }}>
              {error}
            </p>
          ) : null}
          <div className="row" style={{ gap: 8, marginTop: 8 }}>
            {existing ? (
              <Button
                type="button"
                variant="soft"
                style={{ flex: 1 }}
                onClick={() => setEditing(false)}
                disabled={saving}
              >
                {t("capture.cancel")}
              </Button>
            ) : null}
            <Button type="submit" style={{ flex: 1 }} disabled={saving}>
              {saving ? t("capture.saving") : t("capture.save")}
            </Button>
          </div>
        </form>
      </GlassCard>
    </AppShell>
  );
}
