# Auth（認証）

## 概要

Supabase Authを使用すると、アプリケーションに認証と認可を簡単に実装できます。ユーザーの作成と管理を支援するクライアントSDKとAPIエンドポイントを提供します。

ユーザーは以下のような様々な認証方法を利用できます:

- パスワード
- マジックリンク
- ワンタイムパスワード（OTP）
- ソーシャルログイン
- シングルサインオン（SSO）

## 認証と認可について

認証と認可は、あらゆる認証システムの中核的な責務です:

- **認証（Authentication）**: ユーザーの身元を確認すること
- **認可（Authorization）**: ユーザーがアクセスできるリソースを確認すること

Supabase Authは認証に[JSON Web Tokens（JWT）](/docs/guides/auth/jwts)を使用し、認可には[行レベルセキュリティ（RLS）](/docs/guides/database/postgres/row-level-security)と統合されています。

## Supabaseエコシステム

Supabase Authは、スタンドアロン製品として使用することも、Supabaseエコシステムと統合することもできます。Supabase Authは:

- プロジェクトのPostgresデータベースを使用してユーザーデータを保存
- 自動生成されるREST APIのアクセス制御を有効化
- AuthトークンとRLSポリシーを使用してデータベースアクセスをスコープ化

## プロバイダー

### ソーシャル認証プロバイダー

サポートされているソーシャルログインプロバイダーには以下が含まれます:

- Apple
- Azure（Microsoft）
- Bitbucket
- Discord
- Facebook
- Figma
- GitHub
- GitLab
- Google
- Kakao
- Keycloak
- LinkedIn
- Notion
- Slack
- Spotify
- Twitter
- Twitch
- WorkOS
- Zoom

### 電話認証プロバイダー

- MessageBird
- Twilio
- Vonage

## 料金体系

以下の項目に料金が適用されます:

- 月間アクティブユーザー（MAU）
- 月間アクティブサードパーティユーザー
- 月間アクティブSSOユーザー
- 高度なMFAアドオン

詳細な料金情報は[Supabaseドキュメント](/docs/guides/platform/manage-your-usage)で確認できます。
