# デバッグ

Prisma Clientのデバッグ機能を使用して、問題を特定および解決します。

## デバッグモードの有効化

環境変数を設定:

```bash
DEBUG="prisma:*" node index.js
```

または、プログラムで設定:

```typescript
const prisma = new PrismaClient({
  log: [
    { emit: 'stdout', level: 'query' },
    { emit: 'stdout', level: 'info' },
    { emit: 'stdout', level: 'warn' },
    { emit: 'stdout', level: 'error' },
  ],
})
```

## デバッグレベル

- `prisma:query`: クエリの詳細
- `prisma:info`: 情報メッセージ
- `prisma:warn`: 警告メッセージ
- `prisma:error`: エラーメッセージ
- `prisma:*`: すべてのデバッグ情報

## クエリのデバッグ

```typescript
prisma.$on('query', (e) => {
  console.log('Query: ' + e.query)
  console.log('Params: ' + e.params)
  console.log('Duration: ' + e.duration + 'ms')
})
```

## ベストプラクティス

- 開発環境でデバッグモードを有効化
- 本番環境ではデバッグ出力を無効化
- クエリパフォーマンスを監視
