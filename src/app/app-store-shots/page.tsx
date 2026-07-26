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
  lang = "en",
  children,
}: {
  brand: string;
  title: string;
  sub?: string;
  nav?: string;
  lang?: Lang;
  children: ReactNode;
}) {
  const navItems = [
    { id: "today", ko: "매일", en: "Daily", icon: "◎" },
    { id: "capture", ko: "설교", en: "Sermon", icon: "✎" },
    { id: "group", ko: "그룹", en: "Group", icon: "♡" },
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
      ko: "주일에 들은 은혜, 매일 나누는 삶",
      en: "From Sunday to Daily",
    },
    support: {
      ko: "주일 설교를 매일의 루틴으로",
      en: "Sunday's Word, Daily Life.",
    },
    scene: (lang) => (
      <Phone
        brand="Sundaily"
        lang={lang}
        title={
          lang === "ko"
            ? "주일에 들은 은혜, 매일 나누는 삶"
            : "From Sunday to Daily"
        }
        sub={
          lang === "ko"
            ? "주일 설교를 매일의 루틴으로"
            : "Sunday's Word, Daily Life."
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
      ko: "우리가 서로 위해 기도한 흔적이 남아요.",
      en: "Traces of praying for one another stay with the group.",
    },
    scene: (lang) => (
      <Phone
        brand="Sundaily"
        lang={lang}
        title={lang === "ko" ? "시즌을 함께 걸어요" : "Walk a season together"}
        sub={
          lang === "ko"
            ? "기도 발자국을 돌아봐요"
            : "See prayer footprints"
        }
        nav="group"
      >
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
  const brand = "Sundaily";

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
