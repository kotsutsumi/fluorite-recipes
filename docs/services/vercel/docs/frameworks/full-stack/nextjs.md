# Next.js on Vercel

## はじめに

Next.jsは、Vercelによって管理されるフルスタックのReactフレームワークです。Vercelにデプロイすることで、以下のメリットがあります：

- ゼロコンフィグレーション
- グローバルでのスケーラビリティ
- パフォーマンスの向上

## 始め方

Next.jsプロジェクトをVercelで始めるには、以下の方法があります：

1. 既存のNext.jsプロジェクトがある場合：
   - Vercel CLIをインストール
   - プロジェクトのルートディレクトリで`vercel`コマンドを実行

2. テンプレートをデプロイ：
   - [Vercelのテンプレートマーケットプレイス](https://vercel.com/templates/next.js)から選択
   - GitHubリポジトリからデプロイ

## 主な機能

### インクリメンタル静的再生成 (ISR)

ISRの利点：
- パフォーマンスの向上
- セキュリティの改善
- 高速なビルド時間

コード例：
```typescript
export default async function Page() {
  const res = await fetch('https://api.vercel.app/blog', {
    next: { revalidate: 10 }, // 10秒ごとに再生成
  });

  const data = await res.json();

  return (
    <main>
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </main>
  );
}
```

### サーバーサイドレンダリング (SSR)

SSRの特徴：
- サーバー上で動的にページをレンダリング
- トラフィックに応じて自動的にスケール
- リアルタイムデータの配信が可能
