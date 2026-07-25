import { weekKeyFromDate } from "./dates";
import { createInitialState } from "./demo-data";
import type { AppState, DailyCheck, WeekCapture } from "./types";

const KEY = "weekly-word-state-v5";

export function loadState(): AppState {
  if (typeof window === "undefined") return createInitialState();
  try {
    const raw =
      localStorage.getItem(KEY) ??
      localStorage.getItem("weekly-word-state-v4") ??
      localStorage.getItem("weekly-word-state-v3") ??
      localStorage.getItem("weekly-word-state-v2");
    if (!raw) return createInitialState();
    const parsed = JSON.parse(raw) as Partial<AppState> & {
      capture?: WeekCapture | null;
      checks?: Array<DailyCheck & { weekKey?: string }>;
    };
    const base = createInitialState();
    return migrate(parsed, base);
  } catch {
    return createInitialState();
  }
}

function migrate(
  parsed: Partial<AppState> & {
    capture?: WeekCapture | null;
    checks?: Array<DailyCheck & { weekKey?: string }>;
  },
  base: AppState,
): AppState {
  let weeks = parsed.weeks ?? base.weeks;

  if ((!weeks || weeks.length === 0) && parsed.capture) {
    const c = parsed.capture;
    const weekKey = c.weekKey || weekKeyFromDate(new Date(c.createdAt));
    weeks = [
      {
        ...c,
        id: c.id || crypto.randomUUID(),
        weekKey,
        updatedAt: c.updatedAt || c.createdAt,
      },
    ];
  }

  const checks = (parsed.checks ?? base.checks).map((c) => ({
    ...c,
    weekKey: c.weekKey || weekKeyFromDate(new Date(c.dateKey + "T12:00:00")),
  }));

  const currentWeekKey = weekKeyFromDate();
  const current =
    weeks.find((w) => w.weekKey === currentWeekKey) ?? parsed.capture ?? null;

  return {
    ...base,
    ...parsed,
    weeks,
    checks,
    capture: current,
    settings: { ...base.settings, ...parsed.settings },
    members: parsed.members ?? base.members,
    feedbacks: parsed.feedbacks ?? [],
  };
}

export function saveState(state: AppState) {
  if (typeof window === "undefined") return;
  localStorage.setItem(KEY, JSON.stringify(state));
}

export function getCurrentWeek(state: AppState, now = new Date()) {
  const key = weekKeyFromDate(now);
  return state.weeks.find((w) => w.weekKey === key) ?? null;
}
