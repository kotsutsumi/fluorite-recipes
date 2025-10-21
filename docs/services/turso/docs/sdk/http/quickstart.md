# Turso HTTP SDK - クイックスタート

Turso HTTP APIを使用してデータベースに接続する方法を説明します。

## 概要

Turso HTTP APIは、標準的なHTTPリクエストでTursoデータベースにアクセスできるRESTful APIです。任意のHTTPクライアントから使用でき、SDKをインストールできない環境でも利用可能です。

## 主な特徴

```typescript
interface HTTPAPIFeatures {
  advantages: {
    universal: "どの言語・環境でも使用可能";
    stateless: "ステートレス（サーバーレス向け）";
    simple: "シンプルなHTTPリクエスト";
    noInstall: "SDKインストール不要";
  };

  useCases: {
    serverless: "サーバーレス関数";
    edge: "エッジコンピューティング";
    testing: "APIテスト・デバッグ";
    integration: "外部サービス統合";
  };
}
```

## 基本的な使い方

### エンドポイント

```
https://{database-name}-{organization}.turso.io/v2/pipeline
```

### 認証

認証にはBearer トークンを使用します：

```
Authorization: Bearer {your-auth-token}
```

## クエリの実行

### curl での例

```bash
# 環境変数を設定
export TURSO_DATABASE_URL="https://my-db-[org].turso.io"
export TURSO_AUTH_TOKEN="your-auth-token"

# SELECTクエリ
curl -X POST \
  "$TURSO_DATABASE_URL/v2/pipeline" \
  -H "Authorization: Bearer $TURSO_AUTH_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "requests": [
      {
        "type": "execute",
        "stmt": {
          "sql": "SELECT * FROM users LIMIT 5"
        }
      }
    ]
  }'
```

### JavaScriptでの例

```javascript
const TURSO_DATABASE_URL = process.env.TURSO_DATABASE_URL;
const TURSO_AUTH_TOKEN = process.env.TURSO_AUTH_TOKEN;

async function query(sql, args = []) {
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
            args: args.map(arg => ({ type: "text", value: String(arg) })),
          },
        },
      ],
    }),
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const data = await response.json();
  return data.results[0].response.result;
}

// 使用例
const users = await query("SELECT * FROM users");
console.log(users.rows);
```

### TypeScriptでの例

```typescript
interface QueryResult {
  cols: Array<{ name: string; type: string }>;
  rows: any[][];
  affected_row_count: number;
  last_insert_rowid?: string;
}

interface PipelineResponse {
  baton: string | null;
  base_url: string | null;
  results: Array<{
    type: string;
    response: {
      type: string;
      result?: QueryResult;
    };
  }>;
}

class TursoHTTPClient {
  private baseUrl: string;
  private authToken: string;

  constructor(baseUrl: string, authToken: string) {
    this.baseUrl = baseUrl;
    this.authToken = authToken;
  }

  async execute(sql: string, args?: any[]): Promise<QueryResult> {
    const response = await fetch(`${this.baseUrl}/v2/pipeline`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${this.authToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        requests: [
          {
            type: "execute",
            stmt: {
              sql,
              args: args?.map(arg => ({
                type: typeof arg === "number" ? "integer" : "text",
                value: String(arg),
              })),
            },
          },
        ],
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Query failed: ${error}`);
    }

    const data: PipelineResponse = await response.json();
    return data.results[0].response.result!;
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

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Batch query failed: ${error}`);
    }

    const data: PipelineResponse = await response.json();
    return data.results.map(r => r.response.result!);
  }
}

// 使用例
const client = new TursoHTTPClient(
  process.env.TURSO_DATABASE_URL!,
  process.env.TURSO_AUTH_TOKEN!
);

// SELECT
const result = await client.execute("SELECT * FROM users WHERE id = ?", [1]);
console.log(result.rows);

// INSERT
const insertResult = await client.execute(
  "INSERT INTO users (name, email) VALUES (?, ?)",
  ["Alice", "alice@example.com"]
);
console.log("Inserted ID:", insertResult.last_insert_rowid);
```

## パラメータ化クエリ

### パラメータの型

```typescript
interface Parameter {
  type: "text" | "integer" | "float" | "blob" | "null";
  value: string;
}
```

### 例

```javascript
// テキストパラメータ
const textParam = { type: "text", value: "Alice" };

// 整数パラメータ
const intParam = { type: "integer", value: "42" };

// 浮動小数点パラメータ
const floatParam = { type: "float", value: "3.14" };

// NULLパラメータ
const nullParam = { type: "null" };

// クエリ実行
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
          sql: "INSERT INTO users (name, age, score) VALUES (?, ?, ?)",
          args: [textParam, intParam, floatParam],
        },
      },
    ],
  }),
});
```

## バッチクエリ

複数のクエリを一度に実行：

```javascript
async function batchQuery() {
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
          stmt: { sql: "SELECT * FROM users WHERE id = 1" },
        },
        {
          type: "execute",
          stmt: { sql: "SELECT * FROM posts WHERE user_id = 1" },
        },
        {
          type: "execute",
          stmt: { sql: "SELECT COUNT(*) FROM comments WHERE user_id = 1" },
        },
      ],
    }),
  });

  const data = await response.json();

  return {
    user: data.results[0].response.result.rows[0],
    posts: data.results[1].response.result.rows,
    commentCount: data.results[2].response.result.rows[0][0],
  };
}
```

## トランザクション

```javascript
async function transaction() {
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
          stmt: { sql: "BEGIN TRANSACTION" },
        },
        {
          type: "execute",
          stmt: {
            sql: "INSERT INTO users (name) VALUES (?)",
            args: [{ type: "text", value: "Alice" }],
          },
        },
        {
          type: "execute",
          stmt: {
            sql: "INSERT INTO profiles (user_id, bio) VALUES (last_insert_rowid(), ?)",
            args: [{ type: "text", value: "Bio here" }],
          },
        },
        {
          type: "execute",
          stmt: { sql: "COMMIT" },
        },
      ],
    }),
  });

  return await response.json();
}
```

## エラーハンドリング

```typescript
async function safeQuery(sql: string, args?: any[]) {
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
              args: args?.map(arg => ({
                type: typeof arg === "number" ? "integer" : "text",
                value: String(arg),
              })),
            },
          },
        ],
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("HTTP Error:", response.status, errorText);
      throw new Error(`Query failed with status ${response.status}`);
    }

    const data = await response.json();

    // APIエラーをチェック
    if (data.results[0].response.type === "error") {
      throw new Error(`SQL Error: ${data.results[0].response.error.message}`);
    }

    return data.results[0].response.result;
  } catch (error) {
    console.error("Query error:", error);
    throw error;
  }
}
```

## 実践例

### Next.js API Route

```typescript
// pages/api/users.ts
import type { NextApiRequest, NextApiResponse } from "next";

const TURSO_DATABASE_URL = process.env.TURSO_DATABASE_URL!;
const TURSO_AUTH_TOKEN = process.env.TURSO_AUTH_TOKEN!;

async function query(sql: string, args: any[] = []) {
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

  const data = await response.json();
  return data.results[0].response.result;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "GET") {
    const result = await query("SELECT * FROM users LIMIT 10");
    res.status(200).json(result.rows);
  } else if (req.method === "POST") {
    const { name, email } = req.body;
    const result = await query(
      "INSERT INTO users (name, email) VALUES (?, ?) RETURNING *",
      [name, email]
    );
    res.status(201).json(result.rows[0]);
  } else {
    res.status(405).json({ error: "Method not allowed" });
  }
}
```

### Cloudflare Workers

```typescript
export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);

    if (url.pathname === "/api/users" && request.method === "GET") {
      const response = await fetch(`${env.TURSO_DATABASE_URL}/v2/pipeline`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${env.TURSO_AUTH_TOKEN}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          requests: [
            {
              type: "execute",
              stmt: { sql: "SELECT * FROM users LIMIT 10" },
            },
          ],
        }),
      });

      const data = await response.json();
      const users = data.results[0].response.result.rows;

      return new Response(JSON.stringify(users), {
        headers: { "Content-Type": "application/json" },
      });
    }

    return new Response("Not found", { status: 404 });
  },
};
```

### Deno

```typescript
const TURSO_DATABASE_URL = Deno.env.get("TURSO_DATABASE_URL")!;
const TURSO_AUTH_TOKEN = Deno.env.get("TURSO_AUTH_TOKEN")!;

async function query(sql: string, args: any[] = []) {
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

  const data = await response.json();
  return data.results[0].response.result;
}

// 使用例
const users = await query("SELECT * FROM users");
console.log(users.rows);
```

## パフォーマンスのヒント

### 1. バッチクエリの使用

```javascript
// 悪い例 - 複数のHTTPリクエスト
const user = await query("SELECT * FROM users WHERE id = 1");
const posts = await query("SELECT * FROM posts WHERE user_id = 1");
const comments = await query("SELECT * FROM comments WHERE user_id = 1");

// 良い例 - 1回のHTTPリクエスト
const results = await client.batch([
  { sql: "SELECT * FROM users WHERE id = ?", args: [1] },
  { sql: "SELECT * FROM posts WHERE user_id = ?", args: [1] },
  { sql: "SELECT * FROM comments WHERE user_id = ?", args: [1] },
]);
```

### 2. 接続の再利用

```typescript
// HTTPクライアントを再利用
const httpClient = new TursoHTTPClient(
  process.env.TURSO_DATABASE_URL!,
  process.env.TURSO_AUTH_TOKEN!
);

// 複数のクエリで同じインスタンスを使用
const users = await httpClient.execute("SELECT * FROM users");
const posts = await httpClient.execute("SELECT * FROM posts");
```

## 次のステップ

- [HTTP API Reference](/docs/services/turso/docs/sdk/http/reference) - 詳細なAPIリファレンス
- [TypeScript SDK](/docs/services/turso/docs/sdk/ts/quickstart) - TypeScript SDKの使用
- [Authentication](/docs/services/turso/docs/sdk/authentication) - 認証の詳細

## 関連リンク

- [Turso公式サイト](https://turso.tech/)
- [Turso HTTP API Documentation](https://docs.turso.tech/reference/http-api)
- [SDK Introduction](/docs/services/turso/docs/sdk/introduction)
