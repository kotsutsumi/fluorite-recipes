# リレーション

リレーションは、Prismaスキーマ内の2つのモデル間の「接続」です。例えば、1人のユーザーが多くのブログ投稿を持つことができるため、`User`と`Post`の間に1対多のリレーションがあります。

## リレーションの種類

Prisma ORMには3つのリレーション種類があります：

1. **1対1リレーション**: 各レコードが別のモデルの最大1つのレコードに関連付けられる
2. **1対多リレーション**: 1つのレコードが別のモデルの複数のレコードに関連付けられる
3. **多対多リレーション**: 複数のレコードが別のモデルの複数のレコードに関連付けられる

## リレーションフィールド

リレーションフィールドは、スカラータイプではなく、別のモデルをタイプとして持つモデル上のフィールドです。

### リレーション属性

`@relation`属性は以下の場合に必要です：

- 1対1または1対多リレーションを定義する場合
- リレーションを明確にする必要がある場合
- 自己リレーションを定義する場合
- リレーションテーブルの表現を制御する場合

## リレーションの例

### 1対1リレーション

```prisma
model User {
  id      Int      @id @default(autoincrement())
  profile Profile?
}

model Profile {
  id     Int  @id @default(autoincrement())
  user   User @relation(fields: [userId], references: [id])
  userId Int  @unique
}
```

### 1対多リレーション

```prisma
model User {
  id    Int    @id @default(autoincrement())
  posts Post[]
}

model Post {
  id       Int  @id @default(autoincrement())
  author   User @relation(fields: [authorId], references: [id])
  authorId Int
}
```

### 多対多リレーション

```prisma
model Post {
  id         Int        @id @default(autoincrement())
  categories Category[]
}

model Category {
  id    Int    @id @default(autoincrement())
  posts Post[]
}
```

## リレーションの曖昧さ解消

2つのモデル間に複数のリレーションがある場合、`@relation`属性の`name`引数を使用してリレーションを明確にする必要があります。

## データベースでのリレーション

- **リレーショナルデータベース**: 外部キーを使用してテーブル間のリレーションを作成
- **MongoDB**: ドキュメントはIDによって相互に参照される

## Prisma Clientでのリレーション操作

Prisma Clientを使用すると、レコードの作成、読み取り、更新時にリレーションを簡単に操作できます。
