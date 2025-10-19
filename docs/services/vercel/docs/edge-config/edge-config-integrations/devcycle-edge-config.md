# DevCycleとVercel Edge Configの連携

このガイドでは、Vercel の DevCycle 統合と Edge Config の使用方法について説明します。この統合により、Edge Config を DevCycle フィーチャーフラグの設定ソースとして利用できます。

## 前提条件

以下のものが必要です：

### 1. 最新バージョンのVercel CLI

```bash
pnpm i -g vercel@latest
```

### 2. プロジェクト

Next.jsプロジェクトを作成する場合：

```bash
npx create-next-app@latest
```

### 3. Vercelプロジェクト

プロジェクトをVercelにデプロイまたはリンクします。

### 4. Edge Config

VercelダッシュボードでEdge Configを作成します。

### 5. Edge Config SDK

```bash
pnpm i @vercel/edge-config
```

## DevCycle統合のセットアップ

### 手順

1. [DevCycleの統合マーケットプレイス](https://vercel.com/integrations/devcycle)にアクセス
2. 統合ボタンをクリック
3. Vercelチームとプロジェクトを選択
4. DevCycleにログイン
5. DevCycleのOrganizationとプロジェクトを選択
6. Edge Configストアに接続
7. セットアップ完了

## DevCycle Edge Configパッケージのインストール

```bash
pnpm i @devcycle/vercel-edge-config @vercel/edge-config
```

## 環境変数の設定

統合後、以下の環境変数が自動的に作成されます：

- `EDGE_CONFIG`: Edge Config接続文字列
- `DEVCYCLE_SERVER_SDK_KEY`: DevCycleサーバーSDKキー

## コード内での使用例

### Next.js App Router

```typescript
import { createClient } from '@vercel/edge-config';
import { EdgeConfigSource } from '@devcycle/vercel-edge-config';
import { setupDevCycle } from '@devcycle/nextjs-sdk/server';

const edgeClient = createClient(process.env.EDGE_CONFIG ?? '');
const edgeConfigSource = new EdgeConfigSource(edgeClient);

export const { getVariableValue, getClientContext } = setupDevCycle({
  serverSDKKey: process.env.DEVCYCLE_SERVER_SDK_KEY ?? '',
  options: {
    configSource: edgeConfigSource,
  },
});
```

### ミドルウェアでの使用

```typescript
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getVariableValue } from './devcycle';

export async function middleware(request: NextRequest) {
  const user = {
    user_id: 'user-123',
  };

  const showFeature = await getVariableValue(user, 'my-feature', false);

  if (!showFeature) {
    return new NextResponse('Feature not available', { status: 403 });
  }

  return NextResponse.next();
}

export const config = {
  matcher: '/beta/:path*',
};
```

### ページでの使用

```typescript
import { getVariableValue } from '@/devcycle';

export default async function Page() {
  const user = {
    user_id: 'user-123',
  };

  const welcomeMessage = await getVariableValue(
    user,
    'welcome-message',
    'Welcome!'
  );

  return <h1>{welcomeMessage}</h1>;
}
```

## DevCycleダッシュボードでの管理

### フィーチャーフラグの作成

1. DevCycleダッシュボードにログイン
2. プロジェクトを選択
3. 「Features」タブをクリック
4. 「Create Feature」をクリック
5. フィーチャー名とキーを入力
6. 変数を追加（例：boolean、string、number、JSON）

### ターゲティングの設定

1. フィーチャーフラグを選択
2. 「Targeting」セクションで対象ユーザーを設定
3. 環境ごとに異なるルールを設定可能

### 変更の公開

1. フィーチャーフラグの変更を保存
2. 「Publish」をクリック
3. Edge Configに自動的に同期されます（最大10秒）

## TypeScript型安全性

```typescript
interface FeatureFlags {
  'my-feature': boolean;
  'welcome-message': string;
  'max-items': number;
  'config': {
    enabled: boolean;
    value: string;
  };
}

const showFeature = await getVariableValue<boolean>(
  user,
  'my-feature',
  false
);
```

## エラーハンドリング

```typescript
try {
  const value = await getVariableValue(user, 'my-feature', false);
  console.log(value);
} catch (error) {
  console.error('Failed to get variable value:', error);
  // フォールバック値を使用
}
```

## ベストプラクティス

### ユーザーコンテキスト

適切なユーザーコンテキストを提供してターゲティングを最適化：

```typescript
const user = {
  user_id: 'user-123',
  email: 'user@example.com',
  country: 'US',
  customData: {
    plan: 'premium',
  },
};
```

### デフォルト値

常にデフォルト値を提供してフォールバックを確保：

```typescript
const value = await getVariableValue(user, 'feature', defaultValue);
```

### キャッシング

Edge Configは自動的にキャッシュされますが、追加のキャッシュ戦略を検討：

```typescript
// アプリケーションレベルのキャッシング
const cache = new Map();

async function getCachedVariable(user, key, defaultValue) {
  const cacheKey = `${user.user_id}-${key}`;

  if (cache.has(cacheKey)) {
    return cache.get(cacheKey);
  }

  const value = await getVariableValue(user, key, defaultValue);
  cache.set(cacheKey, value);

  return value;
}
```

## パフォーマンスの最適化

- Edge Configを使用してネットワークコールを排除
- 適切なデフォルト値を設定
- 不要なフィーチャーフラグ評価を避ける

## トラブルシューティング

### フィーチャーフラグが更新されない

- DevCycleダッシュボードで変更が公開されているか確認
- Edge Configの同期には最大10秒かかります
- 環境変数が正しく設定されているか確認

### エラー: SDK初期化失敗

- `DEVCYCLE_SERVER_SDK_KEY`が設定されているか確認
- `EDGE_CONFIG`が設定されているか確認
- 必要なパッケージがインストールされているか確認

## 次のステップ

- [DevCycle公式ドキュメント](https://docs.devcycle.com/)
- [Edge Config SDK](/docs/edge-config/edge-config-sdk)
- [その他の統合](/docs/edge-config/edge-config-integrations)
