# Postgres拡張機能の概要

拡張機能は、Postgresのコア機能を超えて機能を追加する「エクステンション」です。Supabaseには多数のオープンソース拡張機能が事前インストールされています。

## 拡張機能の有効化と無効化

拡張機能を有効化または無効化するには、2つの方法があります。

### ダッシュボードを使用する方法
1. ダッシュボードのDatabaseページに移動
2. サイドバーの**Extensions**をクリック
3. 拡張機能を有効化または無効化

### SQLを使用する方法
```sql
-- 例: "pgtap"拡張機能を有効化し、インストールされていることを確認
create extension pgtap
with schema extensions;

-- 例: "pgtap"拡張機能を無効化
drop extension pgtap;
```

### 重要な注意事項
- ほとんどの拡張機能は`extensions`スキーマにインストールされ、公開アクセス可能です
- 名前空間の汚染を避けるため、`extensions`スキーマに他のエンティティを作成しないでください
- アクセスを制限する場合は、特定の拡張機能用に別のスキーマを作成してください
- 一部の拡張機能は特定のスキーマ名を必要とします（例：`postgis_tiger_geocoder`は`tiger`スキーマを作成します）

## 拡張機能のアップグレード
- 新しい拡張機能のバージョンは、Infrastructure Settingsから利用可能です
- ソフトウェアのアップグレードは、General Settingsでサーバーを再起動することでも開始できます

## 拡張機能の利用可能性
- Supabaseは50以上の拡張機能を事前設定しています
- [database.dev](https://database.dev/)から追加の拡張機能をインストールできます
- 純粋なSQL拡張機能はSQLエディタから追加できます
- 拡張機能のリクエストは[GitHub Discussion](https://github.com/orgs/supabase/discussions/33754)で行えます
