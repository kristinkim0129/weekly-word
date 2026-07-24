"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { weekKeyFromDate } from "@/lib/dates";
import { ME_ID, mockAiReply, todayKey } from "@/lib/demo-data";
import { getCurrentWeek, loadState, saveState } from "@/lib/storage";
import type { ThemeId } from "@/lib/themes";
import type {
  AppState,
  CheerPost,
  FeedbackKind,
  FeedbackNote,
  Handout,
  PrayerToken,
  QuestionPost,
  WeekCapture,
} from "@/lib/types";

type CaptureInput = Omit<
  WeekCapture,
  "id" | "weekKey" | "createdAt" | "updatedAt"
>;

type AppContextValue = {
  ready: boolean;
  state: AppState;
  currentWeek: WeekCapture | null;
  hasCheckedToday: boolean;
  tokensReceivedToday: PrayerToken[];
  unfinishedMembers: AppState["members"];
  setTheme: (id: ThemeId) => void;
  setNudgeTime: (time: string) => void;
  setDisplayName: (name: string) => void;
  setGroupEnabled: (on: boolean) => void;
  saveCapture: (capture: CaptureInput) => void;
  checkOffToday: () => void;
  addCheer: (text: string) => void;
  sendToken: (toId: string) => void;
  uploadHandout: (file: File) => Promise<void>;
  addQuestion: (text: string, isAnonymous: boolean) => void;
  askAi: (questionId: string) => void;
  pastorSummary: () => string;
  addFeedback: (kind: FeedbackKind, text: string) => void;
};

const AppContext = createContext<AppContextValue | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AppState | null>(null);

  useEffect(() => {
    const loaded = loadState();
    setState(loaded);
    document.documentElement.dataset.theme = loaded.settings.themeId;
  }, []);

  useEffect(() => {
    if (!state) return;
    saveState(state);
    document.documentElement.dataset.theme = state.settings.themeId;
  }, [state]);

  if (!state) {
    return (
      <div className="flex min-h-dvh items-center justify-center text-[var(--ink-soft)]">
        불러오는 중…
      </div>
    );
  }

  const date = todayKey();
  const weekKey = weekKeyFromDate();
  const currentWeek = getCurrentWeek(state);
  const hasCheckedToday = state.checks.some((c) => c.dateKey === date);
  const tokensReceivedToday = state.tokens.filter(
    (t) => t.toId === ME_ID && t.dateKey === date,
  );
  // Demo: 수진(m2)은 이미 체크 완료, 나머지는 미완료로 표시
  const unfinishedMembers = state.members.filter(
    (m) => !m.isMe && m.id !== "m2",
  );

  const update = (fn: (prev: AppState) => AppState) =>
    setState((prev) => (prev ? fn(prev) : prev));

  const value: AppContextValue = {
    ready: true,
    state,
    currentWeek,
    hasCheckedToday,
    tokensReceivedToday,
    unfinishedMembers,
    setTheme: (id) =>
      update((s) => ({
        ...s,
        settings: { ...s.settings, themeId: id },
      })),
    setNudgeTime: (time) =>
      update((s) => ({
        ...s,
        settings: { ...s.settings, nudgeTime: time },
      })),
    setDisplayName: (name) =>
      update((s) => ({
        ...s,
        settings: { ...s.settings, displayName: name },
        members: s.members.map((m) =>
          m.isMe ? { ...m, name: name || "나" } : m,
        ),
      })),
    setGroupEnabled: (on) =>
      update((s) => ({
        ...s,
        settings: { ...s.settings, groupEnabled: on },
      })),
    saveCapture: (capture) =>
      update((s) => {
        const now = new Date().toISOString();
        const existing = s.weeks.find((w) => w.weekKey === weekKey);
        const entry: WeekCapture = existing
          ? {
              ...existing,
              ...capture,
              weekKey,
              updatedAt: now,
            }
          : {
              ...capture,
              id: crypto.randomUUID(),
              weekKey,
              createdAt: now,
              updatedAt: now,
            };

        const weeks = existing
          ? s.weeks.map((w) => (w.weekKey === weekKey ? entry : w))
          : [entry, ...s.weeks];

        return {
          ...s,
          weeks,
          capture: entry,
          members: s.members.map((m) =>
            m.isMe
              ? {
                  ...m,
                  prayerRequest: capture.prayerRequest,
                  meditationPoint: capture.meditationPoint,
                  practice: capture.practice,
                }
              : m,
          ),
        };
      }),
    checkOffToday: () =>
      update((s) => {
        if (s.checks.some((c) => c.dateKey === date)) return s;
        return {
          ...s,
          checks: [
            {
              dateKey: date,
              completedAt: new Date().toISOString(),
              weekKey,
            },
            ...s.checks,
          ],
        };
      }),
    addCheer: (text) =>
      update((s) => {
        const post: CheerPost = {
          id: crypto.randomUUID(),
          authorId: ME_ID,
          authorName: s.settings.displayName || "나",
          text: text.trim(),
          createdAt: new Date().toISOString(),
          weekKey,
        };
        return { ...s, cheers: [post, ...s.cheers] };
      }),
    sendToken: (toId) =>
      update((s) => {
        const checked = s.checks.some((c) => c.dateKey === date);
        if (!checked) return s;
        const already = s.tokens.some(
          (t) => t.fromId === ME_ID && t.toId === toId && t.dateKey === date,
        );
        if (already) return s;
        const target = s.members.find((m) => m.id === toId);
        if (!target || target.isMe) return s;
        const token: PrayerToken = {
          id: crypto.randomUUID(),
          fromId: ME_ID,
          fromName: s.settings.displayName || "나",
          toId,
          dateKey: date,
          createdAt: new Date().toISOString(),
        };
        return { ...s, tokens: [token, ...s.tokens] };
      }),
    uploadHandout: async (file) => {
      const dataUrl = await readFileAsDataUrl(file);
      const handout: Handout = {
        name: file.name,
        type: file.type,
        size: file.size,
        dataUrl: file.size < 1_500_000 ? dataUrl : undefined,
        uploadedAt: new Date().toISOString(),
        uploadedBy: state.settings.displayName || "나",
        weekKey,
      };
      update((s) => ({ ...s, handout }));
    },
    addQuestion: (text, isAnonymous) =>
      update((s) => {
        const q: QuestionPost = {
          id: crypto.randomUUID(),
          text: text.trim(),
          isAnonymous,
          authorName: isAnonymous
            ? undefined
            : s.settings.displayName || "나",
          createdAt: new Date().toISOString(),
          weekKey,
        };
        return { ...s, questions: [q, ...s.questions] };
      }),
    askAi: (questionId) =>
      update((s) => ({
        ...s,
        questions: s.questions.map((q) => {
          if (q.id !== questionId || q.aiReply) return q;
          const { reply, disclaimer } = mockAiReply(q.text);
          return {
            ...q,
            aiReply: `${reply}\n\n— ${disclaimer}`,
          };
        }),
      })),
    pastorSummary: () => {
      if (state.questions.length === 0) return "아직 질문이 없어요.";
      const lines = state.questions.map(
        (q, i) =>
          `${i + 1}. ${q.isAnonymous ? "(익명)" : q.authorName}: ${q.text}`,
      );
      return `이번 주 소그룹 질문 요약\n\n${lines.join("\n")}\n\n— Weekly Word에서 공유됨`;
    },
    addFeedback: (kind, text) =>
      update((s) => {
        const note: FeedbackNote = {
          id: crypto.randomUUID(),
          kind,
          text: text.trim(),
          createdAt: new Date().toISOString(),
        };
        return { ...s, feedbacks: [note, ...(s.feedbacks ?? [])] };
      }),
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used within AppProvider");
  return ctx;
}

function readFileAsDataUrl(file: File) {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}
