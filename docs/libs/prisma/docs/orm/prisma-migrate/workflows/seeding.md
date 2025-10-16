# シーディング

## 概要

シーディングにより、以下が可能になります：

- データベースに必要な初期データを投入する
- 開発環境に基本データを提供する
- データベース内のデータを一貫して再作成する

## Prisma ORM でデータベースをシードする方法

Prisma は `package.json` の `"seed"` キーでシードコマンドを期待します：

```json
{
  "prisma": {
    "seed": "ts-node prisma/seed.ts"
  }
}
```

### Prisma Migrate との統合シーディング

シーディングは以下のシナリオで自動的に発生します：

- 手動で `prisma migrate reset` を実行
- `prisma migrate dev` 中のインタラクティブなデータベースリセット
- 初回のデータベース作成時

`--skip-seed` フラグでシーディングをスキップできます：

```bash
npx prisma migrate reset --skip-seed
```

## シードスクリプトの例

### TypeScript シード例

1. **`prisma/seed.ts` を作成：**

```typescript
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  const alice = await prisma.user.upsert({
    where: { email: 'alice@prisma.io' },
    update: {},
    create: {
      email: 'alice@prisma.io',
      name: 'Alice',
      posts: {
        create: {
          title: 'Check out Prisma with Next.js',
          content: 'https://www.prisma.io/nextjs',
          published: true,
        },
      },
    },
  })

  const bob = await prisma.user.upsert({
    where: { email: 'bob@prisma.io' },
    update: {},
    create: {
      email: 'bob@prisma.io',
      name: 'Bob',
      posts: {
        create: [
          {
            title: 'Follow Prisma on Twitter',
            content: 'https://twitter.com/prisma',
            published: true,
          },
          {
            title: 'Follow Nexus on Twitter',
            content: 'https://twitter.com/nexusgql',
            published: true,
          },
        ],
      },
    },
  })

  console.log({ alice, bob })
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

2. **`package.json` にシードコマンドを追加：**

```json
{
  "prisma": {
    "seed": "ts-node prisma/seed.ts"
  }
}
```

3. **シードを実行：**

```bash
# マイグレーションリセット時に自動実行
npx prisma migrate reset

# または手動で実行
npx prisma db seed
```

### JavaScript シード例

TypeScript を使用しない場合：

```javascript
const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function main() {
  const user1 = await prisma.user.upsert({
    where: { email: 'user1@example.com' },
    update: {},
    create: {
      email: 'user1@example.com',
      name: 'User One',
    },
  })

  const user2 = await prisma.user.upsert({
    where: { email: 'user2@example.com' },
    update: {},
    create: {
      email: 'user2@example.com',
      name: 'User Two',
    },
  })

  console.log({ user1, user2 })
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
```

`package.json` の設定：

```json
{
  "prisma": {
    "seed": "node prisma/seed.js"
  }
}
```

### Raw SQL シーディング

Raw SQL を使用したシーディング：

```typescript
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  // Raw SQL でデータを挿入
  await prisma.$executeRaw`
    INSERT INTO "User" ("id", "email", "name")
    VALUES (1, 'alice@example.com', 'Alice')
    ON CONFLICT ("id") DO NOTHING
  `

  await prisma.$executeRaw`
    INSERT INTO "User" ("id", "email", "name")
    VALUES (2, 'bob@example.com', 'Bob')
    ON CONFLICT ("id") DO NOTHING
  `

  // 関連データを挿入
  await prisma.$executeRaw`
    INSERT INTO "Post" ("id", "title", "content", "published", "authorId")
    VALUES (1, 'Hello World', 'This is my first post', true, 1)
    ON CONFLICT ("id") DO NOTHING
  `

  console.log('Seeding completed')
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

### CSV ファイルからのシーディング

CSV ファイルからデータを読み込む例：

```typescript
import { PrismaClient } from '@prisma/client'
import * as fs from 'fs'
import * as path from 'path'
import { parse } from 'csv-parse/sync'

const prisma = new PrismaClient()

async function main() {
  // CSV ファイルを読み込む
  const csvFilePath = path.join(__dirname, 'users.csv')
  const fileContent = fs.readFileSync(csvFilePath, 'utf-8')

  // CSV をパース
  const records = parse(fileContent, {
    columns: true,
    skip_empty_lines: true,
  })

  // データを挿入
  for (const record of records) {
    await prisma.user.upsert({
      where: { email: record.email },
      update: {},
      create: {
        email: record.email,
        name: record.name,
      },
    })
  }

  console.log(`Seeded ${records.length} users`)
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

## 高度なシーディング戦略

### 環境別シーディング

開発、ステージング、本番で異なるデータをシードする：

```typescript
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  const environment = process.env.NODE_ENV || 'development'

  if (environment === 'development') {
    // 開発環境用のテストデータ
    await seedDevelopmentData()
  } else if (environment === 'staging') {
    // ステージング環境用のデータ
    await seedStagingData()
  } else if (environment === 'production') {
    // 本番環境用の最小限のデータ
    await seedProductionData()
  }
}

async function seedDevelopmentData() {
  // 大量のテストデータ
  for (let i = 1; i <= 100; i++) {
    await prisma.user.create({
      data: {
        email: `user${i}@example.com`,
        name: `Test User ${i}`,
      },
    })
  }
}

async function seedStagingData() {
  // 中程度のテストデータ
  for (let i = 1; i <= 10; i++) {
    await prisma.user.create({
      data: {
        email: `staging${i}@example.com`,
        name: `Staging User ${i}`,
      },
    })
  }
}

async function seedProductionData() {
  // 必要最小限のデータのみ
  await prisma.user.create({
    data: {
      email: 'admin@example.com',
      name: 'Admin User',
    },
  })
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

### ファクトリーパターンを使用したシーディング

再利用可能なファクトリー関数を作成：

```typescript
import { PrismaClient, User, Post } from '@prisma/client'
import { faker } from '@faker-js/faker'

const prisma = new PrismaClient()

// ユーザーファクトリー
async function createUser(data?: Partial<User>): Promise<User> {
  return prisma.user.create({
    data: {
      email: faker.internet.email(),
      name: faker.person.fullName(),
      ...data,
    },
  })
}

// 投稿ファクトリー
async function createPost(authorId: number, data?: Partial<Post>): Promise<Post> {
  return prisma.post.create({
    data: {
      title: faker.lorem.sentence(),
      content: faker.lorem.paragraphs(3),
      published: faker.datatype.boolean(),
      authorId,
      ...data,
    },
  })
}

async function main() {
  // ユーザーと投稿を作成
  for (let i = 0; i < 10; i++) {
    const user = await createUser()

    // 各ユーザーに1-5件の投稿を作成
    const postCount = Math.floor(Math.random() * 5) + 1
    for (let j = 0; j < postCount; j++) {
      await createPost(user.id)
    }
  }

  console.log('Seeding completed with faker data')
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

## ベストプラクティス

1. **`upsert` を使用**: 重複エラーを避けるため
2. **冪等性を保つ**: 何度実行しても同じ結果になるように
3. **エラーハンドリング**: 適切なエラーハンドリングとログ
4. **環境変数**: 環境に応じてデータを変更
5. **大量データは効率的に**: `createMany` を使用してバッチ挿入
6. **トランザクション**: 関連データは1つのトランザクション内で作成

### バッチ挿入の例

```typescript
async function main() {
  // 効率的なバッチ挿入
  await prisma.user.createMany({
    data: Array.from({ length: 1000 }, (_, i) => ({
      email: `user${i}@example.com`,
      name: `User ${i}`,
    })),
    skipDuplicates: true, // 重複をスキップ
  })

  console.log('Batch seeding completed')
}
```

## トラブルシューティング

### シードスクリプトが実行されない

1. `package.json` の設定を確認
2. シードスクリプトの実行権限を確認
3. TypeScript の場合、`ts-node` がインストールされているか確認

```bash
npm install -D ts-node
```

### データベース制約エラー

- `upsert` または `createMany` の `skipDuplicates: true` を使用
- 適切な `where` 条件を指定

## まとめ

シーディングは以下の目的で重要です：

- 開発環境の迅速なセットアップ
- 一貫したテストデータの提供
- デモやプレゼンテーション用のデータ準備
- 初期設定データの投入

適切なシーディング戦略を実装することで、開発効率が大幅に向上します。
