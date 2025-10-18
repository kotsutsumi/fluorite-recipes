# 計算フィールド

計算フィールドを使用すると、既存のデータに基づいて新しいフィールドを導出できます。これらは読み取り専用で、アプリケーションメモリに保存され、データベースには保存されません。

## 一般的な例

姓と名から完全な名前を計算する:

```typescript
const prisma = new PrismaClient().$extends({
  result: {
    user: {
      fullName: {
        needs: { firstName: true, lastName: true },
        compute(user) {
          return `${user.firstName} ${user.lastName}`
        },
      },
    },
  },
})
```

## 主な機能

- **型安全**: TypeScriptの完全な型サポート
- **単純または複雑な値**: 単純な値または複雑なオブジェクトを返せます
- **インスタンスメソッドとして**: モデルのインスタンスメソッドのように動作できます

## バージョン 4.16.0 以前の代替アプローチ

ジェネリック型拡張を使用:

```typescript
// 手動で作成された関数で計算フィールドを追加
function addComputedAttribute(obj: User): UserWithComputedField {
  return {
    ...obj,
    computedField: computeValue(obj)
  }
}
```

## 重要な注意事項

- 計算フィールドはアクセス時に計算され、取得時ではありません
- スカラーフィールドのみを計算に使用できます
- `select`クエリでのみ機能します
- リレーションフィールドは計算に使用できません

## 制限事項

現在、result extensionsはリレーションフィールドをサポートしていません。関連モデルに基づくカスタムフィールドは作成できません。

## GitHubでの機能リクエスト

Prismaでのネイティブ計算フィールドサポートのためのオープンな機能リクエストがあります。開発者は、類似の機能のためにClient ExtensionsまたはCustom Modelsを使用できます。

計算フィールドは、データベーススキーマを変更せずに追加情報を導出する柔軟な方法を提供します。
