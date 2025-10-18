# リレーションクエリ

Prisma Clientのリレーションクエリを使用すると、モデル間のリレーションシップをクエリできます。関連レコード間でネストされた読み取り、書き込み、フィルタリングをサポートします。

## 主な機能

### 1. ネストされた読み取り

`include`を使用して関連レコードをフェッチします:

```typescript
const user = await prisma.user.findFirst({
  include: {
    posts: {
      include: {
        categories: true
      }
    }
  }
})
```

`select`を使用して特定の関連フィールドを選択します:

```typescript
const user = await prisma.user.findFirst({
  select: {
    name: true,
    posts: {
      select: {
        title: true
      }
    }
  }
})
```

複数レベルの深さまでリレーションをネストできます。

### 2. リレーション読み込み戦略（プレビュー）

2つの戦略があります:
- **`join`**（デフォルト）: データベースレベルのJSON集約を使用
- **`query`**: 複数のクエリを実行

`relationJoins`プレビュー機能を有効にする必要があります。

### 3. ネストされた書き込み

1つのトランザクション内で関連レコードを作成します:

```typescript
const result = await prisma.user.create({
  data: {
    email: 'user@example.com',
    posts: {
      create: [
        { title: 'First Post' },
        { title: 'Second Post' }
      ]
    }
  }
})
```

サポートされる操作:
- 関連レコードの作成
- 既存レコードの接続
- レコードの切断
- 関連レコードの更新
- 関連レコードの削除

### 4. リレーションフィルタ

関連レコードのプロパティに基づいてフィルタリングします:

```typescript
const users = await prisma.user.findMany({
  where: {
    posts: {
      some: {
        published: false
      }
    }
  }
})
```

フィルタオプション:
- `-to-many`リレーション: `some`, `every`, `none`
- `-to-one`リレーション: `is`, `isNot`

### 5. Fluent API

チェーンメソッド呼び出しを通じてリレーションをトラバースします:

```typescript
const posts = await prisma.user
  .findUnique({ where: { id: 1 } })
  .posts()
```

`findUnique`クエリで機能し、複雑なリレーショントラバースを可能にします。

## ユースケース

- 関連データを含む完全なオブジェクトグラフのフェッチ
- 1つの操作での複数の関連レコードの作成/更新
- リレーションシッププロパティに基づくフィルタリング
- 複雑なデータ構造のナビゲーション

## 注意事項

- ネストされた書き込みはトランザクション内で実行されます
- パフォーマンスを最適化するためにリレーション読み込み戦略を検討してください
- 大規模なデータセットの場合、適切なインデックスを確保してください
