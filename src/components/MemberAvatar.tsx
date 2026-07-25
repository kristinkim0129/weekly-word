"use client";

const PLACEHOLDER = "/avatar-placeholder.svg";

type Props = {
  name: string;
  src?: string | null;
  emoji?: string | null;
  size?: number;
  className?: string;
};

export function MemberAvatar({
  name,
  src,
  emoji,
  size = 40,
  className = "",
}: Props) {
  const trimmedEmoji = emoji?.trim();
  if (trimmedEmoji) {
    return (
      <span
        className={`member-avatar member-avatar-emoji ${className}`.trim()}
        style={{
          width: size,
          height: size,
          fontSize: Math.max(14, Math.round(size * 0.52)),
        }}
        role="img"
        aria-label={name}
        data-name={name}
      >
        {trimmedEmoji}
      </span>
    );
  }

  const url = src?.trim() || PLACEHOLDER;
  return (
    <img
      src={url}
      alt=""
      width={size}
      height={size}
      className={`member-avatar ${className}`.trim()}
      style={{ width: size, height: size }}
      referrerPolicy="no-referrer"
      onError={(e) => {
        const img = e.currentTarget;
        if (img.src.endsWith(PLACEHOLDER)) return;
        img.src = PLACEHOLDER;
      }}
      data-name={name}
    />
  );
}
