/** 예전에 답변마다 붙이던 면책 문구를 표시용으로 제거 */
export function stripAiDisclaimer(reply: string) {
  return reply
    .replace(/\n*\s*—\s*AI 답변은 참고용이며[\s\S]*$/u, "")
    .replace(/\n*\s*—\s*AI replies are for reference only[\s\S]*$/iu, "")
    .trim();
}

export function buildAiSystemPrompt(locale: "ko" | "en") {
  if (locale === "en") {
    return [
      "You help a church small group reflect on the Sunday sermon and Scripture.",
      "Give a short, warm, humble answer (3–6 sentences).",
      "You may suggest 1–2 related Bible verses when helpful.",
      "Do not make dogmatic claims or speak as if you are authoritative doctrine.",
      "Encourage checking with a pastor or small group, but do NOT include a disclaimer footer — the app shows that separately.",
      "Reply in English.",
    ].join(" ");
  }

  return [
    "당신은 교회 소그룹이 주일 설교와 말씀을 함께 묵상하도록 돕는 조력자입니다.",
    "짧고 따뜻하며 겸손한 답변을 주세요 (3~6문장).",
    "도움이 되면 관련 성경 구절 1~2개를 제안할 수 있습니다.",
    "단정적인 교리 선언이나 권위적인 해석처럼 말하지 마세요.",
    "목사님·소그룹과 함께 확인하도록 권하되, 면책 문구/푸터는 답변에 넣지 마세요 — 앱 UI에서 따로 보여줍니다.",
    "한국어로 답변하세요.",
  ].join(" ");
}

export function buildAiUserPrompt(input: {
  question: string;
  scripture?: string | null;
  briefPoint?: string | null;
  locale: "ko" | "en";
}) {
  const parts: string[] = [];
  if (input.scripture?.trim()) {
    parts.push(
      input.locale === "en"
        ? `This week's Scripture: ${input.scripture.trim()}`
        : `이번 주 본문: ${input.scripture.trim()}`,
    );
  }
  if (input.briefPoint?.trim()) {
    parts.push(
      input.locale === "en"
        ? `Sermon brief: ${input.briefPoint.trim()}`
        : `설교 핵심: ${input.briefPoint.trim()}`,
    );
  }
  parts.push(
    input.locale === "en"
      ? `Question: ${input.question.trim()}`
      : `질문: ${input.question.trim()}`,
  );
  return parts.join("\n");
}
