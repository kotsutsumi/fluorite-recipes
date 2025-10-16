# 特殊なフィールドと型

Prisma Clientは、様々な特殊なフィールド型と値の操作をサポートしています。

## 1. `Decimal`の操作

Decimal.jsライブラリを使用します。

```typescript
const newTypes = await prisma.sample.create({
  data: {
    cost: new Prisma.Decimal(24.454545),
  },
})
```

- 算術演算をサポート
- MongoDBではサポートされていません

## 2. `BigInt`の操作

Node.js 10.4.0以降が必要です。

```typescript
const newTypes = await prisma.sample.create({
  data: {
    revenue: BigInt(534543543534),
  },
})
```

- シリアライズにはカスタム`JSON.stringify`実装が必要

## 3. `Bytes`の操作

`Uint8Array`で表現されます。

```typescript
const newTypes = await prisma.sample.create({
  data: {
    myField: new Uint8Array([1, 2, 3, 4]),
  },
})
```

## 4. `DateTime`の操作

文字列ではなく、`Date`オブジェクトを使用する必要があります。

```typescript
await prisma.user.create({
  data: {
    birthDate: new Date('1998-12-24T06:22:33.444Z')
  }
})
```

様々な日付形式をサポートします。

## 5. 追加の特殊型

- **`Json`フィールド**: 柔軟な非構造化データ
- **スカラーリスト/配列**: 値のリスト
- **複合IDと制約**: 複数フィールドの一意性

## 使用ガイドライン

各セクションは、Prisma Clientでこれらの特殊フィールド型を操作するためのコード例と使用ガイドラインを提供します。

## 重要な注意事項

- 各型には特定の要件があります
- データベースサポートは異なる場合があります
- 型安全性を確保するために適切な型を使用してください
