# TypeScriptとPostgreSQLを使用したイントロスペクション

## 主要なポイント
- イントロスペクションにより、Prismaは既存のデータベーススキーマを読み取り、対応するPrismaスキーマを生成できます
- このガイドでは、3つの相互接続されたテーブル（User、Post、Profile）を持つデモSQLスキーマを使用します
- イントロスペクションは次のコマンドで実行されます: `npx prisma db pull`

## 詳細なプロセス

### 1. データベーススキーマの作成
- この例には、リレーションシップを持つ3つのテーブルが含まれています:
  - User（id、name、emailを持つ）
  - Post（id、title、createdAt、content、published、authorIdを持つ）
  - Profile（id、bio、userIdを持つ）

### 2. イントロスペクションのステップ
- `npx prisma db pull`を実行します
- このコマンドは`.env`から`DATABASE_URL`を読み取ります
- データベースに接続します
- データベーススキーマを読み取ります
- SQLスキーマをPrismaデータモデルに変換します

### 3. イントロスペクション後の推奨事項
- Prismaの命名規則に従ってリレーションフィールドの名前を変更します
- `@map`と`@@map`を使用して、モデルとフィールドの名前をカスタマイズします
- より良いセマンティクスの明確性のためにフィールド名を調整します

## コード例（イントロスペクションされたスキーマ）
```prisma
model Post {
  id        Int      @id @default(autoincrement())
  title     String   @db.VarChar(255)
  createdAt DateTime @default(now())
  content   String?
  published Boolean  @default(false)
  authorId  Int
  author    User     @relation(fields: [authorId], references: [id])
}
```

このドキュメントは、Prisma ORMを使用したPostgreSQLとTypeScriptでのデータベースイントロスペクションの包括的なガイドを提供します。
