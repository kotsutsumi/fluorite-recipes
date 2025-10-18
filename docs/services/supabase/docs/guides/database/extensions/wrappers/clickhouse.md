# ClickHouse Wrapper ドキュメント

## 概要

[ClickHouse](https://clickhouse.com/)は、「SQLクエリを使用してリアルタイムで分析データレポートを生成できる、高速なオープンソースの列指向データベース管理システム」です。

ClickHouse Wrapperを使用すると、Postgresデータベース内からClickHouseのデータを読み書きできます。

## 準備

### Wrappersの有効化

Wrappers拡張機能をインストールします:

```sql
create extension if not exists wrappers with schema extensions;
```

### ClickHouse Wrapperの有効化

```sql
create foreign data wrapper clickhouse_wrapper
  handler click_house_fdw_handler
  validator click_house_fdw_validator;
```

### 認証情報の保存（オプション）

セキュアな認証情報の保存にはVaultの使用を推奨します:

```sql
select vault.create_secret(
  'tcp://default:@localhost:9000/default',
  'clickhouse',
  'ClickHouse credential for Wrappers'
);
```

### ClickHouseへの接続

接続詳細を使用してサーバーを作成します:

```sql
create server clickhouse_server
  foreign data wrapper clickhouse_wrapper
  options (
    conn_string_id '<key_ID>'
  );
```

#### Vaultを使用する場合

```sql
create server clickhouse_server
  foreign data wrapper clickhouse_wrapper
  options (
    conn_string_id 'clickhouse'
  );
```

#### 接続文字列を直接使用する場合

```sql
create server clickhouse_server
  foreign data wrapper clickhouse_wrapper
  options (
    conn_string 'tcp://default:@localhost:9000/default'
  );
```

#### 接続文字列の例

- 基本: `tcp://user:password@host:9000/clicks?compression=lz4&ping_timeout=42ms`
- ClickHouse Cloud: `tcp://default:PASSWORD@abc.eu-west-1.aws.clickhouse.cloud:9440/default?connection_timeout=30s&ping_before_query=false&secure=true`

**注意**: ネイティブプロトコルポート9000および9440のみをサポートしています。

### スキーマの作成

```sql
create schema if not exists clickhouse;
```

## オプション

### 外部テーブルオプション

- `table`: ClickHouseのソーステーブル名（必須）
- `rowid_column`: 主キー列名（スキャンにはオプション、変更操作には必須）

### パラメータ化されたビュー

サブクエリ内のパラメータ列を使用したパラメータ化されたビューをサポートしています。

#### 例

```sql
create foreign table clickhouse.my_param_view (
  id bigint,
  name text
)
  server clickhouse_server
  options (
    table '(SELECT id, name FROM my_table WHERE id = {id:UInt64})'
  );

select * from clickhouse.my_param_view where id = 123;
```

## サポートされている操作

| 操作 | テーブル |
|-----|--------|
| Select | ✅ |
| Insert | ✅ |
| Update | ✅ |
| Delete | ✅ |
| Truncate | ❌ |

## サポートされているデータ型

| Postgres型 | ClickHouse型 |
|-----------|-------------|
| boolean | Bool |
| smallint | Int16 |
| integer | Int32 |
| bigint | Int64 |
| real | Float32 |
| double precision | Float64 |
| text | String |
| varchar | String |
| date | Date |
| timestamp | DateTime |

## 使用例

### 基本的なテーブルの読み取り

ClickHouseテーブルからデータを読み取る外部テーブルを作成します:

```sql
create foreign table clickhouse.my_table (
  id bigint,
  name text,
  created_at timestamp
)
  server clickhouse_server
  options (
    table 'my_table'
  );
```

クエリを実行します:

```sql
select * from clickhouse.my_table;
```

### データの挿入

ClickHouseテーブルにデータを挿入します:

```sql
insert into clickhouse.my_table (id, name, created_at)
values (1, 'test', now());
```

### データの更新

ClickHouseテーブルのデータを更新します:

```sql
-- rowid_columnオプションが必要
create foreign table clickhouse.my_table (
  id bigint,
  name text,
  created_at timestamp
)
  server clickhouse_server
  options (
    table 'my_table',
    rowid_column 'id'
  );

update clickhouse.my_table
set name = 'updated'
where id = 1;
```

### データの削除

ClickHouseテーブルからデータを削除します:

```sql
-- rowid_columnオプションが必要
delete from clickhouse.my_table
where id = 1;
```

### 集約クエリ

ClickHouseの高速な集約機能を活用します:

```sql
select
  date_trunc('day', created_at) as day,
  count(*) as total
from clickhouse.events
group by day
order by day desc;
```

### ClickHouse固有の関数を使用

```sql
create foreign table clickhouse.analytics (
  event_date date,
  user_id bigint,
  event_type text,
  count bigint
)
  server clickhouse_server
  options (
    table '(
      SELECT
        toDate(timestamp) as event_date,
        user_id,
        event_type,
        count(*) as count
      FROM events
      GROUP BY event_date, user_id, event_type
    )'
  );

select * from clickhouse.analytics where event_date = current_date;
```

### パラメータ化されたビューの使用

特定のユーザーのデータのみを取得するパラメータ化されたビュー:

```sql
create foreign table clickhouse.user_events (
  id bigint,
  user_id bigint,
  event_type text,
  timestamp timestamp
)
  server clickhouse_server
  options (
    table '(
      SELECT id, user_id, event_type, timestamp
      FROM events
      WHERE user_id = {user_id:UInt64}
    )'
  );

select * from clickhouse.user_events where user_id = 12345;
```

## クエリのプッシュダウン

ClickHouse Wrapperは、以下のPostgreSQLの節をリモートClickHouseにプッシュダウンすることで、パフォーマンスを向上させます:

- `WHERE`
- `SELECT`
- `ORDER BY`
- `LIMIT`
- `GROUP BY`
- 集約関数（`COUNT`、`SUM`、`AVG`、`MIN`、`MAX`など）

## 制限事項

- ネイティブプロトコル（ポート9000/9440）のみサポート。HTTPプロトコルは未サポート
- TRUNCATEはサポートされていません
- 一部の複雑なデータ型（Array、Tuple、Nested）は制限があります
- トランザクションサポートは限定的です

## パフォーマンスの最適化

### 1. WHERE句の使用

データ転送を最小限に抑えるため、WHERE句を使用してフィルタリングします:

```sql
select * from clickhouse.large_table
where created_at >= current_date - interval '7 days';
```

### 2. 必要な列のみを選択

SELECT句で必要な列のみを指定します:

```sql
select id, name from clickhouse.large_table;
```

### 3. パラメータ化されたビューの活用

頻繁に使用するフィルタ条件は、パラメータ化されたビューとして定義します。

### 4. 適切なインデックス

ClickHouse側でソートキーとパーティションキーを適切に設定します。

## トラブルシューティング

### 接続エラー

エラー: `Connection failed`

- 接続文字列が正しいことを確認してください
- ClickHouseサーバーが起動していることを確認してください
- ポート9000または9440が開いていることを確認してください
- ファイアウォール設定を確認してください

### 認証エラー

エラー: `Authentication failed`

- ユーザー名とパスワードが正しいことを確認してください
- ClickHouseユーザーに適切な権限があることを確認してください

### データ型エラー

エラー: `Type mismatch`

外部テーブルで定義されたカラムのデータ型が、ClickHouseテーブルのデータ型と互換性があることを確認してください。

### ポートエラー

エラー: `Unsupported protocol`

HTTPポート（8123）ではなく、ネイティブプロトコルポート（9000または9440）を使用していることを確認してください。

## ベストプラクティス

1. **Vaultを使用する**: 接続文字列はVaultに保存することを推奨します
2. **適切なインデックス**: `rowid_column`を主キーに設定します
3. **WHERE句の活用**: データ転送を最小限に抑えます
4. **パラメータ化されたビュー**: 頻繁に使用するクエリパターンに活用します
5. **バッチ処理**: 大量のデータを挿入する場合は、バッチで処理します
6. **ClickHouseの最適化**: ソートキーとパーティションキーを適切に設定します
7. **圧縮の使用**: 接続文字列で圧縮を有効にします（`compression=lz4`）

## セキュリティ考慮事項

- 接続文字列にはパスワードが含まれるため、Vaultの使用を強く推奨します
- ClickHouse Cloudを使用する場合は、`secure=true`を設定します
- 最小権限の原則に従い、必要な権限のみを付与します

## 関連リンク

- [ClickHouse公式ドキュメント](https://clickhouse.com/docs)
- [ClickHouse接続文字列](https://clickhouse.com/docs/en/interfaces/tcp)
- [Supabase Wrappers](https://supabase.github.io/wrappers/)
- [ClickHouse Cloud](https://clickhouse.cloud/)
