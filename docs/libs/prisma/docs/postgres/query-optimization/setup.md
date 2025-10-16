# セットアップ

## 前提条件

Prisma PostgresのPrisma Optimizeを開始する前に、以下が必要です:

- Prisma Cloudアカウント
- Prismaクライアントバージョン`5.0.0`以降を使用するプロジェクト
- Prisma Postgresデータベース

> Prisma Optimizeはローカル環境専用です。

## 1. Optimizeを起動

1. Prisma Cloudにログイン
2. **Optimize**タブをクリック
3. APIキーを生成
4. APIキーをコピーして安全に保存
5. セットアッププロセスを完了

## 2. アプリケーションにOptimizeを追加

### 2.1 Prismaクライアント拡張機能をインストール

```bash
npm install @prisma/extension-optimize
```

Prisma ORMバージョン`4.2.0`から`6.1.0`の場合、トレーシングを有効にします:

```prisma
generator client {
  provider = "prisma-client-js"
  previewFeatures = ["tracing"]
}
```

### 2.2 `.env`にAPIキーを追加

```
OPTIMIZE_API_KEY="YOUR_OPTIMIZE_API_KEY"
```

### 2.3 Prismaクライアントインスタンスを拡張

```javascript
import { PrismaClient } from "@prisma/client";
import { withAccelerate } from "@prisma/extension-optimize";
import { withOptimize } from "@prisma/extension-optimize";

const prisma = new PrismaClient().$extends(
  withOptimize({ apiKey: process.env.OPTIMIZE_API_KEY }),
).$extends(withAccelerate());
```

### 2.5 インサイトを生成

1. アプリを実行してPrismaクエリを実行
2. 赤い**Recording**ボタンをクリック
3. クエリの詳細と推奨事項を探索

## サポートが必要ですか？

[Discord](https://pris.ly/discord)の`#help-and-questions`チャンネルに参加するか、[Prismaコミュニティ](https://www.prisma.io/community)に接続してください。
