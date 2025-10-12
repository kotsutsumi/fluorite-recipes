# Image Gallery Starter

## 概要

Next.jsとCloudinaryで構築された画像ギャラリーテンプレートです。

**デモ**: https://nextjsconf-pics.vercel.app/
**GitHub**: https://github.com/vercel/next.js/tree/canary/examples/with-cloudinary

## 主な機能

- Next.jsフレームワークを使用
- 画像管理にCloudinaryを統合
- Tailwind CSSによるスタイリング

## 技術スタック

- **フレームワーク**: Next.js
- **画像管理**: Cloudinary
- **スタイリング**: Tailwind CSS

## セットアップ手順

### プロジェクトの初期化

create-next-appで特定のサンプルフラグを使用して初期化できます:

```bash
npx create-next-app --example with-cloudinary my-image-gallery
```

### 環境変数の設定

Cloudinary APIクレデンシャルの設定が必要です。`.env.local`ファイルを作成し、以下の環境変数を追加してください:

```
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

## デプロイ

Vercelで簡単にデプロイできます。ワンクリックデプロイオプションが利用可能です。

## 使用例

- 画像ギャラリーアプリケーション
- 写真共有サービス
- ポートフォリオサイト

## リソース

- [Cloudinary Documentation](https://cloudinary.com/documentation)
- [Next.js Documentation](https://nextjs.org/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)

## 注意事項

このテンプレートはVercelのテンプレートコレクションの一部であり、画像ギャラリーアプリケーションのスターターテンプレートとして設計されています。
