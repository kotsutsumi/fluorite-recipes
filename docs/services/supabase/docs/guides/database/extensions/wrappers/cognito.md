# AWS Cognito

Supabaseダッシュボードから直接AWS Cognito Wrapperを有効にできます。

[ダッシュボードでwrapperを開く](https://supabase.com/dashboard/project/_/integrations/cognito_wrapper/overview)

[AWS Cognito](https://docs.aws.amazon.com/cognito/latest/developerguide/what-is-amazon-cognito.html) は、Webおよびモバイルアプリ向けのIDプラットフォームです。

Cognito Wrapperを使用すると、Postgresデータベース内でCognito Userpoolからデータを読み取ることができます。

## 準備

AWS Cognitoをクエリする前に、Wrappers拡張機能を有効にし、認証情報をPostgresに保存する必要があります。

### Wrappersを有効にする

データベースに `wrappers` 拡張機能がインストールされていることを確認してください：

```sql
create extension if not exists wrappers with schema extensions;
```

### Cognito Wrapperを有効にする

`cognito_wrapper` FDWを有効にします：

```sql
create foreign data wrapper cognito_wrapper
 handler cognito_fdw_handler
 validator cognito_fdw_validator;
```

### 認証情報を保存する（オプション）

デフォルトでは、PostgresはFDWの認証情報を `pg_catalog.pg_foreign_server` にプレーンテキストで保存します。このテーブルにアクセスできる人は誰でもこれらの認証情報を表示できます。Wrappersは、認証情報を保存するための追加のセキュリティレベルを提供する [Vault](https://supabase.com/docs/guides/database/vault) と連携するように設計されています。Vaultを使用して認証情報を保存することを推奨します。

```sql
-- CognitoシークレットアクセスキーをVaultに保存し、作成された `key_id` を取得します
select vault.create_secret(
 '<secret access key>',
 'cognito',
 'Cognito secret key for Wrappers'
);
```

### Cognitoに接続する

Cognitoに接続するための認証情報と追加オプションをPostgresに提供する必要があります。これは `create server` コマンドを使用して行えます：

Vaultを使用する場合：
```sql
create server cognito_server
 foreign data wrapper cognito_wrapper
```
