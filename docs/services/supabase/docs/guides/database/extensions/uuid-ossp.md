# uuid-ossp: 一意識別子

## 概要

UUID（Universally Unique Identifier、汎用一意識別子）は、実用上、一意であるとされる識別子です。主キーとして適しており、GUID（Globally Unique Identifier、グローバル一意識別子）とも呼ばれます。

## 拡張機能のステータス

現在、`uuid-ossp` 拡張機能はデフォルトで有効になっており、無効にすることはできません。

## UUID生成関数

### `uuid_generate_v1()`

以下に基づいてUUIDを作成します：
- コンピュータのMACアドレス
- 現在のタイムスタンプ
- ランダム値

**警告**: UUIDv1は識別可能な詳細情報を漏洩するため、特定のセキュリティに敏感なアプリケーションには適さない場合があります。

### `uuid_generate_v4()`

- 完全にランダムな数値に基づいてUUID値を作成
- Postgresの組み込み関数 `gen_random_uuid()` も使用可能

## 使用例

### クエリ内での使用

```sql
select uuid_generate_v4();
```

### 主キーとしての使用

```sql
create table contacts (
  id uuid default uuid_generate_v4(),
  first_name text,
  last_name text,
  primary key (id)
);
```

## リソース

- [Choosing a Postgres Primary Key](/blog/choosing-a-postgres-primary-key)
- [The Basics Of Postgres UUID Data Type](https://www.postgresqltutorial.com/postgresql-uuid/)
