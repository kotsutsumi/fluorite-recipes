# Prisma拡張機能

Drizzle ORM Prisma拡張機能のガイドです。

## 概要

Drizzle ORM Prisma拡張機能により、開発者は既存のPrismaプロジェクトと並行してDrizzleを使用でき、Drizzleを段階的に採用したり、既存のPrismaセットアップで使用したりする方法を提供します。

## 主要なステップ

### 1. 依存関係のインストール

```bash
npm i drizzle-orm@latest
npm i -D drizzle-prisma-generator
```

### 2. Prismaスキーマの更新

生成されたDrizzleスキーマファイルの出力パスを指定するDrizzleジェネレーターを追加：

```prisma
generator drizzle {
  provider = "drizzle-prisma-generator"
  output   = "./drizzle"
}
```

### 3. Drizzleスキーマの生成

```bash
prisma generate
```

### 4. Prismaクライアントの拡張（PostgreSQLの例）

```typescript
import { PrismaClient } from '@prisma/client';
import { drizzle } from 'drizzle-orm/prisma/pg';

const prisma = new PrismaClient().$extends(drizzle());
```

### 5. Drizzleクエリの実行

```typescript
import { User } from './drizzle';

await prisma.$drizzle
  .insert()
  .into(User)
  .values({ email: '[email protected]', name: 'Søren' });

const users = await prisma.$drizzle.select().from(User);
```

## 制限事項

- リレーショナルクエリはサポートされていない
- SQLiteの`.values()`メソッドは制限あり
- プリペアドステートメントは制限付きサポート

## サポートされているデータベース

拡張機能は、異なるデータベースタイプ全体でDrizzleクエリ機能を既存のPrismaプロジェクトに統合するシームレスな方法を提供します：
- PostgreSQL
- MySQL
- SQLite

Prisma拡張機能は、既存のPrismaインフラストラクチャを維持しながらDrizzleの機能を活用する便利な方法を提供します。
