# Drizzle | Drizzle KitでCloudflare D1 HTTP API

## 前提条件

このガイドは以下の知識を前提としています:
- Drizzle Kit
- Drizzle Studio
- Drizzle Chrome拡張機能
- `drizzle-kit@0.28.0`以上がインストールされていること
- D1データベースとD1編集権限を持つトークンを持つCloudflareアカウント

## 設定

Drizzle KitでCloudflare D1 HTTP APIを使用するには、`drizzle.config.ts`を設定します:

```typescript
import { defineConfig } from 'drizzle-kit';

export default defineConfig({
  schema: './src/schema.ts',
  out: './migrations',
  dialect: 'sqlite',
  driver: 'd1-http',
  dbCredentials: {
    accountId: process.env.CLOUDFLARE_ACCOUNT_ID!,
    databaseId: process.env.CLOUDFLARE_DATABASE_ID!,
    token: process.env.CLOUDFLARE_D1_TOKEN!,
  },
});
```

### 認証情報の取得

1. `accountId`: **Workers & Pages** -> **Overview** -> **Account ID**をコピー
2. `databaseId`: D1データベースを開き、**Database ID**をコピー
3. `token`: **My profile** -> **API Tokens** -> D1編集権限を持つトークンを作成

## 機能

設定後、Drizzle Kitで以下が可能になります:
- `migrate`
- `push`
- `introspect`
- Cloudflare D1 HTTP APIを使用した`studio`コマンド

[Drizzle Chrome拡張機能](https://chromewebstore.google.com/detail/drizzle-studio/mjkojjodijpaneehkgmeckeljgkimnmd)も使用できます。

## 主なポイント
- HTTP API経由でD1データベースにアクセス
- ローカルマイグレーション開発をサポート
- Drizzle Studioとの統合
- セキュアなトークンベースの認証
