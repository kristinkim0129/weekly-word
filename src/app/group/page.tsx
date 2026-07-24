"use client";

import { useState } from "react";
import Link from "next/link";
import { AppShell } from "@/components/AppShell";
import { GlassCard } from "@/components/ui/GlassCard";
import { Button } from "@/components/ui/Button";
import { useApp } from "@/context/AppProvider";

export default function GroupPage() {
  const { state, addCheer, uploadHandout } = useApp();
  const [text, setText] = useState("");
  const [uploading, setUploading] = useState(false);

  async function onFile(file: File | undefined) {
    if (!file) return;
    setUploading(true);
    try {
      await uploadHandout(file);
    } finally {
      setUploading(false);
    }
  }

  function onCheer(e: React.FormEvent) {
    e.preventDefault();
    if (!text.trim()) return;
    addCheer(text.slice(0, 80));
    setText("");
  }

  if (!state.settings.groupEnabled) {
    return (
      <AppShell title="함께" subtitle="소그룹 모드가 꺼져 있어요.">
        <GlassCard>
          <p className="empty">설정에서 소그룹을 켜면 여기에 피드가 열립니다.</p>
        </GlassCard>
      </AppShell>
    );
  }

  return (
    <AppShell
      title="함께"
      subtitle="최대 5명 · 한 줄로 응원하고 웃어요."
    >
      <Link href="/questions" className="archive-link-card">
        <GlassCard>
          <div className="row-between">
            <div>
              <p className="pill">질문 보드</p>
              <p className="hint" style={{ marginTop: 8 }}>
                익명/이름 질문 · AI 참고 답변 · 목사님 요약
              </p>
            </div>
            <span aria-hidden style={{ color: "var(--accent-deep)" }}>
              →
            </span>
          </div>
        </GlassCard>
      </Link>

      <GlassCard>
        <div className="row-between">
          <p className="pill">우리 그룹</p>
          <span className="tiny">{state.members.length}/5</span>
        </div>
        <div className="row" style={{ flexWrap: "wrap", marginTop: 12 }}>
          {state.members.map((m) => (
            <span key={m.id} className="pill">
              {m.name}
              {m.isMe ? " · 나" : ""}
            </span>
          ))}
        </div>
      </GlassCard>

      <GlassCard>
        <p className="pill">설교 핸드아웃</p>
        <p className="hint" style={{ margin: "10px 0 12px" }}>
          그룹원이 목사님 자료(PDF / Word / 이미지)를 올려요.
        </p>
        {state.handout ? (
          <div className="member-chip" style={{ marginBottom: 12 }}>
            <div>
              <strong>{state.handout.name}</strong>
              <div className="tiny">
                {state.handout.uploadedBy} ·{" "}
                {Math.round(state.handout.size / 1024)}KB
              </div>
            </div>
            {state.handout.dataUrl ? (
              <a
                href={state.handout.dataUrl}
                target="_blank"
                rel="noreferrer"
                className="tiny"
                style={{ color: "var(--accent-deep)", fontWeight: 700 }}
              >
                보기
              </a>
            ) : (
              <span className="tiny">저장됨</span>
            )}
          </div>
        ) : (
          <p className="empty">아직 업로드된 핸드아웃이 없어요.</p>
        )}
        <label className="btn btn-soft" style={{ display: "block", textAlign: "center" }}>
          {uploading ? "올리는 중…" : "핸드아웃 업로드"}
          <input
            type="file"
            accept=".pdf,.doc,.docx,image/*"
            hidden
            disabled={uploading}
            onChange={(e) => onFile(e.target.files?.[0])}
          />
        </label>
      </GlassCard>

      <GlassCard>
        <p className="pill">한 줄 나눔</p>
        <form onSubmit={onCheer} style={{ marginTop: 12 }}>
          <div className="field">
            <input
              value={text}
              onChange={(e) => setText(e.target.value)}
              maxLength={80}
              placeholder="오늘 한 문장 간증이나 생각"
            />
          </div>
          <Button type="submit" style={{ width: "100%" }} disabled={!text.trim()}>
            공유하기
          </Button>
        </form>
        <div style={{ marginTop: 14 }}>
          {state.cheers.length === 0 ? (
            <p className="empty">첫 한 줄을 남겨보세요.</p>
          ) : (
            state.cheers.map((c) => (
              <div key={c.id} className="feed-item">
                <div className="feed-meta">{c.authorName}</div>
                <div>{c.text}</div>
              </div>
            ))
          )}
        </div>
      </GlassCard>
    </AppShell>
  );
}
