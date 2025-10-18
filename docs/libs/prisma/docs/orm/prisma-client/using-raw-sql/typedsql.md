# TypedSQL

TypedSQLは、完全なTypeScript型サポートを備えた型安全なRaw SQLクエリを記述できるPrisma機能です。

## 前提条件

1. Prisma ClientとPrisma v5.19.0以降
2. `schema.prisma`に`typedSql`プレビュー機能を追加
3. SQLファイル用の`prisma/sql`ディレクトリを作成
4. `.sql`ファイルにSQLクエリを記述
5. `--sql`フラグでPrisma Clientを生成

## 基本的な使用例

### SQLファイル（getUsersWithPosts.sql）

```sql
SELECT u.id, u.name, COUNT(p.id) as "postCount"
FROM "User" u
LEFT JOIN "Post" p ON u.id = p."authorId"
GROUP BY u.id, u.name
```

### TypeScript使用

```typescript
import { getUsersWithPosts } from './generated/prisma/sql'

const usersWithPostCounts = await prisma.$queryRawTyped(
  getUsersWithPosts()
)
```

## 引数の渡し方

TypedSQLは型安全な引数渡しをサポートしています:

### SQLファイル

```sql
-- @param {Int} $1:minAge
-- @param {Int} $2:maxAge
SELECT id, name, age
FROM users
WHERE age > $1 AND age < $2
```

### TypeScript

```typescript
const users = await prisma.$queryRawTyped(
  getUsersByAge(18, 65)
)
```

## サポートされるデータベース

- **完全サポート**: PostgreSQL, MySQL (8.0+)
- **部分サポート**: 古いMySQL, SQLite（手動型定義が必要）
- **非サポート**: MongoDB

## プレースホルダの種類

- `$1`, `$2` (PostgreSQL)
- `?` (MySQL)
- `:paramName` (名前付きパラメータ)

## 制限事項

- アクティブなデータベース接続が必要
- 動的に構築されたカラムのネイティブサポートなし
- 型安全性はデータベース接続とクエリ構造に依存

## 利点

- 完全な型安全性
- IDEオートコンプリート
- コンパイル時の型チェック
- パフォーマンスクリティカルなクエリに最適
- データベース固有の機能を活用

TypedSQLは、Prisma Client内で型安全なRaw SQLクエリを実装するための包括的なガイダンスを提供し、型安全性と柔軟なデータベースインタラクションを強調しています。
