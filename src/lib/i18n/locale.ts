import { isLocale, LOCALE_STORAGE_KEY, type Locale } from "./messages";
import { translate, type MessageKey } from "./t";

/** Read the saved UI locale outside React (API helpers, AppProvider fallbacks). */
export function getStoredLocale(): Locale {
  if (typeof window === "undefined") return "ko";
  try {
    const saved = localStorage.getItem(LOCALE_STORAGE_KEY);
    if (isLocale(saved)) return saved;
  } catch {
    /* ignore */
  }
  return "ko";
}

export function tStored(
  key: MessageKey,
  vars?: Record<string, string | number>,
): string {
  return translate(getStoredLocale(), key, vars);
}
