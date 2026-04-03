import { NextRequest, NextResponse } from "next/server";
import { getOrganizationId } from "@/lib/get-organization-id";
import { getSupabase } from "@/lib/supabase";

/** 患者一覧取得（ログインユーザーの organization に属する患者のみ） */
export async function GET(request: NextRequest) {
  try {
    const organizationId = await getOrganizationId(request);

    if (!organizationId) {
      return NextResponse.json(
        { error: "組織が特定できません。ログインしてください。" },
        { status: 401 }
      );
    }

    const supabase = getSupabase();

    const { data, error } = await supabase
      .from("patients")
      .select("id, patient_name")
      .eq("organization_id", organizationId)
      .order("patient_name");

    if (error) {
      console.error("[api/patients GET] Supabase select error:", {
        message: error.message,
        code: error.code,
        details: error.details,
        hint: error.hint,
        fullError: String(error),
      });
      return NextResponse.json(
        { error: `患者一覧の取得に失敗しました: ${error.message}` },
        { status: 500 }
      );
    }

    const patients = data ?? [];
    return NextResponse.json({ patients });
  } catch (err) {
    console.error("[api/patients GET] fetch/接続エラー 詳細:", {
      name: err instanceof Error ? err.name : "Unknown",
      message: err instanceof Error ? err.message : String(err),
      stack: err instanceof Error ? err.stack : undefined,
      cause: err instanceof Error ? err.cause : undefined,
    });
    return NextResponse.json(
      { error: "予期しないエラーが発生しました。" },
      { status: 500 }
    );
  }
}
