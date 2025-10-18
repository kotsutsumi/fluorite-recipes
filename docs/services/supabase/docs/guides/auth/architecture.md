# Auth アーキテクチャ

Supabase Authの背後にあるアーキテクチャについて説明します。

## 概要

Supabase Authには4つの主要なレイヤーがあります:

1. [クライアントレイヤー](#クライアントレイヤー): SupabaseクライアントSDKまたはカスタムHTTPリクエスト
2. Kong APIゲートウェイ（Supabase製品間で共有）
3. [Authサービス](#authサービス)（旧GoTrue）
4. [Postgresデータベース](#postgres)（Supabase製品間で共有）

## クライアントレイヤー

クライアントレイヤーは、アプリケーション内で実行されます。アプリケーションは以下のいずれかです:

- フロントエンドのブラウザコード
- バックエンドのサーバーコード
- ネイティブアプリケーション

クライアントレイヤーは、サインインとユーザー管理のための関数を提供します。推奨される機能には以下が含まれます:

- AuthバックエンドへのHTTP呼び出しの設定と認証
- Authトークンの永続化と更新の管理
- 他のSupabase製品との統合

### サポートされているクライアントSDK

- [JavaScript](/docs/reference/javascript/introduction)
- [Flutter](/docs/reference/dart/introduction)
- [Swift](/docs/reference/swift/introduction)
- [Python](/docs/reference/python/introduction)
- [C#](/docs/reference/csharp/introduction)
- [Kotlin](/docs/reference/kotlin/introduction)

## Authサービス

[Authサービス](https://github.com/supabase/auth)は、Supabaseが管理するAuth APIサーバーで、GoTrue（元々はNetlifyによって開発）からフォークされたものです。

新しいSupabaseプロジェクトをデプロイすると、このサービスは:

- データベースと一緒にデプロイされます
- 必要なAuthスキーマを注入します

主な責務には以下が含まれます:

- JWTの検証、発行、更新
- アプリとAuthデータベース情報の仲介者
- ソーシャルログインとSSOのための外部プロバイダーとの通信

## Postgres

Supabase AuthはPostgresの`auth`スキーマを使用して、ユーザーテーブルと情報を保存します。このスキーマは自動生成されるAPIでは公開されません。

### Auth情報の接続

Auth情報をオブジェクトに接続するには、以下を使用できます:

- [データベーストリガー](/docs/guides/database/postgres/triggers)
- [外部キー](https://www.postgresql.org/docs/current/tutorial-fk.html)

### セキュリティに関する考慮事項

> Authデータ用に作成するビューは、適切に保護されていることを確認してください
