# Prisma Config リファレンス

## 概要

Prisma Config ファイルは、`migrate` や `studio` などのサブコマンドを含む Prisma CLI を TypeScript を使用して設定します。

設定は2つの方法で定義できます：

1. `defineConfig` ヘルパーを使用する方法：

```typescript
import path from "node:path";
import { defineConfig } from "prisma/config";

export default defineConfig({
  schema: path.join("prisma", "schema.prisma"),
  migrations: {
    path: path.join("db", "migrations"),
  },
  views: {
    path: path.join("db", "views"),
  },
  typedSql: {
    path: path.join("db", "queries"),
  }
});
```

2. TypeScript の `satisfies` 演算子を `PrismaConfig` 型と組み合わせて使用する方法：

```typescript
import path from "node:path";
import type { PrismaConfig } from "prisma";

export default {
  schema: path.join("db", "schema.prisma"),
  migrations: {
    path: path.join("db", "migrations"),
  },
  views: {
    path: path.join("db", "views"),
  },
  typedSql: {
    path: path.join("db", "queries"),
  }
} satisfies PrismaConfig;
```

## 設定インターフェース

`PrismaConfig` 型の簡略版：

```typescript
export declare type PrismaConfig = {
  experimental: {
    adapter: boolean;
    externalTables: boolean;
    studio: boolean;
  },
  schema?: string;
  adapter?: () => Promise<SqlMigrationAwareDriverAdapterFactory>;
  studio?: {
    adapter: () => Promise<SqlMigrationAwareDriverAdapterFactory>;
  };
  migrations?: {
    path: string;
    seed: string;
    initShadowDb: string;
  };
  views?: {
    path: string;
  };
  typedSql?: {
    path: string;
  };
};
```

## 主要な設定オプション

### `schema`
Prisma スキーマファイルへのパスを指定します。

### `migrations`
マイグレーション関連の設定：
- `path`: マイグレーションファイルの保存場所
- `seed`: シードスクリプトのパス
- `initShadowDb`: シャドウデータベースの初期化スクリプト

### `views`
データベースビューの設定：
- `path`: ビューファイルの保存場所

### `typedSql`
型付き SQL クエリの設定：
- `path`: クエリファイルの保存場所

### `adapter`
カスタムデータベースアダプターを指定します。

### `studio`
Prisma Studio 固有の設定を行います。

### `experimental`
実験的機能のフラグ：
- `adapter`: アダプター機能を有効化
- `externalTables`: 外部テーブルのサポートを有効化
- `studio`: Studio 固有の実験的機能を有効化

## 使用例

基本的な設定例：

```typescript
import path from "node:path";
import { defineConfig } from "prisma/config";

export default defineConfig({
  schema: path.join("prisma", "schema.prisma"),
  migrations: {
    path: path.join("prisma", "migrations"),
  },
});
```

高度な設定例：

```typescript
import path from "node:path";
import { defineConfig } from "prisma/config";

export default defineConfig({
  schema: path.join("db", "schema.prisma"),
  migrations: {
    path: path.join("db", "migrations"),
    seed: path.join("db", "seed.ts"),
  },
  views: {
    path: path.join("db", "views"),
  },
  typedSql: {
    path: path.join("db", "queries"),
  },
  experimental: {
    adapter: true,
    externalTables: true,
  },
});
```

## 注意事項

- Prisma Config ファイルは TypeScript で記述されます
- 相対パスの代わりに `path.join()` を使用することを推奨します
- 実験的機能は予告なく変更される可能性があります
- すべての設定オプションはオプショナルです（デフォルト値が使用されます）
