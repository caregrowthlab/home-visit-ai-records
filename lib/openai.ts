import OpenAI from "openai";
import { getOpenAIEnv } from "@/lib/env";
import {
  getGenerateUserContent,
  getPrompt,
  type GenerationMode,
  type PromptType,
} from "@/lib/prompts";

let client: OpenAI | null = null;

const REVISION_SYSTEM_PROMPT = `
あなたは訪問看護記録の修正支援AIです。
既存の記録を、ユーザーの指示に従って最小限の変更で修正してください。

【絶対ルール】
・DAR / SOAP構造は維持する
・求められていない部分は変更しない
・全体を書き直さない
・不要なFocusは削除してよい
・統合指示がある場合は自然に統合する
・簡潔化は対象箇所のみ
・詳細化も対象箇所のみ
・監査上重要な情報は安易に削除しない
・出力は完成した記録のみ（説明不要）
`;

export function getOpenAI(): OpenAI {
  if (!client) {
    const { apiKey, organization, project } = getOpenAIEnv();
    client = new OpenAI({
      apiKey,
      ...(organization ? { organization } : {}),
      ...(project ? { project } : {}),
    });
  }
  return client;
}

export async function generateDraft(
  previousRecord: string,
  currentInput: string,
  promptType: PromptType = "dar",
  mode: GenerationMode = "normal"
): Promise<string> {
  const openai = getOpenAI();
  const { model } = getOpenAIEnv();
  const systemPrompt = getPrompt(
    promptType,
    previousRecord,
    currentInput,
    mode
  );

  const userContent = getGenerateUserContent(
    promptType,
    previousRecord,
    currentInput
  );

  const response = await openai.chat.completions.create({
    model,
    temperature: 0,
    messages: [
      {
        role: "system",
        content: systemPrompt,
      },
      {
        role: "user",
        content: userContent,
      },
    ],
  });

  const content = response.choices[0]?.message?.content?.trim();

  if (!content) {
    throw new Error("AI が応答を生成できませんでした。");
  }

  if (promptType === "dar" && !content.startsWith("F：")) {
    throw new Error("DAR形式で出力されませんでした。");
  }

  return content;
}

export async function generateRevision(
  aiOutput: string,
  instruction: string,
  promptType: PromptType = "dar"
): Promise<string> {
  const openai = getOpenAI();
  const { model } = getOpenAIEnv();

  const response = await openai.chat.completions.create({
    model,
    temperature: 0,
    messages: [
      {
        role: "system",
        content: REVISION_SYSTEM_PROMPT,
      },
      {
        role: "user",
        content: `
【現在の記録】
${aiOutput}

【修正指示】
${instruction}

${
  promptType === "dar"
    ? "DAR構造（F：D:A:R:）を維持して修正してください。"
    : "SOAP構造（S:O:A:P:）を維持して修正してください。"
}

必ず指示に従い、修正後の記録のみ出力してください。
`,
      },
    ],
  });

  const content = response.choices[0]?.message?.content?.trim();

  if (!content) {
    throw new Error("修正結果を生成できませんでした。");
  }

  if (promptType === "dar" && !content.startsWith("F：")) {
    throw new Error("DAR形式で修正結果を出力できませんでした。");
  }

  return content;
}