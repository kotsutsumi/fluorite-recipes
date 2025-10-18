# 既存のPostgreSQLデータベースからデータをインポートする

このガイドでは、既存のPostgreSQLデータベースをPrisma Postgresにインポートする方法を説明します。

## 前提条件

- 既存のPostgreSQLデータベースへの接続URL
- Prismaアカウント
- Node.js 18以上
- PostgreSQL CLIツール(`pg_dump`、`pg_restore`)

## インポートガイド

Prisma Postgresは、以下のデータベースからのインポートをサポートしています:

1. **PostgreSQLからのインポート** - PostgreSQLデータベースからデータを移行
2. **MySQLからのインポート** - MySQLデータベースからデータを移行

## PostgreSQLからの移行プロセス

### 1. 新しいPrisma Postgresデータベースを作成

1. Prismaコンソールにログイン
2. ワークスペース内に新しいプロジェクトを作成
3. ロケーションに最も近いリージョンを選択
4. 「プロジェクトを作成」をクリック

### 2. 既存のデータベースからデータをエクスポート

データをエクスポートするコマンド:

```bash
pg_dump \
  -Fc \
  -v \
  -d __DATABASE_URL__ \
  -n public \
  -f db_dump.bak
```

CLIオプションの説明:
- `-Fc`: カスタムバックアップフォーマット
- `-v`: 詳細モード
- `-d`: データベース接続文字列
- `-n`: ターゲットのPostgreSQLスキーマ
- `-f`: 出力バックアップファイル名

### 3. Prisma Postgresにデータをインポート

#### A. TCPトンネルのセットアップ

```bash
export DATABASE_URL="prisma+postgres://accelerate.prisma-data.net/?api_key=..."
npx @prisma/ppg-tunnel --host 127.0.0.1 --port 5432
```

#### B. バックアップのリストア

```bash
PGSSLMODE=disable \
pg_restore \
  -h 127.0.0.1 \
  -p 5432 \
  -v \
  -d postgres \
  ./db_dump.bak \
  && echo "-complete-"
```

### 4. アプリケーションコードの更新

#### シナリオA: すでにPrisma ORMを使用している場合

1. Accelerate拡張機能をインストール
2. データベース接続URLを更新
3. Prisma Clientを再生成

#### シナリオB: Prisma ORMを使用していない場合

1. Prisma CLIをインストール
2. データベースをイントロスペクト
3. Prisma Clientを生成
4. アプリケーションクエリを更新

### 5. データの検証

インポートされたデータを検証するには、Prisma Studioを使用します:

```bash
npx prisma studio
```

## 主要な推奨事項

- 非プール接続文字列を使用
- 一部のプロバイダーでは`sslmode`を`require`に設定
- データのバックアップを保持
- 移行前にデータの整合性を確認
- テスト環境で最初にプロセスをテスト

## トラブルシューティング

接続の問題が発生した場合:

1. 接続URLが正しいことを確認
2. ファイアウォール設定を確認
3. データベースの認証情報が有効であることを確認
4. TCPトンネルが正しく実行されていることを確認

## 次のステップ

データのインポートが完了したら:

1. Prisma Studioでデータを検証
2. アプリケーションの接続設定を更新
3. 新しいPrisma Postgresデータベースでアプリケーションをテスト
4. 本番環境への移行を計画

このプロセスにより、既存のPostgreSQLまたはMySQLデータベースをPrisma Postgresにスムーズに移行できます。
