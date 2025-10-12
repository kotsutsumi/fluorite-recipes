# Pinecone - Vercel AI SDK Starter

## 概要

VercelのAI SDKを使用し、Pineconeで検索拡張生成(RAG)パターンを実装するNext.jsスターターチャットボットです。

**デモ**: https://pinecone-vercel-example.vercel.app/
**GitHub**: https://github.com/nicoalbanese/pinecone-vercel-starter

## 主な機能

- コンテキスト認識型チャットボット
- 検索拡張生成(RAG)
- ナレッジベースにPineconeを使用
- ストリーミングチャット応答
- コンテキストの取得と表示

## 技術スタック

- **フレームワーク**: Next.js
- **AI統合**: Vercel AI SDK
- **LLMプロバイダー**: OpenAI
- **ベクトルデータベース**: Pinecone
- **スタイリング**: Tailwind CSS

## はじめに

### 前提条件

- OpenAI APIキー
- Pineconeアカウントとインデックス

### 環境変数の設定

`.env.local`ファイルを作成し、以下の環境変数を設定してください:

```bash
# OpenAI
OPENAI_API_KEY=your_openai_api_key

# Pinecone
PINECONE_API_KEY=your_pinecone_api_key
PINECONE_ENVIRONMENT=your_pinecone_environment
PINECONE_INDEX_NAME=your_index_name
```

### 依存関係のインストール

```bash
npm install
# または
yarn install
# または
pnpm install
```

### 開発サーバーの起動

```bash
npm run dev
# または
yarn dev
# または
pnpm dev
```

## 機能

### 検索拡張生成(RAG)

RAGパターンを使用して、ナレッジベースからの関連情報を使用してより正確でコンテキストに沿った応答を生成します。

### コンテンツのクロールとインデックス化

Webコンテンツをクロールしてインデックス化できます:

```bash
npm run seed
```

### コンテキスト取得

各チャットメッセージで、システムは:

1. ユーザーの質問をベクトルに変換
2. Pineconeで類似ドキュメントを検索
3. 関連コンテキストを取得
4. コンテキストを使用してAI応答を生成

### ストリーミング応答

AI SDKのストリーミング機能を使用して、リアルタイムの応答を提供します。

## デプロイ

Vercelでの簡単なデプロイが可能です。環境変数の設定が必要です。

## 独自の特徴

- 正確でコンテキストに関連したAI応答を提供
- Webコンテンツのクロールとインデックス化が可能
- 高度なコンテキスト取得技術をサポート
- 最先端のAIとベクトルデータベース技術を活用

## 使用例

- カスタマーサポートチャットボット
- ドキュメント検索アシスタント
- ナレッジベースQ&Aシステム
- インテリジェントな検索インターフェース

## リソース

- [Pinecone Documentation](https://docs.pinecone.io/)
- [Vercel AI SDK Documentation](https://sdk.vercel.ai/docs)
- [Next.js Documentation](https://nextjs.org/docs)

## ライセンス

MITライセンス
