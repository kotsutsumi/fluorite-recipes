# drizzle-graphql

drizzle-graphqlは、Drizzle ORMスキーマから直接GraphQLサーバーを作成できる拡張機能です。

## 概要

Drizzle-GraphQLにより、最小限の設定でDrizzle ORMスキーマから直接GraphQLサーバーを作成できます。

## クイックスタート要件

- Drizzle ORMバージョン0.30.9以降
- Apollo ServerとGraphQL Yogaと互換性あり

## 基本セットアップ例（Apollo Server）

```typescript
import { buildSchema } from 'drizzle-graphql';
import { drizzle } from 'drizzle-orm/...';
import { ApolloServer } from '@apollo/server';

const db = drizzle({ client, schema: dbSchema });
const { schema } = buildSchema(db);
const server = new ApolloServer({ schema });
```

## スキーマカスタマイズ

- `buildSchema()`を使用してベーススキーマを生成
- カスタムクエリとミューテーションの作成を許可
- 生成された型と入力の再利用をサポート
- 生成されたGraphQLスキーマの変更に柔軟性を提供

## 主要なコンポーネント

- データベーススキーマから自動的にGraphQL型を生成
- テーブル間のリレーションをサポート
- カスタムクエリとミューテーション実装を有効化
- 異なるGraphQLサーバー実装と互換性あり

## 利点

既存のDrizzle ORMデータベーススキーマを活用することで、GraphQLサーバー作成を簡素化し、ボイラープレートコードを削減し、GraphQL経由でデータベース操作を公開する迅速な方法を提供します。

## サポートされているGraphQLサーバー

- Apollo Server
- GraphQL Yoga
- その他のGraphQLサーバー実装

このライブラリは、Drizzle ORMとGraphQLエコシステム間のギャップを埋め、型安全で効率的なGraphQL API開発を可能にします。
