# スキーマ内のすべてのテーブルを削除する

指定されたスキーマ内のすべてのテーブルを削除するには、以下のクエリを実行します。`my-schema-name`をスキーマ名に置き換えてください。Supabaseでは、デフォルトのスキーマは`public`です。

⚠️ **警告**: これはすべてのテーブルとそれに関連するデータを削除します。続行する前に、最新の[バックアップ](/docs/guides/platform/backups)があることを確認してください。

```sql
do $$
declare
    r record;
begin
    for r in (select tablename from pg_tables where schemaname = 'my-schema-name') loop
        execute 'drop table if exists ' || quote_ident(r.tablename) || ' cascade';
    end loop;
end $$;
```

このクエリは、指定されたスキーマ内のすべてのテーブルをリストアップし、それぞれに対して`drop table`を実行することで動作します（したがって`for... loop`を使用しています）。

このクエリは、Supabaseダッシュボードの[SQL Editor](/dashboard/project/_/sql)を使用するか、[データベースに直接接続](/docs/guides/database/connecting-to-postgres#direct-connections)している場合は`psql`経由で実行できます。

[GitHubでこのページを編集](https://github.com/supabase/supabase/blob/master/apps/docs/content/guides/database/postgres/dropping-all-tables-in-schema.mdx)

