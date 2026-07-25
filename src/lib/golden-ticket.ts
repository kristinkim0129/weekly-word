/**
 * 황금티켓 — 초콜릿 속 황금티켓처럼, 랜덤하고 뜸하게 나타나는 말씀 퀴즈.
 * - 오늘 체크를 마친 날에만 하루 한 번 조용히 추첨해요 (당첨 확률 15%).
 * - 한 주에 한 번만 나타나요.
 * - 성공/실패 기록은 어디에도 남기지 않아요. 그냥 재미로!
 */

const PREFIX = "weekly-word-golden-ticket-v1";
const WIN_CHANCE = 0.15;

export type TicketState = {
  weekKey: string;
  /** 이번 주에 이미 추첨해 본 날들 */
  rolledDates: string[];
  /** 티켓이 나타난 날 (null이면 아직) */
  wonDate: string | null;
  /** 퀴즈까지 마쳤는지 */
  done: boolean;
};

function storageKey(userId: string) {
  return `${PREFIX}:${userId}`;
}

function freshTicket(weekKey: string): TicketState {
  return { weekKey, rolledDates: [], wonDate: null, done: false };
}

export function loadTicket(userId: string, weekKey: string): TicketState {
  if (typeof window === "undefined") return freshTicket(weekKey);
  try {
    const raw = localStorage.getItem(storageKey(userId));
    if (!raw) return freshTicket(weekKey);
    const parsed = JSON.parse(raw) as TicketState;
    if (parsed.weekKey !== weekKey) return freshTicket(weekKey);
    return parsed;
  } catch {
    return freshTicket(weekKey);
  }
}

function saveTicket(userId: string, ticket: TicketState) {
  if (typeof window === "undefined") return;
  localStorage.setItem(storageKey(userId), JSON.stringify(ticket));
}

/** 오늘 아직 추첨 전이면 한 번 추첨하고, 최신 상태를 돌려줘요. */
export function rollTicketForToday(
  userId: string,
  weekKey: string,
  dateKey: string,
): TicketState {
  const ticket = loadTicket(userId, weekKey);
  if (ticket.done || ticket.wonDate || ticket.rolledDates.includes(dateKey)) {
    return ticket;
  }
  const next: TicketState = {
    ...ticket,
    rolledDates: [...ticket.rolledDates, dateKey],
    wonDate: Math.random() < WIN_CHANCE ? dateKey : null,
  };
  saveTicket(userId, next);
  return next;
}

export function completeTicket(userId: string, weekKey: string): TicketState {
  const ticket = loadTicket(userId, weekKey);
  const next: TicketState = { ...ticket, done: true };
  saveTicket(userId, next);
  return next;
}
