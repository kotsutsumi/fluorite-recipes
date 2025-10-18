# Drizzle ORM: MySQLをローカルにセットアップする方法

## 前提条件
- 最新の[Docker Desktop](https://www.docker.com/products/docker-desktop/)がインストールされていること

## MySQLのセットアップ手順

### 1. MySQLイメージをプル
```bash
# 最新のMySQLイメージをプル
docker pull mysql

# または特定のバージョンをプル
docker pull mysql:8.2
```

### 2. MySQLコンテナを起動
```bash
docker run --name drizzle-mysql \
  -e MYSQL_ROOT_PASSWORD=mypassword \
  -d -p 3306:3306 mysql
```

#### コンテナ実行オプション
- `--name`: コンテナに`drizzle-mysql`という名前を付ける
- `-e MYSQL_ROOT_PASSWORD`: rootユーザーのパスワードを設定
- `-d`: バックグラウンドで実行
- `-p 3306:3306`: コンテナのポートをホストポートにマップ

### 3. データベースURLを設定
データベースURLの形式:
```
mysql://<user>:<password>@<host>:<port>/<database>
```

作成したコンテナのURL例:
```
mysql://root:mypassword@localhost:3306/mysql
```

### オプション設定
以下も指定できます:
- `-e MYSQL_DATABASE=`: 新しいデータベースを作成
- `-e MYSQL_USER=`と`-e MYSQL_PASSWORD=`: 新しいユーザーを作成

### 確認
- `docker ps`で実行中のコンテナを確認
- Docker Desktopの`Containers`タブで確認
