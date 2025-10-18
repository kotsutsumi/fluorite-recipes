# `result`: クエリ結果にカスタムフィールドとメソッドを追加する

> Prisma Client extensionsは、バージョン4.16.0以降でGenerally Availableです。バージョン4.7.0でPreviewとして導入されました。4.16.0より前のバージョンを使用している場合は、`clientExtensions`プレビューフィーチャーフラグを有効にしてください。

`result` Prisma Client extensionsコンポーネントタイプを使用して、クエリ結果にカスタムフィールドとメソッドを追加できます。

`$extends`クライアントレベルメソッドを使用して、_拡張クライアント_を作成します。拡張クライアントは、1つ以上の拡張によってラップされた標準のPrisma Clientのバリアントです。

カスタムフィールドまたはメソッドをクエリ結果に追加するには、次の構造を使用します。この例では、`user`モデルクエリの結果にカスタムフィールド`myComputedField`を追加します。

```typescript
const prisma = new PrismaClient().$extends({
  name?: 'name',
  result?: {
    user: {                   // この場合、`user`モデルを拡張します
      myComputedField: {      // 新しい計算フィールドの名前
        needs: { ... },
        compute() { ... }
      },
    },
  },
});
```

パラメータは以下の通りです:

* `name`: (オプション) エラーログに表示される拡張の名前を指定します。
* `result`: クエリ結果に新しいフィールドとメソッドを定義します。
* `needs`: 結果フィールドの依存関係を記述するオブジェクト。
* `compute`: アクセス時に仮想フィールドがどのように計算されるかを定義するメソッド。

## クエリ結果にカスタムフィールドを追加する

`result`拡張コンポーネントを使用して、クエリ結果にフィールドを追加できます。

### 例: フルネームの計算

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

// 使用例
const user = await prisma.user.findFirst()
console.log(user.fullName) // "John Doe"
```

この例では、`firstName`と`lastName`から`fullName`を計算する仮想フィールドを追加しています。

## クエリ結果にカスタムメソッドを追加する

`result`拡張を使用して、結果オブジェクトにメソッドを追加することもできます。

### 例: メールアドレスの検証メソッド

```typescript
const prisma = new PrismaClient().$extends({
  result: {
    user: {
      isValidEmail: {
        needs: { email: true },
        compute(user) {
          return () => {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
            return emailRegex.test(user.email)
          }
        },
      },
    },
  },
})

// 使用例
const user = await prisma.user.findFirst()
if (user.isValidEmail()) {
  console.log('Valid email')
}
```

## needsフィールドについて

`needs`オブジェクトは、計算フィールドが依存するデータベースフィールドを指定します。これにより、Prismaは必要なデータのみをフェッチし、パフォーマンスを最適化できます。

```typescript
needs: { firstName: true, lastName: true }
```

この指定により、`fullName`を計算するために`firstName`と`lastName`が必要であることをPrismaに伝えます。
