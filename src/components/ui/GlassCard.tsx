import type { CSSProperties, ReactNode } from "react";

export function GlassCard({
  children,
  className = "",
  style,
  as: Tag = "div",
}: {
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
  as?: "div" | "section" | "article";
}) {
  return (
    <Tag className={`glass-card ${className}`.trim()} style={style}>
      {children}
    </Tag>
  );
}
