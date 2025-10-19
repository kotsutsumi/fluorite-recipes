# Stripe Webhookの処理

Edge Functionsで署名されたStripe Webhookを処理する。[GitHubで確認](https://github.com/supabase/supabase/blob/master/examples/edge-functions/supabase/functions/stripe-webhooks/index.ts)

```typescript
// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.

// Import via bare specifier thanks to the import_map.json file.
import Stripe from 'https://esm.sh/stripe@14?target=denonext'

const stripe = new Stripe(Deno.env.get('STRIPE_API_KEY') as string, {
  // This is needed to use the Fetch API rather than relying on the Node http
  // package.
  apiVersion: '2024-11-20'
})

// This is needed in order to use the Web Crypto API in Deno.
const cryptoProvider = Stripe.createSubtleCryptoProvider()

console.log('Hello from Stripe Webhook!')

Deno.serve(async (request) => {
  const signature = request.headers.get('Stripe-Signature')

  // First step is to verify the event. The .text() method must be used as the
  // verification relies on the raw request body rather than the parsed JSON.
  const body = await request.text()
  let receivedEvent
  try {
    receivedEvent = await stripe.webhooks.constructEventAsync(
      body,
      signature!,
      Deno.env.get('STRIPE_WEBHOOK_SIGNING_SECRET')!,
      undefined,
      cryptoProvider
    )
  } catch (err) {
    return new Response(err.message, { status: 400 })
  }

  console.log(`🔔 Event received: ${receivedEvent.id}`)
  return new Response(JSON.stringify({ ok: true }), { status: 200 })
});
```

このコードは、Deno Edge Functionsを使用してStripe Webhookを安全に検証および処理する方法を示しています。

## 主なポイント

- Stripe APIバージョン '2024-11-20' を使用
- Web Crypto APIを使用してWebhookの署名を検証
- リクエストボディのテキスト形式を使用して検証を実施
- イベントの検証に失敗した場合は400エラーを返す
- 検証に成功した場合は受信イベントIDをログに記録
