# Drizzle ORM: 外部キーを持つ部分的に公開されたテーブルのシーディング

このガイドでは、外部キー関係を持つデータベーステーブルをシーディングする際の課題、特にすべての関連テーブルがシーディング関数に公開されていない場合について説明します。

## 主なシナリオ

### シナリオ1: Not-Null外部キー制約

テーブルがnot-null制約を持つ外部キーカラムを持つ場合、いくつかのオプションがあります:

1. not-null制約を削除
2. 参照されるテーブルをシード関数に公開
3. カラムジェネレーターを改良

スキーマ例:
```typescript
export const users = pgTable("users", {
    id: serial("id").primaryKey(),
});

export const bloodPressure = pgTable("bloodPressure", {
    bloodPressureId: serial().primaryKey(),
    pressure: doublePrecision(),
    userId: integer().references(() => users.id).notNull(),
})
```

### シナリオ2: Nullable外部キー

外部キーがnullableの場合、潜在的なnull値について警告が表示されます。

## カラムジェネレーターの改良

外部キーのシーディング問題を解決するには、`refine`メソッドを使用できます:

```typescript
await seed(db, { bloodPressure }).refine((funcs) => ({
  bloodPressure: {
    columns: {
      userId: funcs.valuesFromArray({ values: [1, 2] })
    }
  }
}));
```

このアプローチでは、データベースに既存のユーザーIDが必要で、外部キーカラムの特定の値を指定できます。

## 主なポイント

- データベースのシーディング時は常に外部キー制約を考慮
- カスタム値生成には`refine`を使用
- 関連テーブルを公開するか、代替の値生成戦略を指定
- not-null制約は特別な注意が必要
- `valuesFromArray`で特定の値を提供
