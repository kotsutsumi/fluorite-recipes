# @vercel/speed-insightsによるSpeed Insights設定

## 概要

Speed Insightsはすべての Vercelプランで利用可能で、Webパフォーマンスメトリクスをキャプチャしてvercelに送信できます。

## 開始方法

初期セットアップについては、[クイックスタートガイド](/docs/speed-insights/quickstart)を参照してください。

## 設定オプション

### `sampleRate`

サーバーに送信されるイベントのパーセンテージを決定します。

- **デフォルト**: すべてのイベントが送信される
- **用途**: コストを削減できるが、データの精度が低下する可能性がある
- **例**: `0.5`は50%のイベントのみが送信されることを意味

```typescript
<SpeedInsights sampleRate={0.5} />
```

### `beforeSend`

イベントデータを送信前に変更またはフィルタリングする関数：

```typescript
<SpeedInsights
  beforeSend={(data) => {
    if (data.url.includes('/sensitive-path')) {
      return null; // イベントを無視
    }
    return data; // イベントをそのまま送信
  }}
/>
```

#### beforeSendの使用例

**機密URLの除外**:
```typescript
beforeSend: (data) => {
  if (data.url.includes('/admin')) {
    return null;
  }
  return data;
}
```

**カスタム属性の追加**:
```typescript
beforeSend: (data) => {
  return {
    ...data,
    customProperty: 'value',
  };
}
```

### `debug`

ブラウザコンソールでSpeed Insightsイベントの表示を有効にします。

- 開発環境またはテスト環境で自動的に有効
- 手動で無効化可能

```typescript
<SpeedInsights debug={false} />
```

### `route`

現在の動的ルートを指定（例: `/blog/[slug]`）

- Next.js、Nuxt、SvelteKit、Remixなどのフレームワークで自動設定
- 必要に応じて手動で設定可能

```typescript
<SpeedInsights route="/blog/[slug]" />
```

### `endpoint`

メトリクスを別のURLに報告できます。

- 複数のプロジェクト間でメトリクスを分離するのに便利
- **デフォルト**: `https://yourdomain.com/_vercel/speed-insights/vitals`

```typescript
<SpeedInsights endpoint="https://custom-domain.com/_vercel/speed-insights/vitals" />
```

### `scriptSrc`

カスタムURLからSpeed Insightsスクリプトを読み込むオプション。

```typescript
<SpeedInsights scriptSrc="https://custom-cdn.com/_vercel/speed-insights/script.js" />
```

## フレームワーク固有の例

### Next.js (App Router)

```typescript
import { SpeedInsights } from '@vercel/speed-insights/next';

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        {children}
        <SpeedInsights
          sampleRate={0.8}
          beforeSend={(data) => {
            // カスタムロジック
            return data;
          }}
        />
      </body>
    </html>
  );
}
```

### React

```typescript
import { SpeedInsights } from '@vercel/speed-insights/react';

function App() {
  return (
    <>
      <YourApp />
      <SpeedInsights
        debug={process.env.NODE_ENV === 'development'}
        sampleRate={1.0}
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
    <SpeedInsights :sampleRate="0.75" />
  </div>
</template>

<script>
import { SpeedInsights } from '@vercel/speed-insights/vue';

export default {
  components: {
    SpeedInsights,
  },
};
</script>
```

### Svelte

```svelte
<script>
  import { SpeedInsights } from '@vercel/speed-insights/svelte';
</script>

<YourApp />
<SpeedInsights sampleRate={0.9} />
```

## ベストプラクティス

### サンプルレートの設定

- **本番環境**: より高いサンプルレート（0.8-1.0）
- **開発環境**: より低いサンプルレート（0.1-0.3）
- トラフィック量とコストのバランスを取る

### beforeSendの使用

- 機密データのフィルタリング
- カスタムメタデータの追加
- 特定のパスの除外

### デバッグ

- 開発中はdebugモードを有効化
- 本番環境では無効化
- コンソールでイベントを検証

## パフォーマンスへの影響

### 最小限のオーバーヘッド

- 非同期スクリプトの読み込み
- 遅延実行
- ユーザー体験への影響なし

### リソース使用量

- 小さなスクリプトサイズ
- 効率的なデータ収集
- バッチ送信

## トラブルシューティング

### イベントが送信されない

1. `beforeSend`がnullを返していないことを確認
2. サンプルレートが0でないことを確認
3. ネットワークタブでリクエストを確認

### デバッグモードが機能しない

1. 環境を確認
2. debugプロパティを明示的に設定
3. ブラウザコンソールを確認

## 次のステップ

- [サンプルイベントの送信ガイド](/guides/sending-sample-to-speed-insights)
- [機密データの編集](/docs/speed-insights/redacting-sensitive-data)
- [トラブルシューティング](/docs/speed-insights/troubleshooting)

## 関連リソース

- [Speed Insights概要](/docs/speed-insights)
- [クイックスタート](/docs/speed-insights/quickstart)
- [料金と制限](/docs/speed-insights/limits-and-pricing)
