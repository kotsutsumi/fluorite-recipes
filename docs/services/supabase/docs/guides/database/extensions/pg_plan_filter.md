# pg_plan_filter: トータルコスト制限

## 概要

「pg_plan_filterは、クエリプランナーが推定するトータルコストが閾値を超える文の実行をブロックするPostgres拡張機能です。」

## 拡張機能の有効化

この拡張機能は、`shared_preload_libraries`設定を介してデフォルトで既に有効になっています。

## API

- `plan_filter.statement_cost_limit`: 実行される文の最大トータルコストを制限
- `plan_filter.limit_select_only`: `select`文のみに制限

**注意**: `limit_select_only = true`は真の読み取り専用ではありません。`select`文は関数呼び出しを通じてデータを変更できます。

## 例

### セットアップ

```sql
create table book(
 id int primary key
);
insert into book(id) select * from generate_series(1, 10000);
```

### 実行計画

単一レコードの選択:
```sql
explain select * from book where id = 1;
-- 低コストのインデックススキャンを表示
```

テーブル全体の選択:
```sql
explain select * from book;
-- より高コストのシーケンシャルスキャンを表示
```

### コストフィルタリング

```sql
set plan_filter.statement_cost_limit = 50; -- 2.49と135.0の間

select * from book where id = 1; -- 成功
select * from book; -- 失敗（コスト制限を超過）
```

## リソース

- [公式pg_plan_filterドキュメント](https://github.com/pgexperts/pg_plan_filter)
