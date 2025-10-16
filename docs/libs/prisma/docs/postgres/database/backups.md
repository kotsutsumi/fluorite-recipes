# Prisma Postgresバックアップ

## バックアップの概要
- ProおよびBusiness Prisma Postgresプランで利用可能
- データベースにアクティビティがある場合、自動的に毎日スナップショットを作成します
- スナップショットの保持期間はプランによって異なります:
  - Proプラン: 過去7日間
  - Businessプラン: 過去30日間

## `pg_dump`を使用した手動バックアッププロセス

### 前提条件
- Node.js（バージョン16以上）
- PostgreSQL CLIツール（バージョン17）
- 直接接続文字列

### インストール手順

#### 1. PostgreSQLコマンドラインツールのインストール
- macOS: `brew install postgresql@17`
- Windows: 公式PostgreSQLウェブサイトからダウンロード
- Linux: `sudo apt-get install postgresql-client-17`

#### 2. バックアップコマンドの作成
```bash
pg_dump --dbname="postgres://USER:PASSWORD@db.prisma.io:5432/?sslmode=require" > ./mydatabase.bak
```

## 主要な注意事項
- スナップショットは、すべての最近のデータベース変更をキャプチャしない場合があります
- より細かいバックアップメカニズムの将来の更新が計画されています
- ポイントインタイムリストア機能が予定されています

このドキュメントは、Prisma Postgresでの自動および手動データベースバックアップの両方のための簡単なガイドを提供します。
