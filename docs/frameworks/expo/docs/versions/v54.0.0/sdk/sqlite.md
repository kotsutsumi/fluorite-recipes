# SQLite

React NativeおよびExpoアプリケーションでSQLiteデータベースへのアクセスを提供するライブラリです。

## インストール

ターミナルで以下のコマンドを実行してライブラリをインストールします。

```bash
npx expo install expo-sqlite
```

## 概要

Expo SQLiteは、React NativeおよびExpoアプリケーションでSQLiteデータベースへのアクセスを提供するライブラリです。Android、iOS、macOS、tvOS、Webプラットフォームをサポートしています。

## プラットフォームサポート

- Android
- iOS
- macOS
- tvOS
- Web（実験的）

## 主な機能

- アプリの再起動後も永続化されるデータベースストレージ
- 非同期および同期のデータベース操作
- プリペアドステートメント
- トランザクションのサポート
- キー・バリューストレージ
- データベース管理用のReactフック
- Web対応（実験的）

## 基本的な使用方法

```javascript
import * as SQLite from 'expo-sqlite';

// データベースを開く
const db = await SQLite.openDatabaseAsync('databaseName');

// テーブルを作成
await db.execAsync(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    value INTEGER NOT NULL
  );
`);

// データを挿入
await db.runAsync(
  'INSERT INTO users (name, value) VALUES (?, ?)',
  'John',
  100
);

// データをクエリ
const users = await db.getAllAsync('SELECT * FROM users');
console.log(users);
```

## API リファレンス

### データベースを開く

#### openDatabaseAsync(databaseName)

データベースを非同期で開きます。

```javascript
const db = await SQLite.openDatabaseAsync('mydb.db');
```

### クエリの実行

#### getAllAsync(query, ...params)

すべての行を取得します。

```javascript
const users = await db.getAllAsync('SELECT * FROM users WHERE value > ?', 50);
```

#### getFirstAsync(query, ...params)

最初の行を取得します。

```javascript
const user = await db.getFirstAsync('SELECT * FROM users WHERE id = ?', 1);
```

#### runAsync(query, ...params)

クエリを実行して結果のメタデータを返します。

```javascript
const result = await db.runAsync(
  'INSERT INTO users (name, value) VALUES (?, ?)',
  'Alice',
  200
);
console.log(result.lastInsertRowId, result.changes);
```

#### execAsync(query)

複数のSQL文を実行します（パラメータなし）。

```javascript
await db.execAsync(`
  DROP TABLE IF EXISTS users;
  CREATE TABLE users (id INTEGER PRIMARY KEY, name TEXT, value INTEGER);
  INSERT INTO users (name, value) VALUES ('John', 100);
  INSERT INTO users (name, value) VALUES ('Alice', 200);
`);
```

### プリペアドステートメント

```javascript
const statement = await db.prepareAsync(
  'INSERT INTO users (name, value) VALUES (?, ?)'
);

try {
  for (const user of usersToInsert) {
    await statement.executeAsync(user.name, user.value);
  }
} finally {
  await statement.finalizeAsync();
}
```

### トランザクション

```javascript
await db.withTransactionAsync(async () => {
  await db.runAsync('UPDATE users SET value = value + 1 WHERE name = ?', 'John');
  await db.runAsync('UPDATE users SET value = value - 1 WHERE name = ?', 'Alice');
});
```

### Reactフック

#### useSQLiteContext()

SQLiteコンテキストからデータベースインスタンスを取得します。

```javascript
import { useSQLiteContext } from 'expo-sqlite';

function MyComponent() {
  const db = useSQLiteContext();

  const fetchUsers = async () => {
    const users = await db.getAllAsync('SELECT * FROM users');
    return users;
  };
}
```

## 高度な機能

### キー・バリューストレージ

```javascript
// 値を設定
await db.setItemAsync('key', 'value');

// 値を取得
const value = await db.getItemAsync('key');

// 値を削除
await db.removeItemAsync('key');
```

### localStorage API

Web互換のlocalStorage APIを使用できます。

```javascript
const storage = await SQLite.openDatabaseAsync('storage.db');
storage.setItem('key', 'value');
const value = storage.getItem('key');
```

### SQLCipher（暗号化）

データベースを暗号化するためのSQLCipherサポート。

```javascript
const db = await SQLite.openDatabaseAsync('encrypted.db', {
  enableCRSQLite: true,
  encryptionKey: 'your-encryption-key'
});
```

## セキュリティの考慮事項

### SQLインジェクション対策

**必ずプリペアドステートメントを使用してください**。

❌ **危険な例**:
```javascript
// SQLインジェクションの危険性あり
const userInput = "John'; DROP TABLE users; --";
await db.execAsync(`SELECT * FROM users WHERE name = '${userInput}'`);
```

✅ **安全な例**:
```javascript
// プリペアドステートメントを使用
const userInput = "John'; DROP TABLE users; --";
await db.getAllAsync('SELECT * FROM users WHERE name = ?', userInput);
```

## サードパーティ統合

### Drizzle ORM

```javascript
import { drizzle } from 'drizzle-orm/expo-sqlite';
import * as SQLite from 'expo-sqlite';

const expoDb = SQLite.openDatabaseSync('mydb.db');
const db = drizzle(expoDb);
```

### Knex.js

```javascript
import Knex from 'knex';
import * as SQLite from 'expo-sqlite';

const db = SQLite.openDatabaseSync('mydb.db');
const knex = Knex({
  client: 'better-sqlite3',
  connection: {
    filename: ':memory:',
  },
  useNullAsDefault: true,
});
```

## デバッグ

### クエリのログ記録

```javascript
db.execAsync('PRAGMA foreign_keys = ON;');
db.execAsync('PRAGMA journal_mode = WAL;');
```

### データベースの場所

```javascript
import * as FileSystem from 'expo-file-system';

const dbPath = `${FileSystem.documentDirectory}SQLite/mydb.db`;
console.log('Database path:', dbPath);
```

## ベストプラクティス

1. **プリペアドステートメントを使用**: SQLインジェクションを防ぐ
2. **トランザクションを活用**: 複数の関連する操作をグループ化
3. **インデックスを作成**: クエリのパフォーマンスを向上
4. **適切なエラーハンドリング**: try-catchでエラーを処理
5. **データベースを閉じる**: 使用後は適切にクローズ

```javascript
// 良い例
try {
  await db.withTransactionAsync(async () => {
    await db.runAsync('INSERT INTO users (name, value) VALUES (?, ?)', name, value);
    await db.runAsync('UPDATE stats SET count = count + 1');
  });
} catch (error) {
  console.error('Transaction failed:', error);
} finally {
  // 必要に応じてクリーンアップ
}
```

## パフォーマンスの最適化

1. **インデックスの作成**:
```javascript
await db.execAsync('CREATE INDEX idx_users_name ON users(name);');
```

2. **バッチ挿入**:
```javascript
const statement = await db.prepareAsync(
  'INSERT INTO users (name, value) VALUES (?, ?)'
);
for (const user of users) {
  await statement.executeAsync(user.name, user.value);
}
await statement.finalizeAsync();
```

3. **WALモードを有効化**:
```javascript
await db.execAsync('PRAGMA journal_mode = WAL;');
```

## トラブルシューティング

### よくある問題

1. **データベースがロックされている**: WALモードを使用するか、トランザクションを適切に管理
2. **メモリ不足**: 大量のデータを扱う場合は、ページングを使用
3. **Web互換性**: Web版は実験的機能のため、本番環境での使用は慎重に

## 移行とスキーマ管理

```javascript
const CURRENT_DB_VERSION = 2;

async function migrateDbIfNeeded(db) {
  const version = await db.getFirstAsync('PRAGMA user_version');

  if (version.user_version < CURRENT_DB_VERSION) {
    // マイグレーションを実行
    await db.execAsync(`
      ALTER TABLE users ADD COLUMN email TEXT;
      PRAGMA user_version = ${CURRENT_DB_VERSION};
    `);
  }
}
```
