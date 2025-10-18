# BigQuery Wrapper ドキュメント

## 概要

[BigQuery](https://cloud.google.com/bigquery)は、「クラウド全体で動作し、データに合わせてスケールする、完全にサーバーレスでコスト効率の高いエンタープライズデータウェアハウス」です。BigQuery Wrapperを使用すると、Postgresデータベース内からBigQueryのデータを読み書きできます。

## 準備

### Wrappersの有効化

Wrappers拡張機能をインストールします:

```sql
create extension if not exists wrappers with schema extensions;
```

### BigQuery Wrapperの有効化

```sql
create foreign data wrapper bigquery_wrapper
  handler big_query_fdw_handler
  validator big_query_fdw_validator;
```

### 認証情報の保存（オプション）

セキュアな認証情報の保存にはVaultの使用を推奨します:

```sql
select vault.create_secret(
  '{
    "type": "service_account",
    "project_id": "your_gcp_project_id",
    ...
  }',
  'bigquery',
  'BigQuery service account json for Wrappers'
);
```

### BigQueryへの接続

認証情報を使用してサーバーを作成します:

```sql
create server bigquery_server
  foreign data wrapper bigquery_wrapper
  options (
    sa_key_id '<key_ID>',
    project_id 'your_gcp_project_id',
    dataset_id 'your_gcp_dataset_id'
  );
```

#### Vaultを使用する場合

```sql
create server bigquery_server
  foreign data wrapper bigquery_wrapper
  options (
    sa_key_id 'bigquery',
    project_id 'your_gcp_project_id',
    dataset_id 'your_gcp_dataset_id'
  );
```

#### サービスアカウントキーを直接使用する場合

```sql
create server bigquery_server
  foreign data wrapper bigquery_wrapper
  options (
    sa_key '
    {
      "type": "service_account",
      "project_id": "your_gcp_project_id",
      ...
    }
    ',
    project_id 'your_gcp_project_id',
    dataset_id 'your_gcp_dataset_id'
  );
```

### スキーマの作成

```sql
create schema if not exists bigquery;
```

## オプション

BigQuery外部テーブルを作成する際に利用可能なオプション:

- `table`: ソーステーブル/ビュー名（必須）
- `location`: ソーステーブルの場所（デフォルト: 'US'）
- `timeout`: クエリリクエストのタイムアウト（ミリ秒、デフォルト: 30000）
- `rowid_column`: 主キー列名（変更操作に必須）

## サポートされている操作

| オブジェクト | Select | Insert | Update | Delete | Truncate |
|------------|--------|--------|--------|--------|----------|
| テーブル | ✅ | ✅ | ✅ | ✅ | ❌ |

## 制限事項

- 大きな結果セットの場合、ネットワークレイテンシが発生する可能性があります
- ストリーミングバッファ内のデータは読み取れません（BigQueryの制限）
- パラメータ化されたクエリはサポートされていません
- トランザクションはサポートされていません

## 使用例

### 基本的なテーブルの読み取り

BigQueryテーブルからデータを読み取る外部テーブルを作成します:

```sql
create foreign table bigquery.my_table (
  id bigint,
  name text,
  created_at timestamp
)
  server bigquery_server
  options (
    table 'my_table'
  );
```

クエリを実行します:

```sql
select * from bigquery.my_table;
```

### データの挿入

BigQueryテーブルにデータを挿入します:

```sql
insert into bigquery.my_table (id, name, created_at)
values (1, 'test', now());
```

### データの更新

BigQueryテーブルのデータを更新します:

```sql
-- rowid_columnオプションが必要
create foreign table bigquery.my_table (
  id bigint,
  name text,
  created_at timestamp
)
  server bigquery_server
  options (
    table 'my_table',
    rowid_column 'id'
  );

update bigquery.my_table
set name = 'updated'
where id = 1;
```

### データの削除

BigQueryテーブルからデータを削除します:

```sql
-- rowid_columnオプションが必要
delete from bigquery.my_table
where id = 1;
```

### 特定の場所のテーブル

デフォルト以外の場所にあるテーブルを使用する場合:

```sql
create foreign table bigquery.eu_table (
  id bigint,
  name text
)
  server bigquery_server
  options (
    table 'eu_table',
    location 'EU'
  );
```

### タイムアウトの設定

長時間実行されるクエリのタイムアウトを設定します:

```sql
create foreign table bigquery.large_table (
  id bigint,
  data text
)
  server bigquery_server
  options (
    table 'large_table',
    timeout '60000'
  );
```

## サポートされているデータ型

| Postgres型 | BigQuery型 |
|-----------|-----------|
| boolean | BOOL |
| bigint | INT64 |
| double precision | FLOAT64 |
| numeric | NUMERIC |
| text | STRING |
| varchar | STRING |
| date | DATE |
| timestamp | TIMESTAMP |
| timestamptz | TIMESTAMP |

## クエリのプッシュダウン

BigQuery Wrapperは、以下のPostgreSQLの節をリモートBigQueryにプッシュダウンすることで、パフォーマンスを向上させます:

- `WHERE`
- `SELECT`
- `ORDER BY`
- `LIMIT`

## トラブルシューティング

### 認証エラー

エラー: `Authentication failed`

サービスアカウントキーが正しいこと、および適切な権限（BigQuery Data EditorまたはBigQuery Admin）があることを確認してください。

### タイムアウトエラー

エラー: `Query timeout`

`timeout`オプションを増やすか、クエリを最適化してください:

```sql
alter foreign table bigquery.my_table
options (set timeout '60000');
```

### テーブルが見つからない

エラー: `Table not found`

`project_id`、`dataset_id`、`table`の値が正しいことを確認してください。

### ストリーミングバッファのデータ

エラー: `Cannot read from streaming buffer`

ストリーミングバッファのデータは読み取れません。データがBigQueryのストレージに永続化されるまで待つ必要があります（通常90秒以内）。

## ベストプラクティス

1. **Vaultを使用する**: 認証情報はVaultに保存することを推奨します
2. **適切なインデックス**: `rowid_column`を主キーに設定します
3. **タイムアウトの調整**: 大規模なクエリには適切なタイムアウトを設定します
4. **WHERE句の使用**: データ転送を最小限に抑えるため、WHERE句を使用してフィルタリングします
5. **バッチ処理**: 大量のデータを挿入する場合は、バッチで処理します

## 関連リンク

- [BigQuery公式ドキュメント](https://cloud.google.com/bigquery/docs)
- [Supabase Wrappers](https://supabase.github.io/wrappers/)
- [Google Cloud認証情報](https://cloud.google.com/docs/authentication/getting-started)
