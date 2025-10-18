# MSSQL

[Microsoft SQL Server](https://www.microsoft.com/en-au/sql-server/)は、Microsoftが開発したプロプライエタリなリレーショナルデータベース管理システムです。

SQL Server Wrapperを使用すると、PostgresデータベースからMicrosoft SQL Serverのデータを読み取ることができます。

## 準備

SQL Serverにクエリを実行する前に、Wrappers拡張を有効にし、認証情報をPostgresに保存する必要があります。

### Wrappersを有効化

データベースに`wrappers`拡張がインストールされていることを確認してください:

```sql
create extension if not exists wrappers with schema extensions;
```

### SQL Server Wrapperを有効化

`mssql_wrapper` FDWを有効にします:

```sql
create foreign data wrapper mssql_wrapper
  handler mssql_fdw_handler
  validator mssql_fdw_validator;
```

### 認証情報を保存（オプション）

デフォルトでは、PostgresはFDWの認証情報を平文で保存します。セキュリティを強化するために[Vault](https://supabase.com/docs/guides/database/vault)の使用を推奨します:

```sql
select vault.create_secret(
  'Server=localhost,1433;User=sa;Password=my_password;Database=master;IntegratedSecurity=false;TrustServerCertificate=true;encrypt=DANGER_PLAINTEXT;ApplicationName=wrappers',
  'mssql',
  'MS SQL Server connection string for Wrappers'
);
```

#### サポートされている接続文字列パラメータ

| パラメータ | 使用可能な値 | 説明 |
|-----------|----------------|-------------|
| Server | `<string>` | SQL Serverインスタンスのホストとポート |
| User | `<string>` | SQL Serverログインアカウント |
| Password | `<string>` | アカウントパスワード |
| Database | `<string>` | データベース名 |
| IntegratedSecurity | false | 認証タイプ |
| TrustServerCertificate | true, false | サーバー証明書を信頼 |
| Encrypt | true, false, DANGER_PLAINTEXT | 暗号化方式 |
| ApplicationName | `<string>` | 接続アプリケーション名 |

### SQL Serverへの接続

サーバーオブジェクトを作成し、Vaultに保存された認証情報を使用します:

```sql
create server mssql_server
foreign data wrapper mssql_wrapper
options (
  conn_string_id '<key_ID>' -- 上記で作成したKey ID
);
```

### スキーマの作成

外部テーブルを整理するためのスキーマを作成することを推奨します:

```sql
create schema if not exists mssql;
```

## 使用方法

### 外部テーブルの作成

SQL Server Wrapperは、外部テーブルを使用してSQL Serverデータをマッピングします:

```sql
create foreign table mssql.users (
  id bigint,
  name text,
  email text
)
server mssql_server
options (
  table 'dbo.users'
);
```

### クエリの実行

外部テーブルが作成されると、通常のPostgresテーブルと同様にクエリを実行できます:

```sql
select * from mssql.users;
```

## オプション

### 外部テーブルオプション

外部テーブル作成時に使用できるオプション:

| オプション | 説明 | デフォルト |
|----------|------|----------|
| table | SQL Serverのテーブル名（スキーマ付き） | 必須 |
| row_limit | 取得する最大行数 | なし |

### 外部サーバーオプション

サーバー作成時に使用できるオプション:

| オプション | 説明 | デフォルト |
|----------|------|----------|
| conn_string_id | Vaultに保存された接続文字列のKey ID | 必須 |

## 制限事項

- 読み取り専用アクセス（SELECT操作のみ）
- トランザクションサポートなし
- 大きなテーブルの場合、パフォーマンスが制限される可能性があります

## 例

### 基本的なクエリ

```sql
-- SQL Serverからデータを取得
select id, name, email
from mssql.users
where id > 100;
```

### JOINクエリ

```sql
-- ローカルテーブルと外部テーブルをJOIN
select
  u.name,
  o.order_date,
  o.total
from local_schema.orders o
join mssql.users u on u.id = o.user_id;
```

### 集計クエリ

```sql
-- SQL Serverデータの集計
select
  count(*) as total_users,
  count(distinct email) as unique_emails
from mssql.users;
```
