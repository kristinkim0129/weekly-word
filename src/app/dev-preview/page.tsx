"use client";

// 임시 미리보기 페이지 — 테스트 끝나면 삭제하세요 (로그인 없이 새 기능 확인용)
import { useEffect, useState } from "react";
import { StreakCard } from "@/components/StreakCard";
import { VerseQuiz } from "@/components/GoldenTicket";
import { GlassCard } from "@/components/ui/GlassCard";
import { Button } from "@/components/ui/Button";
import { useLocale } from "@/context/LocaleProvider";
import { toDateKey, weekKeyFromDate } from "@/lib/dates";
import type { DailyCheck } from "@/lib/types";

function fakeChecks(): DailyCheck[] {
  const out: DailyCheck[] = [];
  // 오늘부터 8일 연속 + 예전에 띄엄띄엄 4일 (총 12일, 최장 8일)
  for (const back of [0, 1, 2, 3, 4, 5, 6, 7, 12, 15, 20, 30]) {
    const d = new Date();
    d.setDate(d.getDate() - back);
    out.push({
      dateKey: toDateKey(d),
      completedAt: d.toISOString(),
      weekKey: weekKeyFromDate(d),
    });
  }
  return out;
}

export default function DevPreviewPage() {
  const { t } = useLocale();
  const [quizOpen, setQuizOpen] = useState(false);
  useEffect(() => {
    document.documentElement.dataset.theme = "after";
  }, []);

  return (
    <div className="phone-shell">
      <header className="app-header">
        <p className="brand">{t("brand")}</p>
        <h1 className="page-title">{t("devPreview.title")}</h1>
        <p className="page-sub">{t("devPreview.subtitle")}</p>
      </header>
      <main className="app-main">
        <StreakCard checks={fakeChecks()} />

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

        <GlassCard>
          <p className="pill">{t("devPreview.note")}</p>
          <p className="hint" style={{ marginTop: 8 }}>
            {t("devPreview.noteBody")}
          </p>
        </GlassCard>

        {quizOpen ? (
          <VerseQuiz
            verseText="Yahweh is my shepherd: I shall lack nothing."
            reference="Psalm 23:1 (WEB)"
            onClose={() => setQuizOpen(false)}
            onComplete={() => setQuizOpen(false)}
          />
        ) : null}
      </main>
    </div>
  );
}
