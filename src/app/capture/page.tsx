"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { AppShell } from "@/components/AppShell";
import { GlassCard } from "@/components/ui/GlassCard";
import { Button } from "@/components/ui/Button";
import { useApp } from "@/context/AppProvider";

function Visibility({ kind }: { kind: "private" | "shared" }) {
  return (
    <span className={`vis-tag ${kind}`}>
      {kind === "private" ? "나한테만 보여요" : "그룹원에게 보여져요"}
    </span>
  );
}

export default function CapturePage() {
  const { currentWeek, saveCapture } = useApp();
  const router = useRouter();
  const existing = currentWeek;

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

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!scripture.trim() || !briefPoint.trim() || !firstThought.trim()) {
      setError("필수 항목을 채워주세요.");
      return;
    }
    saveCapture({
      scripture: scripture.trim(),
      briefPoint: briefPoint.trim(),
      firstThought: firstThought.trim(),
      notes: notes.trim() || undefined,
      prayerRequest: prayerRequest.trim() || undefined,
      meditationPoint: meditationPoint.trim() || undefined,
      practice: practice.trim() || undefined,
    });
    router.push("/");
  }

  return (
    <AppShell
      title="말씀 담기"
      subtitle="일요일에 받은 핵심만 짧게 남겨요."
    >
      <GlassCard>
        <form onSubmit={onSubmit}>
          <div className="field">
            <label>
              성경 본문 <span className="req">*</span>
            </label>
            <input
              value={scripture}
              onChange={(e) => setScripture(e.target.value)}
              placeholder="예: 요한복음 15:1-8"
            />
          </div>

          <div className="field">
            <label>
              핵심 한 줄 <span className="req">*</span>{" "}
              <Visibility kind="private" />
            </label>
            <input
              value={briefPoint}
              onChange={(e) => setBriefPoint(e.target.value)}
              placeholder="설교의 brief point"
            />
          </div>

          <div className="field">
            <label>
              첫 생각 / 떠오른 질문 <span className="req">*</span>{" "}
              <Visibility kind="private" />
            </label>
            <textarea
              value={firstThought}
              onChange={(e) => setFirstThought(e.target.value)}
              placeholder="마음에 떠오른 첫 생각이나 질문"
            />
          </div>

          <div className="field">
            <label>
              필기 노트 (선택) <Visibility kind="private" />
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="자세한 노트는 선택 사항"
            />
          </div>

          <div className="field">
            <label>
              기도 제목 (짧게) <Visibility kind="shared" />
            </label>
            <input
              value={prayerRequest}
              onChange={(e) => setPrayerRequest(e.target.value)}
              placeholder="예: 채용, 인내, 가족"
            />
          </div>

          <div className="field">
            <label>
              묵상 포인트 (짧게) <Visibility kind="shared" />
            </label>
            <input
              value={meditationPoint}
              onChange={(e) => setMeditationPoint(e.target.value)}
              placeholder="그룹과 나눌 짧은 묵상 포인트"
            />
          </div>

          <div className="field">
            <label>
              이번 주 실천 <Visibility kind="shared" />
            </label>
            <input
              value={practice}
              onChange={(e) => setPractice(e.target.value)}
              placeholder="이번 주 지키고 싶은 작은 실천"
            />
          </div>

          {error ? (
            <p className="hint" style={{ color: "var(--accent-deep)" }}>
              {error}
            </p>
          ) : null}
          <Button type="submit" style={{ width: "100%", marginTop: 8 }}>
            이번 주 말씀 저장
          </Button>
        </form>
      </GlassCard>
    </AppShell>
  );
}
