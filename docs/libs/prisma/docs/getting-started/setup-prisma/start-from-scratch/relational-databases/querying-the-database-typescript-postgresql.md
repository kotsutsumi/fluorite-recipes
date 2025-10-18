# TypeScriptとPostgreSQLを使用したデータベースクエリ

## Prisma Clientで最初のクエリを書く

Prisma Clientを生成したので、データベースにデータを読み書きするクエリを書き始めることができます。このガイドでは、シンプルなNode.jsスクリプトを使用して、Prisma Clientの基本的な機能を探索します。

`index.ts`という新しいファイルを作成し、以下のコードを追加します：

```typescript
import { PrismaClient } from './generated/prisma'
const prisma = new PrismaClient()

async function main() {
  // ... Prisma Clientクエリをここに書きます
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
```

コードスニペットの各部分の簡単な概要：

1. `prisma init`コマンドで指定された出力フォルダからPrisma Clientをインポート
2. `PrismaClient`をインスタンス化
3. データベースにクエリを送信するための`async`関数`main`を定義
4. `main`関数を呼び出す
5. スクリプト終了時にデータベース接続を閉じる

`main`関数内に、データベースからすべての`User`レコードを読み取り、結果を出力するクエリを追加します：

```typescript
async function main() {
  const allUsers = await prisma.user.findMany()
  console.log(allUsers)
}
```

以下のコマンドでコードを実行します：

```bash
npx tsx index.ts
```

データベースにまだユーザーがいない場合、空の配列が表示されます：

```
[]
```

## データベースにデータを書き込む

前のセクションで使用した`findMany`クエリは、データベースからデータを**読み取り**ます（技術的には：`User`テーブル内のすべてのレコードを取得）。このセクションでは、データベースに新しいレコードを**書き込む**クエリを学びます。

Prisma Clientの`create`クエリを使用してデータベースに新しい`User`レコードを書き込むように`main`関数を調整します：

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

  const allUsers = await prisma.user.findMany({
    include: {
      posts: true,
      profile: true,
    },
  })
  console.dir(allUsers, { depth: null })
}
```

このコードは、2つの`Post`レコードと1つの`Profile`レコードが接続された新しい`User`レコードを[ネストされた書き込み](/docs/orm/prisma-client/queries/relation-queries#nested-writes)クエリを使用して作成します。

再度、以下のコマンドでコードを実行します：

```bash
npx tsx index.ts
```

出力は以下のようになります：

```json
[
  {
    email: 'alice@prisma.io',
    id: 1,
    name: 'Alice',
    posts: [
      {
        content: null,
        createdAt: 2020-03-21T16:45:01.246Z,
        updatedAt: 2020-03-21T16:45:01.246Z,
        id: 1,
        published: false,
        title: 'Hello World',
        authorId: 1,
      }
    ],
    profile: {
      bio: 'I like turtles',
      id: 1,
      userId: 1,
    }
  }
]
```

クエリによって新しいユーザーレコードがデータベースに追加されました。関連する`Post`と`Profile`レコードもそれぞれのテーブルに追加されました。

> **注意**
>
> `email`フィールドには一意制約があるため、スクリプトを2回実行するとエラーが発生します：
>
> ```
> Error: Unique constraint failed on the constraint: `User.email`
> ```

## 次のステップ

おめでとうございます！Prisma ORMを使用した基本的なデータベース操作を学びました。

次のステップでは、より高度な機能について学ぶことができます：

- [リレーションクエリ](/docs/orm/prisma-client/queries/relation-queries)
- [フィルタリングとソート](/docs/orm/prisma-client/queries/filtering-and-sorting)
- [ページネーション](/docs/orm/prisma-client/queries/pagination)
- [集約とグループ化](/docs/orm/prisma-client/queries/aggregation-grouping-summarizing)

または、以下のリソースを確認してください：

- [Prisma Client API リファレンス](/docs/orm/reference/prisma-client-reference)
- [サンプルプロジェクト](https://github.com/prisma/prisma-examples/)
