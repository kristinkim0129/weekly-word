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

export function formatDateLabel(dateKey: string) {
  const d = parseDateKey(dateKey);
  return d.toLocaleDateString("ko-KR", {
    month: "long",
    day: "numeric",
    weekday: "short",
  });
}

export function formatWeekLabel(weekKey: string) {
  const start = parseDateKey(weekKey);
  const end = new Date(start);
  end.setDate(start.getDate() + 6);
  const startText = start.toLocaleDateString("ko-KR", {
    month: "long",
    day: "numeric",
  });
  const endText = end.toLocaleDateString("ko-KR", {
    month: "long",
    day: "numeric",
  });
  return `${startText} – ${endText}`;
}

export function isCurrentWeek(weekKey: string, now = new Date()) {
  return weekKey === weekKeyFromDate(now);
}
