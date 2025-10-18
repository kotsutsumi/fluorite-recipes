# バックグラウンドタスク

## 概要

Edge Functionインスタンスは、リクエストハンドラーの外部でバックグラウンドタスクを処理できます。バックグラウンドタスクは、Storageへのファイルアップロード、データベースの更新、ロギングサービスへのイベント送信などの非同期操作に役立ちます。

これにより、以下のことが可能になります:
- 処理を継続しながらユーザーに迅速に応答
- レスポンスをブロックせずに非同期操作を処理

### `EdgeRuntime.waitUntil()`の使用

`EdgeRuntime.waitUntil(promise)`を使用して、バックグラウンドタスクを明示的にマークできます。Functionインスタンスは、`waitUntil`に提供されたプロミスが完了するまで実行を継続します。

バックグラウンドタスクをマークする例:

```javascript
// asyncLongRunningTaskの返されたプロミスをバックグラウンドタスクとしてマークします。
// ⚠️ ブロックしたくないので、`await`を使用していません！
EdgeRuntime.waitUntil(asyncLongRunningTask())

Deno.serve(async (req) => {
  return new Response(...)
})
```

リクエストハンドラー内で`EdgeRuntime.waitUntil`を呼び出すことができ、リクエストをブロックしません:

```javascript
Deno.serve(async (req) => {
  // リクエストをブロックせず、バックグラウンドで実行されます。
  EdgeRuntime.waitUntil(asyncLongRunningTask())

  return new Response(...)
})
```

### 関数のシャットダウンのリスニング

`beforeunload`イベントハンドラーをリッスンして、関数がシャットダウンされる直前に通知を受け取ることができます:

```javascript
EdgeRuntime.waitUntil(asyncLongRunningTask())

// beforeunloadイベントハンドラーを使用して、関数のシャットダウンを通知します
addEventListener('beforeunload', (ev) => {
  console.log('Function will be shutdown due to', ev.detail?.reason)
  // 状態を保存するか、現在の進行状況をログに記録します
})
```

## エラー処理

推奨されるエラー処理戦略:

1. バックグラウンドタスク関数内で`try`/`catch`ブロックを使用
2. `unhandledrejection`のイベントリスナーを追加して、拒否ハンドラーのないプロミスを処理:

```javascript
addEventListener('unhandledrejection', (ev) => {
  console.error('Unhandled rejection:', ev.reason)
  // エラーをログサービスに送信
})

Deno.serve(async (req) => {
  // 意図的にエラーハンドラーなしでバックグラウンドタスクを実行
  EdgeRuntime.waitUntil(
    someAsyncOperation().catch((error) => {
      console.error('Background task failed:', error)
      // エラーを適切に処理
    })
  )

  return new Response('Request processed')
})
```

## 実用例

### Storageへの非同期アップロード

```javascript
import { createClient } from 'npm:@supabase/supabase-js@2'

Deno.serve(async (req) => {
  const data = await req.json()

  // 即座にユーザーに応答
  const response = new Response(JSON.stringify({ status: 'processing' }), {
    headers: { 'Content-Type': 'application/json' },
  })

  // バックグラウンドでStorageにアップロード
  EdgeRuntime.waitUntil(
    (async () => {
      const supabase = createClient(
        Deno.env.get('SUPABASE_URL') ?? '',
        Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
      )

      await supabase.storage
        .from('uploads')
        .upload(`processed/${data.id}.json`, JSON.stringify(data))
    })()
  )

  return response
})
```

### 分析イベントのログ記録

```javascript
Deno.serve(async (req) => {
  // バックグラウンドで分析イベントをログ記録
  EdgeRuntime.waitUntil(
    fetch('https://analytics-service.com/events', {
      method: 'POST',
      body: JSON.stringify({
        timestamp: new Date().toISOString(),
        path: new URL(req.url).pathname,
        method: req.method,
      }),
    })
  )

  // メインレスポンスを返す
  return new Response('Hello World')
})
```

## 制限事項

- バックグラウンドタスクは関数の最大実行時間制限の対象です
- タスクが完了する前に関数インスタンスがシャットダウンされる可能性があります
- 長期実行タスクには、専用のキューシステムまたはcronジョブの使用を検討してください
