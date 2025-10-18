# Cloudflare TurnstileによるCAPTCHAサポート

## 概要

「Cloudflare Turnstileは、フレンドリーで無料のCAPTCHA代替ツールであり、Supabaseエッジファンクションとシームレスに連携してフォームを保護します。」

## セットアップ

1. Cloudflareのドキュメントに従って新しいサイトをセットアップ
2. Cloudflare Turnstileウィジェットをサイトに追加

## コード例

### 新しいファンクションを作成

```bash
supabase functions new cloudflare-turnstile
```

### ファンクション実装（index.ts）

```typescript
import { corsHeaders } from '../_shared/cors.ts'

console.log('Hello from Cloudflare Trunstile!')

function ips(req: Request) {
  return req.headers.get('x-forwarded-for')?.split(/\s*,\s*/)
}

Deno.serve(async (req) => {
  // ブラウザからの呼び出しのためのCORS処理
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  const { token } = await req.json()
  const clientIps = ips(req) || ['']
  const ip = clientIps[0]

  // Cloudflareのsiteverifyエンドポイント経由でトークンを検証
  let formData = new FormData()
  formData.append('secret', Deno.env.get('CLOUDFLARE_SECRET_KEY') ?? '')
  formData.append('response', token)
  formData.append('remoteip', ip)

  const url = 'https://challenges.cloudflare.com/turnstile/v0/siteverify'
  const result = await fetch(url, {
    body: formData,
    method: 'POST',
  })

  const outcome = await result.json()
  console.log(outcome)

  if (outcome.success) {
    return new Response('success', { headers: corsHeaders })
  }
  return new Response('failure', { headers: corsHeaders })
})
```

## デプロイ

デプロイに関する詳細は、Supabaseの公式ドキュメントを参照してください。
