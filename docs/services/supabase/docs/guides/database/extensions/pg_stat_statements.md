# pg_stat_statements: クエリパフォーマンスモニタリング

## 概要

`pg_stat_statements`は、データベースで実行されたSQL文の統計情報を追跡するPostgreSQLの拡張機能です。詳細なクエリパフォーマンスのメタデータを含むビューを提供します。

## 主要な統計情報カラム

| カラム名 | データ型 | 説明 |
|---------|---------|------|
| `userid` | `oid` | ステートメントを実行したユーザーのOID |
| `dbid` | `oid` | ステートメントが実行されたデータベースのOID |
| `toplevel` | `bool` | クエリがトップレベルステートメントかどうか |
| `queryid` | `bigint` | 正規化されたクエリを識別するハッシュコード |
| `query` | `text` | 代表的なステートメントのテキスト |
| `plans` | `bigint` | ステートメントがプランニングされた回数 |
| `total_plan_time` | `double precision` | プランニングに費やされた総時間 |
| `min_plan_time` | `double precision` | プランニングに費やされた最小時間 |

## 拡張機能の有効化

### ダッシュボードを使用する方法

1. Databaseページに移動
2. "Extensions"をクリック
3. "pg_stat_statements"を検索して有効化

### SQLを使用する方法

```sql
-- 拡張機能を有効化
create extension pg_stat_statements with schema extensions;

-- 拡張機能を無効化
drop extension if exists pg_stat_statements;
```

## クエリアクティビティの検査

一般的な用途は、負荷の高いクエリや遅いクエリを追跡することです。問題のあるクエリを特定するためのクエリ例：

```sql
select
    calls,
    mean_exec_time,
    max_exec_time,
    total_exec_time,
    stddev_exec_time,
    query
from pg_stat_statements
where
    calls > 50                   -- 少なくとも50回呼び出し
    and mean_exec_time > 2.0     -- 平均で少なくとも2ms/呼び出し
    and total_exec_time > 60000  -- 合計で少なくとも1分のサーバー時間
    and query ilike '%user_in_organization%'
order by calls desc
```

## リソース

- [公式pg_stat_statementsドキュメント](https://www.postgresql.org/docs/current/pgstatstatements.html)
