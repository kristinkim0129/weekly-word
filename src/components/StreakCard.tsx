"use client";

import { GlassCard } from "@/components/ui/GlassCard";
import { useLocale } from "@/context/LocaleProvider";
import { computeStreak, earnedBadges, nextBadge } from "@/lib/streaks";
import type { DailyCheck } from "@/lib/types";

export function StreakCard({ checks }: { checks: DailyCheck[] }) {
  const { t } = useLocale();
  const streak = computeStreak(checks);

  if (streak.totalDays === 0) return null;

  const badges = earnedBadges(streak.longest);
  const next = nextBadge(streak.longest);

  const headline =
    streak.current >= 2
      ? t("streak.headlineActive", { n: streak.current })
      : streak.current === 1
        ? t("streak.headlineToday")
        : t("streak.headlinePaused");

  return (
    <GlassCard>
      <div className="row-between">
        <p className="pill">{t("streak.pill")}</p>
        <span className="tiny">
          {t("streak.totalDays", { n: streak.totalDays })}
        </span>
      </div>
      <p style={{ margin: "12px 0 0", fontWeight: 700 }}>{headline}</p>
      {badges.length > 0 ? (
        <div className="badge-row">
          {badges.map((b) => (
            <span
              key={b.days}
              className="badge-chip"
              title={t("streak.badgeDays", { n: b.days })}
            >
              <span className="badge-emoji">{b.emoji}</span>
              {t(b.nameKey)}
            </span>
          ))}
        </div>
      ) : null}
      {next ? (
        <p className="tiny" style={{ marginTop: 8 }}>
          {t("streak.nextStory", {
            emoji: next.emoji,
            name: t(next.nameKey),
            n: next.days,
          })}
        </p>
      ) : null}
    </GlassCard>
  );
}
