# TypeScriptで既存のMongoDBデータベースにクエリを実行する

## 主要なポイント
- このガイドは、TypeScriptプロジェクトでPrisma Clientを使用してMongoDBデータベースにクエリを実行する方法を示します
- チュートリアルでは、データベースと対話するための基本的なスクリプトの作成を説明します

## 主なステップ

### 1. 新しいファイル`index.ts`を作成します

### 2. PrismaClientをインポートして初期化します

### 3. Prisma Clientメソッドを使用してデータベースクエリを記述します

## コード例
```typescript
import { PrismaClient } from './generated/prisma'
const prisma = new PrismaClient()

async function main() {
  // 投稿を含む新しいユーザーを作成
  await prisma.user.create({
    data: {
      name: 'Rich',
      email: 'hello@prisma.com',
      posts: {
        create: {
          title: 'My first post',
          body: 'Lots of really interesting stuff',
          slug: 'my-first-post',
        },
      },
    },
  })

  // 投稿を含むすべてのユーザーを取得
  const allUsers = await prisma.user.findMany({
    include: {
      posts: true,
    },
  })
  console.dir(allUsers, { depth: null })
}
```

## 実証された主要な機能
- レコードの作成
- ネストされた書き込み
- 関連データを含むレコードの取得
- 型安全なデータベースインタラクション

このガイドは、TypeScriptプロジェクトでのデータベース操作のための型安全で使いやすいインターフェースを提供するPrismaの能力を強調しています。
