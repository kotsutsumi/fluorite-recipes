# プリズマ クライアントのインスタンス化

## 基本的なインスタンス化

```typescript
import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()
```

## PrismaClientインスタンスの数が重要である理由

アプリケーションは通常、`PrismaClient`の**1つのインスタンス**のみを作成する必要があります。

### 長時間実行アプリケーション

グローバルに1つのインスタンスを作成し、アプリケーション全体で再利用します。

```typescript
// prisma.ts
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export default prisma
```

### サーバーレス環境

サーバーレス関数では、インスタンスをグローバル変数にキャッシュします。

```typescript
import { PrismaClient } from '@prisma/client'

const globalForPrisma = global as unknown as { prisma: PrismaClient }

export const prisma = globalForPrisma.prisma || new PrismaClient()

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma
```

## カスタマイズオプション

`PrismaClient`はコンストラクターパラメーターでカスタマイズできます：

- ログレベルの設定
- トランザクションオプションの設定
- エラーフォーマットのカスタマイズ

```typescript
const prisma = new PrismaClient({
  log: ['query', 'info', 'warn', 'error'],
  errorFormat: 'minimal',
})
```
