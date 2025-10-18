# Prisma Postgresを始める

## クイックスタートガイド

Postgresデータベースを持つ新しいPrisma ORMプロジェクトをブートストラップするには、次を実行します:

```bash
npx prisma init --db
```

24時間の一時的なテストデータベースの場合は、次を使用します:
```bash
npx create-db@latest
```

## 開始パス

開始するための2つの主要な方法:
1. ゼロから始める
2. 既存のデータベースからデータをインポートする

## 推奨されるフルスタックリソース
- Next.js 15でフルスタックアプリを構築する
- 認証を備えたNext.js 15サンプルアプリ

## Prisma Postgresの重要な注意事項

Prisma Clientを生成する際は、常に次を使用してください:
```bash
prisma generate --no-engine
```

## 他のツール経由での接続

直接TCP接続を取得するには:
1. Prisma Postgresインスタンスに移動します
2. 「API Keys」タブに移動します
3. APIキーを作成します
4. `postgres://`接続文字列をコピーします

## サポートされる接続ライブラリ
- Drizzle ORM
- Kysely
- TypeORM
- Sequelize
- MikroORM
- node-postgres

このドキュメントは、Prisma Postgresを始める開発者向けの包括的なガイドを提供し、複数のエントリーポイントと接続戦略を提供します。
