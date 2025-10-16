# データベースマッピング

Prismaスキーマには、特定のデータベースオブジェクトの名前を定義するメカニズムが含まれています。

## できること

- モデルとフィールド名を異なるコレクション/テーブルおよびフィールド/カラム名にマッピング
- 制約とインデックス名の定義

## コレクション/テーブルおよびフィールド/カラム名のマッピング

データベース内のエンティティを説明する名前が、生成されるAPIの名前と一致しない場合があります。Prismaスキーマで名前をマッピングすることで、データベースを変更せずにクライアントAPIの名前を調整できます。

### コレクション/テーブル名のマッピング

データベースに`comments`テーブルがある場合、デフォルトのPrismaモデルは次のようになります：

```prisma
model comments {
  // Fields
}
```

`@@map`属性を使用して、モデル名を`Comment`に変更できます：

```prisma
model Comment {
  id      Int    @id @default(autoincrement())
  content String
  @@map("comments")
}
```

### フィールド/カラム名のマッピング

`@map`を使用してカラム/フィールド名をマッピングできます：

```prisma
model Comment {
  id      Int    @id @default(autoincrement())
  content String @map("comment_text")
  email   String @map("commenter_email")
  type    Enum   @map("comment_type")
  @@map("comments")
}
```

### 列挙型の名前と値のマッピング

列挙型の値や列挙型自体を`@map`できます：

```prisma
enum Type {
  Blog
  Twitter @map("comment_twitter")
  @@map("comment_source_enum")
}
```

## 制約とインデックスの名前付け

制約とインデックスに明示的な名前を付けることができます：

```prisma
model Comment {
  id      Int    @id(map: "comment_id") @default(autoincrement())
  content String
  email   String
  @@unique([email], name: "unique_email")
  @@index([email], name: "email_index")
  @@map("comments")
}
```

## ユースケース

### レガシーデータベースとの統合

既存のデータベースでは、テーブル名やカラム名が命名規則に従っていない場合があります。マッピングを使用して、Prisma Client APIをきれいに保ちながら、既存のデータベース構造を維持できます。

### 複数言語対応

データベースは英語以外の言語で命名されているが、APIは英語で公開したい場合に有用です。

### 段階的な移行

既存のコードベースを破壊せずに、徐々に名前を変更できます。
