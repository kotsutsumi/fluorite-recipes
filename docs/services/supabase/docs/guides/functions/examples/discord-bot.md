# Discordボットの構築

## 概要

このガイドでは、SupabaseエッジファンクションとDenoを使用してDiscordスラッシュコマンドボットを作成する方法を説明します。

## 前提条件

- Discord開発者アカウント
- Supabaseプロジェクト

## 手順

### 1. Discordアプリケーションの作成

1. [Discord開発者ポータル](https://discord.com/developers/applications)にアクセス
2. 「New Application」をクリック
3. アプリケーションに名前を付ける
4. アプリケーションにボットを追加

### 2. スラッシュコマンドの登録

curlを使用して "hello" コマンドを登録：

```bash
curl -X POST \
-H 'Content-Type: application/json' \
-H "Authorization: Bot $BOT_TOKEN" \
-d '{"name":"hello","description":"Greet a person","options":[{"name":"name","description":"The name of the person","type":3,"required":true}]}' \
"https://discord.com/api/v8/applications/$CLIENT_ID/commands"
```

### 3. ボットハンドラーのコーディング

このコードは、ルーティングにSiftを、リクエスト検証にTweetNaClを使用しています：

```typescript
serve({
  '/discord-bot': home,
})

async function home(request: Request) {
  // Discordリクエストを検証
  // pingとアプリケーションコマンドインタラクションを処理
  // 挨拶を返す
}
```

### 4. Supabaseへのデプロイ

```bash
supabase functions deploy discord-bot --no-verify-jwt
supabase secrets set DISCORD_PUBLIC_KEY=your_public_key
```

### 5. Discordインタラクションの設定

- Discord開発者ポータルでInteractions Endpoint URLを設定
- Discordサーバーにボットをインストール

### 6. ローカルで実行

```bash
supabase functions serve discord-bot --no-verify-jwt --env-file ./supabase/.env.local
ngrok http 54321
```

このガイドには、ビデオチュートリアルと、SupabaseエッジファンクションでシンプルなDiscordボットを作成するための詳細な手順が含まれています。
