"use client";

import { useState } from "react";
import { AppShell } from "@/components/AppShell";
import { GlassCard } from "@/components/ui/GlassCard";
import { Button } from "@/components/ui/Button";
import { useApp } from "@/context/AppProvider";
import { useLocale } from "@/context/LocaleProvider";
import { stripAiDisclaimer } from "@/lib/ai/reply";

export default function QuestionsPage() {
  const { state, addQuestion, askAi, pastorSummary, markPastorSummaryCopied } =
    useApp();
  const { t } = useLocale();
  const [text, setText] = useState("");
  const [anonymous, setAnonymous] = useState(false);
  const [copied, setCopied] = useState(false);
  const [askingId, setAskingId] = useState<string | null>(null);

  const hasAiReply = state.questions.some((q) => q.aiReply);
  const aiUsed = Boolean(state.settings.aiReplyUsedAt);
  const summaryUsed = Boolean(state.settings.pastorSummaryCopiedAt);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!text.trim()) return;
    try {
      await addQuestion(text, anonymous);
      setText("");
    } catch (err) {
      alert(err instanceof Error ? err.message : t("questions.addFail"));
    }
  }

  async function onAskAi(questionId: string) {
    if (aiUsed) return;
    setAskingId(questionId);
    try {
      await askAi(questionId);
    } catch (err) {
      alert(err instanceof Error ? err.message : t("questions.askFail"));
    } finally {
      setAskingId(null);
    }
  }

  async function copySummary() {
    if (summaryUsed) return;
    const summary = pastorSummary();
    try {
      await navigator.clipboard.writeText(summary);
    } catch {
      const ok = window.prompt(t("questions.copyPrompt"), summary);
      if (ok == null) return;
    }
    try {
      await markPastorSummaryCopied();
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      alert(
        err instanceof Error ? err.message : t("errors.pastorSummaryUsed"),
      );
    }
  }

  return (
    <AppShell
      title={t("questions.title")}
      subtitle={t("questions.subtitle")}
    >
      <GlassCard>
        <form onSubmit={onSubmit}>
          <div className="field">
            <label>{t("questions.label")}</label>
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder={t("questions.placeholder")}
            />
          </div>
          <label className="row" style={{ marginBottom: 12, cursor: "pointer" }}>
            <input
              type="checkbox"
              checked={anonymous}
              onChange={(e) => setAnonymous(e.target.checked)}
            />
            <span className="hint">{t("questions.anonymous")}</span>
          </label>
          <Button type="submit" style={{ width: "100%" }} disabled={!text.trim()}>
            {t("questions.submit")}
          </Button>
        </form>
      </GlassCard>

      <GlassCard>
        <div className="row-between">
          <p className="pill">{t("questions.pastorTitle")}</p>
          <Button
            variant="ghost"
            onClick={() => void copySummary()}
            disabled={summaryUsed}
            style={{ padding: "8px 10px" }}
          >
            {summaryUsed
              ? t("questions.copySummaryUsed")
              : copied
                ? t("group.copied")
                : t("questions.copySummary")}
          </Button>
        </div>
        <p className="hint" style={{ marginTop: 8 }}>
          {summaryUsed
            ? t("questions.summaryOnceUsed")
            : t("questions.pastorHint")}
        </p>
      </GlassCard>

      <GlassCard>
        <p className="pill">{t("questions.board")}</p>
        {aiUsed ? (
          <p className="hint" style={{ marginTop: 8 }}>
            {t("questions.aiOnceUsed")}
          </p>
        ) : null}
        <div style={{ marginTop: 8 }}>
          {state.questions.length === 0 ? (
            <p className="empty">{t("questions.empty")}</p>
          ) : (
            state.questions.map((q) => (
              <div key={q.id} className="feed-item">
                <div className="feed-meta">
                  {q.isAnonymous ? t("questions.anonymousName") : q.authorName}
                </div>
                <div style={{ marginBottom: 8 }}>{q.text}</div>
                {q.aiReply ? (
                  <div className="hint" style={{ whiteSpace: "pre-wrap" }}>
                    {stripAiDisclaimer(q.aiReply)}
                  </div>
                ) : (
                  <Button
                    variant="soft"
                    onClick={() => void onAskAi(q.id)}
                    disabled={askingId === q.id || aiUsed}
                    style={{ padding: "8px 12px", fontSize: "0.85rem" }}
                  >
                    {askingId === q.id
                      ? t("questions.askingAi")
                      : t("questions.askAi")}
                  </Button>
                )}
              </div>
            ))
          )}
        </div>
        {hasAiReply ? (
          <div className="disclaimer">{t("questions.aiDisclaimer")}</div>
        ) : null}
      </GlassCard>
    </AppShell>
  );
}
