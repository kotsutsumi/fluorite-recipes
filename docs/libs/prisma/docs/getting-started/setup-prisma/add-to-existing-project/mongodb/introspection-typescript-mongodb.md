# MongoDBイントロスペクション

## 主要なポイント
- Prisma ORMは、サンプリングとデータ構造の推論によってMongoDBスキーマをイントロスペクションできます
- このプロセスには、データベースのセットアップ、Prismaの初期化、データベーススキーマのプルが含まれます

## MongoDBをイントロスペクションするステップ

### 1. データベースのセットアップ
- コレクション（UserやPostなど）を含むデータベース（例: "blog"）を作成します
- 推奨ツール: MongoDB Compass
- コレクションにサンプルデータを追加します

### 2. Prisma ORMの初期化
- 新しいプロジェクトを作成します
- Prismaをインストールします
- MongoDBプロバイダーで`prisma init`を実行します
- `schema.prisma`ファイルを設定します
- .envファイルでDATABASE_URLを設定します

### 3. イントロスペクションコマンド
- `npx prisma db pull`を実行します
- これにより、推論されたスキーマが`schema.prisma`に自動的に書き込まれます

### 4. スキーマの洗練
- データの結合を可能にするために`@relation`属性を追加します
- スキーマの例は、PostモデルとUserモデル間のリレーションシップを示しています

## コード例（洗練されたスキーマ）
```prisma
model Post {
  id     String @id @default(auto()) @map("_id") @db.ObjectId
  title  String
  userId String @db.ObjectId
  user   User   @relation(fields: [userId], references: [id])
}

model User {
  id    String @id @default(auto()) @map("_id") @db.ObjectId
  email String
  posts Post[]
}
```

注: Prismaは、MongoDBイントロスペクションを積極的に改善しています。
