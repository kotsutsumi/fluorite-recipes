# Amazon Bedrockで画像を生成

## 概要

「Amazon Bedrockは、AI21 Labs、Anthropic、Cohere、Meta、Mistral AI、Stability AI、Amazonなどの主要なAI企業による高性能な基盤モデル（FM）の選択肢を提供する、完全マネージド型サービスです。」

このガイドでは、SupabaseエッジファンクションでAmazon Bedrock JavaScript SDKを使用して、Amazon Titan Image Generator G1モデルで画像を生成する方法を説明します。

## セットアップ

1. AWSコンソールでAmazon Titan Image Generator G1へのアクセスをリクエスト
2. `supabase` ディレクトリに `.env` ファイルを作成し、AWS認証情報を設定

### ストレージの設定

1. `supabase start` を実行
2. Supabase Studioを開く
3. Storageに移動
4. "images" という名前の新しいパブリックバケットを作成

## コード

新しいファンクションを作成：

```bash
supabase functions new amazon-bedrock
```

`index.ts` にコードを追加（主要な手順）：
- 必要なモジュールをインポート
- AWS Bedrockクライアントを設定
- Titan Image Generatorを使用して画像を生成
- Supabaseストレージに画像をアップロード

## ローカルでの実行

1. `supabase start` を実行
2. 環境変数を使ってファンクションを起動：
   `supabase functions serve --env-file supabase/.env`
3. プロンプトを含むHTTPリクエストを送信
4. ストレージバケットでアップロードされた画像を確認

## デプロイ

```bash
supabase link
supabase functions deploy amazon-bedrock
supabase secrets set --env-file supabase/.env
```

結果として、AI画像を生成してSupabaseストレージにアップロードするサーバーレスファンクションが完成します。
