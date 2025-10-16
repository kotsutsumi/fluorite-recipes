# テーブル継承

## 概要

テーブル継承は、エンティティ間の階層的関係をモデル化するソフトウェア設計パターンです。データベースレベルでのテーブル継承により、JavaScript/TypeScriptアプリケーションでユニオン型を使用したり、複数のモデル間で共通のプロパティを共有したりできます。

## ユースケース

### ユニオン型

TypeScriptのユニオン型は、開発者がデータモデルの型をより柔軟に操作できるようにする便利な機能です。

TypeScriptでは、ユニオン型は次のようになります：

```typescript
type Activity = Video | Article
```

テーブル継承を使用することで、データベースレベルでこのようなパターンをモデル化できます。

### 複数のモデル間でのプロパティ共有

複数のモデルが特定のプロパティセットを共有する必要がある場合、テーブル継承を使用してモデル化できます。

例：

```typescript
// 共通プロパティ
interface BaseActivity {
  id: number
  url: string
  ownerId: number
}

// 異なるタイプのアクティビティ
interface Video extends BaseActivity {
  duration: number
}

interface Article extends BaseActivity {
  body: string
}
```

## シングルテーブル継承（STI）とマルチテーブル継承（MTI）の比較

### シングルテーブル継承（STI）

異なるエンティティのデータを単一のテーブルに格納します。

**利点**:
- シンプルなクエリ
- 単一のテーブルへのアクセス

**欠点**:
- 多くのNULL値が発生する可能性
- テーブルが大きくなる

### マルチテーブル継承（MTI）

異なるエンティティのデータを複数のテーブルに分けて格納し、外部キーでリンクします。

**利点**:
- データの正規化
- NULL値が少ない

**欠点**:
- 複雑なクエリ（結合が必要）
- パフォーマンスへの影響

## シングルテーブル継承（STI）の実装

### データモデル

```prisma
enum ActivityType {
  VIDEO
  ARTICLE
}

model Activity {
  id       Int          @id @default(autoincrement())
  url      String       @unique
  duration Int?         // VIDEO専用
  body     String?      // ARTICLE専用
  type     ActivityType
  owner    User         @relation(fields: [ownerId], references: [id])
  ownerId  Int
}

model User {
  id         Int        @id @default(autoincrement())
  activities Activity[]
}
```

### アプリケーションコードでの使用

```typescript
type Video = Activity & { type: 'VIDEO'; duration: number }
type Article = Activity & { type: 'ARTICLE'; body: string }
type ActivityUnion = Video | Article

// 型ガード
function isVideo(activity: Activity): activity is Video {
  return activity.type === 'VIDEO' && activity.duration !== null
}

function isArticle(activity: Activity): activity is Article {
  return activity.type === 'ARTICLE' && activity.body !== null
}

// 使用例
const activities = await prisma.activity.findMany()

activities.forEach((activity) => {
  if (isVideo(activity)) {
    console.log('Video duration:', activity.duration)
  } else if (isArticle(activity)) {
    console.log('Article body:', activity.body)
  }
})
```

## マルチテーブル継承（MTI）の実装

### データモデル

```prisma
model Activity {
  id      Int      @id @default(autoincrement())
  url     String   @unique
  owner   User     @relation(fields: [ownerId], references: [id])
  ownerId Int
  video   Video?
  article Article?
}

model Video {
  id         Int      @id @default(autoincrement())
  duration   Int
  activity   Activity @relation(fields: [activityId], references: [id])
  activityId Int      @unique
}

model Article {
  id         Int      @id @default(autoincrement())
  body       String
  activity   Activity @relation(fields: [activityId], references: [id])
  activityId Int      @unique
}

model User {
  id         Int        @id @default(autoincrement())
  activities Activity[]
}
```

### アプリケーションコードでの使用

```typescript
const activities = await prisma.activity.findMany({
  include: {
    video: true,
    article: true,
  },
})

activities.forEach((activity) => {
  if (activity.video) {
    console.log('Video duration:', activity.video.duration)
  } else if (activity.article) {
    console.log('Article body:', activity.article.body)
  }
})
```

## どちらを選ぶべきか

### STIを選ぶ場合

- エンティティ間の違いが少ない
- クエリのシンプルさが重要
- パフォーマンスが重要（結合を避けたい）

### MTIを選ぶ場合

- エンティティ間の違いが大きい
- データの正規化が重要
- NULL値を最小限に抑えたい
