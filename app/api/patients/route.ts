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
      .select("id, patient_name, patient_code")
      .eq("organization_id", organizationId)
      .eq("is_active", true)
      .order("patient_name");

    if (error) {
      console.error("[api/patients GET] Supabase select error:", {
        message: error.message,
        code: error.code,
      });
      return NextResponse.json(
        { error: `患者一覧の取得に失敗しました: ${error.message}` },
        { status: 500 }
      );
    }

    const patients = data ?? [];
    return NextResponse.json({ patients });
  } catch (err) {
    console.error("Patients API error:", err);
    return NextResponse.json(
      { error: "予期しないエラーが発生しました。" },
      { status: 500 }
    );
  }
}
