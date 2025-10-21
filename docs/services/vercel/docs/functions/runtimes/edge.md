# Edge Runtime

## 概要

Vercelは、パフォーマンスと信頼性の向上のため、edgeからNode.jsへの移行を推奨しています。両方のランタイムは、Active CPU価格設定のFluid compute上で動作します。

## Edge Runtimeへの変換

Vercel FunctionをEdge runtimeを使用するように変換するには、以下のコードを追加します:

```typescript
export const runtime = 'edge'; // 'nodejs'がデフォルト

export function GET(request: Request) {
  return new Response(`I am an Vercel Function!`, {
    status: 200,
  });
}
```

注意: フレームワークを使用しないプロジェクトの場合、以下のいずれかを行う必要があります:

- `package.json`に`"type": "module"`を追加
- JavaScript関数のファイル拡張子を`.js`から`.mjs`に変更

## リージョン設定

デフォルトでは、Edge Runtime関数は受信リクエストに最も近いリージョンで実行されます。

### リージョンの設定

`preferredRegion`を使用して優先リージョンを指定できます:

```typescript
export const runtime = 'edge';
// 接続クライアントの場所に基づいて、iad1またはhnd1でこの関数を実行
export const preferredRegion = ['iad1', 'hnd1'];
export const dynamic = 'force-dynamic'; // キャッシュなし

export function GET(request: Request) {
  return new Response(
    `I am an Vercel Function! (executed on ${process.env.VERCEL_REGION})`,
    {
      status: 200,
    },
  );
}
```

## 主な特徴

- **フェイルオーバーモード**: リージョンのダウンタイム中に、次に近いCDNリージョンへの自動的な再ルーティング
- **最大継続時間**:
  - 25秒以内にレスポンスの送信を開始する必要があります
  - 最大300秒間データのストリーミングを継続できます
- **同時実行性**: トラフィックの急増に対応する自動スケーリング

## サポートされているAPI

Edge runtimeは、以下を含むWeb APIのサブセットを提供します:

### ネットワークAPI

- `fetch`
- `Request`
- `Response`
- `Headers`
- `FormData`
- `File`
- `Blob`

### エンコーディングAPI

- `TextEncoder`
- `TextDecoder`
- `atob`
- `btoa`

### ストリーム

ストリーミング機能をサポート
