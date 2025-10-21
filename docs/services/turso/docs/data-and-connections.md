# Turso - データと接続

Tursoデータベースのデータ整合性と接続について説明します。

## 概要

TursoはlibSQL（SQLiteのフォーク）の拡張版です。ネットワークアクセス可能でレプリケーションされた性質により、SQLiteの整合性モデルを変更しています。

## 接続の確立

### 接続プロトコル

クライアントは以下のいずれかで接続します：

- **HTTP**: RESTful API経由
- **WebSocket**: 永続的な接続

### 内部処理

クライアント接続が確立されると、サーバー上で内部SQLiteデータベース接続が確立されます。

## データ整合性

### プライマリデータベース操作

プライマリデータベースでは以下の特性があります：

#### 線形化可能な操作

- すべての書き込み操作は完全にシリアライズされます
- 操作の順序が保証されます
- グローバルな一貫性を維持

#### 注意事項

長時間実行されるトランザクションや放棄されたトランザクションには注意が必要です：

```javascript
// 避けるべきパターン
const tx = await client.transaction();
// ... 長時間の処理 ...
// トランザクションが開きっぱなし
```

**推奨**: トランザクションは可能な限り短く保つ

## トランザクション整合性

### SQLiteトランザクションセマンティクス

Tursoは標準的なSQLiteトランザクションセマンティクスに従います：

#### スナップショット分離

- 読み取り操作はスナップショット分離を使用
- トランザクション開始時のデータベース状態を参照
- 他のトランザクションの変更は見えない

#### シリアライズ可能性

- トランザクションの分離を保証
- 同時実行トランザクション間の干渉を防止

### トランザクションの例

**JavaScript/TypeScript**:
```typescript
import { createClient } from "@libsql/client";

const client = createClient({
  url: process.env.TURSO_DATABASE_URL,
  authToken: process.env.TURSO_AUTH_TOKEN,
});

// トランザクション実行
const tx = await client.transaction();
try {
  await tx.execute("INSERT INTO users (name) VALUES ('Alice')");
  await tx.execute("UPDATE accounts SET balance = balance - 100 WHERE user = 'Alice'");
  await tx.commit();
} catch (error) {
  await tx.rollback();
  throw error;
}
```

**Python**:
```python
import libsql_experimental as libsql

conn = libsql.connect(
    database_url,
    auth_token=auth_token
)

# トランザクション実行
try:
    conn.execute("BEGIN TRANSACTION")
    conn.execute("INSERT INTO users (name) VALUES ('Alice')")
    conn.execute("UPDATE accounts SET balance = balance - 100 WHERE user = 'Alice'")
    conn.execute("COMMIT")
except Exception as e:
    conn.execute("ROLLBACK")
    raise e
```

## 読み取り整合性

### スナップショット読み取り

```sql
BEGIN TRANSACTION;
  -- この時点のデータベーススナップショット
  SELECT * FROM users;
  -- 他のトランザクションの変更は見えない
  SELECT * FROM accounts;
COMMIT;
```

### Read-Your-Writes

自分のトランザクション内での書き込みは、同じトランザクション内で即座に読み取り可能：

```javascript
const tx = await client.transaction();
await tx.execute("INSERT INTO users (id, name) VALUES (1, 'Alice')");
const result = await tx.execute("SELECT * FROM users WHERE id = 1");
// Aliceが返される
await tx.commit();
```

## 書き込み整合性

### 完全なシリアライゼーション

すべての書き込みは順序付けられます：

```
Transaction 1: INSERT ... (時刻 T1)
Transaction 2: UPDATE ... (時刻 T2, T2 > T1)
Transaction 3: DELETE ... (時刻 T3, T3 > T2)
```

### コンフリクトの処理

同時書き込みトランザクションは、SQLiteのロック機構に従います：

```javascript
// Transaction 1
const tx1 = await client.transaction();
await tx1.execute("UPDATE users SET name = 'Alice' WHERE id = 1");

// Transaction 2 (ブロックされる)
const tx2 = await client.transaction();
await tx2.execute("UPDATE users SET name = 'Bob' WHERE id = 1");
// tx1がコミットまたはロールバックするまで待機

await tx1.commit(); // Transaction 2が続行可能に
await tx2.commit();
```

## 接続プール

### ベストプラクティス

1. **接続の再利用**: 複数のクエリで接続を再利用
2. **適切なクローズ**: 使用後は接続を閉じる
3. **タイムアウト設定**: 長時間の接続を避ける

**JavaScript**:
```typescript
// 接続プールの使用
const client = createClient({
  url: process.env.TURSO_DATABASE_URL,
  authToken: process.env.TURSO_AUTH_TOKEN,
});

// 複数のクエリで再利用
await client.execute("SELECT * FROM users");
await client.execute("SELECT * FROM accounts");

// アプリケーション終了時
// client.close(); // 必要に応じて
```

## レプリカとの整合性

### プライマリとレプリカ

- **書き込み**: プライマリのみ
- **読み取り**: プライマリまたはレプリカ

### 最終的整合性

レプリカは最終的にプライマリと同期されます：

```
Primary:  Write → [データ] → Replicate
Replica:           ↓
         [データ受信] → [同期完了]
```

## パフォーマンス最適化

### 1. バッチ操作

```javascript
// 非効率
for (const user of users) {
  await client.execute("INSERT INTO users (name) VALUES (?)", [user.name]);
}

// 効率的
const tx = await client.transaction();
for (const user of users) {
  await tx.execute("INSERT INTO users (name) VALUES (?)", [user.name]);
}
await tx.commit();
```

### 2. 適切なインデックス

```sql
-- よく使われるカラムにインデックスを作成
CREATE INDEX idx_users_email ON users(email);
```

### 3. プリペアドステートメント

```javascript
// プリペアドステートメントの使用
await client.execute({
  sql: "SELECT * FROM users WHERE id = ?",
  args: [userId],
});
```

## エラーハンドリング

### 接続エラー

```javascript
try {
  await client.execute("SELECT * FROM users");
} catch (error) {
  if (error.code === 'SQLITE_BUSY') {
    // データベースがビジー状態
    // リトライロジック
  } else if (error.code === 'SQLITE_LOCKED') {
    // テーブルがロックされている
    // 待機して再試行
  } else {
    throw error;
  }
}
```

### トランザクションエラー

```javascript
const tx = await client.transaction();
try {
  await tx.execute("INSERT INTO users (name) VALUES ('Alice')");
  await tx.execute("INVALID SQL"); // エラー発生
  await tx.commit();
} catch (error) {
  await tx.rollback(); // ロールバック
  console.error("Transaction failed:", error);
}
```

## モニタリング

### 接続数の追跡

```javascript
let activeConnections = 0;

async function executeQuery(sql) {
  activeConnections++;
  try {
    const result = await client.execute(sql);
    return result;
  } finally {
    activeConnections--;
  }
}
```

### パフォーマンスメトリクス

- クエリ実行時間
- トランザクション成功率
- 接続エラー率

## 関連リンク

- [Turso公式サイト](https://turso.tech/)
- [libSQL Documentation](https://github.com/tursodatabase/libsql)
- [SQLite Transaction Documentation](https://www.sqlite.org/lang_transaction.html)
- [Turso Documentation](https://docs.turso.tech/)
