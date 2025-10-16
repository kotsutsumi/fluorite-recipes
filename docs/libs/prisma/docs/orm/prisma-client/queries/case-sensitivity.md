# 大文字小文字の区別

大文字小文字の区別は、データのフィルタリングとソートに影響を与え、データベース照合によって決定されます。動作はデータベースプロバイダーによって異なります。

## 大文字小文字の区別の違い

- **区別する**: `Apple`, `Banana`, `apple pie`, `banana pie`は別々に扱われます
- **区別しない**: `Apple`と`apple`は同じと見なされます

## データベース固有の動作

### 1. PostgreSQL

デフォルトは大文字小文字を区別します。

```typescript
const users = await prisma.user.findMany({
  where: {
    email: {
      endsWith: 'prisma.io',
      mode: 'insensitive'  // 大文字小文字を区別しない
    }
  }
})
```

### 2. MySQL

デフォルトで大文字小文字を区別しません。
- `mode`プロパティは利用できません
- 大文字小文字を区別しない (`_ci`) 照合が必要です

### 3. MongoDB

大文字小文字を区別しないフィルタリングにはRegExを使用:

```typescript
const users = await prisma.user.findMany({
  where: {
    email: {
      contains: 'prisma',
      mode: 'insensitive'
    }
  }
})
```

### 4. SQLite

制限された大文字小文字を区別しないサポート（ASCIIのみ）:
- 大文字小文字を区別しないカラムには`COLLATE NOCASE`が必要です

### 5. Microsoft SQL Server

デフォルトで大文字小文字を区別しません。
- `mode`プロパティは利用できません

## パフォーマンスの考慮事項

PostgreSQLの場合、大文字小文字を区別しないクエリのパフォーマンスを向上させるために特殊なインデックスを作成することを検討してください:

- `equals`または`not`のための式インデックス
- `startsWith`, `endsWith`, `contains`のためのトライグラムベースのインデックス

## 重要な注意点

- **PostgreSQL**: C照合では大文字小文字を区別しないフィルタリングは使用できません
- `citext`カラムは常に大文字小文字を区別しません
- **SQLite**: 大文字小文字の区別なしはASCII文字に限定されています

将来の改善のために、GitHubで大文字小文字を区別しないソートの進捗を確認することをドキュメントは推奨しています。
