# Prisma ドキュメント サマリー

このドキュメントは、`docs/libs/prisma/` 配下にある全Prismaドキュメントの要約とリンク集です。

## 概要

Prismaは、Node.jsとTypeScript向けの次世代ORM（Object-Relational Mapping）ツールです。型安全なデータベースクライアント、直感的なデータモデル、自動マイグレーション機能を提供します。

### 主要コンポーネント

- **Prisma Client**: 型安全で自動生成されるデータベースクライアント
- **Prisma Migrate**: 宣言的なデータモデリングとマイグレーション
- **Prisma Studio**: データベースを視覚的に管理するGUIツール
- **Prisma Schema**: データモデルを定義するスキーマ言語

## ドキュメント構成

### 📚 Getting Started（はじめに）

Prismaの基本的なセットアップと使い方を学びます。

- [Getting Started 概要](./prisma/docs/getting-started.md)

#### Prisma Postgres

- [Prisma Postgres 概要](./prisma/docs/getting-started/prisma-postgres.md)
- [CLIからの使用](./prisma/docs/getting-started/prisma-postgres/from-the-cli.md)
- [既存のPostgreSQLデータベースからのインポート](./prisma/docs/getting-started/prisma-postgres/import-from-existing-database-postgresql.md)
- [Early Accessからのアップグレード](./prisma/docs/getting-started/prisma-postgres/upgrade-from-early-access.md)

#### 既存プロジェクトへの追加

**MongoDB:**
- [MongoDB セットアップ](./prisma/docs/getting-started/setup-prisma/add-to-existing-project/mongodb-typescript-mongodb.md)
- [データベース接続](./prisma/docs/getting-started/setup-prisma/add-to-existing-project/mongodb/connect-your-database-typescript-mongodb.md)
- [Prisma Clientインストール](./prisma/docs/getting-started/setup-prisma/add-to-existing-project/mongodb/install-prisma-client-typescript-mongodb.md)
- [イントロスペクション](./prisma/docs/getting-started/setup-prisma/add-to-existing-project/mongodb/introspection-typescript-mongodb.md)
- [データベースクエリ](./prisma/docs/getting-started/setup-prisma/add-to-existing-project/mongodb/querying-the-database-typescript-mongodb.md)
- [次のステップ](./prisma/docs/getting-started/setup-prisma/add-to-existing-project/mongodb/next-steps.md)

**リレーショナルデータベース:**
- [リレーショナルDB セットアップ](./prisma/docs/getting-started/setup-prisma/add-to-existing-project/relational-databases-typescript-postgresql.md)
- [データベースのベースライン化](./prisma/docs/getting-started/setup-prisma/add-to-existing-project/relational-databases/baseline-your-database-typescript-postgresql.md)
- [データベース接続](./prisma/docs/getting-started/setup-prisma/add-to-existing-project/relational-databases/connect-your-database-typescript-postgresql.md)
- [スキーマの進化](./prisma/docs/getting-started/setup-prisma/add-to-existing-project/relational-databases/evolve-your-schema-typescript-postgresql.md)
- [Prisma Clientインストール](./prisma/docs/getting-started/setup-prisma/add-to-existing-project/relational-databases/install-prisma-client-typescript-postgresql.md)
- [イントロスペクション](./prisma/docs/getting-started/setup-prisma/add-to-existing-project/relational-databases/introspection-typescript-postgresql.md)
- [データベースクエリ](./prisma/docs/getting-started/setup-prisma/add-to-existing-project/relational-databases/querying-the-database-typescript-postgresql.md)
- [次のステップ](./prisma/docs/getting-started/setup-prisma/add-to-existing-project/relational-databases/next-steps.md)

#### ゼロからのスタート

**MongoDB:**
- [MongoDB ゼロスタート](./prisma/docs/getting-started/setup-prisma/start-from-scratch/mongodb-typescript-mongodb.md)
- [データベース接続](./prisma/docs/getting-started/setup-prisma/start-from-scratch/mongodb/connect-your-database-typescript-mongodb.md)
- [Prismaスキーマ作成](./prisma/docs/getting-started/setup-prisma/start-from-scratch/mongodb/creating-the-prisma-schema-typescript-mongodb.md)
- [Prisma Clientインストール](./prisma/docs/getting-started/setup-prisma/start-from-scratch/mongodb/install-prisma-client-typescript-mongodb.md)
- [データベースクエリ](./prisma/docs/getting-started/setup-prisma/start-from-scratch/mongodb/querying-the-database-typescript-mongodb.md)
- [次のステップ](./prisma/docs/getting-started/setup-prisma/start-from-scratch/mongodb/next-steps.md)

**リレーショナルデータベース:**
- [リレーショナルDB ゼロスタート](./prisma/docs/getting-started/setup-prisma/start-from-scratch/relational-databases-typescript-prismaPostgres.md)
- [データベース接続](./prisma/docs/getting-started/setup-prisma/start-from-scratch/relational-databases/connect-your-database-typescript-postgresql.md)
- [Prisma Clientインストール](./prisma/docs/getting-started/setup-prisma/start-from-scratch/relational-databases/install-prisma-client-typescript-postgresql.md)
- [Prisma Migrateの使用](./prisma/docs/getting-started/setup-prisma/start-from-scratch/relational-databases/using-prisma-migrate-typescript-postgresql.md)
- [データベースクエリ](./prisma/docs/getting-started/setup-prisma/start-from-scratch/relational-databases/querying-the-database-typescript-postgresql.md)
- [次のステップ](./prisma/docs/getting-started/setup-prisma/start-from-scratch/relational-databases/next-steps.md)

### 🔧 Prisma ORM

- [ORM 概要](./prisma/docs/orm.md)

#### Overview（概要）

- [概要トップ](./prisma/docs/orm/overview.md)
- [Prisma ORM の紹介](./prisma/docs/orm/overview/introduction.md)
- [データベース](./prisma/docs/orm/overview/databases.md)
- [スタックでのPrisma](./prisma/docs/orm/overview/prisma-in-your-stack.md)
- [Prisma ORMを超えて](./prisma/docs/orm/overview/beyond-prisma-orm.md)

#### Prisma Schema（スキーマ）

- [Prisma Schema 概要](./prisma/docs/orm/prisma-schema.md)
- [スキーマ概要](./prisma/docs/orm/prisma-schema/overview.md)
- [イントロスペクション](./prisma/docs/orm/prisma-schema/introspection.md)
- [PostgreSQL拡張機能](./prisma/docs/orm/prisma-schema/postgresql-extensions.md)

**Data Model（データモデル）:**
- [データモデル](./prisma/docs/orm/prisma-schema/data-model.md)
- [モデル](./prisma/docs/orm/prisma-schema/data-model/models.md)
- [リレーション](./prisma/docs/orm/prisma-schema/data-model/relations.md)
- [インデックス](./prisma/docs/orm/prisma-schema/data-model/indexes.md)
- [ビュー](./prisma/docs/orm/prisma-schema/data-model/views.md)
- [データベースマッピング](./prisma/docs/orm/prisma-schema/data-model/database-mapping.md)
- [マルチスキーマ](./prisma/docs/orm/prisma-schema/data-model/multi-schema.md)
- [テーブル継承](./prisma/docs/orm/prisma-schema/data-model/table-inheritance.md)
- [外部管理テーブル](./prisma/docs/orm/prisma-schema/data-model/externally-managed-tables.md)
- [サポート外のデータベース機能](./prisma/docs/orm/prisma-schema/data-model/unsupported-database-features.md)

#### Prisma Client

**Setup & Configuration（セットアップと設定）:**
- [Prisma Clientの生成](./prisma/docs/orm/prisma-client/setup-and-configuration/generating-prisma-client.md)
- [Prisma Clientのインスタンス化](./prisma/docs/orm/prisma-client/setup-and-configuration/instantiate-prisma-client.md)
- [データベース接続](./prisma/docs/orm/prisma-client/setup-and-configuration/databases-connections.md)
- [リードレプリカ](./prisma/docs/orm/prisma-client/setup-and-configuration/read-replicas.md)
- [カスタムモデルとフィールド名](./prisma/docs/orm/prisma-client/setup-and-configuration/custom-model-and-field-names.md)
- [エラーフォーマット](./prisma/docs/orm/prisma-client/setup-and-configuration/error-formatting.md)

**Queries（クエリ）:**
- [CRUD操作](./prisma/docs/orm/prisma-client/queries/crud.md)
- [フィルタリングとソート](./prisma/docs/orm/prisma-client/queries/filtering-and-sorting.md)
- [リレーションクエリ](./prisma/docs/orm/prisma-client/queries/relation-queries.md)
- [ページネーション](./prisma/docs/orm/prisma-client/queries/pagination.md)
- [集計・グループ化・要約](./prisma/docs/orm/prisma-client/queries/aggregation-grouping-summarizing.md)
- [トランザクション](./prisma/docs/orm/prisma-client/queries/transactions.md)
- [フィールド選択](./prisma/docs/orm/prisma-client/queries/select-fields.md)
- [フィールド除外](./prisma/docs/orm/prisma-client/queries/excluding-fields.md)
- [計算フィールド](./prisma/docs/orm/prisma-client/queries/computed-fields.md)
- [カスタムモデル](./prisma/docs/orm/prisma-client/queries/custom-models.md)
- [カスタムバリデーション](./prisma/docs/orm/prisma-client/queries/custom-validation.md)
- [全文検索](./prisma/docs/orm/prisma-client/queries/full-text-search.md)
- [大文字小文字の区別](./prisma/docs/orm/prisma-client/queries/case-sensitivity.md)
- [クエリ最適化とパフォーマンス](./prisma/docs/orm/prisma-client/queries/query-optimization-performance.md)

**Using Raw SQL（生SQLの使用）:**
- [生クエリ](./prisma/docs/orm/prisma-client/using-raw-sql/raw-queries.md)
- [TypedSQL](./prisma/docs/orm/prisma-client/using-raw-sql/typedsql.md)
- [SafeQL](./prisma/docs/orm/prisma-client/using-raw-sql/safeql.md)

**Special Fields & Types（特殊フィールドと型）:**
- [特殊フィールドと型](./prisma/docs/orm/prisma-client/special-fields-and-types.md)
- [複合型](./prisma/docs/orm/prisma-client/special-fields-and-types/composite-types.md)
- [NullとUndefined](./prisma/docs/orm/prisma-client/special-fields-and-types/null-and-undefined.md)
- [JSONフィールドの操作](./prisma/docs/orm/prisma-client/special-fields-and-types/working-with-json-fields.md)
- [スカラーリスト（配列）の操作](./prisma/docs/orm/prisma-client/special-fields-and-types/working-with-scalar-lists-arrays.md)
- [複合IDと制約の操作](./prisma/docs/orm/prisma-client/special-fields-and-types/working-with-composite-ids-and-constraints.md)

**Client Extensions（クライアント拡張）:**
- [Client Extensions 概要](./prisma/docs/orm/prisma-client/client-extensions.md)
- [Client拡張](./prisma/docs/orm/prisma-client/client-extensions/client.md)
- [Model拡張](./prisma/docs/orm/prisma-client/client-extensions/model.md)
- [Query拡張](./prisma/docs/orm/prisma-client/client-extensions/query.md)
- [Result拡張](./prisma/docs/orm/prisma-client/client-extensions/result.md)
- [型ユーティリティ](./prisma/docs/orm/prisma-client/client-extensions/type-utilities.md)
- [拡張例](./prisma/docs/orm/prisma-client/client-extensions/extension-examples.md)
- [共有拡張機能](./prisma/docs/orm/prisma-client/client-extensions/shared-extensions.md)
  - [Permit RBAC](./prisma/docs/orm/prisma-client/client-extensions/shared-extensions/permit-rbac.md)

**Middleware（ミドルウェア）:**
- [ミドルウェア](./prisma/docs/orm/prisma-client/client-extensions/middleware.md)
- [ロギングミドルウェア](./prisma/docs/orm/prisma-client/client-extensions/middleware/logging-middleware.md)
- [セッションデータミドルウェア](./prisma/docs/orm/prisma-client/client-extensions/middleware/session-data-middleware.md)
- [ソフト削除ミドルウェア](./prisma/docs/orm/prisma-client/client-extensions/middleware/soft-delete-middleware.md)

**Type Safety（型安全性）:**
- [型安全性](./prisma/docs/orm/prisma-client/type-safety.md)
- [Prisma型システム](./prisma/docs/orm/prisma-client/type-safety/prisma-type-system.md)
- [部分的な構造での操作](./prisma/docs/orm/prisma-client/type-safety/operating-against-partial-structures-of-model-types.md)
- [Prisma Validator](./prisma/docs/orm/prisma-client/type-safety/prisma-validator.md)

**Testing（テスト）:**
- [テスト](./prisma/docs/orm/prisma-client/testing.md)
- [ユニットテスト](./prisma/docs/orm/prisma-client/testing/unit-testing.md)
- [統合テスト](./prisma/docs/orm/prisma-client/testing/integration-testing.md)

**Deployment（デプロイ）:**
- [デプロイ概要](./prisma/docs/orm/prisma-client/deployment.md)
- [Prismaのデプロイ](./prisma/docs/orm/prisma-client/deployment/deploy-prisma.md)
- [Prisma Migrateでのデータベース変更のデプロイ](./prisma/docs/orm/prisma-client/deployment/deploy-database-changes-with-prisma-migrate.md)
- [モジュールバンドラー](./prisma/docs/orm/prisma-client/deployment/module-bundlers.md)

**Edge環境:**
- [Edge概要](./prisma/docs/orm/prisma-client/deployment/edge/overview.md)
- [Cloudflareへのデプロイ](./prisma/docs/orm/prisma-client/deployment/edge/deploy-to-cloudflare.md)
- [Deno Deployへのデプロイ](./prisma/docs/orm/prisma-client/deployment/edge/deploy-to-deno-deploy.md)
- [Vercelへのデプロイ](./prisma/docs/orm/prisma-client/deployment/edge/deploy-to-vercel.md)

**Serverless環境:**
- [Serverless概要](./prisma/docs/orm/prisma-client/deployment/serverless.md)
- [AWS Lambdaへのデプロイ](./prisma/docs/orm/prisma-client/deployment/serverless/deploy-to-aws-lambda.md)
- [Azure Functionsへのデプロイ](./prisma/docs/orm/prisma-client/deployment/serverless/deploy-to-azure-functions.md)
- [Netlifyへのデプロイ](./prisma/docs/orm/prisma-client/deployment/serverless/deploy-to-netlify.md)
- [Vercelへのデプロイ](./prisma/docs/orm/prisma-client/deployment/serverless/deploy-to-vercel.md)

**Traditional環境:**
- [Traditional概要](./prisma/docs/orm/prisma-client/deployment/traditional.md)
- [Fly.ioへのデプロイ](./prisma/docs/orm/prisma-client/deployment/traditional/deploy-to-flyio.md)
- [Herokuへのデプロイ](./prisma/docs/orm/prisma-client/deployment/traditional/deploy-to-heroku.md)
- [Koyebへのデプロイ](./prisma/docs/orm/prisma-client/deployment/traditional/deploy-to-koyeb.md)
- [Railwayへのデプロイ](./prisma/docs/orm/prisma-client/deployment/traditional/deploy-to-railway.md)
- [Renderへのデプロイ](./prisma/docs/orm/prisma-client/deployment/traditional/deploy-to-render.md)
- [Sevallaへのデプロイ](./prisma/docs/orm/prisma-client/deployment/traditional/deploy-to-sevalla.md)

**Observability & Logging（可観測性とロギング）:**
- [可観測性とロギング](./prisma/docs/orm/prisma-client/observability-and-logging.md)
- [ロギング](./prisma/docs/orm/prisma-client/observability-and-logging/logging.md)
- [メトリクス](./prisma/docs/orm/prisma-client/observability-and-logging/metrics.md)
- [OpenTelemetryトレーシング](./prisma/docs/orm/prisma-client/observability-and-logging/opentelemetry-tracing.md)

**Debugging & Troubleshooting（デバッグとトラブルシューティング）:**
- [デバッグとトラブルシューティング](./prisma/docs/orm/prisma-client/debugging-and-troubleshooting.md)
- [デバッグ](./prisma/docs/orm/prisma-client/debugging-and-troubleshooting/debugging.md)
- [例外とエラーの処理](./prisma/docs/orm/prisma-client/debugging-and-troubleshooting/handling-exceptions-and-errors.md)
- [バイナリサイズ問題のトラブルシューティング](./prisma/docs/orm/prisma-client/debugging-and-troubleshooting/troubleshooting-binary-size-issues.md)

#### Prisma Migrate

- [Prisma Migrate 概要](./prisma/docs/orm/prisma-migrate.md)
- [はじめに](./prisma/docs/orm/prisma-migrate/getting-started.md)

**Understanding Prisma Migrate（Prisma Migrateの理解）:**
- [Prisma Migrateの理解](./prisma/docs/orm/prisma-migrate/understanding-prisma-migrate.md)
- [概要](./prisma/docs/orm/prisma-migrate/understanding-prisma-migrate/overview.md)
- [メンタルモデル](./prisma/docs/orm/prisma-migrate/understanding-prisma-migrate/mental-model.md)
- [マイグレーション履歴](./prisma/docs/orm/prisma-migrate/understanding-prisma-migrate/migration-histories.md)
- [シャドウデータベース](./prisma/docs/orm/prisma-migrate/understanding-prisma-migrate/shadow-database.md)
- [制限事項と既知の問題](./prisma/docs/orm/prisma-migrate/understanding-prisma-migrate/limitations-and-known-issues.md)

**Workflows（ワークフロー）:**
- [ワークフロー](./prisma/docs/orm/prisma-migrate/workflows.md)
- [開発と本番環境](./prisma/docs/orm/prisma-migrate/workflows/development-and-production.md)
- [チーム開発](./prisma/docs/orm/prisma-migrate/workflows/team-development.md)
- [スキーマのプロトタイピング](./prisma/docs/orm/prisma-migrate/workflows/prototyping-your-schema.md)
- [マイグレーションのカスタマイズ](./prisma/docs/orm/prisma-migrate/workflows/customizing-migrations.md)
- [データマイグレーション](./prisma/docs/orm/prisma-migrate/workflows/data-migration.md)
- [シーディング](./prisma/docs/orm/prisma-migrate/workflows/seeding.md)
- [ベースライン化](./prisma/docs/orm/prisma-migrate/workflows/baselining.md)
- [マイグレーションの圧縮](./prisma/docs/orm/prisma-migrate/workflows/squashing-migrations.md)
- [ダウンマイグレーションの生成](./prisma/docs/orm/prisma-migrate/workflows/generating-down-migrations.md)
- [パッチとホットフィックス](./prisma/docs/orm/prisma-migrate/workflows/patching-and-hotfixing.md)
- [トラブルシューティング](./prisma/docs/orm/prisma-migrate/workflows/troubleshooting.md)
- [サポート外のデータベース機能](./prisma/docs/orm/prisma-migrate/workflows/unsupported-database-features.md)

#### Tools（ツール）

- [ツール概要](./prisma/docs/orm/tools.md)
- [Prisma CLI](./prisma/docs/orm/tools/prisma-cli.md)
- [Prisma Studio](./prisma/docs/orm/tools/prisma-studio.md)

#### Reference（リファレンス）

- [リファレンス概要](./prisma/docs/orm/reference.md)
- [Prisma Schema リファレンス](./prisma/docs/orm/reference/prisma-schema-reference.md)
- [Prisma Client リファレンス](./prisma/docs/orm/reference/prisma-client-reference.md)
- [Prisma CLI リファレンス](./prisma/docs/orm/reference/prisma-cli-reference.md)
- [Prisma Config リファレンス](./prisma/docs/orm/reference/prisma-config-reference.md)
- [環境変数リファレンス](./prisma/docs/orm/reference/environment-variables-reference.md)
- [エラーリファレンス](./prisma/docs/orm/reference/error-reference.md)

### 🗄️ Prisma Postgres

- [Postgres 概要](./prisma/docs/postgres.md)

#### Introduction（導入）

- [概要](./prisma/docs/postgres/introduction/overview.md)
- [はじめに](./prisma/docs/postgres/introduction/getting-started.md)
- [既存データベースからのインポート](./prisma/docs/postgres/introduction/import-from-existing-database.md)
- [npx create-db](./prisma/docs/postgres/introduction/npx-create-db.md)
- [Management API](./prisma/docs/postgres/introduction/management-api.md)

#### Database（データベース）

- [接続プーリング](./prisma/docs/postgres/database/connection-pooling.md)
- [キャッシング](./prisma/docs/postgres/database/caching.md)
- [バックアップ](./prisma/docs/postgres/database/backups.md)
- [ローカル開発](./prisma/docs/postgres/database/local-development.md)
- [PostgreSQL拡張機能](./prisma/docs/postgres/database/postgres-extensions.md)
- [サーバーレスドライバー](./prisma/docs/postgres/database/serverless-driver.md)

**Prisma Studio:**
- [Prisma Studio](./prisma/docs/postgres/database/prisma-studio.md)
- [Studioの埋め込み](./prisma/docs/postgres/database/prisma-studio/embedding-studio.md)
- [VS CodeでのStudio](./prisma/docs/postgres/database/prisma-studio/studio-in-vs-code.md)

**API Reference:**
- [APIリファレンス](./prisma/docs/postgres/database/api-reference.md)
- [Caching API](./prisma/docs/postgres/database/api-reference/caching-api.md)
- [エラーリファレンス](./prisma/docs/postgres/database/api-reference/error-reference.md)

#### Query Optimization（クエリ最適化）

- [クエリ最適化概要](./prisma/docs/postgres/query-optimization.md)
- [セットアップ](./prisma/docs/postgres/query-optimization/setup.md)
- [パフォーマンスメトリクス](./prisma/docs/postgres/query-optimization/performance-metrics.md)
- [レコーディング](./prisma/docs/postgres/query-optimization/recordings.md)
- [Prisma AI](./prisma/docs/postgres/query-optimization/prisma-ai.md)
- [推奨事項](./prisma/docs/postgres/query-optimization/recommendations.md)

**Recommendations（推奨事項）:**
- [インデックスされていないカラムでのクエリ](./prisma/docs/postgres/query-optimization/recommendations/queries-on-unindexed-columns.md)
- [ユニークカラムでのインデックス化](./prisma/docs/postgres/query-optimization/recommendations/indexing-on-unique-columns.md)
- [不要なインデックス](./prisma/docs/postgres/query-optimization/recommendations/unnecessary-indexes.md)
- [LIKE操作による全テーブルスキャン](./prisma/docs/postgres/query-optimization/recommendations/full-table-scans-caused-by-like-operations.md)
- [過剰な行数の返却](./prisma/docs/postgres/query-optimization/recommendations/excessive-number-of-rows-returned.md)
- [長時間実行トランザクション](./prisma/docs/postgres/query-optimization/recommendations/long-running-transactions.md)
- [反復クエリ](./prisma/docs/postgres/query-optimization/recommendations/repeated-query.md)
- [SELECT RETURNING](./prisma/docs/postgres/query-optimization/recommendations/select-returning.md)
- [現在時刻](./prisma/docs/postgres/query-optimization/recommendations/current-time.md)
- [BLOBのデータベース保存](./prisma/docs/postgres/query-optimization/recommendations/storing-blob-in-database.md)
- [CHARの回避](./prisma/docs/postgres/query-optimization/recommendations/avoid-char.md)
- [VARCHARの回避](./prisma/docs/postgres/query-optimization/recommendations/avoid-varchar.md)
- [DB MONEYの回避](./prisma/docs/postgres/query-optimization/recommendations/avoid-db-money.md)
- [TIMESTAMP/TIMESTAMPZ(0)の回避](./prisma/docs/postgres/query-optimization/recommendations/avoid-timestamp-timestampz-0.md)

#### Integrations（統合）

- [統合概要](./prisma/docs/postgres/integrations.md)
- [Vercel統合](./prisma/docs/postgres/integrations/vercel.md)
- [Netlify統合](./prisma/docs/postgres/integrations/netlify.md)
- [VS Code統合](./prisma/docs/postgres/integrations/vscode.md)
- [IDX統合](./prisma/docs/postgres/integrations/idx.md)
- [MCPサーバー](./prisma/docs/postgres/integrations/mcp-server.md)
- [データの表示](./prisma/docs/postgres/integrations/viewing-data.md)

#### More（その他）

- [その他概要](./prisma/docs/postgres/more.md)
- [FAQ](./prisma/docs/postgres/more/faq.md)
- [トラブルシューティング](./prisma/docs/postgres/more/troubleshooting.md)

### 🌐 Prisma Platform

- [Platform 概要](./prisma/docs/platform.md)
- [Platformについて](./prisma/docs/platform/about.md)
- [成熟度レベル](./prisma/docs/platform/maturity-levels.md)
- [サポート](./prisma/docs/platform/support.md)

#### Platform CLI

- [Platform CLI](./prisma/docs/platform/platform-cli.md)
- [Platform CLIについて](./prisma/docs/platform/platform-cli/about.md)
- [コマンド](./prisma/docs/platform/platform-cli/commands.md)

## その他のドキュメント

- [README](./prisma/README.md) - プロジェクト概要と進捗状況
- [翻訳ステータス](./prisma/TRANSLATION_STATUS.md) - 翻訳の進捗状況
- [進捗レポート](./prisma/docs/PROGRESS_REPORT.md) - 詳細な進捗レポート

## 学習パス

### 初心者向け

1. [Getting Started 概要](./prisma/docs/getting-started.md)
2. [Prisma ORM の紹介](./prisma/docs/orm/overview/introduction.md)
3. [ゼロからのスタート（リレーショナルDB）](./prisma/docs/getting-started/setup-prisma/start-from-scratch/relational-databases-typescript-prismaPostgres.md)
4. [CRUD操作](./prisma/docs/orm/prisma-client/queries/crud.md)

### 中級者向け

1. [データモデル](./prisma/docs/orm/prisma-schema/data-model.md)
2. [リレーションクエリ](./prisma/docs/orm/prisma-client/queries/relation-queries.md)
3. [Prisma Migrateの理解](./prisma/docs/orm/prisma-migrate/understanding-prisma-migrate.md)
4. [開発と本番環境のワークフロー](./prisma/docs/orm/prisma-migrate/workflows/development-and-production.md)

### 上級者向け

1. [Client Extensions](./prisma/docs/orm/prisma-client/client-extensions.md)
2. [クエリ最適化とパフォーマンス](./prisma/docs/orm/prisma-client/queries/query-optimization-performance.md)
3. [TypedSQL](./prisma/docs/orm/prisma-client/using-raw-sql/typedsql.md)
4. [デプロイ戦略](./prisma/docs/orm/prisma-client/deployment.md)

## 公式リソース

- **公式サイト**: https://www.prisma.io/
- **ドキュメント**: https://www.prisma.io/docs
- **GitHub**: https://github.com/prisma/prisma
- **Discord**: https://pris.ly/discord
- **Twitter**: https://twitter.com/prisma

## 関連技術

- TypeScript / JavaScript
- Node.js
- PostgreSQL / MySQL / SQLite / MongoDB / SQL Server / CockroachDB
- Next.js / Express / NestJS
- GraphQL / REST API

---

**Note**: このドキュメントは、`docs/libs/prisma/` 配下のすべてのPrismaドキュメントへのナビゲーションを提供します。各リンクは日本語で翻訳されたドキュメントを指しています。
