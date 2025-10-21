# Remix on Vercel

## はじめに

Remixは、サーバーサイドでレンダリングされるフルスタックのReactフレームワークです。Vercelでは、ゼロ設定でRemixアプリケーションをデプロイできます。

## 主な特徴

### セットアップ方法

1. 既存のRemixプロジェクトがある場合:
   - [Vercel CLI](/docs/cli)をインストール
   - プロジェクトのルートディレクトリで`vercel`コマンドを実行

2. テンプレートからデプロイ:
   - [Remixテンプレートをデプロイ](/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fvercel%2Fvercel%2Ftree%2Fmain%2Fexamples%2Fremix)
   - [ライブ例](https://remix-run-template.vercel.app)を確認

### `@vercel/remix`パッケージ

Vercelで最適に動作するユーティリティを提供:

```bash
pnpm i @vercel/remix
```

### Vercel Viteプリセット

Viteプラグインを使用する場合の設定例:

```typescript
// vite.config.ts
import { vitePlugin as remix } from '@remix-run/dev';
import { vercelPreset } from '@vercel/remix/vite';

export default defineConfig({
  plugins: [
    remix({
      presets: [vercelPreset()],
    }),
  ],
});
```

### サーバーサイドレンダリング (SSR)

`app/routes`内のルートは、デフォルトでサーバーサイドレンダリングされます。

### レスポンスストリーミング

遅延データの読み込みによるパフォーマンス向上が可能です。
