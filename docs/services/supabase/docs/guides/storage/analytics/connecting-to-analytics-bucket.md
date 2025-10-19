# Analyticsバケットへの接続

## 概要

この機能は**プライベートアルファ版**です。APIの安定性と後方互換性は保証されません。

Analyticsバケットへの接続には、2つの主要な認証サービスが含まれます:
1. Iceberg REST Catalog
2. S3互換ストレージエンドポイント

## 認証要件

- Icebergクライアント(Spark、PyIceberg)
- S3認証情報
- Supabaseプロジェクトリファレンスとサービスキー

## サポートされているクライアント

### 1. PyIceberg (Python)
### 2. Apache Spark

## インストール

### PyIceberg のインストール例:
```python
pip install pyiceberg pyarrow
```

## Iceberg REST Catalogの主な機能

- テーブルとネームスペースの作成/管理
- スキーマの追跡
- パーティションとスナップショットの管理
- トランザクショナルな整合性の保証

REST Catalogはアイスバーグテーブルに関するメタデータを保存し、実際のデータはParquet形式の大規模な分析データセット用に最適化された別のS3互換エンドポイントに保存されます。

## PyIcebergでの接続

### 設定

```python
from pyiceberg.catalog import load_catalog

catalog = load_catalog(
    "supabase",
    **{
        "uri": "https://<project-ref>.supabase.co/storage/v1/s3/analytics",
        "s3.endpoint": "https://<project-ref>.supabase.co/storage/v1/s3",
        "s3.access-key-id": "<s3-access-key>",
        "s3.secret-access-key": "<s3-secret-key>",
        "s3.region": "<project-region>",
        "header.Authorization": "Bearer <service-key>",
    },
)
```

### ネームスペースの作成

```python
catalog.create_namespace("my_namespace")
```

### テーブルの作成

```python
from pyiceberg.schema import Schema
from pyiceberg.types import NestedField, StringType, IntegerType

schema = Schema(
    NestedField(1, "user_id", IntegerType(), required=True),
    NestedField(2, "user_name", StringType(), required=True),
)

catalog.create_table("my_namespace.my_table", schema=schema)
```

### データの挿入

```python
import pyarrow as pa

table = catalog.load_table("my_namespace.my_table")

data = pa.Table.from_pydict({
    "user_id": [1, 2, 3],
    "user_name": ["Alice", "Bob", "Charlie"]
})

table.append(data)
```

### データのクエリ

```python
table = catalog.load_table("my_namespace.my_table")
df = table.scan().to_pandas()
print(df)
```

## Apache Sparkでの接続

### 設定

```scala
import org.apache.spark.sql.SparkSession

val spark = SparkSession.builder()
  .appName("Supabase Analytics")
  .config("spark.sql.catalog.supabase", "org.apache.iceberg.spark.SparkCatalog")
  .config("spark.sql.catalog.supabase.catalog-impl", "org.apache.iceberg.rest.RESTCatalog")
  .config("spark.sql.catalog.supabase.uri", "https://<project-ref>.supabase.co/storage/v1/s3/analytics")
  .config("spark.sql.catalog.supabase.io-impl", "org.apache.iceberg.aws.s3.S3FileIO")
  .config("spark.sql.catalog.supabase.s3.endpoint", "https://<project-ref>.supabase.co/storage/v1/s3")
  .config("spark.sql.catalog.supabase.s3.access-key-id", "<s3-access-key>")
  .config("spark.sql.catalog.supabase.s3.secret-access-key", "<s3-secret-key>")
  .config("spark.sql.catalog.supabase.warehouse", "s3://<bucket-name>")
  .config("spark.sql.catalog.supabase.header.Authorization", "Bearer <service-key>")
  .getOrCreate()
```

### テーブルの作成

```scala
spark.sql("""
  CREATE TABLE supabase.my_namespace.my_table (
    user_id INT,
    user_name STRING
  )
  USING iceberg
""")
```

### データの挿入

```scala
spark.sql("""
  INSERT INTO supabase.my_namespace.my_table
  VALUES (1, 'Alice'), (2, 'Bob'), (3, 'Charlie')
""")
```

### データのクエリ

```scala
val df = spark.sql("SELECT * FROM supabase.my_namespace.my_table")
df.show()
```

## REST Catalogへの直接接続

cURLを使用した例:

```bash
curl -X GET \
  "https://<project-ref>.supabase.co/storage/v1/s3/analytics/v1/namespaces" \
  -H "Authorization: Bearer <service-key>"
```

## 認証情報の管理

### 必要な認証情報

| 認証情報 | 説明 | 取得場所 |
|---------|------|---------|
| Project Reference | プロジェクトの一意の識別子 | Supabaseダッシュボード |
| Service Key | APIアクセス用のサービスキー | プロジェクト設定 > API |
| S3 Access Key | S3アクセスキーID | プロジェクト設定 > Storage |
| S3 Secret Key | S3シークレットアクセスキー | プロジェクト設定 > Storage |

### セキュリティのベストプラクティス

- サービスキーとS3認証情報を安全に保管
- 環境変数を使用して機密情報を管理
- ソースコードに認証情報をコミットしない
- 定期的に認証情報をローテーション

## トラブルシューティング

### 接続エラー

- プロジェクト参照が正しいことを確認
- サービスキーが有効で期限切れでないことを確認
- S3認証情報が正しく設定されていることを確認
- エンドポイントURLが正しいことを確認

### 権限エラー

- サービスキーに適切な権限があることを確認
- バケットとネームスペースが存在することを確認
- RLSポリシーが適切に設定されていることを確認
