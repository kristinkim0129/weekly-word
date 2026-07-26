"use client";

import { useState } from "react";
import Image from "next/image";
import { useLocale } from "@/context/LocaleProvider";
import type { Locale } from "@/lib/i18n/messages";

const OPTIONS: {
  id: Locale;
  label: string;
  native: string;
  continue: string;
}[] = [
  {
    id: "en",
    label: "English · Sundaily",
    native: "Pray the week together",
    continue: "Continue",
  },
  {
    id: "ko",
    label: "한국어 · Sundaily",
    native: "설교 이후, 한 주를 함께",
    continue: "계속하기",
  },
];

export function LanguageSelectScreen() {
  const { setLocale } = useLocale();
  const [picked, setPicked] = useState<Locale | null>("en");
  const continueLabel =
    OPTIONS.find((o) => o.id === picked)?.continue ?? "Continue";

  return (
    <div className="landing-shell">
      <div className="landing-bg" aria-hidden>
        <Image
          src="/landing-bg.png"
          alt=""
          fill
          priority
          sizes="430px"
          className="landing-bg-img"
        />
        <div className="landing-bg-veil" />
      </div>

      <div className="landing-content">
        <header className="landing-hero">
          <Image
            src="/logo-icon.png"
            alt=""
            width={52}
            height={48}
            className="landing-logo-mark"
            priority
          />
          <h1 className="landing-title">Sundaily</h1>
          <p className="landing-slogan">PRAY THE WEEK TOGETHER</p>
        </header>

        <div className="landing-card">
          <div className="landing-card-head">
            <span className="landing-people-bubble" aria-hidden>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                <circle
                  cx="9"
                  cy="8"
                  r="3.2"
                  stroke="currentColor"
                  strokeWidth="1.7"
                />
                <path
                  d="M3.5 18.5c.6-3.2 2.8-4.8 5.5-4.8s4.9 1.6 5.5 4.8"
                  stroke="currentColor"
                  strokeWidth="1.7"
                  strokeLinecap="round"
                />
                <circle
                  cx="17"
                  cy="9"
                  r="2.6"
                  stroke="currentColor"
                  strokeWidth="1.7"
                />
                <path
                  d="M14.2 18.5c.4-2.2 1.8-3.4 3.8-3.4 1.4 0 2.5.6 3.2 1.8"
                  stroke="currentColor"
                  strokeWidth="1.7"
                  strokeLinecap="round"
                />
              </svg>
            </span>
            <div className="landing-card-head-copy">
              <p className="landing-card-title">Choose your language</p>
              <p className="landing-card-blurb">언어를 선택해 주세요</p>
            </div>
          </div>

          <div className="lang-options" role="listbox" aria-label="Language">
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
          <button
            type="button"
            className="landing-primary"
            style={{ marginTop: 16 }}
            disabled={!picked}
            onClick={() => {
              if (picked) setLocale(picked);
            }}
          >
            <span>{continueLabel}</span>
            <svg
              className="landing-primary-arrow"
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              aria-hidden
            >
              <path
                d="M5 12h12M13 6l6 6-6 6"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
