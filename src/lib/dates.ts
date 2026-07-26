/** 주일(일요일) 시작 주의 키: 그 주 일요일 YYYY-MM-DD */
export function weekKeyFromDate(date = new Date()) {
  const d = new Date(date);
  d.setHours(12, 0, 0, 0);
  const day = d.getDay(); // 0 = Sun
  d.setDate(d.getDate() - day);
  return toDateKey(d);
}

export function toDateKey(date = new Date()) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

export function parseDateKey(key: string) {
  const [y, m, d] = key.split("-").map(Number);
  return new Date(y, m - 1, d, 12);
}

export function formatDateLabel(dateKey: string, locale = "en-US") {
  const d = parseDateKey(dateKey);
  return d.toLocaleDateString(locale, {
    weekday: "short",
    month: "short",
    day: "numeric",
  });
}

/** Weekday only — e.g. Mon / 월 */
export function formatWeekdayOnly(
  isoOrDateKey: string,
  locale = "en-US",
) {
  const d = isoOrDateKey.includes("T")
    ? new Date(isoOrDateKey)
    : parseDateKey(isoOrDateKey);
  if (Number.isNaN(d.getTime())) return "";
  return d.toLocaleDateString(locale, { weekday: "short" });
}

/** 날짜 대신 보여주는 귀여운 상대 이모지 — 오늘✨ 어제🌙 이번 주🌱 이달🍃 그 전🕊 */
export function relativeDayEmoji(dateKey: string, now = new Date()) {
  const today = toDateKey(now);
  if (dateKey === today) return "✨";

  const yesterdayDate = new Date(now);
  yesterdayDate.setHours(12, 0, 0, 0);
  yesterdayDate.setDate(yesterdayDate.getDate() - 1);
  if (dateKey === toDateKey(yesterdayDate)) return "🌙";

  const target = parseDateKey(dateKey);
  if (Number.isNaN(target.getTime())) return "🕊";

  const startOfToday = new Date(now);
  startOfToday.setHours(12, 0, 0, 0);
  const diffDays = Math.round(
    (startOfToday.getTime() - target.getTime()) / (24 * 60 * 60 * 1000),
  );

  if (diffDays >= 0 && diffDays < 7) return "🌱";
  if (diffDays >= 0 && diffDays < 30) return "🍃";
  return "🕊";
}

export function formatWeekLabel(weekKey: string, locale = "en-US") {
  const start = parseDateKey(weekKey);
  const end = new Date(start);
  end.setDate(start.getDate() + 6);
  const startText = start.toLocaleDateString(locale, {
    month: "short",
    day: "numeric",
  });
  const endText = end.toLocaleDateString(locale, {
    month: "short",
    day: "numeric",
  });
  return `${startText} – ${endText}`;
}

export function isCurrentWeek(weekKey: string, now = new Date()) {
  return weekKey === weekKeyFromDate(now);
}
