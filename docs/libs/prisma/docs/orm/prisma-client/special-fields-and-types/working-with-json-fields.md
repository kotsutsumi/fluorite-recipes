# JSONフィールドの操作

PrismaのJSONフィールド型を使用して、柔軟な非構造化データを保存します。

## 主な概念

- 一貫した構造のないデータを保存
- 複雑なマッピングなしで外部システムからデータをインポート
- `string`, `number`, `boolean`, `null`, オブジェクト、配列をサポート

## 基本操作

### JSONフィールドの読み取り

```typescript
const user = await prisma.user.findFirst({
  where: { id: 9 }
})

// JSONデータの型チェック
if (user?.extendedPetsData && typeof user?.extendedPetsData === 'object') {
  const petsObject = user?.extendedPetsData as Prisma.JsonArray
}
```

### JSONフィールドの書き込み

```typescript
const createUser = await prisma.user.create({
  data: {
    email: 'example@prisma.io',
    extendedPetsData: [{ name: 'Bob the dog' }]
  }
})
```

## JSONフィールドのフィルタリング

### シンプルなフィルタリング

```typescript
// 完全一致
const users = await prisma.user.findMany({
  where: {
    extendedPetsData: {
      equals: jsonData
    }
  }
})
```

### 高度なフィルタリング

- ネストされたプロパティでのフィルタリング
- PostgreSQLとMySQLで異なる構文
- フィルタ可能:
  - オブジェクトプロパティ
  - ネストされたオブジェクトプロパティ
  - 配列値
  - 特定の配列インデックス

## Null処理

- 正確なnull値管理のために`JsonNull`, `DbNull`, `AnyNull`をサポート

## 型付きJSONフィールド

強い型付けには`prisma-json-types-generator`を使用:

```prisma
model User {
  id Int @id
  /// @zod.custom.use(z.object({ name: z.string() }))
  extendedPetsData Json?
}
```

## 制限事項

- JSON値のサブセットを選択できません
- キー存在でのフィルタリングなし
- 大文字小文字を区別しないフィルタリングなし
- JSONオブジェクトプロパティをソートできません

## スキーマ例

```prisma
model User {
  id               Int     @id @default(autoincrement())
  extendedPetsData Json?
}
```

JSONフィールドは、データベースに非構造化データを保存するための柔軟な方法を提供し、型安全性のオプションを備えています。
