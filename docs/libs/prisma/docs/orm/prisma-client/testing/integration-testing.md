# Prismaでのインテグレーションテスト

インテグレーションテストは、プログラムの異なる部分がどのように連携して動作するかをテストすることに焦点を当てています。データベースを使用するアプリケーションのコンテキストでは、インテグレーションテストは通常、データベースが利用可能であり、テストシナリオに適したデータが含まれていることを必要とします。

このガイドでは、Dockerを使用して分離されたテストデータベース環境を作成し、実際のデータベースに対してPrisma Clientをテストする方法を説明します。

## 前提条件

このガイドは、以下がインストールされていることを前提としています:

- Docker
- Docker Compose
- Jestがプロジェクトにセットアップされていること

```bash
npm install --save-dev jest ts-jest @types/jest
npm install --save-dev @prisma/client prisma
```

## Dockerをプロジェクトに追加

### 1. docker-compose.ymlファイルを作成

```yaml
version: '3.9'
services:
  db:
    image: postgres:13
    restart: always
    container_name: integration-tests-prisma
    ports:
      - '5433:5432'
    environment:
      POSTGRES_USER: prisma
      POSTGRES_PASSWORD: prisma
      POSTGRES_DB: tests
```

このDocker Compose設定は:
- PostgreSQL 13を使用
- ポート5433でデータベースを公開（本番データベースとの競合を避けるため）
- テスト用のデータベース、ユーザー、パスワードを設定

### 2. .env.testファイルを作成

```env
DATABASE_URL="postgresql://prisma:prisma@localhost:5433/tests"
```

### 3. Dockerコンテナを起動

```bash
docker compose up -d
```

停止するには:

```bash
docker compose down
```

## インテグレーションテストのフロー

インテグレーションテストの一般的なフローは以下の通りです:

1. Dockerコンテナを起動してデータベースを作成
2. スキーマをマイグレート
3. テストを実行
4. テスト後、コンテナを破棄（オプション）

## サンプルスキーマ

```prisma
// schema.prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

generator client {
  provider = "prisma-client-js"
}

model Customer {
  id     Int              @id @default(autoincrement())
  name   String
  email  String           @unique
  orders CustomerOrder[]
}

model Category {
  id       Int       @id @default(autoincrement())
  name     String
  products Product[]
}

model Product {
  id           Int            @id @default(autoincrement())
  name         String
  description  String
  price        Float
  stock        Int
  categoryId   Int
  category     Category       @relation(fields: [categoryId], references: [id])
  orderDetails OrderDetail[]
}

model CustomerOrder {
  id           Int           @id @default(autoincrement())
  customerId   Int
  customer     Customer      @relation(fields: [customerId], references: [id])
  createdAt    DateTime      @default(now())
  orderDetails OrderDetail[]
}

model OrderDetail {
  id         Int            @id @default(autoincrement())
  orderId    Int
  order      CustomerOrder  @relation(fields: [orderId], references: [id])
  productId  Int
  product    Product        @relation(fields: [productId], references: [id])
  quantity   Int
}
```

## テスト対象の関数

```typescript
// order.ts
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

interface CreateOrderInput {
  customerEmail: string
  customerName?: string
  products: Array<{
    productId: number
    quantity: number
  }>
}

export async function createOrder(input: CreateOrderInput) {
  const { customerEmail, customerName, products } = input

  // 顧客が存在するか確認
  let customer = await prisma.customer.findUnique({
    where: { email: customerEmail },
  })

  // 存在しない場合は作成
  if (!customer) {
    if (!customerName) {
      throw new Error('Customer name is required for new customers')
    }
    customer = await prisma.customer.create({
      data: {
        email: customerEmail,
        name: customerName,
      },
    })
  }

  // 商品の在庫を確認
  for (const item of products) {
    const product = await prisma.product.findUnique({
      where: { id: item.productId },
    })

    if (!product) {
      throw new Error(`Product ${item.productId} not found`)
    }

    if (product.stock < item.quantity) {
      throw new Error(`Insufficient stock for product ${product.name}`)
    }
  }

  // 注文を作成
  const order = await prisma.customerOrder.create({
    data: {
      customerId: customer.id,
      orderDetails: {
        create: products.map((item) => ({
          productId: item.productId,
          quantity: item.quantity,
        })),
      },
    },
    include: {
      customer: true,
      orderDetails: {
        include: {
          product: true,
        },
      },
    },
  })

  // 在庫を更新
  for (const item of products) {
    await prisma.product.update({
      where: { id: item.productId },
      data: {
        stock: {
          decrement: item.quantity,
        },
      },
    })
  }

  return order
}
```

## インテグレーションテストスイート

```typescript
// order.test.ts
import { PrismaClient } from '@prisma/client'
import { createOrder } from './order'

const prisma = new PrismaClient()

beforeAll(async () => {
  // テストデータをシード
  await prisma.category.createMany({
    data: [
      { id: 1, name: 'Electronics' },
      { id: 2, name: 'Books' },
    ],
  })

  await prisma.product.createMany({
    data: [
      {
        id: 1,
        name: 'Laptop',
        description: 'High-performance laptop',
        price: 999.99,
        stock: 10,
        categoryId: 1,
      },
      {
        id: 2,
        name: 'Mouse',
        description: 'Wireless mouse',
        price: 29.99,
        stock: 50,
        categoryId: 1,
      },
      {
        id: 3,
        name: 'Prisma Book',
        description: 'Learn Prisma',
        price: 39.99,
        stock: 0,
        categoryId: 2,
      },
    ],
  })

  await prisma.customer.create({
    data: {
      id: 1,
      email: 'existing@example.com',
      name: 'Existing Customer',
    },
  })
})

afterAll(async () => {
  // テスト後のクリーンアップ
  const deleteOrderDetails = prisma.orderDetail.deleteMany()
  const deleteOrders = prisma.customerOrder.deleteMany()
  const deleteProducts = prisma.product.deleteMany()
  const deleteCategories = prisma.category.deleteMany()
  const deleteCustomers = prisma.customer.deleteMany()

  await prisma.$transaction([
    deleteOrderDetails,
    deleteOrders,
    deleteProducts,
    deleteCategories,
    deleteCustomers,
  ])

  await prisma.$disconnect()
})

describe('createOrder', () => {
  it('should create order for new customer', async () => {
    const result = await createOrder({
      customerEmail: 'new@example.com',
      customerName: 'New Customer',
      products: [
        { productId: 1, quantity: 1 },
        { productId: 2, quantity: 2 },
      ],
    })

    expect(result).toHaveProperty('id')
    expect(result.customer.email).toBe('new@example.com')
    expect(result.customer.name).toBe('New Customer')
    expect(result.orderDetails).toHaveLength(2)
    expect(result.orderDetails[0].quantity).toBe(1)
    expect(result.orderDetails[1].quantity).toBe(2)

    // 在庫が減っているか確認
    const laptop = await prisma.product.findUnique({ where: { id: 1 } })
    expect(laptop?.stock).toBe(9)

    const mouse = await prisma.product.findUnique({ where: { id: 2 } })
    expect(mouse?.stock).toBe(48)
  })

  it('should create order for existing customer', async () => {
    const result = await createOrder({
      customerEmail: 'existing@example.com',
      products: [{ productId: 2, quantity: 1 }],
    })

    expect(result).toHaveProperty('id')
    expect(result.customer.email).toBe('existing@example.com')
    expect(result.customer.name).toBe('Existing Customer')
    expect(result.orderDetails).toHaveLength(1)
  })

  it('should fail when product is out of stock', async () => {
    await expect(
      createOrder({
        customerEmail: 'test@example.com',
        customerName: 'Test Customer',
        products: [{ productId: 3, quantity: 1 }],
      })
    ).rejects.toThrow('Insufficient stock')
  })

  it('should fail when product does not exist', async () => {
    await expect(
      createOrder({
        customerEmail: 'test@example.com',
        customerName: 'Test Customer',
        products: [{ productId: 999, quantity: 1 }],
      })
    ).rejects.toThrow('Product 999 not found')
  })

  it('should fail when customer name is not provided for new customer', async () => {
    await expect(
      createOrder({
        customerEmail: 'another@example.com',
        products: [{ productId: 1, quantity: 1 }],
      })
    ).rejects.toThrow('Customer name is required for new customers')
  })
})
```

## package.jsonスクリプト

```json
{
  "scripts": {
    "docker:up": "docker compose up -d",
    "docker:down": "docker compose down",
    "test:migrate": "dotenv -e .env.test -- prisma migrate deploy",
    "test": "npm run docker:up && npm run test:migrate && dotenv -e .env.test -- jest -i && npm run docker:down",
    "test:watch": "npm run docker:up && npm run test:migrate && dotenv -e .env.test -- jest --watch"
  }
}
```

`-i`フラグは、テストを順次実行します（データベースの競合を避けるため）。

## dotenv-cliのインストール

テスト用の環境変数を使用するために、`dotenv-cli`をインストールします:

```bash
npm install --save-dev dotenv-cli
```

## Jest設定

```javascript
// jest.config.js
module.exports = {
  clearMocks: true,
  preset: 'ts-jest',
  testEnvironment: 'node',
  testMatch: ['**/*.test.ts'],
}
```

## テストの実行

```bash
# すべてのテストを実行
npm test

# 監視モードで実行
npm run test:watch

# Dockerコンテナのみを起動
npm run docker:up

# Dockerコンテナを停止
npm run docker:down
```

## ベストプラクティス

1. **分離されたテストデータベース**: 本番データベースとは別のテスト用データベースを使用する

2. **データのクリーンアップ**: テスト後は必ずデータベースをクリーンアップする

3. **トランザクションの使用**: 複数の操作を行う場合は、トランザクションを使用してアトミック性を保証する

4. **シードデータの管理**: テストに必要な基本データは`beforeAll`でシードする

5. **テストの独立性**: 各テストが独立して実行できるようにする

6. **順次実行**: データベースを使用するテストは順次実行する（`jest -i`）

7. **環境変数の分離**: `.env.test`を使用してテスト用の設定を分離する

8. **CI/CDの統合**: Docker Composeを使用して、CI/CD環境でも同じテストを実行できるようにする

## CI/CD での使用例（GitHub Actions）

```yaml
# .github/workflows/test.yml
name: Integration Tests

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest

    services:
      postgres:
        image: postgres:13
        env:
          POSTGRES_USER: prisma
          POSTGRES_PASSWORD: prisma
          POSTGRES_DB: tests
        ports:
          - 5433:5432
        options: >-
          --health-cmd pg_isready
          --health-interval 10s
          --health-timeout 5s
          --health-retries 5

    steps:
      - uses: actions/checkout@v3

      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'

      - name: Install dependencies
        run: npm ci

      - name: Run migrations
        run: npm run test:migrate
        env:
          DATABASE_URL: postgresql://prisma:prisma@localhost:5433/tests

      - name: Run tests
        run: npx jest -i
        env:
          DATABASE_URL: postgresql://prisma:prisma@localhost:5433/tests
```

## まとめ

インテグレーションテストは、アプリケーションが実際のデータベースと正しく動作することを確認するために重要です。Dockerを使用することで、一貫性のある分離されたテスト環境を簡単に作成できます。

## さらに学ぶ

- [ユニットテスト](/docs/orm/prisma-client/testing/unit-testing): Prisma Clientのモック方法
- [Docker Compose](https://docs.docker.com/compose/): Docker Compose公式ドキュメント
- [Jest](https://jestjs.io/): Jest公式ドキュメント
