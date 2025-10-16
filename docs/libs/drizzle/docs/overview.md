# Drizzle ORMドキュメント

## 概要

Drizzle ORMは、軽量でパフォーマンスが高く、サーバーレス対応に設計された「headを持つheadless TypeScript ORM」です。

### キーコンセプト
> Drizzleは、必要なときにそばにいて、スペースが必要なときには邪魔をしない良き友人です。

## コアプリンシプル

### Headless ORM
- ライブラリとオプトインツールのコレクション
- ORMを中心としてではなく、ORMと共にプロジェクトを構築可能
- プロジェクト構造の柔軟性を提供

### SQLライクなアプローチ
- SQL構文を採用
- 学習曲線が最小限
- 抽象化ゼロでSQLの全機能を活用

### サーバーレス設計
- 依存関係ゼロ
- スリムで高パフォーマンス
- 複数のデータベースドライバーをネイティブサポート
- PostgreSQL、MySQL、SQLite、SingleStoreをサポート

## 主な機能

### クエリ機能
1. SQLライクなクエリAPI
2. リレーショナルクエリAPI
3. 自動マイグレーション
4. ネストされたデータフェッチ

### コード例

#### スキーマ定義
```typescript
export const countries = pgTable('countries', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 256 }),
});

export const cities = pgTable('cities', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 256 }),
  countryId: integer('country_id').references(() => countries.id),
});
```

#### クエリ例
```typescript
// SQLライクなクエリ
await db
  .select()
  .from(countries)
  .leftJoin(cities, eq(cities.countryId, countries.id))
  .where(eq(countries.id, 10))

// リレーショナルクエリ
const result = await db.query.users.findMany({
  with: {
    posts: true
  },
});
```

## コミュニティとサポート
- アクティブなDiscordコミュニティ
- レスポンシブなTwitterプレゼンス
- 本番環境での採用が増加中

## ビデオリソース
ドキュメントには、様々なコンテンツクリエイターによる複数のチュートリアルビデオへのリンクが含まれており、Drizzle ORMの基本から高度な使い方までをカバーしています。

## サポートされているプラットフォーム
- PostgreSQL
- MySQL
- SQLite
