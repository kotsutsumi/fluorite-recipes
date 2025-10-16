# モデル

モデルは、アプリケーションドメインのエンティティを表現し、データベースのテーブルまたはコレクションにマッピングされます。

## 主な特徴

- アプリケーションドメインのエンティティを表現
- データベースのテーブルまたはコレクションにマッピング
- Prisma Clientのクエリの基盤を形成
- TypeScriptと組み合わせることで、完全な型安全性を提供

## モデルの定義方法

モデルの定義方法は2つあります：

1. データモデルを手動で作成し、Prisma Migrateを使用
2. データベースの内省（イントロスペクション）によりモデルを生成

## モデル定義の例

```prisma
model User {
  id      Int      @id @default(autoincrement())
  email   String   @unique
  name    String?
  role    Role     @default(USER)
  posts   Post[]
  profile Profile?
}

model Post {
  id        Int      @id @default(autoincrement())
  title     String
  content   String?
  published Boolean  @default(false)
  author    User     @relation(fields: [authorId], references: [id])
  authorId  Int
}

enum Role {
  USER
  ADMIN
}
```

## モデルの主な構成要素

- **フィールド名**: フィールドの識別子
- **フィールドタイプ**: データ型（String, Int, Booleanなど）
- **型修飾子**: オプショナル（?）や配列（[]）
- **属性**: @idや@uniqueなどの制約

## フィールドタイプ

モデルには以下のタイプのフィールドがあります：

- **スカラーフィールド**: 文字列、整数、ブール値などの基本データ型
- **リレーションフィールド**: 他のモデルへの参照

## Prisma Clientの自動生成クエリ

Prisma Clientは、各モデルに対して以下のCRUDクエリを自動生成します：

- `findMany()`: 複数のレコードを取得
- `findUnique()`: 一意のレコードを取得
- `create()`: レコードを作成
- `update()`: レコードを更新
- `delete()`: レコードを削除
- `upsert()`: レコードを作成または更新

## TypeScript型の自動生成

TypeScriptを使用する場合、モデルの型定義も自動生成され、コンパイル時の型安全性を提供します。
