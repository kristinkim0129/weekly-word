import { parseDateKey } from "./dates";
import type { DailyCheck, WeekCapture } from "./types";

export function monthKeyFromDate(date = new Date()) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  return `${y}-${m}`;
}

export function yearKeyFromDate(date = new Date()) {
  return String(date.getFullYear());
}

export function weekInMonth(weekKey: string, monthKey: string) {
  const start = parseDateKey(weekKey);
  for (let i = 0; i < 7; i++) {
    const d = new Date(start);
    d.setDate(start.getDate() + i);
    if (monthKeyFromDate(d) === monthKey) return true;
  }
  return false;
}

export function weekInYear(weekKey: string, yearKey: string) {
  return weekKey.startsWith(`${yearKey}-`);
}

export type PeriodSummary = {
  label: string;
  weekCount: number;
  checkCount: number;
  scriptures: string[];
  prayers: string[];
  meditations: string[];
  practices: string[];
};

export function buildPeriodSummary(
  label: string,
  weeks: WeekCapture[],
  checks: DailyCheck[],
): PeriodSummary {
  const weekKeys = new Set(weeks.map((w) => w.weekKey));
  return {
    label,
    weekCount: weeks.length,
    checkCount: checks.filter((c) => weekKeys.has(c.weekKey)).length,
    scriptures: unique(weeks.map((w) => w.scripture).filter(Boolean)),
    prayers: unique(
      weeks.flatMap((w) => splitKeywords(w.prayerRequest)),
    ),
    meditations: unique(
      weeks.map((w) => w.meditationPoint).filter((v): v is string => !!v),
    ),
    practices: unique(
      weeks.map((w) => w.practice).filter((v): v is string => !!v),
    ),
  };
}

function splitKeywords(value?: string) {
  if (!value?.trim()) return [];
  return value
    .split(/[,./·|/]| 및 /)
    .map((s) => s.trim())
    .filter(Boolean);
}

function unique(items: string[]) {
  const seen = new Set<string>();
  const out: string[] = [];
  for (const item of items) {
    const key = item.toLowerCase();
    if (seen.has(key)) continue;
    seen.add(key);
    out.push(item);
  }
  return out;
}

export function formatMonthLabel(monthKey: string) {
  const [y, m] = monthKey.split("-").map(Number);
  return new Date(y, m - 1, 1).toLocaleDateString("ko-KR", {
    year: "numeric",
    month: "long",
  });
}
