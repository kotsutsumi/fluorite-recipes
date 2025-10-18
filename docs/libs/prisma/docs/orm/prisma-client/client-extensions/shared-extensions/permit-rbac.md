# きめ細かい認可 (Fine-Grained Authorization)

Permit.ioの`@permitio/permit-prisma`拡張を使用して、Prisma ORMできめ細かい認可を実装できます。

## サポートされるアクセス制御モデル

この拡張は、3つの主要なアクセス制御モデルをサポートしています:

1. **ロールベースアクセス制御 (RBAC)**
2. **属性ベースアクセス制御 (ABAC)**
3. **関係ベースアクセス制御 (ReBAC)**

## インストール

```bash
npm install @permitio/permit-prisma
```

## 設定

### 基本設定

```typescript
import { PrismaClient } from '@prisma/client'
import { permit } from '@permitio/permit-prisma'

const prisma = new PrismaClient().$extends(
  permit({
    apiKey: process.env.PERMIT_API_KEY,
    pdpUrl: process.env.PERMIT_PDP_URL
  })
)
```

## ロールベースアクセス制御 (RBAC)

RBACでは、ユーザーにロールが割り当てられ、各ロールには特定のリソースに対する権限があります。

### 例: RBACの使用

```typescript
// ユーザーロールの定義
const roles = {
  admin: ['read', 'write', 'delete'],
  editor: ['read', 'write'],
  viewer: ['read']
}

// 権限チェック付きクエリ
const posts = await prisma.post.findMany({
  where: {
    $permit: {
      user: { id: userId, role: 'editor' },
      action: 'read'
    }
  }
})
```

## 属性ベースアクセス制御 (ABAC)

ABACでは、ユーザー、リソース、環境の属性に基づいてアクセス決定が行われます。

### 例: ABACの使用

```typescript
const documents = await prisma.document.findMany({
  where: {
    $permit: {
      user: {
        id: userId,
        department: 'engineering',
        clearanceLevel: 3
      },
      action: 'read',
      resource: {
        type: 'document',
        classification: 'confidential'
      }
    }
  }
})
```

## 関係ベースアクセス制御 (ReBAC)

ReBACでは、ユーザーとリソース間の関係に基づいてアクセスが決定されます。

### 例: ReBACの使用

```typescript
// ユーザーが所有者または編集者である文書のみを取得
const documents = await prisma.document.findMany({
  where: {
    $permit: {
      user: { id: userId },
      action: 'edit',
      relationship: ['owner', 'editor']
    }
  }
})
```

## 手動権限チェック

クエリ外で権限を手動でチェックすることもできます:

```typescript
const hasPermission = await prisma.$permit.check({
  user: { id: userId },
  action: 'delete',
  resource: { type: 'post', id: postId }
})

if (hasPermission) {
  await prisma.post.delete({ where: { id: postId } })
}
```

## 高度な使用例

### 複数条件の組み合わせ

```typescript
const data = await prisma.sensitiveData.findMany({
  where: {
    AND: [
      {
        $permit: {
          user: { id: userId, role: 'admin' },
          action: 'read'
        }
      },
      {
        departmentId: userDepartmentId
      }
    ]
  }
})
```

### カスタムポリシー

```typescript
const prisma = new PrismaClient().$extends(
  permit({
    apiKey: process.env.PERMIT_API_KEY,
    pdpUrl: process.env.PERMIT_PDP_URL,
    customPolicies: {
      'post:publish': async (user, resource) => {
        return user.role === 'editor' && resource.status === 'draft'
      }
    }
  })
)
```

## ベストプラクティス

1. **環境変数の使用**: APIキーとPDP URLは環境変数に保存する
2. **エラーハンドリング**: 権限エラーを適切に処理する
3. **監査ログ**: アクセス試行を記録する
4. **パフォーマンス**: 権限チェックをキャッシュして最適化する
5. **最小権限の原則**: 必要最小限の権限のみを付与する

## トラブルシューティング

### 一般的な問題

1. **接続エラー**: PDP URLが正しく設定されていることを確認
2. **認可失敗**: ユーザーロールとポリシーが正しく定義されているか確認
3. **パフォーマンス問題**: 権限チェックのキャッシュを検討

詳細については、[Permit.ioのドキュメント](https://docs.permit.io/)を参照してください。
