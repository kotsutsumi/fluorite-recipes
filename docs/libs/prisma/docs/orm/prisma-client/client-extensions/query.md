# `query`: データベースクエリの変更とカスタマイズ

> Prisma Client extensionsは、バージョン4.16.0以降でGenerally Availableです。

Prisma Client extensionsの`query`コンポーネントを使用して、データベースクエリを変更およびカスタマイズできます。

## クエリの拡張

`$extends`クライアントレベルメソッドを使用して、_拡張クライアント_を作成します。`query`拡張コンポーネントを使用して、さまざまなレベルでクエリを拡張できます:

- 特定のモデル
- すべてのモデル
- 特定のオペレーション

### 基本構造

```typescript
const prisma = new PrismaClient().$extends({
  query: {
    // モデル名
    user: {
      // オペレーション名
      async findMany({ args, query }) {
        // クエリ引数を変更
        args.where = { ...args.where, age: { gte: 18 } }
        // 変更された引数でクエリを実行
        return query(args)
      }
    }
  }
})
```

## クエリ拡張とミドルウェアの違い

クエリ拡張は、ミドルウェアと比較して以下の利点があります:

- **型安全性**: クエリ拡張は完全に型安全です
- **柔軟性**: 特定のモデルやオペレーションに対してのみ拡張を適用できます
- **パフォーマンス**: より効率的な実行が可能です

## 例: クエリパフォーマンスのログ記録

```typescript
const prisma = new PrismaClient().$extends({
  query: {
    $allModels: {
      async $allOperations({ operation, model, args, query }) {
        const start = performance.now()
        const result = await query(args)
        const end = performance.now()
        const time = end - start
        console.log(`${model}.${operation} took ${time}ms`)
        return result
      }
    }
  }
})
```

この例では、すべてのモデルとオペレーションに対してクエリの実行時間をログに記録します。
