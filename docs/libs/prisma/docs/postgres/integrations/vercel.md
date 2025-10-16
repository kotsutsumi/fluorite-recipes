# Vercel

[Prisma PostgresのVercel Marketplaceインテグレーション](https://www.vercel.com/marketplace/prisma)は、VercelプロジェクトをPrisma Postgresインスタンスと接続します。

## 機能

- Vercelダッシュボードを離れることなくPrisma Postgresインスタンスを作成および使用
- 本番環境とプレビュー環境のPrisma Postgres URLの自動生成
- Vercelプロジェクトの環境設定を簡素化
- Prisma Postgres料金プランのアップグレード/ダウングレードのための請求ワークフロー
- さまざまなフレームワークとORMのためのすぐにデプロイできるフルスタックテンプレート

## テンプレート

インテグレーションは、いくつかのスターターテンプレートを提供します:

- [Prisma ORM + NextAuth Starter](https://vercel.com/templates/next.js/prisma-postgres)
- [Postgres + Nuxt Starter](https://vercel.com/templates/nuxt/postgres-nuxt)
- [Postgres + Kysely Next.js Starter](https://vercel.com/templates/next.js/postgres-kysely)
- [Postgres + Drizzle Next.js Starter](https://vercel.com/templates/next.js/postgres-drizzle)
- [Postgres + SvelteKit Starter](https://vercel.com/templates/svelte/postgres-sveltekit)

## 使用方法

### 拡張機能のインストール

[Prisma Postgresインテグレーションページ](https://www.vercel.com/marketplace/prisma)で**Install**をクリックします。

### 新しいデータベースの作成

1. **Storage**タブに移動
2. **Create Database**をクリック
3. **Prisma Postgres**を選択
4. **Region**と**Pricing Plan**を選択
5. データベースに名前を付けて**Create**をクリック

### データベースをVercelプロジェクトに接続

Vercelプロジェクトで:
1. **Storage**タブをクリック
2. 作成したデータベースを選択
3. **Connect**をクリック

これにより、`DATABASE_URL`環境変数が自動的に設定されます。

### Prisma Studioでデータを表示および編集

ローカルで以下のコマンドを実行してPrisma Studioを開きます:

```bash
npx prisma studio
```

## Prismaの追加の考慮事項

プロジェクトが`DATABASE_URL`環境変数を使用していることを確認してください。
