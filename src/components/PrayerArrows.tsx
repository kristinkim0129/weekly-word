"use client";

import { useEffect, useId, useRef, useState } from "react";
import { useLocale } from "@/context/LocaleProvider";
import type { PrayerToken } from "@/lib/types";

const MAX_EDGES = 12;

type Person = {
  id: string;
  name: string;
};

type Edge = {
  key: string;
  fromId: string;
  fromName: string;
  toId: string;
  toName: string;
  colorIndex: 0 | 1 | 2;
};

type Point = { x: number; y: number };

function initials(name: string) {
  const trimmed = name.trim();
  if (!trimmed) return "?";
  const parts = trimmed.split(/\s+/);
  if (parts.length >= 2) {
    return (parts[0][0] + parts[1][0]).toUpperCase();
  }
  return trimmed.slice(0, 2);
}

function colorIndexForId(id: string): 0 | 1 | 2 {
  let h = 0;
  for (let i = 0; i < id.length; i++) {
    h = (h * 31 + id.charCodeAt(i)) >>> 0;
  }
  return (h % 3) as 0 | 1 | 2;
}

function buildGraph(tokens: PrayerToken[], fallbackName: string) {
  const recent = tokens.slice(0, MAX_EDGES);
  const seen = new Set<string>();
  const edges: Edge[] = [];
  const peopleMap = new Map<string, Person>();

  for (const tok of recent) {
    const toName = tok.toName?.trim() || fallbackName;
    const pairKey = `${tok.fromId}→${tok.toId}`;
    if (seen.has(pairKey)) continue;
    seen.add(pairKey);

    peopleMap.set(tok.fromId, { id: tok.fromId, name: tok.fromName });
    peopleMap.set(tok.toId, { id: tok.toId, name: toName });

    edges.push({
      key: tok.id,
      fromId: tok.fromId,
      fromName: tok.fromName,
      toId: tok.toId,
      toName,
      colorIndex: colorIndexForId(tok.fromId),
    });
  }

  const people = Array.from(peopleMap.values());
  return { people, edges };
}

function curvePath(from: Point, to: Point) {
  const dx = to.x - from.x;
  const midX = from.x + dx * 0.5;
  return `M ${from.x} ${from.y} C ${midX} ${from.y}, ${midX} ${to.y}, ${to.x} ${to.y}`;
}

export function PrayerArrows({ tokens }: { tokens: PrayerToken[] }) {
  const { t } = useLocale();
  const uid = useId().replace(/:/g, "");
  const rootRef = useRef<HTMLDivElement>(null);
  const [points, setPoints] = useState<{
    left: Record<string, Point>;
    right: Record<string, Point>;
    size: { w: number; h: number };
  }>({ left: {}, right: {}, size: { w: 0, h: 0 } });

  const { people, edges } = buildGraph(tokens, t("group.member"));

  useEffect(() => {
    const root = rootRef.current;
    if (!root || people.length === 0) return;

    function measure() {
      if (!root) return;
      const rootBox = root.getBoundingClientRect();
      const left: Record<string, Point> = {};
      const right: Record<string, Point> = {};

      root.querySelectorAll<HTMLElement>("[data-prayer-side]").forEach((el) => {
        const id = el.dataset.prayerId;
        const side = el.dataset.prayerSide;
        if (!id || !side) return;
        const box = el.getBoundingClientRect();
        const y = box.top + box.height / 2 - rootBox.top;
        if (side === "left") {
          left[id] = { x: box.right - rootBox.left, y };
        } else {
          right[id] = { x: box.left - rootBox.left, y };
        }
      });

      setPoints({
        left,
        right,
        size: { w: rootBox.width, h: rootBox.height },
      });
    }

    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(root);
    window.addEventListener("resize", measure);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, [people.length, edges.length]);

  if (people.length === 0) {
    return <p className="empty">{t("group.noPrayers")}</p>;
  }

  return (
    <div className="prayer-arrows">
      <p className="prayer-arrows-hint">
        {t("group.prayerMapHint", { n: edges.length })}
      </p>

      <div
        ref={rootRef}
        className="prayer-arrows-map"
        role="img"
        aria-label={t("group.prayerMapAria", { n: edges.length })}
      >
        <div className="prayer-arrows-col">
          {people.map((p) => (
            <div
              key={`L-${p.id}`}
              className="prayer-arrows-person"
              data-prayer-side="left"
              data-prayer-id={p.id}
            >
              <span className="prayer-arrows-avatar" aria-hidden>
                {initials(p.name)}
              </span>
              <span className="prayer-arrows-name">{p.name}</span>
            </div>
          ))}
        </div>

        <div className="prayer-arrows-col prayer-arrows-col-right">
          {people.map((p) => (
            <div
              key={`R-${p.id}`}
              className="prayer-arrows-person"
              data-prayer-side="right"
              data-prayer-id={p.id}
            >
              <span className="prayer-arrows-avatar" aria-hidden>
                {initials(p.name)}
              </span>
              <span className="prayer-arrows-name">{p.name}</span>
            </div>
          ))}
        </div>

        {points.size.w > 0 ? (
          <svg
            className="prayer-arrows-svg"
            width={points.size.w}
            height={points.size.h}
            aria-hidden
          >
            <defs>
              {[0, 1, 2].map((i) => (
                <marker
                  key={i}
                  id={`prayer-arrowhead-${uid}-${i}`}
                  markerWidth="7"
                  markerHeight="7"
                  refX="6"
                  refY="3.5"
                  orient="auto"
                  markerUnits="strokeWidth"
                >
                  <path
                    d="M 0 0 L 7 3.5 L 0 7 z"
                    className={`prayer-arrow-fill-${i}`}
                  />
                </marker>
              ))}
            </defs>
            {edges.map((edge) => {
              const from = points.left[edge.fromId];
              const to = points.right[edge.toId];
              if (!from || !to) return null;
              const label = t("group.prayedFor", {
                from: edge.fromName,
                to: edge.toName,
              });
              return (
                <path
                  key={edge.key}
                  d={curvePath(from, to)}
                  className={`prayer-arrow-stroke prayer-arrow-stroke-${edge.colorIndex}`}
                  markerEnd={`url(#prayer-arrowhead-${uid}-${edge.colorIndex})`}
                  fill="none"
                >
                  <title>{label}</title>
                </path>
              );
            })}
          </svg>
        ) : null}
      </div>

      <ul className="prayer-arrows-sr-list">
        {edges.map((edge) => (
          <li key={edge.key}>
            {t("group.prayedFor", {
              from: edge.fromName,
              to: edge.toName,
            })}
          </li>
        ))}
      </ul>

      <div className="prayer-arrows-legend" aria-hidden>
        <span className="prayer-arrows-swatch prayer-arrow-fill-0" />
        <span className="prayer-arrows-swatch prayer-arrow-fill-1" />
        <span className="prayer-arrows-swatch prayer-arrow-fill-2" />
        <span className="tiny">{t("group.prayerMapLegend")}</span>
      </div>
    </div>
  );
}
