# Snowflake

[Snowflake](https://www.snowflake.com/)は、クラウドベースのデータウェアハウジングプラットフォームです。

Snowflake Wrapperは、WebAssembly (Wasm) 外部データラッパーで、Postgresデータベース内からSnowflakeのデータを読み書きできます。

## 準備

SnowflakeラッパーをSupabaseプロジェクトで使用する前に、いくつかの準備ステップが必要です。

### Wrappersエクステンションの有効化

次のようにしてSupabaseダッシュボードでWrappersエクステンションを有効にします:

1. [Database](https://supabase.com/dashboard/project/_/database/tables)ページに移動します
2. サイドメニューで**Extensions**をクリックします
3. "wrappers"を検索し、エクステンションを有効にします

### 外部データラッパーの作成

これはSnowflakeラッパーの外部データラッパーを作成するSQLコマンドです:

```sql
create foreign data wrapper wasm_wrapper
  handler wasm_fdw_handler
  validator wasm_fdw_validator;
```

注意: Wasmは、Supabaseに接続されたVaultにシークレットを保存することをサポートしていません。次のステップでSnowflake接続情報を含めます。

### Snowflake APIキーの保護

デフォルトでは、Postgresはロールがアクセスできるテーブルから選択する際にロール権限を適用します。これにより、特定の外部テーブルへのアクセス権を持つPostgresユーザーは、基礎となる外部データラッパーが使用する資格情報を含むオプションを確認できます。

外部データラッパーから資格情報を保護するには、Supabaseに接続されたVaultに保存することをお勧めします。これらの資格情報は、Postgresの機密データを保護する拡張機能である[Supabase Vault](https://supabase.com/docs/guides/database/vault)を使用して保存および取得できます。

#### Supabase Vaultへの保存

```sql
-- Snowflake接続情報をVaultに保存し、そのuuidを変数として保存
insert into vault.secrets (name, secret)
values (
  'snowflake_conn',
  '{
    "account_identifier": "snowflake_account_identifier",
    "user": "snowflake_user",
    "public_key_fingerprint": "snowflake_public_key_fingerprint",
    "private_key": "snowflake_private_key"
  }'
)
returning key_id into conn_key_id;
```

注意: 'private_key'値は、改行を`\n`で置き換える必要があります。

### Snowflakeへの接続

次のコマンドでSnowflakeに接続するためのサーバーを作成します:

```sql
do $$
declare
  conn_key_id uuid;
begin
  -- Vaultから接続情報のkey_idを取得
  select id into conn_key_id from vault.secrets where name = 'snowflake_conn' limit 1;

  -- Wasmパッケージメタデータとsourceを指定してSnowflakeへの外部サーバーを作成
  execute format(
    E'create server snowflake_server \n'
    '  foreign data wrapper wasm_wrapper \n'
    '  options ( \n'
    '    fdw_package_url ''https://github.com/supabase/wrappers/releases/download/wasm_snowflake_fdw_v0.1.2/snowflake_fdw.wasm'', \n'
    '    fdw_package_name ''supabase:snowflake-fdw'', \n'
    '    fdw_package_version ''0.1.2'', \n'
    '    fdw_package_checksum ''a123b123c123d123'', \n'
    '    api_url ''https://your-account.snowflakecomputing.com'', \n'
    '    conn_string_id ''%s'' \n'
    '  ); \n',
    conn_key_id
  );
end $$;
```

注意: `fdw_package_*`オプションはWasm FDWラッパーに固有であり、通常の外部データラッパーでは存在しません。有効な値については、各ラッパーの[Wasmパッケージメタデータ](https://github.com/supabase/wrappers/blob/main/wasm-wrappers/fdw/snowflake_fdw/README.md)を参照してください。

一部のオプションはVaultから読み取られます:

- `conn_string_id` - 接続文字列を含むVaultシークレットオブジェクトのID

### 外部テーブルの作成

Snowflake外部テーブルは、Snowflakeデータベーステーブルに対するPostgresプロキシです。現在サポートされているSnowflakeデータ型と対応するPostgresデータ型を以下に示します:

| Snowflake Type | Postgres Type |
|----------------|---------------|
| NUMBER         | BIGINT        |
| DECIMAL        | NUMERIC       |
| NUMERIC        | NUMERIC       |
| INT            | BIGINT        |
| INTEGER        | BIGINT        |
| BIGINT         | BIGINT        |
| SMALLINT       | SMALLINT      |
| FLOAT          | DOUBLE PRECISION |
| DOUBLE         | DOUBLE PRECISION |
| VARCHAR        | TEXT          |
| CHAR           | TEXT          |
| CHARACTER      | TEXT          |
| STRING         | TEXT          |
| TEXT           | TEXT          |
| BINARY         | BYTEA         |
| VARBINARY      | BYTEA         |
| BOOLEAN        | BOOLEAN       |
| DATE           | DATE          |
| DATETIME       | TIMESTAMP     |
| TIME           | TIME          |
| TIMESTAMP      | TIMESTAMP     |
| TIMESTAMP_LTZ  | TIMESTAMPTZ   |
| TIMESTAMP_NTZ  | TIMESTAMP     |
| TIMESTAMP_TZ   | TIMESTAMPTZ   |
| VARIANT        | JSONB         |

Snowflake外部テーブルは、ローカルPostgresデータベースに専用のスキーマを作成することをお勧めします:

```sql
create schema snowflake;
```

Wasmラッパーを使用したSnowflake外部テーブルの作成は簡単です。

```sql
create foreign table snowflake.my_table (
  id bigint,
  name text,
  created_at timestamp
)
  server snowflake_server
  options (
    table 'my_schema.my_table',
    rowid_column 'id'
  );
```

外部テーブルオプション:

- `table` - Snowflake内のソーステーブル、この形式: `database.schema.table`または`schema.table`、**必須**。

注意: `rowid_column`オプションは、UPDATE/DELETEなどの書き込み操作に必要です。`rowid_column`値を明示的に指定していない場合、最初の列が使用されます。

### 外部テーブルのクエリ

Snowflake外部テーブルは、ローカルPostgresテーブルのように使用できます。クエリプッシュダウンをサポートしているため、select、where、order by、limitなどをサポートします。また、update、insert、deleteもサポートしています。以下に例を示します:

```sql
-- selectとwhereでクエリ
select * from snowflake.my_table where id = 123;

-- joinでクエリ
select t1.id, t1.name, t2.qty
from
  snowflake.my_table as t1
  left join local_table as t2
on t1.id = t2.ref_id
where
  t1.id = 123;

-- データの挿入
insert into snowflake.my_table(id, name)
values (456, 'Luke');

-- データの更新
update snowflake.my_table
set name = 'Leia'
where id = 456;

-- データの削除
delete from snowflake.my_table
where id = 456;
```

## サポートされている操作

以下の操作がSnowflakeラッパーでサポートされています:

| オブジェクト | Select | Insert | Update | Delete | Truncate |
|---------|--------|--------|--------|--------|----------|
| テーブル   | ✅      | ✅      | ✅      | ✅      | ❌        |

## 制限事項

このセクションでは、Snowflakeラッパーを使用する際の制限事項について説明します。

### リモートDMLのタイムアウトなし

リモートDML操作(insert、update、delete)はタイムアウトしません。この制限は、将来のリリースで対処される予定です。

### Materialized Viewバックアップ

現在、Wasmベースの外部データラッパーを含むMaterialized Viewのバックアップには問題があることが知られています。これは、バックアップ時にMaterialized Viewのビュー定義がプレーンテキストとしてエクスポートされるのに対し、バイナリ形式のWasm FDW依存関係はエクスポートされないためです。その後、復元プロセスがMaterialized Viewの再作成に失敗します。

