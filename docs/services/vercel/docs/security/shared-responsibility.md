# Shared Responsibility Model

共有責任モデルは、クラウドコンピューティングにおける2つのグループ間のタスクと義務を分割するフレームワークです。このモデルは、セキュリティ、メンテナンス、サービス機能を確保するために責任を分担します。

## 顧客の責任

顧客は以下の領域に責任を持ちます：

- セキュリティ要件の評価
- マルicious トラフィックへの対処
- クライアント側のデータ管理
- ソースコードの安全な保管と管理
- サーバーサイドの暗号化
- アイデンティティ & アクセス管理（IAM）
- コンピュートリソースのリージョン選択
- [本番環境チェックリスト](/docs/production-checklist)の実装
- 支出管理の設定

## 共同責任

- データとその保護
- 暗号化とデータの整合性
- 認証メカニズム
- ログ管理

## Vercelの責任

- インフラストラクチャのセキュリティと可用性
- コンピュート環境の提供
- データストレージの保護
- ネットワーキング環境の管理
- 19の異なるリージョンでのグローバルなコンテンツ配信

![Shared Responsibility Model](/vc-ap-vercel-docs/_next/image?url=https%3A%2F%2F7nyt0uhk7sse4zvn.public.blob.vercel-storage.com%2Fdocs-assets%2Fstatic%2Fdocs%2Fsecurity%2Fshared-responsibility-model-light-mode.png&w=3840&q=75)

詳細な情報は[Vercelのセキュリティドキュメント](https://vercel.com/docs/security)をご覧ください。
