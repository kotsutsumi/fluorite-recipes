# データベースのテスト

## 概要

データベースをテストするための2つの主要なアプローチを説明します:

1. アプリケーションのプログラミング言語でSupabaseクライアントを使用し、好みのテストフレームワークでテストを記述
2. Supabase CLIを使用してSQLテストを通じてテスト

## Supabase CLIを使用したテスト

### 前提条件

- 最小CLIバージョン: v1.11.4
- ローカルマシンにSupabase CLIをインストール

### テストの作成

1. testsフォルダーを作成:
```bash
mkdir -p ./supabase/tests/database
```

2. テストファイルを作成:
```bash
touch ./supabase/tests/database/hello_world.test.sql
```

### テストの記述

- テストランナーとしてpgTAPを使用
- `auth.users`テーブルをチェックするテストの例:

```sql
begin;
select plan(1); -- 実行するステートメントは1つのみ

SELECT has_column(
 'auth',
 'users',
 'id',
 'id should exist'
);

select * from finish();
rollback;
```

### テストの実行

コマンド:
```bash
supabase test db
```

出力例:
```
supabase/tests/database/hello_world.test.sql .. ok
All tests successful.
Files=1, Tests=1,  1 wallclock secs ( 0.01 usr  0.00 sys +  0.04 cusr  0.02 csys =  0.07 CPU)
Result: PASS
```

## その他のリソース

- [RLSポリシーのテスト](/docs/guides/database/extensions/pgtap#testing-rls-policies)
- [pgTAP拡張機能](/docs/guides/database/extensions/pgtap)
- [公式pgTAPドキュメント](https://pgtap.org/)
