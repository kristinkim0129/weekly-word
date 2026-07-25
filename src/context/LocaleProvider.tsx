"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import {
  isLocale,
  LOCALE_STORAGE_KEY,
  type Locale,
} from "@/lib/i18n/messages";
import { translate, type MessageKey } from "@/lib/i18n/t";

type LocaleContextValue = {
  ready: boolean;
  /** null until the user picks a language (or we load a saved one) */
  locale: Locale | null;
  setLocale: (locale: Locale) => void;
  t: (key: MessageKey, vars?: Record<string, string | number>) => string;
  dateLocale: string;
};

const LocaleContext = createContext<LocaleContextValue | null>(null);

export function LocaleProvider({ children }: { children: ReactNode }) {
  const [ready, setReady] = useState(false);
  const [locale, setLocaleState] = useState<Locale | null>(null);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(LOCALE_STORAGE_KEY);
      if (isLocale(saved)) {
        setLocaleState(saved);
      } else {
        setLocaleState("en");
        localStorage.setItem(LOCALE_STORAGE_KEY, "en");
      }
    } catch {
      setLocaleState("en");
    }
    setReady(true);
  }, []);

  useEffect(() => {
    if (!locale) return;
    document.documentElement.lang = locale === "en" ? "en" : "ko";
  }, [locale]);

  function setLocale(next: Locale) {
    setLocaleState(next);
    try {
      localStorage.setItem(LOCALE_STORAGE_KEY, next);
    } catch {
      /* ignore */
    }
  }

  const active: Locale = locale ?? "en";

  return (
    <LocaleContext.Provider
      value={{
        ready,
        locale,
        setLocale,
        t: (key, vars) => translate(active, key, vars),
        dateLocale: active === "en" ? "en-US" : "ko-KR",
      }}
    >
      {children}
    </LocaleContext.Provider>
  );
}

export function useLocale() {
  const ctx = useContext(LocaleContext);
  if (!ctx) throw new Error("useLocale must be used within LocaleProvider");
  return ctx;
}
