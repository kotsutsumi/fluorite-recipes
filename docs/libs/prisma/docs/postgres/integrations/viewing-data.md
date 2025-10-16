# データの表示

[Prisma Studio](/docs/orm/tools/prisma-studio)またはサードパーティのデータベースエディターを使用して、Prisma Postgresのデータを表示および編集できます。

## Prisma Studioでデータを表示および編集

Prisma Postgresでは、プロジェクト環境でホストされたバージョンのPrisma Studioが利用可能です。コンソールで**Studio**タブを選択して、データを表示および編集します。

また、以下を実行してPrisma Studioをローカルで実行することもできます:

```
npx prisma studio
```

これにより、`http://localhost:5555`でライブサーバーが起動し、データベースとやり取りできます。

## サードパーティのデータベースエディターでPrisma Postgresインスタンスに接続

[`@prisma/ppg-tunnel`パッケージ](https://www.npmjs.com/package/@prisma/ppg-tunnel)を使用して、pgAdmin、TablePlus、PosticoなどのサードパーティのデータベースエディターでPrisma Postgresインスタンスに接続できます。

### 1. Prisma Postgresに直接アクセスするためのTCPトンネルを作成

`DATABASE_URL`環境変数を設定します（`API_KEY`を実際のキーに置き換えます）:

```bash
export DATABASE_URL="prisma+postgres://accelerate.prisma-data.net/?api_key=API_KEY"
```

トンネル接続を実行:

```bash
npx @prisma/ppg-tunnel --host 127.0.0.1 --port 52604
```

### 接続手順

このドキュメントは、複数のデータベースエディターの詳細な接続手順を提供します:
- TablePlus
- DataGrip
- DBeaver
- Postico

各セクションには、TCPトンネル経由でPrisma Postgresインスタンスに接続するための具体的な設定手順が含まれています。

注意: データベースエディターを使用している間、接続を維持するためにトンネルプロセスを実行し続けてください。
