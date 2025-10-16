# サポートされていないデータベース機能（Prisma Migrate）

Prisma Migrate は Prisma スキーマを使用してデータベース機能を決定しますが、スキーマで表現できない機能もあります。これには以下が含まれます：

- ストアドプロシージャ
- トリガー
- ビュー
- 部分インデックス

## サポートされていない機能を含むマイグレーションのカスタマイズ

データベースにサポートされていない機能を追加するには：

### ステップ1: 適用せずに新しいマイグレーションを生成

```bash
npx prisma migrate dev --create-only
```

このコマンドは、マイグレーションファイルを生成しますが、データベースには適用しません。

### ステップ2: 生成された `migration.sql` ファイルを開き、サポートされていない機能を追加

例：部分インデックスを追加する場合：

```sql
CREATE UNIQUE INDEX tests_success_constraint ON posts (subject, target) WHERE success;
```

### ステップ3: マイグレーションを適用

```bash
npx prisma migrate dev
```

### ステップ4: 修正したマイグレーションをソース管理にコミット

```bash
git add prisma/migrations
git commit -m "Add partial index for posts"
```

## 具体的な例

### 例1: データベースビューの追加

**ステップ1: ドラフトマイグレーションを作成**

```bash
npx prisma migrate dev --create-only --name add_user_stats_view
```

**ステップ2: SQL を編集してビューを追加**

`prisma/migrations/[timestamp]_add_user_stats_view/migration.sql` を編集：

```sql
-- ビューを作成
CREATE VIEW user_stats AS
SELECT
  u.id,
  u.name,
  COUNT(p.id) as post_count
FROM
  "User" u
LEFT JOIN
  "Post" p ON u.id = p."authorId"
GROUP BY
  u.id, u.name;
```

**ステップ3: マイグレーションを適用**

```bash
npx prisma migrate dev
```

### 例2: トリガーの追加

**ステップ1: ドラフトマイグレーションを作成**

```bash
npx prisma migrate dev --create-only --name add_updated_at_trigger
```

**ステップ2: SQL を編集してトリガーを追加**

PostgreSQL の例：

```sql
-- 更新日時を自動設定する関数
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW."updatedAt" = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ language 'plpgsql';

-- トリガーを作成
CREATE TRIGGER update_user_updated_at
  BEFORE UPDATE ON "User"
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
```

**ステップ3: マイグレーションを適用**

```bash
npx prisma migrate dev
```

### 例3: ストアドプロシージャの追加

**ステップ1: ドラフトマイグレーションを作成**

```bash
npx prisma migrate dev --create-only --name add_user_procedures
```

**ステップ2: SQL を編集してストアドプロシージャを追加**

PostgreSQL の例：

```sql
-- ユーザーの投稿数を取得するプロシージャ
CREATE OR REPLACE FUNCTION get_user_post_count(user_id INTEGER)
RETURNS INTEGER AS $$
DECLARE
  post_count INTEGER;
BEGIN
  SELECT COUNT(*) INTO post_count
  FROM "Post"
  WHERE "authorId" = user_id;

  RETURN post_count;
END;
$$ LANGUAGE plpgsql;
```

MySQL の例：

```sql
-- ユーザーの投稿数を取得するプロシージャ
DELIMITER $$
CREATE PROCEDURE get_user_post_count(IN user_id INT, OUT post_count INT)
BEGIN
  SELECT COUNT(*) INTO post_count
  FROM Post
  WHERE authorId = user_id;
END$$
DELIMITER ;
```

**ステップ3: マイグレーションを適用**

```bash
npx prisma migrate dev
```

### 例4: 部分インデックス（PostgreSQL）

**ステップ1: ドラフトマイグレーションを作成**

```bash
npx prisma migrate dev --create-only --name add_partial_index
```

**ステップ2: SQL を編集して部分インデックスを追加**

```sql
-- アクティブなユーザーのみにインデックスを作成
CREATE INDEX idx_active_users ON "User" (email) WHERE active = true;

-- 公開済み投稿のみにインデックスを作成
CREATE INDEX idx_published_posts ON "Post" (title) WHERE published = true;
```

**ステップ3: マイグレーションを適用**

```bash
npx prisma migrate dev
```

### 例5: チェック制約

**ステップ1: ドラフトマイグレーションを作成**

```bash
npx prisma migrate dev --create-only --name add_check_constraints
```

**ステップ2: SQL を編集してチェック制約を追加**

```sql
-- 年齢の範囲をチェック
ALTER TABLE "User" ADD CONSTRAINT check_age
  CHECK (age >= 0 AND age <= 150);

-- 価格が正の値であることをチェック
ALTER TABLE "Product" ADD CONSTRAINT check_price
  CHECK (price > 0);
```

**ステップ3: マイグレーションを適用**

```bash
npx prisma migrate dev
```

## 注意事項

**重要：**
- Prisma スキーマは、サポートされていないフィールド型とネイティブデータベース関数を表現できます
- このガイドは **MongoDB には適用されません**
- MongoDB の場合は、`migrate dev` の代わりに `db push` を使用します

## ベストプラクティス

1. **ドキュメント化**: カスタム SQL の目的をコメントで明記
2. **テスト**: ローカル環境で十分にテスト
3. **バージョン管理**: すべてのマイグレーションファイルをコミット
4. **ロールバック計画**: 各機能のロールバック方法を文書化
5. **チームとの共有**: チームメンバーにカスタム機能を周知

## トラブルシューティング

### マイグレーションが失敗する

カスタム SQL にエラーがある場合：

1. エラーメッセージを確認
2. SQL 構文を修正
3. データベースをリセット: `npx prisma migrate reset`
4. マイグレーションを再適用

### ビューやプロシージャが見つからない

Prisma Client からは直接アクセスできない可能性があります。Raw SQL を使用：

```typescript
const result = await prisma.$queryRaw`
  SELECT * FROM user_stats
`;
```

## まとめ

Prisma Migrate でサポートされていないデータベース機能を使用する場合：

1. `--create-only` フラグでドラフトマイグレーションを作成
2. 生成された SQL ファイルにカスタム SQL を追加
3. `migrate dev` でマイグレーションを適用
4. ソース管理にコミット

この方法により、Prisma Migrate の利点を保ちながら、データベース固有の高度な機能も活用できます。
