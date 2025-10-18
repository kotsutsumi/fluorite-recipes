# サポートされていないデータベース機能

Prisma ORMのサポート対象データベースの全ての関数や機能が、Prismaスキーマ言語と同等というわけではありません。サポートされている機能の完全なリストについては、[データベース機能マトリックス](/docs/orm/reference/database-features)を参照してください。

## ネイティブデータベース関数

Prismaスキーマ言語は、フィールドのデフォルト値を設定するためのいくつかの関数をサポートしています。

### Prisma ORM レベルの関数

以下の例では、Prisma ORMレベルの`uuid()`関数を使用して`id`フィールドの値を設定しています：

```prisma
model Post {
  id String @id @default(uuid())
}
```

### ネイティブデータベース関数の使用

リレーショナルデータベース（MongoDBは除く）では、`dbgenerated(...)`を使用してネイティブデータベース関数でデフォルト値を定義することもできます。

以下の例では、PostgreSQLの`gen_random_uuid()`関数を使用して`id`フィールドを設定しています：

```prisma
model User {
  id String @id @default(dbgenerated("gen_random_uuid()")) @db.Uuid
}
```

## ネイティブデータベース関数を使用するタイミング

ネイティブデータベース関数を使用する理由は2つあります：

1. **Prisma ORMと同等の関数が存在しない場合**
   - 例：PostgreSQLの`gen_random_bytes`

2. **データベースレベルでの実装が必要な場合**
   - `uuid()`や`cuid()`などは、Prisma ORMレベルでのみ実装され、データベースには反映されません
   - データベースレベルでUUID生成が必要な場合は、`dbgenerated()`を使用

## Unsupported型

Prismaスキーマ言語でサポートされていないデータベース型を使用する場合、`Unsupported`型を使用できます：

```prisma
model User {
  id       Int                     @id
  name     String
  location Unsupported("geometry")
}
```

### Unsupported型の制限

- フィルタリング、ソート、その他の操作では使用できません
- 読み取りと書き込みのみ可能
- 型安全性は提供されません

## カスタムデータベース型

一部のデータベースでは、カスタム型を定義できます。これらの型は`Unsupported`として扱う必要があります。

## ベストプラクティス

1. 可能な限りPrismaがサポートする標準的な型を使用する
2. ネイティブ関数は必要な場合のみ使用する
3. `Unsupported`型の使用は最小限に抑える
4. データベース固有の機能に依存する場合は、ドキュメントに明記する
