# Vercel Functionsのクイックスタート

## 前提条件

開始するには、以下のいずれかを使用できます:

- 既存のプロジェクト
- Next.jsを使用した新規プロジェクト

Next.jsプロジェクトを作成するターミナルコマンド:

```bash
npx create-next-app@latest --typescript
```

## Vercel Functionを作成

以下は、Vercel APIからデータを取得する関数の例です:

```typescript
// app/api/hello/route.ts
export async function GET(request: Request) {
  const response = await fetch('https://api.vercel.app/products');
  const products = await response.json();
  return Response.json(products);
}
```

> 注意: `fetch`を使用することが、Vercel Functionを作成するための推奨される方法です。

## 次のステップ

以下のトピックを探索して詳細を学びましょう:

- [Functions APIリファレンス](/docs/functions/functions-api-reference)
- [ストリーミング関数](/docs/functions/streaming-functions)
- [ランタイムの選択](/docs/functions/runtimes)
- [関数の設定](/docs/functions/configuring-functions)

このドキュメントは、Vercelプラットフォームでサーバーレス関数を作成するためのシンプルな入門を提供し、さまざまなフレームワーク間での使いやすさと柔軟性に焦点を当てています。
