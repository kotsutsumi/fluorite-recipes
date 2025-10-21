# 関数の設定

個々の関数の動作を設定します。認証、依存関係、その他の設定をカスタマイズします。

## 設定

デフォルトでは、すべてのEdge関数は同じ設定を持っています。実際のアプリケーションでは、関数間で異なる動作が必要になることがあります。

例えば：

- **Stripeウェブフック**は公開アクセス可能である必要があります（Stripeにはユーザートークンがありません）
- **ユーザープロファイルAPI**は認証を必要とする必要があります
- **一部の関数**は特別な依存関係や異なるファイルタイプを必要とする場合があります

これらの関数固有のルールを有効にするには、プロジェクトルートに`supabase/config.toml`を作成します：

```toml
# Stripeウェブフックの認証を無効化
[functions.stripe-webhook]
verify_jwt = false

# この特定の関数のカスタム依存関係
[functions.image-processor]
import_map = './functions/image-processor/import_map.json'

# JavaScriptを使用するレガシー関数のカスタムエントリーポイント
[functions.legacy-processor]
entrypoint = './functions/legacy-processor/index.js'
```

この設定により、Supabaseは`stripe-webhook`関数が有効なJWTを必要としないこと、`image-processor`関数がカスタムインポートマップを使用すること、`legacy-processor`がカスタムエントリーポイントを使用することを認識します。

これらのルールを一度設定すれば、各エンドポイントのセキュリティと動作が正確に制御されます。

---

## 利用可能な設定オプション

### `verify_jwt`

関数がSupabase JWTによる認証を必要とするかどうかを制御します。

- **デフォルト**: `true`
- **型**: `boolean`

```toml
[functions.public-webhook]
verify_jwt = false
```

公開ウェブフック（Stripe、GitHub、など）には`false`に設定します。

---

### `import_map`

カスタムインポートマップファイルへのパスを指定します。

- **デフォルト**: `./functions/import_map.json`
- **型**: `string`

```toml
[functions.custom-deps]
import_map = './functions/custom-deps/import_map.json'
```

関数ごとに異なる依存関係が必要な場合に使用します。

---

### `entrypoint`

関数のカスタムエントリーポイントファイルを指定します。

- **デフォルト**: `./functions/{function-name}/index.ts`
- **型**: `string`

```toml
[functions.legacy-function]
entrypoint = './functions/legacy-function/handler.js'
```

JavaScriptファイルを使用する場合や、異なるファイル構造を持つ場合に使用します。

---

## 実用的な例

### 公開ウェブフック関数

Stripeウェブフックなど、認証を必要としない関数：

```toml
[functions.stripe-webhook]
verify_jwt = false
```

関数内で、Stripeシグネチャを検証：

```typescript
import Stripe from 'npm:stripe@13'

const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY')!)

Deno.serve(async (req) => {
  const signature = req.headers.get('stripe-signature')!
  const body = await req.text()

  try {
    const event = stripe.webhooks.constructEvent(
      body,
      signature,
      Deno.env.get('STRIPE_WEBHOOK_SECRET')!
    )
    // イベントを処理
    return new Response(JSON.stringify({ received: true }), { status: 200 })
  } catch (err) {
    return new Response(`Webhook Error: ${err.message}`, { status: 400 })
  }
})
```

---

### 保護されたAPI関数

認証を必要とするユーザー固有のAPI：

```toml
[functions.user-profile]
verify_jwt = true  # これはデフォルトですが、明示的に設定
```

関数内で、ユーザー情報にアクセス：

```typescript
import { createClient } from 'npm:@supabase/supabase-js@2'

Deno.serve(async (req) => {
  const authHeader = req.headers.get('Authorization')!
  const token = authHeader.replace('Bearer ', '')

  const supabaseClient = createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_ANON_KEY')!,
    { global: { headers: { Authorization: authHeader } } }
  )

  // トークンからユーザーを取得
  const { data: { user } } = await supabaseClient.auth.getUser(token)

  if (!user) {
    return new Response('Unauthorized', { status: 401 })
  }

  // ユーザープロファイルを取得
  const { data: profile } = await supabaseClient
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  return new Response(JSON.stringify(profile), {
    headers: { 'Content-Type': 'application/json' }
  })
})
```

---

### カスタム依存関係を持つ関数

特定の関数のみが必要とする依存関係：

```toml
[functions.image-processor]
import_map = './functions/image-processor/deno.json'
```

`functions/image-processor/deno.json`:

```json
{
  "imports": {
    "imagescript": "https://deno.land/x/imagescript@1.2.15/mod.ts"
  }
}
```

---

## ベストプラクティス

1. **デフォルトで認証を有効化**: 公開アクセスが必要な関数のみ`verify_jwt = false`を使用
2. **関数ごとに設定を文書化**: `config.toml`にコメントを追加して設定の理由を説明
3. **カスタムエントリーポイントは慎重に使用**: 可能な限り標準的な`index.ts`構造を使用
4. **インポートマップを分離**: 関数ごとに独自の`deno.json`を持つことを検討

---

## 次のステップ

- [シークレット](/docs/guides/functions/secrets)の管理方法を学習
- [依存関係](/docs/guides/functions/dependencies)の追加方法を確認
- [アーキテクチャ](/docs/guides/functions/architecture)を理解
