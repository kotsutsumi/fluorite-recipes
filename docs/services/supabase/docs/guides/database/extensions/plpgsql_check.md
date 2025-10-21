# plpgsql_check: PL/pgSQLリンター

## 概要

plpgsql_checkは、PL/pgSQLの構文、セマンティクス、その他関連する問題をリントするPostgres拡張機能です。このツールは、コードを実行する前にエラーを識別して修正するのに役立ちます。

## 拡張機能の有効化

以下の方法で有効にできます：

### 1. Supabaseダッシュボード

1. Databaseページに移動
2. 「Extensions」をクリック
3. 「plpgsql_check」を検索して有効化

### 2. SQLメソッド

```sql
create extension plpgsql_check;
```

## API

- `plpgsql_check_function(...)`: 関数をスキャンしてエラーを検出

## 使用例

### エラーを含むテーブルと関数の作成

```sql
create table place(
  x float,
  y float
);

create or replace function public.some_func()
returns void
language plpgsql
as $$
declare
  rec record;
begin
  for rec in select * from place loop
    -- バグ: テーブル `place` には `created_at` カラムが存在しない
    raise notice '%', rec.created_at;
  end loop;
end;
$$;
```

### エラーの検出

```sql
select plpgsql_check_function('public.some_func()');
```

このクエリを実行すると、`place`テーブルに`created_at`カラムが存在しないというエラーが検出されます。

## リソース

- [plpgsql_check 公式ドキュメント](https://github.com/okbob/plpgsql_check)
