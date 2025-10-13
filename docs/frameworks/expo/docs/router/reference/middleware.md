# ミドルウェア

Expo Routerでサーバーミドルウェアを実装する方法を学びます。

## ミドルウェアとは

サーバーミドルウェアは、リクエストがルートに到達する前にコードを実行する機能です。認証、ロギング、リダイレクトなどのサーバーサイド機能を有効にします。

**実験的機能**: Expo SDK 54+で実験的に利用可能です。

**重要**: ミドルウェアは、実際のHTTPサーバーリクエストに対してのみ実行されます。

## セットアップ

### 1. app.jsonの設定

サーバー出力を有効にします。

```json
{
  "expo": {
    "web": {
      "output": "server"
    }
  }
}
```

### 2. ミドルウェアファイルの作成

アプリディレクトリに`+middleware.ts`ファイルを作成します。

**プロジェクト構造**：
```
app/
├── _layout.tsx
├── index.tsx
└── +middleware.ts
```

### 3. ミドルウェア関数の定義

```typescript
// app/+middleware.ts
export default function middleware(request: Request) {
  console.log(`Middleware executed for: ${request.url}`);
  // リクエストを続行させる（Responseを返さない）
}
```

## 基本的な使用方法

### リクエストのロギング

```typescript
// app/+middleware.ts
export default function middleware(request: Request) {
  const { method, url } = request;
  console.log(`[${new Date().toISOString()}] ${method} ${url}`);
}
```

### カスタムレスポンスの返却

```typescript
// app/+middleware.ts
export default function middleware(request: Request) {
  const url = new URL(request.url);

  // 特定のパスに対してカスタムレスポンスを返す
  if (url.pathname === '/maintenance') {
    return new Response('Site is under maintenance', {
      status: 503,
      headers: {
        'Content-Type': 'text/plain',
      },
    });
  }

  // リクエストを続行
}
```

### リダイレクト

```typescript
// app/+middleware.ts
export default function middleware(request: Request) {
  const url = new URL(request.url);

  // 古いパスを新しいパスにリダイレクト
  if (url.pathname === '/old-path') {
    return Response.redirect(new URL('/new-path', request.url), 301);
  }
}
```

## マッチャー設定

### unstable_settingsの使用

ミドルウェアの実行を制御するために、`unstable_settings`を使用できます。

```typescript
// app/+middleware.ts
export const unstable_settings = {
  matcher: {
    methods: ['GET', 'POST'],
    patterns: ['/api/*', '/admin/*'],
  },
};

export default function middleware(request: Request) {
  console.log('Middleware executed for matched routes');
}
```

### HTTPメソッドのフィルタリング

```typescript
export const unstable_settings = {
  matcher: {
    methods: ['GET'],
  },
};

export default function middleware(request: Request) {
  // GETリクエストのみ処理
}
```

### パスパターンのフィルタリング

```typescript
export const unstable_settings = {
  matcher: {
    patterns: ['/api/*', '/protected/*'],
  },
};

export default function middleware(request: Request) {
  // /api/*と/protected/*のリクエストのみ処理
}
```

### 複雑なパターン

**正確なパス**：
```typescript
patterns: ['/api/users']
```

**名前付きパラメータ**：
```typescript
patterns: ['/users/[id]']
```

**キャッチオールパラメータ**：
```typescript
patterns: ['/docs/[...path]']
```

**正規表現**：
```typescript
patterns: ['/api/(v1|v2)/.*']
```

## 一般的な使用例

### 1. 認証チェック

```typescript
// app/+middleware.ts
export const unstable_settings = {
  matcher: {
    patterns: ['/admin/*', '/dashboard/*'],
  },
};

export default function middleware(request: Request) {
  const authToken = request.headers.get('Authorization');

  if (!authToken) {
    return Response.redirect(new URL('/login', request.url), 302);
  }

  // トークンを検証（簡略化）
  if (!isValidToken(authToken)) {
    return new Response('Unauthorized', { status: 401 });
  }
}

function isValidToken(token: string): boolean {
  // トークン検証ロジック
  return token === 'Bearer valid-token';
}
```

### 2. リクエストロギング

```typescript
// app/+middleware.ts
export default function middleware(request: Request) {
  const { method, url, headers } = request;
  const userAgent = headers.get('User-Agent');

  console.log(JSON.stringify({
    timestamp: new Date().toISOString(),
    method,
    url,
    userAgent,
  }));
}
```

### 3. CORSヘッダーの管理

```typescript
// app/+middleware.ts
export const unstable_settings = {
  matcher: {
    patterns: ['/api/*'],
  },
};

export default function middleware(request: Request) {
  // OPTIONSリクエストに対してCORSヘッダーを返す
  if (request.method === 'OPTIONS') {
    return new Response(null, {
      status: 204,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      },
    });
  }
}
```

### 4. レート制限

```typescript
// app/+middleware.ts
const requestCounts = new Map<string, number>();

export const unstable_settings = {
  matcher: {
    patterns: ['/api/*'],
  },
};

export default function middleware(request: Request) {
  const ip = request.headers.get('X-Forwarded-For') || 'unknown';
  const count = requestCounts.get(ip) || 0;

  if (count > 100) {
    return new Response('Too Many Requests', { status: 429 });
  }

  requestCounts.set(ip, count + 1);

  // 1分後にカウントをリセット
  setTimeout(() => {
    requestCounts.delete(ip);
  }, 60000);
}
```

### 5. 動的リダイレクト

```typescript
// app/+middleware.ts
export default function middleware(request: Request) {
  const url = new URL(request.url);

  // 言語ベースのリダイレクト
  const acceptLanguage = request.headers.get('Accept-Language');
  if (acceptLanguage?.startsWith('ja') && url.pathname === '/') {
    return Response.redirect(new URL('/ja', request.url), 302);
  }

  // デバイスベースのリダイレクト
  const userAgent = request.headers.get('User-Agent');
  if (userAgent?.includes('Mobile') && url.pathname === '/') {
    return Response.redirect(new URL('/mobile', request.url), 302);
  }
}
```

## 制限事項

### 1. サーバーリクエストのみ

ミドルウェアは、HTTPサーバーリクエストに対してのみ実行されます。

**実行される**：
- Webブラウザからのリクエスト
- APIエンドポイントへのリクエスト

**実行されない**：
- クライアントサイドナビゲーション
- ネイティブアプリのナビゲーション

### 2. リクエストヘッダーの変更不可

現在、リクエストヘッダーを変更することはできません。

```typescript
// ❌ 動作しない
export default function middleware(request: Request) {
  request.headers.set('X-Custom-Header', 'value'); // エラー
}
```

### 3. リクエストボディの消費不可

リクエストボディを読み取ることはできません。

```typescript
// ❌ 動作しない
export default function middleware(request: Request) {
  const body = await request.json(); // エラー
}
```

### 4. ルートレベルのミドルウェアのみ

現在、ルートレベルのミドルウェアファイルのみがサポートされています。

**サポートされる**：
```
app/+middleware.ts
```

**サポートされない**：
```
app/admin/+middleware.ts
```

## ベストプラクティス

### 1. 軽量なミドルウェアを保つ

ミドルウェアは簡潔にし、パフォーマンスへの影響を最小限に抑えてください。

```typescript
// ✅ 推奨
export default function middleware(request: Request) {
  console.log(request.url);
}

// ❌ 非推奨
export default function middleware(request: Request) {
  // 重い処理
  for (let i = 0; i < 1000000; i++) {
    // ...
  }
}
```

### 2. マッチャーを使用してパフォーマンスを最適化

必要なルートにのみミドルウェアを適用してください。

```typescript
// ✅ 推奨
export const unstable_settings = {
  matcher: {
    patterns: ['/api/*'],
  },
};
```

### 3. シンプルなパスパターンを優先

複雑な正規表現よりも、シンプルなパスパターンを使用してください。

```typescript
// ✅ 推奨
patterns: ['/api/*', '/admin/*']

// ⚠️ 必要な場合のみ使用
patterns: ['/api/(v1|v2)/users/[0-9]+']
```

### 4. メソッドとパターンフィルタリングの組み合わせ

より正確な制御のために、メソッドとパターンを組み合わせてください。

```typescript
export const unstable_settings = {
  matcher: {
    methods: ['POST', 'PUT', 'DELETE'],
    patterns: ['/api/*'],
  },
};
```

## まとめ

Expo Routerのサーバーミドルウェアは、以下の特徴があります：

1. **サーバーサイド処理**: リクエスト前のコード実行
2. **柔軟な制御**: マッチャーによる実行制御
3. **認証とロギング**: 一般的な使用例をサポート
4. **実験的機能**: SDK 54+で利用可能

**主な機能**：
- リクエストロギング
- 認証チェック
- 動的リダイレクト
- CORSヘッダー管理
- レート制限

**制限事項**：
- サーバーリクエストのみ
- リクエストヘッダーの変更不可
- リクエストボディの消費不可
- ルートレベルのみ

**ベストプラクティス**：
- 軽量なミドルウェアを保つ
- マッチャーで最適化
- シンプルなパターンを優先
- メソッドとパターンを組み合わせ

これらの機能を活用して、柔軟なサーバーサイドリクエスト処理を実装できます。
