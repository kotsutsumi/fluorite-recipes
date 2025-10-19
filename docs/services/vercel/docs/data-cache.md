# Next.jsのData Cache

## 概要

Data Cacheはすべての Vercelプランでベータ版として利用可能です。これは、Next.js App Routerでセグメントレベルのデータを保存するために、Next.js 13で導入された専門的で粒度の高いキャッシュです。

## 機能

- グローバルに利用可能なリージョナルキャッシュ
- 時間ベースの再検証
- オンデマンド再検証
- タグベースの再検証

## ISRおよびVercel Cacheとの比較

- 完全に静的なデータの場合、VercelはIncremental Static Regeneration(ISR)を使用
- 静的データと動的データが混在するページの場合、Data Cacheは静的部分をキャッシュ
- ISRとData Cacheの両方がサポート:
  - 時間ベースの再検証
  - オンデマンド再検証
  - タグベースの再検証

## Data Cacheの管理

### 使用状況の観察

Data Cacheの使用状況は以下で表示できます:

- Observabilityタブ
- Runtime Cacheセクション
- リクエストメトリクスのLogsタブ

### Data Cacheの手動パージ

メンバーロールが必要:

1. プロジェクトのSettingsに移動
2. Cachesを選択
3. "Purge Data Cache"をクリック
4. 削除を確認

## コード例

### 時間ベースの再検証

```typescript
export default async function Page() {
  const res = await fetch('https://api.vercel.app/blog', {
    next: {
      revalidate: 3600, // 1時間
    },
  });
  const data = await res.json();

  return (
    <main>
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </main>
  );
}
```

### タグベースの再検証

```typescript
export default async function Page() {
  const res = await fetch('https://api.vercel.app/blog', {
    next: {
      tags: ['blog'], // revalidateTag('blog')で無効化
    },
  });
  const data = await res.json();

  return '...';
}

// 再検証用のServer Action
'use server';
import { revalidateTag } from 'next/cache';

export default async function action() {
  revalidateTag('blog');
}
```
