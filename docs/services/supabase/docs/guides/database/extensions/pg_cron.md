# pg_cron: PostgreSQLのジョブスケジューリング

## 概要

Supabase Cronは、「cron構文を使用した定期的なジョブのスケジューリングと、Postgres内でのジョブ実行の監視を簡素化する」ように設計されたPostgresモジュールです。

### 主な機能
- SQLまたはダッシュボードインターフェース経由でジョブを作成
- 毎秒から年1回までの頻度でジョブを実行
- SQLスニペット、データベース関数、HTTPリクエストを実行
- ネットワークレイテンシゼロでのジョブ実行

### パフォーマンス推奨事項
「最高のパフォーマンスを得るため、同時に実行するジョブは8つまでを推奨します。各ジョブの実行時間は10分以内にしてください。」

## Cronの仕組み

Supabase Cronは、スケジューリングと実行エンジンとして`pg_cron` PostgreSQLデータベース拡張機能を利用しています。

### データベーススキーマ
- `cron`スキーマを作成
- ジョブを`cron.job`テーブルに保存
- ジョブ実行の詳細を`cron.job_run_details`テーブルで追跡

### ジョブの機能
- SQLスニペットの実行
- データベース関数の実行
- HTTPリクエストの実行(例: Supabase Edge Functionsの呼び出し)

## 拡張機能の有効化

### ダッシュボードによる方法
1. ダッシュボードのDatabaseページに移動
2. サイドバーの「Extensions」をクリック
3. `pg_cron`を検索して拡張機能を有効化

### SQLによる方法
```sql
-- "pg_cron"拡張機能を有効化
create extension pg_cron;

-- "pg_cron"拡張機能を無効化
drop extension if exists pg_cron;
```

## ジョブの管理

ジョブは以下の方法で管理できます:
- SQLコマンド
- Supabaseダッシュボードの Integrations -> Cron インターフェース

## リソース
- [pg_cron GitHubリポジトリ](https://github.com/citusdata/pg_cron)
- [Supabase Cronドキュメント](https://supabase.com/docs/guides/cron)
