"use client";

/**
 * App Store feature screenshots — Sundaily value props, KO + EN.
 * Open /app-store-shots → pick language → capture each slide.
 * Export: /app-store-shots?lang=en&shot=0&export=1&w=1284&h=2778
 */
import Image from "next/image";
import { Suspense, useEffect, useMemo, useState, type ReactNode } from "react";
import { useSearchParams } from "next/navigation";
import { GlassCard } from "@/components/ui/GlassCard";
import { Button } from "@/components/ui/Button";
import { PrayHandsIcon } from "@/components/TodayPractice";

type Lang = "ko" | "en";

type Shot = {
  id: string;
  headline: { ko: string; en: string };
  support: { ko: string; en: string };
  scene: (lang: Lang) => ReactNode;
};

function GoogleGlyph() {
  return (
    <svg width="18" height="18" viewBox="0 0 48 48" aria-hidden>
      <path
        fill="#EA4335"
        d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"
      />
      <path
        fill="#4285F4"
        d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"
      />
      <path
        fill="#FBBC05"
        d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"
      />
      <path
        fill="#34A853"
        d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"
      />
    </svg>
  );
}

function PeopleIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden>
      <circle cx="9" cy="8" r="3.2" stroke="currentColor" strokeWidth="1.7" />
      <path
        d="M3.5 18.5c.6-3.2 2.8-4.8 5.5-4.8s4.9 1.6 5.5 4.8"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
      />
      <circle cx="17" cy="9" r="2.6" stroke="currentColor" strokeWidth="1.7" />
      <path
        d="M14.2 18.5c.4-2.2 1.8-3.4 3.8-3.4 1.4 0 2.5.6 3.2 1.8"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
      />
    </svg>
  );
}

function Phone({
  brand,
  title,
  sub,
  nav,
  lang = "en",
  landing = false,
  children,
}: {
  brand: string;
  title: string;
  sub?: string;
  nav?: string;
  lang?: Lang;
  landing?: boolean;
  children: ReactNode;
}) {
  const navItems = [
    { id: "today", ko: "매일", en: "Daily", icon: "◎" },
    { id: "capture", ko: "설교", en: "Sermon", icon: "✎" },
    { id: "group", ko: "그룹", en: "Group", icon: "♡" },
    { id: "archive", ko: "보관", en: "Archive", icon: "▤" },
    { id: "me", ko: "나", en: "Me", icon: "◌" },
  ];

  if (landing) {
    return (
      <div className="store-phone store-phone--landing">
        <div className="store-landing-bg" aria-hidden>
          <Image
            src="/landing-bg.png"
            alt=""
            fill
            sizes="320px"
            className="store-landing-bg-img"
            priority
          />
          <div className="store-landing-veil" />
        </div>
        <div className="store-phone-body store-phone-body--landing">
          {children}
        </div>
      </div>
    );
  }

  return (
    <div className="store-phone">
      <div className="ambient ambient-a" aria-hidden />
      <div className="ambient ambient-b" aria-hidden />
      <header className="app-header" style={{ marginBottom: 12 }}>
        <p className="brand" style={{ margin: 0 }}>
          {brand}
        </p>
        <h2 className="page-title" style={{ fontSize: "1.35rem" }}>
          {title}
        </h2>
        {sub ? <p className="page-sub">{sub}</p> : null}
      </header>
      <div className="store-phone-body">{children}</div>
      {nav ? (
        <nav className="bottom-nav story-nav" aria-hidden>
          {navItems.map((item) => (
            <span
              key={item.id}
              className={`nav-item ${nav === item.id ? "active" : ""}`}
            >
              <span className="nav-icon">{item.icon}</span>
              <span className="nav-label">{item[lang]}</span>
            </span>
          ))}
        </nav>
      ) : null}
    </div>
  );
}

const SAMPLE = {
  chapter: { ko: "요한복음 15:1-8", en: "John 15:1-8" },
  passage: {
    ko: "나는 참포도나무요 내 아버지는 농부라…",
    en: "I am the true vine, and my Father is the gardener…",
  },
  brief: { ko: "포도나무에 붙어 있으라", en: "Abide in the vine" },
  practice: {
    ko: "매일 5분 말씀 붙들기",
    en: "5 min in the Word daily",
  },
};

const SHOTS: Shot[] = [
  {
    id: "hero",
    headline: {
      ko: "주일에 들은 은혜, 매일 나누는 삶",
      en: "From Sunday to Daily",
    },
    support: {
      ko: "주일에서 매일로",
      en: "Sunday's Word, Daily Life.",
    },
    scene: (lang) => (
      <Phone brand="Sundaily" lang={lang} title="" landing>
        <header className="landing-hero store-landing-hero">
          <Image
            src="/logo-icon.png"
            alt=""
            width={48}
            height={44}
            className="landing-logo-mark"
            priority
          />
          <h1 className="landing-title">Sundaily</h1>
          <p className="landing-slogan">
            {lang === "ko"
              ? "주일에 들은 은혜, 매일 나누는 삶"
              : "FROM SUNDAY TO DAILY"}
          </p>
        </header>
        <div className="store-landing-footer">
          <div className="landing-card store-landing-card">
            <div className="landing-card-head">
              <span className="landing-people-bubble" aria-hidden>
                <PeopleIcon />
              </span>
              <div className="landing-card-head-copy">
                <p className="landing-card-title">
                  {lang === "ko" ? "시작하기" : "Get started"}
                </p>
                <p className="landing-card-blurb">
                  {lang === "ko"
                    ? "주일 말씀을 매일 삶에 적용하고, 친구와 함께 지켜가요."
                    : "Apply Sunday's Word in daily life — with friends who walk it with you."}
                </p>
              </div>
            </div>
            <button type="button" className="landing-google" tabIndex={-1}>
              <GoogleGlyph />
              <span>
                {lang === "ko" ? "Google로 계속하기" : "Continue with Google"}
              </span>
            </button>
          </div>
          <p className="landing-privacy store-landing-privacy">
            {lang === "ko"
              ? "개인 묵상은 나에게만, 기도제목·묵상 포인트·실천은 그룹과 나눠요."
              : "Personal notes stay private. Prayer, meditation points, and practice are shared with your group."}
          </p>
        </div>
      </Phone>
    ),
  },
  {
    id: "capture",
    headline: {
      ko: "일요일 말씀을 담아요",
      en: "Capture Sunday’s Word",
    },
    support: {
      ko: "장과 본문, 핵심 한 줄. 깊은 메모는 나한테만.",
      en: "Chapter + passage, one short point. Deep notes stay private.",
    },
    scene: (lang) => (
      <Phone
        brand="Sundaily"
        lang={lang}
        title={lang === "ko" ? "말씀 담기" : "Capture"}
        sub={
          lang === "ko"
            ? "한 주를 말씀과 함께 · 핵심만 짧게"
            : "A week with the Word · keep it short"
        }
        nav="capture"
      >
        <GlassCard className="capture-card">
          <div className="field">
            <label>{lang === "ko" ? "장 (Chapter)" : "Chapter"}</label>
            <input readOnly value={SAMPLE.chapter[lang]} />
          </div>
          <div className="field">
            <label>{lang === "ko" ? "본문 (Passage)" : "Passage"}</label>
            <textarea readOnly rows={2} value={SAMPLE.passage[lang]} />
          </div>
          <div className="field">
            <label>{lang === "ko" ? "핵심 한 줄" : "One-line point"}</label>
            <input readOnly value={SAMPLE.brief[lang]} />
          </div>
          <div className="field">
            <label>{lang === "ko" ? "이번 주 실천" : "This week's practice"}</label>
            <input readOnly value={SAMPLE.practice[lang]} />
          </div>
          <Button style={{ width: "100%" }}>
            {lang === "ko" ? "이번 주 말씀 저장" : "Save this week's Word"}
          </Button>
        </GlassCard>
      </Phone>
    ),
  },
  {
    id: "daily",
    headline: {
      ko: "기도한 뒤, 하루를 체크해요",
      en: "Pray — then check in",
    },
    support: {
      ko: "읽기 · 묵상 · 한 줄 나눔. 매일 짧게.",
      en: "Read · Reflect · One-line share. A short daily rhythm.",
    },
    scene: (lang) => (
      <Phone
        brand="Sundaily"
        lang={lang}
        title={lang === "ko" ? "오늘의 말씀" : "Today's Word"}
        sub={
          lang === "ko"
            ? "주일 설교를 매일의 루틴으로"
            : "Sunday's Word, Daily Life."
        }
        nav="today"
      >
        <GlassCard>
          <p className="pill">
            {lang === "ko" ? "이번 주 말씀" : "This week's Word"}
          </p>
          <div className="week-meta" style={{ marginTop: 12 }}>
            <p className="week-meta-value week-meta-value--sm">
              {SAMPLE.chapter[lang]}
            </p>
            <p className="week-meta-value">{SAMPLE.brief[lang]}</p>
            <div>
              <p className="week-meta-label">
                {lang === "ko" ? "이번 주 실천" : "This week's practice"}
              </p>
              <p className="week-meta-value week-meta-value--sm">
                {SAMPLE.practice[lang]}
              </p>
            </div>
          </div>
        </GlassCard>
        <GlassCard>
          <div className="today-practice">
            <div className="segment-bar" role="tablist">
              {(
                lang === "ko"
                  ? [
                      { label: "읽기", min: "5분", active: true },
                      { label: "묵상", min: "3분", active: false },
                      { label: "한 줄 나눔", min: "2분", active: false },
                    ]
                  : [
                      { label: "Read", min: "5 min", active: true },
                      { label: "Reflect", min: "3 min", active: false },
                      { label: "One-line", min: "2 min", active: false },
                    ]
              ).map((seg) => (
                <span
                  key={seg.label}
                  className={`segment-btn ${seg.active ? "active" : ""}`}
                >
                  <span>{seg.label}</span>
                  <span className="segment-min">{seg.min}</span>
                </span>
              ))}
            </div>
            <div className="today-practice-panel">
              <p className="week-meta-label" style={{ marginTop: 0 }}>
                {lang === "ko" ? "장" : "Chapter"}
              </p>
              <p className="word-verse-sm" style={{ marginTop: 4 }}>
                {SAMPLE.chapter[lang]}
              </p>
              <p className="today-verse-text">{SAMPLE.passage[lang]}</p>
            </div>
          </div>
        </GlassCard>
        <GlassCard style={{ textAlign: "center" }}>
          <p className="pill">
            {lang === "ko"
              ? "하루 한 번 · 말씀과 함께"
              : "Once a day · with the Word"}
          </p>
          <div className="check-orb" style={{ margin: "12px auto" }}>
            <span className="check-orb-inner">
              <PrayHandsIcon />
              <span className="check-orb-title">
                {lang === "ko" ? "기도하고 체크" : "Pray & check"}
              </span>
              <span className="check-orb-sub">
                {lang === "ko"
                  ? "하나님과 시작하는 시간"
                  : "Start your moment with God"}
              </span>
            </span>
          </div>
        </GlassCard>
      </Phone>
    ),
  },
  {
    id: "pray",
    headline: {
      ko: "“기도했어”로 이어져요",
      en: "Send “I prayed”",
    },
    support: {
      ko: "마음을 담아 · 이미 아는 친구·셀과 책임 나눔.",
      en: "From the heart — accountability with people you know.",
    },
    scene: (lang) => (
      <Phone
        brand="Sundaily"
        lang={lang}
        title={lang === "ko" ? "오늘의 말씀" : "Today's Word"}
        sub={
          lang === "ko"
            ? "주일에 들은 은혜, 매일 나누는 삶"
            : "From Sunday to Daily"
        }
        nav="today"
      >
        <GlassCard style={{ textAlign: "center" }}>
          <div className="check-orb done" style={{ margin: "0 auto 8px" }}>
            <span className="check-orb-inner">
              <PrayHandsIcon />
              <span className="check-orb-title">
                {lang === "ko" ? "완료" : "Done"}
              </span>
              <span className="check-orb-sub">
                {lang === "ko" ? "잘했어요" : "Well done"}
              </span>
            </span>
          </div>
        </GlassCard>
        <GlassCard>
          <div className="row-between">
            <p className="pill">{lang === "ko" ? "마음을 담아" : "From the heart"}</p>
            <span className="tiny">
              {lang === "ko" ? "서로를 위해 기도해요" : "Pray for one another"}
            </span>
          </div>
          <div className="stack" style={{ marginTop: 12 }}>
            <div className="member-chip">
              <div>
                <strong>{lang === "ko" ? "수아" : "Sua"}</strong>
                <div className="prayer-keywords">
                  {lang === "ko" ? "기도제목: 채용" : "Prayer: job search"}
                </div>
              </div>
              <Button
                variant="soft"
                style={{ padding: "10px 12px", fontSize: "0.85rem" }}
              >
                {lang === "ko" ? "기도했어" : "I prayed"}
              </Button>
            </div>
            <div className="member-chip">
              <div>
                <strong>{lang === "ko" ? "준호" : "June"}</strong>
                <div className="prayer-keywords">
                  {lang === "ko" ? "기도제목: 가족" : "Prayer: family"}
                </div>
              </div>
              <Button
                variant="soft"
                disabled
                style={{ padding: "10px 12px", fontSize: "0.85rem" }}
              >
                {lang === "ko" ? "보냄 🕊️" : "Sent 🕊️"}
              </Button>
            </div>
          </div>
        </GlassCard>
      </Phone>
    ),
  },
  {
    id: "group",
    headline: {
      ko: "시즌을 정해 함께 걸어요",
      en: "Walk a season together",
    },
    support: {
      ko: "초대 코드로 셀·친구를 모아요. 최대 8명.",
      en: "Invite your cell or friends. Up to 8 people.",
    },
    scene: (lang) => (
      <Phone
        brand="Sundaily"
        lang={lang}
        title={lang === "ko" ? "시즌을 함께 걸어요" : "Walk a season together"}
        sub={
          lang === "ko"
            ? "이 그룹을 호스트하고 있어요"
            : "You're hosting this group"
        }
        nav="group"
      >
        <div className="invite-code-card">
          <div className="invite-code-label">
            <span className="invite-code-icon" aria-hidden>
              ♡
            </span>
            <span>{lang === "ko" ? "초대 코드" : "Invite code"}</span>
          </div>
          <p className="invite-code-value">A1B2  C3D4</p>
          <button type="button" className="invite-outline-btn">
            {lang === "ko" ? "링크 복사" : "Copy link"}
          </button>
        </div>
        <div className="invite-members-card">
          <div className="invite-members-head">
            <span>{lang === "ko" ? "멤버" : "Members"}</span>
            <span className="invite-members-ratio">3 / 8</span>
          </div>
          <ul className="invite-member-list">
            {(
              lang === "ko"
                ? [
                    { name: "나", role: "호스트", you: true },
                    { name: "수아", role: "멤버", you: false },
                    { name: "준호", role: "멤버", you: false },
                  ]
                : [
                    { name: "Me", role: "Host", you: true },
                    { name: "Sua", role: "Member", you: false },
                    { name: "June", role: "Member", you: false },
                  ]
            ).map((m) => (
              <li key={m.name} className="invite-member-row">
                <img
                  src="/avatar-placeholder.svg"
                  alt=""
                  width={42}
                  height={42}
                  className="member-avatar"
                />
                <div className="invite-member-meta">
                  <strong>{m.name}</strong>
                  <span className="tiny">{m.role}</span>
                </div>
                {m.you ? (
                  <span className="invite-you-badge">
                    {lang === "ko" ? "나" : "You"}
                  </span>
                ) : null}
              </li>
            ))}
          </ul>
        </div>
      </Phone>
    ),
  },
  {
    id: "footprints",
    headline: {
      ko: "기도 발자국을 돌아봐요",
      en: "See prayer footprints",
    },
    support: {
      ko: "초대 3/8 · 서로 위해 기도한 흔적.",
      en: "Invite 3/8 · traces of praying for one another.",
    },
    scene: (lang) => (
      <Phone
        brand="Sundaily"
        lang={lang}
        title={lang === "ko" ? "시즌을 함께 걸어요" : "Walk a season together"}
        sub={
          lang === "ko"
            ? "이 그룹을 호스트하고 있어요"
            : "You're hosting this group"
        }
        nav="group"
      >
        <div className="invite-code-card">
          <div className="invite-code-label">
            <span className="invite-code-icon" aria-hidden>
              ♡
            </span>
            <span>{lang === "ko" ? "초대 코드" : "Invite code"}</span>
          </div>
          <p className="invite-code-value">A1B2  C3D4</p>
          <div className="invite-members-head" style={{ marginTop: 10 }}>
            <span>{lang === "ko" ? "멤버" : "Members"}</span>
            <span className="invite-members-ratio">3 / 8</span>
          </div>
        </div>
        <GlassCard>
          <p className="pill">
            {lang === "ko"
              ? "기도 발자국을 돌아봐요"
              : "See prayer footprints"}
          </p>
          <p className="hint" style={{ marginTop: 8 }}>
            {lang === "ko"
              ? "우리가 서로 위해 기도한 흔적이 남아요."
              : "Traces of praying for one another stay with the group."}
          </p>
          <div className="store-footprint" aria-hidden>
            <span className="store-node">{lang === "ko" ? "나" : "Me"}</span>
            <span className="store-arrow a">→</span>
            <span className="store-node">{lang === "ko" ? "수아" : "Sua"}</span>
            <span className="store-arrow b">→</span>
            <span className="store-node">{lang === "ko" ? "준호" : "June"}</span>
          </div>
          <p className="hint" style={{ marginTop: 12 }}>
            {lang === "ko"
              ? "최근 기도 연결 · 3"
              : "Recent prayer links · 3"}
          </p>
        </GlassCard>
      </Phone>
    ),
  },
];

/** ASC upload set (5) — maps to existing asc/* filenames */
const ASC_SHOT_IDS = [
  "hero",
  "capture",
  "daily",
  "pray",
  "footprints",
] as const;

function AppStoreShotsInner() {
  const searchParams = useSearchParams();
  const exportMode = searchParams.get("export") === "1";
  const paramLang = searchParams.get("lang");
  const paramShot = searchParams.get("shot");
  const paramW = Number(searchParams.get("w") || 0);
  const paramH = Number(searchParams.get("h") || 0);
  const paramAsc = searchParams.get("asc");

  const [lang, setLang] = useState<Lang>(
    paramLang === "en" || paramLang === "ko" ? paramLang : "en",
  );
  const [index, setIndex] = useState(() => {
    if (
      paramAsc &&
      ASC_SHOT_IDS.includes(paramAsc as (typeof ASC_SHOT_IDS)[number])
    ) {
      const id = paramAsc as (typeof ASC_SHOT_IDS)[number];
      return SHOTS.findIndex((s) => s.id === id);
    }
    const n = Number(paramShot ?? 0);
    return Number.isFinite(n) ? Math.max(0, Math.min(SHOTS.length - 1, n)) : 0;
  });

  useEffect(() => {
    document.documentElement.dataset.theme = "after";
  }, []);

  useEffect(() => {
    if (paramLang === "en" || paramLang === "ko") setLang(paramLang);
  }, [paramLang]);

  const shot = SHOTS[index] ?? SHOTS[0];
  const brand = "Sundaily";

  const exportStyle = useMemo(() => {
    if (!exportMode) return undefined;
    const w = paramW > 0 ? paramW : 1284;
    const h = paramH > 0 ? paramH : 2778;
    return {
      width: w,
      height: h,
      maxHeight: "none",
      borderRadius: 0,
      boxShadow: "none",
    } as const;
  }, [exportMode, paramW, paramH]);

  if (exportMode) {
    return (
      <div className="store-shots store-shots--export" data-export="1">
        <div
          className="store-slide"
          data-shot={shot.id}
          data-lang={lang}
          id="store-export-slide"
          style={exportStyle}
        >
          <p className="store-slide-brand">{brand}</p>
          <h2 className="store-slide-headline">{shot.headline[lang]}</h2>
          <p className="store-slide-support">{shot.support[lang]}</p>
          <div className="store-slide-phone">{shot.scene(lang)}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="store-shots">
      <aside className="store-shots-rail no-print">
        <p className="brand" style={{ marginBottom: 4 }}>
          {brand}
        </p>
        <h1 className="storyboard-title">
          {lang === "ko" ? "스토어 스크린샷" : "Store screenshots"}
        </h1>
        <p className="hint" style={{ margin: "8px 0 14px" }}>
          {lang === "ko"
            ? "실제 앱 UI · 캡처용 슬라이드"
            : "Real app UI · capture slides"}
        </p>

        <div className="storyboard-lang">
          <button
            type="button"
            className={lang === "ko" ? "active" : ""}
            onClick={() => setLang("ko")}
          >
            한국어 · Sundaily
          </button>
          <button
            type="button"
            className={lang === "en" ? "active" : ""}
            onClick={() => setLang("en")}
          >
            English · Sundaily
          </button>
        </div>

        <ol className="storyboard-steps">
          {SHOTS.map((s, i) => (
            <li key={s.id}>
              <button
                type="button"
                className={`storyboard-step ${i === index ? "active" : ""}`}
                onClick={() => setIndex(i)}
              >
                <span className="storyboard-step-act">
                  {i + 1} / {SHOTS.length}
                </span>
                <span className="storyboard-step-title">
                  {s.headline[lang]}
                </span>
              </button>
            </li>
          ))}
        </ol>

        <p className="tiny" style={{ marginTop: 16 }}>
          {lang === "ko"
            ? "ASC 업로드: hero → capture → daily → pray → footprints(초대 3/8)."
            : "ASC upload: hero → capture → daily → pray → footprints (invite 3/8)."}
        </p>
      </aside>

      <main className="store-shots-stage">
        <div className="store-slide" data-shot={shot.id} data-lang={lang}>
          <p className="store-slide-brand">{brand}</p>
          <h2 className="store-slide-headline">{shot.headline[lang]}</h2>
          <p className="store-slide-support">{shot.support[lang]}</p>
          <div className="store-slide-phone">{shot.scene(lang)}</div>
        </div>

        <div className="storyboard-controls no-print">
          <Button
            variant="soft"
            disabled={index === 0}
            onClick={() => setIndex((i) => Math.max(0, i - 1))}
          >
            {lang === "ko" ? "이전" : "Back"}
          </Button>
          <span className="tiny">
            {index + 1} / {SHOTS.length}
          </span>
          <Button
            disabled={index === SHOTS.length - 1}
            onClick={() => setIndex((i) => Math.min(SHOTS.length - 1, i + 1))}
          >
            {lang === "ko" ? "다음" : "Next"}
          </Button>
        </div>
      </main>
    </div>
  );
}

export default function AppStoreShotsPage() {
  return (
    <Suspense
      fallback={
        <div className="store-shots">
          <p className="hint" style={{ padding: 24 }}>
            Loading…
          </p>
        </div>
      }
    >
      <AppStoreShotsInner />
    </Suspense>
  );
}
