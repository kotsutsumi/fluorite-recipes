# インデックス

Prisma ORMは、データベースのインデックス、ユニーク制約、主キー制約の設定を可能にします。この機能はバージョン4.0.0以降で一般提供されています。

## インデックス設定

インデックスを設定するための主な引数：

### `length`引数（MySQL）

文字列およびバイト型のインデックスの最大長を指定します。MySQLのみで利用可能です。

```prisma
model Id {
  id String @id(length: 100) @db.VarChar(3000)
}
```

### `sort`引数

インデックスエントリの保存順序を指定します。MySQL/MariaDB、PostgreSQL、SQL Serverでサポートされています。

```prisma
model Post {
  slug String @unique(sort: Desc, length: 42) @db.VarChar(3000)
}
```

### `type`引数（PostgreSQL）

インデックスのアクセスメソッドを設定します。サポートされるタイプ：

- `Hash`: ハッシュインデックス
- `Gist`: 一般化検索ツリー
- `Gin`: 一般化転置インデックス
- `SpGist`: 空間分割一般化検索ツリー
- `Brin`: ブロック範囲インデックス

```prisma
model Post {
  id      Int    @id
  content String
  @@index([content], type: Gin)
}
```

### `clustered`引数（SQL Server）

インデックスをクラスター化または非クラスター化として設定します。

```prisma
model Post {
  id    Int    @id(clustered: false)
  title String
  @@index([title], clustered: true)
}
```

## フルテキストインデックス（MySQLとMongoDB）

`@@fulltext`属性を使用してフルテキストインデックスを設定できます。

```prisma
model Post {
  id      Int    @id
  title   String @db.VarChar(255)
  content String @db.Text
  @@fulltext([title, content])
}
```

## 複合インデックス

複数のフィールドにまたがるインデックスを作成できます。

```prisma
model Post {
  id        Int    @id
  title     String
  published Boolean
  @@index([title, published])
}
```

## 注意点

- バージョンアップ時に既存のインデックス設定が破壊的変更の対象となる場合があります
- インデックスはクエリのパフォーマンスを向上させますが、書き込み操作を遅くする可能性があります
- 適切なインデックス戦略はアプリケーションのクエリパターンに依存します
