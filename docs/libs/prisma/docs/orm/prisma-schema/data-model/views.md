# Prismaスキーマでのビューの使用方法

## ビューとは

データベースビューは、名前を付けて保存されたクエリです。

- **リレーショナルデータベース**: 複数のテーブルの列や集計値を含む格納されたSQLクエリ
- **MongoDB**: 他のコレクションに対する集約パイプラインで定義されたクエリ可能なオブジェクト

## ビュー機能を有効にする

ビュー機能を使用するには、`prisma.schema`の`generator`ブロックに`views`プレビュー機能フラグを追加します：

```prisma
generator client {
  provider        = "prisma-client-js"
  previewFeatures = ["views"]
}
```

## ビューの作成と追加

### 1. データベースに手動でビューを作成

```sql
CREATE VIEW UserInfo AS
SELECT u.id, u.name, u.email, p.bio
FROM User u
LEFT JOIN Profile p ON u.id = p.userId;
```

### 2. Prismaスキーマにビューを追加

手動で追加する場合：

```prisma
view UserInfo {
  id    Int    @unique
  name  String
  email String
  bio   String?
}
```

または、イントロスペクション（PostgreSQL、MySQL、SQL ServerおよびCockroachDBのみ）を使用：

```bash
npx prisma db pull
```

## Prismaクライアントでのビューの操作

ビューは読み取り専用で、以下のように問い合わせできます：

```typescript
const userinfo = await prisma.userInfo.findMany({
  where: {
    name: 'Alice',
  },
})
```

## 制限事項

ビューには以下の制限があります：

- 主キーを定義できない
- インデックスを作成できない
- 書き込みクエリ（作成、更新、削除）は無効
- `@unique`属性は強制されない

## ユースケース

ビューは以下の場合に有用です：

- 複雑な結合クエリを簡素化する
- データへのアクセスを制限する（セキュリティ）
- 計算フィールドや集計データを提供する
- レガシーデータベーススキーマとの互換性を維持する

**注意**: ビュー機能は現在プレビュー段階です。
