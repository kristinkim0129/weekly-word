import type { ThemeId } from "./themes";

export type MemberId = string;

export type Member = {
  id: MemberId;
  name: string;
  isMe?: boolean;
  /** 그룹에 공개되는 짧은 기도 제목/키워드 */
  prayerRequest?: string;
  meditationPoint?: string;
  practice?: string;
};

export type WeekCapture = {
  id: string;
  /** 그 주 일요일 YYYY-MM-DD */
  weekKey: string;
  scripture: string;
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
};

export type PrayerToken = {
  id: string;
  fromId: MemberId;
  fromName: string;
  toId: MemberId;
  dateKey: string;
  createdAt: string;
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

export type Handout = {
  name: string;
  type: string;
  size: number;
  dataUrl?: string;
  uploadedAt: string;
  uploadedBy: string;
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
  weeks: WeekCapture[];
  checks: DailyCheck[];
  members: Member[];
  cheers: CheerPost[];
  tokens: PrayerToken[];
  questions: QuestionPost[];
  handout: Handout | null;
  feedbacks: FeedbackNote[];
};
