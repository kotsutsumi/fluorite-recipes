# Supabase Authとの統合

## Edge FunctionsとSupabase Authの統合

Edge Functionsは[Supabase Auth](/docs/guides/auth)とシームレスに連携します。

これにより、以下のことが可能になります:
- JWTトークンを介してユーザーを自動的に識別
- 行レベルセキュリティポリシーの適用
- 既存の認証フローとのシームレスな統合

### 認証コンテキストの設定

ユーザーがEdge Functionにリクエストを送信する際、`Authorization`ヘッダーを使用してSupabaseクライアントに認証コンテキストを設定し、行レベルセキュリティポリシーを適用できます。

```typescript
import { createClient } from 'npm:@supabase/supabase-js@2'

Deno.serve(async (req: Request) => {
  const supabaseClient = createClient(
    Deno.env.get('SUPABASE_URL') ?? '',
    Deno.env.get('SUPABASE_ANON_KEY') ?? '',
    // 関数を呼び出したユーザーの認証コンテキストでクライアントを作成します。
    // これにより、行レベルセキュリティ（RLS）ポリシーが適用されます。
    {
      global: {
        headers: { Authorization: req.headers.get('Authorization')! },
      },
    }
  );
  // ...
})
```

**注意**: これは`Deno.serve()`コールバック引数の_内部_で実行されるため、`Authorization`ヘッダーが個々のリクエストごとに設定されます！

### ユーザー情報の取得

`Authorization`ヘッダーからJWTを取得することで、`getUser()`にトークンを提供してユーザーオブジェクトを取得し、ログインユーザーのメタデータを取得できます。

```typescript
Deno.serve(async (req: Request) => {
  // ...
  const authHeader = req.headers.get('Authorization')!
  const token = authHeader.replace('Bearer ', '')
  const { data } = await supabaseClient.auth.getUser(token)
  // ...
})
```

### 行レベルセキュリティ

認証コンテキストでSupabaseクライアントを初期化すると、すべてのクエリがユーザーのコンテキストで実行されます。データベースクエリの場合、これは[行レベルセキュリティ](/docs/guides/database/postgres/row-level-security)が適用されることを意味します。

```typescript
Deno.serve(async (req: Request) => {
  const supabaseClient = createClient(
    Deno.env.get('SUPABASE_URL') ?? '',
    Deno.env.get('SUPABASE_ANON_KEY') ?? '',
    {
      global: {
        headers: { Authorization: req.headers.get('Authorization')! },
      },
    }
  );

  // このクエリは、ユーザーの認証コンテキストで実行されます
  // RLSポリシーにより、ユーザーは自分のデータのみを参照できます
  const { data, error } = await supabaseClient
    .from('private_table')
    .select('*')

  return new Response(JSON.stringify({ data }), {
    headers: { 'Content-Type': 'application/json' },
  })
})
```

### JWT検証の無効化

パブリックエンドポイントやWebhook用にJWT検証を無効にする必要がある場合は、デプロイ時に`--no-verify-jwt`フラグを使用できます:

```bash
supabase functions deploy my-function --no-verify-jwt
```
