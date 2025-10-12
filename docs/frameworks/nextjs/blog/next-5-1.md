# Next.js 5.1: 高速なページ解決、環境設定など

**投稿日**: 2018年3月26日（月曜日）

**著者**:
- Arunoda Susiripala ([@arunoda](https://twitter.com/arunoda))
- Tim Neutkens ([@timneutkens](https://twitter.com/timneutkens))

## 概要

Next.js 5.1では、いくつかの重要な改善が導入されました：
- パフォーマンスの向上
- 環境設定のサポート
- エラーハンドリングの改善
- 新しい設定オプション

## 主な機能

### 高速なページ解決

- ページ解決が**102倍**高速化
- 以前は平均2.347msかかっていた
- 現在は平均0.023ms
- Next.js 5.0の研究とアーキテクチャの変更に基づく

### 環境設定

`next.config.js`に`publicRuntimeConfig`と`serverRuntimeConfig`を導入：

```javascript
module.exports = {
  serverRuntimeConfig: {
    // サーバーサイドでのみ利用可能
    mySecret: 'secret',
  },
  publicRuntimeConfig: {
    // サーバーとクライアントの両方で利用可能
    staticFolder: '/static',
  },
};
```

### エラーハンドリングの改善

- エラーハンドリングロジックをリファクタリング
- ルーターが404ステータスのページを自動的に検出してリロード
- 静的ファイルホストやCDNとの互換性を向上

### 設定フェーズ

Next.jsのランタイムフェーズに基づいた条件付き設定が可能に：

```javascript
const {PHASE_DEVELOPMENT_SERVER} = require('next/constants')
module.exports = (phase, {defaultConfig}) => {
  if(phase === PHASE_DEVELOPMENT_SERVER) {
    return { /* 開発環境専用の設定オプション */ }
  }

  return { /* 開発環境以外のすべてのフェーズの設定オプション */ }
}
```

## インストール

```bash
npm i next@latest react@latest react-dom@latest
```

関連するプラグイン（`@zeit/next-css`、`@zeit/next-sass`など）のアップグレードも推奨されます。
