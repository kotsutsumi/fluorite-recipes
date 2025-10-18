# Supabase Edge Functionsのロギング

## 概要

ロギングを使用してEdge Functionsを監視し、実行を追跡し、問題をデバッグし、パフォーマンスを最適化します。

## ログへのアクセス

### 本番環境

Supabaseダッシュボードを通じてログにアクセスします:

1. Functionsセクションに移動
2. 関数を選択
3. ログビューを選択:
   - **Invocations**: リクエスト/レスポンスデータ（ヘッダー、ボディ、ステータスコード、実行時間を含む）
   - **Logs**: プラットフォームイベント、キャッチされなかった例外、カスタムログメッセージ

### 開発環境

ローカルで開発する際、エラーメッセージとコンソールログステートメントはターミナルに出力されます。

## ログイベントタイプ

### 自動ログ

Functionsは以下を自動的にキャプチャします:

- キャッチされなかった例外
- `console.log`、`console.error`、`console.warn`を使用したカスタムログイベント
- 起動とシャットダウンのログ

### カスタムログ

ログメッセージを追加する例:

```typescript
Deno.serve(async (req) => {
  try {
    const { name } = await req.json()
    if (!name) {
      console.warn('Empty name parameter received')
    }
    console.log(`Processing request for: ${name}`)

    const data = {
      message: `Hello ${name || 'Guest'}!`
    }

    return new Response(JSON.stringify(data), {
      headers: { 'Content-Type': 'application/json' }
    })
  } catch (error) {
    console.error(`Request processing failed: ${error.message}`)
    return new Response(JSON.stringify({ error: 'Internal Server Error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    })
  }
})
```

### ロギングの制約

- カスタムログメッセージは最大10,000文字まで含めることができます
- 関数は10秒間に最大100イベントまでログ出力できます

### ロギングのヒント

ヘッダーをログ出力する際は、`Headers`オブジェクトをプレーンオブジェクトに変換します:

```typescript
const headersObject = Object.fromEntries(req.headers)
const headersJson = JSON.stringify(headersObject)
console.log('Request headers:', headersJson)
```
