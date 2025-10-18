# 列レベルセキュリティ

## 概要

PostgreSQLの行レベルセキュリティ（RLS）は、行アクセスに対するきめ細かな制御を提供しますが、列アクセスを制御しません。列レベル権限を使用すると、データベース内の特定の列へのアクセスを制限できます。

## 重要な警告

- これはほとんどのユーザーには推奨されない高度な機能です
- 推奨される代替手段: 専用のユーザーロールテーブルでRLSポリシーを使用
- 制限されたロールは、影響を受けるテーブルでワイルドカード（`*`）演算子を使用できません

## 権限の種類

1. **テーブルレベル**: すべての列に対する権限を付与
2. **列レベル**: 特定の列に対する権限を付与

### シナリオの例

以下の列を持つ`posts`テーブルを考えます:
- `id`
- `user_id`
- `title`
- `content`
- `created_at`
- `updated_at`

## 列権限の管理

### ダッシュボードでの管理

- Supabase Studioの機能プレビューセクションにあります
- 列権限の表示と編集が可能です

### マイグレーションでの管理

- データベースマイグレーションファイルで権限を管理できます
- 成長するプロジェクトに推奨されます

## SQLの例

```sql
-- 行レベルセキュリティポリシー
create policy "Allow update for owners" on posts for
update using ((select auth.uid()) = user_id);

-- テーブルレベルの更新権限を取り消す
revoke update on table public.posts from authenticated;

-- 列レベルの更新権限を付与
grant update (title, content) on table public.posts to authenticated;
```

## 考慮事項

- 列権限を無効にすると、その列を使用できなくなります
- すべての操作（insert、update、delete）と`select *`が失敗します
