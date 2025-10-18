# SAML 2.0によるシングルサインオン

## 前提条件

- Supabase CLI（バージョン v1.46.4以降）
- SAML 2.0サポートはデフォルトで無効化されています
- Proプラン以上で利用可能

## サポートされているIDプロバイダー

- Google Workspaces
- Okta、Auth0
- Microsoft Active Directory/Azure AD
- PingIdentity
- OneLogin

## 重要な用語

### IDプロバイダー（Identity Provider - IdP）
ユーザーアカウントを管理するサービス。

### サービスプロバイダー（Service Provider - SP）
ユーザー情報をリクエストするソフトウェア。Supabaseはこの役割を果たします。

### アサーション（Assertion）
IDプロバイダーからのユーザーに関する声明。

### EntityID
グローバルに一意な識別子。

### NameID
ユーザーを一意に識別する識別子。

### メタデータ（Metadata）
プロバイダー設定を記述するXMLドキュメント。

### 証明書（Certificate）
アサーション署名の検証に使用されます。

### ACS URL（Assertion Consumer Service URL）
SupabaseがIDプロバイダーのアサーションを受け入れる場所。

## 概要

SAML 2.0（Security Assertion Markup Language 2.0）は、IDプロバイダーとサービスプロバイダー間でユーザー認証および認可データを交換するためのオープンスタンダードです。

Supabase Authは、エンタープライズ環境でのシングルサインオン（SSO）実装を可能にするSAML 2.0をサポートしています。これにより、組織は既存のIDプロバイダーを使用してユーザーを認証できます。

## SAML 2.0 SSOの設定

### Supabase CLIを使用した設定

Supabase CLI（v1.46.4以降）を使用して、SAML 2.0 SSOを設定できます。

```bash
# SAML 2.0プロバイダーを有効化
supabase sso add

# SAML 2.0プロバイダーの一覧表示
supabase sso list

# SAML 2.0プロバイダーの削除
supabase sso remove
```

### 属性マッピング

SAML 2.0アサーションから受け取った属性をSupabaseのユーザープロファイルにマッピングできます。一般的な属性には以下が含まれます：

- `email`: ユーザーのメールアドレス
- `name`: ユーザーのフルネーム
- `first_name`: ユーザーの名
- `last_name`: ユーザーの姓

### 統合に関する考慮事項

1. **セキュリティ**: SAML証明書が安全に保管され、定期的に更新されることを確認してください。

2. **ユーザー管理**: IDプロバイダーでのユーザーの作成、更新、削除がSupabaseでどのように処理されるかを理解してください。

3. **テスト**: 本番環境にデプロイする前に、SAML統合を徹底的にテストしてください。

4. **モニタリング**: SAML認証の失敗やエラーを監視し、問題を迅速に特定して解決できるようにしてください。

## まとめ

SAML 2.0を使用したシングルサインオンは、Supabaseアプリケーションにエンタープライズグレードの認証を実装するための強力な方法を提供します。既存のIDプロバイダーと統合することで、セキュリティを向上させ、ユーザーエクスペリエンスを向上させることができます。
