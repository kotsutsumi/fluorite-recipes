# Next.js 11

**投稿日**: 2021年6月15日（火曜日）

**著者**: JJ Kasper、Shu Ding、Tim Neutkens、Tobias Koppers

## 主な機能

Next.js 11では、いくつかの重要な改善が導入されました：

### 1. コンフォーマンス

GoogleのWeb Platformsチームと協力して開発された、最適なUXをサポートするソリューションを提供するシステム。

### 2. パフォーマンスの改善

- 起動時間の短縮
- さらなるBabelローダーの最適化

### 3. スクリプト最適化（`next/script`）

- サードパーティスクリプトの読み込みを自動的に優先順位付け
- 3つの読み込み戦略：
  * `beforeInteractive`：ページインタラクティブ前の重要なスクリプト
  * `afterInteractive`：ハイドレーション後のスクリプトのデフォルト戦略
  * `lazyOnload`：アイドル時間中に読み込まれるスクリプト

### 4. 画像の改善（`next/image`）

- ローカル画像の自動サイズ検出
- レイアウトシフトを削減するためのブラーアッププレースホルダー

### 5. Webpack 5

すべてのNext.jsアプリケーションでデフォルトで有効化

### 6. Create React Appの移行（実験的）

CRAプロジェクトを自動的にNext.js互換に変換

### 7. Next.js Live（プレビューリリース）

- ブラウザーベースの開発
- リアルタイムコラボレーション

## アップグレード手順

```bash
npm i next@latest react@latest react-dom@latest
```

## まとめ

このブログ記事は、コード例と実装の詳細を含む各機能の詳細な説明を提供しています。
