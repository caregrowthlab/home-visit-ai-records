# PubMed 看護文献要約

PubMed から看護・医療文献のタイトルと抄録（abstract）を取得し、OpenAI API で日本語要約と X 投稿文を生成するスクリプトです。

## 必要条件

- Python 3.10+
- **credentials.json** … Google Sheets から PMID を取得する場合に必要。Google Cloud Console で OAuth2 クライアントを作成し、このディレクトリに配置
- **OPENAI_API_KEY** … main.py 内で直接指定（必須）

## セットアップ

### 1. credentials.json の準備

1. [Google Cloud Console](https://console.cloud.google.com/) でプロジェクトを作成
2. 「API とサービス」→「認証情報」→「認証情報を作成」→「OAuth クライアント ID」
3. アプリケーションの種類で「デスクトップアプリ」を選択
4. JSON をダウンロードし、`credentials.json` としてこのディレクトリに保存

### 2. OpenAI API キーの設定

`main.py` の先頭付近にある `OPENAI_API_KEY` 変数に API キーを設定してください。

```python
OPENAI_API_KEY = "sk-xxxx..."
```

### 3. 環境変数（Google Sheets 用・任意）

```bash
export GOOGLE_SHEETS_SPREADSHEET_ID="スプレッドシートのID"
export GOOGLE_SHEETS_WORKSHEET="シート1"    # 省略可
export GOOGLE_SHEETS_RANGE="A2:A100"        # 省略可
```

### 4. 依存関係（Google Sheets 連携のみ）

コマンドラインで PMID を渡すだけの場合は不要です。Sheets 連携を使う場合:

```bash
pip install -r requirements.txt
```

## 使い方

### コマンドラインで PMID を指定

```bash
python main.py 38123456 12345678
```

### Google Sheets から PMID を読み取り

環境変数 `GOOGLE_SHEETS_SPREADSHEET_ID` を設定し、Sheets の B 列（pmid）に PMID を記載:

```bash
export GOOGLE_SHEETS_SPREADSHEET_ID="あなたのスプレッドシートID"
python main.py
```

## エラー処理

- **credentials.json なし** … 設定エラーで終了
- **OPENAI_API_KEY 未設定** … main.py の OPENAI_API_KEY がプレースホルダーのままの場合、設定エラーで終了
- **PubMed API 障害** … 該当 PMID をスキップし、エラーメッセージを表示
- **OpenAI API エラー** (401, 429, 500) … 分かりやすい日本語メッセージで表示
- **予期せぬエラー** … 例外種別とメッセージを表示して継続

## Google Sheets の列構成

| 列 | 項目 | 説明 |
|---|---|---|
| A | retrieved_at | 取得日時（UTC） |
| B | pmid | PubMed ID |
| C | title | 論文タイトル |
| D | abstract | 抄録（英文） |
| E | summary | 日本語要約 |
| F | x_post | X（Twitter）投稿文 |
| G | approved | 承認 |
| H | posted | 投稿済み |

1行目をヘッダー（retrieved_at, pmid, title, abstract, summary, x_post, approved, posted）にしてください。

## 出力

各 PMID について:

1. タイトル・抄録（英文）
2. 日本語要約（abstract を元に OpenAI で生成）
3. X 投稿文（280文字以内、看護・医療関係者向け）
