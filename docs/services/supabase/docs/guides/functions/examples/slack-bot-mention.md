# Slack Bot メンションEdge Function

Slack Bot メンションEdge Functionを使用すると、Slackでのメンションを処理し、適切に応答できます。

## Slackアプリの設定

ボットがSlackとシームレスに連携するには、Slack Appsを設定する必要があります:

1. Slack Appsページに移動します。
2. 「Event Subscriptions」で、`slack-bot-mention`関数のURLを追加し、クリックしてURLを検証します。
3. Edge Functionが応答し、すべてが正しく設定されていることを確認します。
4. ボットがサブスクライブするイベントに`app-mention`を追加します。

## Edge Functionの作成

CLIを使用して次のコードをEdge Functionとしてデプロイします:

```bash
supabase --project-ref your-project-ref secrets \
set SLACK_TOKEN=your-slack-bot-token-here
```

以下はEdge Functionのコードです。受信したテキストを処理するために応答を変更できます:

```typescript
import { WebClient } from 'https://deno.land/x/slack_web_api@6.7.2/mod.js'

const slackBotToken = Deno.env.get('SLACK_TOKEN') ?? ''
const botClient = new WebClient(slackBotToken)

console.log(`Slack URL verification function up and running!`)

Deno.serve(async (req) => {
  try {
    const reqBody = await req.json()
    console.log(JSON.stringify(reqBody, null, 2))
    const { token, challenge, type, event } = reqBody

    if (type == 'url_verification') {
      return new Response(JSON.stringify({ challenge }), {
        headers: { 'Content-Type': 'application/json' },
        status: 200,
      })
    } else if (event.type == 'app_mention') {
      const { user, text, channel, ts } = event
      // ここで受信したテキストを処理し、応答を返す必要があります:
      const response = await botClient.chat.postMessage({
        channel: channel,
        text: `Hello <@${user}>!`,
      })

      return new Response(JSON.stringify({ ok: true }), {
        headers: { 'Content-Type': 'application/json' },
        status: 200,
      })
    }
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { 'Content-Type': 'application/json' },
      status: 500,
    })
  }
})
```

このコードは、Slackボットのメンションを処理し、適切に応答するEdge Functionの実装を示しています。URL検証とapp-mentionイベントの両方を処理します。
