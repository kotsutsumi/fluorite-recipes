# React EmailとResendを使用したカスタム認証メール

## 概要

[send email hook](/docs/guides/auth/auth-hooks/send-email-hook?queryGroups=language&language=http)を使用して、Supabase Edge Functionsで[React Email](https://react.email/)と[Resend](https://resend.com/)を使ってカスタム認証メールを送信します。

> すぐにコードを確認したいですか？[GitHubのサンプルをチェック](https://github.com/supabase/supabase/tree/master/examples/edge-functions/supabase/functions/auth-hook-react-email-resend)してください。

## 前提条件

このガイドを最大限に活用するには、以下が必要です:

- [Resend APIキーの作成](https://resend.com/api-keys)
- [ドメインの検証](https://resend.com/domains)

最新バージョンの[Supabase CLI](/docs/guides/cli#installation)がインストールされていることを確認してください。

## 1. Supabase Functionの作成

```bash
supabase functions new send-email
```

## 2. ハンドラー関数の編集

```typescript
import React from 'npm:react@18.3.1'
import { Webhook } from 'https://esm.sh/standardwebhooks@1.0.0'
import { Resend } from 'npm:resend@4.0.0'
import { renderAsync } from 'npm:@react-email/components@0.0.22'
import { MagicLinkEmail } from './_templates/magic-link.tsx'

const resend = new Resend(Deno.env.get('RESEND_API_KEY') as string)
const hookSecret = Deno.env.get('SEND_EMAIL_HOOK_SECRET') as string

Deno.serve(async (req) => {
  const payload = await req.text()
  const headers = Object.fromEntries(req.headers)
  const wh = new Webhook(hookSecret)

  try {
    const { user, email_data } = wh.verify(payload, headers) as {
      user: { email: string }
      email_data: {
        token: string
        token_hash: string
        redirect_to: string
        email_action_type: string
      }
    }

    const html = await renderAsync(
      React.createElement(MagicLinkEmail, {
        token: email_data.token,
        redirectTo: email_data.redirect_to,
      })
    )

    await resend.emails.send({
      from: 'onboarding@resend.dev',
      to: user.email,
      subject: 'Sign in to your account',
      html,
    })

    return new Response(JSON.stringify({ success: true }), {
      headers: { 'Content-Type': 'application/json' },
      status: 200,
    })
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { 'Content-Type': 'application/json' },
      status: 400,
    })
  }
})
```

## 3. React Emailテンプレートの作成

`_templates`フォルダと`magic-link.tsx`ファイルを作成します:

```typescript
import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Link,
  Preview,
  Text,
} from '@react-email/components'
import * as React from 'react'

interface MagicLinkEmailProps {
  token: string
  redirectTo: string
}

export const MagicLinkEmail = ({ token, redirectTo }: MagicLinkEmailProps) => {
  const magicLink = `${redirectTo}?token=${token}`

  return (
    <Html>
      <Head />
      <Preview>サインインリンク</Preview>
      <Body style={main}>
        <Container style={container}>
          <Heading style={h1}>サインイン</Heading>
          <Text style={text}>
            以下のボタンをクリックしてアカウントにサインインしてください。
          </Text>
          <Link
            href={magicLink}
            target="_blank"
            style={button}
          >
            サインイン
          </Link>
          <Text style={text}>
            または、このリンクをブラウザにコピー&ペーストしてください:
          </Text>
          <Text style={code}>{magicLink}</Text>
        </Container>
      </Body>
    </Html>
  )
}

const main = {
  backgroundColor: '#ffffff',
}

const container = {
  margin: '0 auto',
  padding: '20px 0 48px',
}

const h1 = {
  fontSize: '32px',
  fontWeight: 'bold',
  margin: '0 0 20px',
}

const text = {
  fontSize: '16px',
  lineHeight: '26px',
}

const button = {
  backgroundColor: '#000000',
  borderRadius: '5px',
  color: '#fff',
  display: 'inline-block',
  fontSize: '16px',
  fontWeight: 'bold',
  lineHeight: '50px',
  textAlign: 'center' as const,
  textDecoration: 'none',
  width: '200px',
}

const code = {
  fontFamily: 'monospace',
  fontSize: '14px',
  backgroundColor: '#f4f4f4',
  padding: '10px',
  borderRadius: '5px',
}
```

## 4. 関数のデプロイ

```bash
supabase functions deploy send-email --no-verify-jwt
```

## 5. Send Email Hookの設定

- Supabaseダッシュボードでauth Hooksに移動
- 新しい「Send Email hook」を作成
- HTTPSフックタイプを選択
- 関数URLを貼り付け
- Webhookシークレットを生成して保存

## 追加の設定

`.env`ファイルにシークレットを保存し、次のコマンドを使用して設定します:

```bash
supabase secrets set --env-file supabase/functions/.env
```

## 主なリソース

- [Send Email Hooks](/docs/guides/auth/auth-hooks/send-email-hook)
- [Auth Hooks](/docs/guides/auth/auth-hooks)

このガイドは、Supabaseプロジェクトで認証メールをカスタマイズするための包括的なウォークスルーを提供します。
