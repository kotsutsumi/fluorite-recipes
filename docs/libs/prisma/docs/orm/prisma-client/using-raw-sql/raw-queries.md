# Rawクエリ

Prisma ClientはRaw SQLクエリを実行するためのいくつかのメソッドを提供します。

## リレーショナルデータベース用

### 1. `$queryRaw`

データベースレコードを返します。タグ付きテンプレートを使用します。

```typescript
const result = await prisma.$queryRaw`SELECT * FROM User`;
```

### 2. `$queryRawUnsafe()`

Raw文字列を使用してデータベースレコードを返します。より柔軟ですが、潜在的に安全性が低いです。

### 3. `$executeRaw`

影響を受けた行数を返します。UPDATE、DELETE操作に使用されます。

```typescript
const result = await prisma.$executeRaw`UPDATE User SET active = true`;
```

### 4. `$executeRawUnsafe()`

Raw SQLを実行し、影響を受けた行数を返します。注意深いパラメータ処理が必要です。

## MongoDB用（バージョン3.9.0以降）

1. **`$runCommandRaw()`**: Raw MongoDBデータベースコマンドを実行
2. **`findRaw()`**: フィルタに一致するドキュメントを検索
3. **`aggregateRaw()`**: 集約操作を実行

## 主な安全性の考慮事項

- 常にパラメータ化クエリまたはタグ付きテンプレートを使用
- ユーザー入力との文字列連結を避ける
- 潜在的なSQLインジェクションの脆弱性に注意

## 型マッピング

Prismaは自動的にデータベース型をJavaScript型にマップします:
- Text → String
- Integer → Number
- DateTime → Date
- Decimal → Decimal
- Bytes → Uint8Array

## トランザクションと変数

- Rawクエリはトランザクション内で使用可能
- タグ付きテンプレートを使用して変数を安全に補間
- データベース固有のマーカーを持つパラメータ化クエリをサポート

## 制限事項

- 単一ステートメントで複数のクエリを使用できません
- 一部のSQLステートメント（`ALTER`など）には制限があります
- ほとんどのメソッドでテーブルやカラム名を動的に渡すことはできません

## ベストプラクティス

- 可能な限りPrismaのORMメソッドを使用
- 非常に特定的または最適化されたデータベースインタラクションのためにRawクエリを最後の手段として扱う
- タグ付きテンプレートを使用して安全性を確保

ドキュメントは、可能な限りPrismaのORMメソッドを使用し、非常に特定的または最適化されたデータベースインタラクションのための最後の手段としてRawクエリを扱うことを強調しています。
