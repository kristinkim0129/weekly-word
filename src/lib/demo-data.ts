import { toDateKey, weekKeyFromDate } from "./dates";
import type { AppState, WeekCapture } from "./types";
import { DEFAULT_THEME } from "./themes";

export const ME_ID = "me";

function daysAgo(n: number) {
  const d = new Date();
  d.setDate(d.getDate() - n);
  d.setHours(12, 0, 0, 0);
  return d;
}

function makeWeek(
  daysBack: number,
  data: Omit<WeekCapture, "id" | "weekKey" | "createdAt" | "updatedAt">,
): WeekCapture {
  const past = daysAgo(daysBack);
  const weekKey = weekKeyFromDate(past);
  const createdAt = past.toISOString();
  return {
    id: `week-sample-${weekKey}`,
    weekKey,
    createdAt,
    updatedAt: createdAt,
    ...data,
  };
}

export function createInitialState(): AppState {
  const weeks = [
    makeWeek(7, {
      scripture: "시편 23:1-3",
      briefPoint: "여호와는 나의 목자시니",
      firstThought: "바쁠 때도 인도하심을 믿을 수 있을까?",
      notes: "푸른 초장 — 쉼이 부족할 때 떠올린 구절",
      prayerRequest: "쉼, 집중",
      meditationPoint: "부족함이 없다",
      practice: "점심 전 1분 숨 고르기",
    }),
    makeWeek(28, {
      scripture: "요한복음 15:5",
      briefPoint: "나를 떠나서는 너희가 아무것도 할 수 없음이라",
      firstThought: "혼자 버티려 했던 순간들",
      prayerRequest: "관계, 겸손",
      meditationPoint: "붙어 있어야 열매",
      practice: "하루 한 번 ‘도와주세요’ 기도",
    }),
    makeWeek(90, {
      scripture: "잠언 3:5-6",
      briefPoint: "네 길을 다 맡기라",
      firstThought: "내 계획과 하나님의 인도",
      prayerRequest: "진로, 지혜",
      meditationPoint: "인정하는 자에게 평탄한 길",
      practice: "결정 전 말씀 한 절 읽기",
    }),
    makeWeek(200, {
      scripture: "빌립보서 4:6-7",
      briefPoint: "아무것도 염려하지 말고",
      firstThought: "걱정이 기도로 바뀌려면",
      prayerRequest: "평안, 가족",
      meditationPoint: "감사로 아뢰라",
      practice: "염려를 메모로 적어 기도하기",
    }),
  ];

  // dedupe if same weekKey
  const uniqueWeeks = Object.values(
    Object.fromEntries(weeks.map((w) => [w.weekKey, w])),
  );

  const yesterday = daysAgo(1);
  const twoDays = daysAgo(2);

  return {
    settings: {
      displayName: "나",
      themeId: DEFAULT_THEME,
      nudgeTime: "08:00",
      groupEnabled: true,
    },
    capture: null,
    weeks: uniqueWeeks,
    checks: [
      {
        dateKey: toDateKey(yesterday),
        completedAt: yesterday.toISOString(),
        weekKey: weekKeyFromDate(yesterday),
      },
      {
        dateKey: toDateKey(twoDays),
        completedAt: twoDays.toISOString(),
        weekKey: weekKeyFromDate(twoDays),
      },
    ],
    members: [
      { id: ME_ID, name: "나", isMe: true },
      {
        id: "m2",
        name: "수진",
        prayerRequest: "채용, 인내",
        meditationPoint: "포도나무에 붙어 있기",
        practice: "아침에 말씀 한 절",
      },
      {
        id: "m3",
        name: "준호",
        prayerRequest: "가족 건강, 직장",
        meditationPoint: "걱정 대신 맡기기",
        practice: "불평 대신 감사 한 마디",
      },
      {
        id: "m4",
        name: "예린",
        prayerRequest: "결정, 평안",
        meditationPoint: "말씀을 삶으로",
        practice: "하루 한 번 기도 멈춤",
      },
    ],
    cheers: [
      {
        id: "c1",
        authorId: "m2",
        authorName: "수진",
        text: "오늘도 이 말씀 붙잡고 출근해요 💛",
        createdAt: new Date().toISOString(),
        weekKey: weekKeyFromDate(),
      },
    ],
    tokens: [],
    questions: [],
    handout: null,
    feedbacks: [],
  };
}

export function todayKey(date = new Date()) {
  return toDateKey(date);
}

export function mockAiReply(question: string) {
  return {
    reply: `「${question.slice(0, 40)}${question.length > 40 ? "…" : ""}」에 대해, 관련될 수 있는 구절로는 시편 119:105, 잠언 3:5-6이 떠오를 수 있어요. 짧은 묵상 포인트: 하나님께 질문을 가져가는 것 자체가 이미 믿음의 한 걸음입니다.`,
    disclaimer:
      "AI 답변은 참고용이며, 100% 정확하거나 검증된 성경 해석이 아닙니다. 목사님·소그룹과 함께 확인해 주세요.",
  };
}
