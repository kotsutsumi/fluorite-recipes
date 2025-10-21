# PostgreSQLのバージョンを確認する

実行しているPostgresのバージョンを知ることは重要です。各メジャーバージョンには異なる機能があり、破壊的な変更を引き起こす可能性があります。また、Postgresのメジャーバージョンを[アップグレード](https://www.postgresql.org/docs/current/pgupgrade.html)またはダウングレードする際には、スキーマの更新が必要になる場合があります。

Supabaseダッシュボードの[SQL Editor](/dashboard/project/_/sql)を使用して、次のクエリを実行します:

```sql
select version();
```

次のような結果が返されます:

```
PostgreSQL 15.1 on aarch64-unknown-linux-gnu, compiled by gcc (Ubuntu 10.3.0-1ubuntu1~20.04) 10.3.0, 64-bit
```

このクエリは、[データベースに直接接続](/docs/guides/database/connecting-to-postgres#direct-connections)している場合は`psql`またはその他のクエリエディタ経由でも実行できます。

このドキュメントは、Supabaseプロジェクトでデータベースのバージョンを確認する簡単な方法を提供し、機能の違いや互換性の考慮事項があるため、データベースのバージョンを知ることの重要性を強調しています。

[GitHubでこのページを編集](https://github.com/supabase/supabase/blob/master/apps/docs/content/guides/database/postgres/which-version-of-postgres.mdx)

