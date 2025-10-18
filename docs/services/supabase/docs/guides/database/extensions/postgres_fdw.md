# postgres_fdw拡張機能

## 概要

「この拡張機能により、PostgresはリモートのPostgresサーバー上のテーブルとビューをクエリできるようになります。」

## 拡張機能の有効化

### 方法:

1. ダッシュボード
   - Databaseページに移動
   - 「Extensions」をクリック
   - "postgres_fdw"を検索して有効化

2. SQL
   ```sql
   create extension if not exists postgres_fdw;
   ```

## 別のデータベースへの接続の作成

### 手順:

1. 外部サーバーの作成
   ```sql
   create server "<foreign_server_name>"
   foreign data wrapper postgres_fdw
   options (
     host '<host>',
     port '<port>',
     dbname '<dbname>'
   );
   ```

2. サーバーマッピングの作成
   ```sql
   create user mapping for "<dbname>"
   server "<foreign_server_name>"
   options (
     user '<db_user>',
     password '<password>'
   );
   ```

3. テーブルのインポート
   ```sql
   -- スキーマからすべてのテーブルをインポート
   import foreign schema "<foreign_schema>"
   from server "<foreign_server>"
   into "<host_schema>";

   -- 特定のテーブルをインポート
   import foreign schema "<foreign_schema>"
   limit to ("<table_name1>", "<table_name2>")
   from server "<foreign_server>"
   into "<host_schema>";
   ```

4. 外部テーブルのクエリ
   ```sql
   select * from "<foreign_table>"
   ```

## 実行オプションの設定

### フェッチサイズ

- 操作ごとにフェッチされる最大行数
- 例: `fetch_size`が100の場合、200行には2回のリクエストが必要

### バッチサイズ

- サイクルごとに挿入される最大行数
- 例: `batch_size`が100の場合、200行には2回のリクエストが必要

### 拡張機能

- 共有される拡張機能のリスト
- リストにない拡張機能の関数によるクエリの失敗を防ぐ

## リソース

- [公式postgres_fdwドキュメント](https://www.postgresql.org/docs/current/postgres-fdw.html#POSTGRES-FDW)
