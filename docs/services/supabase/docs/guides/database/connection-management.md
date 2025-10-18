# Supabaseでの接続管理

## 概要

- すべてのコンピュートアドオンには、事前設定された直接接続数とSupavisorプールサイズがあります
- このガイドでは、データベース接続を効率的に観察および管理する方法について説明します

## Supavisorのプールサイズの設定

- データベース設定の「接続プーリング設定」セクションでプールサイズを調整
- 一般的なガイドライン:
  - PostgREST APIを多用している場合、プールサイズを40%以上に上げることには注意が必要
  - それ以外の場合は、80%をプールにコミットできます
- 実際の値は以下によって異なります:
  - 使用している他のSupabase製品
  - 同時ピーク接続使用状況

## 接続の監視

### ダッシュボード監視チャート（Teams/Enterpriseプラン）

「データベースクライアント接続」チャートには、履歴接続データが表示されます。接続はタイプ別に分類されます:
- **Postgres**: 直接アプリケーション接続
- **PostgREST**: APIレイヤー接続
- **Reserved**: 管理用Supabaseサービス接続
- **Auth**: Supabase認証サービス接続
- **Storage**: Supabaseストレージサービス接続
- **Other roles**: その他のデータベース接続

### Grafanaダッシュボード

- 200以上のプロジェクトメトリクスの可視化を提供
- SupavisorとPostgres接続用の「クライアント接続」グラフが含まれます

### ライブ接続の観察

`pg_stat_activity`ビューを使用して、データベースプロセスと接続を追跡します。

#### ライブ接続を取得するSQLクエリ

```sql
SELECT
  pg_stat_activity.pid as connection_id,
  ssl,
  datname as database,
  usename as connected_role,
  application_name,
  client_addr as IP,
  query,
  query_start,
  state,
  backend_start
FROM pg_stat_ssl
JOIN pg_stat_activity
ON pg_stat_ssl.pid = pg_stat_activity.pid;
```

#### 接続ロールとソース

以下のようなロールが含まれます:
- `supabase_admin`
- `authenticator`
- `supabase_auth_admin`
- `postgres`
- ユーザー定義のカスタムロール
