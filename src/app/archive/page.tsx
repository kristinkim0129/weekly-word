"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { AppShell } from "@/components/AppShell";
import { GlassCard } from "@/components/ui/GlassCard";
import { Button } from "@/components/ui/Button";
import { useApp } from "@/context/AppProvider";
import { useAuth } from "@/context/AuthProvider";
import { useLocale } from "@/context/LocaleProvider";
import {
  formatDateLabel,
  formatWeekLabel,
  isCurrentWeek,
  toDateKey,
  weekKeyFromDate,
} from "@/lib/dates";
import { todayKey } from "@/lib/demo-data";
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
import type { MessageKey } from "@/lib/i18n/t";

type Tab = "weeks" | "days" | "month" | "year" | "feedback";

const TAB_KEYS: { id: Tab; labelKey: MessageKey; small?: boolean }[] = [
  { id: "weeks", labelKey: "archive.weeks" },
  { id: "days", labelKey: "archive.days" },
  { id: "month", labelKey: "archive.month" },
  { id: "year", labelKey: "archive.year" },
  { id: "feedback", labelKey: "archive.feedback", small: true },
];

export default function ArchivePage() {
  const { state, addFeedback } = useApp();
  const { user } = useAuth();
  const { t, dateLocale } = useLocale();
  const myId = user?.id ?? "";
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
          (tok) => tok.fromId === myId && tok.dateKey === check.dateKey,
        ).length;
        const tokensReceived = state.tokens.filter(
          (tok) => tok.toId === myId && tok.dateKey === check.dateKey,
        ).length;
        const shares = state.cheers
          .filter((c) => {
            if (c.authorId !== myId) return false;
            const created = new Date(c.createdAt);
            if (Number.isNaN(created.getTime())) return false;
            return toDateKey(created) === check.dateKey;
          })
          .map((c) => c.text);
        return { check, week, tokensSent, tokensReceived, shares };
      });
  }, [state.checks, state.tokens, state.weeks, state.cheers, myId]);

  const monthKey = monthKeyFromDate();
  const yearKey = yearKeyFromDate();

  const monthSummary = useMemo(() => {
    const monthWeeks = weeks.filter((w) => weekInMonth(w.weekKey, monthKey));
    return buildPeriodSummary(
      formatMonthLabel(monthKey, dateLocale),
      monthWeeks,
      state.checks,
    );
  }, [weeks, state.checks, monthKey, dateLocale]);

  const yearSummary = useMemo(() => {
    const yearWeeks = weeks.filter((w) => weekInYear(w.weekKey, yearKey));
    return buildPeriodSummary(
      t("archive.yearLabel", { year: yearKey }),
      yearWeeks,
      state.checks,
    );
  }, [weeks, state.checks, yearKey, t]);

  async function submitFeedback(e: React.FormEvent) {
    e.preventDefault();
    if (!feedbackText.trim()) return;
    try {
      await addFeedback(feedbackKind, feedbackText);
      setFeedbackText("");
      setSavedFlash(true);
      setTimeout(() => setSavedFlash(false), 1600);
    } catch (err) {
      alert(err instanceof Error ? err.message : t("archive.saveFail"));
    }
  }

  return (
    <AppShell title={t("archive.title")} subtitle={t("archive.subtitle")}>
      <div className="archive-tabs">
        {TAB_KEYS.map((item) => (
          <button
            key={item.id}
            type="button"
            className={`archive-tab ${tab === item.id ? "active" : ""} ${
              item.small ? "small" : ""
            }`}
            onClick={() => setTab(item.id)}
          >
            {t(item.labelKey)}
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
          title={t("archive.monthReview")}
          emptyHint={t("archive.monthEmpty")}
          summary={monthSummary}
        />
      ) : null}

      {tab === "year" ? (
        <SummaryTab
          title={t("archive.yearReview")}
          emptyHint={t("archive.yearEmpty")}
          summary={yearSummary}
        />
      ) : null}

      {tab === "feedback" ? (
        <GlassCard>
          <p className="pill">{t("archive.feedbackTitle")}</p>
          <p className="hint" style={{ margin: "10px 0 12px" }}>
            {t("archive.feedbackHint")}
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
                {t("archive.feedbackKind")}
              </button>
              <button
                type="button"
                className={`feedback-kind ${
                  feedbackKind === "fix" ? "active" : ""
                }`}
                onClick={() => setFeedbackKind("fix")}
              >
                {t("archive.fixKind")}
              </button>
            </div>
            <div className="field" style={{ marginTop: 12 }}>
              <textarea
                value={feedbackText}
                onChange={(e) => setFeedbackText(e.target.value)}
                placeholder={
                  feedbackKind === "feedback"
                    ? t("archive.feedbackPh")
                    : t("archive.fixPh")
                }
              />
            </div>
            <Button
              type="submit"
              style={{ width: "100%" }}
              disabled={!feedbackText.trim()}
            >
              {savedFlash ? t("archive.saved") : t("archive.submit")}
            </Button>
          </form>
        </GlassCard>
      ) : null}

      {tab !== "feedback" &&
      !weeks.some((w) => w.weekKey === weekKeyFromDate()) ? (
        <GlassCard>
          <p className="hint">{t("archive.noCurrentWeek")}</p>
          <Link href="/capture" style={{ display: "block", marginTop: 10 }}>
            <Button variant="soft" style={{ width: "100%" }}>
              {t("archive.captureCurrentWeek")}
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
  const { t, dateLocale } = useLocale();

  if (weeks.length === 0) {
    return (
      <GlassCard>
        <p className="empty">{t("archive.emptyWeeks")}</p>
        <Link href="/capture">
          <Button style={{ width: "100%" }}>
            {t("archive.captureThisWeek")}
          </Button>
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
                    <span className="pill">{t("archive.thisWeek")}</span>
                  ) : (
                    <span className="pill">{t("archive.pastWeek")}</span>
                  )}
                  <span className="tiny">
                    {t("archive.checksDays", { n: checksInWeek })}
                  </span>
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
    shares: string[];
  }[];
}) {
  const { t } = useLocale();

  if (days.length === 0) {
    return (
      <GlassCard>
        <p className="empty">{t("archive.emptyDays")}</p>
        <Link href="/">
          <Button style={{ width: "100%" }}>
            {t("archive.checkTodayCta")}
          </Button>
        </Link>
      </GlassCard>
    );
  }

  return (
    <GlassCard>
      <p className="pill">{t("archive.checkLog")}</p>
      <div style={{ marginTop: 8 }}>
        {days.map(
          ({ check, week, tokensSent, tokensReceived, shares }) => (
            <div key={check.dateKey} className="feed-item">
              <div className="row-between">
                <strong>
                  {formatDateLabel(check.dateKey, "en-US")}
                </strong>
                <span className="tiny">
                  {check.dateKey === todayKey()
                    ? t("archive.today")
                    : t("archive.done")}
                </span>
              </div>
              <p className="hint" style={{ marginTop: 4 }}>
                {week
                  ? `${week.scripture} · ${week.briefPoint}`
                  : t("archive.weekWord", {
                      week: formatWeekLabel(check.weekKey, "en-US"),
                    })}
              </p>
              {shares.length > 0 ? (
                <div className="archive-day-shares">
                  {shares.map((text, i) => (
                    <p key={`${check.dateKey}-share-${i}`} className="tiny">
                      “{text}”
                    </p>
                  ))}
                </div>
              ) : null}
              {(tokensSent > 0 || tokensReceived > 0) && (
                <p
                  className="archive-day-tokens"
                  aria-label={[
                    tokensSent > 0
                      ? t("archive.prayersSent", { n: tokensSent })
                      : "",
                    tokensReceived > 0
                      ? t("archive.prayersReceived", { n: tokensReceived })
                      : "",
                  ]
                    .filter(Boolean)
                    .join(" · ")}
                >
                  {tokensSent > 0 ? (
                    <span className="archive-token-emojis" title={t("archive.prayersSent", { n: tokensSent })}>
                      {"🕊️".repeat(tokensSent)}
                    </span>
                  ) : null}
                  {tokensSent > 0 && tokensReceived > 0 ? (
                    <span className="archive-token-gap"> </span>
                  ) : null}
                  {tokensReceived > 0 ? (
                    <span className="archive-token-emojis" title={t("archive.prayersReceived", { n: tokensReceived })}>
                      {"💌".repeat(tokensReceived)}
                    </span>
                  ) : null}
                </p>
              )}
            </div>
          ),
        )}
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
  const { t } = useLocale();

  if (summary.weekCount === 0) {
    return (
      <GlassCard>
        <p className="empty">{emptyHint}</p>
        <Link href="/capture">
          <Button style={{ width: "100%" }}>{t("archive.captureWord")}</Button>
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
          {t("archive.periodStats", {
            weeks: summary.weekCount,
            days: summary.checkCount,
          })}
        </p>
      </GlassCard>

      <GlassCard>
        <p className="pill">{t("archive.prayerSummary")}</p>
        {summary.prayers.length === 0 ? (
          <p className="empty">{t("archive.noPrayers")}</p>
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
        <p className="pill">{t("archive.meditationSummary")}</p>
        {summary.meditations.length === 0 ? (
          <p className="empty">{t("archive.noMeditations")}</p>
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
          <p className="pill">{t("archive.practices")}</p>
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
          <p className="pill">{t("archive.scriptures")}</p>
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
  const { t } = useLocale();

  return (
    <div className="archive-detail">
      <p style={{ margin: "0 0 8px", fontWeight: 600 }}>{week.briefPoint}</p>
      <p className="hint">
        {t("archive.firstThought", { text: week.firstThought })}
      </p>
      {week.notes ? (
        <p className="hint" style={{ marginTop: 8 }}>
          {t("archive.notes", { text: week.notes })}
        </p>
      ) : null}
      {week.meditationPoint ? (
        <p className="hint" style={{ marginTop: 8 }}>
          {t("archive.meditation", { text: week.meditationPoint })}
        </p>
      ) : null}
      {week.practice ? (
        <p className="hint" style={{ marginTop: 4 }}>
          {t("archive.practice", { text: week.practice })}
        </p>
      ) : null}
      {week.prayerRequest ? (
        <p className="hint" style={{ marginTop: 4 }}>
          {t("archive.prayer", { text: week.prayerRequest })}
        </p>
      ) : null}
      {isCurrentWeek(week.weekKey) ? (
        <Link href="/capture" style={{ display: "block", marginTop: 12 }}>
          <Button variant="soft" style={{ width: "100%" }}>
            {t("archive.editThisWeek")}
          </Button>
        </Link>
      ) : null}
    </div>
  );
}
