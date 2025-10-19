# マイクロフロントエンドのローカル開発

## 概要

マイクロフロントエンドは、開発者がアプリケーションの一部のみをローカルで実行できるようにする開発体験を提供します。`@vercel/microfrontends` は、マイクロフロントエンド対応のローカル開発プロキシを提供し、他のマイクロフロントエンドへのリクエストを本番環境にフォールバックさせます。

## マイクロフロントエンドプロキシの必要性

開発者は、特定のマイクロフロントエンドのみをローカルで実行し、他のマイクロフロントエンドへのリクエストは本番環境から取得できます。

### 例：設定ファイル

```json
{
  "$schema": "https://openapi.vercel.sh/microfrontends.json",
  "applications": {
    "web": {
      "development": {
        "fallback": "vercel.com"
      }
    },
    "docs": {
      "routing": [
        {
          "paths": ["/docs", "/docs/:path*"]
        }
      ]
    }
  }
}
```

この設定では、`web`をローカルで実行する場合、`/docs`へのリクエストは`vercel.com`の本番環境から取得されます。

## セットアップ手順

### 前提条件

- Vercelでマイクロフロントエンドをセットアップ
- すべてのアプリケーションに `@vercel/microfrontends` を依存関係として追加
- オプション：[Turborepo](https://turborepo.com)

### アプリケーションの設定

1. **開発サーバーのポートを自動的に割り当てる**

```json
{
  "name": "web",
  "scripts": {
    "dev": "next --port $(microfrontends port web)"
  }
}
```

2. **プロキシサーバーの起動**

```bash
microfrontends proxy
```

このコマンドは、ローカルポート3000でプロキシサーバーを起動します。

3. **開発サーバーの起動**

別のターミナルで：

```bash
npm run dev
```

### Turborepoとの統合

`turbo.json`の例：

```json
{
  "pipeline": {
    "dev": {
      "cache": false,
      "persistent": true
    }
  }
}
```

すべてのアプリケーションを一度に起動：

```bash
turbo dev
```

## トラブルシューティング

### ポート競合

ポートが既に使用されている場合は、環境変数で別のポートを指定できます：

```bash
MICROFRONTENDS_PROXY_PORT=3001 microfrontends proxy
```

### フォールバック先の変更

開発中に異なる環境にフォールバックする場合は、`microfrontends.json`を更新します：

```json
{
  "applications": {
    "web": {
      "development": {
        "fallback": "staging.example.com"
      }
    }
  }
}
```

## ベストプラクティス

- 作業しているマイクロフロントエンドのみをローカルで実行
- 本番環境と同じドメイン構造を維持
- 環境変数を適切に設定
- Turborepoを使用してすべてのアプリケーションを効率的に管理

## 関連リンク

- [クイックスタート](/docs/microfrontends/quickstart)
- [パスルーティング](/docs/microfrontends/path-routing)
- [トラブルシューティング](/docs/microfrontends/troubleshooting)
