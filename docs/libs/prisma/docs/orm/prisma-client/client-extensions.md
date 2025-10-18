# Client Extensions

Prisma Client Extensionsは、Prisma Clientに機能を追加できます。

## 拡張タイプ

- **`model`**: モデルにカスタムメソッド/フィールドを追加
- **`client`**: クライアントレベルのメソッドを追加
- **`query`**: カスタムクエリを作成
- **`result`**: クエリ結果にカスタムフィールドを追加

## 拡張の作成

### 方法1: `$extends`メソッドを直接使用

```typescript
const prisma = new PrismaClient().$extends({
  name: 'signUp', // オプション
  model: {
    user: { /* カスタムメソッド */ }
  }
})
```

### 方法2: `Prisma.defineExtension`を使用

```typescript
const myExtension = Prisma.defineExtension({
  name: 'signUp',
  model: {
    user: { /* カスタムメソッド */ }
  }
})
const prisma = new PrismaClient().$extends(myExtension)
```

## 拡張クライアント

- 独立して動作
- 同じクエリエンジンを共有
- 接続プールを共有
- ユースケース:
  - 行レベルセキュリティ
  - カスタムメソッドの追加
  - ロギングの実装
  - アクセス制御

## 複数の拡張

- 複数の拡張を組み合わせ可能
- 最後に宣言された拡張が競合時に優先

## 制限事項

- 拡張クライアントでは`$on`と`$use`は利用不可
- クライアントレベルのメソッドは存在チェックが必要な場合がある
- `query`拡張ではネストされた読み取り/書き込み操作のサポートなし

Prisma Clientの機能を柔軟で型安全な拡張システムを通じて拡張するための包括的なガイドを提供します。
