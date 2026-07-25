/**
 * App color tokens — single default look for now (not a finalized brand system).
 */

export type ThemeId = "after";

export const DEFAULT_THEME: ThemeId = "after";

export const BRAND_THEME_COLOR = "#2F4149";

export function applyBrandTheme() {
  if (typeof document === "undefined") return;
  document.documentElement.dataset.theme = DEFAULT_THEME;
  try {
    localStorage.removeItem("weekly-word-theme");
  } catch {
    // ignore
  }
}

export function parseThemeId(_value?: unknown): ThemeId {
  return DEFAULT_THEME;
}
