# Functions APIリファレンス

## 関数のシグネチャ

Vercel Functionsは、Next.jsのRoute Handlerと同様に定義されます。Next.js App Routerを使用する場合、`app/api/my-route/route.ts`の下のファイルで関数を定義できます。

### パラメータ

| パラメータ | 説明 | Next.js | その他のフレームワーク |
|-----------|-------------|---------|-----------------|
| `request` | Requestオブジェクトのインスタンス | `NextRequest` | `Request` |
| `context` | 非推奨、代わりに`@vercel/functions`を使用 | N/A | `{ waitUntil }` |

### 例

```typescript
export function GET(request: Request) {
  return new Response('Hello from Vercel!');
}
```

## リクエストのキャンセル

Node.jsランタイムでのみ利用可能:

1. `vercel.json`に`"supportsCancellation": true`を追加
2. `AbortController`を使用してリクエストのキャンセルを管理

```typescript
export async function GET(request: Request) {
  const abortController = new AbortController();

  request.signal.addEventListener('abort', () => {
    console.log('request aborted');
    abortController.abort();
  });

  const response = await fetch('https://my-backend-service.example.com', {
    signal: abortController.signal,
  });

  return new Response(response.body, {
    status: response.status,
    headers: response.headers,
  });
}
```

## ルートセグメント設定

Next.js App Routerの場合、configオブジェクトの代わりにセグメントオプションを使用:

```typescript
export const runtime = 'nodejs';
export const maxDuration = 15;
```

### 設定オプション

| プロパティ | 型 | 説明 |
|----------|------|-------------|
| `runtime` | `string` | 使用するランタイム(デフォルト: `nodejs`) |
| `preferredRegion` | `string` | 実行リージョンを指定 |
| `maxDuration` | `int` | 最大関数実行時間 |

## SIGTERMシグナル

Node.jsおよびPythonランタイムでサポート:

```typescript
process.on('SIGTERM', () => {
  // クリーンアップ処理
});
```
