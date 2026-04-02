"""
Google Sheets との連携モジュール

credentials.json（サービスアカウント）を使用。
gspread.service_account() で直接 credentials.json を読み込む。

環境変数 GOOGLE_SHEETS_SPREADSHEET_ID でスプレッドシートを指定。
sheet1（最初のワークシート）を使用。

列構成:
  A: retrieved_at  取得日時
  B: pmid          PubMed ID
  C: title         論文タイトル
  D: abstract      抄録（英文）
  E: summary      日本語要約
  F: x_post       X投稿文
  G: approved     承認
  H: posted       投稿済み
"""

import os
import traceback
from pathlib import Path

SCRIPT_DIR = Path(__file__).resolve().parent
CREDENTIALS_PATH = SCRIPT_DIR / "credentials.json"


class GoogleSheetsError(Exception):
    """Google Sheets API 関連のエラー"""
    pass


def _get_client():
    """
    credentials.json（サービスアカウント）を直接読み込み、
    gspread クライアントを返す。
    """
    if not CREDENTIALS_PATH.exists():
        raise GoogleSheetsError(
            f"credentials.json が見つかりません。{CREDENTIALS_PATH} に配置してください。"
        )

    try:
        import gspread
    except ImportError as err:
        raise ImportError(
            "Google Sheets 連携には gspread が必要です。\n"
            f"  pip install gspread google-auth\n{err}"
        )

    client = gspread.service_account(filename=str(CREDENTIALS_PATH))
    return client


def _get_worksheet_by_key(spreadsheet_id: str):
    """
    環境変数 GOOGLE_SHEETS_SPREADSHEET_ID で指定したスプレッドシートを開き、
    sheet1（最初のワークシート）を返す。
    """
    client = _get_client()
    sheet = client.open_by_key(spreadsheet_id)
    worksheet = sheet.sheet1
    return worksheet


def load_pubmed_ids_from_sheets(
    spreadsheet_id: str | None = None,
    range_name: str | None = None,
) -> list[str]:
    """
    スプレッドシートから PMID の一覧を取得する。
    sheet1 の B 列（pmid）から読み取る。

    Args:
        spreadsheet_id: スプレッドシートID。省略時は GOOGLE_SHEETS_SPREADSHEET_ID
        range_name: 範囲（例: B2:B100）。省略時は B 列を使用

    Returns:
        PMID のリスト。取得失敗時は空リスト
    """
    if not CREDENTIALS_PATH.exists():
        return []

    sid = spreadsheet_id or os.environ.get("GOOGLE_SHEETS_SPREADSHEET_ID")
    if not sid or not sid.strip():
        return []

    try:
        worksheet = _get_worksheet_by_key(sid)
    except Exception:
        return []

    range_to_read = range_name or "B:B"
    values = worksheet.get(range_to_read)

    pmids: list[str] = []
    for row in values:
        for cell in row:
            s = str(cell).strip()
            if s.isdigit():
                pmids.append(s)
    return pmids


def append_row_to_sheets(
    row: list[str | None],
    spreadsheet_id: str | None = None,
) -> None:
    """
    スプレッドシートの sheet1 末尾に1行追加する。
    デバッグ用の詳細出力あり。

    row: [retrieved_at, pmid, title, abstract, summary, x_post, approved, posted]
    """
    sid = spreadsheet_id or os.environ.get("GOOGLE_SHEETS_SPREADSHEET_ID")
    if not sid or not sid.strip():
        raise GoogleSheetsError(
            "GOOGLE_SHEETS_SPREADSHEET_ID が設定されていません。"
        )

    try:
        worksheet = _get_worksheet_by_key(sid)
    except Exception:
        traceback.print_exc()
        raise

    # 空文字はそのまま。None は空文字に
    values = [str(v) if v is not None else "" for v in row]

    # デバッグ: 書き込む配列を表示
    print("[Sheets デバッグ] これから書き込む配列:")
    for i, v in enumerate(values):
        preview = (str(v)[:50] + "...") if len(str(v)) > 50 else str(v)
        print(f"  [{i}] {preview}")

    try:
        # 追加前の状態
        all_values_before = worksheet.get_all_values()
        row_count_before = len(all_values_before)
        row_number_to_write = row_count_before + 1  # 1-based

        worksheet.append_row(values, value_input_option="USER_ENTERED")

        # 追加後の確認
        all_values_after = worksheet.get_all_values()
        row_count_after = len(all_values_after)
        last_row = all_values_after[-1] if all_values_after else []

        print(f"[Sheets デバッグ] 書いた行:  {row_number_to_write} 行目")
        print(f"[Sheets デバッグ] 追記後の総行数: {row_count_after}")
        print(f"[Sheets デバッグ] get_all_values() の最後の1行: {last_row}")
        print("Sheets append success")

    except Exception:
        traceback.print_exc()
        raise


def get_pending_x_posts(spreadsheet_id: str | None = None) -> list[dict]:
    """
    approved=TRUE かつ posted=FALSE の行を取得する。
    投稿待ちの x_post 一覧。

    Returns:
        [{"row_number": 2, "x_post": "..."}, ...]
        row_number は 1-based（1=ヘッダー、2=1行目データ）
    """
    sid = spreadsheet_id or os.environ.get("GOOGLE_SHEETS_SPREADSHEET_ID")
    if not sid or not sid.strip():
        return []

    if not CREDENTIALS_PATH.exists():
        return []

    try:
        worksheet = _get_worksheet_by_key(sid)
    except Exception:
        return []

    all_values = worksheet.get_all_values()
    if not all_values:
        return []

    # 列: A=0, B=1, C=2, D=3, E=4, F=5(x_post), G=6(approved), H=7(posted)
    result = []
    for i, row in enumerate(all_values):
        row_num = i + 1  # 1-based
        if row_num == 1:
            continue  # スキップヘッダー
        if len(row) < 8:
            continue
        x_post = str(row[5]).strip() if len(row) > 5 else ""
        approved = str(row[6]).strip().upper() if len(row) > 6 else ""
        posted = str(row[7]).strip().upper() if len(row) > 7 else ""

        if approved != "TRUE":
            continue
        if posted == "TRUE":
            continue  # 既に投稿済みはスキップ
        if not x_post:
            continue

        result.append({"row_number": row_num, "x_post": x_post})
    return result


def update_posted_to_true(row_number: int, spreadsheet_id: str | None = None) -> None:
    """
    指定行の posted 列（H列）を TRUE に更新する。
    """
    sid = spreadsheet_id or os.environ.get("GOOGLE_SHEETS_SPREADSHEET_ID")
    if not sid or not sid.strip():
        raise GoogleSheetsError("GOOGLE_SHEETS_SPREADSHEET_ID が設定されていません。")

    worksheet = _get_worksheet_by_key(sid)
    worksheet.update_acell(f"H{row_number}", "TRUE")
