# Next.js 8

**投稿日**: 2019年2月11日（月曜日）

**著者**: Connor Davis、Shu Ding、Tim Neutkens

## 主な機能

Next.js 8では、いくつかの重要な改善が導入されました：

- サーバーレスNext.js
- ビルド時のメモリ使用量の大幅削減
- ビルド時の環境設定
- プリフェッチのパフォーマンス改善
- より小さな初期HTMLサイズ
- 改善されたオンデマンドエントリー
- 開発環境でのポートリスニングの高速化
- より高速な静的エクスポート
- Head要素の重複排除
- 新しいcrossOrigin設定オプション
- インラインJavaScriptの削除
- API認証の例

## インストール

```bash
npm i next@latest react@latest react-dom@latest
```

## ハイライト

### サーバーレスNext.js

サーバーレスターゲットは、`pages`ディレクトリの各ページをスタンドアロンのLambda関数に変換します。このアプローチは以下を提供します：

- 分散された障害点
- 無限のスケーラビリティ
- 「使用した分だけ支払う」モデル

### 設定例

```javascript
module.exports = {
  target: 'serverless',
};
```

### Next.jsを採用している注目企業

- AT&T
- Starbucks
- Twitch

## まとめ

このブログ記事では、各機能について詳細な技術的説明を提供し、後方互換性とパフォーマンスの改善を強調しています。
