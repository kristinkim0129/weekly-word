"use client";

import Link from "next/link";
import { AppShell } from "@/components/AppShell";
import { GlassCard } from "@/components/ui/GlassCard";
import { Button } from "@/components/ui/Button";
import { useApp } from "@/context/AppProvider";
import { todayKey } from "@/lib/demo-data";

export default function TodayPage() {
  const {
    state,
    currentWeek,
    hasCheckedToday,
    tokensReceivedToday,
    unfinishedMembers,
    checkOffToday,
    sendToken,
  } = useApp();

  const capture = currentWeek;
  const canSendTokens =
    hasCheckedToday && state.settings.groupEnabled && unfinishedMembers.length > 0;

  return (
    <AppShell
      title="오늘의 말씀"
      subtitle="기도하고, 체크하고, 가볍게 연결해요."
    >
      <GlassCard>
        {capture ? (
          <>
            <p className="pill">이번 주 말씀</p>
            <h2 className="word-verse" style={{ marginTop: 12 }}>
              {capture.scripture}
            </h2>
            <p style={{ margin: "0 0 8px", fontWeight: 600 }}>
              {capture.briefPoint}
            </p>
            <p className="hint">첫 생각: {capture.firstThought}</p>
            {capture.meditationPoint ? (
              <p className="hint" style={{ marginTop: 8 }}>
                묵상 포인트: {capture.meditationPoint}
              </p>
            ) : null}
            {capture.practice ? (
              <p className="hint" style={{ marginTop: 4 }}>
                이번 주 실천: {capture.practice}
              </p>
            ) : null}
            {capture.prayerRequest ? (
              <p className="hint" style={{ marginTop: 4 }}>
                기도 제목: {capture.prayerRequest}
              </p>
            ) : null}
          </>
        ) : (
          <>
            <p className="empty">아직 이번 주 기록이 없어요.</p>
            <Link href="/capture">
              <Button style={{ width: "100%" }}>일요일 말씀 담기</Button>
            </Link>
          </>
        )}
      </GlassCard>

      <GlassCard style={{ textAlign: "center" }}>
        <p className="pill">하루 한 번 · 부담 없이</p>
        <button
          type="button"
          className={`check-orb ${hasCheckedToday ? "done" : ""}`}
          onClick={checkOffToday}
          disabled={hasCheckedToday}
          aria-label={hasCheckedToday ? "오늘 완료됨" : "기도 완료 체크"}
        >
          {hasCheckedToday ? (
            <>
              완료
              <br />
              <span style={{ fontSize: "0.85rem" }}>잘했어요</span>
            </>
          ) : (
            <>
              기도하고
              <br />
              체크
            </>
          )}
        </button>
        <p className="hint">
          {hasCheckedToday
            ? "오늘 묵상을 마쳤어요. 친구에게 사랑의 토큰을 보낼 수 있어요."
            : "푸시 시간에 기도한 뒤, 여기만 눌러주세요."}
        </p>
      </GlassCard>

      {tokensReceivedToday.length > 0 ? (
        <GlassCard>
          <p className="pill">받은 기도</p>
          <p style={{ margin: "10px 0 0", fontWeight: 600 }}>
            오늘 {tokensReceivedToday.length}명이 당신을 위해 기도했어요
          </p>
          <div className="stack" style={{ marginTop: 10 }}>
            {tokensReceivedToday.map((t) => (
              <div key={t.id} className="member-chip">
                <span>{t.fromName}</span>
                <span className="tiny">기도했어 ♡</span>
              </div>
            ))}
          </div>
        </GlassCard>
      ) : null}

      {state.settings.groupEnabled ? (
        <GlassCard>
          <div className="row-between">
            <p className="pill">사랑의 토큰</p>
            <span className="tiny">완료한 사람만 보낼 수 있어요</span>
          </div>
          {!hasCheckedToday ? (
            <p className="empty">먼저 오늘의 체크를 끝내면 보낼 수 있어요.</p>
          ) : unfinishedMembers.length === 0 ? (
            <p className="empty">모두 체크를 끝냈어요!</p>
          ) : (
            <div className="stack" style={{ marginTop: 12 }}>
              {unfinishedMembers.map((m) => {
                const sent = state.tokens.some(
                  (t) =>
                    t.fromId === "me" &&
                    t.toId === m.id &&
                    t.dateKey === todayKey(),
                );
                return (
                  <div key={m.id} className="member-chip">
                    <div style={{ minWidth: 0, flex: 1 }}>
                      <strong>{m.name}</strong>
                      <div className="tiny">아직 체크 전</div>
                      {m.prayerRequest ? (
                        <div className="prayer-keywords">
                          기도 · {m.prayerRequest}
                        </div>
                      ) : (
                        <div className="tiny">기도 제목 없음</div>
                      )}
                    </div>
                    <Button
                      variant="soft"
                      disabled={!canSendTokens || sent}
                      onClick={() => sendToken(m.id)}
                      style={{
                        padding: "10px 12px",
                        fontSize: "0.85rem",
                        flexShrink: 0,
                      }}
                    >
                      {sent ? "보냄" : "기도했어"}
                    </Button>
                  </div>
                );
              })}
            </div>
          )}
        </GlassCard>
        ) : null}

      <Link href="/archive" className="archive-link-card">
        <GlassCard>
          <div className="row-between">
            <div>
              <p className="pill">보관함</p>
              <p className="hint" style={{ marginTop: 8 }}>
                지난 주 말씀과 매일 체크 기록을 돌아봐요
              </p>
            </div>
            <span aria-hidden style={{ color: "var(--accent-deep)" }}>
              →
            </span>
          </div>
        </GlassCard>
      </Link>
    </AppShell>
  );
}
