# エッジファンクションのスケジューリング

このドキュメントでは、Supabaseの `pg_cron` 拡張機能と `pg_net` を組み合わせてエッジファンクションをスケジュールする方法について説明します。

## 重要なポイント

- SupabaseプラットフォームはPostgresの定期ジョブスケジューラーである `pg_cron` をサポート
- `pg_net` 拡張機能により、エッジファンクションを定期的に呼び出すことが可能
- 認証トークンはSupabase Vaultに安全に保存することを推奨

## 例：1分ごとにファンクションを呼び出す

1. プロジェクトURLと匿名キーをVaultに保存：

```sql
select vault.create_secret('https://project-ref.supabase.co', 'project_url');
select vault.create_secret('YOUR_SUPABASE_PUBLISHABLE_KEY', 'publishable_key');
```

2. ファンクション呼び出しをスケジュール：

```sql
select cron.schedule(
    'invoke-function-every-minute',
    '* * * * *', -- 毎分
    $$
    select
      net.http_post(
        url:= (select decrypted_secret from vault.decrypted_secrets where name = 'project_url') || '/functions/v1/function-name',
        headers:=jsonb_build_object(
          'Content-type', 'application/json',
          'Authorization', 'Bearer ' || (select decrypted_secret from vault.decrypted_secrets where name = 'anon_key')
        ),
        body:=concat('{"time": "', now(), '"}')::jsonb
      ) as request_id;
    $$
);
```

## リソース

- [`pg_net` 拡張機能](/docs/guides/database/extensions/pgnet)
- [`pg_cron` 拡張機能](/docs/guides/database/extensions/pgcron)
