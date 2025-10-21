# LaunchDarklyとEdge Configの使用

このガイドは、Vercelの LaunchDarkly 統合とEdge Configの使用方法について説明します。この統合により、Edge Configを LaunchDarkly フィーチャーフラグの設定ソースとして使用できます。

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

### 3. Vercel プロジェクト

プロジェクトをVercelにデプロイまたはリンクします。

### 4. Edge Config

Vercelダッシュボードで Edge Config を作成します。

### 5. Edge Config SDK

```bash
pnpm i @vercel/edge-config
```

## LaunchDarkly統合のセットアップ

### 手順

1. [統合マーケットプレイス](https://vercel.com/integrations/launchdarkly)で統合を追加
2. Vercelチームとプロジェクトを選択
3. LaunchDarklyにログイン
4. LaunchDarklyプロジェクトと環境を選択
5. Edge Configを選択または作成
6. 認証を完了

## クライアントサイドIDの取得

### LaunchDarklyダッシュボードでの設定

1. [LaunchDarklyダッシュボード](https://app.launchdarkly.com/settings/projects)にアクセス
2. プロジェクトを選択
3. 「Environments」タブをクリック
4. 環境のクライアントサイドIDをコピー

### Vercel環境変数への追加

1. Vercelダッシュボードのプロジェクト設定に移動
2. 「Environment Variables」タブを選択
3. 新しい変数を追加：
   - Name: `LD_CLIENT_SIDE_ID`
   - Value: コピーしたクライアントサイドID

## LaunchDarkly Vercel Server SDKのインストール

```bash
pnpm i @launchdarkly/vercel-server-sdk
```

## 環境変数の取得

ローカル開発用：

```bash
vercel env pull
```

これにより、以下の環境変数が `.env.local` に追加されます：

- `EDGE_CONFIG`
- `LD_CLIENT_SIDE_ID`

## コードでの統合

### LaunchDarklyクライアントの初期化

```typescript
import { init } from '@launchdarkly/vercel-server-sdk';

const client = init(process.env.LD_CLIENT_SIDE_ID!, {
  sendEvents: false,
});

await client.waitForInitialization();
```

### ミドルウェアでの使用

```typescript
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { init } from '@launchdarkly/vercel-server-sdk';

export async function middleware(request: NextRequest) {
  const client = init(process.env.LD_CLIENT_SIDE_ID!, {
    sendEvents: false,
  });

  await client.waitForInitialization();

  const context = {
    kind: 'user',
    key: 'user-123',
  };

  const showFeature = await client.variation('my-feature-flag', context, false);

  if (!showFeature) {
    return new NextResponse('Feature not available', { status: 403 });
  }

  return NextResponse.next();
}

export const config = {
  matcher: '/beta/:path*',
};
```

### API Routesでの使用

```typescript
import { NextResponse } from 'next/server';
import { init } from '@launchdarkly/vercel-server-sdk';

export async function GET(request: Request) {
  const client = init(process.env.LD_CLIENT_SIDE_ID!, {
    sendEvents: false,
  });

  await client.waitForInitialization();

  const context = {
    kind: 'user',
    key: 'user-123',
    email: 'user@example.com',
  };

  const allFlags = await client.allFlagsState(context);

  return NextResponse.json(allFlags.toJSON());
}
```

### ページでの使用

```typescript
import { init } from '@launchdarkly/vercel-server-sdk';

export default async function Page() {
  const client = init(process.env.LD_CLIENT_SIDE_ID!, {
    sendEvents: false,
  });

  await client.waitForInitialization();

  const context = {
    kind: 'user',
    key: 'user-123',
  };

  const welcomeMessage = await client.variation(
    'welcome-message',
    context,
    'Welcome!'
  );

  return <h1>{welcomeMessage}</h1>;
}
```

## LaunchDarklyダッシュボードでの管理

### フィーチャーフラグの作成

1. LaunchDarklyダッシュボードにログイン
2. プロジェクトを選択
3. 「Flags」タブをクリック
4. 「Create flag」をクリック
5. フラグ名とキーを入力
6. フラグタイプを選択（Boolean、String、Number、JSON）
7. デフォルト値を設定

### ターゲティングの設定

1. フラグを選択
2. 「Targeting」タブをクリック
3. ターゲティングルールを追加：
   - 特定のユーザー
   - ユーザー属性に基づくルール
   - パーセンテージロールアウト

### 変更の公開

1. ターゲティングルールを保存
2. フラグの状態を「On」に変更
3. Edge Configに自動的に同期されます（最大10秒）

## ユーザーコンテキストの設定

### 基本的なコンテキスト

```typescript
const context = {
  kind: 'user',
  key: 'user-123',
};
```

### 拡張コンテキスト

```typescript
const context = {
  kind: 'user',
  key: 'user-123',
  email: 'user@example.com',
  name: 'John Doe',
  custom: {
    plan: 'premium',
    country: 'US',
    signupDate: '2024-01-01',
  },
};
```

### 複数のコンテキスト

```typescript
const context = {
  kind: 'multi',
  user: {
    key: 'user-123',
    email: 'user@example.com',
  },
  organization: {
    key: 'org-456',
    name: 'Acme Corp',
  },
};
```

## TypeScript型安全性

```typescript
interface FeatureFlags {
  'my-feature-flag': boolean;
  'welcome-message': string;
  'max-items': number;
  'config': {
    enabled: boolean;
    apiEndpoint: string;
  };
}

const showFeature = await client.variation<boolean>(
  'my-feature-flag',
  context,
  false
);
```

## クライアントの最適化

### シングルトンパターン

```typescript
// lib/launchdarkly.ts
import { init, LDClient } from '@launchdarkly/vercel-server-sdk';

let client: LDClient | null = null;

export function getLDClient(): LDClient {
  if (!client) {
    client = init(process.env.LD_CLIENT_SIDE_ID!, {
      sendEvents: false,
    });
  }
  return client;
}
```

### 使用例

```typescript
import { getLDClient } from '@/lib/launchdarkly';

const client = getLDClient();
await client.waitForInitialization();

const value = await client.variation('my-flag', context, false);
```

## エラーハンドリング

```typescript
try {
  const client = init(process.env.LD_CLIENT_SIDE_ID!, {
    sendEvents: false,
  });

  await client.waitForInitialization({ timeout: 5 });

  const value = await client.variation('my-flag', context, false);
} catch (error) {
  console.error('LaunchDarkly initialization failed:', error);
  // フォールバック値を使用
  const value = false;
}
```

## ベストプラクティス

### 1. sendEventsを無効化

Edge Configを使用する場合、イベント送信は不要：

```typescript
const client = init(sdkKey, {
  sendEvents: false,
});
```

### 2. タイムアウトの設定

```typescript
await client.waitForInitialization({ timeout: 5 });
```

### 3. フォールバック値の提供

常にデフォルト値を提供：

```typescript
const value = await client.variation('flag-key', context, defaultValue);
```

### 4. クライアントの再利用

シングルトンパターンを使用してクライアントを再利用します。

## パフォーマンスの最適化

- Edge Configを使用してネットワークコールを排除
- クライアントを再利用してオーバーヘッドを削減
- 適切なタイムアウトを設定

## トラブルシューティング

### フラグが更新されない

- LaunchDarklyダッシュボードで変更が保存されているか確認
- フラグが「On」になっているか確認
- Edge Configの同期には最大10秒かかります

### 初期化エラー

- `LD_CLIENT_SIDE_ID`が設定されているか確認
- `EDGE_CONFIG`が設定されているか確認
- インターネット接続を確認

### フラグが見つからない

- フラグキーが正しいか確認
- LaunchDarklyダッシュボードでフラグが作成されているか確認
- 環境が正しいか確認

## 次のステップ

- [LaunchDarkly公式ドキュメント](https://docs.launchdarkly.com/)
- [Edge Config SDK](/docs/edge-config/edge-config-sdk)
- [その他の統合](/docs/edge-config/edge-config-integrations)
