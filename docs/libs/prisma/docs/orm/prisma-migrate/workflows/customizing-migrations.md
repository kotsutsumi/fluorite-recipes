# マイグレーションのカスタマイズ

## 概要

このガイドでは、Prisma Migrate でマイグレーションファイルを編集する方法を説明します。重要な注意事項：

> このガイドは **MongoDB には適用されません**。MongoDB の場合、`migrate dev` の代わりに [`db push`](/docs/orm/prisma-migrate/workflows/prototyping-your-schema) を使用します。

## マイグレーションファイルの編集方法

マイグレーションファイルを編集する一般的な手順は以下の通りです：

1. カスタム SQL が必要なスキーマ変更を行う
2. ドラフトマイグレーションを作成する: `npx prisma migrate dev --create-only`
3. 生成された SQL ファイルを修正する
4. 修正した SQL を適用する: `npx prisma migrate dev`

### 例: フィールド名の変更

フィールド名を変更する場合、デフォルトのマイグレーションはカラムを削除して再作成します。データを保持するには：

1. スキーマでフィールド名を変更する
2. ドラフトマイグレーションを作成する
3. マイグレーション SQL を編集して `RENAME COLUMN` を使用する
4. マイグレーションを適用する

**SQL の修正例：**

```sql
-- 修正前
ALTER TABLE "Profile" DROP COLUMN "biograpy", ADD COLUMN "biography" TEXT NOT NULL;

-- 修正後
ALTER TABLE "Profile" RENAME COLUMN "biograpy" TO "biography";
```

#### 完全なワークフロー

1. **スキーマを変更する：**

```prisma
model Profile {
  id        Int    @id @default(autoincrement())
  biography String // biograpy から biography に変更
  userId    Int    @unique
  user      User   @relation(fields: [userId], references: [id])
}
```

2. **ドラフトマイグレーションを作成する：**

```bash
npx prisma migrate dev --create-only --name rename_biography
```

3. **マイグレーション SQL を編集する：**

`prisma/migrations/[timestamp]_rename_biography/migration.sql` を開いて、SQL を修正します。

4. **マイグレーションを適用する：**

```bash
npx prisma migrate dev
```

### Expand and Contract パターン

このパターンは、ダウンタイムなしでスキーマを進化させるのに役立ちます：

1. スキーマに新しいフィールドを追加する
2. アプリケーションコードを更新して両方のフィールドに書き込む
3. 既存のデータを新しいフィールドにコピーする
4. コードを更新して新しいフィールドから読み取る
5. 古いフィールドを削除する

#### 例: email から emailAddress への移行

**ステップ1: 新しいフィールドを追加**

```prisma
model User {
  id           Int     @id @default(autoincrement())
  email        String  @unique // 古いフィールド
  emailAddress String? @unique // 新しいフィールド
  name         String
}
```

マイグレーションを作成：

```bash
npx prisma migrate dev --name add_email_address
```

**ステップ2: データを移行する**

ドラフトマイグレーションを作成：

```bash
npx prisma migrate dev --create-only --name migrate_email_data
```

マイグレーション SQL を編集してデータをコピー：

```sql
-- 既存のデータを新しいフィールドにコピー
UPDATE "User" SET "emailAddress" = "email" WHERE "emailAddress" IS NULL;

-- 新しいフィールドを NOT NULL に変更
ALTER TABLE "User" ALTER COLUMN "emailAddress" SET NOT NULL;
```

マイグレーションを適用：

```bash
npx prisma migrate dev
```

**ステップ3: アプリケーションコードを更新**

両方のフィールドに書き込み、新しいフィールドから読み取るようにコードを更新します。

**ステップ4: 古いフィールドを削除**

```prisma
model User {
  id           Int    @id @default(autoincrement())
  emailAddress String @unique // 新しいフィールドのみ
  name         String
}
```

マイグレーションを作成：

```bash
npx prisma migrate dev --name remove_old_email
```

### 1対1リレーションの方向を変更する

1対1リレーションの方向を変更するには：

1. スキーマを修正する
2. ドラフトマイグレーションを作成する
3. マイグレーション SQL を編集して外部キーを移動し、データを保持する
4. マイグレーションを適用する

#### 例

**元のスキーマ：**

```prisma
model User {
  id      Int      @id @default(autoincrement())
  profile Profile?
}

model Profile {
  id     Int  @id @default(autoincrement())
  userId Int  @unique
  user   User @relation(fields: [userId], references: [id])
}
```

**新しいスキーマ（リレーションを反転）：**

```prisma
model User {
  id        Int      @id @default(autoincrement())
  profileId Int?     @unique
  profile   Profile? @relation(fields: [profileId], references: [id])
}

model Profile {
  id   Int   @id @default(autoincrement())
  user User?
}
```

**カスタムマイグレーション SQL：**

```sql
-- 新しいカラムを追加
ALTER TABLE "User" ADD COLUMN "profileId" INTEGER;

-- データを移動
UPDATE "User"
SET "profileId" = "Profile"."id"
FROM "Profile"
WHERE "Profile"."userId" = "User"."id";

-- 古い外部キーを削除
ALTER TABLE "Profile" DROP COLUMN "userId";

-- 新しい外部キーに制約を追加
ALTER TABLE "User" ADD CONSTRAINT "User_profileId_fkey"
  FOREIGN KEY ("profileId") REFERENCES "Profile"("id");

-- ユニーク制約を追加
ALTER TABLE "User" ADD CONSTRAINT "User_profileId_key" UNIQUE ("profileId");
```

## 主要な考慮事項

- **データ損失に注意**: マイグレーションを修正する際は常にデータ損失を避けるよう注意してください
- **テストを徹底**: 本番環境に適用する前にマイグレーションを十分にテストしてください
- **Expand and Contract パターンを使用**: 複雑なスキーマ変更には段階的なアプローチを採用してください
- **バックアップを取る**: 重要な変更の前には必ずデータベースをバックアップしてください

## ベストプラクティス

1. **ドラフトマイグレーションを使用**: `--create-only` フラグで SQL を確認してから適用
2. **小さな変更に分割**: 大きな変更は複数の小さなマイグレーションに分割
3. **ロールバック計画**: 各マイグレーションにはロールバック戦略を用意
4. **本番環境でテスト**: ステージング環境で本番データをテスト
5. **ドキュメント化**: カスタム SQL の理由をマイグレーションにコメントとして残す

## トラブルシューティング

### マイグレーションが失敗する

カスタム SQL にエラーがある場合：

1. エラーメッセージを確認
2. SQL 構文を修正
3. データベースをリセット: `npx prisma migrate reset`
4. マイグレーションを再適用

### データが失われた

誤ってデータを失った場合：

1. データベースのバックアップから復元
2. マイグレーション SQL を修正
3. 再度適用

## まとめ

マイグレーションのカスタマイズは、以下の場合に強力なツールです：

- データを保持しながらスキーマを変更
- データベース固有の機能を使用
- 複雑なデータ移行を実行

ただし、慎重に使用し、本番環境に適用する前に十分にテストしてください。
