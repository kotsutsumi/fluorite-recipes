# Prisma ORMの紹介

このページは、Prisma ORMの概要を高レベルで説明します。

実践的な紹介とPrisma Clientの APIについて学びたい場合は、[**スタートガイド**](/docs/getting-started)のドキュメントをご覧ください。

Prisma ORMの動機についてさらに知りたい場合は、[**Prisma ORMを選ぶ理由**](/docs/orm/overview/introduction/why-prisma)のページをチェックしてください。

## このセクションについて

### Prisma ORMとは

Prisma ORMは、オープンソースの次世代ORMです。以下の部分で構成されています：

- **Prisma Client**: Node.jsとTypeScript用の自動生成された型安全なクエリビルダー
- **Prisma Migrate**: マイグレーションシステム
- **Prisma Studio**: データベースを表示・編集するためのGUI

### Prisma ORMを選ぶ理由

このページでは、Prisma ORMの動機と、従来のORMやSQLクエリビルダーとの比較について学べます。

### Prisma ORMを使うべきか

Prisma ORMは新しいタイプのORMであり、他のツール同様、独自のトレードオフがあります。このページでは、Prisma ORMが適している状況と、他のシナリオでの代替案を説明します。

### データモデリング

データモデリングとは、アプリケーションのデータ構造を定義するプロセスです。Prisma ORMでは、Prisma Schemaを使用してデータモデルを宣言的に定義します。
