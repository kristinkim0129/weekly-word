"use client";

/**
 * App Store feature screenshots — value props, KO + EN.
 * Open /app-store-shots → pick language → capture each slide (9:16).
 */
import { useEffect, useState, type ReactNode } from "react";
import { GlassCard } from "@/components/ui/GlassCard";
import { Button } from "@/components/ui/Button";

type Lang = "ko" | "en";

type Shot = {
  id: string;
  headline: { ko: string; en: string };
  support: { ko: string; en: string };
  scene: (lang: Lang) => ReactNode;
};

function Phone({
  brand,
  title,
  sub,
  nav,
  children,
}: {
  brand: string;
  title: string;
  sub?: string;
  nav?: string;
  children: ReactNode;
}) {
  const lang: Lang = brand === "After Sermon" ? "en" : "ko";
  const navItems = [
    { id: "today", ko: "오늘", en: "Today", icon: "◎" },
    { id: "capture", ko: "기록", en: "Capture", icon: "✎" },
    { id: "group", ko: "함께", en: "Together", icon: "♡" },
    { id: "archive", ko: "보관", en: "Archive", icon: "▤" },
    { id: "me", ko: "나", en: "Me", icon: "◌" },
  ];

  return (
    <div className="store-phone">
      <div className="ambient ambient-a" aria-hidden />
      <div className="ambient ambient-b" aria-hidden />
      <header className="app-header" style={{ marginBottom: 12 }}>
        <p className="brand" style={{ margin: 0 }}>
          {brand}
        </p>
        <h2 className="page-title" style={{ fontSize: "1.4rem" }}>
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
              <span>{item[lang]}</span>
            </span>
          ))}
        </nav>
      ) : null}
    </div>
  );
}

const SHOTS: Shot[] = [
  {
    id: "hero",
    headline: {
      ko: "설교 이후, 한 주를 함께",
      en: "Pray the week together",
    },
    support: {
      ko: "일요일 말씀에서 매일 기도로 · 친구와 교회와 함께",
      en: "From Sunday Word to daily prayer with your friends",
    },
    scene: (lang) => (
      <Phone
        brand={lang === "ko" ? "함께묵상" : "After Sermon"}
        title={
          lang === "ko" ? "설교 이후, 한 주를 함께" : "Pray the week together"
        }
        sub={
          lang === "ko"
            ? "일요일 말씀에서 매일 기도로"
            : "From Sunday Word to daily prayer"
        }
      >
        <GlassCard>
          <p className="pill">{lang === "ko" ? "시작하기" : "Get started"}</p>
          <p className="hint" style={{ margin: "12px 0 16px" }}>
            {lang === "ko"
              ? "말씀을 담고, 기도로 체크하며, 그룹과 한 주를 걸어가요."
              : "Capture the Word, check in after prayer, walk the week with your people."}
          </p>
          <Button style={{ width: "100%" }}>
            {lang === "ko" ? "Google로 계속하기" : "Continue with Google"}
          </Button>
        </GlassCard>
        <GlassCard>
          <p className="tiny">
            {lang === "ko"
              ? "개인 묵상은 나에게만 · 기도·실천은 그룹과"
              : "Private notes · shared prayer & practice"}
          </p>
        </GlassCard>
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
      ko: "한 주의 핵심만 짧게. 깊은 메모는 나한테만.",
      en: "Keep a short point for the week. Deep notes stay private.",
    },
    scene: (lang) => (
      <Phone
        brand={lang === "ko" ? "함께묵상" : "After Sermon"}
        title={lang === "ko" ? "말씀 담기" : "Capture"}
        sub={
          lang === "ko"
            ? "한 주를 말씀과 함께 · 핵심만 짧게"
            : "A week with the Word · keep it short"
        }
        nav="capture"
      >
        <GlassCard>
          <div className="field">
            <label>{lang === "ko" ? "성경 본문" : "Scripture"}</label>
            <input readOnly value={lang === "ko" ? "요한복음 15:1-8" : "John 15:1-8"} />
          </div>
          <div className="field">
            <label>{lang === "ko" ? "핵심 한 줄" : "One-line point"}</label>
            <input
              readOnly
              value={
                lang === "ko" ? "포도나무에 붙어 있으라" : "Abide in the vine"
              }
            />
          </div>
          <div className="field">
            <label>{lang === "ko" ? "이번 주 실천" : "Practice"}</label>
            <input
              readOnly
              value={
                lang === "ko"
                  ? "매일 5분 말씀 붙들기"
                  : "5 min in the Word daily"
              }
            />
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
      ko: "읽기만으로 끝내지 않아요. 매일 짧게 말씀과 함께.",
      en: "Not just reading. A short daily rhythm with the Word.",
    },
    scene: (lang) => (
      <Phone
        brand={lang === "ko" ? "함께묵상" : "After Sermon"}
        title={lang === "ko" ? "오늘의 말씀" : "Today's Word"}
        sub={
          lang === "ko"
            ? "일요일 말씀에서 매일 기도로"
            : "From Sunday Word to daily prayer"
        }
        nav="today"
      >
        <GlassCard>
          <p className="pill">
            {lang === "ko" ? "이번 주 말씀" : "This week's Word"}
          </p>
          <p className="word-verse-sm">
            {lang === "ko" ? "요한복음 15:1-8" : "John 15:1-8"}
          </p>
          <p style={{ margin: "0 0 8px", fontWeight: 600 }}>
            {lang === "ko" ? "포도나무에 붙어 있으라" : "Abide in the vine"}
          </p>
          <p className="practice-highlight">
            {lang === "ko"
              ? "매일 5분 말씀 붙들기"
              : "5 min in the Word daily"}
          </p>
        </GlassCard>
        <GlassCard style={{ textAlign: "center" }}>
          <p className="pill">
            {lang === "ko"
              ? "하루 한 번 · 말씀과 함께"
              : "Once a day · with the Word"}
          </p>
          <div className="check-orb" style={{ margin: "12px auto" }}>
            {lang === "ko" ? (
              <>
                기도하고
                <br />
                체크
              </>
            ) : (
              <>
                Pray &
                <br />
                check
              </>
            )}
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
        brand={lang === "ko" ? "함께묵상" : "After Sermon"}
        title={lang === "ko" ? "오늘의 말씀" : "Today's Word"}
        sub={lang === "ko" ? "한 주를 함께 기도해요" : "Pray the week together"}
        nav="today"
      >
        <GlassCard style={{ textAlign: "center" }}>
          <div className="check-orb done" style={{ margin: "0 auto 8px" }}>
            {lang === "ko" ? "완료" : "Done"}
          </div>
        </GlassCard>
        <GlassCard>
          <p className="pill">
            {lang === "ko" ? "마음을 담아" : "From the heart"}
          </p>
          <div className="stack" style={{ marginTop: 12 }}>
            <div className="member-chip">
              <div>
                <strong>{lang === "ko" ? "수아" : "Sua"}</strong>
                <div className="prayer-keywords">
                  {lang === "ko" ? "기도제목: 채용" : "Prayer: job search"}
                </div>
              </div>
              <Button variant="soft" style={{ padding: "10px 12px", fontSize: "0.85rem" }}>
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
                {lang === "ko" ? "보냄" : "Sent"}
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
      ko: "초대 코드로 셀·친구를 모아요. 끝이 있는 동행.",
      en: "Invite your cell or friends. Companionship with an ending.",
    },
    scene: (lang) => (
      <Phone
        brand={lang === "ko" ? "함께묵상" : "After Sermon"}
        title={lang === "ko" ? "함께" : "Together"}
        sub={
          lang === "ko" ? "새싹 셀 · 2026 상반기" : "Sprout cell · 2026 H1"
        }
        nav="group"
      >
        <GlassCard>
          <p className="pill">{lang === "ko" ? "그룹 초대" : "Invite"}</p>
          <p className="hint" style={{ marginTop: 8 }}>
            {lang === "ko" ? "새싹 셀 · 3/5명" : "Sprout cell · 3/5"}
          </p>
          <div className="row" style={{ flexWrap: "wrap", margin: "12px 0" }}>
            <span className="pill">{lang === "ko" ? "나" : "Me"}</span>
            <span className="pill">{lang === "ko" ? "수아" : "Sua"}</span>
            <span className="pill">{lang === "ko" ? "준호" : "June"}</span>
          </div>
          <div className="member-chip" style={{ alignItems: "center" }}>
            <div>
              <strong>{lang === "ko" ? "초대 코드" : "Invite code"}</strong>
              <div
                className="tiny"
                style={{
                  fontFamily: "ui-monospace, monospace",
                  letterSpacing: "0.08em",
                  fontSize: "1.1rem",
                  marginTop: 4,
                }}
              >
                a1b2c3d4
              </div>
            </div>
            <Button variant="soft">
              {lang === "ko" ? "링크 복사" : "Copy link"}
            </Button>
          </div>
        </GlassCard>
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
      ko: "우리가 서로 위해 기도한 흔적이 남아요.",
      en: "Traces of praying for one another stay with the group.",
    },
    scene: (lang) => (
      <Phone
        brand={lang === "ko" ? "함께묵상" : "After Sermon"}
        title={lang === "ko" ? "함께" : "Together"}
        sub={
          lang === "ko"
            ? "기도 발자국 · 새싹 셀"
            : "Prayer footprints · Sprout"
        }
        nav="group"
      >
        <GlassCard>
          <p className="pill">
            {lang === "ko" ? "기도 발자국" : "Prayer footprints"}
          </p>
          <div className="store-footprint" aria-hidden>
            <span className="store-node">{lang === "ko" ? "나" : "Me"}</span>
            <span className="store-arrow a">→</span>
            <span className="store-node">{lang === "ko" ? "수아" : "Sua"}</span>
            <span className="store-arrow b">→</span>
            <span className="store-node">{lang === "ko" ? "준호" : "June"}</span>
            <span className="store-arrow c">↗</span>
          </div>
          <p className="hint" style={{ marginTop: 12 }}>
            {lang === "ko"
              ? "오늘 3명이 서로 위해 기도했어요"
              : "3 people prayed for one another today"}
          </p>
        </GlassCard>
        <GlassCard>
          <p className="pill">{lang === "ko" ? "한 줄 나눔" : "One-line share"}</p>
          <p className="hint" style={{ marginTop: 10 }}>
            {lang === "ko"
              ? "포도나무에 붙어 있으라는 말이 계속 남아요."
              : "“Abide in the vine” keeps coming back."}
          </p>
        </GlassCard>
      </Phone>
    ),
  },
];

export default function AppStoreShotsPage() {
  const [lang, setLang] = useState<Lang>("ko");
  const [index, setIndex] = useState(0);

  useEffect(() => {
    document.documentElement.dataset.theme = "after";
  }, []);

  const shot = SHOTS[index];
  const brand = lang === "ko" ? "함께묵상" : "After Sermon";

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
            ? "가치 제안 슬라이드 · 캡처용 9:16"
            : "Value-prop slides · 9:16 capture"}
        </p>

        <div className="storyboard-lang">
          <button
            type="button"
            className={lang === "ko" ? "active" : ""}
            onClick={() => setLang("ko")}
          >
            한국어 · 함께묵상
          </button>
          <button
            type="button"
            className={lang === "en" ? "active" : ""}
            onClick={() => setLang("en")}
          >
            English · After Sermon
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
            ? "오른쪽 프레임을 전체 화면으로 두고 스크린샷하세요. (Cmd+Shift+4)"
            : "Screenshot the frame on the right (full slide)."}
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
