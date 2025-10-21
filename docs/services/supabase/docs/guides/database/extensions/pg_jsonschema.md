# pg_jsonschema: JSONスキーマ検証

## 概要

「JSON Schemaは、JSONドキュメントに注釈を付け、検証するための言語です。」`pg_jsonschema` Postgres拡張機能は、`json`および`jsonb`データ型をJSONスキーマドキュメントに対して検証できるようにします。

## 拡張機能の有効化

以下の方法で有効化できます:

1. Supabaseダッシュボード
   - Databaseページに移動
   - 「Extensions」をクリック
   - `pg_jsonschema`を検索して有効化

2. SQL方式
```sql
create extension pg_jsonschema with schema extensions;
```

## 関数

- `json_matches_schema(schema json, instance json)`: JSONインスタンスがスキーマと一致するかチェック
- `jsonb_matches_schema(schema json, instance jsonb)`: JSONBインスタンスがスキーマと一致するかチェック

## 使用例

基本的な検証:
```sql
select extensions.json_matches_schema(
  schema := '{"type": "object"}',
  instance := '{}'
);
```

テーブル制約を使用した実用的な実装:
```sql
create table customer (
  id serial primary key,
  metadata json,
  check (
    json_matches_schema(
      '{
        "type": "object",
        "properties": {
          "tags": {
            "type": "array",
            "items": {
              "type": "string",
              "maxLength": 16
            }
          }
        }
      }',
      metadata
    )
  )
);
```

## リソース

- [公式pg_jsonschemaドキュメント](https://github.com/supabase/pg_jsonschema)
