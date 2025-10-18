# メトリクス

Prisma Clientは、パフォーマンスメトリクスを収集する機能を提供します。

## メトリクスの有効化

`schema.prisma`でメトリクスフィーチャーフラグを有効化:

```prisma
generator client {
  provider        = "prisma-client-js"
  previewFeatures = ["metrics"]
}
```

## メトリクスの取得

```typescript
const prisma = new PrismaClient()

const metrics = await prisma.$metrics.json()
console.log(metrics)
```

## 利用可能なメトリクス

- `prisma_client_queries_total`: 実行されたクエリの総数
- `prisma_client_queries_duration_histogram_ms`: クエリの実行時間
- `prisma_datasource_queries_total`: データソースクエリの総数
- `prisma_pool_connections_open`: 開いている接続数

## Prometheusフォーマット

```typescript
const metrics = await prisma.$metrics.prometheus()
console.log(metrics)
```

## ベストプラクティス

- 定期的にメトリクスを収集
- パフォーマンスのボトルネックを特定
- ダッシュボードで可視化
