# Auth0

[Auth0](https://auth0.com/) は、アプリケーションに認証および認可サービスを追加するための柔軟なドロップインソリューションです。

Auth0 Wrapperを使用すると、Postgresデータベース内で使用するためにAuth0テナントからデータを読み取ることができます。

## 準備

Auth0をクエリする前に、Wrappers拡張機能を有効にし、認証情報をPostgresに保存する必要があります。

### Wrappersを有効にする

データベースに `wrappers` 拡張機能がインストールされていることを確認してください：

```sql
create extension if not exists wrappers with schema extensions;
```

### Auth0 Wrapperを有効にする

`auth0_wrapper` FDWを有効にします：

```sql
create foreign data wrapper auth0_wrapper
 handler auth0_fdw_handler
 validator auth0_fdw_validator;
```

### 認証情報を保存する（オプション）

デフォルトでは、PostgresはFDWの認証情報を `pg_catalog.pg_foreign_server` にプレーンテキストで保存します。このテーブルにアクセスできる人は誰でもこれらの認証情報を表示できます。Wrappersは、認証情報を保存するための追加のセキュリティレベルを提供する [Vault](https://supabase.com/docs/guides/database/vault) と連携するように設計されています。

```sql
-- Auth0 APIキーをVaultに保存し、作成された `key_id` を取得します
select vault.create_secret(
 '<Auth0 API Key or PAT>', -- Auth0 APIキーまたはPersonal Access Token (PAT)
 'auth0',
 'Auth0 API key for Wrappers'
);
```

### Auth0に接続する

Auth0に接続するための認証情報と追加オプションをPostgresに提供する必要があります。これは `create server` コマンドを使用して行えます：

Vaultを使用する場合：
```sql
create server auth0_server
 foreign data wrapper auth0_wrapper
 options (
 url 'https://dev-<tenant-id>.us.auth0.com/api/v2/users',
 api_key_id '<key_ID>' -- 上記のKey ID
 );
```

### スキーマを作成する

スキーマの作成を推奨します。
