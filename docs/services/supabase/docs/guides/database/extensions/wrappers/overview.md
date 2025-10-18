# Foreign Data Wrappers

## Postgres Foreign Data Wrappersを使用して外部システムに接続する

Foreign Data Wrappers (FDW) は、外部データソースに保存されたデータをネイティブなPostgresテーブルであるかのようにアクセス・クエリできるようにするPostgresのコア機能です。

Postgresには、他のPostgresデータベースにアクセスするための [`postgres_fdw`](https://www.postgresql.org/docs/current/postgres-fdw.html) や、ファイルからデータを読み取るための [`file_fdw`](https://www.postgresql.org/docs/current/file-fdw.html) など、いくつかの組み込みForeign Data Wrappersが含まれています。Supabaseは、オープンソースの [Wrappers](https://github.com/supabase/wrappers) フレームワークを使用して、他のデータベースやその他の外部システムをクエリできるようにこの機能を拡張しています。

## 概念

Wrappersは、いくつかの新しい用語と異なるワークフローを導入します。

### リモートサーバー

リモートサーバーとは、Postgresデータベースからクエリしたい外部データベース、API、またはデータを含むシステムのことです。例えば：

- PostgresやFirebaseなどの外部データベース
- ClickHouse、BigQuery、Snowflakeなどのリモートデータウェアハウス
- StripeやGitHubなどのAPI

同じタイプの複数のリモートサーバーに接続することも可能です。

### 外部テーブル

リモートサーバー内の一部のデータにマッピングされるデータベース内のテーブルです。

例：
- データウェアハウス内のテーブルにマッピングされる `analytics` テーブル
- Stripeのサブスクリプションにマッピングされる `subscriptions` テーブル
- Firebaseコレクションにマッピングされる `collections` テーブル

外部テーブルは他のテーブルと同じように動作しますが、データはデータベース内に保存されません。データはリモートサーバー内に残ります。

### WrappersによるETL

ETLは、Extract、Transform、Loadの略で、あるシステムから別のシステムにデータを移動するための確立されたプロセスです。

[Fivetran](https://fivetran.com/) や [Airbyte](https://airbyte.io/) など、多くの人気のあるETLツールがあります。

Wrappersは、これらのツールの代替手段を提供します。SQLを使用して、あるシステムから別のシステムにデータを移動できます。
