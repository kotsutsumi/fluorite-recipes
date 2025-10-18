# Prisma ORMの先にあるもの

Prisma ORMユーザーとして、型安全なデータベースクエリと直感的なデータモデリングの力を既に体験しています。本番アプリケーションをスケールする際、新たな課題が生まれます。

## Prisma アクセラレートでアプリケーションのパフォーマンスを向上

アプリケーションの拡大に伴い、以下の機能が提供されます：

### コネクションプーリングによるクエリパフォーマンスの改善

15以上のグローバルリージョンにコネクションプーラーを配置し、データベース操作の遅延を最小限に抑えます。

### キャッシングによるクエリ遅延とデータベース負荷の削減

300以上のグローバルポイントでクエリ結果をキャッシュします。`ttl`や`swr`などのキャッシュ戦略を提供します。

### マネージドインフラストラクチャによるトラフィックスケーリング

数百万のクエリを、インフラ変更なしでサポートします。

### アクセラレートの使用例

```typescript
import { PrismaClient } from '@prisma/client'
import { withAccelerate } from '@prisma/extension-accelerate'

const prisma = new PrismaClient().$extends(withAccelerate())

const users = await prisma.user.findMany({
  cacheStrategy: {
     ttl: 30,
     swr: 60
  }
})
```

## Prismaと共に成長

Prisma アクセラレートは、ORMの機能を拡張し、グローバルに最適化されたキャッシングとコネクションプーリングを提供します。

### Prisma Optimize

クエリのパフォーマンスを監視し、最適化の推奨事項を取得します。

### Prisma Postgres

マネージドPostgreSQLデータベースサービスで、Prisma ORMとシームレスに統合されます。
