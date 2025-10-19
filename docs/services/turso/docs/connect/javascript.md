# Turso - JavaScriptで接続

JavaScriptを使用してTursoに接続する方法を説明します。

## セットアップ手順

### 1. インストール

npmを使用してTurso Databaseパッケージをインストールします：

```bash
npm i @tursodatabase/database
```

### 2. 接続

ローカルSQLiteデータベースに接続する例：

```javascript
import { connect } from "@tursodatabase/database";

const db = await connect("sqlite.db");
```

### 3. テーブルの作成

`users`テーブルを作成します：

```javascript
await db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT NOT NULL
  )
`);
```

### 4. データの挿入

プリペアドステートメントを使用してユーザーを挿入します：

```javascript
await db.exec("INSERT INTO users (username) VALUES (?)", ["alice"]);
await db.exec("INSERT INTO users (username) VALUES (?)", ["bob"]);
```

### 5. データのクエリ

すべてのユーザーを取得して表示します：

```javascript
const users = await db.query("SELECT * FROM users");
console.log(users);
```

## 完全なコード例

```javascript
import { connect } from "@tursodatabase/database";

async function main() {
  // データベースに接続
  const db = await connect("sqlite.db");

  // テーブルを作成
  await db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT NOT NULL
    )
  `);

  // データを挿入
  await db.exec("INSERT INTO users (username) VALUES (?)", ["alice"]);
  await db.exec("INSERT INTO users (username) VALUES (?)", ["bob"]);

  // データをクエリ
  const users = await db.query("SELECT * FROM users");
  console.log(users);
}

main();
```

## Turso Cloudに接続

Turso Cloudでホストされているデータベースに接続する場合：

```javascript
import { createClient } from "@tursodatabase/database";

const client = createClient({
  url: process.env.TURSO_DATABASE_URL,
  authToken: process.env.TURSO_AUTH_TOKEN,
});
```

## 主な機能

### プリペアドステートメント

SQLインジェクション攻撃を防ぐため、プリペアドステートメントの使用を推奨します：

```javascript
await db.exec("INSERT INTO users (username) VALUES (?)", [username]);
```

### トランザクション

複数の操作をアトミックに実行できます：

```javascript
await db.transaction(async (tx) => {
  await tx.exec("INSERT INTO users (username) VALUES (?)", ["alice"]);
  await tx.exec("INSERT INTO users (username) VALUES (?)", ["bob"]);
});
```

### バッチ操作

複数のクエリを一度に実行できます：

```javascript
const results = await db.batch([
  { sql: "INSERT INTO users (username) VALUES (?)", args: ["alice"] },
  { sql: "INSERT INTO users (username) VALUES (?)", args: ["bob"] },
  { sql: "SELECT * FROM users" },
]);
```

## TypeScriptサポート

TypeScriptを使用する場合、型定義が自動的に含まれます：

```typescript
import { connect, Database } from "@tursodatabase/database";

const db: Database = await connect("sqlite.db");
```

## エラーハンドリング

適切なエラーハンドリングを実装することを推奨します：

```javascript
try {
  const users = await db.query("SELECT * FROM users");
  console.log(users);
} catch (error) {
  console.error("Database error:", error);
}
```

## 関連リンク

- [Turso公式サイト](https://turso.tech/)
- [Turso GitHub](https://github.com/tursodatabase/turso)
- [Turso Documentation](https://docs.turso.tech/)
- [@tursodatabase/database npm package](https://www.npmjs.com/package/@tursodatabase/database)
