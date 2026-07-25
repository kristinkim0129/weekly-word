"use client";

import { useEffect, useMemo, useState } from "react";
import { GlassCard } from "@/components/ui/GlassCard";
import { Button } from "@/components/ui/Button";
import { weekKeyFromDate } from "@/lib/dates";
import { todayKey } from "@/lib/demo-data";
import {
  completeTicket,
  loadTicket,
  rollTicketForToday,
  type TicketState,
} from "@/lib/golden-ticket";
import { resolveGoldenVerse } from "@/lib/memory-verses";
import { useLocale } from "@/context/LocaleProvider";

type Props = {
  userId: string;
  hasCheckedToday: boolean;
  /** 이번 주 성경 참조 (예: 시편 23:1) — 본문은 암송 목록에서만 가져와요 */
  reference: string | null;
};

export function GoldenTicket({
  userId,
  hasCheckedToday,
  reference,
}: Props) {
  const { t } = useLocale();
  const [ticket, setTicket] = useState<TicketState | null>(null);
  const [quizOpen, setQuizOpen] = useState(false);
  const weekKey = weekKeyFromDate();
  const verse = useMemo(
    () => resolveGoldenVerse(reference, weekKey),
    [reference, weekKey],
  );

  useEffect(() => {
    // 체크를 마친 날에만 조용히 추첨 — 안 마친 날엔 기존 상태만 읽어요.
    const timer = setTimeout(
      () => {
        setTicket(
          hasCheckedToday
            ? rollTicketForToday(userId, weekKey, todayKey())
            : loadTicket(userId, weekKey),
        );
      },
      hasCheckedToday ? 600 : 0,
    );
    return () => clearTimeout(timer);
  }, [userId, weekKey, hasCheckedToday]);

  if (!ticket || !ticket.wonDate || ticket.done) return null;

  return (
    <>
      <GlassCard className="golden-ticket">
        <p className="pill golden-pill">{t("golden.pill")}</p>
        <p style={{ margin: "12px 0 4px", fontWeight: 700 }}>
          {t("golden.blurb")}
        </p>
        <Button style={{ width: "100%", marginTop: 14 }} onClick={() => setQuizOpen(true)}>
          {t("golden.open")}
        </Button>
        <p className="tiny" style={{ marginTop: 8, textAlign: "center" }}>
          {t("golden.wait")}
        </p>
      </GlassCard>

      {quizOpen ? (
        <VerseQuiz
          verseText={verse.text}
          reference={verse.reference}
          onClose={() => setQuizOpen(false)}
          onComplete={() => {
            setTicket(completeTicket(userId, weekKey));
            setQuizOpen(false);
          }}
        />
      ) : null}
    </>
  );
}

/** 한 번에 고르는 블록 상한 (피드백: 최대 5개) */
const MAX_CHOICE_BLOCKS = 5;
const STAGE_COUNT = 3;

function shuffle<T>(arr: T[]): T[] {
  const out = [...arr];
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}

/**
 * 낱말을 너무 잘게 쪼개지 않고 2~3어절 덩어리로 묶어요.
 * 선택 블록이 과도해지지 않게 최종 조각 수도 제한합니다.
 */
export function chunkVerse(text: string): string[] {
  const tokens = text.split(/\s+/).filter(Boolean);
  if (tokens.length === 0) return [];
  if (tokens.length <= MAX_CHOICE_BLOCKS) return tokens;

  const perChunk = tokens.length <= 12 ? 2 : 3;
  let chunks: string[] = [];
  for (let i = 0; i < tokens.length; i += perChunk) {
    chunks.push(tokens.slice(i, i + perChunk).join(" "));
  }

  // 선택지 5개 + 보이는 조각 1~2개 정도 남기도록
  while (chunks.length > MAX_CHOICE_BLOCKS + 2) {
    const merged: string[] = [];
    for (let i = 0; i < chunks.length; i += 2) {
      merged.push(
        i + 1 < chunks.length ? `${chunks[i]} ${chunks[i + 1]}` : chunks[i],
      );
    }
    chunks = merged;
  }
  return chunks;
}

function blanksForStage(stage: number, total: number) {
  // 가능하면 한 조각은 남겨 두어 문맥을 줘요
  const maxHide = Math.min(
    MAX_CHOICE_BLOCKS,
    total > 1 ? total - 1 : total,
  );
  const ramp = [Math.min(2, maxHide), Math.min(3, maxHide), maxHide];
  return Math.max(1, ramp[stage] ?? maxHide);
}

export function VerseQuiz({
  verseText,
  reference,
  onClose,
  onComplete,
}: {
  verseText: string;
  reference: string | null;
  onClose: () => void;
  onComplete: () => void;
}) {
  const { t } = useLocale();
  const chunks = useMemo(() => chunkVerse(verseText), [verseText]);
  /** 가릴 순서 — 마운트 때 한 번 섞어서 단계마다 점점 더 많이 가려요 */
  const hideOrder = useMemo(() => shuffle(chunks.map((_, i) => i)), [chunks]);

  const [stage, setStage] = useState(0);
  const [filled, setFilled] = useState<Set<number>>(new Set());
  const [usedChips, setUsedChips] = useState<Set<number>>(new Set());
  const [wiggleChip, setWiggleChip] = useState<number | null>(null);
  const [celebrating, setCelebrating] = useState(false);

  const hiddenCount = blanksForStage(stage, chunks.length);
  const hidden = useMemo(
    () => new Set(hideOrder.slice(0, hiddenCount)),
    [hideOrder, hiddenCount],
  );

  /** 이번 단계의 빈칸들 (문장 순서대로) */
  const blanks = chunks.map((_, i) => i).filter((i) => hidden.has(i));
  const nextBlank = blanks.find((i) => !filled.has(i)) ?? null;

  /** 선택 은행 — 최대 5개 */
  const bank = useMemo(() => shuffle([...hidden]), [hidden]);

  function tapChip(chipPos: number, chunkIndex: number) {
    if (nextBlank === null || usedChips.has(chipPos)) return;
    if (chunks[chunkIndex] === chunks[nextBlank]) {
      const nextFilled = new Set(filled).add(nextBlank);
      setFilled(nextFilled);
      setUsedChips(new Set(usedChips).add(chipPos));
      if (nextFilled.size === blanks.length) {
        setTimeout(() => {
          if (stage < STAGE_COUNT - 1) {
            setStage(stage + 1);
            setFilled(new Set());
            setUsedChips(new Set());
          } else {
            setCelebrating(true);
          }
        }, 650);
      }
    } else {
      setWiggleChip(chipPos);
      setTimeout(() => setWiggleChip(null), 450);
    }
  }

  return (
    <div className="quiz-overlay" role="dialog" aria-modal="true">
      <div className="quiz-card glass-card">
        {celebrating ? (
          <div style={{ textAlign: "center" }}>
            <div className="quiz-sparkle" aria-hidden>
              ✨
            </div>
            <p style={{ fontWeight: 700, fontSize: "1.05rem", margin: 0 }}>
              {t("golden.engraved")}
            </p>
            <p className="word-verse" style={{ margin: "14px 0 4px" }}>
              {verseText}
            </p>
            {reference ? <p className="tiny">{reference}</p> : null}
            <Button
              style={{ width: "100%", marginTop: 16 }}
              onClick={onComplete}
            >
              {t("golden.keep")}
            </Button>
          </div>
        ) : (
          <>
            <div className="row-between">
              <p className="pill golden-pill">{t("golden.pill")}</p>
              <span className="tiny">
                {stage + 1} / {STAGE_COUNT}
              </span>
            </div>
            <p className="hint" style={{ margin: "10px 0 14px" }}>
              {t("golden.quizHint", { n: MAX_CHOICE_BLOCKS })}
            </p>

            <p className="quiz-verse">
              {chunks.map((chunk, i) =>
                hidden.has(i) && !filled.has(i) ? (
                  <span
                    key={i}
                    className={`quiz-blank ${i === nextBlank ? "next" : ""}`}
                    aria-label={t("golden.blank")}
                  >
                    {"\u00A0".repeat(
                      Math.max(4, Math.min(chunk.replace(/\s/g, "").length, 10)),
                    )}
                  </span>
                ) : (
                  <span
                    key={i}
                    className={
                      hidden.has(i) ? "quiz-word-filled" : undefined
                    }
                  >
                    {chunk}
                  </span>
                ),
              )}
            </p>
            {reference ? (
              <p className="tiny" style={{ marginTop: 6 }}>
                {reference}
              </p>
            ) : null}

            <div className="quiz-bank">
              {bank.map((chunkIndex, chipPos) => (
                <button
                  key={chipPos}
                  type="button"
                  className={`quiz-word ${
                    usedChips.has(chipPos) ? "used" : ""
                  } ${wiggleChip === chipPos ? "wiggle" : ""}`}
                  disabled={usedChips.has(chipPos)}
                  onClick={() => tapChip(chipPos, chunkIndex)}
                >
                  {chunks[chunkIndex]}
                </button>
              ))}
            </div>

            <button type="button" className="quiz-later" onClick={onClose}>
              {t("golden.later")}
            </button>
          </>
        )}
      </div>
    </div>
  );
}
