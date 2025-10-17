# MCP サーバー

## 概要
Model Context Protocol（MCP）は、Claude、Cursor、その他のAI駆動ツールなどのAIアシスタントが外部データソースやシステムと安全に接続できるようにするオープン標準です。AIツールが実世界のデータと機能にアクセスするための「ユニバーサルリモート」として説明されています。

## インストールガイド

### ステップ1: AIツールを選択
サポートされているツール：
- Claude Desktop（初心者に推奨）
- Cursor
- Windsurf by Codeium
- その他のMCP互換ツール

### ステップ2: 設定ファイルの場所
ツールに応じて、設定ファイルは以下の場所にあります：
- Claude Desktop: `.cursor/mcp.json`
- Cursor: `.cursor/mcp.json`
- Windsurf: `.codeium/windsurf/mcp_config.json`

### ステップ3: Kibo UI設定を追加
設定例：
```json
{
  "mcpServers": {
    "kibo-ui": {
      "command": "npx",
      "args": [
        "-y",
        "mcp-remote",
        "https://www.kibo-ui.com/api/mcp/mcp"
      ]
    }
  }
}
```

### ステップ4: AIツールを再起動
AIアプリケーションを閉じて、再度開きます。

### ステップ5: 接続を確認
利用可能なコンポーネントについてAIアシスタントに尋ねてテストします。

## 複数のMCPサーバー
複数のサーバーを同時に使用できます：
```json
{
  "mcpServers": {
    "kibo-ui": { ... },
    "github": { ... },
    "filesystem": { ... }
  }
}
```

## 使用例

### コンポーネント情報の取得
クエリ例：「Kibo UI Buttonコンポーネントを異なるバリアントで使用する方法を教えてください」

### レイアウトの構築
クエリ例：「Kibo UIコンポーネントを使用してダッシュボードレイアウトを作成するのを手伝ってください」

### スタイリングガイダンス
クエリ例：「Kibo UIで推奨されるスペーシングトークンは何ですか？」

## セキュリティとプライバシー

### データ処理
- 公開コンポーネントのドキュメントのみが提供されます
- 個人データは含まれません
