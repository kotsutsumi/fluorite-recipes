# APIルート

Expo Routerでサーバーサイドエンドポイントを作成する方法を学びます。

## APIルートとは

APIルートは、アプリディレクトリ内に`+api.ts`ファイルを使用して作成されるサーバーサイドエンドポイントです。機密データを処理し、カスタムサーバーロジックを実装できます。

## 基本的なセットアップ

### 1. app.jsonの設定

サーバー出力を設定します。

```json
{
  "expo": {
    "web": {
      "output": "server"
    }
  }
}
```

### 2. APIルートファイルの作成

アプリディレクトリにAPIルートファイルを作成します。

**ファイル名**: `hello+api.ts`

```typescript
// app/hello+api.ts
export function GET(request: Request) {
  return Response.json({ hello: 'world' });
}
```

### 3. アクセス

```
GET /hello
```

**レスポンス**：
```json
{
  "hello": "world"
}
```

## サポートされるHTTPメソッド

APIルートは、以下のHTTPメソッドをサポートしています：

### GET

```typescript
export function GET(request: Request) {
  return Response.json({ method: 'GET' });
}
```

### POST

```typescript
export function POST(request: Request) {
  return Response.json({ method: 'POST' });
}
```

### PUT

```typescript
export function PUT(request: Request) {
  return Response.json({ method: 'PUT' });
}
```

### PATCH

```typescript
export function PATCH(request: Request) {
  return Response.json({ method: 'PATCH' });
}
```

### DELETE

```typescript
export function DELETE(request: Request) {
  return Response.json({ method: 'DELETE' });
}
```

### HEAD

```typescript
export function HEAD(request: Request) {
  return new Response(null, { status: 200 });
}
```

### OPTIONS

```typescript
export function OPTIONS(request: Request) {
  return new Response(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE',
    },
  });
}
```

## リクエストの処理

### リクエストボディの読み取り

```typescript
// app/users+api.ts
export async function POST(request: Request) {
  const body = await request.json();
  const { name, email } = body;

  return Response.json({
    message: 'User created',
    user: { name, email },
  });
}
```

### クエリパラメータの解析

```typescript
// app/search+api.ts
export function GET(request: Request) {
  const url = new URL(request.url);
  const query = url.searchParams.get('q');
  const limit = url.searchParams.get('limit') || '10';

  return Response.json({
    query,
    limit: parseInt(limit),
    results: [],
  });
}
```

**リクエスト**：
```
GET /search?q=hello&limit=20
```

**レスポンス**：
```json
{
  "query": "hello",
  "limit": 20,
  "results": []
}
```

### ヘッダーの取得

```typescript
// app/auth+api.ts
export function GET(request: Request) {
  const authToken = request.headers.get('Authorization');

  if (!authToken) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }

  return Response.json({ authenticated: true });
}
```

## レスポンスの処理

### JSONレスポンス

```typescript
export function GET(request: Request) {
  return Response.json({
    message: 'Success',
    data: { id: 1, name: 'Example' },
  });
}
```

### ステータスコードの設定

```typescript
export function POST(request: Request) {
  return Response.json(
    { message: 'Created' },
    { status: 201 }
  );
}
```

### カスタムヘッダーの設定

```typescript
export function GET(request: Request) {
  return Response.json(
    { data: [] },
    {
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'max-age=3600',
      },
    }
  );
}
```

### エラーレスポンス

```typescript
export function GET(request: Request) {
  return Response.json(
    { error: 'Not Found' },
    { status: 404 }
  );
}
```

## セキュリティ

### サンドボックス環境

ルートハンドラーはサンドボックス環境で実行されます。

**特徴**：
- 機密データを安全に保存可能
- クライアントバンドルに含まれない

### シークレットの保護

```typescript
// app/api/secret+api.ts
const API_SECRET = process.env.API_SECRET;

export function GET(request: Request) {
  // シークレットはクライアントバンドルに含まれない
  return Response.json({ secret: API_SECRET });
}
```

**重要**: `+api.ts`ファイル内のシークレットは、クライアントバンドルに含まれません。

## 動的ルート

### パラメータ付きAPIルート

```typescript
// app/users/[id]+api.ts
export function GET(request: Request, { id }: { id: string }) {
  return Response.json({
    userId: id,
    name: 'User Name',
  });
}
```

**リクエスト**：
```
GET /users/123
```

**レスポンス**：
```json
{
  "userId": "123",
  "name": "User Name"
}
```

### キャッチオールルート

```typescript
// app/api/[...path]+api.ts
export function GET(request: Request, { path }: { path: string[] }) {
  return Response.json({
    path: path.join('/'),
  });
}
```

**リクエスト**：
```
GET /api/v1/users/123
```

**レスポンス**：
```json
{
  "path": "v1/users/123"
}
```

## デプロイオプション

### Webエクスポート

```bash
npx expo export --platform web
```

### ネイティブデプロイ

EASを使用してネイティブアプリをデプロイします。

```bash
eas build --platform all
```

### ホスティングプラットフォーム

**Bun**：
```bash
bun run dist/server/index.js
```

**Express**：
```javascript
const express = require('express');
const app = express();
app.use(require('./dist/server'));
app.listen(3000);
```

**Netlify**：
Netlify Functionsとして自動デプロイ

**Vercel**：
Vercel Serverless Functionsとして自動デプロイ

## 制限事項

### 1. 動的インポート不可

現在、動的インポートはサポートされていません。

```typescript
// ❌ 動作しない
export async function GET(request: Request) {
  const module = await import('./utils');
  return Response.json({ data: module.getData() });
}
```

### 2. ESM未サポート

ESM（ES Modules）は現在サポートされていません。

```typescript
// ❌ 動作しない
import { getData } from './utils.mjs';
```

### 3. バンドリングによる外部依存関係の制限

バンドリングは、外部依存関係を制限します。

**影響**：
- すべての依存関係がバンドルされる
- 一部のネイティブモジュールは動作しない可能性

## 実装例

### 例1: ユーザーAPI

```typescript
// app/api/users+api.ts
const users = [
  { id: '1', name: 'Alice', email: 'alice@example.com' },
  { id: '2', name: 'Bob', email: 'bob@example.com' },
];

export function GET(request: Request) {
  return Response.json({ users });
}

export async function POST(request: Request) {
  const body = await request.json();
  const newUser = {
    id: String(users.length + 1),
    ...body,
  };
  users.push(newUser);
  return Response.json({ user: newUser }, { status: 201 });
}
```

### 例2: 認証API

```typescript
// app/api/auth/login+api.ts
export async function POST(request: Request) {
  const { email, password } = await request.json();

  // 簡略化された認証ロジック
  if (email === 'user@example.com' && password === 'password') {
    return Response.json({
      token: 'jwt-token-here',
      user: { email },
    });
  }

  return Response.json(
    { error: 'Invalid credentials' },
    { status: 401 }
  );
}
```

### 例3: ファイルアップロードAPI

```typescript
// app/api/upload+api.ts
export async function POST(request: Request) {
  const formData = await request.formData();
  const file = formData.get('file') as File;

  if (!file) {
    return Response.json(
      { error: 'No file provided' },
      { status: 400 }
    );
  }

  // ファイル処理ロジック
  return Response.json({
    message: 'File uploaded',
    filename: file.name,
    size: file.size,
  });
}
```

## ベストプラクティス

### 1. エラーハンドリング

適切なエラーハンドリングを実装します。

```typescript
export async function POST(request: Request) {
  try {
    const body = await request.json();
    // 処理
    return Response.json({ success: true });
  } catch (error) {
    return Response.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
```

### 2. 入力検証

リクエストデータを検証します。

```typescript
import { z } from 'zod';

const UserSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const validated = UserSchema.parse(body);
    return Response.json({ user: validated });
  } catch (error) {
    return Response.json(
      { error: 'Invalid input' },
      { status: 400 }
    );
  }
}
```

### 3. CORSの設定

必要に応じてCORSヘッダーを設定します。

```typescript
export function OPTIONS(request: Request) {
  return new Response(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
}

export function GET(request: Request) {
  return Response.json(
    { data: [] },
    {
      headers: {
        'Access-Control-Allow-Origin': '*',
      },
    }
  );
}
```

### 4. レート制限

APIエンドポイントにレート制限を実装します。

```typescript
const rateLimits = new Map<string, number>();

export function GET(request: Request) {
  const ip = request.headers.get('X-Forwarded-For') || 'unknown';
  const count = rateLimits.get(ip) || 0;

  if (count > 100) {
    return Response.json(
      { error: 'Too Many Requests' },
      { status: 429 }
    );
  }

  rateLimits.set(ip, count + 1);
  return Response.json({ data: [] });
}
```

## まとめ

Expo RouterのAPIルートは、以下の特徴があります：

1. **サーバーサイドエンドポイント**: `+api.ts`ファイルで作成
2. **HTTPメソッドサポート**: GET、POST、PUT、PATCH、DELETE、HEAD、OPTIONS
3. **セキュリティ**: サンドボックス環境とシークレット保護
4. **柔軟なデプロイ**: Bun、Express、Netlify、Vercelなど

**主な機能**：
- リクエストボディの読み取り
- クエリパラメータの解析
- カスタムレスポンスヘッダー
- 動的ルート
- エラーハンドリング

**デプロイオプション**：
- EAS（ネイティブ）
- Bun
- Express
- Netlify Functions
- Vercel Serverless Functions

**制限事項**：
- 動的インポート不可
- ESM未サポート
- バンドリングによる外部依存関係の制限

**ベストプラクティス**：
- エラーハンドリング
- 入力検証
- CORSの設定
- レート制限

これらの機能を活用して、Expo Routerで安全で柔軟なサーバーサイドAPIを構築できます。
