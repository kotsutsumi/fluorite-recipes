# PostgreSQLでのJSONと非構造化データの管理

## JSONとJSONB

PostgreSQLは2つのJSON列タイプをサポートしています:

- **`json`**: 文字列として保存され、実行ごとに再解析が必要
- **`jsonb`**: バイナリ形式で保存され、処理が高速（推奨）

## JSON/JSONBを使用する場合

- 非構造化または可変スキーマのデータに最適
- 例: Webhookレスポンスの保存
- 注意: 「`json/jsonb`列を使いすぎないでください」

## JSONB列の作成

他のデータ型と同様に扱われます。

### SQL例

```sql
create table books (
  id serial primary key,
  title text,
  author text,
  metadata jsonb
);
```

## JSONデータの挿入

- 有効なJSONである必要があります
- 他のデータ型と同様に挿入できます

## JSONデータのクエリ

JSONオペレーター（`->`と`->>`）を使用します。

- ネストされた値にアクセスできます
- 特定のJSONフィールドを抽出するクエリ例が示されています

## JSONデータの検証

- Supabaseは`pg_jsonschema`拡張機能を提供します
- JSONスキーマドキュメントに対する検証が可能です

## リソース

- PostgreSQL JSONドキュメント

このドキュメントは、PostgreSQLでJSONデータを扱うための包括的なガイドを提供し、ベストプラクティスと実用的な例を強調しています。
