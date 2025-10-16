# Drizzle Kit Studio

Drizzle Kit Studioは、ローカルサーバーでDrizzle Studioを起動するコマンドです。

## 概要

- ローカルサーバーでDrizzle Studioを起動
- `drizzle.config.ts`にデータベース接続認証情報が必要
- デフォルトサーバーは`127.0.0.1:4983`で実行

## 基本使用法

```bash
npx drizzle-kit studio
```

## カスタムホストとポート

```bash
npx drizzle-kit studio --host=0.0.0.0 --port=3000
```

## ログオプション

```bash
npx drizzle-kit studio --verbose
```

`--verbose`フラグですべてのSQL文をログ出力します。

## ブラウザ互換性

SafariとBraveでlocalhostアクセスするには`mkcert`が必要です：

1. `mkcert`をインストール
2. 自己署名証明書を生成

## 埋め込み可能なStudioバージョン

- ビジネス向けB2Bオファリング
- フレームワーク非依存のWebコンポーネント
- Turso、Neon、Nuxt Hubなどのプラットフォームで使用

## Chrome拡張機能

PlanetScale、Cloudflare、Vercel Postgresのデータベースをブラウジング可能です。

## 制限事項とライセンス

- オープンソースではない
- ローカル開発では無料
- リモートデプロイメントには適さない

## 設定例

```typescript
// drizzle.config.ts
import { defineConfig } from "drizzle-kit";

export default defineConfig({
  dialect: "postgresql",
  dbCredentials: {
    url: "postgresql://user:password@host:port/dbname"
  },
});
```

Drizzle ORMと統合された直感的なデータベースブラウザを求める開発者に推奨です。
