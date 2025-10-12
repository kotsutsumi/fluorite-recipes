# Next.js Preview Mode

## 概要

プレビューモードを実証するNext.jsテンプレートです。コンテンツ編集者が公開前に下書きコンテンツをリアルタイムで確認できます。

**デモ**: https://next-preview.vercel.app/
**GitHub**: https://github.com/vercel/preview-mode-demo

## 主な機能

- Next.jsの静的サイト生成(SSG)を展示
- 認証されたユーザーの下書きコンテンツプレビューを実現
- オンデマンドレンダリング機能を実証

## 技術スタック

- **フレームワーク**: Next.js
- **レンダリング**: 静的サイト生成(SSG)
- **スタイリング**: CSS Modules

## 独自の特徴

**「公開前にコンテンツの変更をプレビュー」** - コンテンツ編集者がCMSからリアルタイムで下書きコンテンツを確認できます。

## 学習リソース

- [Next.js 9.3 ブログ投稿](https://nextjs.org/blog/next-9-3)
- [Next.js プレビューモードドキュメント](https://nextjs.org/docs/pages/building-your-application/configuring/preview-mode)

## 使用例

- コンテンツ管理
- 下書きコンテンツのプレビュー
- リアルタイム編集ワークフロー

## はじめに

### プロジェクトのクローン

```bash
git clone https://github.com/vercel/preview-mode-demo.git
cd preview-mode-demo
```

### 依存関係のインストール

```bash
npm install
# または
yarn install
```

### 開発サーバーの起動

```bash
npm run dev
# または
yarn dev
```

## プレビューモードの有効化

1. `/api/preview?secret=<token>`にアクセスしてプレビューモードを有効化
2. プレビューモードが有効化されると、下書きコンテンツが表示されます
3. `/api/exit-preview`にアクセスしてプレビューモードを終了

## デプロイ

Vercelでの簡単なデプロイが可能です。

## リソース

- [Next.js Documentation](https://nextjs.org/docs)
- [Preview Mode Guide](https://nextjs.org/docs/pages/building-your-application/configuring/preview-mode)

## 注意事項

このテンプレートは、Next.jsの高度なレンダリングとプレビュー機能の実用的な例を提供しており、動的コンテンツワークフローを実装したい開発者に価値があります。
