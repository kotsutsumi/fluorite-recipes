# Vercel Edge FunctionsでDrizzleを使用するチュートリアル

このチュートリアルでは、異なるデータベースプロバイダーでVercel Edge FunctionsとDrizzle ORMを使用する方法を説明します。ガイドは4つの主要なデータベース統合をカバーしています:

1. Neon Postgres
2. Vercel Postgres
3. PlanetScale
4. Turso

## 主な前提条件

- 最新のVercel CLIがインストールされていること
- 既存のNext.jsプロジェクトまたは新規作成
- Drizzle ORMとDrizzle Kitがインストールされていること

## Edge互換ドライバー

チュートリアルでは、異なるデータベースに対して特定のedge互換ドライバーを推奨しています:
- Postgres用のNeon serverlessドライバー
- Vercel Postgresドライバー
- MySQL用のPlanetScale serverlessドライバー
- Turso用のlibSQLクライアント

## 共通のセットアップステップ

各データベース統合について、チュートリアルは一般的に以下のステップに従います:
1. 特定のデータベースドライバーをインストール
2. テーブルスキーマを作成
3. Drizzle設定ファイルを構成
4. データベースマイグレーションを適用
5. Drizzle ORMをデータベースに接続
6. APIルートを作成
7. ローカルでテスト
8. Vercelにデプロイ

## スキーマ例(Postgres)

```typescript
export const usersTable = pgTable('users_table', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  age: text('age').notNull(),
  email: text('email').notNull().unique(),
})
```

## APIルート例

```typescript
export const runtime = 'edge' // ランタイムをedgeに指定

export async function GET(request: Request) {
  const users = await db.select().from(usersTable)
  return NextResponse.json({ users, message: 'success' });
}
```

このチュートリアルは、複数のデータベースプロバイダーにわたってVercel Edge FunctionsでDrizzle ORMを実装するための包括的なステップバイステップのガイダンスを提供します。

## 主なポイント
- Edge Runtimeは低レイテンシーとグローバルな配信を提供
- 各データベースには特定のedge互換ドライバーが必要
- Next.js App Routerとの統合が簡単
- Vercelプラットフォームとのシームレスなデプロイ
