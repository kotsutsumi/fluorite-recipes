# TypeScriptとPostgreSQLプロジェクトでのスキーマの進化

## 主要なポイント
- このガイドは、既存のPrismaスキーマに新しい`Tag`モデルを追加する方法を示します
- `prisma migrate dev`を使用してスキーマの変更をデータベースに適用します

## スキーマの変更

### 1. 新しい`Tag`モデルの作成
以下を含む:
- `id`: 自動インクリメントの整数主キー
- `name`: NULL不可の文字列
- `posts`: `Post`モデルとの暗黙的な多対多リレーション

### 2. `Post`モデルの更新
以下を含める:
- `tags`: `Tag`モデルとの多対多リレーション

## マイグレーションプロセス
- コマンドを実行: `npx prisma migrate dev --name tags-model`
- このコマンドは:
  1. 新しいSQLマイグレーションファイルを作成します
  2. マイグレーションをデータベースに適用します
  3. Prisma Clientを再生成します

マイグレーションは以下のSQLを生成します:
- `Tag`テーブルの作成
- ジャンクションテーブル`_PostToTag`の作成
- 外部キー制約の追加

## コード例（スキーマ）
```prisma
model Tag {
  id    Int    @id @default(autoincrement())
  name  String
  posts Post[]
}
```

このドキュメントは、TypeScriptとPostgreSQL環境でPrisma Migrateを使用してデータベーススキーマを進化させるためのステップバイステップのガイドを提供します。
