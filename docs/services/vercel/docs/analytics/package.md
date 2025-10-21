# @vercel/analyticsによる高度なWeb Analytics設定

## 開始方法

Web Analyticsを開始するには、[クイックスタートガイド](/docs/analytics/quickstart)に従ってプロジェクトにアナリティクスを設定してください。

## 設定オプション

### `mode`

自動環境検出をオーバーライド：

- `development`または`production`モードを自動的に検出
- フレームワークが環境変数を公開しない場合、手動で設定可能

**例（Next.js）:**

```typescript
import { Analytics } from '@vercel/analytics/next';

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        {children}
        <Analytics mode="production" />
      </body>
    </html>
  );
}
```

### `debug`

デバッグメッセージの表示を制御：

- 開発環境またはテスト環境で自動的に有効
- 手動で無効化可能
- サーバーサイドログは`VERCEL_WEB_ANALYTICS_DISABLE_LOGS`を`true`に設定することで無効化可能

**例:**

```typescript
<Analytics debug />
```

### `beforeSend`

イベントデータを送信前に変更：

- イベントのフィルタリングまたは変換を許可
- `null`を返してイベントを無視
- 機密データの編集に便利

**例:**

```typescript
<Analytics
  beforeSend={(event) => {
    if (event.url.includes('/private')) {
      return null;
    }
    return event;
  }}
/>
```

### `endpoint`

アナリティクスレポートURLをカスタマイズ：

- **デフォルト**: `https://yourdomain.com/_vercel/insights`
- 複数のプロジェクト間でアナリティクスを分離するのに便利

**例:**

```typescript
<Analytics endpoint="https://bob-app.vercel.sh/_vercel/insights" />
```

### `scriptSrc`

カスタムURLからWeb Analyticsスクリプトを読み込む：

```typescript
<Analytics scriptSrc="https://bob-app.vercel.sh/_vercel/insights/script.js" />
```

## フレームワーク固有の例

### Next.js (App Router)

```typescript
import { Analytics } from '@vercel/analytics/next';

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        {children}
        <Analytics
          mode={process.env.NODE_ENV === 'production' ? 'production' : 'development'}
          beforeSend={(event) => {
            // カスタムロジック
            return event;
          }}
        />
      </body>
    </html>
  );
}
```

### React

```typescript
import { Analytics } from '@vercel/analytics/react';

function App() {
  return (
    <>
      <YourApp />
      <Analytics
        debug={process.env.NODE_ENV === 'development'}
      />
    </>
  );
}
```

### Vue

```vue
<template>
  <div>
    <YourApp />
    <Analytics :debug="isDev" />
  </div>
</template>

<script>
import { Analytics } from '@vercel/analytics/vue';

export default {
  components: {
    Analytics,
  },
  computed: {
    isDev() {
      return process.env.NODE_ENV === 'development';
    },
  },
};
</script>
```

### Svelte

```svelte
<script>
  import { Analytics } from '@vercel/analytics/svelte';
  const debug = import.meta.env.DEV;
</script>

<YourApp />
<Analytics {debug} />
```

## ベストプラクティス

### 環境別の設定

```typescript
const analyticsConfig = {
  mode: process.env.NODE_ENV === 'production' ? 'production' : 'development',
  debug: process.env.NODE_ENV === 'development',
};

<Analytics {...analyticsConfig} />
```

### beforeSendの使用

```typescript
function sanitizeEvent(event) {
  const url = new URL(event.url);

  // 機密パラメータを削除
  ['token', 'apiKey', 'session'].forEach(param => {
    url.searchParams.delete(param);
  });

  return {
    ...event,
    url: url.toString(),
  };
}

<Analytics beforeSend={sanitizeEvent} />
```

### デバッグ設定

```typescript
// 開発中のみデバッグを有効化
<Analytics
  debug={
    process.env.NODE_ENV === 'development' ||
    process.env.ENABLE_ANALYTICS_DEBUG === 'true'
  }
/>
```

## トラブルシューティング

### Analyticsが動作しない

1. コンポーネントが正しくインポートされていることを確認
2. 正しいフレームワークパッケージを使用していることを確認
3. デバッグモードを有効化して問題を調査

### イベントが送信されない

1. `beforeSend`が`null`を返していないことを確認
2. エンドポイント設定を確認
3. ネットワークタブでリクエストを確認

## パフォーマンスへの影響

### 最小限のオーバーヘッド

- 非同期スクリプトの読み込み
- 小さなスクリプトサイズ
- ユーザー体験への影響なし

## 次のステップ

- [機密データの編集](/docs/analytics/redacting-sensitive-data)
- [カスタムイベント](/docs/analytics/custom-events)の作成（Pro/Enterprise）
- [トラブルシューティング](/docs/analytics/troubleshooting)ガイドを確認

## 関連リソース

- [Web Analytics概要](/docs/analytics)
- [クイックスタート](/docs/analytics/quickstart)
- [料金と制限](/docs/analytics/limits-and-pricing)
