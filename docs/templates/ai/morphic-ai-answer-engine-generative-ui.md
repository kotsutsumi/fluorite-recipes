# Morphic: AI-powered Answer Engine

## 概要

Generative UIを備えたAI駆動の回答エンジンです。

**デモ**: https://www.morphic.sh/
**GitHub**: https://github.com/miurla/morphic

## 主な機能

- GenerativeUIによるAI駆動検索
- 自然言語での質問理解
- 複数の検索プロバイダーサポート
- UIからのモデル選択
- Supabase経由のユーザー認証
- チャット履歴機能
- 様々なAIプロバイダー(OpenAI、Google、Azure、Anthropicなど)をサポート

## 技術スタック

- **フレームワーク**: Next.js
- **言語**: TypeScript
- **スタイリング**: Tailwind CSS、shadcn/ui
- **認証**: Supabase
- **AIプロバイダー**: OpenAI(デフォルト)
- **検索プロバイダー**: Tavily AI、SearXNG、Exa
- **データストレージ**: オプションでRedisサポート

## はじめに

### 環境変数の設定

`.env.local`ファイルを作成し、以下の環境変数を設定してください:

```bash
# OpenAI
OPENAI_API_KEY=your_openai_api_key

# Tavily AI (検索)
TAVILY_API_KEY=your_tavily_api_key

# Supabase (認証)
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# オプション: Redis
KV_URL=your_redis_url
KV_REST_API_URL=your_redis_rest_url
KV_REST_API_TOKEN=your_redis_token
```

### 依存関係のインストール

```bash
npm install
# または
bun install
```

### 開発サーバーの起動

```bash
npm run dev
# または
bun dev
```

## 機能

### AI駆動検索

自然言語の質問を理解し、関連する回答を生成します。

### 複数のAIプロバイダー

以下のAIプロバイダーをサポート:

- OpenAI
- Google Generative AI
- Azure OpenAI
- Anthropic
- その他のAI SDKプロバイダー

### 検索プロバイダー

- **Tavily AI**: デフォルトの検索プロバイダー
- **SearXNG**: プライバシー重視の検索エンジン
- **Exa**: セマンティック検索

### Generative UI

検索結果をインタラクティブなUIコンポーネントとして表示します。

## デプロイオプション

### Vercelへのデプロイ

```bash
vercel deploy
```

### Dockerデプロイ

```bash
docker build -t morphic .
docker run -p 3000:3000 morphic
```

### ローカル開発

上記のセットアップ手順に従ってください。

## カスタマイズ

### 検索の深さを設定

検索の深さは設定可能です:

- `basic`: 基本的な検索
- `advanced`: 高度な検索

### ブラウザ検索エンジン統合

Morphicをブラウザの検索エンジンとして追加できます。

## 使用例

- AI検索エンジン
- Q&Aシステム
- リサーチアシスタント
- ナレッジベース

## リソース

- [Next.js Documentation](https://nextjs.org/docs)
- [AI SDK Documentation](https://sdk.vercel.ai/docs)
- [Supabase Documentation](https://supabase.com/docs)

## ライセンス

Apache License 2.0
