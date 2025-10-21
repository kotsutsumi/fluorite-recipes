# ブラウザからの呼び出しに対するCORS（Cross-Origin Resource Sharing）サポート

## 概要

ブラウザからエッジファンクションを呼び出すには、CORSプリフライトリクエストを処理する必要があります。GitHubに実例があります。

## 推奨設定

### CORSヘッダーファイルの作成

`_shared` フォルダに `cors.ts` ファイルを作成して、CORSヘッダーを複数のファンクション間で再利用できるようにします：

```typescript
export const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}
```

### エッジファンクションでのCORS実装

ファンクション内でCORSヘッダーをインポートして使用します：

```typescript
import { corsHeaders } from '../_shared/cors.ts'

Deno.serve(async (req) => {
  // CORSプリフライトリクエストを処理
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { name } = await req.json()
    const data = {
      message: `Hello ${name}!`,
    }
    return new Response(JSON.stringify(data), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    })
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 400,
    })
  }
})
```

重要なポイント：
- プリフライトリクエストを処理するためにOPTIONSメソッドのチェックを追加
- すべてのレスポンスに対してCORSヘッダーを返す
- 必要に応じて `corsHeaders` を追加のヘッダーと一緒にスプレッド展開
