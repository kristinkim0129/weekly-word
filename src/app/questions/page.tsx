"use client";

import { useState } from "react";
import { AppShell } from "@/components/AppShell";
import { GlassCard } from "@/components/ui/GlassCard";
import { Button } from "@/components/ui/Button";
import { useApp } from "@/context/AppProvider";

export default function QuestionsPage() {
  const { state, addQuestion, askAi, pastorSummary } = useApp();
  const [text, setText] = useState("");
  const [anonymous, setAnonymous] = useState(false);
  const [copied, setCopied] = useState(false);

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!text.trim()) return;
    addQuestion(text, anonymous);
    setText("");
  }

  async function copySummary() {
    const summary = pastorSummary();
    try {
      await navigator.clipboard.writeText(summary);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      window.prompt("복사해서 목사님께 보내세요:", summary);
    }
  }

  return (
    <AppShell
      title="질문 보드"
      subtitle="가볍게 남기고, 필요하면 목사님께 요약해요."
    >
      <GlassCard>
        <form onSubmit={onSubmit}>
          <div className="field">
            <label>질문</label>
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="설교나 말씀에 대해 궁금한 점"
            />
          </div>
          <label className="row" style={{ marginBottom: 12, cursor: "pointer" }}>
            <input
              type="checkbox"
              checked={anonymous}
              onChange={(e) => setAnonymous(e.target.checked)}
            />
            <span className="hint">익명으로 올리기</span>
          </label>
          <Button type="submit" style={{ width: "100%" }} disabled={!text.trim()}>
            질문 올리기
          </Button>
        </form>
      </GlassCard>

      <GlassCard>
        <div className="row-between">
          <p className="pill">목사님께 요약</p>
          <Button variant="ghost" onClick={copySummary} style={{ padding: "8px 10px" }}>
            {copied ? "복사됨" : "요약 복사"}
          </Button>
        </div>
        <p className="hint" style={{ marginTop: 8 }}>
          그룹이 모은 질문을 짧게 정리해 공유할 수 있어요.
        </p>
      </GlassCard>

      <GlassCard>
        <p className="pill">보드</p>
        <div style={{ marginTop: 8 }}>
          {state.questions.length === 0 ? (
            <p className="empty">아직 질문이 없어요.</p>
          ) : (
            state.questions.map((q) => (
              <div key={q.id} className="feed-item">
                <div className="feed-meta">
                  {q.isAnonymous ? "익명" : q.authorName}
                </div>
                <div style={{ marginBottom: 8 }}>{q.text}</div>
                {q.aiReply ? (
                  <>
                    <div className="hint" style={{ whiteSpace: "pre-wrap" }}>
                      {q.aiReply}
                    </div>
                  </>
                ) : (
                  <Button
                    variant="soft"
                    onClick={() => askAi(q.id)}
                    style={{ padding: "8px 12px", fontSize: "0.85rem" }}
                  >
                    AI 간단 답변 보기
                  </Button>
                )}
              </div>
            ))
          )}
        </div>
        <div className="disclaimer">
          AI 답변은 참고용이며, 100% 정확하거나 검증된 성경 해석이 아닙니다.
        </div>
      </GlassCard>
    </AppShell>
  );
}
