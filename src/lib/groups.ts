import { translate } from "./i18n/t";
import { getStoredLocale } from "./i18n/locale";
import type { Locale } from "./i18n/messages";
import type { GroupPeriodPreset } from "./types";

export const MAX_GROUP_MEMBERS = 8;

/** Display invite codes in readable chunks (e.g. ab12cd34 → AB12  CD34). */
export function formatInviteCode(code: string): string {
  const clean = code.replace(/\s+/g, "").toUpperCase();
  if (clean.length <= 4) return clean;
  const mid = Math.ceil(clean.length / 2);
  return `${clean.slice(0, mid)}  ${clean.slice(mid)}`;
}

export function periodRange(
  preset: GroupPeriodPreset,
  from = new Date(),
  locale: Locale = getStoredLocale(),
): { startsAt: string; endsAt: string | null; periodLabel: string } {
  const start = new Date(from);
  start.setHours(12, 0, 0, 0);
  const y = String(start.getFullYear());

  const toKey = (d: Date) => d.toISOString().slice(0, 10);

  if (preset === "h1") {
    return {
      startsAt: `${y}-01-01`,
      endsAt: `${y}-06-30`,
      periodLabel: translate(locale, "group.periodLabelH1", { y }),
    };
  }
  if (preset === "h2") {
    return {
      startsAt: `${y}-07-01`,
      endsAt: `${y}-12-31`,
      periodLabel: translate(locale, "group.periodLabelH2", { y }),
    };
  }
  if (preset === "year") {
    return {
      startsAt: `${y}-01-01`,
      endsAt: `${y}-12-31`,
      periodLabel: translate(locale, "group.periodLabelYear", { y }),
    };
  }
  if (preset === "short") {
    const end = new Date(start);
    end.setDate(end.getDate() + 56);
    return {
      startsAt: toKey(start),
      endsAt: toKey(end),
      periodLabel: translate(locale, "group.periodShort"),
    };
  }
  return {
    startsAt: toKey(start),
    endsAt: null,
    periodLabel: translate(locale, "group.periodUnset"),
  };
}

export function formatGroupPeriod(
  group: {
    periodPreset?: GroupPeriodPreset;
    periodLabel?: string;
    startsAt: string;
    endsAt: string | null;
  },
  locale: Locale = getStoredLocale(),
): string {
  const y = (group.startsAt || "").slice(0, 4) || String(new Date().getFullYear());
  switch (group.periodPreset) {
    case "h1":
      return translate(locale, "group.periodLabelH1", { y });
    case "h2":
      return translate(locale, "group.periodLabelH2", { y });
    case "year":
      return translate(locale, "group.periodLabelYear", { y });
    case "short":
      return translate(locale, "group.periodShort");
    case "custom":
      if (group.periodLabel) return group.periodLabel;
      if (!group.endsAt) return `${group.startsAt} ~`;
      return `${group.startsAt} ~ ${group.endsAt}`;
    default:
      return group.periodLabel || translate(locale, "group.periodUnset");
  }
}

export function invitePath(code: string) {
  return `/join?code=${encodeURIComponent(code)}`;
}
