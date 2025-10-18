# 複合型（コンポジット型）

複合型はMongoDBでのみ利用可能で、他のレコード内にレコードを埋め込むことができます。

**状態**: v3.12.0以降Generally Available

## 制限事項

- `findUnique()`で複合型をフィルタに使用できません
- `aggregate`, `groupBy()`, `count`は複合操作をサポートしていません

## スキーマ例

```prisma
model Product {
  id     String  @id @default(auto()) @map("_id") @db.ObjectId
  name   String  @unique
  photos Photo[]
}

type Photo {
  height Int    @default(200)
  width  Int    @default(100)
  url    String
}
```

## 主な操作

### 1. レコードの検索

単一複合型用:
- `is`, `equals`, `isNot`, `isSet`

複数複合型用:
- `equals`, `isEmpty`, `every`, `some`, `none`

```typescript
const product = prisma.product.findMany({
  where: {
    photos: {
      some: { url: '2.jpg' }
    }
  }
})
```

### 2. レコードの作成

`set`を使用して複合型を作成:

```typescript
const product = await prisma.product.create({
  data: {
    name: 'Forest Runners',
    photos: [
      { height: 100, width: 200, url: '1.jpg' },
      { height: 100, width: 200, url: '2.jpg' }
    ]
  }
})
```

### 3. レコードの更新

単一型用: `set`, `unset`, `update`, `upsert`
複数型用: `set`, `push`, `updateMany`, `deleteMany`

```typescript
const product = prisma.product.update({
  where: { id: 'product-id' },
  data: {
    photos: {
      push: [{ height: 100, width: 200, url: '1.jpg' }]
    }
  }
})
```

## 主なユースケース

- MongoDBでの埋め込みドキュメント
- 関連データの非正規化ストレージ
- ネストされたオブジェクト構造

## 重要な注意事項

- MongoDBのみ
- 複合型でのユニーク検索の制限
- 単一または複数の複合型をサポート
