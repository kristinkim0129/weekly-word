"use client";

/**
 * Critical User Journey storyboard — login 없이 앱 UI로 CUJ를 따라갑니다.
 * 경로: /storyboard
 */
import { useEffect, useState, type ReactNode } from "react";
import { GlassCard } from "@/components/ui/GlassCard";
import { Button } from "@/components/ui/Button";

type Lang = "ko" | "en";

type Step = {
  id: string;
  act: string;
  title: { ko: string; en: string };
  goal: { ko: string; en: string };
  scene: (lang: Lang) => ReactNode;
};

function PhoneFrame({
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
  const navItems = [
    { id: "today", ko: "매일", en: "Daily", icon: "◎" },
    { id: "capture", ko: "설교", en: "Sermon", icon: "✎" },
    { id: "group", ko: "그룹", en: "Group", icon: "♡" },
    { id: "archive", ko: "보관", en: "Archive", icon: "▤" },
    { id: "me", ko: "나", en: "Me", icon: "◌" },
  ];
  const lang: Lang = brand === "After Sermon" ? "en" : "ko";

  return (
    <div className="story-phone">
      <div className="ambient ambient-a" aria-hidden />
      <div className="ambient ambient-b" aria-hidden />
      <div className="ambient ambient-c" aria-hidden />
      <header className="app-header" style={{ marginBottom: 14 }}>
        <p className="brand" style={{ margin: 0 }}>
          {brand}
        </p>
        <h1 className="page-title" style={{ fontSize: "1.55rem" }}>
          {title}
        </h1>
        {sub ? <p className="page-sub">{sub}</p> : null}
      </header>
      <div className="story-phone-body">{children}</div>
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

function Vis({ kind, lang }: { kind: "private" | "shared"; lang: Lang }) {
  return (
    <span className={`vis-tag ${kind}`}>
      {kind === "private"
        ? lang === "ko"
          ? "나한테만 보여요"
          : "Only you"
        : lang === "ko"
          ? "그룹원에게 보여져요"
          : "Shared"}
    </span>
  );
}

const STEPS: Step[] = [
  {
    id: "lang",
    act: "0 · Onboard",
    title: {
      ko: "언어 선택",
      en: "Choose language",
    },
    goal: {
      ko: "한국어(함께묵상) / English(After Sermon)로 브랜드·카피가 갈라집니다.",
      en: "Korean → 함께묵상 · English → After Sermon branding.",
    },
    scene: () => (
      <PhoneFrame brand="함께묵상 · After Sermon" title="언어 선택" sub="Choose your language">
        <GlassCard>
          <div className="lang-options">
            <button type="button" className="lang-option active">
              <span className="lang-option-label">한국어 · 함께묵상</span>
              <span className="lang-option-native">설교 이후, 한 주를 함께</span>
            </button>
            <button type="button" className="lang-option">
              <span className="lang-option-label">English · After Sermon</span>
              <span className="lang-option-native">Pray the week together</span>
            </button>
          </div>
          <Button style={{ width: "100%", marginTop: 16 }}>계속하기</Button>
        </GlassCard>
      </PhoneFrame>
    ),
  },
  {
    id: "login",
    act: "0 · Onboard",
    title: { ko: "로그인", en: "Sign in" },
    goal: {
      ko: "목적 한 줄 + Google 로그인. 개인/나눔 경계를 미리 알려줍니다.",
      en: "One-line purpose + Google. Privacy boundary up front.",
    },
    scene: (lang) => (
      <PhoneFrame
        brand={lang === "ko" ? "함께묵상" : "After Sermon"}
        title={
          lang === "ko" ? "설교 이후, 한 주를 함께" : "Pray the week together"
        }
        sub={
          lang === "ko"
            ? "일요일 말씀에서 매일 기도로 · 친구와 교회와 함께"
            : "From Sunday Word to daily prayer with your friends"
        }
      >
        <GlassCard>
          <p className="pill">{lang === "ko" ? "시작하기" : "Get started"}</p>
          <p className="hint" style={{ margin: "12px 0 16px" }}>
            {lang === "ko"
              ? "일요일 말씀을 담아 한 주를 인도하게 하고, 친구·교회와 함께 기도하며 살아가요."
              : "Let your Sunday Word guide the week — with friends and church."}
          </p>
          <Button style={{ width: "100%" }}>
            {lang === "ko" ? "Google로 계속하기" : "Continue with Google"}
          </Button>
        </GlassCard>
        <GlassCard>
          <p className="tiny">
            {lang === "ko"
              ? "개인 묵상은 나에게만, 기도제목·실천은 그룹과 나눠요."
              : "Personal notes stay private. Prayer & practice are shared."}
          </p>
        </GlassCard>
      </PhoneFrame>
    ),
  },
  {
    id: "today-empty",
    act: "1 · Sunday",
    title: { ko: "오늘 · 말씀 없음", en: "Today · no capture yet" },
    goal: {
      ko: "CUJ 시작점. 일요일 말씀을 담으러 기록으로 보냅니다.",
      en: "Entry: nudge to capture Sunday’s Word.",
    },
    scene: (lang) => (
      <PhoneFrame
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
          <p className="empty">
            {lang === "ko"
              ? "아직 이번 주 기록이 없어요."
              : "No capture for this week yet."}
          </p>
          <Button style={{ width: "100%" }}>
            {lang === "ko" ? "일요일 말씀 담기" : "Capture Sunday's Word"}
          </Button>
        </GlassCard>
      </PhoneFrame>
    ),
  },
  {
    id: "capture",
    act: "1 · Sunday",
    title: { ko: "말씀 담기", en: "Capture" },
    goal: {
      ko: "개인 필드(핵심·첫생각)와 공유 필드(기도·묵상·실천)를 구분합니다.",
      en: "Private fields vs shared prayer / practice.",
    },
    scene: (lang) => (
      <PhoneFrame
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
            <label>{lang === "ko" ? "성경 본문 *" : "Scripture *"}</label>
            <input readOnly value={lang === "ko" ? "요한복음 15:1-8" : "John 15:1-8"} />
          </div>
          <div className="field">
            <label>
              {lang === "ko" ? "핵심 한 줄 *" : "One-line point *"}{" "}
              <Vis kind="private" lang={lang} />
            </label>
            <input
              readOnly
              value={
                lang === "ko"
                  ? "포도나무에 붙어 있으라"
                  : "Abide in the vine"
              }
            />
          </div>
          <div className="field">
            <label>
              {lang === "ko" ? "기도 제목" : "Prayer"} <Vis kind="shared" lang={lang} />
            </label>
            <input
              readOnly
              value={lang === "ko" ? "인내, 가족" : "patience, family"}
            />
          </div>
          <div className="field">
            <label>
              {lang === "ko" ? "이번 주 실천" : "Practice"}{" "}
              <Vis kind="shared" lang={lang} />
            </label>
            <input
              readOnly
              value={
                lang === "ko"
                  ? "매일 5분 말씀 붙들기"
                  : "5 min in the Word daily"
              }
            />
          </div>
          <Button style={{ width: "100%", marginTop: 8 }}>
            {lang === "ko" ? "이번 주 말씀 저장" : "Save this week's Word"}
          </Button>
        </GlassCard>
      </PhoneFrame>
    ),
  },
  {
    id: "today-check",
    act: "2 · Daily",
    title: { ko: "오늘 · 기도 체크", en: "Today · prayer check-in" },
    goal: {
      ko: "매일 CUJ. 기도한 뒤 체크 → 한 주의 리듬.",
      en: "Daily CUJ: pray, then check in.",
    },
    scene: (lang) => (
      <PhoneFrame
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
          <p className="pill">{lang === "ko" ? "이번 주 말씀" : "This week's Word"}</p>
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
            {lang === "ko" ? "하루 한 번 · 말씀과 함께" : "Once a day · with the Word"}
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
          <p className="hint">
            {lang === "ko"
              ? "기도한 뒤, 여기만 눌러주세요."
              : "After you pray, just tap here."}
          </p>
        </GlassCard>
      </PhoneFrame>
    ),
  },
  {
    id: "pray-together",
    act: "3 · Group",
    title: { ko: "마음을 담아", en: "From the heart" },
    goal: {
      ko: "Accountability buddy. 그룹원 기도제목을 보고 “기도했어”를 보냅니다.",
      en: "Accountability: see their prayer, send “I prayed”.",
    },
    scene: (lang) => (
      <PhoneFrame
        brand={lang === "ko" ? "함께묵상" : "After Sermon"}
        title={lang === "ko" ? "오늘의 말씀" : "Today's Word"}
        sub={lang === "ko" ? "한 주를 함께 기도해요" : "Pray the week together"}
        nav="today"
      >
        <GlassCard style={{ textAlign: "center" }}>
          <div className="check-orb done" style={{ margin: "0 auto 10px" }}>
            {lang === "ko" ? (
              <>
                완료
                <br />
                <span style={{ fontSize: "0.85rem" }}>잘했어요</span>
              </>
            ) : (
              <>
                Done
                <br />
                <span style={{ fontSize: "0.85rem" }}>Well done</span>
              </>
            )}
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
              <div style={{ minWidth: 0, flex: 1 }}>
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
              <div style={{ minWidth: 0, flex: 1 }}>
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
      </PhoneFrame>
    ),
  },
  {
    id: "group",
    act: "3 · Group",
    title: { ko: "그룹 · 시즌", en: "Group · season" },
    goal: {
      ko: "셀/친구 초대. 시즌을 정해 함께 걷습니다.",
      en: "Invite cell/friends. Walk a defined season.",
    },
    scene: (lang) => (
      <PhoneFrame
        brand={lang === "ko" ? "함께묵상" : "After Sermon"}
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
        <GlassCard>
          <p className="pill">{lang === "ko" ? "한 줄 나눔" : "One-line share"}</p>
          <p className="hint" style={{ marginTop: 10 }}>
            {lang === "ko"
              ? "포도나무에 붙어 있으라는 말이 계속 남아요."
              : "“Abide in the vine” keeps coming back."}
          </p>
          <p className="tiny" style={{ marginTop: 6 }}>
            {lang === "ko" ? "수아 · 화" : "Sua · Tue"}
          </p>
        </GlassCard>
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
          <div className="prayer-arrows" style={{ marginTop: 12 }}>
            <p className="prayer-arrows-hint">
              {lang === "ko" ? "최근 기도 연결 3" : "Recent prayer links · 3"}
            </p>
            <div className="prayer-arrows-map" style={{ minHeight: 132 }}>
              <div className="prayer-arrows-col">
                {(lang === "ko"
                  ? ["나", "수아", "준호"]
                  : ["Me", "Sua", "June"]
                ).map((name) => (
                  <div key={`L-${name}`} className="prayer-arrows-person">
                    <span className="prayer-arrows-avatar" aria-hidden>
                      {name.slice(0, 1)}
                    </span>
                    <span className="prayer-arrows-name">{name}</span>
                  </div>
                ))}
              </div>
              <div className="prayer-arrows-col prayer-arrows-col-right">
                {(lang === "ko"
                  ? ["나", "수아", "준호"]
                  : ["Me", "Sua", "June"]
                ).map((name) => (
                  <div key={`R-${name}`} className="prayer-arrows-person">
                    <span className="prayer-arrows-avatar" aria-hidden>
                      {name.slice(0, 1)}
                    </span>
                    <span className="prayer-arrows-name">{name}</span>
                  </div>
                ))}
              </div>
              <svg
                className="prayer-arrows-svg"
                viewBox="0 0 280 132"
                preserveAspectRatio="none"
                aria-hidden
              >
                <defs>
                  <marker
                    id="sb-arrow-0"
                    markerWidth="7"
                    markerHeight="7"
                    refX="6"
                    refY="3.5"
                    orient="auto"
                  >
                    <path d="M 0 0 L 7 3.5 L 0 7 z" className="prayer-arrow-fill-0" />
                  </marker>
                  <marker
                    id="sb-arrow-1"
                    markerWidth="7"
                    markerHeight="7"
                    refX="6"
                    refY="3.5"
                    orient="auto"
                  >
                    <path d="M 0 0 L 7 3.5 L 0 7 z" className="prayer-arrow-fill-1" />
                  </marker>
                  <marker
                    id="sb-arrow-2"
                    markerWidth="7"
                    markerHeight="7"
                    refX="6"
                    refY="3.5"
                    orient="auto"
                  >
                    <path d="M 0 0 L 7 3.5 L 0 7 z" className="prayer-arrow-fill-2" />
                  </marker>
                </defs>
                <path
                  d="M 72 22 C 140 22, 140 66, 208 66"
                  className="prayer-arrow-stroke prayer-arrow-stroke-0"
                  fill="none"
                  markerEnd="url(#sb-arrow-0)"
                />
                <path
                  d="M 72 66 C 140 66, 140 22, 208 22"
                  className="prayer-arrow-stroke prayer-arrow-stroke-1"
                  fill="none"
                  markerEnd="url(#sb-arrow-1)"
                />
                <path
                  d="M 72 110 C 140 110, 140 66, 208 66"
                  className="prayer-arrow-stroke prayer-arrow-stroke-2"
                  fill="none"
                  markerEnd="url(#sb-arrow-2)"
                />
              </svg>
            </div>
          </div>
        </GlassCard>
      </PhoneFrame>
    ),
  },
  {
    id: "archive",
    act: "4 · Reflect",
    title: { ko: "보관함", en: "Archive" },
    goal: {
      ko: "시즌을 돌아보며 “우리가 같이 걸었구나”를 남깁니다.",
      en: "Look back: we walked this week together.",
    },
    scene: (lang) => (
      <PhoneFrame
        brand={lang === "ko" ? "함께묵상" : "After Sermon"}
        title={lang === "ko" ? "보관함" : "Archive"}
        sub={
          lang === "ko"
            ? "한 주를 말씀과 함께한 기록을 돌아봐요"
            : "Look back on weeks with the Word"
        }
        nav="archive"
      >
        <div className="archive-tabs" style={{ marginBottom: 12 }}>
          <span className="archive-tab active">
            {lang === "ko" ? "주간" : "Weeks"}
          </span>
          <span className="archive-tab">
            {lang === "ko" ? "일간" : "Days"}
          </span>
          <span className="archive-tab">
            {lang === "ko" ? "한달" : "Month"}
          </span>
        </div>
        <GlassCard>
          <p className="pill">{lang === "ko" ? "이번 주" : "This week"}</p>
          <p className="word-verse-sm" style={{ marginTop: 10 }}>
            {lang === "ko" ? "요한복음 15:1-8" : "John 15:1-8"}
          </p>
          <p style={{ margin: "0 0 6px", fontWeight: 600 }}>
            {lang === "ko" ? "포도나무에 붙어 있으라" : "Abide in the vine"}
          </p>
          <p className="hint">
            {lang === "ko"
              ? "체크 5일 · 기도 토큰 3"
              : "5 check-ins · 3 prayer tokens"}
          </p>
        </GlassCard>
        <GlassCard>
          <p className="pill">{lang === "ko" ? "지난 주" : "Last week"}</p>
          <p className="word-verse-sm" style={{ marginTop: 10 }}>
            {lang === "ko" ? "시편 23:1-6" : "Psalm 23:1-6"}
          </p>
          <p className="hint" style={{ marginTop: 8 }}>
            {lang === "ko"
              ? "체크 7일 · 기도 토큰 8"
              : "7 check-ins · 8 prayer tokens"}
          </p>
        </GlassCard>
      </PhoneFrame>
    ),
  },
];

export default function StoryboardPage() {
  const [index, setIndex] = useState(0);
  const [lang, setLang] = useState<Lang>("ko");

  useEffect(() => {
    document.documentElement.dataset.theme = "after";
  }, []);

  const step = STEPS[index];
  const atStart = index === 0;
  const atEnd = index === STEPS.length - 1;

  return (
    <div className="storyboard">
      <aside className="storyboard-rail">
        <p className="brand" style={{ marginBottom: 4 }}>
          {lang === "ko" ? "함께묵상" : "After Sermon"}
        </p>
        <h1 className="storyboard-title">
          {lang === "ko" ? "CUJ 스토리보드" : "CUJ Storyboard"}
        </h1>
        <p className="hint" style={{ margin: "8px 0 16px" }}>
          {lang === "ko"
            ? "설교 이후, 한 주를 함께"
            : "Pray the week together"}
        </p>

        <div className="storyboard-lang">
          <button
            type="button"
            className={lang === "ko" ? "active" : ""}
            onClick={() => setLang("ko")}
          >
            한국어
          </button>
          <button
            type="button"
            className={lang === "en" ? "active" : ""}
            onClick={() => setLang("en")}
          >
            English
          </button>
        </div>

        <ol className="storyboard-steps">
          {STEPS.map((s, i) => (
            <li key={s.id}>
              <button
                type="button"
                className={`storyboard-step ${i === index ? "active" : ""}`}
                onClick={() => setIndex(i)}
              >
                <span className="storyboard-step-act">{s.act}</span>
                <span className="storyboard-step-title">{s.title[lang]}</span>
              </button>
            </li>
          ))}
        </ol>
      </aside>

      <main className="storyboard-stage">
        <div className="storyboard-meta">
          <p className="pill">{step.act}</p>
          <h2>{step.title[lang]}</h2>
          <p className="hint">{step.goal[lang]}</p>
        </div>

        <div className="storyboard-frame">{step.scene(lang)}</div>

        <div className="storyboard-controls">
          <Button
            variant="soft"
            disabled={atStart}
            onClick={() => setIndex((i) => Math.max(0, i - 1))}
          >
            {lang === "ko" ? "이전" : "Back"}
          </Button>
          <span className="tiny">
            {index + 1} / {STEPS.length}
          </span>
          <Button
            disabled={atEnd}
            onClick={() => setIndex((i) => Math.min(STEPS.length - 1, i + 1))}
          >
            {lang === "ko" ? "다음" : "Next"}
          </Button>
        </div>
      </main>
    </div>
  );
}
