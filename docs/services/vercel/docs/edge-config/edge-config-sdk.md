# @vercel/edge-config

## 概要

Edge Config クライアントSDKは、Edge Configからデータを読み取るための最も使いやすい方法です。Node.js、Edge Runtime、およびブラウザと互換性があります。

## 要件

Edge Config SDKを使用する前に、以下を完了する必要があります：

- Edge Configの作成（APIまたはダッシュボードから）
- Edge Config読み取りアクセストークンの追加
- 接続文字列の定義と環境変数への保存

## SDKのセットアップ

インストール：

```bash
pnpm i @vercel/edge-config
```

## 接続文字列の使用

デフォルトでは、`EDGE_CONFIG`環境変数に保存された接続文字列を使用します。

例：

```typescript
import { NextResponse } from 'next/server';
import { getAll } from '@vercel/edge-config';

const configItems = await getAll();
```

## 主な機能

### 単一の値の読み取り

```typescript
import { get } from '@vercel/edge-config';

const val = await get('key');
console.log(val);
```

### 複数の値の読み取り

```typescript
import { getAll } from '@vercel/edge-config';

// すべての値を取得
const configItems = await getAll();

// 特定のキーのみ取得
const someItems = await getAll(['keyA', 'keyB']);
```

### キーの存在確認

```typescript
import { has } from '@vercel/edge-config';

const exists = await has('key');
console.log(exists); // true または false
```

### Edge Config バージョンの確認

```typescript
import { digest } from '@vercel/edge-config';

const version = await digest();
console.log(version);
```

## 高度な使用方法

### カスタム接続文字列

環境変数以外の接続文字列を使用する場合：

```typescript
import { createClient } from '@vercel/edge-config';

const edgeConfig = createClient(process.env.CUSTOM_EDGE_CONFIG);
const value = await edgeConfig.get('key');
```

### 複数のEdge Configを使用

```typescript
import { createClient } from '@vercel/edge-config';

const config1 = createClient(process.env.EDGE_CONFIG_1);
const config2 = createClient(process.env.EDGE_CONFIG_2);

const value1 = await config1.get('key1');
const value2 = await config2.get('key2');
```

## Next.js Middlewareでの使用

```typescript
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { get } from '@vercel/edge-config';

export async function middleware(request: NextRequest) {
  // フィーチャーフラグを確認
  const featureEnabled = await get('featureFlag');

  if (!featureEnabled) {
    return new NextResponse('Feature not available', { status: 403 });
  }

  return NextResponse.next();
}

export const config = {
  matcher: '/beta/:path*',
};
```

## API Routesでの使用

```typescript
import { get } from '@vercel/edge-config';
import { NextResponse } from 'next/server';

export async function GET() {
  const config = await get('apiConfig');

  return NextResponse.json(config);
}
```

## エラーハンドリング

```typescript
import { get } from '@vercel/edge-config';

try {
  const value = await get('key');
  console.log(value);
} catch (error) {
  console.error('Failed to read from Edge Config:', error);
}
```

## TypeScript サポート

```typescript
interface MyConfig {
  featureFlag: boolean;
  maxUsers: number;
  apiEndpoint: string;
}

import { get } from '@vercel/edge-config';

const config = await get<MyConfig>('myConfig');

if (config) {
  console.log(config.featureFlag); // 型安全
  console.log(config.maxUsers);
  console.log(config.apiEndpoint);
}
```

## パフォーマンスの最適化

### キャッシング

Edge Configは自動的にキャッシュされますが、追加のキャッシュ戦略を実装することもできます：

```typescript
let cachedConfig: any = null;
let lastFetch = 0;
const CACHE_TTL = 60000; // 1分

async function getConfig() {
  const now = Date.now();

  if (cachedConfig && now - lastFetch < CACHE_TTL) {
    return cachedConfig;
  }

  cachedConfig = await get('config');
  lastFetch = now;

  return cachedConfig;
}
```

## 注意点

- Edge Config SDKは読み取りのみ可能
- 書き込みにはVercel REST APIを使用
- 頻繁な書き込みには向いていない（読み取りに最適化）
- グローバルに配信されるため、更新には最大10秒かかる場合がある

## ベストプラクティス

- `EDGE_CONFIG`環境変数を使用してデフォルトの接続を設定
- TypeScriptの型定義を活用
- エラーハンドリングを実装
- 適切なキャッシュ戦略を使用
- 頻繁にアクセスされ、めったに更新されないデータに使用

## 次のステップ

- [Vercel API](/docs/edge-config/vercel-api)でデータを書き込む方法
- [制限](/docs/edge-config/edge-config-limits)を確認
- [統合](/docs/edge-config/edge-config-integrations)を探索
