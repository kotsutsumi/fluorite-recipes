# Supabase Edge Functionsのエラーハンドリング

## エラーハンドリングの概要

信頼性の高いアプリケーションを作成するために、適切なエラーレスポンスとクライアント側のハンドリングを実装することが重要です。主要な原則は以下の通りです。

### 関数側のエラーハンドリング

Edge Functionsでエラーを処理するためのベストプラクティス:

- 適切なHTTPステータスコードを使用する:
  - `400`: ユーザー入力が不正な場合
  - `404`: 何かが存在しない場合
  - `500`: サーバーエラーの場合
- レスポンスボディに役立つエラーメッセージを含める
- デバッグのためにエラーをコンソールにログ出力する

エラーハンドリングのコード例:

```typescript
Deno.serve(async (req) => {
  try {
    // 関数のロジックをここに記述
    const result = await processRequest(req)
    return new Response(JSON.stringify(result), {
      headers: { 'Content-Type': 'application/json' },
      status: 200,
    })
  } catch (error) {
    console.error('Function error:', error)
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { 'Content-Type': 'application/json' },
      status: 500,
    })
  }
})
```

### クライアント側のエラーハンドリング

発生する可能性のある3種類のエラー:

1. `FunctionsHttpError`: 関数は実行されたが、エラーを返した（4xx/5xxステータス）
2. `FunctionsRelayError`: クライアントとSupabase間のネットワーク問題
3. `FunctionsFetchError`: 関数にまったく到達できなかった

クライアント側のエラーハンドリングの例:

```typescript
const { data, error } = await supabase.functions.invoke('hello', {
  headers: { 'my-custom-header': 'my-custom-header-value' },
  body: { foo: 'bar' },
})

if (error instanceof FunctionsHttpError) {
  const errorMessage = await error.context.json()
  console.log('Function returned an error', errorMessage)
} else if (error instanceof FunctionsRelayError) {
  console.log('Relay error:', error.message)
} else if (error instanceof FunctionsFetchError) {
  console.log('Fetch error:', error.message)
}
```
