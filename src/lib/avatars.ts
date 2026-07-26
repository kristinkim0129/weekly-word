/** Shared avatar emoji palette for Me settings + defaults. */
export const AVATAR_EMOJI_OPTIONS = [
  "🙏",
  "✝️",
  "🕊️",
  "💛",
  "🌿",
  "✨",
  "🌅",
  "📖",
  "🌾",
  "🌸",
  "🌙",
  "⭐",
  "🌈",
  "🫶",
  "😊",
  "😇",
  "🌱",
  "🔥",
  "💧",
  "🎵",
  "🏡",
  "☀️",
  "🍀",
  "🦋",
] as const;

/** Stable default emoji from user id so new profiles always have a face. */
export function defaultEmojiForUser(userId: string): string {
  let hash = 0;
  for (let i = 0; i < userId.length; i++) {
    hash = (hash * 31 + userId.charCodeAt(i)) >>> 0;
  }
  return AVATAR_EMOJI_OPTIONS[hash % AVATAR_EMOJI_OPTIONS.length];
}
