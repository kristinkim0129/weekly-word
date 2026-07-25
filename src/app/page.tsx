"use client";

import Link from "next/link";
import { AppShell } from "@/components/AppShell";
import { MemberAvatar } from "@/components/MemberAvatar";
import { GlassCard } from "@/components/ui/GlassCard";
import { Button } from "@/components/ui/Button";
import { PrayHandsIcon, TodayPractice } from "@/components/TodayPractice";
import { useApp } from "@/context/AppProvider";
import { useAuth } from "@/context/AuthProvider";
import { useLocale } from "@/context/LocaleProvider";
import { todayKey } from "@/lib/demo-data";
import { computeStreak } from "@/lib/streaks";
import { GoldenTicket } from "@/components/GoldenTicket";

export default function TodayPage() {
  const {
    state,
    currentWeek,
    hasCheckedToday,
    tokensReceivedToday,
    checkedMemberIds,
    groupId,
    checkOffToday,
    sendToken,
  } = useApp();
  const { user } = useAuth();
  const { t, dateLocale } = useLocale();

  const capture = currentWeek;
  const others = state.members.filter((m) => !m.isMe);
  const streak = computeStreak(state.checks);
  const streakLabel =
    streak.current > 0
      ? t("today.streakDays", { n: streak.current })
      : null;
  return (
    <AppShell
      title={t("today.title")}
      subtitle={
        hasCheckedToday ? t("today.subDone") : t("today.subTodo")
      }
      headerRight={
        streakLabel ? (
          <span className="streak-chip" title={t("today.streakTitle")}>
            ✝ {streakLabel}
          </span>
        ) : null
      }
    >
      <GlassCard>
        {capture ? (
          <>
            <div className="row-between" style={{ alignItems: "baseline" }}>
              <p className="pill">{t("today.thisWeek")}</p>
              <p className="tiny" style={{ margin: 0 }}>
                {new Date(
                  capture.updatedAt || capture.createdAt,
                ).toLocaleDateString(dateLocale, {
                  month: "short",
                  day: "numeric",
                })}
              </p>
            </div>
            <p className="week-meta-label" style={{ marginTop: 10 }}>
              {t("today.chapterLabel")}
            </p>
            <p className="word-verse-sm" style={{ marginTop: 4 }}>
              {capture.scripture}
            </p>
            <div className="week-meta">
              <p className="week-meta-label">{t("today.briefLabel")}</p>
              <p style={{ margin: "0 0 10px", fontWeight: 600 }}>
                {capture.briefPoint}
              </p>
              {capture.meditationPoint ? (
                <>
                  <p className="week-meta-label">{t("today.medLabel")}</p>
                  <p className="hint" style={{ margin: "0 0 10px" }}>
                    {capture.meditationPoint}
                  </p>
                </>
              ) : null}
              {capture.practice ? (
                <>
                  <p className="week-meta-label">{t("today.practiceLabel")}</p>
                  <p className="practice-highlight" style={{ marginTop: 0 }}>
                    {capture.practice}
                  </p>
                </>
              ) : null}
            </div>
          </>
        ) : (
          <>
            <p className="empty">{t("today.empty")}</p>
            <Link href="/capture">
              <Button style={{ width: "100%" }}>{t("today.captureCta")}</Button>
            </Link>
          </>
        )}
      </GlassCard>

      {capture ? (
        <GlassCard>
          <TodayPractice capture={capture} />
        </GlassCard>
      ) : null}

      <GlassCard style={{ textAlign: "center" }}>
        <p className="pill">{t("today.dailyPill")}</p>
        <button
          type="button"
          className={`check-orb ${hasCheckedToday ? "done" : ""}`}
          onClick={() => void checkOffToday()}
          disabled={hasCheckedToday}
          aria-label={
            hasCheckedToday ? t("today.ariaDone") : t("today.ariaTodo")
          }
        >
          <span className="check-orb-inner">
            <PrayHandsIcon />
            {hasCheckedToday ? (
              <>
                <span className="check-orb-title">{t("today.checkDone")}</span>
                <span className="check-orb-sub">{t("today.checkDoneSub")}</span>
              </>
            ) : (
              <>
                <span className="check-orb-title">{t("today.checkTodo")}</span>
                <span className="check-orb-sub">{t("today.checkTodoSub")}</span>
              </>
            )}
          </span>
        </button>
        <p className="hint">
          {hasCheckedToday ? t("today.hintDone") : t("today.hintTodo")}
        </p>
      </GlassCard>

      {hasCheckedToday ? (
        <>
          {groupId ? (
            <GlassCard>
              <div className="row-between">
                <p className="pill">{t("today.loveToken")}</p>
                <span className="tiny">{t("today.forEachOther")}</span>
              </div>
              {others.length === 0 ? (
                <p className="empty">{t("today.noMembers")}</p>
              ) : (
                <div className="stack" style={{ marginTop: 12 }}>
                  {others.map((m) => {
                    const done = checkedMemberIds.has(m.id);
                    const sent = state.tokens.some(
                      (tok) =>
                        tok.fromId === user?.id &&
                        tok.toId === m.id &&
                        tok.dateKey === todayKey(),
                    );
                    return (
                      <div key={m.id} className="member-chip">
                        <div style={{ minWidth: 0, flex: 1 }}>
                          <div
                            className="row"
                            style={{ gap: 8, alignItems: "center" }}
                          >
                            <MemberAvatar
                              name={m.name}
                              src={m.avatarUrl}
                              emoji={m.avatarEmoji}
                              size={36}
                            />
                            <span
                              className="check-emoji"
                              title={
                                done ? t("today.doneMed") : t("today.notYet")
                              }
                              aria-label={
                                done ? t("today.doneMed") : t("today.notYet")
                              }
                            >
                              {done ? "🙏✓" : "○"}
                            </span>
                            <strong>{m.name}</strong>
                          </div>
                          <div className="prayer-keywords">
                            {t("today.prayerLabel", {
                              text: m.prayerRequest?.trim() || t("today.none"),
                            })}
                          </div>
                        </div>
                        <Button
                          variant="soft"
                          disabled={sent}
                          onClick={() => void sendToken(m.id)}
                          style={{
                            padding: "10px 12px",
                            fontSize: "0.85rem",
                            flexShrink: 0,
                          }}
                        >
                          {sent ? t("today.sent") : t("today.prayBtn")}
                        </Button>
                      </div>
                    );
                  })}
                </div>
              )}
            </GlassCard>
          ) : null}

          {user ? (
            <GoldenTicket
              userId={user.id}
              hasCheckedToday={hasCheckedToday}
              reference={capture?.scripture ?? null}
            />
          ) : null}

          {tokensReceivedToday.length > 0 ? (
            <GlassCard>
              <p className="pill">{t("today.receivedPrayer")}</p>
              <p style={{ margin: "10px 0 0", fontWeight: 600 }}>
                {t("today.receivedCount", {
                  n: tokensReceivedToday.length,
                })}
              </p>
              <div className="member-chip-grid" style={{ marginTop: 10 }}>
                {tokensReceivedToday.map((tok) => (
                  <div key={tok.id} className="member-chip member-chip-compact">
                    <span className="member-chip-name">{tok.fromName}</span>
                    <span className="tiny">{t("today.prayed")}</span>
                  </div>
                ))}
              </div>
            </GlassCard>
          ) : null}

          <Link href="/archive" className="archive-link-card">
            <GlassCard>
              <div className="row-between">
                <div>
                  <p className="pill">{t("today.archive")}</p>
                  <p className="hint" style={{ marginTop: 8 }}>
                    {t("today.archiveHint")}
                  </p>
                </div>
                <span aria-hidden style={{ color: "var(--accent-deep)" }}>
                  →
                </span>
              </div>
            </GlassCard>
          </Link>
        </>
      ) : null}
    </AppShell>
  );
}
