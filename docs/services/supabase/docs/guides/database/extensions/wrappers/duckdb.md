# DuckDB

[DuckDB](https://duckdb.org/)は、オープンソースの列指向リレーショナルデータベース管理システムです。

DuckDB Wrapperを使用すると、Postgresデータベース内からDuckDBのデータを読み取ることができます。

## 準備

DuckDBにクエリを実行する前に、Wrappers拡張機能を有効にし、Postgresに認証情報を保存する必要があります。

### Wrappersを有効にする

データベースに`wrappers`拡張機能がインストールされていることを確認してください:

```sql
create extension if not exists wrappers with schema extensions;
```

### DuckDB Wrapperを有効にする

`duckdb_wrapper` FDWを有効にします:

```sql
create foreign data wrapper duckdb_wrapper
handler duckdb_fdw_handler
validator duckdb_fdw_validator;
```

### 認証情報を保存する（オプション）

デフォルトでは、PostgresはFDWの認証情報を平文で保存します。セキュリティを強化するために[Vault](https://supabase.com/docs/guides/database/vault)を使用することをお勧めします。

AWS S3の認証情報については、シークレットを作成できます:

```sql
select vault.create_secret(
  '<access key id>',
  'aws_access_key_id',
  'AWS access key for Wrappers'
);
select vault.create_secret(
  '<secret access key>',
  'aws_secret_access_key',
  'AWS secret access key for Wrappers'
);
```

### DuckDBに接続する

`create server`コマンドを使用して、PostgresにDuckDB接続の認証情報を提供する必要があります。

#### AWS S3サーバーオプション

| サーバーオプション | 説明 | 必須 | デフォルト |
|--------------|-------------|----------|---------|
| type | サーバータイプ、`s3`である必要があります | Y | |
| key_id | 使用するキーのID | Y | |
| secret | 使用するキーのシークレット | Y | |
| region | 認証用のリージョン | | `us-east-1` |
| endpoint | カスタムS3エンドポイント | | `s3.amazonaws.com` |
| session_token | 一時認証情報トークン | | |
