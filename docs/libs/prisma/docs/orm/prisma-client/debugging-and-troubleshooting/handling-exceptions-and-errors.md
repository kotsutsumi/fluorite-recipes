# 例外とエラーの処理

Prisma Clientのエラーを適切に処理します。

## エラータイプ

Prismaは以下のエラータイプを提供します:

- `PrismaClientKnownRequestError`: 既知のリクエストエラー
- `PrismaClientUnknownRequestError`: 不明なリクエストエラー
- `PrismaClientRustPanicError`: Rustパニックエラー
- `PrismaClientInitializationError`: 初期化エラー
- `PrismaClientValidationError`: バリデーションエラー

## エラーのキャッチ

```typescript
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library'

try {
  await prisma.user.create({
    data: { email: 'alice@prisma.io' },
  })
} catch (e) {
  if (e instanceof PrismaClientKnownRequestError) {
    if (e.code === 'P2002') {
      console.log('Email already exists')
    }
  }
  throw e
}
```

## 一般的なエラーコード

- `P2002`: Unique制約違反
- `P2003`: Foreign key制約違反
- `P2025`: レコードが見つからない

## ベストプラクティス

- 特定のエラーコードをキャッチ
- ユーザーフレンドリーなエラーメッセージを表示
- エラーをログに記録
