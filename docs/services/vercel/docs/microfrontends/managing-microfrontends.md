# マイクロフロントエンドの管理

## 概要

マイクロフロントエンドは、Vercelの[ベータ版](/docs/release-phases#beta)で、[すべてのプラン](/docs/plans)で利用可能です。

Vercelダッシュボードのマイクロフロントエンド設定を使用すると、以下のことができます：

- [マイクロフロントエンドの追加](#マイクロフロントエンドの追加)と[削除](#マイクロフロントエンドの削除)
- [マイクロフロントエンド間での設定の共有](#マイクロフロントエンド間での設定の共有)
- [観測性データのルーティング](#観測性データのルーティング)
- [デプロイメント保護とファイアウォールによるセキュリティ管理](/docs/microfrontends/managing-microfrontends/security)

[Vercelツールバーを使用してマイクロフロントエンドを管理](/docs/microfrontends/managing-microfrontends/vercel-toolbar)することもできます。

## マイクロフロントエンドの追加

マイクロフロントエンドグループにプロジェクトを追加するには：

1. 追加するプロジェクトの「設定」タブにアクセス
2. 「マイクロフロントエンド」タブをクリック
3. マイクロフロントエンドグループを見つけ、「グループに追加」をクリック
4. デフォルトアプリケーションの`microfrontends.json`を更新してルーティングを設定

これらの変更は、次のデプロイメントで有効になります。

### 例：新しいマイクロフロントエンドの追加

```json
{
  "$schema": "https://openapi.vercel.sh/microfrontends.json",
  "applications": {
    "web": {},
    "docs": {
      "routing": [
        {
          "paths": ["/docs", "/docs/:path*"]
        }
      ]
    },
    "blog": {
      "routing": [
        {
          "paths": ["/blog", "/blog/:path*"]
        }
      ]
    }
  }
}
```

## マイクロフロントエンドの削除

プロジェクトをマイクロフロントエンドグループから削除するには：

1. 削除するプロジェクトの「設定」タブにアクセス
2. 「マイクロフロントエンド」タブをクリック
3. マイクロフロントエンドグループを見つけ、「グループから削除」をクリック
4. デフォルトアプリケーションの`microfrontends.json`からエントリを削除

## マイクロフロントエンド間での設定の共有

### 環境変数の共有

環境変数は、各マイクロフロントエンドプロジェクトで個別に設定する必要があります。一元的に管理するには：

1. Vercelダッシュボードの「Settings」→「Environment Variables」に移動
2. 必要な環境変数を各プロジェクトに追加
3. 共有する値は、すべてのプロジェクトで同じ値を設定

### ドメインの共有

マイクロフロントエンドは、デフォルトアプリケーションのドメインを共有します。子マイクロフロントエンドには個別のドメインは必要ありません。

## 観測性データのルーティング

マイクロフロントエンドは、[Speed Insights](/docs/speed-insights)や[Web Analytics](/docs/analytics)などの観測性ツールと統合できます。各マイクロフロントエンドのメトリクスは、対応するプロジェクトダッシュボードで確認できます。

### Speed Insightsの設定

各マイクロフロントエンドプロジェクトで：

1. プロジェクトの「Speed Insights」タブに移動
2. Speed Insightsを有効化
3. 対応するパッケージをインストール

```bash
npm install @vercel/speed-insights
```

4. アプリケーションに統合

```javascript
import { SpeedInsights } from '@vercel/speed-insights/next';

export default function App({ Component, pageProps }) {
  return (
    <>
      <Component {...pageProps} />
      <SpeedInsights />
    </>
  );
}
```

## デプロイメント戦略

### 独立したデプロイメント

各マイクロフロントエンドは独立してデプロイできます。1つのマイクロフロントエンドの変更は、他のマイクロフロントエンドに影響を与えません。

### 調整されたデプロイメント

複数のマイクロフロントエンドに影響する変更の場合：

1. すべての関連マイクロフロントエンドを更新
2. デフォルトアプリケーションの`microfrontends.json`を更新（必要に応じて）
3. 各マイクロフロントエンドを順次デプロイ
4. デフォルトアプリケーションをデプロイ

## ベストプラクティス

- **明確な責任分担**：各マイクロフロントエンドの責任範囲を明確に定義
- **一貫性のあるインターフェース**：マイクロフロントエンド間で一貫したUIとUXを維持
- **適切な粒度**：マイクロフロントエンドを適切なサイズに保つ（大きすぎず、小さすぎず）
- **モニタリング**：各マイクロフロントエンドのパフォーマンスとエラーを監視
- **ドキュメント化**：マイクロフロントエンドの構造とルーティングをドキュメント化

## 関連リンク

- [セキュリティ管理](/docs/microfrontends/managing-microfrontends/security)
- [Vercelツールバー](/docs/microfrontends/managing-microfrontends/vercel-toolbar)
- [トラブルシューティング](/docs/microfrontends/troubleshooting)
