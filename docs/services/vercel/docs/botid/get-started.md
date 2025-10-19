# BotIDを使い始める

このガイドでは、VercelプロジェクトにBotID保護を追加する方法を説明します。BotIDは、実際のユーザーを通過させながら自動化されたボットをブロックし、API、フォーム、および機密エンドポイントを悪用から保護します。

セットアップには3つの主要なコンポーネントがあります：

- チャレンジを実行するクライアント側コンポーネント
- セッションを分類するサーバー側検証
- リクエストをBotIDを通じてルーティングするためのルート設定

BotIDは[Vercelのフロント](/docs/cdn)で最適に機能します。アプリが[リバースプロキシ](/docs/security/reverse-proxy)を通じてトラフィックを提供している場合、BotIDは劣化モードで動作できます。

## 前提条件

Vercelに[デプロイ](/docs/projects/managing-projects#creating-a-project)されたJavaScriptプロジェクトがあることを確認してください。

## インストール

### パッケージのインストール

プロジェクトにBotIDを追加します：

```bash
pnpm add botid
# または
npm install botid
# または
yarn add botid
```

## 設定

### 1. リダイレクトの設定

フレームワークに応じて、プロキシリライトを設定します：

#### Next.js 15.3+の場合

`next.config.ts`:

```typescript
import { withBotId } from 'botid/next/config';

const nextConfig = {
  // 既存のNext.jsの設定
};

export default withBotId(nextConfig);
```

#### 他のフレームワークの場合

`vercel.json`でリライトを手動設定：

```json
{
  "rewrites": [
    {
      "source": "/__botid/:path*",
      "destination": "https://botid.vercel-infra.com/:path*"
    }
  ]
}
```

### 2. クライアント側の保護の追加

#### Next.js 15.3+（推奨）

`instrumentation-client.ts`:

```typescript
import { initBotId } from 'botid/client';

export async function register() {
  initBotId({
    protect: [
      { path: '/api/checkout', method: 'POST' },
      { path: '/api/contact', method: 'POST' },
    ],
  });
}
```

`next.config.ts`でinstrumentationを有効化：

```typescript
import { withBotId } from 'botid/next/config';

const nextConfig = {
  experimental: {
    instrumentationHook: true,
  },
};

export default withBotId(nextConfig);
```

#### クライアントコンポーネント（代替方法）

```typescript
'use client';

import { useEffect } from 'react';
import { initBotId } from 'botid/client';

export function BotIdProvider() {
  useEffect(() => {
    initBotId({
      protect: [
        { path: '/api/checkout', method: 'POST' },
        { path: '/api/contact', method: 'POST' },
      ],
    });
  }, []);

  return null;
}
```

ルートレイアウトに追加：

```typescript
import { BotIdProvider } from './botid-provider';

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        <BotIdProvider />
        {children}
      </body>
    </html>
  );
}
```

### 3. サーバー側の検証

保護するエンドポイントで`checkBotId()`を呼び出します：

#### Next.js App Router

```typescript
import { checkBotId } from 'botid/server';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const verification = await checkBotId();

  if (verification.isBot) {
    return NextResponse.json(
      { error: 'Bot detected' },
      { status: 403 }
    );
  }

  // 保護されたロジック
  const data = await request.json();
  // ... 処理
  return NextResponse.json({ success: true });
}
```

#### Next.js Pages Router

```typescript
import { checkBotId } from 'botid/server';
import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const verification = await checkBotId();

  if (verification.isBot) {
    return res.status(403).json({ error: 'Bot detected' });
  }

  // 保護されたロジック
  return res.status(200).json({ success: true });
}
```

#### サーバーアクションの保護

```typescript
'use server';

import { checkBotId } from 'botid/server';

export async function submitForm(formData: FormData) {
  const verification = await checkBotId();

  if (verification.isBot) {
    throw new Error('Bot detected');
  }

  // フォームデータを処理
  const email = formData.get('email');
  // ... 処理
}
```

## 完全な例

### Next.js App Router

`next.config.ts`:

```typescript
import { withBotId } from 'botid/next/config';

const nextConfig = {
  experimental: {
    instrumentationHook: true,
  },
};

export default withBotId(nextConfig);
```

`instrumentation-client.ts`:

```typescript
import { initBotId } from 'botid/client';

export async function register() {
  initBotId({
    protect: [
      { path: '/api/checkout', method: 'POST' },
    ],
  });
}
```

`app/api/checkout/route.ts`:

```typescript
import { checkBotId } from 'botid/server';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const verification = await checkBotId();

  if (verification.isBot) {
    return NextResponse.json(
      { error: 'Access denied' },
      { status: 403 }
    );
  }

  const { items } = await request.json();
  // チェックアウト処理
  return NextResponse.json({ orderId: '12345' });
}
```

## 検証レスポンス

`checkBotId()`は以下の情報を返します：

```typescript
interface BotIdResult {
  isBot: boolean;                    // ボットかどうか
  isVerifiedBot: boolean;            // 検証済みボットかどうか
  verifiedBotName?: string;          // 検証済みボット名（例: "googlebot"）
  verifiedBotCategory?: string;      // カテゴリ（例: "search-engine"）
}
```

## 次のステップ

- [検証済みボット](/docs/botid/verified-bots) - 正当なボットの処理方法
- [高度な設定](/docs/botid/advanced-configuration) - ルートごとの検出レベル設定
- [フォーム送信](/docs/botid/form-submissions) - HTMLフォームでの使用方法
- [ローカル開発](/docs/botid/local-development-behavior) - 開発環境での動作

## トラブルシューティング

### BotIDが動作しない

1. `withBotId()`が`next.config.ts`で適用されているか確認
2. `instrumentationHook`が有効化されているか確認
3. クライアント側の`protect`パスとサーバー側のエンドポイントが一致しているか確認

### 正当なユーザーがブロックされている

1. モードを確認（Deep Analysis は誤検知の可能性が高い）
2. 開発環境でテストし、本番環境の動作を確認
3. 必要に応じてバイパスルールを追加

### パフォーマンスへの影響

BotIDは最小限のオーバーヘッドで設計されています：
- Basic モード: 1-2ms
- Deep Analysis モード: 5-10ms

詳細については、[BotID Documentation](/docs/botid)を参照してください。
