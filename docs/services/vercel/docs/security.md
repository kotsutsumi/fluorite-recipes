# Vercel セキュリティ概要

クラウドにデプロイされたウェブアプリケーションは、毎週何百万もの悪意のある攻撃に直面しています。アプリケーション、ユーザー、ビジネスを保護するには、堅牢なセキュリティ対策が必要です。

包括的なセキュリティ戦略には、以下の2つの重要な側面があります：

## ガバナンスとポリシー

### コンプライアンス対策

Vercelが提供する[保護とコンプライアンス対策](/docs/security/compliance)について学びます。これには以下が含まれます：
- DDoS緩和
- SOC2 Type 2コンプライアンス
- データ暗号化

### 共同責任モデル

クラウドコンピューティングにおける2つのグループ間のタスクと義務を分割するフレームワークです。セキュリティ、メンテナンス、サービス機能を確保するために責任を分担します。

詳細は[共同責任モデル](/docs/security/shared-responsibility)を参照してください。

### 暗号化

Vercelの各デプロイメントは、自動生成される無料のSSL証明書を使用して、HTTPSで提供されます。すべての通信は暗号化され、データの機密性と整合性を保証します。

## 多層防御

Vercelは、[複数層のファイアウォールとデプロイメント保護](/docs/security/firewall-concepts#how-vercel-secures-requests)により、すべての受信リクエストを保護します。

### Vercelファイアウォール

Vercelファイアウォールは、以下の機能により、アプリケーションとウェブサイトを悪意のある攻撃や不正アクセスから保護します：

- すべての顧客に無償で提供される、設定不要のエンタープライズグレードDDoS保護
- カスタマイズ可能なWeb Application Firewall（WAF）
- IPベースのアクセス制御
- レートリミット機能
- リアルタイムの脅威検出と緩和

詳細は[Vercelファイアウォール](/docs/vercel-firewall)を参照してください。

### デプロイメント保護

デプロイメントは以下の方法で保護できます：

- [パスワード保護](/docs/security/deployment-protection/methods-to-protect-deployments/password-protection)
- [SSO保護](/docs/security/deployment-protection#advanced-deployment-protection)（Enterprise）
- [Vercel認証](/docs/security/deployment-protection/methods-to-protect-deployments/vercel-authentication)

## アクセス制御

- [ロールベースアクセス制御（RBAC）](/docs/rbac)
- [監査ログ](/docs/audit-log)
- [チーム管理](/docs/teams)

## セキュリティベストプラクティス

Vercelでアプリケーションをデプロイする際は、以下のベストプラクティスを実施してください：

1. [本番環境チェックリスト](/docs/production-checklist)を確認
2. 環境変数を適切に管理
3. デプロイメント保護を有効化
4. ファイアウォールルールを設定
5. 定期的にセキュリティログを確認

詳細なセキュリティ情報は[security.vercel.com](https://security.vercel.com/)をご覧ください。
