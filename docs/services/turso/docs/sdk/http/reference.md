# Turso HTTP API - リファレンス

Turso HTTP APIの完全なリファレンスドキュメントです。

## 概要

Turso HTTP APIは、RESTful APIを通じてTursoデータベースとやり取りするためのインターフェースを提供します。

## ベースURL

```
https://{database-name}-{organization}.turso.io
```

## エンドポイント

### Pipeline API

```
POST /v2/pipeline
```

複数のSQL文を順次実行するためのメインエンドポイント。

## 認証

### Bearer Token

すべてのリクエストには`Authorization`ヘッダーが必要です：

```
Authorization: Bearer {auth-token}
```

## リクエスト形式

### Pipeline リクエスト

```typescript
interface PipelineRequest {
  baton?: string | null;
  requests: Request[];
}

interface Request {
  type: "execute" | "close";
  stmt?: Statement;
}

interface Statement {
  sql: string;
  args?: Argument[];
  want_rows?: boolean;
}

interface Argument {
  type: "text" | "integer" | "float" | "blob" | "null";
  value?: string;
  base64?: string;  // blobの場合
}
```

### 例

```json
{
  "requests": [
    {
      "type": "execute",
      "stmt": {
        "sql": "SELECT * FROM users WHERE age > ?",
        "args": [
          {
            "type": "integer",
            "value": "18"
          }
        ]
      }
    }
  ]
}
```

## レスポンス形式

### Pipeline レスポンス

```typescript
interface PipelineResponse {
  baton: string | null;
  base_url: string | null;
  results: Result[];
}

interface Result {
  type: "ok" | "error";
  response: Response;
}

interface Response {
  type: "execute" | "close";
  result?: ExecuteResult;
  error?: Error;
}

interface ExecuteResult {
  cols: Column[];
  rows: Row[];
  affected_row_count: number;
  last_insert_rowid?: string;
  replication_index?: string;
}

interface Column {
  name: string;
  decltype?: string;
}

type Row = Value[];

interface Value {
  type: "text" | "integer" | "float" | "blob" | "null";
  value?: string;
  base64?: string;  // blobの場合
}

interface Error {
  message: string;
  code?: string;
}
```

### 成功レスポンスの例

```json
{
  "baton": null,
  "base_url": null,
  "results": [
    {
      "type": "ok",
      "response": {
        "type": "execute",
        "result": {
          "cols": [
            { "name": "id", "decltype": "INTEGER" },
            { "name": "name", "decltype": "TEXT" },
            { "name": "age", "decltype": "INTEGER" }
          ],
          "rows": [
            [
              { "type": "integer", "value": "1" },
              { "type": "text", "value": "Alice" },
              { "type": "integer", "value": "25" }
            ],
            [
              { "type": "integer", "value": "2" },
              { "type": "text", "value": "Bob" },
              { "type": "integer", "value": "30" }
            ]
          ],
          "affected_row_count": 0,
          "last_insert_rowid": null
        }
      }
    }
  ]
}
```

### エラーレスポンスの例

```json
{
  "baton": null,
  "base_url": null,
  "results": [
    {
      "type": "error",
      "response": {
        "type": "execute",
        "error": {
          "message": "no such table: users",
          "code": "SQLITE_ERROR"
        }
      }
    }
  ]
}
```

## データ型

### サポートされる型

```typescript
enum ValueType {
  TEXT = "text",       // 文字列
  INTEGER = "integer", // 整数
  FLOAT = "float",     // 浮動小数点数
  BLOB = "blob",       // バイナリデータ
  NULL = "null"        // NULL値
}
```

### 型変換の例

```javascript
// テキスト
{ type: "text", value: "Hello, World!" }

// 整数
{ type: "integer", value: "42" }

// 浮動小数点数
{ type: "float", value: "3.14159" }

// BLOB（Base64エンコード）
{ type: "blob", base64: "SGVsbG8gV29ybGQh" }

// NULL
{ type: "null" }
```

## クエリパターン

### SELECT

```json
{
  "requests": [
    {
      "type": "execute",
      "stmt": {
        "sql": "SELECT * FROM users WHERE id = ?",
        "args": [
          { "type": "integer", "value": "1" }
        ]
      }
    }
  ]
}
```

### INSERT

```json
{
  "requests": [
    {
      "type": "execute",
      "stmt": {
        "sql": "INSERT INTO users (name, email, age) VALUES (?, ?, ?)",
        "args": [
          { "type": "text", "value": "Alice" },
          { "type": "text", "value": "alice@example.com" },
          { "type": "integer", "value": "25" }
        ]
      }
    }
  ]
}
```

レスポンス:

```json
{
  "results": [
    {
      "type": "ok",
      "response": {
        "type": "execute",
        "result": {
          "cols": [],
          "rows": [],
          "affected_row_count": 1,
          "last_insert_rowid": "42"
        }
      }
    }
  ]
}
```

### UPDATE

```json
{
  "requests": [
    {
      "type": "execute",
      "stmt": {
        "sql": "UPDATE users SET email = ? WHERE id = ?",
        "args": [
          { "type": "text", "value": "newemail@example.com" },
          { "type": "integer", "value": "1" }
        ]
      }
    }
  ]
}
```

### DELETE

```json
{
  "requests": [
    {
      "type": "execute",
      "stmt": {
        "sql": "DELETE FROM users WHERE id = ?",
        "args": [
          { "type": "integer", "value": "1" }
        ]
      }
    }
  ]
}
```

### トランザクション

```json
{
  "requests": [
    {
      "type": "execute",
      "stmt": { "sql": "BEGIN TRANSACTION" }
    },
    {
      "type": "execute",
      "stmt": {
        "sql": "INSERT INTO users (name) VALUES (?)",
        "args": [{ "type": "text", "value": "Alice" }]
      }
    },
    {
      "type": "execute",
      "stmt": {
        "sql": "INSERT INTO profiles (user_id, bio) VALUES (last_insert_rowid(), ?)",
        "args": [{ "type": "text", "value": "Developer" }]
      }
    },
    {
      "type": "execute",
      "stmt": { "sql": "COMMIT" }
    }
  ]
}
```

### バッチクエリ

```json
{
  "requests": [
    {
      "type": "execute",
      "stmt": { "sql": "SELECT * FROM users WHERE id = 1" }
    },
    {
      "type": "execute",
      "stmt": { "sql": "SELECT * FROM posts WHERE user_id = 1" }
    },
    {
      "type": "execute",
      "stmt": { "sql": "SELECT COUNT(*) FROM comments WHERE user_id = 1" }
    }
  ]
}
```

## HTTPステータスコード

```typescript
interface HTTPStatusCodes {
  200: {
    description: "成功";
    note: "SQLエラーでも200が返る場合がある";
  };

  400: {
    description: "不正なリクエスト";
    causes: ["JSONパースエラー", "不正なパラメータ"];
  };

  401: {
    description: "認証失敗";
    causes: ["トークンなし", "無効なトークン"];
  };

  404: {
    description: "データベースが見つからない";
    causes: ["URLが間違っている", "データベースが削除された"];
  };

  500: {
    description: "サーバーエラー";
    causes: ["内部エラー"];
  };

  503: {
    description: "サービス利用不可";
    causes: ["メンテナンス中", "一時的な障害"];
  };
}
```

## エラーコード

### SQLiteエラーコード

```typescript
enum SQLiteErrorCode {
  SQLITE_ERROR = "SQLITE_ERROR",           // SQL構文エラー
  SQLITE_CONSTRAINT = "SQLITE_CONSTRAINT", // 制約違反
  SQLITE_BUSY = "SQLITE_BUSY",             // データベースがロック中
  SQLITE_NOMEM = "SQLITE_NOMEM",           // メモリ不足
  SQLITE_READONLY = "SQLITE_READONLY",     // 読み取り専用
  SQLITE_IOERR = "SQLITE_IOERR",           // I/Oエラー
  SQLITE_CORRUPT = "SQLITE_CORRUPT",       // データベース破損
  SQLITE_FULL = "SQLITE_FULL",             // ディスク満杯
  SQLITE_CANTOPEN = "SQLITE_CANTOPEN",     // ファイルを開けない
  SQLITE_PROTOCOL = "SQLITE_PROTOCOL",     // プロトコルエラー
  SQLITE_SCHEMA = "SQLITE_SCHEMA",         // スキーマ変更
  SQLITE_TOOBIG = "SQLITE_TOOBIG",         // データが大きすぎる
  SQLITE_MISMATCH = "SQLITE_MISMATCH",     // データ型不一致
  SQLITE_MISUSE = "SQLITE_MISUSE",         // ライブラリの誤用
  SQLITE_AUTH = "SQLITE_AUTH",             // 認証エラー
}
```

## レート制限

```typescript
interface RateLimits {
  requests: {
    limit: "プランに応じて異なる";
    header: "X-RateLimit-Limit";
    remaining: "X-RateLimit-Remaining";
    reset: "X-RateLimit-Reset";
  };

  handling: {
    status: 429;
    message: "Too Many Requests";
    retryAfter: "Retry-After header（秒）";
  };
}
```

## ベストプラクティス

### 1. エラーハンドリング

```typescript
async function robustQuery(sql: string, args: any[] = []) {
  try {
    const response = await fetch(`${TURSO_DATABASE_URL}/v2/pipeline`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${TURSO_AUTH_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        requests: [
          {
            type: "execute",
            stmt: {
              sql,
              args: args.map(arg => ({
                type: typeof arg === "number" ? "integer" : "text",
                value: String(arg),
              })),
            },
          },
        ],
      }),
    });

    // HTTPエラーチェック
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`HTTP ${response.status}: ${errorText}`);
    }

    const data = await response.json();

    // SQLエラーチェック
    if (data.results[0].type === "error") {
      throw new Error(
        `SQL Error: ${data.results[0].response.error.message}`
      );
    }

    return data.results[0].response.result;
  } catch (error) {
    console.error("Query failed:", { sql, args, error });
    throw error;
  }
}
```

### 2. リトライロジック

```typescript
async function queryWithRetry(
  sql: string,
  args: any[] = [],
  maxRetries = 3
) {
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await robustQuery(sql, args);
    } catch (error: any) {
      // 最後の試行では例外を投げる
      if (i === maxRetries - 1) throw error;

      // リトライ可能なエラーかチェック
      if (
        error.message?.includes("503") ||
        error.message?.includes("timeout") ||
        error.message?.includes("SQLITE_BUSY")
      ) {
        const delay = Math.pow(2, i) * 1000; // エクスポネンシャルバックオフ
        console.log(`Retry ${i + 1}/${maxRetries} after ${delay}ms`);
        await new Promise(resolve => setTimeout(resolve, delay));
      } else {
        // リトライ不可能なエラー
        throw error;
      }
    }
  }
}
```

### 3. タイムアウト設定

```typescript
async function queryWithTimeout(
  sql: string,
  args: any[] = [],
  timeoutMs = 10000
) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetch(`${TURSO_DATABASE_URL}/v2/pipeline`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${TURSO_AUTH_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        requests: [
          {
            type: "execute",
            stmt: {
              sql,
              args: args.map(arg => ({
                type: typeof arg === "number" ? "integer" : "text",
                value: String(arg),
              })),
            },
          },
        ],
      }),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    const data = await response.json();
    return data.results[0].response.result;
  } catch (error: any) {
    clearTimeout(timeoutId);

    if (error.name === "AbortError") {
      throw new Error(`Query timeout after ${timeoutMs}ms`);
    }

    throw error;
  }
}
```

### 4. 接続プーリング

```typescript
class HTTPConnectionPool {
  private static instance: HTTPConnectionPool;
  private baseUrl: string;
  private authToken: string;

  private constructor(baseUrl: string, authToken: string) {
    this.baseUrl = baseUrl;
    this.authToken = authToken;
  }

  static getInstance(baseUrl: string, authToken: string): HTTPConnectionPool {
    if (!HTTPConnectionPool.instance) {
      HTTPConnectionPool.instance = new HTTPConnectionPool(baseUrl, authToken);
    }
    return HTTPConnectionPool.instance;
  }

  async query(sql: string, args: any[] = []) {
    return await robustQuery(sql, args);
  }

  async batch(statements: Array<{ sql: string; args?: any[] }>) {
    const requests = statements.map(stmt => ({
      type: "execute",
      stmt: {
        sql: stmt.sql,
        args: stmt.args?.map(arg => ({
          type: typeof arg === "number" ? "integer" : "text",
          value: String(arg),
        })),
      },
    }));

    const response = await fetch(`${this.baseUrl}/v2/pipeline`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${this.authToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ requests }),
    });

    const data = await response.json();
    return data.results.map((r: any) => r.response.result);
  }
}
```

## パフォーマンス最適化

### バッチ処理の使用

```typescript
// 非効率 - 複数のHTTPリクエスト
const user = await query("SELECT * FROM users WHERE id = 1");
const posts = await query("SELECT * FROM posts WHERE user_id = 1");

// 効率的 - 1回のHTTPリクエスト
const [userResult, postsResult] = await batch([
  { sql: "SELECT * FROM users WHERE id = ?", args: [1] },
  { sql: "SELECT * FROM posts WHERE user_id = ?", args: [1] },
]);
```

### 不要なデータの取得を避ける

```typescript
// 非効率 - すべてのカラムを取得
await query("SELECT * FROM users");

// 効率的 - 必要なカラムのみ
await query("SELECT id, name FROM users");

// 効率的 - 必要な行のみ
await query("SELECT id, name FROM users LIMIT 10");
```

## 関連リンク

- [HTTP SDK Quickstart](/docs/services/turso/docs/sdk/http/quickstart)
- [SDK Introduction](/docs/services/turso/docs/sdk/introduction)
- [Authentication](/docs/services/turso/docs/sdk/authentication)
- [Turso公式サイト](https://turso.tech/)
