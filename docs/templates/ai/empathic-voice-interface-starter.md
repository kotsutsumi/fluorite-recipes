# Hume AI - Empathic Voice Interface Starter

## 概要

Hume AIのEmpathic Voice Interfaceを使用した音声チャットテンプレートです。

**デモ**: https://hume-evi-next-js-starter.vercel.app/
**GitHub**: https://github.com/humeai/hume-evi-next-js-starter

## 主な機能

- 音声ベースのチャットインターフェース
- Hume AIのReact SDKを使用
- Next.js App Routerで実装

## 技術スタック

- **フレームワーク**: Next.js
- **スタイリング**: Tailwind CSS
- **AI SDK**: Hume AI SDK

## はじめに

### 前提条件

- Hume APIキー
- Hume Secretキー

### 環境変数の設定

`.env.local`ファイルを作成し、以下の環境変数を設定してください:

```bash
HUME_API_KEY=your_api_key
HUME_SECRET_KEY=your_secret_key
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

ブラウザで [http://localhost:3000](http://localhost:3000) を開いて結果を確認してください。

## 機能

### 音声認識

Hume AIのEmpathic Voice Interfaceは、ユーザーの音声を認識し、感情を分析します。

### 感情分析

音声から感情を検出し、それに応じた応答を生成します。

### リアルタイム応答

音声入力に対してリアルタイムで応答を生成します。

## デプロイ

Vercelでの簡単なデプロイが可能です:

1. GitHubリポジトリをVercelにインポート
2. 環境変数を設定
3. デプロイ

## サポート

コミュニティサポートはDiscordで利用可能です。

## 使用例

- 音声アシスタント
- カスタマーサポート
- インタラクティブな音声アプリケーション

## リソース

- [Hume AI Documentation](https://hume.ai/docs)
- [Next.js Documentation](https://nextjs.org/docs)

## 注意事項

このテンプレートは、開発者がHume AIの音声技術を統合するための迅速なセットアップを提供するよう設計されています。

## ライセンス

MITライセンス
