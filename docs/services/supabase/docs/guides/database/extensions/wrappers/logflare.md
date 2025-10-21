# Logflare Wrapper

## 概要

「Logflareは、Cloudflare、Vercel、Elixirのログに簡単にアクセスできる、Webベースの集中ログ管理ソリューションです。」Logflare Wrapperを使用すると、Postgresデータベース内からLogflareエンドポイントのデータを読み取ることができます。

## 準備

### Wrappersを有効にする

```sql
create extension if not exists wrappers with schema extensions;
```

### Logflare Wrapperを有効にする

```sql
create foreign data wrapper logflare_wrapper
 handler logflare_fdw_handler
 validator logflare_fdw_validator;
```

### 認証情報を保存する（オプション）

安全な認証情報の保存にはVaultの使用を推奨します:

```sql
select vault.create_secret(
 '<YOUR_SECRET>',
 'logflare',
 'Logflare API key for Wrappers'
);
```

### Logflareに接続する

Vaultを使用する場合:

```sql
create server logflare_server
 foreign data wrapper logflare_wrapper
 options (
 api_key_id '<key_ID>' -- 上記で取得したキーID
 );
```

Vaultを使用しない場合:

```sql
create server logflare_server
 foreign data wrapper logflare_wrapper
 options (
 api_key '<YOUR_API_KEY>'
 );
```

### スキーマを作成する

```sql
create schema if not exists logflare;
```

## オプション

- `endpoint`: LogflareエンドポイントのUUIDまたは名前（必須）

## エンティティ

### Logflareエンティティ操作

| 操作 | サポート |
|-----------|-----------|
| Select    | ✅        |
| Insert    | ❌        |
| Update    | ❌        |
| Delete    | ❌        |
| Truncate  | ❌        |

### 使用例

```sql
create foreign table logflare.my_logflare_table (
  id bigint,
  name text,
  _result text)
server logflare_server
options (
  endpoint '9dd9a6f6-8e9b-4fa4-b682-4f2f5cd99da3'
);
```

## クエリ

作成した外部テーブルに対してSQLクエリを実行できます:

```sql
select * from logflare.my_logflare_table;
```

JSONデータから特定のフィールドを抽出する:

```sql
select
  id,
  name,
  _result::json->>'field_name' as field_value
from logflare.my_logflare_table;
```

## 注意事項

- `_result`カラムには完全なレコードがJSON文字列として保存されます
- JSONクエリを使用して特定のフィールドを抽出してください
- パラメータカラムには`_param`プレフィックスを付ける必要があります

## 制限事項

- 読み取り専用のアクセスのみサポート
- Insert、Update、Delete、Truncate操作は利用不可
