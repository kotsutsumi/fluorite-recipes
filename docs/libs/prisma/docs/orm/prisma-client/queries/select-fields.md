# フィールドの選択

デフォルトでは、Prisma Clientはスカラーフィールドのみを返し、リレーションは含まれません。`select`と`include`を使用して、返されるフィールドを制御できます。

## select

### 基本的な使用

```typescript
const user = await prisma.user.findFirst({
  select: {
    email: true,
    name: true
  }
})
// 結果: { email: string, name: string }
```

### ネストされたリレーションの選択

```typescript
const usersWithPosts = await prisma.user.findFirst({
  select: {
    name: true,
    posts: {
      select: {
        title: true
      }
    }
  }
})
// 結果: { name: string, posts: { title: string }[] }
```

## include

リレーションを含める場合に使用します。

### 基本的な使用

```typescript
const user = await prisma.user.findFirst({
  include: {
    posts: true
  }
})
// 結果: すべてのユーザーフィールド + 投稿の配列
```

### ネストされたリレーション

```typescript
const user = await prisma.user.findFirst({
  include: {
    posts: {
      include: {
        comments: true
      }
    }
  }
})
```

## omit

特定のフィールドを除外します（Prisma 5.13.0以降）。

```typescript
const users = await prisma.user.findFirst({
  omit: {
    password: true
  }
})
// 結果: passwordを除くすべてのフィールド
```

## selectとincludeの組み合わせ

同じクエリ内で`select`と`include`を組み合わせることはできません。どちらか一方を選択する必要があります。

## 実用的な例

### セキュアなユーザー情報の取得

```typescript
const safeUser = await prisma.user.findUnique({
  where: { id: 1 },
  select: {
    id: true,
    email: true,
    name: true,
    // password は除外
  }
})
```

### パフォーマンス最適化

```typescript
// 必要なフィールドのみを選択してデータ転送を削減
const users = await prisma.user.findMany({
  select: {
    id: true,
    name: true,
    posts: {
      select: {
        id: true,
        title: true
      },
      take: 5 // 最新5件のみ
    }
  }
})
```

## 型安全性

選択したフィールドに基づいて、TypeScriptの型が自動的に推論されます。

```typescript
const user = await prisma.user.findFirst({
  select: {
    email: true,
    name: true
  }
})

// user.id にアクセスしようとするとTypeScriptエラー
// user.email と user.name のみアクセス可能
```

## ベストプラクティス

- 必要なフィールドのみを選択してパフォーマンスを向上
- 機密情報（パスワードなど）は`omit`で除外
- ネストが深すぎるクエリは避ける
- APIレスポンスには`select`を使用してデータ量を制限
