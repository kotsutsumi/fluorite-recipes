# PostgreSQLで各グループの最初の行を選択する

PostgreSQLで各グループの最大値を持つ最初の行を選択するテクニックを紹介します。

## 例のシナリオ

次のような`seasons`テーブルがあるとします:

| id | team      | points |
|----|-----------|--------|
| 1  | Liverpool | 82     |
| 2  | Liverpool | 84     |
| 3  | Brighton  | 34     |
| 4  | Brighton  | 28     |
| 5  | Liverpool | 79     |

各チームの最高ポイントを持つ行を取得したい場合、期待される結果は以下のようになります:

| id | team      | points |
|----|-----------|--------|
| 3  | Brighton  | 34     |
| 2  | Liverpool | 84     |

## SQLクエリ

```sql
select distinct on (team) id,
 team,
 points
from
 seasons
order BY
 id,
 points desc,
 team;
```

クエリの主要なポイント:
- `distinct on (team)`を使用して、各チームごとに1行のみを返します
- `desc`キーワードでポイントを最高から最低の順に並べ替えます
- SQL Editor、`psql`、またはその他のデータベースクエリツールで実行できます

このクエリは、Supabaseダッシュボードの[SQL Editor](/dashboard/project/_/sql)を使用するか、[データベースに直接接続](/docs/guides/database/connecting-to-postgres#direct-connections)している場合は`psql`経由で実行できます。

[GitHubでこのページを編集](https://github.com/supabase/supabase/blob/master/apps/docs/content/guides/database/postgres/first-row-in-group.mdx)

