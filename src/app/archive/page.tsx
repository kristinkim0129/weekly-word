"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { AppShell } from "@/components/AppShell";
import { GlassCard } from "@/components/ui/GlassCard";
import { Button } from "@/components/ui/Button";
import { useApp } from "@/context/AppProvider";
import {
  formatDateLabel,
  formatWeekLabel,
  isCurrentWeek,
  weekKeyFromDate,
} from "@/lib/dates";
import { ME_ID, todayKey } from "@/lib/demo-data";
import {
  buildPeriodSummary,
  formatMonthLabel,
  monthKeyFromDate,
  weekInMonth,
  weekInYear,
  yearKeyFromDate,
  type PeriodSummary,
} from "@/lib/summary";
import type { FeedbackKind, WeekCapture } from "@/lib/types";

type Tab = "weeks" | "days" | "month" | "year" | "feedback";

const TABS: { id: Tab; label: string; small?: boolean }[] = [
  { id: "weeks", label: "주간" },
  { id: "days", label: "일간" },
  { id: "month", label: "한달" },
  { id: "year", label: "일년" },
  { id: "feedback", label: "피드백", small: true },
];

export default function ArchivePage() {
  const { state, addFeedback } = useApp();
  const [tab, setTab] = useState<Tab>("weeks");
  const [openWeek, setOpenWeek] = useState<string | null>(null);
  const [feedbackKind, setFeedbackKind] = useState<FeedbackKind>("feedback");
  const [feedbackText, setFeedbackText] = useState("");
  const [savedFlash, setSavedFlash] = useState(false);

  const weeks = useMemo(
    () =>
      [...state.weeks].sort((a, b) => b.weekKey.localeCompare(a.weekKey)),
    [state.weeks],
  );

  const days = useMemo(() => {
    return [...state.checks]
      .sort((a, b) => b.dateKey.localeCompare(a.dateKey))
      .map((check) => {
        const week = state.weeks.find((w) => w.weekKey === check.weekKey);
        const tokensSent = state.tokens.filter(
          (t) => t.fromId === ME_ID && t.dateKey === check.dateKey,
        ).length;
        const tokensReceived = state.tokens.filter(
          (t) => t.toId === ME_ID && t.dateKey === check.dateKey,
        ).length;
        return { check, week, tokensSent, tokensReceived };
      });
  }, [state.checks, state.tokens, state.weeks]);

  const monthKey = monthKeyFromDate();
  const yearKey = yearKeyFromDate();

  const monthSummary = useMemo(() => {
    const monthWeeks = weeks.filter((w) => weekInMonth(w.weekKey, monthKey));
    return buildPeriodSummary(
      formatMonthLabel(monthKey),
      monthWeeks,
      state.checks,
    );
  }, [weeks, state.checks, monthKey]);

  const yearSummary = useMemo(() => {
    const yearWeeks = weeks.filter((w) => weekInYear(w.weekKey, yearKey));
    return buildPeriodSummary(`${yearKey}년`, yearWeeks, state.checks);
  }, [weeks, state.checks, yearKey]);

  function submitFeedback(e: React.FormEvent) {
    e.preventDefault();
    if (!feedbackText.trim()) return;
    addFeedback(feedbackKind, feedbackText);
    setFeedbackText("");
    setSavedFlash(true);
    setTimeout(() => setSavedFlash(false), 1600);
  }

  return (
    <AppShell
      title="보관함"
      subtitle="주간·일간부터 한달·일년 요약까지 돌아봐요."
    >
      <div className="archive-tabs">
        {TABS.map((item) => (
          <button
            key={item.id}
            type="button"
            className={`archive-tab ${tab === item.id ? "active" : ""} ${
              item.small ? "small" : ""
            }`}
            onClick={() => setTab(item.id)}
          >
            {item.label}
          </button>
        ))}
      </div>

      {tab === "weeks" ? (
        <WeeksTab
          weeks={weeks}
          checks={state.checks}
          openWeek={openWeek}
          setOpenWeek={setOpenWeek}
        />
      ) : null}

      {tab === "days" ? <DaysTab days={days} /> : null}

      {tab === "month" ? (
        <SummaryTab
          title="이번 달 돌아보기"
          emptyHint="이번 달 기록이 아직 없어요."
          summary={monthSummary}
        />
      ) : null}

      {tab === "year" ? (
        <SummaryTab
          title="올해 돌아보기"
          emptyHint="올해 기록이 아직 없어요."
          summary={yearSummary}
        />
      ) : null}

      {tab === "feedback" ? (
        <GlassCard>
          <p className="pill">피드백 · 수정사항</p>
          <p className="hint" style={{ margin: "10px 0 12px" }}>
            앱에 대한 가벼운 의견이나 고치고 싶은 점을 남겨주세요.
          </p>
          <form onSubmit={submitFeedback}>
            <div className="feedback-kind-row">
              <button
                type="button"
                className={`feedback-kind ${
                  feedbackKind === "feedback" ? "active" : ""
                }`}
                onClick={() => setFeedbackKind("feedback")}
              >
                피드백
              </button>
              <button
                type="button"
                className={`feedback-kind ${
                  feedbackKind === "fix" ? "active" : ""
                }`}
                onClick={() => setFeedbackKind("fix")}
              >
                수정사항
              </button>
            </div>
            <div className="field" style={{ marginTop: 12 }}>
              <textarea
                value={feedbackText}
                onChange={(e) => setFeedbackText(e.target.value)}
                placeholder={
                  feedbackKind === "feedback"
                    ? "예: 알림 문구가 더 부드러우면 좋겠어요"
                    : "예: 보관함에서 작년 기록도 보고 싶어요"
                }
              />
            </div>
            <Button
              type="submit"
              style={{ width: "100%" }}
              disabled={!feedbackText.trim()}
            >
              {savedFlash ? "저장됐어요" : "남기기"}
            </Button>
          </form>

          <div style={{ marginTop: 16 }}>
            {(state.feedbacks ?? []).length === 0 ? (
              <p className="empty">아직 남긴 메모가 없어요.</p>
            ) : (
              (state.feedbacks ?? []).map((note) => (
                <div key={note.id} className="feed-item">
                  <div className="feed-meta">
                    {note.kind === "feedback" ? "피드백" : "수정사항"} ·{" "}
                    {new Date(note.createdAt).toLocaleDateString("ko-KR", {
                      month: "short",
                      day: "numeric",
                    })}
                  </div>
                  <div>{note.text}</div>
                </div>
              ))
            )}
          </div>
        </GlassCard>
      ) : null}

      {tab !== "feedback" &&
      !weeks.some((w) => w.weekKey === weekKeyFromDate()) ? (
        <GlassCard>
          <p className="hint">이번 주 기록이 아직 없어요.</p>
          <Link href="/capture" style={{ display: "block", marginTop: 10 }}>
            <Button variant="soft" style={{ width: "100%" }}>
              이번 주 담기
            </Button>
          </Link>
        </GlassCard>
      ) : null}
    </AppShell>
  );
}

function WeeksTab({
  weeks,
  checks,
  openWeek,
  setOpenWeek,
}: {
  weeks: WeekCapture[];
  checks: { weekKey: string }[];
  openWeek: string | null;
  setOpenWeek: (key: string | null) => void;
}) {
  if (weeks.length === 0) {
    return (
      <GlassCard>
        <p className="empty">아직 저장된 주간 기록이 없어요.</p>
        <Link href="/capture">
          <Button style={{ width: "100%" }}>이번 주 말씀 담기</Button>
        </Link>
      </GlassCard>
    );
  }

  return (
    <>
      {weeks.map((week) => {
        const open = openWeek === week.weekKey;
        const checksInWeek = checks.filter(
          (c) => c.weekKey === week.weekKey,
        ).length;
        return (
          <GlassCard key={week.id}>
            <button
              type="button"
              className="archive-week-head"
              onClick={() => setOpenWeek(open ? null : week.weekKey)}
            >
              <div>
                <div className="row" style={{ gap: 8, flexWrap: "wrap" }}>
                  {isCurrentWeek(week.weekKey) ? (
                    <span className="pill">이번 주</span>
                  ) : (
                    <span className="pill">지난 주</span>
                  )}
                  <span className="tiny">{checksInWeek}일 체크</span>
                </div>
                <h2 className="word-verse" style={{ marginTop: 10 }}>
                  {week.scripture}
                </h2>
                <p className="hint" style={{ marginTop: 4 }}>
                  {formatWeekLabel(week.weekKey)}
                </p>
              </div>
              <span className="archive-chevron" aria-hidden>
                {open ? "▴" : "▾"}
              </span>
            </button>
            {open ? <WeekDetail week={week} /> : null}
          </GlassCard>
        );
      })}
    </>
  );
}

function DaysTab({
  days,
}: {
  days: {
    check: { dateKey: string; weekKey: string };
    week?: WeekCapture;
    tokensSent: number;
    tokensReceived: number;
  }[];
}) {
  if (days.length === 0) {
    return (
      <GlassCard>
        <p className="empty">아직 일간 체크 로그가 없어요.</p>
        <Link href="/">
          <Button style={{ width: "100%" }}>오늘 기도하고 체크하기</Button>
        </Link>
      </GlassCard>
    );
  }

  return (
    <GlassCard>
      <p className="pill">기도 체크 기록</p>
      <div style={{ marginTop: 8 }}>
        {days.map(({ check, week, tokensSent, tokensReceived }) => (
          <div key={check.dateKey} className="feed-item">
            <div className="row-between">
              <strong>{formatDateLabel(check.dateKey)}</strong>
              <span className="tiny">
                {check.dateKey === todayKey() ? "오늘" : "완료"}
              </span>
            </div>
            <p className="hint" style={{ marginTop: 4 }}>
              {week
                ? `${week.scripture} · ${week.briefPoint}`
                : `${formatWeekLabel(check.weekKey)} 말씀`}
            </p>
            {(tokensSent > 0 || tokensReceived > 0) && (
              <p className="tiny" style={{ marginTop: 4 }}>
                {tokensSent > 0 ? `보낸 기도 ${tokensSent}` : null}
                {tokensSent > 0 && tokensReceived > 0 ? " · " : null}
                {tokensReceived > 0 ? `받은 기도 ${tokensReceived}` : null}
              </p>
            )}
          </div>
        ))}
      </div>
    </GlassCard>
  );
}

function SummaryTab({
  title,
  emptyHint,
  summary,
}: {
  title: string;
  emptyHint: string;
  summary: PeriodSummary;
}) {
  if (summary.weekCount === 0) {
    return (
      <GlassCard>
        <p className="empty">{emptyHint}</p>
        <Link href="/capture">
          <Button style={{ width: "100%" }}>말씀 담기</Button>
        </Link>
      </GlassCard>
    );
  }

  return (
    <>
      <GlassCard>
        <p className="pill">{title}</p>
        <h2 className="word-verse" style={{ marginTop: 12 }}>
          {summary.label}
        </h2>
        <p className="hint" style={{ marginTop: 8 }}>
          주간 기록 {summary.weekCount}개 · 기도 체크 {summary.checkCount}일
        </p>
      </GlassCard>

      <GlassCard>
        <p className="pill">기도 제목 요약</p>
        {summary.prayers.length === 0 ? (
          <p className="empty">공개된 기도 제목이 없어요.</p>
        ) : (
          <div className="keyword-wrap">
            {summary.prayers.map((p) => (
              <span key={p} className="keyword-chip">
                {p}
              </span>
            ))}
          </div>
        )}
      </GlassCard>

      <GlassCard>
        <p className="pill">묵상 요약</p>
        {summary.meditations.length === 0 ? (
          <p className="empty">묵상 포인트가 없어요.</p>
        ) : (
          <div className="stack" style={{ marginTop: 10 }}>
            {summary.meditations.map((m) => (
              <div key={m} className="member-chip">
                <span>{m}</span>
              </div>
            ))}
          </div>
        )}
      </GlassCard>

      {summary.practices.length > 0 ? (
        <GlassCard>
          <p className="pill">실천 모음</p>
          <div className="stack" style={{ marginTop: 10 }}>
            {summary.practices.map((p) => (
              <div key={p} className="member-chip">
                <span>{p}</span>
              </div>
            ))}
          </div>
        </GlassCard>
      ) : null}

      {summary.scriptures.length > 0 ? (
        <GlassCard>
          <p className="pill">본문 모음</p>
          <div className="stack" style={{ marginTop: 10 }}>
            {summary.scriptures.map((s) => (
              <div key={s} className="tiny" style={{ fontWeight: 600 }}>
                {s}
              </div>
            ))}
          </div>
        </GlassCard>
      ) : null}
    </>
  );
}

function WeekDetail({ week }: { week: WeekCapture }) {
  return (
    <div className="archive-detail">
      <p style={{ margin: "0 0 8px", fontWeight: 600 }}>{week.briefPoint}</p>
      <p className="hint">첫 생각: {week.firstThought}</p>
      {week.notes ? (
        <p className="hint" style={{ marginTop: 8 }}>
          노트: {week.notes}
        </p>
      ) : null}
      {week.meditationPoint ? (
        <p className="hint" style={{ marginTop: 8 }}>
          묵상 포인트: {week.meditationPoint}
        </p>
      ) : null}
      {week.practice ? (
        <p className="hint" style={{ marginTop: 4 }}>
          실천: {week.practice}
        </p>
      ) : null}
      {week.prayerRequest ? (
        <p className="hint" style={{ marginTop: 4 }}>
          기도: {week.prayerRequest}
        </p>
      ) : null}
      {isCurrentWeek(week.weekKey) ? (
        <Link href="/capture" style={{ display: "block", marginTop: 12 }}>
          <Button variant="soft" style={{ width: "100%" }}>
            이번 주 수정
          </Button>
        </Link>
      ) : null}
    </div>
  );
}
