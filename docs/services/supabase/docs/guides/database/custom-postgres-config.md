# Postgres設定のカスタマイズ

## 概要

- 各Supabaseプロジェクトは事前設定されたPostgresクラスターです
- ユーザーは一部の設定をオーバーライドできます
- これは潜在的なリスクを伴う高度なトピックです

## 警告

Postgres設定のカスタマイズは、データベースに対する*高度な*制御を提供しますが、不適切な設定は深刻なパフォーマンスの低下やプロジェクトの不安定性につながる可能性があります。

## 設定の表示

すべてのPostgres設定をリストするには:
```sql
select * from pg_settings;
```

## 設定可能な設定タイプ

### 1. ユーザーコンテキスト設定

- ロールまたはデータベースレベルで変更可能
- ユーザーコンテキスト設定をリストするには:
```sql
select * from pg_settings where context = 'user';
```

### 2. スーパーユーザー設定

- スーパーユーザーのみが変更可能
- `supautils`拡張機能を介して有効化
- 設定可能な設定には以下が含まれます:
  - `auto_explain.*`
  - `log_lock_waits`
  - `log_min_duration_statement`
  - `log_statement`
  - その他多数

### 3. CLIで設定可能な設定

- 一部のパラメータはSupabase CLI経由で変更可能
- デフォルト設定を永続的に上書き
- オーナーまたは管理者権限が必要

## CLI設定管理

設定の更新:
```bash
supabase postgres-config update --config shared_buffers=250MB
```

## 考慮事項

- 変更によりデータベースが再起動する可能性があります
- カスタム設定はデフォルトの最適化を上書きします
- 一部のパラメータはディスク使用率を増加させる可能性があります

## 設定のリセット

データベースレベルの設定をリセット:
```sql
alter database "postgres" set "<setting_name>" to default;
```

このドキュメントは、データベースのパフォーマンスと安定性を維持するために、慎重で情報に基づいた設定を強調しています。
