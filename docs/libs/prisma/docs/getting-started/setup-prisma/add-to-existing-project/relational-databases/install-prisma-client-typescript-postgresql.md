# TypeScriptとPostgreSQLを使用したPrisma Clientのインストール

## Prisma Clientをインストールするための主要なステップ

### 1. Prisma Clientパッケージのインストール
```bash
npm install @prisma/client
```

### 2. Prisma Clientの生成
```bash
npx prisma generate
```

## 重要な注意事項
- `prisma generate`を実行すると、Prismaスキーマに基づいてカスタムTypeScript型とメソッドが作成されます
- Prismaスキーマを更新する場合は、次の手順を実行する必要があります:
  - `prisma migrate dev`または`prisma db push`を使用してデータベーススキーマを更新します
  - `prisma generate`を再実行してクライアントを再生成します

このドキュメントは、`prisma generate`が「Prismaスキーマを読み取り、Prisma Clientを生成する」ため重要であることを強調しています。これは、プロジェクトのデータベーススキーマに特化したものです。

インストール後、`PrismaClient`コンストラクタをインポートして使用し、データベースと対話できます。これについては、後続のドキュメントセクションで説明します。

このガイドは、Prismaの「既存のプロジェクトに追加」ドキュメントの一部であり、特にTypeScriptとPostgreSQLユーザーを対象としています。
