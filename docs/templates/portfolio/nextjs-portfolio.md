# Next.js Portfolio with Blog

## 概要

Next.jsとMarkdownで簡単にポートフォリオを作成できるテンプレートです。

**デモ**: https://portfolio-blog-starter.vercel.app
**GitHub**: https://github.com/vercel/examples/tree/main/solutions/blog

## 主な機能

- MDXとMarkdownサポート
- SEO最適化
- RSSフィード
- 動的OG画像
- シンタックスハイライト
- Tailwind v4
- Vercel Speed Insights / Web Analytics
- Geistフォント

## 技術スタック

- **フレームワーク**: Next.js
- **スタイリング**: Tailwind CSS
- **コンテンツ管理**: Markdown/MDX

## デプロイオプション

### 1. ワンクリックデプロイ(Vercel経由)

GitHubリポジトリをVercelにインポートするだけでデプロイできます。

### 2. クローンしてローカルセットアップ

#### create-next-appを使用

```bash
pnpm create next-app --example https://github.com/vercel/examples/tree/main/solutions/blog my-portfolio
```

#### リポジトリをクローン

```bash
git clone https://github.com/vercel/examples.git
cd examples/solutions/blog
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

## プロジェクト構造

```
.
├── app/
│   ├── blog/          # ブログセクション
│   │   └── posts/     # 個別のブログポスト
│   ├── work/          # ポートフォリオ/作品セクション
│   ├── page.tsx       # ホームページ
│   └── layout.tsx     # ルートレイアウト
├── content/           # Markdownコンテンツ
│   ├── posts/         # ブログポスト
│   └── work/          # ポートフォリオ項目
├── public/            # 静的アセット
└── components/        # 再利用可能なコンポーネント
```

## コンテンツの作成

### ブログポストの追加

`content/posts`ディレクトリに新しいMarkdownファイルを作成:

```markdown
---
title: "プロジェクトについて"
publishedAt: "2024-01-01"
summary: "私の最新プロジェクトの概要"
image: "/images/project.jpg"
---

# プロジェクトについて

このプロジェクトでは...

## 使用技術

- Next.js
- TypeScript
- Tailwind CSS
```

### ポートフォリオ項目の追加

`content/work`ディレクトリに作品を追加:

```markdown
---
title: "Eコマースプラットフォーム"
date: "2024-01-01"
description: "モダンなEコマースプラットフォームの構築"
image: "/images/ecommerce.jpg"
tags: ["Next.js", "Stripe", "PostgreSQL"]
---

# Eコマースプラットフォーム

このプロジェクトでは、フル機能のEコマースプラットフォームを構築しました...
```

## カスタマイズ

### 個人情報の更新

`app/config.ts`または適切な設定ファイルで個人情報を更新:

```typescript
export const personalInfo = {
  name: 'あなたの名前',
  title: 'ソフトウェアエンジニア',
  bio: 'あなたの自己紹介',
  email: 'your.email@example.com',
  social: {
    github: 'https://github.com/yourusername',
    twitter: 'https://twitter.com/yourusername',
    linkedin: 'https://linkedin.com/in/yourusername',
  },
}
```

### デザインのカスタマイズ

Tailwind CSSを使用してデザインをカスタマイズ:

```javascript
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      colors: {
        brand: {
          primary: '#your-primary-color',
          secondary: '#your-secondary-color',
        },
      },
      fontFamily: {
        sans: ['var(--font-geist-sans)'],
      },
    },
  },
}
```

## SEO機能

### メタデータ

各ページで適切なメタデータを設定:

```typescript
export const metadata = {
  title: 'あなたの名前 - ポートフォリオ',
  description: 'ソフトウェアエンジニアのポートフォリオとブログ',
}
```

### 動的OG画像

各ページとブログポストで動的なOG画像が自動生成されます。

### サイトマップとRSS

- `/sitemap.xml` - 自動生成されるサイトマップ
- `/rss.xml` - ブログポストのRSSフィード

## アナリティクス

### Vercel Analytics統合

自動的にページビューとパフォーマンスを追跡:

- Speed Insights
- Web Analytics
- Real User Monitoring

## デプロイ

### Vercelへのデプロイ

```bash
vercel deploy
```

または、GitHubリポジトリをVercelに接続して自動デプロイを設定。

### カスタムドメイン

Vercelダッシュボードでカスタムドメインを設定できます。

## 使用例

- 個人ポートフォリオサイト
- 技術ブログ
- プロフェッショナルなショーケース
- フリーランサーのウェブサイト
- デザイナーのポートフォリオ

## ベストプラクティス

- 高品質な画像を使用
- 各プロジェクトに詳細な説明を記載
- 定期的にブログを更新
- SEOキーワードを最適化
- モバイルレスポンシブデザインを確保

## リソース

- [Next.js Documentation](https://nextjs.org/docs)
- [MDX Documentation](https://mdxjs.com/)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [Vercel Analytics Documentation](https://vercel.com/docs/analytics)

## ライセンス

MITライセンス
