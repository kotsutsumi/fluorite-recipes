# 論理レプリケーションを使用した別のPostgresデータベースへのレプリケーション

## 要件
- Supabaseプロジェクト
- Postgresデータベース（v10以降を実行）

## 手順

### 1. Supabaseデータベースでパブリケーションを作成する

```sql
CREATE PUBLICATION example_pub;
```

### 2. Supabaseデータベースでレプリケーションスロットを作成する

```sql
select pg_create_logical_replication_slot('example_slot', 'pgoutput');
```

### 3. 外部データベースに接続し、パブリケーションをサブスクライブする

```sql
CREATE SUBSCRIPTION example_sub
CONNECTION 'host=db.oaguxblfdassqxvvwtfe.supabase.co user=postgres password=YOUR_PASS dbname=postgres'
PUBLICATION example_pub
WITH (copy_data = true, create_slot=false, slot_name=example_slot);
```

#### 重要な注意事項
- 直接接続を使用してください（Connection Poolerではありません）
- IPv6サポートが必要か、IPv4アドオンを有効にしてください
- postgresユーザーを使用しない場合は、カスタムレプリケーションロールを作成できます

### 4. Supabaseデータベースのパブリケーションにテーブルを追加する

```sql
ALTER PUBLICATION example_pub ADD TABLE example_table;
```

### 5. レプリケーションの状態を確認する

```sql
select * from pg_stat_replication;
```

### 追加のガイダンス

パブリケーションにさらにテーブルを追加する場合は、サブスクライブしているデータベースでREFRESHを実行する必要があります。

```sql
ALTER SUBSCRIPTION example_sub REFRESH PUBLICATION;
```

[GitHubでこのページを編集](https://github.com/supabase/supabase/blob/master/apps/docs/content/guides/database/postgres/setup-replication-external.mdx)

