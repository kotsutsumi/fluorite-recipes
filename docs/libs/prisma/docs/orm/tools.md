# ツール

Prisma ORMは、開発をサポートするさまざまなツールを提供しています。

## Prisma CLI

Prisma CLIは、Prismaプロジェクトを管理するためのコマンドラインツールです。

### 主要なコマンド

- `prisma init`: 新しいPrismaプロジェクトを初期化
- `prisma generate`: Prisma Clientを生成
- `prisma migrate`: マイグレーションを管理
- `prisma db`: データベース操作
- `prisma studio`: Prisma Studioを起動

詳細については、[Prisma CLI](/docs/orm/tools/prisma-cli)を参照してください。

## Prisma Studio

Prisma Studioは、データベースを視覚的に探索および操作するためのGUIツールです。

### 起動方法

```bash
npx prisma studio
```

ブラウザで`http://localhost:5555`を開きます。

### 機能

- データの閲覧と編集
- リレーションの視覚化
- データのフィルタリングとソート
- レコードの作成、更新、削除

詳細については、[Prisma Studio](/docs/orm/tools/prisma-studio)を参照してください。

## ベストプラクティス

- 開発環境でPrisma Studioを使用してデータを確認
- Prisma CLIコマンドを学習して効率的に作業
- CI/CDパイプラインにPrisma CLIを統合
