# 行レベルセキュリティ (RLS)

Drizzle ORMにおける行レベルセキュリティ（Row-Level Security: RLS）の包括的なガイドです。

## 概要

Drizzle ORMは、PostgreSQLデータベースで行レベルセキュリティを実装するための堅牢なサポートを提供します。

## 主要な機能

1. RLSの有効化
2. ロールの定義
3. ポリシーの作成
4. マイグレーションの管理
5. ビューへのRLSの適用
6. NeonとSupabaseとの統合

## RLSの有効化

テーブルでRLSを有効にするには、`.enableRLS()`を使用します：

```typescript
import { pgTable, integer } from 'drizzle-orm/pg-core';

export const users = pgTable('users', {
  id: integer('id').primaryKey(),
  name: text('name')
}).enableRLS();
```

## ロール

Drizzle は、さまざまなオプションでロールを定義することをサポートします：

```typescript
import { pgRole } from 'drizzle-orm/pg-core';

export const admin = pgRole('admin', {
  createRole: true,
  createDb: true,
  inherit: true
});

export const user = pgRole('user');
```

### ロールのオプション

- `createRole`: 新しいロールを作成する権限
- `createDb`: データベースを作成する権限
- `inherit`: 親ロールの権限を継承
- その他のPostgreSQLロールオプション

## ポリシー

ポリシーは、複数の設定オプションで定義できます：

```typescript
import { pgPolicy } from 'drizzle-orm/pg-core';
import { sql } from 'drizzle-orm';

export const users = pgTable('users', {
  id: integer('id').primaryKey(),
  name: text('name'),
  role: text('role')
}, (t) => [
  pgPolicy('policy_name', {
    as: 'permissive',
    to: admin,
    for: 'delete',
    using: sql`${t.role} = 'admin'`,
    withCheck: sql`${t.role} = 'admin'`,
  }),
]);
```

### ポリシーオプション

- `as`: `'permissive'`または`'restrictive'`
- `to`: ポリシーを適用するロール
- `for`: コマンドを適用（select、insert、update、delete）
- `using`: 既存の行に対するSQL条件
- `withCheck`: 新しい行に対するSQL条件

### 複数のポリシー

```typescript
export const users = pgTable('users', {
  id: integer('id').primaryKey(),
  name: text('name'),
  ownerId: integer('owner_id')
}, (t) => [
  pgPolicy('user_read_own', {
    for: 'select',
    using: sql`${t.ownerId} = current_user_id()`,
  }),
  pgPolicy('user_update_own', {
    for: 'update',
    using: sql`${t.ownerId} = current_user_id()`,
  }),
]);
```

## プロバイダー固有の統合

### Neon

Neonは、簡潔なポリシー定義のためのヘルパー関数を提供します：

```typescript
import { crudPolicy } from 'drizzle-orm/neon';

export const users = pgTable('users', {
  id: integer('id').primaryKey(),
  name: text('name')
}, (t) => [
  crudPolicy({
    role: admin,
    read: true,
    modify: false
  }),
]);
```

### Supabase

Supabase統合の例：

```typescript
import { authenticatedRole, serviceRole } from 'drizzle-orm/supabase';

export const users = pgTable('users', {
  id: integer('id').primaryKey(),
  name: text('name'),
  userId: text('user_id')
}, (t) => [
  pgPolicy('authenticated_read', {
    for: 'select',
    to: authenticatedRole,
    using: sql`${t.userId} = auth.uid()`,
  }),
  pgPolicy('service_all', {
    for: 'all',
    to: serviceRole,
    using: sql`true`,
  }),
]);
```

## RLSとビュー

ビューにRLSポリシーを適用：

```typescript
export const userView = pgView('user_view', {
  id: integer('id'),
  name: text('name')
})
  .as((qb) => qb.select().from(users))
  .enableRLS();
```

## 実践例

### 基本的なマルチテナントRLS

```typescript
export const tenants = pgTable('tenants', {
  id: integer('id').primaryKey(),
  name: text('name')
}).enableRLS();

export const tenantUser = pgRole('tenant_user');

export const documents = pgTable('documents', {
  id: integer('id').primaryKey(),
  tenantId: integer('tenant_id').references(() => tenants.id),
  content: text('content')
}, (t) => [
  pgPolicy('tenant_isolation', {
    to: tenantUser,
    using: sql`${t.tenantId} = current_setting('app.current_tenant')::integer`,
  }),
]);
```

### 階層的アクセス制御

```typescript
const adminRole = pgRole('admin');
const managerRole = pgRole('manager');
const userRole = pgRole('user');

export const projects = pgTable('projects', {
  id: integer('id').primaryKey(),
  name: text('name'),
  visibility: text('visibility')
}, (t) => [
  pgPolicy('admin_all', {
    to: adminRole,
    using: sql`true`,
  }),
  pgPolicy('manager_dept', {
    to: managerRole,
    using: sql`${t.visibility} = 'department'`,
  }),
  pgPolicy('user_public', {
    to: userRole,
    using: sql`${t.visibility} = 'public'`,
  }),
]);
```

## ベストプラクティス

1. **最小権限の原則**: 必要最小限のアクセスのみを許可
2. **ポリシーのテスト**: 本番環境に展開する前に徹底的にテスト
3. **パフォーマンス**: RLSポリシーのパフォーマンスへの影響を監視
4. **ドキュメント化**: セキュリティポリシーを明確にドキュメント化

## まとめ

Drizzle ORMのRLSサポートにより、PostgreSQLデータベースで堅牢な行レベルセキュリティを実装できます。さまざまなアクセス制御パターンをサポートし、主要なデータベースプロバイダーとの統合が容易です。
