# NullとUndefined

Prisma ORMでは、`null`は値であり、`undefined`は「何もしない」ことを意味します。

## Strict Undefined Checks（プレビュー機能）

Prisma 5.20.0で導入されました。

### 有効化

```prisma
generator client {
  provider = "prisma-client-js"
  previewFeatures = ["strictUndefinedChecks"]
}
```

### 主な動作

- フィールドを明示的に`undefined`に設定すると、ランタイムエラーが発生します
- `Prisma.skip`を使用してクエリからフィールドを省略します

```typescript
// エラーを投げる
prisma.user.create({
  data: {
    name: 'Alice',
    email: undefined // エラー
  }
})

// 正しいアプローチ
prisma.user.create({
  data: {
    name: 'Alice',
    email: Prisma.skip // フィールドを省略
  }
})
```

## strictUndefinedChecksなしの現在の動作

### 1. クエリでのNull

`null`は空/nullカラム値を検索します。

```typescript
findMany({ where: { name: null } }) // null名のレコードを返す
```

### 2. クエリでのUndefined

`undefined`は「フィルタなし」を意味し、すべてのレコードを返します。

### 3. GraphQL Resolverの考慮事項

- `null`値に注意してください
- 意図しない更新を避けるために`undefined`の使用を優先
- オプションフィールドを処理するために条件チェックを使用

## 推奨プラクティス

- `strictUndefinedChecks`を有効にする
- TypeScriptの`exactOptionalPropertyTypes`を検討
- クエリで`null`と`undefined`を慎重に処理

ドキュメントは、偶発的なデータ損失を防ぎ、より明示的なクエリ動作を提供することを強調しています。
