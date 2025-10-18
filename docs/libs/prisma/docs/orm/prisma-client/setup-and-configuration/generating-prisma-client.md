# プリズマ クライアントの生成

プリズマ クライアントは、データベーススキーマに合わせて生成されるデータベースクライアントです。

## 基本的な使用方法

1. **プリズマ CLI をインストール**

2. **プリズマ スキーマにジェネレーター定義を追加**

```prisma
generator client {
  provider = "prisma-client-js"
  output   = "app/generated/prisma/client"
}
```

3. **@prisma/client npm パッケージをインストール**

```bash
npm install @prisma/client
```

4. **プリズマ クライアントを生成**

```bash
npx prisma generate
```

5. **コードでプリズマ クライアントを初期化**

```typescript
import { PrismaClient } from 'app/generated/prisma/client'
const prisma = new PrismaClient()
```

## 重要な注意事項

**重要**: プリズマ スキーマに変更を加えるたびに、`prisma generate` コマンドを再実行して、生成されたプリズマ クライアントコードを更新する必要があります。

**警告**: プリズマ ORM バージョン 7 では、プリズマ クライアントはデフォルトで `node_modules` に生成されなくなり、出力先を定義する必要があります。

## カスタム出力先の使用

デフォルトでは、プリズマ クライアントは `node_modules/.prisma/client` フォルダに生成されますが、カスタム出力先を指定することを強くお勧めします。

```prisma
generator client {
  provider = "prisma-client-js"
  output   = "./generated/client"
}
```

## 自動生成の内容

プリズマ クライアントを生成すると、以下が自動的に作成されます：

- 型安全なクエリビルダー
- モデルごとのCRUD操作
- TypeScript型定義
- リレーションのヘルパーメソッド
