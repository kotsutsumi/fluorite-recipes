# Postgresトリガー

## 概要

「テーブルイベントでSQLを自動的に実行します。」PostgresのトリガーはINSERT、UPDATE、DELETE、またはTRUNCATE操作などのテーブルイベントで自動的にアクションを実行します。

## トリガーの作成

トリガーには2つの部分があります:
1. 実行されるトリガー関数
2. トリガーを実行するタイミングのパラメータを持つトリガーオブジェクト

### トリガー構文の例

```sql
create trigger "trigger_name"
after insert on "table_name"
for each row
execute function trigger_function();
```

## トリガー関数

トリガー関数は、トリガーが発火したときにPostgresが実行するユーザー定義関数です。

### トリガー関数の例

```sql
create function update_salary_log()
returns trigger
language plpgsql
as $$
begin
  insert into salary_log(employee_id, old_salary, new_salary)
  values (new.id, old.salary, new.salary);
  return new;
end;
$$;
```

### トリガー変数

主な変数:
- `TG_NAME`: トリガーの名前
- `TG_WHEN`: トリガーイベントのタイミング（BEFORE/AFTER）
- `TG_OP`: 操作の種類（INSERT/UPDATE/DELETE/TRUNCATE）
- `OLD`: 以前の行データ
- `NEW`: 更新された行データ

## トリガーの種類

- `BEFORE`: トリガーイベントの前に実行
- `AFTER`: トリガーイベントの後に実行

## 実行頻度

- `for each row`: 影響を受けた各行ごとに実行
- `for each statement`: 操作全体に対して1回実行

## トリガーの削除

```sql
drop trigger "trigger_name" on "table_name";
```

## リソース

- [公式Postgresドキュメント: トリガー](https://www.postgresql.org/docs/current/triggers.html)
- [公式Postgresドキュメント: トリガーの動作](https://www.postgresql.org/docs/current/trigger-definition.html)
- [公式Postgresドキュメント: CREATE TRIGGER](https://www.postgresql.org/docs/current/sql-createtrigger.html)
