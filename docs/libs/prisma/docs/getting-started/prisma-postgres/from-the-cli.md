# CLIからPrisma Postgresをセットアップする

## Prisma Postgresをセットアップするための主要なステップ

### 1. 前提条件
`npx prisma@latest init --db`を実行して以下を行います:
- Prisma Data Platformにログインします
- 新しいPrisma Postgresインスタンスを作成します
- 空の`schema.prisma`を持つ`prisma/`フォルダを生成します
- `.env`ファイルに`DATABASE_URL`を設定します

### 2. プロジェクトのセットアップ
- TypeScriptプロジェクトを初期化します
- 依存関係をインストールします:
```bash
npm init -y
npm install typescript tsx @types/node --save-dev
npx tsc --init
npm install prisma @prisma/extension-accelerate
```

### 3. データベーススキーママイグレーション
- `prisma/schema.prisma`をモデルで更新します
- マイグレーションを実行: `npx prisma migrate dev --name init`

### 4. データベースのクエリ
- PrismaClientを使用して`index.ts`を作成します
- クエリの例:
  - ユーザーの作成: `prisma.user.create()`
  - ユーザーの検索: `prisma.user.findMany()`
  - 関連レコードの作成: リレーションシップを使用したネストされた書き込み

## 追加機能
- Prisma Studioの使用: `npx prisma studio`
- `prisma-examples`リポジトリのサンプルを探索します
- Next.jsでフルスタックアプリを構築します

## 推奨される次のステップ
- より複雑なクエリを探索します
- フルスタックアプリケーションを構築します
- Prismaコミュニティチャンネルに参加します

このガイドは、Prisma Postgresを始める開発者のための包括的なウォークスルーを提供します。
