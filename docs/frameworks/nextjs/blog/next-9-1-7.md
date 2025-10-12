# Next.js 9.1.7

**投稿日**: 2020年1月6日（月曜日）

**著者**: JJ Kasper、Joe Haddad、Luis Alvarez、Tim Neutkens

## 概要

Next.js 9.1.7は、パフォーマンス、開発者体験、互換性の改善に焦点を当てた増分アップデートです。このリリースは、以前のバージョン9と9.1に基づいて構築され、ベースラインのクライアントランタイムサイズを増やすことなく、いくつかの重要な機能強化を導入します。

## 主な改善点

### 1. より小さなクライアント側JavaScript

- アプリケーションサイズを3-8%削減
- hello worldアプリケーションで7.5kB削減
- 最適化されたURLパッケージとJSX出力

### 2. 再設計された本番ビルドCLI出力

- ビルド出力の明瞭性を改善
- gzipファイルサイズを表示
- レンダリングタイプでページを分類（Server、Static、SSG）

### 3. 新しい組み込みポリフィル

- `fetch()`、`URL`、`Object.assign()`のサポートを追加
- 個別のポリフィルパッケージの必要性を排除
- モダンブラウザーのバンドルサイズを削減

### 4. パフォーマンスの最適化

- Google Chromeチームと協力
- First Contentful Paint（FCP）とTime to Interactive（TTI）を改善
- ページのプリフェッチとロードを最適化

### 5. JavaScript機能サポート

- Optional ChainingとNullish Coalescingを追加
- 最新のES2020機能をサポート
- ブラウザー互換性を維持

### 6. デプロイメントの改善

- `next export`アプリケーションのゼロ設定デプロイメント
- シームレスなVercel統合

### 7. React Strict Modeコンプライアンス

- Strict Modeと互換性のあるランタイムに更新
- `next.config.js`でのオプション設定

## 更新手順

```bash
npm i next@latest react@latest react-dom@latest
```

このアップデートは完全に下位互換性があり、すべてのNext.jsプロジェクトに推奨されます。
