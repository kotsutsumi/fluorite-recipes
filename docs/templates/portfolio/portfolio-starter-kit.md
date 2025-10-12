# Portfolio Starter Kit

## 概要

Next.jsとMarkdownで簡単にポートフォリオを作成できるテンプレートです。

**デモ**: https://portfolio-blog-starter.vercel.app
**GitHub**: https://github.com/vercel/examples/tree/main/solutions/blog

## 主な機能

- MDXとMarkdownサポート
- SEO最適化
- サイトマップ、robots.txt、JSON-LDスキーマを含む
- RSSフィード
- 動的OG画像
- シンタックスハイライト
- Tailwind v4
- Vercel Speed Insights / Web Analytics
- Geistフォント

## 技術スタック

- **フレームワーク**: Next.js
- **スタイリング**: Tailwind CSS
- **コンテンツ**: Markdown/MDX

## はじめに

### デプロイオプション

#### 1. ワンクリックデプロイ(Vercel経由)

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/vercel/examples/tree/main/solutions/blog)

#### 2. クローンしてローカルセットアップ

```bash
git clone https://github.com/vercel/examples.git
cd examples/solutions/blog
pnpm install
pnpm dev
```

ブラウザで [http://localhost:3000](http://localhost:3000) を開いて結果を確認してください。

## プロジェクト構造

```
.
├── app/
│   ├── blog/          # ブログページ
│   ├── page.tsx       # ホームページ
│   └── layout.tsx     # ルートレイアウト
├── content/
│   └── posts/         # Markdownブログポスト
├── public/            # 静的アセット
└── components/        # Reactコンポーネント
```

## コンテンツの作成

### ブログポストの追加

`content/posts`ディレクトリに新しいMarkdownファイルを作成:

```markdown
---
title: "私の最初のポスト"
publishedAt: "2024-01-01"
summary: "これは私の最初のブログポストです"
---

# 私の最初のポスト

これはMarkdownで書かれたコンテンツです。

## セクション

内容をここに書きます。
```

### MDXの使用

よりインタラクティブなコンテンツには、MDX(`.mdx`)を使用:

```mdx
---
title: "インタラクティブなポスト"
publishedAt: "2024-01-02"
---

import { CustomComponent } from '@/components/CustomComponent'

# インタラクティブなポスト

<CustomComponent />

Reactコンポーネントをマークダウンに直接埋め込めます。
```

## カスタマイズ

### サイト設定

`app/config.ts`でサイト情報を更新:

```typescript
export const siteConfig = {
  name: 'あなたの名前',
  description: 'あなたのポートフォリオの説明',
  url: 'https://yoursite.com',
  ogImage: 'https://yoursite.com/og.jpg',
  links: {
    twitter: 'https://twitter.com/yourusername',
    github: 'https://github.com/yourusername',
  },
}
```

### テーマのカスタマイズ

Tailwind CSSを使用してテーマをカスタマイズ:

```javascript
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      colors: {
        primary: '#your-color',
      },
    },
  },
}
```

## SEO機能

### 自動生成される要素

- **サイトマップ**: `/sitemap.xml`で自動生成
- **robots.txt**: `/robots.txt`で自動生成
- **RSS Feed**: `/feed.xml`でブログポストのRSSフィード
- **JSON-LD Schema**: 構造化データの自動生成

### OG画像

動的なOG(Open Graph)画像が各ページで自動生成されます。

## シンタックスハイライト

コードブロックのシンタックスハイライトを組み込みでサポート:

````markdown
```javascript
function hello() {
  console.log('Hello, World!')
}
```
````

サポートされる言語:
- JavaScript/TypeScript
- Python
- Rust
- Go
- その他多数

## Analytics

### Vercel Speed Insights

パフォーマンスメトリクスを自動的に追跡。

### Vercel Web Analytics

ユーザー行動とページビューを追跡。

## デプロイ

### Vercelへのデプロイ

```bash
vercel deploy
```

### 環境変数

本番環境で必要な環境変数(ある場合):

```bash
# .env.local
NEXT_PUBLIC_SITE_URL=https://yoursite.com
```

## 使用例

- 個人ポートフォリオ
- ブログ
- プロフェッショナルなショーケース
- 技術ブログ
- 作品集

## リソース

- [Next.js Documentation](https://nextjs.org/docs)
- [MDX Documentation](https://mdxjs.com/)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)

## ライセンス

MITライセンス
