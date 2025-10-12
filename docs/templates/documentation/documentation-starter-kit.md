# Nextra: Docs Starter Kit

## 概要

Next.jsを活用したシンプルで強力、柔軟なMarkdown駆動のドキュメントサイトです。

**デモ**: https://nextra-docs-template.vercel.app/
**GitHub**: https://github.com/shuding/nextra-docs-template

## 主な機能

- Markdownベースのドキュメント
- Next.jsを活用
- 簡単にデプロイ可能
- 柔軟なドキュメントサイトテンプレート

## 技術スタック

- **フレームワーク**: Next.js
- **スタイリング**: Tailwind CSS
- **ドキュメントフレームワーク**: Nextra

## クイックスタート

### リポジトリのクローン

```bash
git clone https://github.com/shuding/nextra-docs-template.git
cd nextra-docs-template
```

### 依存関係のインストール

```bash
pnpm i
```

### 開発サーバーの起動

```bash
pnpm dev
```

ブラウザで [http://localhost:3000](http://localhost:3000) を開いて結果を確認してください。

## ディレクトリ構造

```
.
├── pages/          # ドキュメントページ(MDX/MD)
├── public/         # 静的アセット
├── theme.config.tsx # Nextra設定
└── next.config.js  # Next.js設定
```

## ドキュメントの作成

### ページの追加

`pages`ディレクトリに新しいMarkdownファイルを作成します:

```markdown
# 私の新しいページ

これはMarkdownで書かれた新しいページです。

## セクション

内容をここに書きます。
```

### ナビゲーションの設定

`theme.config.tsx`でサイトのナビゲーションとテーマを設定できます:

```tsx
import { DocsThemeConfig } from 'nextra-theme-docs'

const config: DocsThemeConfig = {
  logo: <span>私のドキュメント</span>,
  project: {
    link: 'https://github.com/yourusername/your-repo',
  },
  // その他の設定...
}

export default config
```

## 機能

### MDXサポート

Markdownに加えて、MDX(Markdown + JSX)をサポート:

```mdx
import { Callout } from 'nextra-theme-docs'

# 私のページ

<Callout type="warning">
  これは警告です。
</Callout>
```

### コードハイライト

シンタックスハイライト付きのコードブロック:

````markdown
```javascript
function hello() {
  console.log('Hello, World!')
}
```
````

### 検索機能

組み込みの検索機能で簡単にドキュメントを検索できます。

### ダークモード

自動的にダークモードをサポートします。

## デプロイ

### Vercelへのワンクリックデプロイ

GitHubリポジトリをVercelにインポートするだけでデプロイできます。

### 他のプラットフォームへのデプロイ

Next.jsアプリケーションとして、任意のNode.jsホスティングプラットフォームにデプロイできます。

## カスタマイズ

### テーマのカスタマイズ

`theme.config.tsx`で:

- ロゴ
- フッター
- ヘッダー
- サイドバー
- カラースキーム

をカスタマイズできます。

### スタイルのカスタマイズ

Tailwind CSSを使用してスタイルをカスタマイズできます。

## 使用例

- プロダクトドキュメント
- APIリファレンス
- 技術ブログ
- ナレッジベース
- チュートリアルサイト

## リソース

- [Nextra Documentation](https://nextra.site/)
- [Next.js Documentation](https://nextjs.org/docs)

## ライセンス

MITライセンス
