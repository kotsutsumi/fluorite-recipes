# エラーフォーマットの設定

デフォルトでは、Prismaクライアントは ANSIエスケープ文字を使用して、エラースタックを整形し、問題の解決方法を推奨します。

## エラーフォーマットレベル

### 1. プリティエラー（デフォルト）

カラー付きの完全なスタックトレース、コードの構文ハイライト、問題の解決策を含む拡張エラーメッセージ。

### 2. カラーレスエラー

プリティエラーと同じですが、カラーなし。

### 3. ミニマルエラー

生のエラーメッセージのみ。

## 設定方法

### 環境変数による設定

```bash
# カラーを削除
NO_COLOR=1

# 本番環境でミニマルエラーを使用
NODE_ENV=production
```

### PrismaClientコンストラクターによる設定

```typescript
const prisma = new PrismaClient({
  errorFormat: 'minimal', // 'pretty' | 'colorless' | 'minimal'
})
```

## ユースケース

### 開発環境

```typescript
const prisma = new PrismaClient({
  errorFormat: 'pretty', // 詳細なエラー情報
})
```

### 本番環境

```typescript
const prisma = new PrismaClient({
  errorFormat: 'minimal', // 最小限のエラー情報
})
```

### GraphQL API

```typescript
const prisma = new PrismaClient({
  errorFormat: 'minimal', // APIレスポンスに適した最小限のエラー
})
```

## ベストプラクティス

- 開発環境では`pretty`を使用して、デバッグを容易にする
- 本番環境では`minimal`を使用して、機密情報の漏洩を防ぐ
- ログシステムと統合する場合は`colorless`を使用
