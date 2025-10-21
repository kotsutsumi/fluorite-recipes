# メール送信フック

## 概要

メール送信フックは、メールが送信される前に実行される機能で、メール送信プロセスに柔軟性を提供します。開発者は以下のことができます：

- バックアップメールプロバイダーを設定
- メールに国際化を追加

## メール送信の動作

### 動作マトリックス

| メールプロバイダー | Authフック | 結果 |
|---------------|-----------|--------|
| 有効 | 有効 | Authフックがメール送信を処理（SMTPは未使用） |
| 有効 | 無効 | SMTPがメール送信を処理 |
| 無効 | 有効 | メールサインアップが無効 |
| 無効 | 無効 | メールサインアップが無効 |

## メール変更の動作

`email_action_type` が `email_change` の場合、フックペイロードには以下が含まれます：

- セキュアなメール変更が有効な場合：2つのOTP（現在のメールと新しいメール用）
- セキュアなメール変更が無効な場合：新しいメール用の1つのOTP

### 重要な注意点

- `email_data.token_hash_new` = Hash(`user.email`, `email_data.token`)
- `email_data.token_hash` = Hash(`user.email_new`, `email_data.token_new`)

## フック入力

### Userオブジェクト

ユーザーの詳細（ID、メール、メタデータなど）が含まれます

### Email Data

- OTPとトークンハッシュを含みます
- 認証とメール確認プロセスに使用されます

## 実装例

### Resendをメールプロバイダーとして使用

1. **環境変数ファイルの作成（`.env`）**

```env
RESEND_API_KEY="your_resend_api_key"
SEND_EMAIL_HOOK_SECRET="v1,whsec_<base64_secret>"
```

2. **Supabase Edge Functionの作成**

```typescript
// supabase/functions/send-email-hook/index.ts
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { Resend } from 'npm:resend'

const resend = new Resend(Deno.env.get('RESEND_API_KEY'))

serve(async (req) => {
  const payload = await req.json()
  const { user, email_data } = payload

  try {
    // Resend APIを使用してメールを送信
    const { data, error } = await resend.emails.send({
      from: 'noreply@yourdomain.com',
      to: email_data.to,
      subject: email_data.subject,
      html: email_data.body,
    })

    if (error) {
      console.error('メール送信エラー:', error)
      return new Response(
        JSON.stringify({ error: 'メール送信に失敗しました' }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      )
    }

    return new Response(
      JSON.stringify({ message_id: data.id }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    )
  } catch (err) {
    console.error('予期しないエラー:', err)
    return new Response(
      JSON.stringify({ error: 'メール送信中にエラーが発生しました' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    )
  }
})
```

3. **認証フックとして関数を設定**

ダッシュボードの認証フック設定で、作成したEdge Functionを指定します。

### 国際化の例

```typescript
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'

// 言語別のメールテンプレート
const templates = {
  ja: {
    subject: 'メールアドレスの確認',
    body: (token: string) => `
      <h1>ようこそ！</h1>
      <p>以下の確認コードを入力してください：</p>
      <h2>${token}</h2>
    `,
  },
  en: {
    subject: 'Confirm your email',
    body: (token: string) => `
      <h1>Welcome!</h1>
      <p>Please enter the following confirmation code:</p>
      <h2>${token}</h2>
    `,
  },
}

serve(async (req) => {
  const payload = await req.json()
  const { user, email_data } = payload

  // ユーザーの言語設定を取得（デフォルトは英語）
  const userLang = user.user_metadata?.language || 'en'
  const template = templates[userLang] || templates.en

  // カスタマイズされたメールを送信
  // ...

  return new Response(JSON.stringify({}), {
    headers: { 'Content-Type': 'application/json' },
    status: 200,
  })
})
```

## 主な考慮事項

- メール送信のカスタマイズが可能
- 国際化をサポート
- 認証メールプロセスに柔軟性を提供
- エラーハンドリングとフォールバック戦略の実装が推奨されます
- レート制限とセキュリティ対策を考慮してください
