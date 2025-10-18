# TypeScriptとPrisma ORMを使用して既存のPostgreSQLデータベースにクエリを実行する

## Prisma Clientのセットアップ

### 基本的なセットアップ
- PrismaClientコンストラクタをインポートします
- PrismaClientをインスタンス化します
- データベースクエリのための非同期`main()`関数を定義します
- `main()`関数を呼び出します
- スクリプト終了時にデータベース接続を閉じます

## データの読み取り例
```typescript
async function main() {
  const allUsers = await prisma.user.findMany()
  console.log(allUsers)
}
```

## データの書き込み例
```typescript
async function main() {
  await prisma.user.create({
    data: {
      name: 'Alice',
      email: 'alice@prisma.io',
      posts: {
        create: { title: 'Hello World' },
      },
      profile: {
        create: { bio: 'I like turtles' },
      },
    },
  })
}
```

## 主要な概念
- TypeScriptとPostgreSQLを使用します
- ネストされた書き込みをサポートします
- CRUD操作を提供します
- クエリで関連レコードを含めることができます
- 単一の操作で関連レコードを作成することをサポートします

## 推奨される実行方法
- `npx tsx index.ts`で実行します

このドキュメントは、開発者がPrisma ORMをTypeScriptとPostgreSQLプロジェクトに統合し、基本的なデータベースインタラクションパターンを示すためのステップバイステップのガイドを提供します。
