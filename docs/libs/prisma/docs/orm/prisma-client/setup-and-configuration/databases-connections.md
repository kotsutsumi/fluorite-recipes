# データベース接続

データベースは同時接続の数に制限があります。各接続にはRAMが必要で、リソースを拡張せずに接続制限を増やすと、データベースのパフォーマンスに大きな影響を与える可能性があります。

## 長時間実行プロセス

Herokuや仮想マシン上でホストされるNode.jsアプリケーションなどが該当します。

### 推奨接続プールサイズ

長時間実行プロセスの推奨接続プールサイズ：

**（デフォルトプールサイズ）÷（アプリケーションインスタンス数）**

デフォルトプールサイズ = `num_physical_cpus * 2 + 1`

### PrismaClientのグローバルインスタンス

```typescript
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export default prisma
```

## サーバーレス環境（FaaS）

AWS Lambda、Vercel、Netlifyなどのサーバーレス環境では、接続管理が異なります。

### 推奨事項

- 接続プールサイズを小さく設定
- インスタンスをグローバル変数にキャッシュ
- 接続タイムアウトを短く設定

### 例

```typescript
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.DATABASE_URL,
    },
  },
})

export default prisma
```

## 接続プールの設定

接続文字列でプールサイズを設定できます：

```
postgresql://user:password@localhost:5432/mydb?connection_limit=10
```

または、Prismaスキーマで：

```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}
```

## ベストプラクティス

1. アプリケーション全体で単一のPrismaClientインスタンスを使用
2. 適切な接続プールサイズを設定
3. サーバーレス環境では接続を積極的に管理
4. 接続タイムアウトを適切に設定
