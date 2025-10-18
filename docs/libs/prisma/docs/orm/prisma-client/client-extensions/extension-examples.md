# 共有パッケージと例

## Prismaが作成した拡張

| 拡張 | 説明 |
|------|------|
| [`@prisma/extension-accelerate`](https://www.npmjs.com/package/@prisma/extension-accelerate) | 組み込みの接続プーリングを備えた、300以上のロケーションで利用可能なグローバルデータベースキャッシュである[Accelerate](https://www.prisma.io/accelerate)を有効にします |
| [`@prisma/extension-read-replicas`](https://github.com/prisma/extension-read-replicas) | Prisma Clientにリードレプリカサポートを追加します |

## コミュニティが作成した拡張

| 拡張 | 説明 |
|------|------|
| [`prisma-extension-supabase-rls`](https://github.com/dthyresson/prisma-extension-supabase-rls) | PrismaでSupabase Row Level Securityのサポートを追加します |
| [`prisma-extension-bark`](https://github.com/adamjkb/bark) | ツリー構造のMaterialized Pathパターンを実装します |
| [`prisma-cursorstream`](https://github.com/etabits/prisma-cursorstream) | カーソルベースのストリーミングを追加します |
| [`prisma-gpt`](https://github.com/aliyeysides/prisma-gpt) | 自然言語を使用してデータベースにクエリできるようにします |
| [`prisma-extension-pagination`](https://github.com/deptyped/prisma-extension-pagination) | ページネーション機能を追加します |
| [`prisma-extension-redis`](https://github.com/yxx4c/prisma-extension-redis) | Redisキャッシングサポートを追加します |
| [`prisma-json-types-generator`](https://github.com/arthurfiorette/prisma-json-types-generator) | JSON型に型安全性を提供します |

## 例

注意: これらはデモンストレーション目的の拡張例です。

拡張例には以下が含まれます:

- **`audit-log-context`**: Postgresの監査ログトリガーにユーザーIDコンテキストを提供します
- **`callback-free-itx`**: コールバックなしでインタラクティブトランザクションを開始するメソッドを追加します
- **`computed-fields`**: 結果オブジェクトに仮想/計算フィールドを追加します
- **`input-transformation`**: クエリ結果フィルタリングのための入力引数を変換します
- **`input-validation`**: ミューテーションメソッドの入力でカスタム検証を実行します
- **`readonly`**: 読み取り専用モードを実装します
- **`static-methods`**: モデルに静的メソッドを追加します
- **`transformed-fields`**: フィールド値を自動的に変換します
- **`model-filters`**: モデルレベルのフィルターを追加します
- **`retry-transactions`**: 失敗したトランザクションを自動的に再試行します

## 拡張の作成例

### カスタム検証拡張

```typescript
import { Prisma } from '@prisma/client'

export default Prisma.defineExtension({
  name: 'validation',
  query: {
    user: {
      async create({ args, query }) {
        // メールアドレスの検証
        if (args.data.email && !isValidEmail(args.data.email)) {
          throw new Error('Invalid email address')
        }
        return query(args)
      }
    }
  }
})

function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}
```

### パフォーマンス監視拡張

```typescript
import { Prisma } from '@prisma/client'

export default Prisma.defineExtension({
  name: 'performance-monitor',
  query: {
    $allModels: {
      async $allOperations({ operation, model, args, query }) {
        const start = performance.now()
        const result = await query(args)
        const end = performance.now()
        const duration = end - start

        // 遅いクエリを警告
        if (duration > 1000) {
          console.warn(`Slow query detected: ${model}.${operation} took ${duration}ms`)
        }

        return result
      }
    }
  }
})
```

### ページネーション拡張

```typescript
import { Prisma } from '@prisma/client'

export default Prisma.defineExtension({
  name: 'pagination',
  model: {
    $allModels: {
      async paginate<T>(
        this: T,
        args: {
          page: number
          perPage: number
          where?: any
          orderBy?: any
        }
      ) {
        const context = Prisma.getExtensionContext(this)
        const { page, perPage, where, orderBy } = args

        const [data, total] = await Promise.all([
          (context as any).findMany({
            where,
            orderBy,
            skip: (page - 1) * perPage,
            take: perPage
          }),
          (context as any).count({ where })
        ])

        return {
          data,
          meta: {
            page,
            perPage,
            total,
            pageCount: Math.ceil(total / perPage)
          }
        }
      }
    }
  }
})
```

## さらに学ぶ

- [Prisma Client extensions](/docs/orm/prisma-client/client-extensions)についてさらに学ぶ
- [型ユーティリティ](/docs/orm/prisma-client/client-extensions/type-utilities)を使用して型安全な拡張を作成する
- [共有可能な拡張](/docs/orm/prisma-client/client-extensions/shared-extensions)の作成と公開方法を学ぶ
