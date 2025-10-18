# メールの送信

[Resend API](https://resend.com/)を使用してEdge Functionsからメールを送信する。

### 前提条件

このガイドを最大限に活用するには、以下が必要です:

- [APIキーの作成](https://resend.com/api-keys)
- [ドメインの検証](https://resend.com/domains)

最新バージョンの[Supabase CLI](/docs/guides/cli#installation)がインストールされていることを確認してください。

### 1. Supabase関数の作成

ローカルで新しい関数を作成します:

```bash
supabase functions new resend
```

`.env`ファイルに`RESEND_API_KEY`を保存します。

### 2. ハンドラー関数の編集

`index.ts`ファイルに次のコードを貼り付けます:

```typescript
const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY')

const handler = async (_request: Request): Promise<Response> => {
  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${RESEND_API_KEY}`,
    },
    body: JSON.stringify({
      from: 'onboarding@resend.dev',
      to: 'delivered@resend.dev',
      subject: 'hello world',
      html: '<strong>it works!</strong>',
    }),
  })

  const data = await res.json()

  return new Response(JSON.stringify(data), {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
    },
  })
}

Deno.serve(handler)
```

### 3. デプロイとメール送信

関数をローカルで実行:

```bash
supabase start
supabase functions serve --no-verify-jwt --env-file .env
```

テスト: [http://localhost:54321/functions/v1/resend](http://localhost:54321/functions/v1/resend)

本番環境にデプロイ:

```bash
supabase functions deploy resend
supabase secrets set RESEND_API_KEY=your_api_key_here
```

### カスタマイズ

メールの内容をカスタマイズするには、`body`オブジェクトのフィールドを変更します:

```typescript
body: JSON.stringify({
  from: 'your-email@your-domain.com',
  to: 'recipient@example.com',
  subject: 'カスタム件名',
  html: '<h1>カスタムHTMLコンテンツ</h1><p>メール本文</p>',
}),
```

### エラーハンドリング

より堅牢な実装のために、エラーハンドリングを追加することを検討してください:

```typescript
const handler = async (_request: Request): Promise<Response> => {
  try {
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: 'onboarding@resend.dev',
        to: 'delivered@resend.dev',
        subject: 'hello world',
        html: '<strong>it works!</strong>',
      }),
    })

    if (!res.ok) {
      throw new Error(`Resend API error: ${res.status}`)
    }

    const data = await res.json()

    return new Response(JSON.stringify(data), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    })
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
      },
    })
  }
}
```

これで、Supabase Edge FunctionsからResendを使用してメールを送信できるようになりました。
