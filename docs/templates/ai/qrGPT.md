# qrGPT – AI QR Code Generator

## 概要

ワンクリックでAIを使用して美しいQRコードを生成するAIツールです。

**デモ**: https://qrgpt.io/
**GitHub**: https://github.com/Nutlope/qrGPT

## 主な機能

- AI駆動のQRコード生成
- ワンクリック生成
- 美しくカスタマイズ可能なQRコード

## 技術スタック

- **フレームワーク**: Next.js App Router
- **AIモデル**: Replicate
- **画像ストレージ**: Vercel Blob
- **データストレージ**: Vercel KV(Redisストレージとレート制限)
- **UIコンポーネント**: Shadcn UI

## はじめに

### 前提条件

- Replicateアカウント
- Vercel KVデータベース
- Vercel Blobストレージ

### 環境変数の設定

`.env.local`ファイルを作成し、以下の環境変数を設定してください:

```bash
# Replicate
REPLICATE_API_KEY=your_replicate_api_key

# Vercel Blob
BLOB_READ_WRITE_TOKEN=your_blob_token

# Vercel KV (Redis)
KV_URL=your_kv_url
KV_REST_API_URL=your_kv_rest_url
KV_REST_API_TOKEN=your_kv_token
```

### 依存関係のインストール

```bash
npm install
# または
yarn install
# または
pnpm install
```

### 開発サーバーの起動

```bash
npm run dev
# または
yarn dev
# または
pnpm dev
```

## 機能

### AI QRコード生成

1. QRコードの内容(URL、テキストなど)を入力
2. デザインスタイルやプロンプトを指定
3. AIが美しいQRコードを生成
4. QRコードをダウンロードまたは共有

### レート制限

Vercel KVを使用してレート制限を実装し、APIの乱用を防止します。

### 画像ストレージ

生成されたQRコード画像はVercel Blobに保存されます。

## デプロイ

### Vercelへのデプロイ

1. GitHubリポジトリをVercelにインポート
2. 環境変数を設定
3. Vercel KVとBlobをセットアップ
4. デプロイ

## 作成者

- Hassan El Mghari ([@nutlope](https://twitter.com/nutlope))
- Kevin Hou ([@kevinhou22](https://twitter.com/kevinhou22))

## クレジット

- Codeiumとv0: プロトタイピング支援
- Spiralsプロジェクト: コードパターン提供
- Lim Zi Yang: オリジナルAIモデル

## 使用例

- マーケティングキャンペーン
- イベント招待状
- 製品パッケージング
- ブランディング素材

## リソース

- [Replicate Documentation](https://replicate.com/docs)
- [Vercel Blob Documentation](https://vercel.com/docs/storage/vercel-blob)
- [Vercel KV Documentation](https://vercel.com/docs/storage/vercel-kv)

## ライセンス

MITライセンス
