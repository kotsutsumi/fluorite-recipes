# ログ記録

Prisma Clientは、クエリとイベントのログ記録機能を提供します。

## ログレベルの設定

```typescript
const prisma = new PrismaClient({
  log: ['query', 'info', 'warn', 'error'],
})
```

利用可能なログレベル:
- `query`: 実行されたクエリ
- `info`: 情報メッセージ
- `warn`: 警告メッセージ
- `error`: エラーメッセージ

## イベントベースのログ記録

```typescript
const prisma = new PrismaClient({
  log: [
    { emit: 'event', level: 'query' },
    { emit: 'stdout', level: 'info' },
    { emit: 'stdout', level: 'warn' },
    { emit: 'stdout', level: 'error' },
  ],
})

prisma.$on('query', (e) => {
  console.log('Query: ' + e.query)
  console.log('Duration: ' + e.duration + 'ms')
})
```

## ベストプラクティス

- 開発環境では`query`ログを有効化
- 本番環境では`error`と`warn`のみを記録
- 構造化ログを使用してログ分析を容易化
