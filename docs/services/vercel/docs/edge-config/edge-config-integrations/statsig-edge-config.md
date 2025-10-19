# Statsigを使用したEdge Config

このガイドでは、Vercel の Statsig 統合と Edge Config の使用方法について説明します。この統合により、Edge Config を Statsig フィーチャーフラグの設定ソースとして使用できます。

## 前提条件

使用する前に、以下が必要です：

### 1. 最新バージョンの Vercel CLI

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

Vercelダッシュボードで Edge Config を作成します。

### 5. Edge Config SDK

```bash
pnpm i @vercel/edge-config
```

## Statsig統合のセットアップ

### 手順

1. [Statsigの統合マーケットプレイスページ](https://vercel.com/integrations/statsig)にアクセス
2. 「Add Integration」をクリック
3. Vercelチームとプロジェクトを選択
4. Statsigにログインまたはサインアップ
5. Statsigプロジェクトと環境を選択
6. Edge Configを接続
7. 接続文字列とEdge Config項目キーを保存

## Statsig Node SDKのインストール

```bash
pnpm i statsig-node
```

## 環境変数の追加

Vercelダッシュボードで以下の環境変数を追加：

- `EDGE_CONFIG`: Edge Config接続文字列
- `EDGE_CONFIG_ITEM_KEY`: Edge Config項目キー
- `STATSIG_SERVER_SECRET`: StatsigサーバーシークレットキーまたはSDKキー

### Statsig APIキーの取得

1. Statsigダッシュボードにログイン
2. 「Settings」→「API Keys」に移動
3. Server Secret KeyまたはSDK Keyをコピー

### ローカル環境変数の取得

```bash
vercel env pull
```

## コードでの使用例

### ミドルウェアでの使用

```typescript
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import Statsig from 'statsig-node';
import { createClient } from '@vercel/edge-config';
import { EdgeConfigDataAdapter } from 'statsig-node-vercel';

export const config = {
  matcher: '/',
};

const edgeConfigClient = createClient(process.env.EDGE_CONFIG!);
const dataAdapter = new EdgeConfigDataAdapter({
  edgeConfigClient,
  itemKey: process.env.EDGE_CONFIG_ITEM_KEY!,
});

await Statsig.initialize(process.env.STATSIG_SERVER_SECRET!, {
  dataAdapter,
});

export async function middleware(request: NextRequest) {
  const user = {
    userID: 'user-123',
  };

  const featureGate = await Statsig.checkGate(user, 'my_feature_gate');

  if (!featureGate) {
    return new NextResponse('Feature not available', { status: 403 });
  }

  return NextResponse.next();
}
```

### API Routesでの使用

```typescript
import { NextResponse } from 'next/server';
import Statsig from 'statsig-node';
import { createClient } from '@vercel/edge-config';
import { EdgeConfigDataAdapter } from 'statsig-node-vercel';

const edgeConfigClient = createClient(process.env.EDGE_CONFIG!);
const dataAdapter = new EdgeConfigDataAdapter({
  edgeConfigClient,
  itemKey: process.env.EDGE_CONFIG_ITEM_KEY!,
});

await Statsig.initialize(process.env.STATSIG_SERVER_SECRET!, {
  dataAdapter,
});

export async function GET(request: Request) {
  const user = {
    userID: 'user-123',
    email: 'user@example.com',
  };

  // Feature Gateのチェック
  const featureEnabled = await Statsig.checkGate(user, 'my_feature_gate');

  // Dynamic Configの取得
  const config = await Statsig.getConfig(user, 'my_config');
  const configValue = config.get('key', 'default');

  // Experimentの取得
  const experiment = await Statsig.getExperiment(user, 'my_experiment');
  const variant = experiment.get('variant', 'control');

  return NextResponse.json({
    featureEnabled,
    configValue,
    variant,
  });
}
```

### ページコンポーネントでの使用

```typescript
import Statsig from 'statsig-node';
import { createClient } from '@vercel/edge-config';
import { EdgeConfigDataAdapter } from 'statsig-node-vercel';

const edgeConfigClient = createClient(process.env.EDGE_CONFIG!);
const dataAdapter = new EdgeConfigDataAdapter({
  edgeConfigClient,
  itemKey: process.env.EDGE_CONFIG_ITEM_KEY!,
});

await Statsig.initialize(process.env.STATSIG_SERVER_SECRET!, {
  dataAdapter,
});

export default async function Page() {
  const user = {
    userID: 'user-123',
  };

  const showNewFeature = await Statsig.checkGate(user, 'new_feature');

  return (
    <div>
      {showNewFeature ? (
        <div>New Feature Enabled!</div>
      ) : (
        <div>Old Version</div>
      )}
    </div>
  );
}
```

## Statsigダッシュボードでの管理

### Feature Gateの作成

1. Statsigダッシュボードにログイン
2. 「Feature Gates」タブに移動
3. 「Create」をクリック
4. Gate名を入力（例：`my_feature_gate`）
5. ターゲティングルールを設定
6. 保存

### Dynamic Configの作成

1. 「Dynamic Configs」タブに移動
2. 「Create」をクリック
3. Config名を入力
4. パラメータを追加（key-value形式）
5. ターゲティングルールを設定
6. 保存

### Experimentの作成

1. 「Experiments」タブに移動
2. 「Create」をクリック
3. Experiment名を入力
4. バリアントを定義（例：control、treatment）
5. アロケーションを設定（例：50/50）
6. メトリクスを設定
7. 開始

## 高度な使用方法

### ユーザー属性を使用したターゲティング

```typescript
const user = {
  userID: 'user-123',
  email: 'user@example.com',
  custom: {
    plan: 'premium',
    country: 'US',
    signupDate: '2024-01-01',
  },
};

const featureEnabled = await Statsig.checkGate(user, 'premium_feature');
```

### 複数のGateのチェック

```typescript
const gates = ['feature1', 'feature2', 'feature3'];

const results = await Promise.all(
  gates.map((gate) => Statsig.checkGate(user, gate))
);

console.log(results); // [true, false, true]
```

### イベントのログ

```typescript
await Statsig.logEvent(user, 'page_view', 1, {
  page: '/home',
  timestamp: Date.now(),
});
```

## TypeScript型安全性

```typescript
interface User {
  userID: string;
  email?: string;
  custom?: {
    plan?: string;
    country?: string;
    [key: string]: any;
  };
}

const user: User = {
  userID: 'user-123',
  email: 'user@example.com',
  custom: {
    plan: 'premium',
  },
};
```

## シングルトンパターンでの初期化

```typescript
// lib/statsig.ts
import Statsig from 'statsig-node';
import { createClient } from '@vercel/edge-config';
import { EdgeConfigDataAdapter } from 'statsig-node-vercel';

let initialized = false;

export async function initializeStatsig() {
  if (initialized) return;

  const edgeConfigClient = createClient(process.env.EDGE_CONFIG!);
  const dataAdapter = new EdgeConfigDataAdapter({
    edgeConfigClient,
    itemKey: process.env.EDGE_CONFIG_ITEM_KEY!,
  });

  await Statsig.initialize(process.env.STATSIG_SERVER_SECRET!, {
    dataAdapter,
  });

  initialized = true;
}

export { Statsig };
```

### 使用例

```typescript
import { initializeStatsig, Statsig } from '@/lib/statsig';

await initializeStatsig();

const featureEnabled = await Statsig.checkGate(user, 'my_feature');
```

## A/Bテストの実装

```typescript
const user = {
  userID: 'user-123',
};

// Experimentの取得
const experiment = await Statsig.getExperiment(user, 'button_color_test');

// バリアントの取得
const buttonColor = experiment.get('color', 'blue');

// レンダリング
return <button style={{ backgroundColor: buttonColor }}>Click me</button>;
```

## エラーハンドリング

```typescript
try {
  await Statsig.initialize(process.env.STATSIG_SERVER_SECRET!, {
    dataAdapter,
  });

  const featureEnabled = await Statsig.checkGate(user, 'my_feature');
} catch (error) {
  console.error('Statsig error:', error);
  // フォールバック値を使用
  const featureEnabled = false;
}
```

## ベストプラクティス

### 1. 初期化の管理

アプリケーション起動時に一度だけ初期化：

```typescript
// app/layout.tsx
import { initializeStatsig } from '@/lib/statsig';

await initializeStatsig();
```

### 2. ユーザーコンテキストの一貫性

```typescript
function getUserContext(request: NextRequest) {
  return {
    userID: request.cookies.get('user_id')?.value || 'anonymous',
    email: request.cookies.get('email')?.value,
  };
}
```

### 3. デフォルト値の提供

```typescript
const config = await Statsig.getConfig(user, 'my_config');
const value = config.get('key', 'default_value');
```

## パフォーマンスの最適化

- Edge Configを使用してネットワークコールを排除
- エッジでの評価により低レイテンシーを実現
- 適切なキャッシュ戦略を実装

## トラブルシューティング

### Feature Gateが更新されない

- Statsigダッシュボードで変更が保存されているか確認
- Edge Configの同期には最大10秒かかります
- 環境変数が正しく設定されているか確認

### 初期化エラー

- `STATSIG_SERVER_SECRET`が設定されているか確認
- `EDGE_CONFIG`が設定されているか確認
- `EDGE_CONFIG_ITEM_KEY`が設定されているか確認

### ユーザーIDエラー

- ユーザーオブジェクトに`userID`が含まれているか確認
- `userID`は文字列である必要があります

## 次のステップ

- [Statsig公式ドキュメント](https://docs.statsig.com/)
- [Edge Config SDK](/docs/edge-config/edge-config-sdk)
- [その他の統合](/docs/edge-config/edge-config-integrations)
