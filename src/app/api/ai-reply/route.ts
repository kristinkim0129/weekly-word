import { NextResponse } from "next/server";
import {
  buildAiSystemPrompt,
  buildAiUserPrompt,
} from "@/lib/ai/reply";
import { translate } from "@/lib/i18n/t";
import type { Locale } from "@/lib/i18n/messages";
import { createSupabaseServerClient } from "@/lib/supabase/server";

type Body = {
  questionId?: string;
  locale?: string;
  scripture?: string | null;
  briefPoint?: string | null;
};

function localeOf(value: unknown): Locale {
  return value === "en" ? "en" : "ko";
}

export async function POST(request: Request) {
  let body: Body = {};
  try {
    body = (await request.json()) as Body;
  } catch {
    return NextResponse.json(
      { error: translate("ko", "errors.badRequest") },
      { status: 400 },
    );
  }

  const locale = localeOf(body.locale);

  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: translate(locale, "errors.openaiMissing") },
      { status: 503 },
    );
  }

  const supabase = await createSupabaseServerClient();
  if (!supabase) {
    return NextResponse.json(
      { error: translate(locale, "errors.supabaseServer") },
      { status: 500 },
    );
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json(
      { error: translate(locale, "errors.loginRequired") },
      { status: 401 },
    );
  }

  const questionId = body.questionId?.trim();
  if (!questionId) {
    return NextResponse.json(
      { error: translate(locale, "errors.questionIdRequired") },
      { status: 400 },
    );
  }

  const { data: question, error: questionError } = await supabase
    .from("questions")
    .select("id, text, ai_reply, week_key")
    .eq("id", questionId)
    .maybeSingle();

  if (questionError || !question) {
    return NextResponse.json(
      { error: translate(locale, "errors.questionNotFound") },
      { status: 404 },
    );
  }

  if (question.ai_reply) {
    return NextResponse.json({ reply: String(question.ai_reply) });
  }

  // Lifetime: claim one AI generation per account before calling OpenAI.
  const claimedAt = new Date().toISOString();
  const { data: claimed, error: claimError } = await supabase
    .from("profiles")
    .update({
      ai_reply_used_at: claimedAt,
      updated_at: claimedAt,
    })
    .eq("id", user.id)
    .is("ai_reply_used_at", null)
    .select("id")
    .maybeSingle();

  if (claimError) {
    return NextResponse.json(
      { error: claimError.message },
      { status: 500 },
    );
  }
  if (!claimed) {
    return NextResponse.json(
      { error: translate(locale, "errors.aiReplyUsed") },
      { status: 403 },
    );
  }

  const refundClaim = async () => {
    await supabase
      .from("profiles")
      .update({
        ai_reply_used_at: null,
        updated_at: new Date().toISOString(),
      })
      .eq("id", user.id)
      .eq("ai_reply_used_at", claimedAt);
  };

  let scripture = body.scripture?.trim() || "";
  let briefPoint = body.briefPoint?.trim() || "";

  if ((!scripture || !briefPoint) && question.week_key) {
    const { data: capture } = await supabase
      .from("week_captures")
      .select("scripture, brief_point")
      .eq("user_id", user.id)
      .eq("week_key", question.week_key)
      .maybeSingle();
    if (capture) {
      if (!scripture) scripture = String(capture.scripture ?? "");
      if (!briefPoint) briefPoint = String(capture.brief_point ?? "");
    }
  }

  const model = process.env.OPENAI_MODEL || "gpt-4o-mini";
  const openaiRes = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model,
      temperature: 0.7,
      max_tokens: 500,
      messages: [
        { role: "system", content: buildAiSystemPrompt(locale) },
        {
          role: "user",
          content: buildAiUserPrompt({
            question: String(question.text),
            scripture,
            briefPoint,
            locale,
          }),
        },
      ],
    }),
  });

  if (!openaiRes.ok) {
    const detail = await openaiRes.text().catch(() => "");
    console.error("OpenAI error", openaiRes.status, detail);
    await refundClaim();
    return NextResponse.json(
      { error: translate(locale, "errors.aiFetchFail") },
      { status: 502 },
    );
  }

  const data = (await openaiRes.json()) as {
    choices?: { message?: { content?: string } }[];
  };
  const reply = data.choices?.[0]?.message?.content?.trim();
  if (!reply) {
    await refundClaim();
    return NextResponse.json(
      { error: translate(locale, "errors.aiEmpty") },
      { status: 502 },
    );
  }

  const { error: updateError } = await supabase
    .from("questions")
    .update({ ai_reply: reply })
    .eq("id", questionId);

  if (updateError) {
    await refundClaim();
    return NextResponse.json(
      { error: updateError.message },
      { status: 500 },
    );
  }

  return NextResponse.json({ reply });
}
