"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { weekKeyFromDate } from "@/lib/dates";
import { todayKey } from "@/lib/demo-data";
import {
  createGroup,
  endGroupSeason,
  joinGroupByCode,
  leaveGroup,
  loadCloudBundle,
  uploadAvatarPhoto,
  type CreateGroupInput,
} from "@/lib/cloud/api";
import { normalizeInviteCode } from "@/lib/groups";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";
import { applyBrandTheme, DEFAULT_THEME } from "@/lib/themes";
import type {
  AppState,
  FeedbackKind,
  GroupSummary,
  PrayerToken,
  WeekCapture,
} from "@/lib/types";
import { useAuth } from "@/context/AuthProvider";
import { useLocale } from "@/context/LocaleProvider";

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
  checkedMemberIds: Set<string>;
  groupId: string | null;
  inviteCode: string | null;
  activeGroup: GroupSummary | null;
  pastGroups: GroupSummary[];
  cloudError: string | null;
  refresh: () => Promise<void>;
  setNudgeTime: (time: string) => void;
  setDisplayName: (name: string) => void;
  setAvatarEmoji: (emoji: string | null) => Promise<void>;
  setAvatarPhoto: (file: File) => Promise<void>;
  clearAvatarPhoto: () => Promise<void>;
  setGroupEnabled: (on: boolean) => void;
  saveCapture: (capture: CaptureInput) => Promise<void>;
  checkOffToday: () => Promise<void>;
  addCheer: (text: string) => Promise<void>;
  sendToken: (toId: string) => Promise<void>;
  addQuestion: (text: string, isAnonymous: boolean) => Promise<void>;
  pastorSummary: () => string;
  markPastorSummaryCopied: () => Promise<void>;
  addFeedback: (kind: FeedbackKind, text: string) => Promise<void>;
  createMyGroup: (input?: CreateGroupInput) => Promise<void>;
  joinGroup: (code: string) => Promise<void>;
  leaveMyGroup: () => Promise<void>;
  endMyGroupSeason: () => Promise<void>;
};

const AppContext = createContext<AppContextValue | null>(null);

const emptyState = (): AppState => ({
  settings: {
    displayName: "나",
    themeId: DEFAULT_THEME,
    nudgeTime: "08:00",
    groupEnabled: true,
  },
  capture: null,
  weeks: [],
  checks: [],
  members: [],
  cheers: [],
  tokens: [],
  questions: [],
  feedbacks: [],
});

export function AppProvider({ children }: { children: ReactNode }) {
  const { user, ready: authReady } = useAuth();
  const { t } = useLocale();
  const [state, setState] = useState<AppState>(emptyState);
  const [groupId, setGroupId] = useState<string | null>(null);
  const [inviteCode, setInviteCode] = useState<string | null>(null);
  const [activeGroup, setActiveGroup] = useState<GroupSummary | null>(null);
  const [pastGroups, setPastGroups] = useState<GroupSummary[]>([]);
  const [groupChecksToday, setGroupChecksToday] = useState<Set<string>>(
    new Set(),
  );
  const [ready, setReady] = useState(false);
  const [cloudError, setCloudError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    if (!user) {
      setState(emptyState());
      setGroupId(null);
      setInviteCode(null);
      setActiveGroup(null);
      setPastGroups([]);
      setReady(true);
      return;
    }
    const supabase = getSupabaseBrowserClient();
    if (!supabase) {
      setCloudError("Supabase client missing");
      setReady(true);
      return;
    }
    try {
      setCloudError(null);
      const fallbackName =
        user.user_metadata?.full_name ||
        user.user_metadata?.name ||
        user.email?.split("@")[0] ||
        "나";
      const avatarFallback =
        (typeof user.user_metadata?.avatar_url === "string" &&
          user.user_metadata.avatar_url) ||
        (typeof user.user_metadata?.picture === "string" &&
          user.user_metadata.picture) ||
        null;
      const bundle = await loadCloudBundle(
        supabase,
        user.id,
        fallbackName,
        avatarFallback,
      );
      applyBrandTheme();
      setState({
        ...bundle.state,
        settings: { ...bundle.state.settings, themeId: DEFAULT_THEME },
      });
      setGroupId(bundle.groupId);
      setInviteCode(bundle.inviteCode);
      setActiveGroup(bundle.activeGroup);
      setPastGroups(bundle.pastGroups);
      if (bundle.groupId) {
        const memberIds = bundle.state.members.map((m) => m.id);
        const { data } = await supabase
          .from("daily_checks")
          .select("user_id")
          .eq("date_key", todayKey())
          .in("user_id", memberIds);
        setGroupChecksToday(new Set((data ?? []).map((r) => r.user_id)));
      } else {
        setGroupChecksToday(new Set());
      }
    } catch (e) {
      setCloudError(e instanceof Error ? e.message : "불러오기 실패");
    } finally {
      setReady(true);
    }
  }, [user]);

  useEffect(() => {
    if (!authReady) return;
    setReady(false);
    void refresh();
  }, [authReady, refresh]);

  useEffect(() => {
    applyBrandTheme();
  }, []);

  if (!authReady || !ready) {
    return (
      <div className="flex min-h-dvh items-center justify-center text-[var(--ink-soft)]">
        불러오는 중…
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const date = todayKey();
  const weekKey = weekKeyFromDate();
  const currentWeek =
    state.weeks.find((w) => w.weekKey === weekKey) ?? null;
  const hasCheckedToday = state.checks.some((c) => c.dateKey === date);
  const tokensReceivedToday = state.tokens.filter(
    (t) => t.toId === user.id && t.dateKey === date,
  );
  const unfinishedMembers = state.members.filter(
    (m) => !m.isMe && !groupChecksToday.has(m.id),
  );

  const supabase = getSupabaseBrowserClient()!;

  const value: AppContextValue = {
    ready: true,
    state,
    currentWeek,
    hasCheckedToday,
    tokensReceivedToday,
    unfinishedMembers,
    checkedMemberIds: groupChecksToday,
    groupId,
    inviteCode,
    activeGroup,
    pastGroups,
    cloudError,
    refresh,
    setNudgeTime: (time) => {
      setState((s) => ({
        ...s,
        settings: { ...s.settings, nudgeTime: time },
      }));
      void supabase
        .from("profiles")
        .update({ nudge_time: time, updated_at: new Date().toISOString() })
        .eq("id", user.id);
    },
    setDisplayName: (name) => {
      const displayName = name.trim() || "나";
      setState((s) => ({
        ...s,
        settings: { ...s.settings, displayName },
        members: s.members.map((m) =>
          m.isMe ? { ...m, name: displayName } : m,
        ),
      }));
      void supabase
        .from("profiles")
        .update({
          display_name: displayName,
          updated_at: new Date().toISOString(),
        })
        .eq("id", user.id);
    },
    setAvatarEmoji: async (emoji) => {
      const next =
        typeof emoji === "string" && emoji.trim() ? emoji.trim() : null;
      const { error } = await supabase
        .from("profiles")
        .update({
          avatar_emoji: next,
          updated_at: new Date().toISOString(),
        })
        .eq("id", user.id);
      if (error) throw error;
      setState((s) => ({
        ...s,
        settings: { ...s.settings, avatarEmoji: next },
        members: s.members.map((m) =>
          m.isMe
            ? { ...m, avatarEmoji: next || undefined }
            : m,
        ),
      }));
    },
    setAvatarPhoto: async (file) => {
      const url = await uploadAvatarPhoto(supabase, user.id, file);
      const { error } = await supabase
        .from("profiles")
        .update({
          avatar_url: url,
          avatar_emoji: null,
          updated_at: new Date().toISOString(),
        })
        .eq("id", user.id);
      if (error) throw error;
      setState((s) => ({
        ...s,
        settings: { ...s.settings, avatarEmoji: null },
        members: s.members.map((m) =>
          m.isMe
            ? { ...m, avatarUrl: url, avatarEmoji: undefined }
            : m,
        ),
      }));
    },
    clearAvatarPhoto: async () => {
      const google =
        (typeof user.user_metadata?.avatar_url === "string" &&
          user.user_metadata.avatar_url) ||
        (typeof user.user_metadata?.picture === "string" &&
          user.user_metadata.picture) ||
        null;
      const { error } = await supabase
        .from("profiles")
        .update({
          avatar_url: google,
          updated_at: new Date().toISOString(),
        })
        .eq("id", user.id);
      if (error) throw error;
      setState((s) => ({
        ...s,
        members: s.members.map((m) =>
          m.isMe
            ? { ...m, avatarUrl: google || undefined }
            : m,
        ),
      }));
    },
    setGroupEnabled: (on) => {
      setState((s) => ({
        ...s,
        settings: { ...s.settings, groupEnabled: on },
      }));
      void supabase
        .from("profiles")
        .update({
          group_enabled: on,
          updated_at: new Date().toISOString(),
        })
        .eq("id", user.id);
    },
    saveCapture: async (capture) => {
      const now = new Date().toISOString();
      const { error } = await supabase
        .from("week_captures")
        .upsert(
          {
            user_id: user.id,
            week_key: weekKey,
            scripture: capture.scripture,
            passage: capture.passage?.trim() || null,
            brief_point: capture.briefPoint,
            first_thought: capture.firstThought,
            notes: capture.notes ?? null,
            prayer_request: capture.prayerRequest ?? null,
            meditation_point: capture.meditationPoint ?? null,
            practice: capture.practice ?? null,
            updated_at: now,
          },
          { onConflict: "user_id,week_key" },
        )
        .select("*")
        .single();
      if (error) throw error;
      await refresh();
    },
    checkOffToday: async () => {
      if (hasCheckedToday) return;
      const { error } = await supabase.from("daily_checks").insert({
        user_id: user.id,
        date_key: date,
        week_key: weekKey,
      });
      if (error) throw error;
      await refresh();
    },
    addCheer: async (text) => {
      if (!groupId) throw new Error("그룹이 필요해요.");
      const { error } = await supabase.from("cheers").insert({
        group_id: groupId,
        author_id: user.id,
        text: text.trim(),
        week_key: weekKey,
      });
      if (error) throw error;
      await refresh();
    },
    sendToken: async (toId) => {
      if (!groupId || !activeGroup) throw new Error("그룹이 필요해요.");
      if (!hasCheckedToday) return;
      const target = state.members.find((m) => m.id === toId);
      const { error } = await supabase.from("prayer_tokens").insert({
        group_id: groupId,
        from_id: user.id,
        to_id: toId,
        date_key: date,
        from_name: state.settings.displayName || "나",
        to_name: target?.name ?? "멤버",
        group_name: activeGroup.name,
      });
      if (error) throw error;
      await refresh();
    },
    addQuestion: async (text, isAnonymous) => {
      if (!groupId) throw new Error("그룹이 필요해요.");
      const { error } = await supabase.from("questions").insert({
        group_id: groupId,
        author_id: isAnonymous ? null : user.id,
        text: text.trim(),
        is_anonymous: isAnonymous,
        week_key: weekKey,
      });
      if (error) throw error;
      await refresh();
    },
    pastorSummary: () => {
      if (state.questions.length === 0) return t("questions.summaryEmpty");
      const lines = state.questions.map(
        (q, i) =>
          `${i + 1}. ${q.isAnonymous ? t("questions.anonymousParen") : q.authorName}: ${q.text}`,
      );
      return `${t("questions.summaryHeader")}\n\n${lines.join("\n")}\n\n${t("questions.summaryFooter")}`;
    },
    markPastorSummaryCopied: async () => {
      if (state.settings.pastorSummaryCopiedAt) {
        throw new Error(t("errors.pastorSummaryUsed"));
      }
      const now = new Date().toISOString();
      const { data, error } = await supabase
        .from("profiles")
        .update({
          pastor_summary_copied_at: now,
          updated_at: now,
        })
        .eq("id", user.id)
        .is("pastor_summary_copied_at", null)
        .select("pastor_summary_copied_at")
        .maybeSingle();
      if (error) throw error;
      if (!data) {
        throw new Error(t("errors.pastorSummaryUsed"));
      }
      setState((s) => ({
        ...s,
        settings: { ...s.settings, pastorSummaryCopiedAt: now },
      }));
    },
    addFeedback: async (kind, text) => {
      const { error } = await supabase.from("feedbacks").insert({
        user_id: user.id,
        kind,
        text: text.trim(),
      });
      if (error) throw error;
      await refresh();
    },
    createMyGroup: async (input) => {
      if (groupId) {
        throw new Error("이미 그룹에 있어요. 나간 뒤 새 시즌을 시작하세요.");
      }
      await createGroup(supabase, user.id, input);
      await refresh();
    },
    joinGroup: async (code) => {
      const normalized = normalizeInviteCode(code);

      // Already in this group → sync (formatted codes like "3081 F9E1" OK)
      if (
        groupId &&
        inviteCode &&
        normalizeInviteCode(inviteCode) === normalized
      ) {
        await refresh();
        return;
      }

      if (groupId) {
        throw new Error(
          "이미 그룹에 있어요. 나간 뒤 다른 코드로 참여하세요.",
        );
      }

      // Fresh join or rejoin after leave — RPC clears left_at if prior member
      await joinGroupByCode(supabase, user.id, normalized);
      await refresh();
    },
    leaveMyGroup: async () => {
      if (!groupId) return;
      await leaveGroup(supabase, groupId);
      await refresh();
    },
    endMyGroupSeason: async () => {
      if (!groupId) return;
      await endGroupSeason(supabase, groupId);
      await refresh();
    },
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used within AppProvider");
  return ctx;
}
