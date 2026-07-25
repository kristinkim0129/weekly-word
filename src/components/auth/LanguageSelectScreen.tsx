"use client";

import { useState } from "react";
import { GlassCard } from "@/components/ui/GlassCard";
import { Button } from "@/components/ui/Button";
import { useLocale } from "@/context/LocaleProvider";
import type { Locale } from "@/lib/i18n/messages";

const OPTIONS: {
  id: Locale;
  label: string;
  native: string;
  continue: string;
}[] = [
  {
    id: "ko",
    label: "한국어 · 함께묵상",
    native: "설교 이후, 한 주를 함께",
    continue: "계속하기",
  },
  {
    id: "en",
    label: "English · After Sermon",
    native: "Pray the week together",
    continue: "Continue",
  },
];

export function LanguageSelectScreen() {
  const { setLocale } = useLocale();
  const [picked, setPicked] = useState<Locale | null>(null);
  const continueLabel =
    OPTIONS.find((o) => o.id === picked)?.continue ?? "계속하기 · Continue";

  return (
    <div className="phone-shell">
      <div className="ambient ambient-a" aria-hidden />
      <div className="ambient ambient-b" aria-hidden />
      <div className="ambient ambient-c" aria-hidden />
      <header className="app-header">
        <p className="brand">함께묵상 · After Sermon</p>
        <h1 className="page-title">언어 선택</h1>
        <p className="page-sub">Choose your language</p>
      </header>
      <main className="app-main">
        <GlassCard>
          <div
            className="lang-options"
            role="listbox"
            aria-label="Language"
          >
            {OPTIONS.map((opt) => {
              const active = picked === opt.id;
              return (
                <button
                  key={opt.id}
                  type="button"
                  role="option"
                  aria-selected={active}
                  className={`lang-option ${active ? "active" : ""}`}
                  onClick={() => setPicked(opt.id)}
                >
                  <span className="lang-option-label">{opt.label}</span>
                  <span className="lang-option-native">{opt.native}</span>
                </button>
              );
            })}
          </div>
          <Button
            style={{ width: "100%", marginTop: 16 }}
            disabled={!picked}
            onClick={() => {
              if (picked) setLocale(picked);
            }}
          >
            {continueLabel}
          </Button>
        </GlassCard>
      </main>
    </div>
  );
}
