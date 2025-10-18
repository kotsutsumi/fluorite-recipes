# Netlify Edge FunctionsとNeon PostgreSQLでDrizzleを使用するチュートリアル

## 前提条件
- 最新のNetlify CLIがインストールされていること
- Drizzle ORMとDrizzle Kitがインストールされていること
- オプション: `dotenv`パッケージ
- オプション: `@netlify/edge-functions`パッケージ

## 主要なステップ

### 1. Neon Postgresをセットアップ
- Neon Consoleにログイン
- プロジェクトを作成または選択
- データベース接続文字列をコピー
- `.env`ファイルに`DATABASE_URL`を追加

### 2. Netlify Edge Functionsをセットアップ
- `netlify/edge-functions`ディレクトリを作成
- `user.ts`関数を作成
- インポート用の`import_map.json`を作成
- `netlify.toml`設定ファイルを作成

### 3. データベーススキーマを作成
- テーブル定義を含む`schema.ts`を作成
- テーブル例:
```typescript
export const usersTable = pgTable('users_table', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  age: integer('age').notNull(),
  email: text('email').notNull().unique(),
})
```

### 4. Drizzleを設定
- `drizzle.config.ts`を作成
- `npx drizzle-kit push`でデータベースの変更を適用

### 5. データベースに接続
- `user.ts`をデータベース接続で更新
```typescript
const sql = neon(Netlify.env.get("DATABASE_URL")!);
const db = drizzle({ client: sql });
const users = await db.select().from(usersTable);
```

### 6. デプロイ
- `netlify init`でNetlifyプロジェクトを初期化
- 環境変数をインポート
- `netlify deploy`でデプロイ

## 主要な技術
- Drizzle ORM
- Netlify Edge Functions
- Neon Postgres
- TypeScript

このチュートリアルは、モダンなウェブ技術を使用したサーバーレスのデータベース駆動アプリケーションのセットアップに関する包括的なガイドを提供します。
