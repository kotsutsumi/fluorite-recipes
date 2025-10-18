# SafeQL

SafeQLは、Prisma ClientのRaw SQLクエリに型安全性とリントを提供するESLintプラグインです。

## 概要

- `$queryRaw`と`$executeRaw`メソッドを使用する際の型安全性を向上
- サポートされていないデータ型（地理データなど）を扱う際に特に有用
- PostgreSQLデータベース向けに設計

## 前提条件

- PostgreSQLデータベース
- Prisma ORMのセットアップ
- プロジェクトでESLintが設定済み

## インストール

```bash
npm install -D @ts-safeql/eslint-plugin libpg-query
```

## ESLint設定

```javascript
module.exports = {
  plugins: ['@ts-safeql/eslint-plugin'],
  rules: {
    '@ts-safeql/check-sql': [
      'error',
      {
        connections: [{
          migrationsDir: './prisma/migrations',
          targets: [
            {
              tag: 'prisma.+($queryRaw|$executeRaw)',
              transform: '{type}[]'
            }
          ]
        }]
      }
    ]
  }
}
```

## 使用例: 地理データ

PostGISを使用するためのカスタムPrisma Client extensionsの作成を示します:

```typescript
const prisma = new PrismaClient().$extends({
  name: 'geographic',
  model: {
    location: {
      async create(point: { lng: number; lat: number }) {
        return prisma.$queryRaw`
          INSERT INTO locations (coordinates)
          VALUES (ST_SetSRID(ST_MakePoint(${point.lng}, ${point.lat}), 4326))
        `
      }
    }
  }
})
```

## 主な利点

- Raw SQLクエリに型安全性を追加
- SQLステートメントのリアルタイムリント
- サポートされていないデータベース機能を扱えるようにする
- Raw クエリを使用する際の開発者体験を向上

## データベース接続

- 環境変数を使用してデータベース接続URLを提供
- SafeQLはリント用にデータベーススキーマをイントロスペクト

このガイドは、Prisma ClientとSafeQLを統合するための包括的なウォークスルーを提供し、Raw SQLクエリを使用する際の型安全性と開発者体験の向上に焦点を当てています。
