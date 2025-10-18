# Iceberg

[Apache Iceberg](https://iceberg.apache.org/)は、大規模な分析テーブル向けの高性能なオープンソースフォーマットです。Iceberg Wrapperを使用すると、PostgresデータベースからApache Icebergのデータを読み取ることができます。

## 準備

Icebergにクエリを実行する前に、Wrappers拡張機能を有効にし、Postgresに認証情報を保存する必要があります。

### Wrappersを有効にする

データベースに`wrappers`拡張機能がインストールされていることを確認してください:

```sql
create extension if not exists wrappers with schema extensions;
```

### Iceberg Wrapperを有効にする

`iceberg_wrapper` FDWを有効にします:

```sql
create foreign data wrapper iceberg_wrapper
handler iceberg_fdw_handler
validator iceberg_fdw_validator;
```

### 認証情報を保存する（オプション）

デフォルトでは、Postgresは`pg_catalog.pg_foreign_server`にFDWの認証情報を平文で保存します。セキュリティを強化するために[Vault](https://supabase.com/docs/guides/database/vault)を使用することをお勧めします:

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

### Icebergに接続する

`create server`コマンドを使用して接続できます。Vaultに保存されたオプションには、`vault_`プレフィックスを使用します。

#### AWS S3テーブルへの接続

Vaultを使用する場合:
```sql
create server iceberg_server
foreign data wrapper iceberg_wrapper
options (
  vault_aws_access_key_id '<key_ID>',
  vault_aws_secret_access_key '<secret_key>',
  region_name 'us-east-1',
  aws_s3table_bucket_arn 'arn:aws:s3tables:us-east-1:204203087419:bucket/my-table-bucket'
);
```

Vaultを使用しない場合:
```sql
create server iceberg_server
foreign data wrapper iceberg_wrapper
options (
  aws_access_key_id '<access_key_id>',
  aws_secret_access_key '<secret_access_key>',
  region_name 'us-east-1',
  aws_s3table_bucket_arn 'arn:aws:s3tables:us-east-1:204203087419:bucket/my-table-bucket'
);
```

### スキーマを作成する

```sql
create schema if not exists iceberg;
```

## サーバーオプション

| オプション | 説明 | 必須 |
|----------|------|------|
| aws_access_key_id | AWSアクセスキーID | はい |
| aws_secret_access_key | AWSシークレットアクセスキー | はい |
| region_name | AWSリージョン名 | はい |
| aws_s3table_bucket_arn | S3テーブルバケットのARN | はい |

## 外部テーブルの作成

```sql
create foreign table iceberg.my_table (
  column1 text,
  column2 bigint,
  column3 timestamp
) server iceberg_server
options (
  table_name 'my_iceberg_table'
);
```

## クエリ

作成した外部テーブルに対してSQLクエリを実行できます:

```sql
select * from iceberg.my_table;
select column1, count(*) from iceberg.my_table group by column1;
```

## 制限事項

- 読み取り専用のアクセスのみサポート
- Apache Icebergフォーマットで保存されたテーブルにのみアクセス可能
