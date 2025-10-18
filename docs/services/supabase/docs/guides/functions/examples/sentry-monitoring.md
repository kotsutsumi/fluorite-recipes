# Sentryによる監視

[Sentry Deno SDK](https://docs.sentry.io/platforms/javascript/guides/deno/)をSupabase Edge Functionsに追加して、例外を追跡し、エラーやパフォーマンスの問題の通知を受け取ります。

### 前提条件

- [Sentryアカウントを作成](https://sentry.io/signup/)してください。
- 最新バージョンの[Supabase CLI](/docs/guides/cli#installation)がインストールされていることを確認してください。

### 1. Supabase関数の作成

ローカルで新しい関数を作成します:

```bash
supabase functions new sentryfied
```

### 2. Sentry Deno SDKの追加

関数内で例外を処理し、Sentryに送信します。

```typescript
import * as Sentry from 'https://deno.land/x/sentry/index.mjs'

Sentry.init({
  // https://docs.sentry.io/product/sentry-basics/concepts/dsn-explainer/#where-to-find-your-dsn
  dsn: SENTRY_DSN,
  defaultIntegrations: false,
  // Performance Monitoring
  tracesSampleRate: 1.0,
  // Set sampling rate for profiling - this is relative to tracesSampleRate
  profilesSampleRate: 1.0,
})

// Set region and execution_id as custom tags
Sentry.setTag('region', Deno.env.get('SB_REGION'))
Sentry.setTag('execution_id', Deno.env.get('SB_EXECUTION_ID'))

Deno.serve(async (req) => {
  try {
    const { name } = await req.json()
    // This will throw, as `name` in our example call will be `undefined`
    const data = {
      message: `Hello ${name}!`,
    }
    return new Response(JSON.stringify(data), { headers: { 'Content-Type': 'application/json' } })
  } catch (e) {
    Sentry.captureException(e)
    return new Response(JSON.stringify({ error: 'Internal Server Error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    })
  }
})
```

### 3. 環境変数の設定

`.env`ファイルにSentry DSNを追加します:

```
SENTRY_DSN=your_sentry_dsn_here
```

### 4. デプロイ

関数をローカルでテスト:

```bash
supabase start
supabase functions serve sentryfied --no-verify-jwt --env-file .env
```

関数をデプロイ:

```bash
supabase functions deploy sentryfied
supabase secrets set SENTRY_DSN=your_sentry_dsn_here
```

これで、Edge Function内で発生したエラーがSentryに自動的に報告されるようになります。リージョンと実行IDもカスタムタグとして追加されるため、問題のデバッグが容易になります。
