# 音声文字起こしTelegram Bot

## 99言語の音声・ビデオメッセージを文字起こしするTelegram Botを、Supabase Edge FunctionsでTypeScriptとDenoを使って構築

### イントロダクション

このチュートリアルでは、TypeScriptとElevenLabs Scribeモデルを使用して[音声テキスト変換API](https://elevenlabs.io/speech-to-text)経由で99言語の音声・ビデオメッセージを文字起こしするTelegram Botを構築する方法を学びます。

最終結果がどのようになるかを確認するには、[t.me/ElevenLabsScribeBot](https://t.me/ElevenLabsScribeBot)をテストしてください。

[GitHubのサンプルプロジェクト](https://github.com/elevenlabs/elevenlabs-examples/tree/main/examples/speech-to-text/telegram-transcription-bot)を確認してください。

### 要件

- [APIキー](/app/settings/api-keys)を持つElevenLabsアカウント
- [Supabase](https://supabase.com)アカウント（[database.new](https://database.new)から無料アカウントにサインアップできます）
- マシンに[Supabase CLI](/docs/guides/local-development)がインストールされていること
- マシンに[Denoランタイム](https://docs.deno.com/runtime/getting_started/installation/)がインストールされていること、およびオプションで[お気に入りのIDEでセットアップ](https://docs.deno.com/runtime/getting_started/setup_your_environment)されていること
- [Telegram](https://telegram.org)アカウント

### セットアップ

#### Telegram Botの登録

[BotFather](https://t.me/BotFather)を使用して新しいTelegram Botを作成します。`/newbot`コマンドを実行し、指示に従って新しいBotを作成します。最後に、シークレットBotトークンを受け取ります。次のステップのために安全にメモしておいてください。

#### ローカルでSupabaseプロジェクトを作成

[Supabase CLI](/docs/guides/local-development)をインストールした後、次のコマンドを実行してローカルで新しいSupabaseプロジェクトを作成します:

```bash
supabase init
```

#### データベーステーブルの作成

文字起こしログを保存するためのテーブルを作成します。`supabase/migrations`ディレクトリに新しいマイグレーションファイルを作成します:

```sql
-- 文字起こしログテーブルの作成
CREATE TABLE transcriptions (
  id BIGSERIAL PRIMARY KEY,
  user_id BIGINT NOT NULL,
  message_id BIGINT NOT NULL,
  text TEXT NOT NULL,
  language TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- インデックスの作成
CREATE INDEX idx_transcriptions_user_id ON transcriptions(user_id);
CREATE INDEX idx_transcriptions_created_at ON transcriptions(created_at);
```

#### Edge Functionの作成

```bash
supabase functions new telegram-transcription-bot
```

#### 環境変数のセットアップ

`supabase/functions`ディレクトリ内に新しい`.env`ファイルを作成します:

```
# BotFatherから取得したTelegram Botトークン
TELEGRAM_BOT_TOKEN=your_bot_token

# https://elevenlabs.io/app/settings/api-keysで作成したAPIキー
ELEVENLABS_API_KEY=your_api_key
```

### Edge Functionの実装

`supabase/functions/telegram-transcription-bot/index.ts`ファイルを作成します:

```typescript
import { Bot, webhookCallback } from "https://deno.land/x/grammy@v1.19.2/mod.ts"
import { ElevenLabsClient } from "npm:elevenlabs@0.8.2"
import { createClient } from "npm:@supabase/supabase-js@2.39.3"

const bot = new Bot(Deno.env.get("TELEGRAM_BOT_TOKEN")!)
const elevenlabs = new ElevenLabsClient({
  apiKey: Deno.env.get("ELEVENLABS_API_KEY")!,
})
const supabase = createClient(
  Deno.env.get("SUPABASE_URL")!,
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
)

// 音声メッセージの処理
bot.on("message:voice", async (ctx) => {
  try {
    await ctx.reply("音声を文字起こし中...")

    // Telegram APIから音声ファイルを取得
    const file = await ctx.getFile()
    const fileUrl = `https://api.telegram.org/file/bot${Deno.env.get("TELEGRAM_BOT_TOKEN")}/${file.file_path}`

    // 音声ファイルをダウンロード
    const response = await fetch(fileUrl)
    const audioBuffer = await response.arrayBuffer()

    // ElevenLabsで文字起こし
    const transcription = await elevenlabs.speechToText.transcribe({
      audio: new Uint8Array(audioBuffer),
    })

    // データベースに保存
    await supabase
      .from('transcriptions')
      .insert({
        user_id: ctx.from.id,
        message_id: ctx.message.message_id,
        text: transcription.text,
        language: transcription.language,
      })

    // ユーザーに結果を送信
    await ctx.reply(
      `📝 文字起こし結果:\n\n${transcription.text}\n\n🌍 検出された言語: ${transcription.language}`
    )
  } catch (error) {
    console.error("Error:", error)
    await ctx.reply("申し訳ございません。文字起こし中にエラーが発生しました。")
  }
})

// ビデオメッセージの処理
bot.on("message:video_note", async (ctx) => {
  try {
    await ctx.reply("ビデオを文字起こし中...")

    const file = await ctx.getFile()
    const fileUrl = `https://api.telegram.org/file/bot${Deno.env.get("TELEGRAM_BOT_TOKEN")}/${file.file_path}`

    const response = await fetch(fileUrl)
    const videoBuffer = await response.arrayBuffer()

    const transcription = await elevenlabs.speechToText.transcribe({
      audio: new Uint8Array(videoBuffer),
    })

    await supabase
      .from('transcriptions')
      .insert({
        user_id: ctx.from.id,
        message_id: ctx.message.message_id,
        text: transcription.text,
        language: transcription.language,
      })

    await ctx.reply(
      `📝 文字起こし結果:\n\n${transcription.text}\n\n🌍 検出された言語: ${transcription.language}`
    )
  } catch (error) {
    console.error("Error:", error)
    await ctx.reply("申し訳ございません。文字起こし中にエラーが発生しました。")
  }
})

// スタートコマンド
bot.command("start", (ctx) => {
  ctx.reply(
    "👋 こんにちは！音声またはビデオメッセージを送信すると、99言語で文字起こしします。"
  )
})

// Webhookハンドラー
const handleUpdate = webhookCallback(bot, "std/http")

Deno.serve(async (req) => {
  try {
    return await handleUpdate(req)
  } catch (error) {
    console.error("Error handling update:", error)
    return new Response("Internal Server Error", { status: 500 })
  }
})
```

### デプロイ

#### ローカルで開始

```bash
supabase start
supabase functions serve telegram-transcription-bot --env-file supabase/functions/.env --no-verify-jwt
```

#### 本番環境にデプロイ

```bash
# プロジェクトをリンク
supabase link --project-ref your-project-ref

# 関数をデプロイ
supabase functions deploy telegram-transcription-bot

# シークレットを設定
supabase secrets set --env-file supabase/functions/.env
```

#### Webhookの設定

デプロイ後、TelegramにWebhook URLを設定する必要があります:

```bash
curl "https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/setWebhook?url=https://your-project-ref.supabase.co/functions/v1/telegram-transcription-bot"
```

### 使用方法

1. Telegramでボットを検索
2. `/start`コマンドでボットを開始
3. 音声またはビデオメッセージを送信
4. ボットが自動的に文字起こしして結果を返します

### サポートされる機能

- **99言語**: 複数の言語で自動的に文字起こし
- **音声メッセージ**: Telegramの音声メッセージをサポート
- **ビデオメッセージ**: ビデオノート（丸いビデオメッセージ）をサポート
- **言語検出**: 自動的に話されている言語を検出
- **履歴保存**: すべての文字起こしをSupabaseデータベースに保存

### 技術スタック

- **grammYフレームワーク**: Telegram Webhookの処理
- **Supabase JavaScriptライブラリ**: データベース操作
- **ElevenLabs JavaScript SDK**: 音声文字起こし
- **Deno**: ランタイム環境

完全な実装例は[GitHubリポジトリ](https://github.com/elevenlabs/elevenlabs-examples/tree/main/examples/speech-to-text/telegram-transcription-bot)で確認できます。
