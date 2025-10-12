# ネイティブインテント

Expo Routerでディープリンクとネイティブインテントをカスタマイズする方法を学びます。

## ネイティブインテントとは

ネイティブアプリは、Webとは異なるルーティングメカニズムを使用する場合があります。Expo Routerは、拡張されたWeb標準を使用してナビゲーションを処理しますが、カスタムリンク処理が必要な場合があります。

## リンクカスタマイズのシナリオ

### 1. アプリが閉じている場合

外部からのディープリンクURLを書き換える必要があります。

### 2. アプリが開いている場合

ビジネスロジックに基づいてURLをカスタマイズします。

## ネイティブディープリンクの書き換え

### +native-intent.tsxファイルの作成

アプリディレクトリに`+native-intent.tsx`ファイルを作成します。

**プロジェクト構造**：
```
app/
├── _layout.tsx
├── index.tsx
└── +native-intent.tsx
```

### redirectSystemPath()関数の実装

```typescript
// app/+native-intent.tsx
export function redirectSystemPath({ path, initial }) {
  // サードパーティのURLを処理
  if (path === 'buy-this-great-product') {
    return '/products/123';
  }

  // エラーシナリオを処理
  if (path === 'malformed-url') {
    return '/error';
  }

  // 初期URLの場合はルートにリダイレクト
  if (initial) {
    return '/';
  }

  // デフォルトでは元のパスを使用
  return path;
}
```

### パラメータ

**path**: 処理対象のURLパス
- 型: `string`
- 例: `'buy-this-great-product'`

**initial**: 初回起動時のURLかどうか
- 型: `boolean`
- 例: `true` または `false`

### 使用例

**サードパーティURLの変換**：
```typescript
export function redirectSystemPath({ path }) {
  // マーケティングキャンペーンURLを商品ページに変換
  if (path === 'summer-sale') {
    return '/products/category/summer';
  }

  // アフィリエイトリンクを追跡付きURLに変換
  if (path.startsWith('affiliate/')) {
    const affiliateId = path.split('/')[1];
    return `/products?ref=${affiliateId}`;
  }

  return path;
}
```

## Webディープリンクの処理

### 方法1: サーバーリダイレクト

サーバー側でURLリダイレクトを処理します。

**Next.js設定例**：
```javascript
// next.config.js
module.exports = {
  async redirects() {
    return [
      {
        source: '/old-path',
        destination: '/new-path',
        permanent: true,
      },
    ];
  },
};
```

### 方法2: クライアントリダイレクト

ルートレイアウトでクライアント側のリダイレクトを実装します。

```typescript
// app/_layout.tsx
import { useEffect } from 'react';
import { useRouter, usePathname } from 'expo-router';

export default function RootLayout() {
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // 古いパスを新しいパスにリダイレクト
    if (pathname === '/old-path') {
      router.replace('/new-path');
    }
  }, [pathname]);

  return <Slot />;
}
```

## アプリ起動中のURL書き換え

### usePathname()フックの使用

レイアウトファイルで`usePathname()`フックを使用してURLを監視します。

```typescript
// app/_layout.tsx
import { useEffect } from 'react';
import { usePathname, useRouter } from 'expo-router';

export default function Layout() {
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    // グローバルルーティングロジック
    if (pathname.startsWith('/admin') && !isAdmin()) {
      router.replace('/unauthorized');
    }
  }, [pathname]);

  return <Slot />;
}
```

### ローカライズされたルーティングロジック

特定のセクションでのみルーティングロジックを適用します。

```typescript
// app/(auth)/_layout.tsx
import { useEffect } from 'react';
import { usePathname, useRouter } from 'expo-router';

export default function AuthLayout() {
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    // 認証セクション専用のロジック
    if (pathname === '/auth/register' && !canRegister()) {
      router.replace('/auth/login');
    }
  }, [pathname]);

  return <Slot />;
}
```

## ナビゲーションイベントトラッキング

### アナリティクスサービスへのイベント送信

```typescript
// app/_layout.tsx
import { useEffect } from 'react';
import { usePathname } from 'expo-router';
import * as Analytics from 'expo-firebase-analytics';

export default function RootLayout() {
  const pathname = usePathname();

  useEffect(() => {
    // ページビューを追跡
    Analytics.logEvent('screen_view', {
      screen_name: pathname,
      screen_class: pathname,
    });
  }, [pathname]);

  return <Slot />;
}
```

### 複数のアナリティクスプロバイダー

```typescript
// app/_layout.tsx
import { useEffect } from 'react';
import { usePathname } from 'expo-router';
import * as Analytics from 'expo-firebase-analytics';
import { logEvent as logMixpanelEvent } from '@/services/mixpanel';

export default function RootLayout() {
  const pathname = usePathname();

  useEffect(() => {
    // Firebase Analytics
    Analytics.logEvent('screen_view', {
      screen_name: pathname,
    });

    // Mixpanel
    logMixpanelEvent('Page View', {
      page: pathname,
    });
  }, [pathname]);

  return <Slot />;
}
```

## ユニバーサルリンクと複数ドメインのサポート

### ユニバーサルリンクの設定

```typescript
// app.config.ts
export default {
  expo: {
    scheme: 'myapp',
    ios: {
      associatedDomains: [
        'applinks:example.com',
        'applinks:www.example.com',
      ],
    },
    android: {
      intentFilters: [
        {
          action: 'VIEW',
          data: [
            {
              scheme: 'https',
              host: 'example.com',
            },
          ],
          category: ['BROWSABLE', 'DEFAULT'],
        },
      ],
    },
  },
};
```

### 複数ドメインの処理

```typescript
// app/+native-intent.tsx
export function redirectSystemPath({ path, initial }) {
  // ドメインごとに異なる処理
  const url = new URL(path, 'https://example.com');

  if (url.hostname === 'shop.example.com') {
    return `/shop${url.pathname}`;
  }

  if (url.hostname === 'blog.example.com') {
    return `/blog${url.pathname}`;
  }

  return path;
}
```

## Webリンクの強制

完全修飾URLを使用してWebリンクを強制できます。

```typescript
import { Link } from 'expo-router';

export default function Screen() {
  return (
    <>
      {/* アプリ内ナビゲーション */}
      <Link href="/about">About</Link>

      {/* Webブラウザで開く */}
      <Link href="https://example.com/about">About (Web)</Link>
    </>
  );
}
```

## 実験的なlegacy_subscribe

レガシー統合のための実験的な`legacy_subscribe`機能を使用できます。

```typescript
// app/_layout.tsx
import { useEffect } from 'react';
import { router } from 'expo-router';

export default function RootLayout() {
  useEffect(() => {
    const subscription = router.legacy_subscribe((event) => {
      console.log('Navigation event:', event);
    });

    return () => subscription.remove();
  }, []);

  return <Slot />;
}
```

## ベストプラクティス

### 1. URLバリエーションの適切な処理

さまざまなURL形式を処理できるようにしてください。

```typescript
export function redirectSystemPath({ path }) {
  // トレイリングスラッシュを正規化
  const normalizedPath = path.replace(/\/$/, '');

  // クエリパラメータを処理
  const [pathname, query] = normalizedPath.split('?');

  // パスを変換
  return `/products/${pathname}${query ? `?${query}` : ''}`;
}
```

### 2. エラーハンドリングの実装

エラーシナリオを適切に処理してください。

```typescript
export function redirectSystemPath({ path }) {
  try {
    // URLを検証
    if (!isValidPath(path)) {
      return '/error?type=invalid-url';
    }

    // 変換ロジック
    return transformPath(path);
  } catch (error) {
    console.error('URL transformation error:', error);
    return '/error?type=transformation-failed';
  }
}
```

### 3. スムーズなユーザーエクスペリエンス

リダイレクトは最小限に抑え、ユーザーエクスペリエンスを最適化してください。

```typescript
export function redirectSystemPath({ path, initial }) {
  // 初回起動時のみリダイレクト
  if (initial && shouldRedirect(path)) {
    return getRedirectPath(path);
  }

  // 通常のナビゲーションではリダイレクトしない
  return path;
}
```

### 4. テストとデバッグ

リンク処理ロジックを徹底的にテストしてください。

```typescript
// __tests__/native-intent.test.ts
import { redirectSystemPath } from '../app/+native-intent';

describe('redirectSystemPath', () => {
  it('handles marketing URLs', () => {
    const result = redirectSystemPath({
      path: 'summer-sale',
      initial: false,
    });
    expect(result).toBe('/products/category/summer');
  });

  it('handles malformed URLs', () => {
    const result = redirectSystemPath({
      path: 'invalid-url',
      initial: false,
    });
    expect(result).toBe('/error');
  });
});
```

## まとめ

Expo Routerのネイティブインテント機能は、以下の特徴があります：

1. **柔軟なリンク処理**: `+native-intent.tsx`でカスタムロジックを実装
2. **URL書き換え**: `redirectSystemPath()`でURLを変換
3. **イベントトラッキング**: `usePathname()`でナビゲーションを追跡
4. **ユニバーサルリンク**: 複数ドメインのサポート
5. **プラットフォーム対応**: ネイティブとWebの両方をサポート

**主な機能**：
- アプリが閉じている場合のディープリンク処理
- アプリ起動中のURL書き換え
- アナリティクス統合
- エラーハンドリング

これらの機能を活用して、複雑なルーティングシナリオをネイティブとWebの両方で処理できます。
