# 集計、グループ化、集約

Prisma Clientは、データの集計、グループ化、集約のための強力な機能を提供します。

## 集計（Aggregate）

数値フィールドで平均、合計、最小値、最大値、カウントを取得できます。

### 基本的な集計

```typescript
const aggregations = await prisma.user.aggregate({
  _avg: {
    age: true
  },
  _sum: {
    profileViews: true
  },
  _min: {
    age: true
  },
  _max: {
    age: true
  },
  _count: {
    age: true
  }
})

// 結果:
// {
//   _avg: { age: 29.5 },
//   _sum: { profileViews: 5000 },
//   _min: { age: 18 },
//   _max: { age: 65 },
//   _count: { age: 100 }
// }
```

### 条件付き集計

```typescript
const aggregations = await prisma.user.aggregate({
  _avg: {
    age: true
  },
  where: {
    email: {
      contains: 'prisma.io'
    }
  }
})
```

## グループ化（Group By）

フィールドごとにデータをグループ化し、各グループの集計を取得します。

### 基本的なグループ化

```typescript
const groupUsers = await prisma.user.groupBy({
  by: ['country'],
  _sum: {
    profileViews: true
  }
})

// 結果:
// [
//   { country: 'USA', _sum: { profileViews: 2500 } },
//   { country: 'Japan', _sum: { profileViews: 1800 } }
// ]
```

### 複数フィールドでのグループ化

```typescript
const result = await prisma.user.groupBy({
  by: ['country', 'city'],
  _count: {
    _all: true
  },
  _avg: {
    age: true
  }
})
```

### グループ化結果のフィルタリング（having）

```typescript
const result = await prisma.user.groupBy({
  by: ['country'],
  _sum: {
    profileViews: true
  },
  having: {
    profileViews: {
      _sum: {
        gte: 100
      }
    }
  }
})
```

### ソート

```typescript
const result = await prisma.user.groupBy({
  by: ['country'],
  _sum: {
    profileViews: true
  },
  orderBy: {
    _sum: {
      profileViews: 'desc'
    }
  }
})
```

## カウント（Count）

レコード数や特定条件のレコード数を取得します。

### 全レコード数

```typescript
const userCount = await prisma.user.count()
```

### 条件付きカウント

```typescript
const activeUserCount = await prisma.user.count({
  where: {
    isActive: true
  }
})
```

### フィールドごとのカウント

```typescript
const count = await prisma.user.count({
  select: {
    _all: true,
    id: true,
    email: true
  },
  where: {
    age: { gte: 18 }
  }
})

// 結果:
// {
//   _all: 100,
//   id: 100,
//   email: 95
// }
```

## 重複排除（Distinct）

重複を除いたユニークな値を取得します。

### 基本的な使用

```typescript
const distinctRoles = await prisma.user.findMany({
  distinct: ['role'],
  select: {
    role: true
  }
})
```

### 複数フィールドでの重複排除

```typescript
const distinctUsers = await prisma.user.findMany({
  distinct: ['country', 'city'],
  select: {
    country: true,
    city: true
  }
})
```

## 実用的な例

### ダッシュボード統計

```typescript
async function getDashboardStats() {
  const [userStats, postStats, totalUsers] = await Promise.all([
    prisma.user.aggregate({
      _avg: { age: true },
      _count: { _all: true }
    }),
    prisma.post.aggregate({
      _sum: { views: true },
      _count: { _all: true }
    }),
    prisma.user.count()
  ])

  return {
    averageUserAge: userStats._avg.age,
    totalUsers: userStats._count._all,
    totalPosts: postStats._count._all,
    totalViews: postStats._sum.views
  }
}
```

### 国別レポート

```typescript
async function getCountryReport() {
  const report = await prisma.user.groupBy({
    by: ['country'],
    _count: {
      _all: true
    },
    _avg: {
      age: true
    },
    _sum: {
      profileViews: true
    },
    orderBy: {
      _count: {
        _all: 'desc'
      }
    }
  })

  return report.map(item => ({
    country: item.country,
    userCount: item._count._all,
    averageAge: item._avg.age,
    totalProfileViews: item._sum.profileViews
  }))
}
```

### 月別売上レポート

```typescript
const monthlySales = await prisma.order.groupBy({
  by: ['createdAt'],
  _sum: {
    total: true
  },
  _count: {
    _all: true
  },
  where: {
    createdAt: {
      gte: new Date('2024-01-01'),
      lt: new Date('2025-01-01')
    }
  },
  orderBy: {
    createdAt: 'asc'
  }
})
```

## ベストプラクティス

- 大規模なデータセットでは、インデックスを適切に設定
- 集計クエリは読み取り専用なので、レプリカデータベースで実行を検討
- 複雑な集計はデータベースビューの使用を検討
- パフォーマンスが重要な場合は、集計結果をキャッシュ
- `groupBy`の`having`句は集計後のフィルタリングに使用
