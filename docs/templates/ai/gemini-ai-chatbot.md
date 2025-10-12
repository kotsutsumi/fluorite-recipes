# Gemini AI Chatbot

## 概要

Vercel AI SDK、Next.js、ReactによるGemini駆動のチャットボットです。

**デモ**: https://gemini.vercel.ai
**GitHub**: https://github.com/vercel-labs/gemini-chatbot

## 主な機能

- Next.js App Router
- React Server Components
- 統一テキスト生成APIを持つAI SDK
- 複数のAIモデルプロバイダーをサポート
- shadcn/uiとTailwind CSS
- Vercel PostgresとBlobによるデータ永続化
- NextAuth.js認証

## 技術スタック

- **フレームワーク**: Next.js
- **UIライブラリ**: React
- **AI統合**: Vercel AI SDK
- **スタイリング**: Tailwind CSS、shadcn/ui
- **データベース**: Vercel Postgres
- **認証**: NextAuth.js

## モデルプロバイダー

- **デフォルト**: Google Gemini
- **サポート**: OpenAI、Anthropic、Cohereなど

## はじめに

### 環境変数の設定

`.env.local`ファイルを作成し、以下の環境変数を設定してください:

```bash
# Google Gemini
GOOGLE_GENERATIVE_AI_API_KEY=your_gemini_api_key

# NextAuth
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your_nextauth_secret

# Database
POSTGRES_URL=your_postgres_url

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

## 機能

### チャットインターフェース

Geminiを使用したインタラクティブなチャットインターフェースを提供します。

### 会話履歴

ユーザーの会話履歴をPostgreSQLデータベースに保存します。

### ファイルアップロード

Vercel Blobを使用してファイルをアップロードし、会話内で共有できます。

### 認証

NextAuth.jsを使用した安全な認証システムを実装しています。

## カスタマイズ

### AIモデルの変更

`lib/ai/models.ts`でAIモデルを変更できます:

```typescript
import { google } from '@ai-sdk/google';
import { openai } from '@ai-sdk/openai';

// Geminiを使用
export const model = google('gemini-1.5-pro-latest');

// OpenAIを使用
export const model = openai('gpt-4-turbo');
```

## デプロイ

### Vercelへのワンクリックデプロイ

1. GitHubリポジトリをVercelにインポート
2. 環境変数を設定
3. デプロイ

## 独自の特徴

- 柔軟なAIモデル統合
- サーバーサイドレンダリング
- 簡単なデプロイ
- 包括的な認証

## 使用例

- カスタマーサポートボット
- パーソナルAIアシスタント
- 教育用チャットボット
- ビジネスQ&Aシステム

## リソース

- [Vercel AI SDK Documentation](https://sdk.vercel.ai/docs)
- [Google Gemini API Documentation](https://ai.google.dev/docs)
- [Next.js Documentation](https://nextjs.org/docs)

## ライセンス

MITライセンス
