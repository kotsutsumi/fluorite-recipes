# Hypertune と Edge Config の使用

## 前提条件

Vercel CLIの最新バージョンをインストールする必要があります。

### バージョンの確認

```bash
vercel --version
```

### インストールまたは更新

```bash
pnpm i -g vercel@latest
```

## はじめに

### 1. ローカル環境のセットアップ

プロジェクトをVercelにリンクします：

```bash
vercel link
```

環境変数を取得：

```bash
vercel env pull
```

### 2. 必要な環境変数

`.env.local` ファイルに以下の環境変数が必要です：

```
EXPERIMENTATION_CONFIG="..."
EXPERIMENTATION_CONFIG_ITEM_KEY="..."
NEXT_PUBLIC_HYPERTUNE_TOKEN="..."
```

## Hypertune統合のセットアップ

### 1. Vercel統合マーケットプレイスから追加

1. [Hypertune統合ページ](https://vercel.com/integrations/hypertune)にアクセス
2. 「Add Integration」をクリック
3. Vercelチームとプロジェクトを選択
4. Hypertuneにログインまたはサインアップ
5. Edge Configストアを選択または作成
6. セットアップ完了

### 2. Hypertuneパッケージのインストール

```bash
pnpm i @hypertune/node @hypertune/react
```

## Hypertuneでフラグを管理

### Flags タブからの管理

1. Vercelダッシュボードの「Flags」タブに移動
2. 「Open in Hypertune」をクリック
3. Hypertuneダッシュボードでフラグを編集
4. 変更を保存

### フラグの作成

Hypertuneダッシュボードで：

1. 「Create Flag」をクリック
2. フラグ名とキーを入力
3. フラグタイプを選択（Boolean、String、Number、JSON）
4. デフォルト値を設定
5. ターゲティングルールを追加（オプション）

## タイプセーフなクライアントの生成

### コード生成の実行

```bash
npx hypertune
```

これにより、`generated/hypertune.ts` ファイルが作成され、型安全なクライアントが生成されます。

## コード内でのフラグ宣言

### flags.ts の作成

```typescript
import {
  createSource,
  vercelFlagDefinitions as flagDefinitions,
  flagFallbacks,
  type FlagValues,
  type Context,
} from '@/generated/hypertune';
import { flag } from 'flags/next';
import { createHypertuneAdapter } from '@flags-sdk/hypertune';
import { identify } from './lib/identify';

const hypertuneAdapter = createHypertuneAdapter<FlagValues, Context>({
  createSource,
  flagDefinitions,
  flagFallbacks,
  identify,
});

export const exampleFlag = flag(hypertuneAdapter.declarations.exampleFlag);
```

## アプリでのフラグ使用

### app/page.tsx の例

```typescript
import { exampleFlag } from '@/flags';

export default async function Page() {
  const showNewFeature = await exampleFlag();

  return (
    <div>
      {showNewFeature ? (
        <div>New Feature is enabled!</div>
      ) : (
        <div>Old version</div>
      )}
    </div>
  );
}
```

### ミドルウェアでの使用

```typescript
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { exampleFlag } from '@/flags';

export async function middleware(request: NextRequest) {
  const isEnabled = await exampleFlag();

  if (!isEnabled) {
    return new NextResponse('Feature not available', { status: 403 });
  }

  return NextResponse.next();
}

export const config = {
  matcher: '/beta/:path*',
};
```

## 高度な使用方法

### コンテキストの使用

ユーザー属性に基づいてフラグを評価：

```typescript
import { hypertune } from '@/generated/hypertune';

const context = {
  user: {
    id: 'user-123',
    email: 'user@example.com',
    attributes: {
      plan: 'premium',
      country: 'US',
    },
  },
};

const flagValue = hypertune(context).exampleFlag();
```

### 複数のフラグの取得

```typescript
import { hypertune } from '@/generated/hypertune';

const flags = hypertune(context);

const feature1 = flags.feature1();
const feature2 = flags.feature2();
const config = flags.config();
```

## TypeScript型安全性

Hypertuneは完全な型安全性を提供します：

```typescript
// 生成された型
interface FlagValues {
  exampleFlag: boolean;
  welcomeMessage: string;
  maxItems: number;
  config: {
    enabled: boolean;
    apiEndpoint: string;
  };
}

// 型安全なアクセス
const message: string = flags.welcomeMessage(); // 型チェック
const items: number = flags.maxItems(); // 型チェック
```

## A/Bテストの実装

```typescript
import { hypertune } from '@/generated/hypertune';

export default async function Page() {
  const context = {
    user: {
      id: 'user-123',
    },
  };

  const variant = hypertune(context).abTestVariant();

  return (
    <div>
      {variant === 'A' ? (
        <div>Variant A</div>
      ) : (
        <div>Variant B</div>
      )}
    </div>
  );
}
```

## フラグのオーバーライド

開発中にフラグをオーバーライド：

```typescript
import { hypertune } from '@/generated/hypertune';

const flags = hypertune(context, {
  overrides: {
    exampleFlag: true,
    welcomeMessage: 'Hello, Developer!',
  },
});
```

## パフォーマンスの最適化

### Edge Configの活用

- Hypertuneは自動的にEdge Configを使用してネットワークコールを排除
- エッジでの評価により低レイテンシーを実現
- グローバルに配信されるため、どこでも高速

### キャッシング

```typescript
import { unstable_cache } from 'next/cache';

const getCachedFlag = unstable_cache(
  async () => {
    return await exampleFlag();
  },
  ['example-flag'],
  { revalidate: 60 }
);
```

## デバッグ

### ローカル開発

```typescript
import { hypertune } from '@/generated/hypertune';

const flags = hypertune(context, {
  debug: true, // デバッグログを有効化
});
```

### Hypertuneダッシュボード

1. Hypertuneダッシュボードにアクセス
2. 「Logs」タブでフラグ評価のログを確認
3. ユーザーごとの評価結果を確認

## ベストプラクティス

### 1. 型生成の自動化

package.jsonにスクリプトを追加：

```json
{
  "scripts": {
    "hypertune": "npx hypertune",
    "dev": "npm run hypertune && next dev"
  }
}
```

### 2. フォールバック値の設定

常にフォールバック値を提供：

```typescript
export const flagFallbacks: FlagValues = {
  exampleFlag: false,
  welcomeMessage: 'Welcome!',
  maxItems: 10,
};
```

### 3. コンテキストの一貫性

```typescript
// lib/identify.ts
export function identify(request: NextRequest) {
  return {
    user: {
      id: request.cookies.get('user_id')?.value,
      // その他の属性
    },
  };
}
```

## トラブルシューティング

### 型生成エラー

```bash
# キャッシュをクリアして再生成
rm -rf generated
npx hypertune
```

### フラグが更新されない

- Hypertuneダッシュボードで変更が保存されているか確認
- Edge Configの同期には最大10秒かかります
- `vercel env pull`で最新の環境変数を取得

### 環境変数が見つからない

```bash
# 環境変数を再取得
vercel env pull --force
```

## 次のステップ

- [Hypertune公式ドキュメント](https://docs.hypertune.com/)
- [Edge Config SDK](/docs/edge-config/edge-config-sdk)
- [その他の統合](/docs/edge-config/edge-config-integrations)
