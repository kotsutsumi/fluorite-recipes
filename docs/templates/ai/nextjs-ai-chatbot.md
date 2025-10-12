# Next.js AI Chatbot

## 概要

Vercelが構築したフル機能のハッカブルなNext.js AIチャットボットテンプレートです。

**デモ**: https://chat.vercel.ai/
**GitHub**: https://github.com/vercel/ai-chatbot

## 主な機能

- Next.js App Router
- React Server Components
- テキスト生成のためのAI SDK
- LLMとの統一API
- shadcn/uiとTailwind CSS
- Auth.jsによる認証
- Neon Postgresによるデータ永続化
- Vercel Blobによるファイルストレージ

## モデルプロバイダー

- **デフォルト**: xAIモデル(Grok)
- AI SDK経由で複数のAIプロバイダーをサポート

## 技術スタック

- **フレームワーク**: Next.js
- **UIライブラリ**: React
- **スタイリング**: Tailwind CSS
- **認証**: Auth.js
- **データベース**: Neon Postgres
- **ファイルストレージ**: Vercel Blob
- **AI統合**: AI SDK

## 独自の特徴

- 高度にカスタマイズ可能なAIチャットボットテンプレート
- サーバーサイドレンダリング
- 複数のモデルプロバイダーサポート
- 統合認証
- サーバーレスアーキテクチャ

## セットアップ

### 環境変数の設定

`.env.local`ファイルを作成し、以下の環境変数を設定してください:

```bash
# AI Provider
AUTH_SECRET=your_auth_secret
XAI_API_KEY=your_xai_api_key

# Database
DATABASE_URL=your_postgres_url

# Blob Storage
BLOB_READ_WRITE_TOKEN=your_blob_token
```

### 依存関係のインストール

```bash
pnpm install
```

### データベースのセットアップ

```bash
pnpm db:push
```

### 開発サーバーの起動

```bash
pnpm dev
```

## カスタマイズ

### AIモデルの変更

`lib/ai/models.ts`でAIモデルを変更できます:

```typescript
import { openai } from '@ai-sdk/openai';
import { anthropic } from '@ai-sdk/anthropic';

// OpenAIを使用
export const model = openai('gpt-4-turbo');

// Anthropicを使用
export const model = anthropic('claude-3-opus-20240229');
```

## デプロイ

### Vercelへのデプロイ

1. GitHubリポジトリをVercelにインポート
2. 環境変数を設定
3. デプロイ

## 使用例

- カスタマーサポートチャットボット
- AIアシスタントアプリケーション
- インタラクティブなQ&Aシステム

## リソース

- [AI SDK Documentation](https://sdk.vercel.ai/docs)
- [Next.js Documentation](https://nextjs.org/docs)
- [Auth.js Documentation](https://authjs.dev/)

## ライセンス

MITライセンス
