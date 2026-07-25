import type { ThemeId } from "./themes";

export type MemberId = string;

export type Member = {
  id: MemberId;
  name: string;
  isMe?: boolean;
  /** Profile / Google avatar URL when available */
  avatarUrl?: string;
  /** Optional emoji override shown instead of avatarUrl */
  avatarEmoji?: string;
  /** 그룹에 공개되는 짧은 기도 제목/키워드 */
  prayerRequest?: string;
  meditationPoint?: string;
  practice?: string;
};

/** 상반기 / 하반기 / 일년 / 단기 / 직접 설정 */
export type GroupPeriodPreset = "h1" | "h2" | "year" | "short" | "custom";

export type GroupStatus = "active" | "ended";

/** 클라우드 그룹 시즌 요약 — 묵상(weeks)과 분리 */
export type GroupSummary = {
  id: string;
  name: string;
  inviteCode: string;
  periodPreset: GroupPeriodPreset;
  periodLabel: string;
  startsAt: string;
  endsAt: string | null;
  status: GroupStatus;
  createdBy: string;
  createdAt: string;
};

/** @deprecated local-demo shape; prefer GroupSummary */
export type Group = GroupSummary & {
  members: Member[];
};

export type WeekCapture = {
  id: string;
  /** 그 주 일요일 YYYY-MM-DD */
  weekKey: string;
  /** Chapter / reference for Today week card (e.g. John 15 or John 15:1-8) */
  scripture: string;
  /** User-entered passage text for Today → Read (5 min) */
  passage?: string;
  /** 개인용 */
  briefPoint: string;
  /** 개인용 */
  firstThought: string;
  /** 개인용 */
  notes?: string;
  /** 그룹 공개 */
  prayerRequest?: string;
  /** 그룹 공개 */
  meditationPoint?: string;
  /** 그룹 공개 · 이번 주 실천 */
  practice?: string;
  createdAt: string;
  updatedAt: string;
};

export type CheerPost = {
  id: string;
  authorId: MemberId;
  authorName: string;
  text: string;
  createdAt: string;
  weekKey?: string;
  groupId?: string;
  groupName?: string;
};

export type PrayerToken = {
  id: string;
  fromId: MemberId;
  fromName: string;
  toId: MemberId;
  toName?: string;
  dateKey: string;
  createdAt: string;
  groupId?: string;
  groupName?: string;
};

export type QuestionPost = {
  id: string;
  text: string;
  isAnonymous: boolean;
  authorName?: string;
  createdAt: string;
  aiReply?: string;
  weekKey?: string;
};

export type DailyCheck = {
  dateKey: string;
  completedAt: string;
  weekKey: string;
};

export type AppSettings = {
  displayName: string;
  themeId: ThemeId;
  nudgeTime: string; // HH:mm
  groupEnabled: boolean;
  /** Optional emoji avatar override (takes display priority over avatarUrl) */
  avatarEmoji?: string | null;
  /** Lifetime: account already generated an AI reply */
  aiReplyUsedAt?: string | null;
  /** Lifetime: account already copied pastor summary */
  pastorSummaryCopiedAt?: string | null;
};

export type FeedbackKind = "feedback" | "fix";

export type FeedbackNote = {
  id: string;
  kind: FeedbackKind;
  text: string;
  createdAt: string;
};

export type AppState = {
  settings: AppSettings;
  /** @deprecated use weeks + current week helper */
  capture: WeekCapture | null;
  /** 개인 묵상 — 그룹 시즌과 독립 */
  weeks: WeekCapture[];
  checks: DailyCheck[];
  members: Member[];
  cheers: CheerPost[];
  tokens: PrayerToken[];
  questions: QuestionPost[];
  feedbacks: FeedbackNote[];
};
