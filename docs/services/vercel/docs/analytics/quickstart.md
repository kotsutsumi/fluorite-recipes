# Web Analyticsクイックスタート

## 前提条件

Web Analyticsを開始するには、以下が必要です：
- Vercelアカウント
- Vercelプロジェクト
- Vercel CLIがインストールされている

インストールコマンド:
```bash
pnpm i -g vercel
```

## Web Analyticsを有効化する手順

### 1. VercelでWeb Analyticsを有効化

- プロジェクトのダッシュボードに移動
- Analyticsタブをクリック
- 「Enable」をクリック

### 2. `@vercel/analytics`パッケージを追加

パッケージをインストール:
```bash
pnpm i @vercel/analytics
```

### 3. アプリにAnalyticsコンポーネントを追加

**Next.js App Router の例:**

```typescript
import { Analytics } from '@vercel/analytics/next';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
```

**React の例:**

```typescript
import { Analytics } from '@vercel/analytics/react';

export default function App() {
  return (
    <>
      <YourApp />
      <Analytics />
    </>
  );
}
```

**Vue の例:**

```vue
<template>
  <div>
    <YourApp />
    <Analytics />
  </div>
</template>

<script>
import { Analytics } from '@vercel/analytics/vue';

export default {
  components: {
    Analytics,
  },
};
</script>
```

**Svelte の例:**

```svelte
<script>
  import { Analytics } from '@vercel/analytics/svelte';
</script>

<YourApp />
<Analytics />
```

### 4. アプリをデプロイ

Vercel CLIを使用してデプロイ:
```bash
vercel deploy
```

または、Gitリポジトリを接続して自動デプロイ。

### 5. Analyticsダッシュボードを表示

- Vercelダッシュボードに移動
- プロジェクトを選択
- Analyticsタブをクリック

## 追加の注意事項

トラッキングを確認するには、ブラウザのネットワークタブで `/_vercel/insights/view` を確認してください。

## ProおよびEnterpriseプランの機能

ProおよびEnterpriseプランは、カスタムイベント追跡をサポートしています。

## 次のステップ

- [`@vercel/analytics`パッケージ](/docs/analytics/package)について学ぶ
- [カスタムイベント](/docs/analytics/custom-events)を探索
- [データフィルタリング](/docs/analytics/filtering)を理解
- [プライバシーポリシー](/docs/analytics/privacy-policy)を確認
- [料金とトラブルシューティング](/docs/analytics/limits-and-pricing)を確認

## 関連リソース

- [Web Analytics概要](/docs/analytics)
- [Web Analyticsの使用](/docs/analytics/using-web-analytics)
- [機密データの編集](/docs/analytics/redacting-sensitive-data)
