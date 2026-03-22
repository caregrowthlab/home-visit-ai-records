import { NextResponse } from "next/server";
import { generateDraft } from "@/lib/openai";
import { PROMPT_TYPES, type PromptType } from "@/lib/prompts";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    let patientId: string | number | null = null;
    if (typeof body.patient_id === "number") {
      patientId = body.patient_id;
    } else if (typeof body.patient_id === "string") {
      const trimmed = body.patient_id.trim();
      if (trimmed === "") {
        patientId = null;
      } else {
        const asNum = Number(trimmed);
        patientId = Number.isNaN(asNum) ? trimmed : asNum;
      }
    }

    if (patientId === null) {
      return NextResponse.json(
        { error: "患者を選択してください。" },
        { status: 400 }
      );
    }

    if (typeof patientId === "number" && Number.isNaN(patientId)) {
      return NextResponse.json(
        { error: "患者を選択してください。" },
        { status: 400 }
      );
    }

    const previousRecord =
      typeof body.previous_record === "string" ? body.previous_record : "";
    const currentInput =
      typeof body.current_input === "string"
        ? body.current_input
        : typeof body.input_text === "string"
          ? body.input_text
          : "";

    const promptType =
      typeof body.prompt_type === "string" &&
      PROMPT_TYPES.includes(body.prompt_type as PromptType)
        ? (body.prompt_type as PromptType)
        : "dar";

    if (!currentInput.trim()) {
      return NextResponse.json(
        { error: "今回メモを入力してください。" },
        { status: 400 }
      );
    }

    const generatedText = await generateDraft(
      previousRecord.trim(),
      currentInput.trim(),
      promptType
    );

    return NextResponse.json({ ai_output: generatedText });
  } catch (err) {
    console.error("Generate API error:", err);

    const message =
      err instanceof Error ? err.message : "AI生成中にエラーが発生しました。";

    let errorText = "AI生成に失敗しました。しばらく経ってから再度お試しください。";
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
