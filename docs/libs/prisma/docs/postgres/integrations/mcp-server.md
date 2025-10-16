# Prisma MCPサーバードキュメント

## 概要

Model-Context-Protocol（MCP）は、大規模言語モデル（LLM）が明確に定義された方法でAPIを呼び出し、外部システムにアクセスする方法を提供します。Prismaは2つのMCPサーバーを提供します:

1. ローカルMCPサーバー: ローカルマシンで作業する開発者向け
2. リモートMCPサーバー: データベースを管理するAIプラットフォームを構築する向け

## リモートMCPサーバー

### サーバーの起動

```bash
npx -y mcp-remote https://mcp.prisma.io/mcp
```

### ツール

リモートMCPサーバーは、いくつかのツールを提供します:

- `CreateBackupTool`: 管理されたPrisma Postgresバックアップを作成
- `CreateConnectionStringTool`: 新しい接続文字列を作成
- `CreateRecoveryTool`: バックアップからデータベースを復元
- `DeleteConnectionStringTool`: 接続文字列を削除
- `DeleteDatabaseTool`: Prisma Postgresデータベースを削除
- `ListBackupsTool`: 利用可能なPrisma Postgresバックアップを取得
- `ListConnectionStringsTool`: データベース接続文字列を取得
- `ListDatabasesTool`: 利用可能なPrisma Postgresデータベースを取得
- `ExecuteSqlQueryTool`: SQLクエリを実行
- `IntrospectSchemaTool`: データベーススキーマをイントロスペクト

### サンプルプロンプト

- "アカウント内のすべてのデータベースのリストを表示"
- "USリージョンに新しいデータベースを作成"
- "実際のようなデータでデータベースをシード"

## ローカルMCPサーバー

### サーバーの起動

```bash
npx -y prisma mcp
```

### ツール

ローカルMCPサーバーは、これらのツールを提供します:

- `migrate-status`: マイグレーションステータスを確認
- `migrate-dev`: マイグレーションを作成および実行
- `migrate-reset`: データベースをリセット
- `Prisma-Postgres-account-status`: 認証を確認
- `Create-Prisma-Postgres-Database`: 新しいデータベースを作成
- `Prisma-Login`: 認証
- `Prisma-Studio`: Prisma Studioを開く

### サンプルプロンプト

- "Prisma Data Platformにログイン"
- "マイグレーションステータスを確認"
- "新しいデータベースを作成"

このドキュメントは、PrismaのMCPサーバーを使用してLLMとデータベース管理を統合する方法を説明しています。
