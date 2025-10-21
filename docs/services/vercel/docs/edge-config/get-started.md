# Edge Config の使用を開始する

Edge Config は、ネットワークエッジに近いユーザーのためのキーバリューストアです。高性能で低レイテンシーを実現し、フィーチャーフラグ、A/Bテスト、動的設定に最適です。

## 前提条件

- Edge Config SDK をインストール:
  ```bash
  pnpm i @vercel/edge-config
  ```
- 既存のプロジェクト（このクイックスタートでは Next.js を使用）
- 最新の Vercel CLI をインストールまたは更新

## 手順

### 1. Edge Config ストアの作成

1. プロジェクトの Storage タブに移動
2. 「Create Database」をクリック
3. Edge Config を選択
4. `hello_world_store` という名前でストアを作成

### 2. 作成された内容の確認

- プロジェクトに環境変数が自動的に接続
- 読み取りアクセストークンが生成

### 3. キーバリューペアの追加

ダッシュボードで以下のJSONを追加：

```json
{
  "greeting": "hello world"
}
```

### 4. Vercel プロジェクトの接続

ローカルマシンでプロジェクトを接続：

```bash
vercel link
```

### 5. 最新の環境変数を取得

```bash
vercel env pull
```

これにより、`.env.local` ファイルが作成され、`EDGE_CONFIG` 環境変数が含まれます。

### 6. ミドルウェアの作成 (Next.js)

`middleware.ts` ファイルを作成：

```typescript
import { NextResponse } from 'next/server';
import { get } from '@vercel/edge-config';

export const config = { matcher: '/welcome' };

export async function middleware() {
  const greeting = await get('greeting');
  return NextResponse.json(greeting);
}
```

### 7. アプリケーションの実行

```bash
vercel dev
```

ブラウザで `http://localhost:3000/welcome` にアクセスすると、"hello world" が表示されます。

## 次のステップ

### Edge Config の使用方法を学ぶ

- [Edge Config の使用](/docs/edge-config/using-edge-config)
- [Edge Config SDK](/docs/edge-config/edge-config-sdk)
- [Vercel API](/docs/edge-config/vercel-api)

### 統合を探索

- [LaunchDarkly](/docs/edge-config/edge-config-integrations/launchdarkly-edge-config)
- [Statsig](/docs/edge-config/edge-config-integrations/statsig-edge-config)
- [Hypertune](/docs/edge-config/edge-config-integrations/hypertune-edge-config)
- [Split](/docs/edge-config/edge-config-integrations/split-edge-config)
- [DevCycle](/docs/edge-config/edge-config-integrations/devcycle-edge-config)

## トラブルシューティング

### 環境変数が見つからない

`vercel env pull` を実行して、最新の環境変数を取得してください。

### Edge Config が読み取れない

- Edge Config が正しく作成されているか確認
- プロジェクトに接続されているか確認
- 環境変数が正しく設定されているか確認
