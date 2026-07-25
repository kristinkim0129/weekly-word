import type { SupabaseClient } from "@supabase/supabase-js";
import type {
  AppState,
  CheerPost,
  DailyCheck,
  FeedbackNote,
  GroupPeriodPreset,
  GroupSummary,
  Member,
  PrayerToken,
  QuestionPost,
  WeekCapture,
} from "@/lib/types";
import { periodRange } from "@/lib/groups";
import { tStored } from "@/lib/i18n/locale";
import { parseThemeId } from "@/lib/themes";

export type CloudBundle = {
  state: AppState;
  groupId: string | null;
  inviteCode: string | null;
  activeGroup: GroupSummary | null;
  pastGroups: GroupSummary[];
};

export type CreateGroupInput = {
  name?: string;
  periodPreset?: GroupPeriodPreset;
  startsAt?: string;
  endsAt?: string | null;
  periodLabel?: string;
};

function mapGroup(row: Record<string, unknown>): GroupSummary {
  return {
    id: String(row.id),
    name: String(row.name),
    inviteCode: String(row.invite_code),
    periodPreset: (row.period_preset as GroupPeriodPreset) || "custom",
    periodLabel: String(row.period_label ?? tStored("group.periodUnset")),
    startsAt: String(row.starts_at ?? "").slice(0, 10),
    endsAt: row.ends_at ? String(row.ends_at).slice(0, 10) : null,
    status: row.status === "ended" ? "ended" : "active",
    createdBy: String(row.created_by),
    createdAt: String(row.created_at),
  };
}

export async function ensureProfile(
  supabase: SupabaseClient,
  userId: string,
  fallbackName: string,
  avatarUrl?: string | null,
) {
  const { data } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", userId)
    .maybeSingle();

  if (data) {
    const nextAvatar =
      typeof avatarUrl === "string" && avatarUrl.trim()
        ? avatarUrl.trim()
        : null;
    if (nextAvatar && !data.avatar_url) {
      const { data: updated } = await supabase
        .from("profiles")
        .update({ avatar_url: nextAvatar })
        .eq("id", userId)
        .select("*")
        .maybeSingle();
      return updated ?? { ...data, avatar_url: nextAvatar };
    }
    return data;
  }

  const { data: created, error } = await supabase
    .from("profiles")
    .insert({
      id: userId,
      display_name: fallbackName || tStored("common.me"),
      ...(avatarUrl?.trim() ? { avatar_url: avatarUrl.trim() } : {}),
    })
    .select("*")
    .single();

  if (error) throw error;
  return created;
}

export async function loadCloudBundle(
  supabase: SupabaseClient,
  userId: string,
  displayNameFallback: string,
  avatarUrlFallback?: string | null,
): Promise<CloudBundle> {
  const profile = await ensureProfile(
    supabase,
    userId,
    displayNameFallback,
    avatarUrlFallback,
  );

  const { data: memberships } = await supabase
    .from("group_members")
    .select("group_id, left_at")
    .eq("user_id", userId);

  const activeMembership =
    (memberships ?? []).find((m) => m.left_at == null) ?? null;
  const pastMembershipIds = (memberships ?? [])
    .filter((m) => m.left_at != null)
    .map((m) => m.group_id as string);

  const groupId = (activeMembership?.group_id as string | undefined) ?? null;
  let activeGroup: GroupSummary | null = null;
  let inviteCode: string | null = null;
  let memberIds: string[] = [userId];

  if (groupId) {
    const [{ data: group }, { data: memberRows }] = await Promise.all([
      supabase.from("groups").select("*").eq("id", groupId).maybeSingle(),
      supabase
        .from("group_members")
        .select("user_id")
        .eq("group_id", groupId)
        .is("left_at", null),
    ]);
    if (group) {
      activeGroup = mapGroup(group);
      inviteCode = activeGroup.inviteCode;
    }
    memberIds = (memberRows ?? []).map((m) => m.user_id as string);
    if (!memberIds.includes(userId)) memberIds = [userId, ...memberIds];
  }

  let pastGroups: GroupSummary[] = [];
  if (pastMembershipIds.length > 0) {
    const { data: pastRows } = await supabase
      .from("groups")
      .select("*")
      .in("id", pastMembershipIds)
      .order("created_at", { ascending: false });
    pastGroups = (pastRows ?? []).map((r) => mapGroup(r));
  }

  const { data: memberProfiles } = await supabase
    .from("profiles")
    .select("id, display_name, avatar_url, avatar_emoji")
    .in("id", memberIds);

  const nameById = new Map(
    (memberProfiles ?? []).map((p) => [p.id, p.display_name] as const),
  );
  const avatarById = new Map(
    (memberProfiles ?? [])
      .filter((p) => typeof p.avatar_url === "string" && p.avatar_url)
      .map((p) => [p.id as string, p.avatar_url as string] as const),
  );
  const emojiById = new Map(
    (memberProfiles ?? [])
      .filter((p) => typeof p.avatar_emoji === "string" && p.avatar_emoji.trim())
      .map((p) => [p.id as string, (p.avatar_emoji as string).trim()] as const),
  );

  const { data: latestCaptures } = await supabase
    .from("week_captures")
    .select("user_id, prayer_request, meditation_point, practice, week_key")
    .in("user_id", memberIds)
    .order("week_key", { ascending: false });

  const sharedByUser = new Map<
    string,
    {
      prayer_request: string | null;
      meditation_point: string | null;
      practice: string | null;
    }
  >();
  for (const row of latestCaptures ?? []) {
    if (!sharedByUser.has(row.user_id)) {
      sharedByUser.set(row.user_id, row);
    }
  }

  const [{ data: weeks }, { data: checks }, { data: feedbacks }] =
    await Promise.all([
      supabase
        .from("week_captures")
        .select("*")
        .eq("user_id", userId)
        .order("week_key", { ascending: false }),
      supabase
        .from("daily_checks")
        .select("*")
        .eq("user_id", userId)
        .order("date_key", { ascending: false }),
      supabase
        .from("feedbacks")
        .select("*")
        .eq("user_id", userId)
        .order("created_at", { ascending: false }),
    ]);

  let cheers: CheerPost[] = [];
  let tokens: PrayerToken[] = [];
  let questions: QuestionPost[] = [];

  if (groupId) {
    const [{ data: cheerRows }, { data: tokenRows }, { data: questionRows }] =
      await Promise.all([
        supabase
          .from("cheers")
          .select("*")
          .eq("group_id", groupId)
          .order("created_at", { ascending: false })
          .limit(50),
        supabase
          .from("prayer_tokens")
          .select("*")
          .eq("group_id", groupId)
          .order("created_at", { ascending: false })
          .limit(100),
        supabase
          .from("questions")
          .select("*")
          .eq("group_id", groupId)
          .order("created_at", { ascending: false })
          .limit(50),
      ]);

    // Resolve names for cheer authors who may have left the group
    const missingCheerAuthorIds = [
      ...new Set(
        (cheerRows ?? [])
          .map((c) => c.author_id as string)
          .filter((id) => id && !nameById.has(id)),
      ),
    ];
    if (missingCheerAuthorIds.length > 0) {
      const { data: extraProfiles } = await supabase
        .from("profiles")
        .select("id, display_name")
        .in("id", missingCheerAuthorIds);
      for (const p of extraProfiles ?? []) {
        nameById.set(p.id, p.display_name);
      }
    }

    cheers = (cheerRows ?? []).map((c) => ({
      id: c.id,
      authorId: c.author_id,
      authorName: nameById.get(c.author_id) ?? tStored("common.member"),
      text: c.text,
      createdAt: c.created_at,
      weekKey: c.week_key ?? undefined,
      groupId: c.group_id,
      groupName: activeGroup?.name,
    }));

    tokens = (tokenRows ?? []).map((t) => ({
      id: t.id,
      fromId: t.from_id,
      fromName:
        t.from_name || nameById.get(t.from_id) || tStored("common.member"),
      toId: t.to_id,
      toName: t.to_name || nameById.get(t.to_id) || tStored("common.member"),
      dateKey: t.date_key,
      createdAt: t.created_at,
      groupId: t.group_id,
      groupName: t.group_name || activeGroup?.name,
    }));

    questions = (questionRows ?? []).map((q) => ({
      id: q.id,
      text: q.text,
      isAnonymous: q.is_anonymous,
      authorName: q.is_anonymous
        ? undefined
        : q.author_id
          ? (nameById.get(q.author_id) ?? tStored("common.member"))
          : undefined,
      createdAt: q.created_at,
      aiReply: q.ai_reply ?? undefined,
      weekKey: q.week_key ?? undefined,
    }));
  }

  const members: Member[] = memberIds.map((id) => {
    const shared = sharedByUser.get(id);
    const avatarUrl =
      id === userId
        ? ((profile.avatar_url as string | null) ??
          avatarById.get(id) ??
          undefined)
        : avatarById.get(id);
    const avatarEmoji =
      id === userId
        ? typeof profile.avatar_emoji === "string" &&
          profile.avatar_emoji.trim()
          ? profile.avatar_emoji.trim()
          : emojiById.get(id)
        : emojiById.get(id);
    return {
      id,
      name:
        id === userId
          ? profile.display_name
          : (nameById.get(id) ?? tStored("common.member")),
      isMe: id === userId,
      avatarUrl: avatarUrl || undefined,
      avatarEmoji: avatarEmoji || undefined,
      prayerRequest: shared?.prayer_request ?? undefined,
      meditationPoint: shared?.meditation_point ?? undefined,
      practice: shared?.practice ?? undefined,
    };
  });

  const mappedWeeks: WeekCapture[] = (weeks ?? []).map(mapWeek);

  const profileEmoji =
    typeof profile.avatar_emoji === "string" && profile.avatar_emoji.trim()
      ? profile.avatar_emoji.trim()
      : null;

  const state: AppState = {
    settings: {
      displayName: profile.display_name,
      themeId: parseThemeId(profile.theme_id),
      nudgeTime: profile.nudge_time || "08:00",
      groupEnabled: profile.group_enabled ?? true,
      avatarEmoji: profileEmoji,
      aiReplyUsedAt: (profile.ai_reply_used_at as string | null) ?? null,
      pastorSummaryCopiedAt:
        (profile.pastor_summary_copied_at as string | null) ?? null,
    },
    capture: mappedWeeks[0] ?? null,
    weeks: mappedWeeks,
    checks: (checks ?? []).map(mapCheck),
    members,
    cheers,
    tokens,
    questions,
    feedbacks: (feedbacks ?? []).map(
      (f): FeedbackNote => ({
        id: f.id,
        kind: f.kind,
        text: f.text,
        createdAt: f.created_at,
      }),
    ),
  };

  return { state, groupId, inviteCode, activeGroup, pastGroups };
}

function mapWeek(row: Record<string, unknown>): WeekCapture {
  return {
    id: String(row.id),
    weekKey: String(row.week_key),
    scripture: String(row.scripture),
    passage: (row.passage as string | null) ?? undefined,
    briefPoint: String(row.brief_point),
    firstThought: String(row.first_thought),
    notes: (row.notes as string | null) ?? undefined,
    prayerRequest: (row.prayer_request as string | null) ?? undefined,
    meditationPoint: (row.meditation_point as string | null) ?? undefined,
    practice: (row.practice as string | null) ?? undefined,
    createdAt: String(row.created_at),
    updatedAt: String(row.updated_at),
  };
}

function mapCheck(row: Record<string, unknown>): DailyCheck {
  return {
    dateKey: String(row.date_key),
    completedAt: String(row.completed_at),
    weekKey: String(row.week_key),
  };
}

export async function createGroup(
  supabase: SupabaseClient,
  userId: string,
  input: CreateGroupInput = {},
) {
  const preset = input.periodPreset ?? "h1";
  const range =
    preset === "custom"
      ? {
          startsAt: input.startsAt ?? new Date().toISOString().slice(0, 10),
          endsAt: input.endsAt ?? null,
          periodLabel: input.periodLabel ?? tStored("group.periodCustom"),
        }
      : periodRange(preset);

  const { data: group, error } = await supabase
    .from("groups")
    .insert({
      name:
        (input.name ?? tStored("group.defaultName")).trim() ||
        tStored("group.defaultName"),
      created_by: userId,
      period_preset: preset,
      period_label: range.periodLabel,
      starts_at: range.startsAt,
      ends_at: range.endsAt,
      status: "active",
    })
    .select("*")
    .single();
  if (error) throw error;

  const { error: memberError } = await supabase.from("group_members").insert({
    group_id: group.id,
    user_id: userId,
  });
  if (memberError) throw memberError;
  return mapGroup(group);
}

export async function joinGroupByCode(
  supabase: SupabaseClient,
  _userId: string,
  code: string,
) {
  const { data, error } = await supabase.rpc("join_group_by_code", {
    p_code: code,
  });
  if (error) {
    const msg = error.message || "";
    if (msg.includes("not found") || msg.includes("Group not found")) {
      throw new Error(tStored("errors.inviteNotFound"));
    }
    if (msg.includes("at most")) {
      throw new Error(tStored("errors.groupFull"));
    }
    if (msg.includes("ended")) {
      throw new Error(tStored("errors.seasonEnded"));
    }
    throw error;
  }
  return mapGroup(data as Record<string, unknown>);
}

export async function leaveGroup(supabase: SupabaseClient, groupId: string) {
  const { error } = await supabase.rpc("leave_group", {
    p_group_id: groupId,
  });
  if (error) throw error;
}

export async function endGroupSeason(
  supabase: SupabaseClient,
  groupId: string,
) {
  const { data, error } = await supabase.rpc("end_group_season", {
    p_group_id: groupId,
  });
  if (error) {
    if (error.message.includes("Only creator")) {
      throw new Error(tStored("errors.onlyCreator"));
    }
    throw error;
  }
  return mapGroup(data as Record<string, unknown>);
}
