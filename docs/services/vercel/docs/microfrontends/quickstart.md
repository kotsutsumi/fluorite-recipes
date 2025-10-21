# マイクロフロントエンドのクイックスタート

## はじめに

マイクロフロントエンドは、Vercelの[ベータ版](/docs/release-phases#beta)で、[すべてのプラン](/docs/plans)で利用可能な機能です。

## 前提条件

- Vercelで少なくとも2つの[プロジェクト](/docs/projects/overview#creating-a-project)を作成していること

## 主要な概念

- **デフォルトアプリ**：`microfrontends.json` 設定ファイルを管理し、ルーティング判断を行うメインアプリケーション
- **共有ドメイン**：すべてのマイクロフロントエンドが単一のドメインで動作
- **パスベースのルーティング**：URLパスに基づいてリクエストを適切なマイクロフロントエンドに自動的に転送
- **独立したデプロイメント**：チームは他の部分に影響を与えずにマイクロフロントエンドをデプロイ可能

## Vercelでのマイクロフロントエンドのセットアップ

### 1. マイクロフロントエンドグループの作成

1. [Vercelダッシュボード](/dashboard)に移動
2. 設定タブを選択
3. 設定ナビゲーションメニューから「マイクロフロントエンド」タブを選択
4. 右上の「グループを作成」をクリック
5. 指示に従ってプロジェクトをグループに追加し、デフォルトアプリケーションを選択

### 2. `microfrontends.json`の定義

デフォルトアプリケーションのルートに設定ファイルを作成します。

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

この設定では：
- `web`がデフォルトアプリケーション
- `docs`が`/docs`パスへのリクエストを処理
- 開発環境では、`vercel.com`にフォールバック

### 3. デプロイ

設定ファイルをコミットし、デフォルトアプリケーションをデプロイします。Vercelは自動的にマイクロフロントエンドルーティングを有効化します。

## 次のステップ

- [ローカル開発の設定](/docs/microfrontends/local-development)
- [パスルーティングの詳細](/docs/microfrontends/path-routing)
- [マイクロフロントエンドの管理](/docs/microfrontends/managing-microfrontends)
