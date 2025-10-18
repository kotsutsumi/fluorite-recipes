# Drizzle ORM: PostgreSQLをローカルにセットアップする方法

## 前提条件
- Docker Desktopがインストールされていること

## PostgreSQLのセットアップ手順

### 1. PostgreSQLイメージをプル
```bash
# 最新バージョンをプル
docker pull postgres

# または特定のバージョンをプル
docker pull postgres:15
```

### 2. PostgreSQLコンテナを起動
```bash
docker run --name drizzle-postgres \
  -e POSTGRES_PASSWORD=mypassword \
  -d -p 5432:5432 \
  postgres
```

#### コンテナ実行オプション
- `--name`: コンテナに名前を付ける
- `-e POSTGRES_PASSWORD`: データベースのパスワードを設定
- `-d`: バックグラウンドで実行
- `-p 5432:5432`: コンテナのポートをホストポートにマップ

### 3. データベースURLを設定
データベースURLの形式:
```
postgres://<user>:<password>@<host>:<port>/<database>
```

作成したコンテナのURL例:
```
postgres://postgres:mypassword@localhost:5432/postgres
```

### オプション設定
- `-e POSTGRES_USER`: カスタムユーザー名を設定
- `-e POSTGRES_DB`: カスタムデータベース名を設定

### 確認
- 実行中のコンテナを確認: `docker ps`
- Docker Desktopでコンテナを確認

このガイドは、Drizzle ORM開発のためにDockerを使用してPostgreSQLデータベースをローカルにセットアップする簡単な方法を提供します。
