# マイクロフロントエンドのパスルーティング

## 概要

マイクロフロントエンドは、Vercelのネットワークインフラストラクチャで直接ルーティングを処理し、セットアップを簡素化し、レイテンシを改善します。Vercelがドメインへのリクエストを受信すると、ライブデプロイメントの `microfrontends.json` ファイルを読み取り、ルーティング先を決定します。

## デフォルトルートの設定

Vercelダッシュボードで、デフォルトルートを設定できます：

1. プロジェクトの設定タブに移動
2. 「マイクロフロントエンド」タブをクリック
3. デフォルトルート設定を検索
4. `/docs` のような新しいパスを入力し、保存

## マイクロフロントエンドへの新しいパスの追加

`microfrontends.json` ファイルを修正してパスをルーティングします：

```json
{
  "$schema": "https://openapi.vercel.sh/microfrontends.json",
  "applications": {
    "web": {},
    "docs": {
      "routing": [
        {
          "paths": ["/docs", "/docs/:path*", "/new-path-to-route"]
        }
      ]
    }
  }
}
```

## サポートされているパス表現

### 基本的なパスパターン

- **定数パス**：`/path` - 正確なパスにマッチ
- **単一ワイルドカード**：`/:path` - 単一のパスセグメントにマッチ
- **ワイルドカード + 末尾定数**：`/:path/suffix` - 末尾に定数パスがある単一のパスセグメントにマッチ
- **多段ワイルドカード**：`/:path*` - すべての子パスにマッチ

### 例

```json
{
  "applications": {
    "blog": {
      "routing": [
        {
          "paths": [
            "/blog",           // /blogにマッチ
            "/blog/:slug",     // /blog/post-1にマッチ
            "/blog/:slug*"     // /blog/category/post-1にマッチ
          ]
        }
      ]
    }
  }
}
```

## フラグを使用した条件付きルーティング

フィーチャーフラグを使用して、特定の条件下でのみルーティングを有効化できます：

```json
{
  "applications": {
    "beta-feature": {
      "routing": [
        {
          "paths": ["/new-feature"],
          "flags": {
            "beta_enabled": true
          }
        }
      ]
    }
  }
}
```

この設定では、`beta_enabled`フラグが`true`の場合にのみ、`/new-feature`が`beta-feature`アプリケーションにルーティングされます。

## ルーティングの優先順位

複数のマイクロフロントエンドが同じパスにマッチする可能性がある場合、以下の優先順位が適用されます：

1. 最も具体的なパス（ワイルドカードが少ない）
2. 設定ファイルでの定義順序

### 例

```json
{
  "applications": {
    "docs": {
      "routing": [
        {
          "paths": ["/docs/:path*"]
        }
      ]
    },
    "api-docs": {
      "routing": [
        {
          "paths": ["/docs/api"]
        }
      ]
    }
  }
}
```

この場合、`/docs/api`は`api-docs`にルーティングされ、その他の`/docs/*`は`docs`にルーティングされます。

## ベストプラクティス

- パスパターンは具体的に定義する
- ワイルドカードの使用は必要最小限に
- フラグを使用して段階的なロールアウトを実現
- ルーティングの優先順位を理解し、設計する

## トラブルシューティング

### パスがマッチしない

- `microfrontends.json`の構文を確認
- パスパターンが正しく定義されているか確認
- デプロイメントが最新の設定を反映しているか確認

### 複数のマイクロフロントエンドがマッチする

- ルーティング優先順位を確認
- より具体的なパスパターンを使用
- 設定ファイルでの定義順序を調整

## 関連リンク

- [クイックスタート](/docs/microfrontends/quickstart)
- [ローカル開発](/docs/microfrontends/local-development)
- [マイクロフロントエンドの管理](/docs/microfrontends/managing-microfrontends)
