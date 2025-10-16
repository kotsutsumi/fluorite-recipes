# ミドルウェア

⚠️ **警告: ミドルウェアはv6.14.0で削除され、v4.16.0以降非推奨となっています**

代替として、[Prisma Client extensions `query`コンポーネントタイプ](/docs/orm/prisma-client/client-extensions/query)の使用を推奨します。

## 主要な概念

ミドルウェアは、クエリの実行前または実行後にアクションを実行できるクエリレベルのライフサイクルフックでした。`prisma.$use()`を使用して追加できました:

```javascript
const prisma = new PrismaClient()
prisma.$use(async (params, next) => {
  // ここでparamsを操作
  const result = await next(params)
  // ここで結果を確認
  return result
})
```

## 考えられるユースケース

- フィールド値の設定または上書き
- 入力データの検証
- クエリのインターセプト（例: ソフトデリート）
- クエリパフォーマンスのログ記録

## 実行順序

ミドルウェアの実行は特定の順序に従います:

1. `await next(params)`より前のロジックは降順で実行
2. `await next(params)`より後のロジックは昇順で実行

### 例: 実行順序

```javascript
const prisma = new PrismaClient()

// ミドルウェア1
prisma.$use(async (params, next) => {
  console.log('1: Before')
  const result = await next(params)
  console.log('1: After')
  return result
})

// ミドルウェア2
prisma.$use(async (params, next) => {
  console.log('2: Before')
  const result = await next(params)
  console.log('2: After')
  return result
})

// ミドルウェア3
prisma.$use(async (params, next) => {
  console.log('3: Before')
  const result = await next(params)
  console.log('3: After')
  return result
})

// 実行結果:
// 3: Before
// 2: Before
// 1: Before
// [クエリ実行]
// 1: After
// 2: After
// 3: After
```

## パフォーマンスの考慮事項

- 不要な処理を避けるため、早期に`params.model`と`params.action`をチェックする
- データベース制約やスキーマ属性などの代替ソリューションを検討する

### 例: パフォーマンス最適化

```javascript
prisma.$use(async (params, next) => {
  // 特定のモデルとアクションのみを処理
  if (params.model === 'User' && params.action === 'create') {
    // 処理を実行
    console.log('Creating user...')
  }
  return next(params)
})
```

## ミドルウェアの追加場所

複数のミドルウェアインスタンスの作成を防ぐため、リクエストハンドラの外側にミドルウェアを追加します:

```javascript
const prisma = new PrismaClient()

// 正しい: グローバルスコープで定義
prisma.$use(async (params, next) => {
  // ミドルウェアロジック
  return next(params)
})

const app = express()

app.get('/feed', async (req, res) => {
  // 誤り: ここにミドルウェアを追加しない
  const posts = await prisma.post.findMany()
  res.json(posts)
})
```

## ミドルウェアパラメータ

ミドルウェアは`params`オブジェクトを受け取ります:

```typescript
type MiddlewareParams = {
  model?: string  // モデル名（例: 'User', 'Post'）
  action: string  // アクション名（例: 'create', 'findMany'）
  args: any       // クエリ引数
  dataPath: string[]  // データパス
  runInTransaction: boolean  // トランザクション内で実行されているか
}
```

## Client Extensionsへの移行

ミドルウェアの代わりにClient Extensionsを使用することを推奨します:

### ミドルウェア（非推奨）

```javascript
prisma.$use(async (params, next) => {
  if (params.model === 'Post' && params.action === 'create') {
    params.args.data.published = false
  }
  return next(params)
})
```

### Client Extensions（推奨）

```javascript
const prisma = new PrismaClient().$extends({
  query: {
    post: {
      async create({ args, query }) {
        args.data.published = false
        return query(args)
      }
    }
  }
})
```

## ミドルウェアの例

以下のミドルウェア実装例については、個別のドキュメントを参照してください:

- [ソフトデリート](/docs/orm/prisma-client/client-extensions/middleware/soft-delete-middleware)
- [ログ記録](/docs/orm/prisma-client/client-extensions/middleware/logging-middleware)
- [セッションデータ](/docs/orm/prisma-client/client-extensions/middleware/session-data-middleware)
