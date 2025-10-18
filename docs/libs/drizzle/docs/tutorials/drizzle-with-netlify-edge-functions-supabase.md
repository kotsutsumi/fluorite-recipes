# Netlify Edge FunctionsとSupabaseデータベースでDrizzleを使用するチュートリアル

## 前提条件
- 最新のNetlify CLIがインストールされていること
- Drizzle ORMとDrizzle Kitがインストールされていること
- オプション: `dotenv`パッケージ
- オプション: `@netlify/edge-functions`パッケージ

## 主要なステップ

### 1. Supabaseプロジェクトを作成
- Supabaseダッシュボードでプロジェクトを作成
- 接続文字列を取得
- `.env`ファイルに`DATABASE_URL`を追加

### 2. Netlify Edge Functionsをセットアップ
- `netlify/edge-functions`ディレクトリを作成
- `user.ts`関数を作成
- インポート用の`import_map.json`を作成
- `netlify.toml`設定ファイルを作成

### 3. データベーススキーマを作成
- テーブル定義を含む`schema.ts`を作成
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
```typescript
const queryClient = postgres(Netlify.env.get("DATABASE_URL")!);
const db = drizzle({ client: queryClient });
```

### 6. デプロイ
- Netlifyプロジェクトを初期化
- 環境変数をインポート
- `netlify deploy`でデプロイ

このチュートリアルは、Drizzle ORMをNetlify Edge FunctionsとSupabaseと統合するための包括的なガイドを提供し、セットアップ、設定、デプロイをカバーしています。
