# Prisma Client のインストール (TypeScript と PostgreSQL)

## Prisma Client のインストールと生成

Prisma Client を使い始めるには、まず `@prisma/client` パッケージをインストールします：

```bash
npm install @prisma/client
```

次に、`prisma generate` を実行して、Prisma スキーマを読み込み、Prisma Client を生成します。

```bash
npx prisma generate
```

これで、`@prisma/client` パッケージから `PrismaClient` コンストラクターをインポートし、データベースにクエリを送信するための Prisma Client インスタンスを作成できます。

> **注意点**
>
> `prisma generate` を実行すると、**あなたの** Prisma スキーマファイルに合わせたコード（TypeScriptの型、メソッド、クエリなど）が作成されます。つまり、Prisma スキーマファイルを変更するたびに、Prisma Client も更新する必要があります。これは `prisma generate` コマンドで行えます。

![Prisma Client のインストールと生成](/docs/assets/images/prisma-client-install-and-generate-ece3e0733edc615e416d6d654c05e980.png)

Prisma スキーマを更新する際は、`prisma migrate dev` または `prisma db push` を使用してデータベーススキーマを更新する必要があります。これにより、データベーススキーマと Prisma スキーマが同期されます。これらのコマンドは、Prisma Client を再生成する `prisma generate` も自動的に実行します。

これらのコマンドは、Prisma でデータベーススキーマを管理する異なる目的を持っています：

- **`prisma migrate dev`**: 開発環境でスキーマ変更を行い、マイグレーション履歴を作成します
- **`prisma db push`**: プロトタイピングや開発時に、マイグレーション履歴なしで素早くスキーマを同期します

## 次のステップ

[次へ: データベースのクエリ](/docs/getting-started/setup-prisma/start-from-scratch/relational-databases/querying-the-database-typescript-postgresql)
