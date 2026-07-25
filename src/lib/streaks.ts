import { parseDateKey, toDateKey } from "./dates";
import type { MessageKey } from "./i18n/t";
import type { DailyCheck } from "./types";

export type StreakInfo = {
  /** 오늘(또는 아직 체크 전이면 어제)까지 이어진 연속 일수 */
  current: number;
  /** 역대 가장 길었던 연속 일수 — 배지는 여기 기준이라 한 번 받으면 사라지지 않아요 */
  longest: number;
  /** 지금까지 함께한 총 일수 */
  totalDays: number;
  checkedToday: boolean;
};

export function computeStreak(
  checks: DailyCheck[],
  now = new Date(),
): StreakInfo {
  const days = new Set(checks.map((c) => c.dateKey));
  const totalDays = days.size;
  const checkedToday = days.has(toDateKey(now));

  // 현재 스트릭: 오늘부터(오늘 체크 전이면 어제부터) 거꾸로 세기
  let current = 0;
  const cursor = new Date(now);
  cursor.setHours(12, 0, 0, 0);
  if (!checkedToday) cursor.setDate(cursor.getDate() - 1);
  while (days.has(toDateKey(cursor))) {
    current += 1;
    cursor.setDate(cursor.getDate() - 1);
  }

  // 최장 스트릭
  const sorted = [...days].sort();
  let longest = 0;
  let run = 0;
  let prev: Date | null = null;
  for (const key of sorted) {
    const d = parseDateKey(key);
    if (prev) {
      const diffDays = Math.round(
        (d.getTime() - prev.getTime()) / 86_400_000,
      );
      run = diffDays === 1 ? run + 1 : 1;
    } else {
      run = 1;
    }
    if (run > longest) longest = run;
    prev = d;
  }

  return { current, longest, totalDays, checkedToday };
}

export type Badge = {
  days: number;
  emoji: string;
  nameKey: MessageKey;
};

/** 성장 메타포 — 경쟁이 아니라 자라나는 이야기 */
export const BADGES: Badge[] = [
  { days: 3, emoji: "🌱", nameKey: "streak.badge3" },
  { days: 7, emoji: "🌷", nameKey: "streak.badge7" },
  { days: 14, emoji: "🌿", nameKey: "streak.badge14" },
  { days: 30, emoji: "🌳", nameKey: "streak.badge30" },
  { days: 66, emoji: "⭐", nameKey: "streak.badge66" },
  { days: 100, emoji: "💛", nameKey: "streak.badge100" },
];

/** 한 번 받은 배지는 스트릭이 끊겨도 그대로 남아요. */
export function earnedBadges(longest: number): Badge[] {
  return BADGES.filter((b) => b.days <= longest);
}

export function nextBadge(longest: number): Badge | null {
  return BADGES.find((b) => b.days > longest) ?? null;
}
