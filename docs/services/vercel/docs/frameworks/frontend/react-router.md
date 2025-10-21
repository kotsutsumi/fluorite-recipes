# Vercel での React Router

## 概要

React Router は、React のマルチストラテジーなルーターです。サーバーサイドレンダリングや静的サイト生成をサポートし、Vercel に追加設定なしでデプロイできます。

## 主な特徴

### @vercel/react-router パッケージ

Vercel 固有のユーティリティを提供するオプションのパッケージ。以下のエントリーポイントがあります：

- `@vercel/react-router/vite`
- `@vercel/react-router/entry.server`

インストール方法：

```bash
pnpm i @vercel/react-router
```

### Vercel React Router プリセット

`react-router.config.ts` に以下を追加：

```typescript
import { vercelPreset } from '@vercel/react-router/vite';
import type { Config } from '@react-router/dev/config';

export default {
  ssr: true,
  presets: [vercelPreset()],
} satisfies Config;
```

### サーバーサイドレンダリング (SSR)

- デフォルトでサーバーサイドレンダリングを提供
- Vercel Functions を使用
- トラフィックに応じて自動スケール
- ゼロからスケールする

### レスポンスストリーミング

- Vercel Functions でサポート
- 高速な関数レスポンス
- 大量のデータ処理に対応

### キャッシュ制御

`Cache-Control` ヘッダーを使用してレスポンスをキャッシュ可能

### 分析

Vercel Analytics を使用するには：

1. `@vercel/analytics` をインストール
2. ルートファイルに `Analytics` コンポーネントを追加
