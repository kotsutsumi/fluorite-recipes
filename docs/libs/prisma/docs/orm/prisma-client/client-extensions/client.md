# `client`: Prisma Clientにメソッドを追加する

> Prisma Client extensionsは、バージョン4.16.0以降でGenerally Availableです。

`client` Prisma Client extensionsコンポーネントを使用して、Prisma Clientにトップレベルメソッドを追加できます。

## Prisma Clientを拡張する

`$extends`クライアントレベルメソッドを使用して、_拡張クライアント_を作成します。`client`拡張コンポーネントを使用して、Prisma Clientにトップレベルメソッドを追加します:

```typescript
const prisma = new PrismaClient().$extends({
  client?: { ... }
})
```

### 例

次の例では、Prisma Clientに2つのメソッドを追加します:
- `$log`はメッセージを出力します
- `$totalQueries`は実行されたクエリの数を返します

```typescript
const prisma = new PrismaClient().$extends({
  client: {
    $log: (s: string) => console.log(s),
    async $totalQueries() {
      const index_prisma_client_queries_total = 0
      const metricsCounters = await (
        await Prisma.getExtensionContext(this).$metrics.json()
      ).counters
      return metricsCounters[index_prisma_client_queries_total].value
    },
  },
})

async function main() {
  prisma.$log('Hello world')
  const totalQueries = await prisma.$totalQueries()
  console.log(totalQueries)
}
```

注意: メトリクスを使用するには、`schema.prisma`ファイルの`generator`ブロックで`metrics`フィーチャーフラグを有効にする必要があります。
