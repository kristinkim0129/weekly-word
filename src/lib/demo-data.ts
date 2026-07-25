import { toDateKey, weekKeyFromDate } from "./dates";
import type { AppState, WeekCapture } from "./types";
import { DEFAULT_THEME } from "./themes";

export const ME_ID = "me";

function daysAgo(n: number) {
  const d = new Date();
  d.setDate(d.getDate() - n);
  d.setHours(12, 0, 0, 0);
  return d;
}

function makeWeek(
  daysBack: number,
  data: Omit<WeekCapture, "id" | "weekKey" | "createdAt" | "updatedAt">,
): WeekCapture {
  const past = daysAgo(daysBack);
  const weekKey = weekKeyFromDate(past);
  const createdAt = past.toISOString();
  return {
    id: `week-sample-${weekKey}`,
    weekKey,
    createdAt,
    updatedAt: createdAt,
    ...data,
  };
}

/** Local fallback samples — cloud path uses Supabase instead. */
export function createInitialState(): AppState {
  const weeks = [
    makeWeek(7, {
      scripture: "Psalm 23",
      passage:
        "The Lord is my shepherd; I shall not want. He makes me lie down in green pastures. He leads me beside still waters.",
      briefPoint: "The Lord shepherds me — I am not alone",
      firstThought: "바쁠 때도 인도하심을 믿을 수 있을까?",
      notes: "쉼이 부족할 때 떠올린 구절",
      prayerRequest: "쉼, 집중",
      meditationPoint: "lack nothing",
      practice: "점심 전 1분 숨 고르기",
    }),
  ];

  const uniqueWeeks = Object.values(
    Object.fromEntries(weeks.map((w) => [w.weekKey, w])),
  );

  return {
    settings: {
      displayName: "나",
      themeId: DEFAULT_THEME,
      nudgeTime: "08:00",
      groupEnabled: true,
    },
    capture: null,
    weeks: uniqueWeeks,
    checks: [],
    members: [{ id: ME_ID, name: "나", isMe: true }],
    cheers: [],
    tokens: [],
    questions: [],
    feedbacks: [],
  };
}

const AS_DATE_KEY = "ww_as_date";

/** 로컬 테스트용: localStorage `ww_as_date` = YYYY-MM-DD */
export function getAsDateOverride(): string | null {
  if (typeof window === "undefined") return null;
  try {
    return localStorage.getItem(AS_DATE_KEY);
  } catch {
    return null;
  }
}

export function setAsDateOverride(dateKey: string | null) {
  if (typeof window === "undefined") return;
  try {
    if (dateKey) localStorage.setItem(AS_DATE_KEY, dateKey);
    else localStorage.removeItem(AS_DATE_KEY);
  } catch {
    /* ignore */
  }
}

export function todayKey(date = new Date()) {
  const override = getAsDateOverride();
  if (override) return override;
  return toDateKey(date);
}

/** 실제 달력 기준 +1일 (오버라이드 무시) */
export function realTomorrowKey() {
  const d = new Date();
  d.setDate(d.getDate() + 1);
  return toDateKey(d);
}
