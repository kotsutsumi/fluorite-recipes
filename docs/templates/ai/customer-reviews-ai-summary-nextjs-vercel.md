# Customer Reviews AI Summary

## 概要

大規模言語モデルを使用してカスタマーフィードバックを要約するテンプレートです。

**デモ**: https://review-summary.vercel.app/
**GitHub**: https://github.com/vercel/ai-review-summary

## 主な機能

- カスタマーレビューのAI駆動要約を生成
- すべてのレビューを読まずに全体的なセンチメントを迅速に理解
- 大規模言語モデル(LLM)を使用してレビュー内容を分析および要約

## 技術スタック

- **フレームワーク**: Next.js
- **スタイリング**: Tailwind CSS
- **AI統合**: AI SDK(複数のLLMモデルをサポート)

## はじめに

### 前提条件

- Perplexityの推論API用のAPIキー(または他のLLMプロバイダー)

### 環境変数の設定

`.env.local`ファイルを作成し、以下の環境変数を設定してください:

```bash
# AI Provider API Key
OPENAI_API_KEY=your_api_key
# または
ANTHROPIC_API_KEY=your_api_key
# または
PERPLEXITY_API_KEY=your_api_key
```

### 依存関係のインストール

```bash
pnpm install
```

### 開発サーバーの起動

```bash
pnpm dev
```

ブラウザで [http://localhost:3000](http://localhost:3000) を開いて結果を確認してください。

## 機能

### レビュー分析

カスタマーレビューを自動的に分析し、以下を抽出します:

- 全体的なセンチメント(ポジティブ/ネガティブ/ニュートラル)
- 主要なテーマとトピック
- 頻繁に言及される機能
- 改善が必要な領域

### 要約生成

分析に基づいて、簡潔で理解しやすい要約を生成します。

## カスタマイズ

### LLMモデルの変更

最小限の変更で他のLLMモデルを設定できます。`lib/ai.ts`を編集:

```typescript
import { openai } from '@ai-sdk/openai';
import { anthropic } from '@ai-sdk/anthropic';

// OpenAIを使用
export const model = openai('gpt-4-turbo');

// Anthropicを使用
export const model = anthropic('claude-3-opus-20240229');
```

## デプロイ

Vercelでのワンクリックテンプレートインストールで簡単にデプロイできます。

## 使用例

- Eコマース製品レビューの要約
- カスタマーフィードバック分析
- センチメント分析ダッシュボード
- 製品改善インサイト

## リソース

- [AI SDK Documentation](https://sdk.vercel.ai/docs)
- [Next.js Documentation](https://nextjs.org/docs)

## ライセンス

MITライセンス
