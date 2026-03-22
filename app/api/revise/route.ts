import { NextResponse } from "next/server";
import { generateRevision } from "@/lib/openai";
import { PROMPT_TYPES, type PromptType } from "@/lib/prompts";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const aiOutput = typeof body.ai_output === "string" ? body.ai_output : "";
    const instruction =
      typeof body.instruction === "string" ? body.instruction : "";
    const promptType =
      typeof body.prompt_type === "string" &&
      PROMPT_TYPES.includes(body.prompt_type as PromptType)
        ? (body.prompt_type as PromptType)
        : "dar";

    if (!aiOutput.trim()) {
      return NextResponse.json(
        { error: "AI出力がありません。先に「AIで記録作成」を実行してください。" },
        { status: 400 }
      );
    }

    if (!instruction.trim()) {
      return NextResponse.json(
        { error: "修正指示を入力してください。" },
        { status: 400 }
      );
    }

    const revisedOutput = await generateRevision(
      aiOutput.trim(),
      instruction.trim(),
      promptType
    );

    return NextResponse.json({ revised_output: revisedOutput });
  } catch (err) {
    console.error("Revise API error:", err);

    const message =
      err instanceof Error ? err.message : "再調整中にエラーが発生しました。";

    let errorText =
      "再調整に失敗しました。しばらく経ってから再度お試しください。";
    if (message.includes("OPENAI") || message.includes("環境変数")) {
      errorText = message;
    } else if (message.includes("rate limit") || message.includes("429")) {
      errorText =
        "リクエスト回数が上限に達しました。しばらく待ってからお試しください。";
    } else if (
      message.includes("401") ||
      message.includes("Incorrect API key")
    ) {
      errorText =
        "OpenAI API キーが正しくありません。環境変数を確認してください。";
    } else if (message.includes("insufficient_quota")) {
      errorText =
        "OpenAI の利用枠が不足しています。アカウントを確認してください。";
    }

    return NextResponse.json({ error: errorText }, { status: 500 });
  }
}
