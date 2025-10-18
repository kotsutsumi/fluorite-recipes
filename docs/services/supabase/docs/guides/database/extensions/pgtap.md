# pgTAP: PostgreSQL用ユニットテスト

## 概要

pgTAPは、PostgreSQL用のユニットテスト拡張機能です。データベースシステムの小さな部分をテストできます。Test Anything Protocol（TAP）を使用し、テスト中のエラー報告を簡素化することを目的としています。

## 拡張機能の有効化

SupabaseダッシュボードまたはSQLを使用してpgTAPを有効にできます：

```sql
create extension pgtap with schema extensions;
```

## テスト機能

### 1. テーブルテスト

- `has_table()`: テーブルが存在するかチェック
- `has_index()`: インデックスの存在を検証
- `has_relation()`: データベースリレーションの存在をテスト

### 2. カラムテスト

- `has_column()`: テーブル/ビューにカラムが存在するかチェック
- `col_is_pk()`: 主キーカラムを検証

### 3. 行レベルセキュリティ（RLS）ポリシーテスト

- `policies_are()`: テーブルポリシーを検証
- `policy_roles_are()`: ポリシーのロール割り当てをチェック
- `policy_cmd_is()`: ポリシーコマンドの適用性をテスト

### 4. 関数テスト

- `function_returns()`: 関数の戻り値の型を検証
- `is_definer()`: セキュリティ定義者関数をチェック

## テストの例

### テーブル存在テスト

```sql
begin;
select plan(1);
select has_table('profiles');
select * from finish();
rollback;
```

### カラムと主キーのテスト

```sql
begin;
select plan(2);
select has_column('profiles', 'id');
select col_is_pk('profiles', 'id');
select * from finish();
rollback;
```

## リソース

- [pgTAP 公式ドキュメント](https://pgtap.org/)
