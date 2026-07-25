"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { useApp } from "@/context/AppProvider";
import { useLocale } from "@/context/LocaleProvider";
import type { MessageKey } from "@/lib/i18n/t";
import type { WeekCapture } from "@/lib/types";

type Segment = "read" | "reflect" | "share";

const CHEER_MAX = 80;

const SEGMENTS: {
  id: Segment;
  labelKey: MessageKey;
  minKey: MessageKey;
}[] = [
  { id: "read", labelKey: "today.read", minKey: "today.readMin" },
  { id: "reflect", labelKey: "today.reflect", minKey: "today.reflectMin" },
  { id: "share", labelKey: "today.oneLine", minKey: "today.oneLineMin" },
];

export function TodayPractice({ capture }: { capture: WeekCapture }) {
  const { t } = useLocale();
  const { saveCapture, addCheer, groupId } = useApp();
  const [segment, setSegment] = useState<Segment>("read");
  const [notesEdit, setNotesEdit] = useState<{
    updatedAt: string;
    text: string;
  } | null>(null);
  const [notesSaving, setNotesSaving] = useState(false);
  const [notesMsg, setNotesMsg] = useState("");
  const [shareText, setShareText] = useState("");
  const [shareBusy, setShareBusy] = useState(false);
  const [shareMsg, setShareMsg] = useState("");
  const [shareErr, setShareErr] = useState("");

  const notesDraft =
    notesEdit && notesEdit.updatedAt === capture.updatedAt
      ? notesEdit.text
      : (capture.notes ?? "");

  const passageText = capture.passage?.trim() ?? "";

  async function saveNotes() {
    setNotesSaving(true);
    setNotesMsg("");
    try {
      await saveCapture({
        scripture: capture.scripture,
        passage: capture.passage,
        briefPoint: capture.briefPoint,
        firstThought: capture.firstThought,
        notes: notesDraft.trim() || undefined,
        prayerRequest: capture.prayerRequest,
        meditationPoint: capture.meditationPoint,
        practice: capture.practice,
      });
      setNotesMsg(t("today.reflectSaved"));
    } catch (err) {
      setNotesMsg(
        err instanceof Error ? err.message : t("capture.saveFail"),
      );
    } finally {
      setNotesSaving(false);
    }
  }

  async function submitShare(e: React.FormEvent) {
    e.preventDefault();
    const text = shareText.trim().slice(0, CHEER_MAX);
    if (!text) return;
    if (!groupId) {
      setShareErr(t("today.shareNoGroup"));
      return;
    }
    setShareBusy(true);
    setShareErr("");
    setShareMsg("");
    try {
      await addCheer(text);
      setShareText("");
      setShareMsg(t("today.sharePosted"));
    } catch (err) {
      setShareErr(
        err instanceof Error ? err.message : t("group.shareFail"),
      );
    } finally {
      setShareBusy(false);
    }
  }

  return (
    <div className="today-practice">
      <div className="segment-bar" role="tablist" aria-label={t("today.flowAria")}>
        {SEGMENTS.map(({ id, labelKey, minKey }) => (
          <button
            key={id}
            type="button"
            role="tab"
            aria-selected={segment === id}
            className={`segment-btn ${segment === id ? "active" : ""}`}
            onClick={() => setSegment(id)}
          >
            <span>{t(labelKey)}</span>
            <span className="segment-min">{t(minKey)}</span>
          </button>
        ))}
      </div>

      <div className="today-practice-panel" role="tabpanel">
        {segment === "read" ? (
          <>
            <p className="week-meta-label" style={{ marginTop: 0 }}>
              {t("today.readChapterLabel")}
            </p>
            <p className="word-verse-sm" style={{ marginTop: 4 }}>
              {capture.scripture}
            </p>
            {passageText ? (
              <p className="today-verse-text">{passageText}</p>
            ) : (
              <div>
                <p className="empty" style={{ padding: "4px 0 10px" }}>
                  {t("today.readEmpty")}
                </p>
                <Link href="/capture">
                  <Button variant="soft" style={{ width: "100%" }}>
                    {t("today.readAddPassage")}
                  </Button>
                </Link>
              </div>
            )}
          </>
        ) : null}

        {segment === "reflect" ? (
          <>
            <p className="hint" style={{ marginTop: 0 }}>
              {t("today.reflectHint")}
            </p>
            <textarea
              className="today-reflect-input"
              value={notesDraft}
              onChange={(e) =>
                setNotesEdit({
                  updatedAt: capture.updatedAt,
                  text: e.target.value,
                })
              }
              placeholder={t("capture.notesPh")}
              rows={5}
            />
            <Button
              type="button"
              style={{ width: "100%", marginTop: 10 }}
              disabled={notesSaving}
              onClick={() => void saveNotes()}
            >
              {notesSaving ? t("capture.saving") : t("today.reflectSave")}
            </Button>
            {notesMsg ? (
              <p className="hint" style={{ marginTop: 8 }}>
                {notesMsg}
              </p>
            ) : null}
          </>
        ) : null}

        {segment === "share" ? (
          <>
            <p className="hint" style={{ marginTop: 0 }}>
              {t("today.oneLineHint")}
            </p>
            {!groupId ? (
              <div>
                <p className="empty" style={{ padding: "4px 0 10px" }}>
                  {t("today.shareNoGroup")}
                </p>
                <Link href="/group">
                  <Button variant="soft" style={{ width: "100%" }}>
                    {t("today.shareJoinCta")}
                  </Button>
                </Link>
              </div>
            ) : (
              <form onSubmit={(e) => void submitShare(e)}>
                <textarea
                  className="today-share-input"
                  value={shareText}
                  onChange={(e) =>
                    setShareText(e.target.value.slice(0, CHEER_MAX))
                  }
                  placeholder={t("group.cheerPh")}
                  rows={3}
                  maxLength={CHEER_MAX}
                />
                <div className="row-between" style={{ marginTop: 6 }}>
                  <span className="tiny">
                    {shareText.length}/{CHEER_MAX}
                  </span>
                </div>
                <Button
                  type="submit"
                  style={{ width: "100%", marginTop: 8 }}
                  disabled={shareBusy || !shareText.trim()}
                >
                  {shareBusy ? t("today.sharePosting") : t("today.oneLineSubmit")}
                </Button>
                {shareMsg ? (
                  <p className="hint" style={{ marginTop: 8 }}>
                    {shareMsg}
                  </p>
                ) : null}
                {shareErr ? (
                  <p
                    className="hint"
                    style={{ marginTop: 8, color: "var(--accent-deep)" }}
                  >
                    {shareErr}
                  </p>
                ) : null}
              </form>
            )}
          </>
        ) : null}
      </div>
    </div>
  );
}

function PrayHandsIcon() {
  return (
    <svg
      className="check-orb-icon"
      viewBox="0 0 64 64"
      width="36"
      height="36"
      aria-hidden
    >
      <path
        fill="currentColor"
        d="M28.2 10.5c-1.6 0-2.9 1.2-3.1 2.8l-2.4 22.4c-.4 3.4-2.4 6.3-5.3 8.1l-3.2 1.9c-.9.5-1.2 1.7-.6 2.6l1.6 2.4c.5.8 1.6 1 2.4.5l4.1-2.5c4.3-2.6 7.2-7 7.8-12l2.1-18.8c.2-1.8-1.1-3.4-2.9-3.4h-.5zm7.6 0h-.5c-1.8 0-3.1 1.6-2.9 3.4l2.1 18.8c.6 5 3.5 9.4 7.8 12l4.1 2.5c.8.5 1.9.3 2.4-.5l1.6-2.4c.6-.9.3-2.1-.6-2.6l-3.2-1.9c-2.9-1.8-4.9-4.7-5.3-8.1l-2.4-22.4c-.2-1.6-1.5-2.8-3.1-2.8zM24 48.5c-.8 0-1.5.6-1.6 1.4l-.4 3.2c-.2 1.4.9 2.7 2.3 2.7h15.4c1.4 0 2.5-1.3 2.3-2.7l-.4-3.2c-.1-.8-.8-1.4-1.6-1.4H24z"
      />
    </svg>
  );
}

export { PrayHandsIcon };
