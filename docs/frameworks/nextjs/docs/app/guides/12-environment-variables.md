# 環境変数

Next.js は、`.env*` ファイルから環境変数を読み込む機能を組み込みでサポートしています。これにより、環境ごとに異なる設定を管理し、ブラウザで使用する環境変数をバンドルできます。

## 主要な機能

- `.env*` ファイルからの自動読み込み
- ブラウザ用の環境変数のバンドル
- 複数行変数のサポート
- 異なる環境での柔軟な読み込み

## 環境変数の読み込み

### 基本的な使用方法

Next.js は自動的に `.env` ファイルから変数を `process.env` に読み込みます。

#### .env ファイルの作成

プロジェクトルートに `.env` ファイルを作成：

```bash
# .env
DB_HOST=localhost
DB_USER=myuser
DB_PASS=mypassword
```

#### コードでの使用

```typescript
// app/api/db/route.ts
export async function GET() {
  const dbHost = process.env.DB_HOST
  const dbUser = process.env.DB_USER
  const dbPass = process.env.DB_PASS

  // データベース接続ロジック
  return Response.json({ host: dbHost })
}
```

**重要**: サーバーサイドでのみ使用可能です。ブラウザで使用するには `NEXT_PUBLIC_` プレフィックスが必要です。

### 複数行変数のサポート

複数行の値をサポートしています。

#### 改行を使用

```bash
# .env
PRIVATE_KEY="-----BEGIN RSA PRIVATE KEY-----
MIIEpAIBAAKCAQEA...
...
-----END RSA PRIVATE KEY-----"
```

#### \n を使用

```bash
# .env
PRIVATE_KEY="-----BEGIN RSA PRIVATE KEY-----\nMIIEpAIBAAKCAQEA...\n...\n-----END RSA PRIVATE KEY-----"
```

### 変数の参照

他の変数を参照できます。

```bash
# .env
TWITTER_USER=nextjs
TWITTER_URL=https://x.com/$TWITTER_USER
```

使用例：

```typescript
console.log(process.env.TWITTER_URL)
// 出力: https://x.com/nextjs
```

実際の `$` 文字を使用する場合は、エスケープします：

```bash
# .env
AMOUNT=\$100
```

## ブラウザでの環境変数のバンドル

デフォルトでは、環境変数は Node.js 環境でのみ使用可能です。ブラウザで使用するには、`NEXT_PUBLIC_` プレフィックスを付けます。

### NEXT_PUBLIC_ プレフィックス

```bash
# .env
NEXT_PUBLIC_ANALYTICS_ID=abcdefghijk
```

ブラウザで使用可能：

```typescript
// app/components/Analytics.tsx
'use client'

export function Analytics() {
  // ブラウザで使用可能
  const analyticsId = process.env.NEXT_PUBLIC_ANALYTICS_ID

  return <script data-analytics-id={analyticsId} />
}
```

### ビルド時のインライン化

`NEXT_PUBLIC_` で始まる変数は、ビルド時に JavaScript バンドルにインライン化されます。

```javascript
// ビルド前
const analyticsId = process.env.NEXT_PUBLIC_ANALYTICS_ID

// ビルド後（自動的に値が埋め込まれる）
const analyticsId = 'abcdefghijk'
```

**重要**: ビルド時に値が決定されるため、動的な値の変更はできません。

## ランタイム環境変数

動的レンダリング中に環境変数を使用できます。

### Server Components での使用

```typescript
// app/page.tsx
export default async function Page() {
  // ランタイムで評価される
  const apiUrl = process.env.API_URL

  const res = await fetch(apiUrl)
  const data = await res.json()

  return <div>{data.title}</div>
}
```

### Server Actions での使用

```typescript
// app/actions.ts
'use server'

export async function createUser(formData: FormData) {
  const apiKey = process.env.API_KEY

  const res = await fetch('https://api.example.com/users', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      name: formData.get('name'),
    }),
  })

  return res.json()
}
```

## 環境変数の読み込み順序

環境変数は以下の順序で検索されます（最初に見つかった値が使用されます）：

1. `process.env`
2. `.env.$(NODE_ENV).local`
3. `.env.local`（`NODE_ENV=test` の場合はチェックされません）
4. `.env.$(NODE_ENV)`
5. `.env`

### 環境ごとのファイル

#### 開発環境（development）

```bash
# .env.development.local
DATABASE_URL=localhost:5432
API_URL=http://localhost:3001
```

#### 本番環境（production）

```bash
# .env.production.local
DATABASE_URL=production-db.example.com:5432
API_URL=https://api.example.com
```

#### テスト環境（test）

```bash
# .env.test.local
DATABASE_URL=test-db:5432
API_URL=http://test-api:3001
```

### .gitignore の設定

センシティブな情報を含むファイルは `.gitignore` に追加します。

```bash
# .gitignore
.env*.local
.env.local
```

コミットすべきファイル：

- `.env` - デフォルト値とドキュメント用
- `.env.example` - テンプレート用

コミットしないファイル：

- `.env.local` - ローカル環境の設定
- `.env.production.local` - 本番環境の機密情報
- `.env.development.local` - 開発環境の機密情報

## デフォルト値の設定

### NODE_ENV のデフォルト

`NODE_ENV` は自動的に設定されます：

- `next dev` → `development`
- `next build` && `next start` → `production`
- `next test` → `test`

### カスタムデフォルト値

```typescript
// lib/config.ts
export const config = {
  apiUrl: process.env.API_URL || 'http://localhost:3000',
  dbHost: process.env.DB_HOST || 'localhost',
  dbPort: parseInt(process.env.DB_PORT || '5432', 10),
}
```

## TypeScript での型定義

環境変数の型を定義して、型安全性を向上させます。

### 型定義ファイルの作成

```typescript
// env.d.ts
namespace NodeJS {
  interface ProcessEnv {
    DATABASE_URL: string
    API_KEY: string
    NEXT_PUBLIC_API_URL: string
    NODE_ENV: 'development' | 'production' | 'test'
  }
}
```

### バリデーション関数の作成

```typescript
// lib/env.ts
function getEnvVar(key: string): string {
  const value = process.env[key]

  if (!value) {
    throw new Error(`Environment variable ${key} is not set`)
  }

  return value
}

export const env = {
  databaseUrl: getEnvVar('DATABASE_URL'),
  apiKey: getEnvVar('API_KEY'),
  apiUrl: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000',
}
```

## ベストプラクティス

### 1. .env.example を提供

プロジェクトのテンプレートとして `.env.example` を作成します。

```bash
# .env.example
DATABASE_URL=
API_KEY=
NEXT_PUBLIC_API_URL=http://localhost:3000
```

### 2. センシティブな情報を保護

機密情報は必ず `.env.local` に保存し、Git にコミットしないでください。

```bash
# ❌ 悪い例 - .env にコミット
API_KEY=secret-key-12345

# ✅ 良い例 - .env.local に保存（.gitignore に追加）
API_KEY=secret-key-12345
```

### 3. NEXT_PUBLIC_ の使用に注意

`NEXT_PUBLIC_` プレフィックスは、値がブラウザに公開されることを意味します。

```bash
# ❌ 悪い例 - 機密情報をブラウザに公開
NEXT_PUBLIC_API_SECRET=secret-key-12345

# ✅ 良い例 - 公開しても安全な情報のみ
NEXT_PUBLIC_API_URL=https://api.example.com
```

### 4. 環境ごとに異なる値を設定

```bash
# .env.development.local
DEBUG=true
LOG_LEVEL=verbose

# .env.production.local
DEBUG=false
LOG_LEVEL=error
```

### 5. ドキュメント化

`.env.example` にコメントを追加します。

```bash
# .env.example

# データベース接続URL
DATABASE_URL=postgresql://user:password@localhost:5432/mydb

# 外部 API キー
API_KEY=your-api-key-here

# 公開 API エンドポイント（ブラウザで使用可能）
NEXT_PUBLIC_API_URL=http://localhost:3000
```

## 特殊なケース

### /src ディレクトリを使用する場合

`/src` ディレクトリを使用している場合でも、`.env*` ファイルはプロジェクトルートに配置します。

```
my-app/
├── .env.local        ← ここに配置
├── .env.example
├── src/
│   └── app/
└── package.json
```

### Docker での使用

Docker コンテナで環境変数を渡す場合：

```yaml
# docker-compose.yml
services:
  app:
    build: .
    environment:
      - DATABASE_URL=${DATABASE_URL}
      - API_KEY=${API_KEY}
    env_file:
      - .env.production.local
```

### Vercel でのデプロイ

Vercel では、プロジェクト設定で環境変数を設定します：

1. Vercel ダッシュボードでプロジェクトを開く
2. Settings → Environment Variables
3. 変数を追加（環境ごとに設定可能）

## トラブルシューティング

### 環境変数が読み込まれない

1. ファイル名を確認（`.env` であって `env` ではない）
2. プロジェクトルートに配置されているか確認
3. 開発サーバーを再起動
4. `next.config.js` での上書きを確認

### ブラウザで undefined になる

1. `NEXT_PUBLIC_` プレフィックスを追加
2. ビルドを再実行（ビルド時にインライン化される）
3. `process.env.NEXT_PUBLIC_*` の形式で使用

### 値が更新されない

1. 開発サーバーを再起動
2. `.next` フォルダを削除して再ビルド
3. ブラウザのキャッシュをクリア

## まとめ

環境変数を効果的に使用するためのポイント：

1. **セキュリティ**: `.env.local` を `.gitignore` に追加
2. **ブラウザでの使用**: `NEXT_PUBLIC_` プレフィックスを使用
3. **環境ごとの設定**: `.env.development.local`、`.env.production.local` を活用
4. **型安全性**: TypeScript で型定義を作成
5. **ドキュメント化**: `.env.example` を提供

環境変数を適切に管理することで、セキュアで保守性の高い Next.js アプリケーションを構築できます。
