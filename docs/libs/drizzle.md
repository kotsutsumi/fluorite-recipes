# Drizzle ORM ドキュメント

Drizzle ORMは、TypeScript向けの軽量で型安全なORMです。このドキュメントは、Drizzle ORMの全機能を網羅した日本語リファレンスです。

## 📚 目次

### 🚀 はじめに

#### 基本ドキュメント
- [概要](./drizzle/docs/overview.md) - Drizzle ORMの概要と特徴
- [はじめる](./drizzle/docs/get-started.md) - インストールとセットアップ
- [ガイド一覧](./drizzle/docs/guides.md) - 各種ガイドへのインデックス

### 🗄️ スキーマ定義

#### データベース構造
- [PostgreSQLカラム型](./drizzle/docs/column-types/pg.md) - PostgreSQLで使用可能な全カラム型
- [インデックスと制約](./drizzle/docs/indexes-constraints.md) - インデックス、主キー、外部キー、ユニーク制約
- [シーケンス](./drizzle/docs/sequences.md) - データベースシーケンスの定義と使用
- [ビュー](./drizzle/docs/views.md) - データベースビューの作成と管理
- [スキーマ](./drizzle/docs/schemas.md) - データベーススキーマの管理
- [生成カラム](./drizzle/docs/generated-columns.md) - 自動生成カラムの定義

#### 高度な機能
- [リレーション](./drizzle/docs/relations.md) - テーブル間のリレーション定義
- [行レベルセキュリティ (RLS)](./drizzle/docs/rls.md) - PostgreSQLの行レベルセキュリティ
- [PostgreSQL拡張機能](./drizzle/docs/extensions/pg.md) - PostgreSQL拡張機能の使用
- [カスタム型](./drizzle/docs/custom-types.md) - カスタムデータ型の定義

### 🔧 Drizzle Kit（マイグレーションツール）

#### 概要と設定
- [Drizzle Kit概要](./drizzle/docs/kit-overview.md) - Drizzle Kitの紹介
- [設定ファイル](./drizzle/docs/drizzle-config-file.md) - drizzle.config.tsの設定方法

#### コマンド
- [generate](./drizzle/docs/drizzle-kit-generate.md) - マイグレーションファイルの生成
- [migrate](./drizzle/docs/drizzle-kit-migrate.md) - マイグレーションの実行
- [push](./drizzle/docs/drizzle-kit-push.md) - スキーマの直接プッシュ
- [pull](./drizzle/docs/drizzle-kit-pull.md) - データベースからスキーマを取得
- [export](./drizzle/docs/drizzle-kit-export.md) - スキーマのエクスポート
- [check](./drizzle/docs/drizzle-kit-check.md) - マイグレーションの整合性チェック
- [up](./drizzle/docs/drizzle-kit-up.md) - マイグレーションのアップグレード
- [studio](./drizzle/docs/drizzle-kit-studio.md) - Drizzle Studioの起動

#### 高度なマイグレーション
- [カスタムマイグレーション](./drizzle/docs/kit-custom-migrations.md) - カスタムマイグレーションの作成
- [チームでのマイグレーション](./drizzle/docs/kit-migrations-for-teams.md) - チーム開発でのマイグレーション管理
- [Web/モバイルでの使用](./drizzle/docs/kit-web-mobile.md) - Web・モバイル環境での使用方法

### 🌱 シード機能

- [シード概要](./drizzle/docs/seed-overview.md) - データシード機能の概要
- [シード関数](./drizzle/docs/seed-functions.md) - シード用の便利な関数
- [シードバージョニング](./drizzle/docs/seed-versioning.md) - シードのバージョン管理

### 🔍 クエリ操作

#### 基本クエリ
- [リレーショナルクエリビルダー](./drizzle/docs/rqb.md) - リレーショナルクエリの構築
- [SELECT](./drizzle/docs/select.md) - データの取得
- [INSERT](./drizzle/docs/insert.md) - データの挿入
- [UPDATE](./drizzle/docs/update.md) - データの更新
- [DELETE](./drizzle/docs/delete.md) - データの削除

#### クエリビルディング
- [オペレーター](./drizzle/docs/operators.md) - 比較・論理演算子
- [クエリユーティリティ](./drizzle/docs/query-utils.md) - クエリ用ユーティリティ関数
- [JOIN](./drizzle/docs/joins.md) - テーブル結合
- [SQL](./drizzle/docs/sql.md) - 生SQLの使用
- [動的クエリ構築](./drizzle/docs/dynamic-query-building.md) - 条件付き動的クエリ
- [集合演算](./drizzle/docs/set-operations.md) - UNION、INTERSECT、EXCEPT

### 🎯 実践ガイド

#### クエリパターン
- [条件付きフィルター](./drizzle/docs/guides/conditional-filters-in-query.md) - 条件付きWHERE句の実装
- [値のインクリメント](./drizzle/docs/guides/incrementing-a-value.md) - カウンターの増加
- [値のデクリメント](./drizzle/docs/guides/decrementing-a-value.md) - カウンターの減少
- [カラムの選択・除外](./drizzle/docs/guides/include-or-exclude-columns.md) - 特定カラムの選択
- [ブール値の切り替え](./drizzle/docs/guides/toggling-a-boolean-field.md) - true/falseの反転
- [行数のカウント](./drizzle/docs/guides/count-rows.md) - レコード数の取得
- [UPSERT](./drizzle/docs/guides/upsert.md) - INSERT or UPDATE操作

#### ページネーション
- [LIMIT/OFFSETページネーション](./drizzle/docs/guides/limit-offset-pagination.md) - オフセットベースのページング
- [カーソルベースページネーション](./drizzle/docs/guides/cursor-based-pagination.md) - カーソルベースのページング

#### データ型と初期値
- [タイムスタンプのデフォルト値](./drizzle/docs/guides/timestamp-default-value.md) - 現在時刻の設定
- [空配列のデフォルト値](./drizzle/docs/guides/empty-array-default-value.md) - 空の配列の初期化

#### 高度な操作
- [複数行の異なる値での更新](./drizzle/docs/guides/update-many-with-different-value.md) - バルク更新
- [大文字小文字を区別しないユニークなメール](./drizzle/docs/guides/unique-case-insensitive-email.md) - メールの一意性制約
- [子行を持つ親行の選択](./drizzle/docs/guides/select-parent-rows-with-at-least-one-related-child-row.md) - 関連データのフィルタリング

#### 検索機能
- [PostgreSQL全文検索](./drizzle/docs/guides/postgresql-full-text-search.md) - 全文検索の実装
- [生成カラムでの全文検索](./drizzle/docs/guides/full-text-search-with-generated-columns.md) - 生成カラムを使った検索
- [ベクトル類似度検索](./drizzle/docs/guides/vector-similarity-search.md) - ベクトル検索の実装

#### 位置情報
- [PostgreSQL POINTデータ型](./drizzle/docs/guides/point-datatype-psql.md) - POINT型の使用
- [PostGIS Geometryポイント](./drizzle/docs/guides/postgis-geometry-point.md) - PostGISでの位置情報

#### 開発環境
- [PostgreSQLローカルセットアップ](./drizzle/docs/guides/postgresql-local-setup.md) - PostgreSQLのローカル環境構築
- [MySQLローカルセットアップ](./drizzle/docs/guides/mysql-local-setup.md) - MySQLのローカル環境構築

#### その他
- [Gel外部認証](./drizzle/docs/guides/gel-ext-auth.md) - 外部認証の統合
- [D1 HTTPとDrizzle Kit](./drizzle/docs/guides/d1-http-with-drizzle-kit.md) - Cloudflare D1での使用
- [部分的に公開されたテーブルでのシード](./drizzle/docs/guides/seeding-with-partially-exposed-tables.md) - シード時のテーブル制限
- [withオプションを使用したシード](./drizzle/docs/guides/seeding-using-with-option.md) - リレーションを含むシード

### 📖 チュートリアル

#### Netlify Edge Functions
- [Netlify Edge Functions + Neon](./drizzle/docs/tutorials/drizzle-with-netlify-edge-functions-neon.md)
- [Netlify Edge Functions + Supabase](./drizzle/docs/tutorials/drizzle-with-netlify-edge-functions-supabase.md)

#### その他のEdge Functions
- [Supabase Edge Functions](./drizzle/docs/tutorials/drizzle-with-supabase-edge-functions.md)
- [Vercel Edge Functions](./drizzle/docs/tutorials/drizzle-with-vercel-edge-functions.md)

#### データベースプロバイダー
- [Neon](./drizzle/docs/tutorials/drizzle-with-neon.md) - Neonとの統合
- [Nile](./drizzle/docs/tutorials/drizzle-with-nile.md) - Nileとの統合

### ⚡ パフォーマンスと最適化

#### パフォーマンス
- [クエリパフォーマンス](./drizzle/docs/perf-queries.md) - クエリの最適化
- [サーバーレス環境でのパフォーマンス](./drizzle/docs/perf-serverless.md) - サーバーレス最適化

#### 高度な機能
- [トランザクション](./drizzle/docs/transactions.md) - トランザクション処理
- [バッチAPI](./drizzle/docs/batch-api.md) - バッチ処理
- [キャッシュ](./drizzle/docs/cache.md) - クエリキャッシング
- [リードレプリカ](./drizzle/docs/read-replicas.md) - 読み取り専用レプリカの使用

### 🔌 統合・拡張

#### バリデーション
- [Zod](./drizzle/docs/zod.md) - Zodスキーマバリデーション
- [Typebox](./drizzle/docs/typebox.md) - Typeboxバリデーション
- [Valibot](./drizzle/docs/valibot.md) - Valibotバリデーション
- [ArkType](./drizzle/docs/arktype.md) - ArkTypeバリデーション

#### ツール
- [ESLintプラグイン](./drizzle/docs/eslint-plugin.md) - Drizzle用ESLintルール
- [Prisma](./drizzle/docs/prisma.md) - Prismaからの移行
- [GraphQL](./drizzle/docs/graphql.md) - GraphQLとの統合
- [便利機能](./drizzle/docs/goodies.md) - その他の便利な機能

## 🎓 学習パス

### 初心者向け
1. [概要](./drizzle/docs/overview.md)を読んで全体像を把握
2. [はじめる](./drizzle/docs/get-started.md)でセットアップ
3. [PostgreSQLカラム型](./drizzle/docs/column-types/pg.md)でスキーマ定義を学習
4. [SELECT](./drizzle/docs/select.md)、[INSERT](./drizzle/docs/insert.md)、[UPDATE](./drizzle/docs/update.md)、[DELETE](./drizzle/docs/delete.md)で基本操作を習得

### 中級者向け
1. [Drizzle Kit概要](./drizzle/docs/kit-overview.md)でマイグレーションツールを理解
2. [リレーション](./drizzle/docs/relations.md)でテーブル間の関係を学習
3. [JOIN](./drizzle/docs/joins.md)で複雑なクエリを構築
4. [トランザクション](./drizzle/docs/transactions.md)でデータ整合性を確保

### 上級者向け
1. [動的クエリ構築](./drizzle/docs/dynamic-query-building.md)で柔軟なクエリを作成
2. [クエリパフォーマンス](./drizzle/docs/perf-queries.md)で最適化を学習
3. [カスタム型](./drizzle/docs/custom-types.md)で独自のデータ型を定義
4. [リードレプリカ](./drizzle/docs/read-replicas.md)でスケーラビリティを向上

## 💡 よく使う機能

### 開発中によく参照するドキュメント
- [オペレーター](./drizzle/docs/operators.md) - WHERE句の条件指定
- [クエリユーティリティ](./drizzle/docs/query-utils.md) - 便利な関数
- [条件付きフィルター](./drizzle/docs/guides/conditional-filters-in-query.md) - 動的なフィルタリング
- [UPSERT](./drizzle/docs/guides/upsert.md) - 存在確認と挿入/更新
- [ページネーション](./drizzle/docs/guides/limit-offset-pagination.md) - データの分割取得

### マイグレーション作業時
- [generate](./drizzle/docs/drizzle-kit-generate.md) - マイグレーションファイル生成
- [migrate](./drizzle/docs/drizzle-kit-migrate.md) - マイグレーション実行
- [push](./drizzle/docs/drizzle-kit-push.md) - 開発環境での即座な反映
- [studio](./drizzle/docs/drizzle-kit-studio.md) - GUIでのデータ確認

### 本番環境での使用
- [トランザクション](./drizzle/docs/transactions.md) - データ整合性の保証
- [バッチAPI](./drizzle/docs/batch-api.md) - 効率的な一括処理
- [サーバーレス環境でのパフォーマンス](./drizzle/docs/perf-serverless.md) - Edge環境での最適化
- [リードレプリカ](./drizzle/docs/read-replicas.md) - 読み取り負荷の分散

## 🔗 公式リソース

- [公式サイト](https://orm.drizzle.team/)
- [GitHub](https://github.com/drizzle-team/drizzle-orm)
- [Discord](https://discord.gg/drizzle)

## 📝 ドキュメントについて

このドキュメントは、[Drizzle ORM公式ドキュメント](https://orm.drizzle.team/docs/)の日本語訳です。

- すべてのコード例は元の英語のまま保持されています
- 技術用語は適切な日本語訳を使用していますが、一般的な英語表記も併記しています
- Markdownフォーマットとリンクは元のドキュメントに従っています

## 🚀 クイックスタート

```typescript
// 1. インストール
// npm install drizzle-orm postgres
// npm install -D drizzle-kit

// 2. スキーマ定義
import { pgTable, serial, text, timestamp } from 'drizzle-orm/pg-core';

export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  email: text('email').notNull().unique(),
  createdAt: timestamp('created_at').defaultNow(),
});

// 3. データベース接続
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';

const client = postgres(process.env.DATABASE_URL!);
const db = drizzle(client);

// 4. クエリ実行
const allUsers = await db.select().from(users);
const newUser = await db.insert(users).values({
  name: 'John Doe',
  email: 'john@example.com',
});
```

詳細は[はじめる](./drizzle/docs/get-started.md)をご覧ください。

---

**最終更新**: 2025-10-17
