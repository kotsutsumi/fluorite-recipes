# Prisma Postgresのサーバーレスドライバー

## 概要
Prisma Postgresのサーバーレスドライバーは、`@prisma/ppg` npmパッケージを使用して生のSQLクエリを実行するための軽量クライアントライブラリです。

⚠️ **警告**: 現在Early Accessであり、本番環境での使用は推奨されません。

## インストール
```bash
npm install @prisma/ppg
```

## 使用例
```typescript
import { ppg } from "@prisma/ppg";

type Post = {
  id: number;
  title: string;
  content: string | null;
  published: boolean;
  authorId: number | null;
}

const sql = ppg("prisma+postgres://accelerate.prisma-data.net/?api_key=...");
const authorId = 1;
const posts = await sql<Post>`SELECT * FROM "Post" WHERE "authorId" = ${authorId}`;
```

## APIリファレンス

### `ppg` 関数
- テンプレートリテラルタグ関数として高レベルSQLクライアントを返す
- 補間された値を自動的にSQLパラメータに変換
- データをオブジェクトの配列として返す

### `Client` クラス
- 低レベルのクエリ制御を提供
- パラメータ付きの生のクエリを実行可能
- カラムタイプと生データを返す

## 制限事項
- トランザクションサポートなし
- ローカルPrisma Postgres開発サポートなし

## 主な機能
- SQLインジェクションを防止
- 型安全なクエリをサポート
- 軽量で最小限のクライアントライブラリ
