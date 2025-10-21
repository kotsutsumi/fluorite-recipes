# Routing Middleware

## 概要

Routing MiddlewareはすべてのVercelプランで利用可能で、サイトでリクエストが処理される*前*にコードを実行します。キャッシュの前にグローバルに実行されるため、静的に生成されたコンテンツにパーソナライゼーションを提供する効果的な方法です。

## Routing Middlewareの作成

Routing Middlewareを追加するには、プロジェクトのルートディレクトリに`middleware.ts`ファイルを作成します:

```typescript
export default function middleware(request: Request) {
  const url = new URL(request.url);

  // 古いパスをリダイレクト
  if (url.pathname === '/old-page') {
    return new Response(null, {
      status: 302,
      headers: { Location: '/new-page' },
    });
  }

  // 次のハンドラーに続行
  return new Response('Hello from your Middleware!');
}
```

## 主な機能

### ログ

- `console` APIを完全サポート
- ログはVercelプロジェクトのFunctions Logsに表示されます

### データベースの考慮事項

- 最適なパフォーマンスのために、グローバルデータベースを使用
- 推奨されるストレージオプション:
  - Edge Config
  - Vercel Blob
  - Vercel Marketplaceのストレージソリューション

## リクエストの制限

| 属性 | 制限 |
|-----------|-------|
| 最大URL長 | 14 KB |
| 最大リクエストボディ長 | 4 MB |
| 最大リクエストヘッダー数 | 64 |
| 最大リクエストヘッダー長 | 16 KB |

## ランタイムオプション

- デフォルトランタイム: Edge
- Node.jsおよびEdgeランタイムをサポート
- `config`オブジェクトをエクスポートしてランタイムを変更:

```typescript
export const config = {
  runtime: 'nodejs', // デフォルトは'edge'
};
```

## 料金

- fluid computeモデルを使用して料金設定
- 使用されたコンピューティングリソースによって課金

## 可観測性

- Vercel Observabilityダッシュボードがインサイトを提供
- Observability Plusは高度な機能を提供:
  - リクエストパスごとに呼び出しを分析
  - タイプ別にアクションを分類
  - リライトターゲットと頻度を表示

## その他のリソース

- [Routing Middlewareの開始](/docs/routing-middleware/getting-started)
- [Routing Middleware API](/docs/routing-middleware/api)
