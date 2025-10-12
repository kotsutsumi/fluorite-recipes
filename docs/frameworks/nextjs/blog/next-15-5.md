# Next.js 15.5

**公開日**: 2025年8月18日(月曜日)

**著者**:
- Ben Gubler (@bgub_)
- Luke Sandberg (@lukeisandberg)

## 概要

Next.js 15.5には、いくつかの重要な改善が含まれています:

- ベータ版のTurbopackビルド
- 安定版のNode.js Middleware
- TypeScriptの改善
- `next lint`の非推奨化
- Next.js 16の非推奨警告

## アップグレード手順

```bash
# 自動アップグレードCLIを使用
npx @next/codemod@canary upgrade latest

# ...または手動でアップグレード
npm install next@latest react@latest react-dom@latest

# ...または新しいプロジェクトを開始
npx create-next-app@latest
```

## 詳細セクション

### Turbopackビルド(ベータ版)

ハイライト:
- ベータ版で`next build --turbopack`を発表
- vercel.com、v0.app、nextjs.orgなどのVercelウェブサイトで稼働中
- 12億件以上のリクエストを処理

**パフォーマンス結果:**
- 4コアマシンで2倍高速
- 14コアマシンで2.2倍高速
- 小規模サイトで30コアマシンで4倍高速
- 中規模サイトで30コアマシンで2.5倍高速
- 大規模サイトで30コアマシンで5倍高速

**既知の違い:**
- 小規模プロジェクトでは限定的な改善
- 一部のバンドル最適化の違い
- 潜在的なCSSファイルの順序のバリエーション

### Node.js Middleware(安定版)

完全なNode.js APIとnpmパッケージアクセスを備えたMiddlewareでの完全なNode.jsランタイムをサポートするようになりました。

### TypeScriptの改善

- 型付きルート
- ルートエクスポートの検証
- ルートタイプヘルパー
- 新しい`next typegen`コマンド

### `next lint`の非推奨化

`next lint`からより明示的なESLint設定への移行と、代替としてBiomeの導入。

### Next.js 16の非推奨警告

以下に対する警告:
- `legacyBehavior`

このブログ記事は、開発者にNext.js 15.5の新機能を試し、GitHubでフィードバックを提供することを奨励しています。
