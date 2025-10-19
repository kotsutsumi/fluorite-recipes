# TypeScript SDK リファレンス - Turso

libSQL JavaScript/TypeScript SDK の完全なリファレンスドキュメントです。

## 📚 目次

- [概要](#概要)
- [互換性](#互換性)
- [クライアントの初期化](#クライアントの初期化)
- [データベースタイプ](#データベースタイプ)
- [設定オプション](#設定オプション)
- [クエリメソッド](#クエリメソッド)
- [トランザクション](#トランザクション)
- [レスポンスオブジェクト](#レスポンスオブジェクト)
- [プレースホルダー](#プレースホルダー)
- [注意事項](#注意事項)

## 概要

libSQL TypeScript SDK は、Node.js、Deno、エッジ環境（CloudFlare Workers、Netlify、Vercel Edge Functions）で動作する、型安全なデータベースクライアントライブラリです。

## 互換性

```typescript
interface Compatibility {
  runtime: {
    nodejs: "12+";
    deno: "対応";
    cloudflareWorkers: "対応";
    netlifyEdgeFunctions: "対応";
    vercelEdgeFunctions: "対応";
  };
  moduleSystem: {
    esm: "対応";
    cjs: "対応";
  };
  languages: ["TypeScript", "JavaScript"];
}
```

## クライアントの初期化

### 基本的な初期化

```typescript
import { createClient } from "@libsql/client";

const client = createClient({
  url: "database_url",
  authToken: "optional_token" // オプション
});
```

### TypeScript型定義

```typescript
interface ClientConfig {
  url: string;              // データベースURL
  authToken?: string;       // 認証トークン（オプション）
  syncUrl?: string;         // リモート同期URL
  syncInterval?: number;    // 自動同期間隔（ミリ秒）
  encryptionKey?: string;   // 暗号化キー
  concurrency?: number;     // 同時リクエスト数（デフォルト: 20）
}
```

## データベースタイプ

### 1. インメモリデータベース

一時的なデータストレージに最適です。

```typescript
const client = createClient({
  url: ":memory:"
});
```

### 2. ローカルSQLiteファイル

ローカルファイルシステムにデータを永続化します。

```typescript
const client = createClient({
  url: "file:path/to/db-file.db"
});
```

### 3. 組み込みレプリカ

リモートデータベースと同期するローカルレプリカです。

```typescript
const client = createClient({
  url: "file:local.db",
  syncUrl: process.env.TURSO_DATABASE_URL,
  authToken: process.env.TURSO_AUTH_TOKEN,
  syncInterval: 60000 // 60秒ごとに自動同期
});
```

## 設定オプション

### 同期設定

```typescript
interface SyncOptions {
  syncUrl: string;        // リモートデータベースのURL
  syncInterval?: number;  // 自動同期の間隔（ミリ秒）
}

// 手動同期の例
const client = createClient({
  url: "file:local.db",
  syncUrl: "libsql://[DATABASE].turso.io",
  authToken: "your-token"
});

// クライアント使用後に同期
await client.sync();
```

### 暗号化設定

```typescript
const client = createClient({
  url: "file:encrypted.db",
  encryptionKey: process.env.ENCRYPTION_KEY
});
```

**重要**: 暗号化されたデータベースは、libSQLクライアントでのみ読み取り可能です。

### 同時実行数の制御

```typescript
const client = createClient({
  url: "libsql://[DATABASE].turso.io",
  authToken: "your-token",
  concurrency: 50 // デフォルトは20
});
```

## クエリメソッド

### execute() - 単一クエリの実行

単一のSQLステートメントを実行します。

```typescript
// 基本的なクエリ
const result = await client.execute("SELECT * FROM users");

// プレースホルダーを使用
const result = await client.execute({
  sql: "SELECT * FROM users WHERE id = ?",
  args: [1]
});

// 名前付きプレースホルダー
const result = await client.execute({
  sql: "INSERT INTO users (name, email) VALUES (:name, :email)",
  args: { name: "Alice", email: "alice@example.com" }
});
```

### batch() - バッチトランザクション

複数のステートメントをトランザクションとして実行します。

```typescript
const results = await client.batch([
  "CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY, name TEXT)",
  {
    sql: "INSERT INTO users (name) VALUES (?)",
    args: ["Alice"]
  },
  {
    sql: "INSERT INTO users (name) VALUES (?)",
    args: ["Bob"]
  }
]);
```

**特徴**:
- すべてのステートメントが成功するか、すべて失敗します
- 一括操作に最適

### transaction() - インタラクティブトランザクション

明示的なトランザクション制御を提供します。

```typescript
const transaction = await client.transaction("write");

try {
  await transaction.execute("INSERT INTO users (name) VALUES ('Charlie')");
  await transaction.execute("UPDATE stats SET count = count + 1");

  await transaction.commit();
} catch (error) {
  await transaction.rollback();
  throw error;
}
```

## トランザクション

### トランザクションモード

```typescript
type TransactionMode = "write" | "read" | "deferred";

interface TransactionModes {
  write: {
    description: "読み取りと書き込み操作";
    useCases: ["データの変更", "複数テーブルの更新"];
  };
  read: {
    description: "読み取り専用操作";
    useCases: ["データの参照", "レポート生成"];
  };
  deferred: {
    description: "適応型トランザクション";
    useCases: ["動的なワークロード"];
  };
}
```

### 使用例

```typescript
// 書き込みトランザクション
const writeTx = await client.transaction("write");

// 読み取りトランザクション
const readTx = await client.transaction("read");

// 遅延トランザクション
const deferredTx = await client.transaction("deferred");
```

## レスポンスオブジェクト

### ResultSet型定義

```typescript
interface ResultSet {
  rows: Row[];              // クエリ結果の行
  columns: string[];        // カラム名の配列
  rowsAffected: number;     // 影響を受けた行数
  lastInsertRowid: bigint | undefined;  // 最後に挿入された行のID
}

interface Row {
  [key: string]: any;       // カラム名でアクセス可能
}
```

### 使用例

```typescript
const result = await client.execute("SELECT id, name FROM users");

console.log("カラム:", result.columns); // ["id", "name"]
console.log("行数:", result.rows.length);

result.rows.forEach(row => {
  console.log(`ID: ${row.id}, 名前: ${row.name}`);
});

// INSERT/UPDATE/DELETE の場合
const insertResult = await client.execute(
  "INSERT INTO users (name) VALUES (?)",
  ["Dave"]
);
console.log("影響を受けた行:", insertResult.rowsAffected);
console.log("挿入されたID:", insertResult.lastInsertRowid);
```

## プレースホルダー

### 位置指定プレースホルダー

```typescript
// ? を使用
await client.execute({
  sql: "SELECT * FROM users WHERE id = ? AND status = ?",
  args: [1, "active"]
});
```

### 名前付きプレースホルダー

libSQLは3つの名前付きプレースホルダー構文をサポートしています：

```typescript
// :name 構文
await client.execute({
  sql: "INSERT INTO users (name, email) VALUES (:name, :email)",
  args: { name: "Alice", email: "alice@example.com" }
});

// @name 構文
await client.execute({
  sql: "INSERT INTO users (name, email) VALUES (@name, @email)",
  args: { name: "Bob", email: "bob@example.com" }
});

// $name 構文
await client.execute({
  sql: "INSERT INTO users (name, email) VALUES ($name, $email)",
  args: { name: "Charlie", email: "charlie@example.com" }
});
```

## 注意事項

### Webクライアントの制限

```typescript
// ❌ Webクライアントでは動作しません
const client = createClient({
  url: "file:local.db"
});

// ✅ Webクライアントでは使用可能
const client = createClient({
  url: "libsql://[DATABASE].turso.io",
  authToken: "your-token"
});
```

**理由**: Webブラウザはローカルファイルシステムにアクセスできません。

### インタラクティブトランザクションのタイムアウト

```typescript
// インタラクティブトランザクションは5秒でタイムアウトします
const tx = await client.transaction("write");

// 5秒以内に完了する必要があります
await tx.execute("...");
await tx.commit(); // または rollback()
```

### パフォーマンスに関する考慮事項

```typescript
interface PerformanceConsiderations {
  highLatency: {
    issue: "レイテンシの高いデータベースでトランザクションを使用するとパフォーマンスが低下";
    recommendation: "batch()を使用するか、組み込みレプリカを検討";
  };
  concurrency: {
    default: 20;
    adjustment: "ワークロードに応じて調整可能";
    example: "高スループットアプリケーションでは増やす";
  };
}
```

## ベストプラクティス

### 1. 接続管理

```typescript
// ✅ アプリケーション起動時に1回だけクライアントを作成
const client = createClient({
  url: process.env.TURSO_DATABASE_URL!,
  authToken: process.env.TURSO_AUTH_TOKEN
});

// リクエストごとにクライアントを使用
export default client;
```

### 2. エラーハンドリング

```typescript
try {
  const result = await client.execute("SELECT * FROM users");
  // 結果を処理
} catch (error) {
  console.error("データベースエラー:", error);
  // エラーを適切に処理
}
```

### 3. トランザクションの使用

```typescript
// ✅ 複数の関連する変更にはトランザクションを使用
const tx = await client.transaction("write");
try {
  await tx.execute("UPDATE accounts SET balance = balance - 100 WHERE id = 1");
  await tx.execute("UPDATE accounts SET balance = balance + 100 WHERE id = 2");
  await tx.commit();
} catch (error) {
  await tx.rollback();
  throw error;
}

// ✅ 単純なバッチ操作にはbatch()を使用
await client.batch([
  "INSERT INTO logs (message) VALUES ('Log 1')",
  "INSERT INTO logs (message) VALUES ('Log 2')"
]);
```

## 関連リンク

- [Next.js との統合](./guides/nextjs.md)
- [Remix との統合](./guides/remix.md)
- [Drizzle ORM との使用](./orm/drizzle.md)
- [Prisma ORM との使用](./orm/prisma.md)
- [公式ドキュメント](https://docs.turso.tech/sdk/ts/reference)
