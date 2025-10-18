# VS Code

## 概要

Visual Studio Codeは、強力な[Prisma VS Code拡張機能](https://marketplace.visualstudio.com/items?itemName=Prisma.prisma)を持つ人気のコードエディターです。拡張機能は以下の実績があります:
- 250万以上のインストール
- 35万の月間アクティブユーザー

## データベース管理UI

### ワークフロー

UIは以下のワークフローを可能にします:
- Prismaで認証
- Prisma Postgresインスタンスの表示、作成、削除
- ローカルインスタンスを「クラウドにプッシュ」
- 埋め込まれたPrisma Studioを介してデータを表示および編集
- データベーススキーマを視覚化

### 使用方法

Prisma Postgresインスタンスを管理するには:
1. 最新のPrisma VS Code拡張機能をインストール
2. アクティビティバーでPrismaロゴを見つける
3. "Sign in to get started"をクリック
4. 認証してワークスペースを選択

## Prisma Studio組み込み

拡張機能は、VS Code内に直接Prisma Studioを埋め込み、簡単なデータベース管理を可能にします。開始するには、[studio-in-vs-codeの手順](/docs/postgres/database/prisma-studio/studio-in-vs-code)に従ってください。

## Prisma MCPサーバー

Postgresデータベースとスキーママイグレーションを管理するためのModel Context Protocol（MCP）サーバーを提供します。

インストール例:
```json
.vscode/mcp.json
{
  "servers": {
    "Prisma-Local": {
      "command": "npx",
      "args": ["-y", "prisma", "mcp"]
    },
    "Prisma-Remote": {
      "command": "npx",
      "args": ["-y", "mcp-remote", "https://mcp.prisma.io/mcp"]
    }
  }
}
```

## エージェントモード

VS Codeエージェントモード（GitHub Copilot搭載）ができること:
- マイグレーションステータスを確認
- スキーママイグレーションを作成/適用
- Prisma Data Platformにサインイン
- Postgresインスタンスをプロビジョニング

### 使用方法

1. GitHub Copilot Chatを開く
2. エージェントモードに切り替え
3. "新しいデータベースを作成"などのリクエストを入力
4. エージェントがワークスペースの許可を要求
5. 許可を与えて操作を実行

このドキュメントは、VS Code内でのPrisma Postgresの包括的な統合機能を説明しています。
