# アクセス制御

デプロイメントは、[パスワード保護](/docs/security/deployment-protection/methods-to-protect-deployments/password-protection)と[SSO保護](/docs/security/deployment-protection#advanced-deployment-protection)で保護できます。パスワード保護はProおよびEnterprise プランのTeamsで利用可能で、SSO保護はEnterprise プランのTeamsのみで利用可能です。両方の方法で[プレビュー](/docs/deployments/environments#preview-environment-pre-production)および[本番](/docs/deployments/environments#production-environment)デプロイメントを保護できます。

## パスワード保護

パスワード保護はプレビューおよび本番デプロイメントに適用されます。この機能はTeamsプロジェクトダッシュボードから有効化できます。詳細は[ドキュメントを参照](/docs/security/deployment-protection/methods-to-protect-deployments/password-protection)してください。

## Vercelの認証

Vercel認証保護はプレビューおよび本番デプロイメントに適用されます。有効化すると、Teamのメンバーである個人アカウントのユーザーは、ログイン資格情報を使用してデプロイメントにアクセスできます。この機能はTeamsプロジェクトダッシュボードから有効化できます。

パスワード保護とVercel認証は同時に有効化できます。その場合、デプロイメントにアクセスしようとする人は、どちらかの方法を選択してアクセスできます。

詳細は[ドキュメントを参照](/docs/security/deployment-protection/methods-to-protect-deployments/vercel-authentication)してください。

## SSO保護（Enterprise）

Enterprise プランでは、SAML/OIDC ベースのシングルサインオン（SSO）による保護も利用できます。これにより、組織の既存の認証システムとの統合が可能になります。

詳細は[Advanced Deployment Protection](/docs/security/deployment-protection#advanced-deployment-protection)のドキュメントを参照してください。
