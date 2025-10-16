# 既存のPostgreSQLデータベースからデータをインポートする

## データベース移行の主要なステップ
1. 新しいPrisma Postgresデータベースを作成します
2. `pg_dump`を使用して既存のデータをエクスポートします
3. `pg_restore`を使用してデータをインポートします

## 前提条件
- PostgreSQL接続URL
- Prismaアカウント
- Node.js 18以上
- PostgreSQL CLIツール

## 詳細な移行プロセス

### 1. Prisma Postgresデータベースの作成
- Prisma Consoleにログインします
- 新しいプロジェクトを作成します
- リージョンを選択します
- Prisma Postgresインスタンスを作成します

### 2. 既存のデータベースのエクスポート
- カスタム形式で`pg_dump`コマンドを使用します
- コマンドの例:
```bash
pg_dump \
  -Fc \
  -v \
  -d __DATABASE_URL__ \
  -n public \
  -f db_dump.bak
```

### 3. Prisma Postgresへのデータのインポート
- `@prisma/ppg-tunnel`でTCPトンネルを使用します
- `pg_restore`でバックアップを復元します
- Prisma Studioを使用してインポートを検証します

## アプリケーション更新シナリオ

### A. 既にPrisma ORMを使用している場合
- Prisma Accelerate拡張機能を追加します
- データベース接続URLを更新します
- Prisma Clientを再生成します

### B. Prisma ORMを使用していない場合
- Prisma CLIをインストールします
- データベースをイントロスペクションします
- Prisma Clientを生成します
- アプリケーションクエリを更新します

このガイドは、PostgreSQLデータベースをPrisma Postgresに移行するための包括的なステップバイステップの手順を提供します。
