# Airtable

[Airtable](https://www.airtable.com) は、リレーショナルデータベースを作成および共有するための使いやすいオンラインプラットフォームです。

Airtable Wrapperを使用すると、Postgresデータベース内でAirtableのベース/テーブルからデータを読み取ることができます。

## 準備

Airtableをクエリする前に、Wrappers拡張機能を有効にし、認証情報をPostgresに保存する必要があります。

### Wrappersを有効にする

データベースに `wrappers` 拡張機能がインストールされていることを確認してください：

```sql
create extension if not exists wrappers with schema extensions;
```

### Airtable Wrapperを有効にする

`airtable_wrapper` FDWを有効にします：

```sql
create foreign data wrapper airtable_wrapper
  handler airtable_fdw_handler
  validator airtable_fdw_validator;
```

### 認証情報を保存する（オプション）

デフォルトでは、PostgresはFDWの認証情報を `pg_catalog.pg_foreign_server` にプレーンテキストで保存します。このテーブルにアクセスできる人は誰でもこれらの認証情報を表示できます。Wrappersは、認証情報を保存するための追加のセキュリティレベルを提供する [Vault](https://supabase.com/docs/guides/database/vault) と連携するように設計されています。Vaultを使用して認証情報を保存することを推奨します。

[Airtableの開発者ポータル](https://airtable.com/create/tokens)からトークンを取得してください。

```sql
select vault.create_secret(
  '<Airtable API Key or PAT>', -- Airtable APIキーまたはPersonal Access Token (PAT)
  'airtable',
  'Airtable API key for Wrappers'
);
```

### Airtableに接続する

Airtableに接続するための認証情報と追加オプションをPostgresに提供する必要があります。これは `create server` コマンドを使用して行えます：

Vaultを使用する場合：
```sql
create server airtable_server
  foreign data wrapper airtable_wrapper
  options (
    api_key_id '<key_ID>' -- 上記のKey ID
  );
```
