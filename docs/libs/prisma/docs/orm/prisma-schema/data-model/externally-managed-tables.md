# 外部管理テーブル

## 概要

**外部管理テーブル**（または**外部テーブル**）は、**Prisma Clientで問い合わせ可能**だが、**Prisma Migrateによって無視される**テーブルです。

## ユースケース

外部管理テーブルは以下のような場合に有用です：

- **認証サービス**: Clerk、Auth0などの外部認証プロバイダー
- **ストレージサービス**: Supabase Storageなどのファイルストレージサービス
- **マイクロサービス**: マイクロサービスベースの組織で、他のサービスが管理するテーブル

**警告**: 外部管理テーブルは現在プレビュー段階です。

## ワークフロー

外部テーブルを使用する主なワークフロー：

1. Prisma設定ファイルで外部テーブル名を宣言
2. Prismaスキーマを更新（内省を使用）
3. Prisma Clientを再生成
4. Prisma Clientで外部テーブルを問い合わせ
5. テーブルが変更された場合：
   - データベースを再内省
   - Prisma Clientを再生成

## Prisma設定の構文

Prisma設定ファイルで外部管理テーブルを指定：

```typescript
export default defineConfig({
  experimental: {
    externalTables: true
  },
  tables: {
    external: [
      "public.users",
      "auth.sessions"
    ]
  },
  enums: {
    external: [
      "public.role",
    ]
  },
})
```

## Prismaスキーマへの追加

外部テーブルを宣言した後、内省を実行：

```bash
npx prisma db pull
```

生成されたスキーマ：

```prisma
/// This table is managed externally
model User {
  id       Int       @id
  email    String
  sessions Session[]
  @@schema("public")
}
```

## リレーションシップ

Prismaは、管理対象テーブルから外部管理テーブルへのリレーションシップを作成・更新できます。

```prisma
model Post {
  id       Int    @id
  title    String
  author   User   @relation(fields: [authorId], references: [id])
  authorId Int
}

/// This table is managed externally
model User {
  id    Int    @id
  posts Post[]
  @@schema("public")
}
```

## マイグレーション時の考慮事項

マイグレーション中は、シャドウデータベースで外部テーブルを模倣するSQLスクリプトを提供する必要があります。

### 外部テーブル用のSQLファイル作成

`prisma/external-tables.sql`ファイルを作成：

```sql
CREATE TABLE IF NOT EXISTS "public"."users" (
  "id" SERIAL PRIMARY KEY,
  "email" VARCHAR(255) NOT NULL
);
```

Prisma設定で指定：

```typescript
export default defineConfig({
  experimental: {
    externalTables: true
  },
  externalTablesSQL: './prisma/external-tables.sql',
  tables: {
    external: ["public.users"]
  },
})
```

## 制限事項

- 外部テーブルに対する書き込み操作は可能ですが、スキーマの変更はPrisma Migrateで管理されません
- 外部テーブルのマイグレーションは、そのテーブルを管理するサービスまたはツールで処理する必要があります
- シャドウデータベースを使用する場合、外部テーブルの構造を手動で同期する必要があります
