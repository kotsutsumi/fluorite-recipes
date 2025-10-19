# Vercel Edge Configを使用したSplitの統合

## 前提条件

Splitのエッジ設定統合を使用する前に、以下が必要です：

### 1. 最新のVercel CLI

```bash
pnpm i -g vercel@latest
```

### 2. Vercelプロジェクト

プロジェクトをVercelにデプロイまたはリンクします。

### 3. Edge Config

Vercelダッシュボードで Edge Config を作成します。

### 4. Edge Config SDK

```bash
pnpm i @vercel/edge-config
```

## 統合のセットアップ手順

### 1. Split統合の追加

1. Vercelの[統合マーケットプレイス](https://vercel.com/integrations/split)にアクセス
2. 「Add Integration」をクリック
3. Vercelチームとプロジェクトを選択
4. Splitにログインまたはサインアップ
5. Split環境を選択
6. Edge Configを選択または作成
7. セットアップ完了

### 2. フィーチャーフラグの作成

Split管理コンソールで：

1. 「Splits」タブに移動
2. 「Create Split」をクリック
3. Split名を入力（例：`New_Marketing_Page`）
4. トリートメントを定義（例：`on`、`off`）
5. ターゲティングルールを設定

#### ターゲティング例

特定のユーザーに対してフィーチャーを有効化：

- ユーザーID: `Joe`、`Bobby` → トリートメント: `on`
- その他のユーザー → トリートメント: `off`

### 3. 認証情報の取得

以下の環境変数を追加する必要があります：

- `SPLIT_SDK_CLIENT_API_KEY`: SplitのクライアントAPIキー
- `EDGE_CONFIG_SPLIT_ITEM_KEY`: Edge Config項目キー
- `EDGE_CONFIG`: Edge Config接続文字列

#### Split APIキーの取得

1. Splitダッシュボードにログイン
2. 「Admin settings」→「API keys」に移動
3. クライアントサイドAPIキーをコピー

#### Vercel環境変数への追加

```bash
vercel env add SPLIT_SDK_CLIENT_API_KEY
vercel env add EDGE_CONFIG_SPLIT_ITEM_KEY
vercel env add EDGE_CONFIG
```

## Splitパッケージのインストール

```bash
pnpm i @splitsoftware/splitio-browserjs @splitsoftware/vercel-integration-utils @vercel/edge-config
```

## コードでの統合例

### API Routeでの使用

```typescript
import {
  SplitFactory,
  PluggableStorage,
  ErrorLogger,
} from '@splitsoftware/splitio-browserjs';
import { EdgeConfigWrapper } from '@splitsoftware/vercel-integration-utils';
import { createClient } from '@vercel/edge-config';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const SPLIT_SDK_CLIENT_API_KEY = process.env.SPLIT_SDK_CLIENT_API_KEY!;
  const EDGE_CONFIG_SPLIT_ITEM_KEY = process.env.EDGE_CONFIG_SPLIT_ITEM_KEY!;

  // ユーザーキーの取得（例：クエリパラメータから）
  const { searchParams } = new URL(request.url);
  const userKey = searchParams.get('user') || 'anonymous';

  // Edge Configクライアントの作成
  const edgeConfigClient = createClient(process.env.EDGE_CONFIG!);

  // Split SDKの初期化
  const splitFactory = SplitFactory({
    core: {
      authorizationKey: SPLIT_SDK_CLIENT_API_KEY,
      key: userKey,
    },
    storage: PluggableStorage({
      wrapper: EdgeConfigWrapper({
        edgeConfigItemKey: EDGE_CONFIG_SPLIT_ITEM_KEY,
        edgeConfigClient,
      }),
    }),
    debug: ErrorLogger(),
  });

  const client = splitFactory.client();

  try {
    await client.ready();

    // フィーチャーフラグの評価
    const treatment = client.getTreatment('New_Marketing_Page');

    return NextResponse.json({
      treatment,
      user: userKey,
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to evaluate feature flag' },
      { status: 500 }
    );
  } finally {
    client.destroy();
  }
}
```

### ミドルウェアでの使用

```typescript
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import {
  SplitFactory,
  PluggableStorage,
} from '@splitsoftware/splitio-browserjs';
import { EdgeConfigWrapper } from '@splitsoftware/vercel-integration-utils';
import { createClient } from '@vercel/edge-config';

export async function middleware(request: NextRequest) {
  const userKey = request.cookies.get('user_id')?.value || 'anonymous';

  const edgeConfigClient = createClient(process.env.EDGE_CONFIG!);

  const splitFactory = SplitFactory({
    core: {
      authorizationKey: process.env.SPLIT_SDK_CLIENT_API_KEY!,
      key: userKey,
    },
    storage: PluggableStorage({
      wrapper: EdgeConfigWrapper({
        edgeConfigItemKey: process.env.EDGE_CONFIG_SPLIT_ITEM_KEY!,
        edgeConfigClient,
      }),
    }),
  });

  const client = splitFactory.client();
  await client.ready();

  const treatment = client.getTreatment('New_Marketing_Page');

  client.destroy();

  if (treatment === 'on') {
    return NextResponse.next();
  } else {
    return new NextResponse('Feature not available', { status: 403 });
  }
}

export const config = {
  matcher: '/marketing/:path*',
};
```

## ページコンポーネントでの使用

```typescript
import { SplitFactory, PluggableStorage } from '@splitsoftware/splitio-browserjs';
import { EdgeConfigWrapper } from '@splitsoftware/vercel-integration-utils';
import { createClient } from '@vercel/edge-config';

async function getFeatureFlag(userKey: string) {
  const edgeConfigClient = createClient(process.env.EDGE_CONFIG!);

  const splitFactory = SplitFactory({
    core: {
      authorizationKey: process.env.SPLIT_SDK_CLIENT_API_KEY!,
      key: userKey,
    },
    storage: PluggableStorage({
      wrapper: EdgeConfigWrapper({
        edgeConfigItemKey: process.env.EDGE_CONFIG_SPLIT_ITEM_KEY!,
        edgeConfigClient,
      }),
    }),
  });

  const client = splitFactory.client();
  await client.ready();

  const treatment = client.getTreatment('New_Marketing_Page');
  client.destroy();

  return treatment;
}

export default async function Page() {
  const treatment = await getFeatureFlag('user-123');

  return (
    <div>
      {treatment === 'on' ? (
        <div>New Marketing Page</div>
      ) : (
        <div>Old Marketing Page</div>
      )}
    </div>
  );
}
```

## 高度な使用方法

### 属性を使用したターゲティング

```typescript
const client = splitFactory.client();
await client.ready();

const attributes = {
  plan: 'premium',
  country: 'US',
  age: 25,
};

const treatment = client.getTreatment('New_Marketing_Page', attributes);
```

### 複数のフラグの評価

```typescript
const treatments = client.getTreatments([
  'New_Marketing_Page',
  'Beta_Feature',
  'Experimental_UI',
]);

console.log(treatments);
// {
//   'New_Marketing_Page': 'on',
//   'Beta_Feature': 'off',
//   'Experimental_UI': 'on'
// }
```

### トラックイベント

```typescript
const client = splitFactory.client();
await client.ready();

client.track('user', 'page_view', 1, {
  page: '/marketing',
});
```

## Splitダッシュボードでの管理

### セグメントの作成

1. 「Segments」タブに移動
2. 「Create Segment」をクリック
3. セグメント名を入力
4. 条件を定義（例：プレミアムユーザー）

### ロールアウト計画

1. Splitを選択
2. 「Targeting rules」で段階的ロールアウトを設定
3. パーセンテージを指定（例：10%、50%、100%）

## エラーハンドリング

```typescript
try {
  const client = splitFactory.client();
  await client.ready();
  const treatment = client.getTreatment('feature-flag');
  client.destroy();
  return treatment;
} catch (error) {
  console.error('Split SDK error:', error);
  return 'control'; // デフォルトトリートメント
}
```

## ベストプラクティス

### 1. クライアントのライフサイクル管理

```typescript
// 使用後は必ず破棄
client.destroy();
```

### 2. デフォルトトリートメント

常にデフォルトトリートメントを考慮：

```typescript
const treatment = client.getTreatment('feature-flag');

if (treatment === 'on') {
  // 新機能
} else if (treatment === 'off') {
  // 旧機能
} else {
  // control（デフォルト）
}
```

### 3. タイムアウトの設定

```typescript
const client = splitFactory.client();

// タイムアウト付きで待機
await Promise.race([
  client.ready(),
  new Promise((_, reject) =>
    setTimeout(() => reject(new Error('Timeout')), 5000)
  ),
]);
```

## パフォーマンスの最適化

- Edge Configを使用してネットワークコールを排除
- クライアントのライフサイクルを適切に管理
- 不要なフラグ評価を避ける

## トラブルシューティング

### フラグが更新されない

- Splitダッシュボードで変更が保存されているか確認
- Edge Configの同期には最大10秒かかります
- 環境変数が正しく設定されているか確認

### 初期化エラー

- `SPLIT_SDK_CLIENT_API_KEY`が設定されているか確認
- `EDGE_CONFIG`が設定されているか確認
- `EDGE_CONFIG_SPLIT_ITEM_KEY`が設定されているか確認

## 次のステップ

- [Split公式ドキュメント](https://docs.split.io/)
- [Edge Config SDK](/docs/edge-config/edge-config-sdk)
- [その他の統合](/docs/edge-config/edge-config-integrations)
