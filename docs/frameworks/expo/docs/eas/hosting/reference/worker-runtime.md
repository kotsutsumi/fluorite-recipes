# Worker ランタイム

EAS HostingのWorkerランタイム環境とNode.js互換性について説明します。

## 概要

EAS HostingはCloudflare Workersをベースに構築されており、V8 JavaScriptエンジンで実行されます。従来のNode.jsサーバーレスデプロイとはいくつかの重要な違いがあります。

## 主な特徴

### V8 Isolate

**特徴:**
- 小さなV8 Isolate（マイクロコンテナ）でリクエストを実行
- Node.js APIの互換性が制限される
- ブラウザやService WorkerのJavaScript環境に類似

### 高速起動

**利点:**
- コールドスタートが非常に高速
- ミリ秒単位の応答時間
- スケーラビリティの向上

### グローバルエッジネットワーク

**特徴:**
- 世界中のデータセンターで実行
- ユーザーに近い場所でコードが実行される
- レイテンシーの最小化

## Node.js互換性

EAS Hostingは、一部のNode.jsビルトインモジュールの互換性レイヤーを提供しますが、完全な互換性はありません。

### サポートされるグローバル

#### process.env

環境変数へのアクセス：

```typescript
export async function GET(request: Request) {
  const apiKey = process.env.SECRET_API_KEY;
  const environment = process.env.NODE_ENV;

  return Response.json({ environment });
}
```

**注意:**
- EAS Hosting環境変数で設定された値のみアクセス可能
- Node.jsの`process.env`と同じ動作

#### process.stdout と process.stderr

Console APIへのリダイレクト：

```typescript
process.stdout.write('This is a log message\n');
process.stderr.write('This is an error message\n');

// 以下と同等：
console.log('This is a log message');
console.error('This is an error message');
```

#### require（制限付き）

基本的な`require`サポート：

```typescript
// サポートされているモジュール
const buffer = require('buffer');
const events = require('events');

// サポートされていないモジュール
// const fs = require('fs');  // エラー
```

#### Buffer

基本的なBufferサポート：

```typescript
const buf = Buffer.from('Hello World');
console.log(buf.toString());  // 'Hello World'
```

#### EventEmitter

イベント処理の基本サポート：

```typescript
const { EventEmitter } = require('events');
const emitter = new EventEmitter();

emitter.on('event', (data) => {
  console.log('Event received:', data);
});

emitter.emit('event', 'test data');
```

### サポートされるNode.jsモジュール

以下の表は、利用可能なNode.jsモジュールとその実装状態を示します：

| モジュール | ステータス | 注意 |
|-----------|----------|------|
| `buffer` | ✅ 部分サポート | 基本的なBuffer操作のみ |
| `events` | ✅ 部分サポート | EventEmitter基本機能 |
| `util` | ✅ 部分サポート | 基本ユーティリティ |
| `stream` | ✅ 部分サポート | 簡略化されたStream API |
| `crypto` | ✅ 部分サポート | Web Crypto APIベース |
| `path` | ✅ 部分サポート | パス操作ユーティリティ |
| `url` | ✅ 部分サポート | URL解析とフォーマット |
| `querystring` | ✅ サポート | クエリ文字列の解析 |
| `fs` | ❌ 未サポート | ファイルシステムアクセスなし |
| `http` | ❌ 未サポート | Fetch APIを使用 |
| `https` | ❌ 未サポート | Fetch APIを使用 |
| `net` | ❌ 未サポート | ソケットアクセスなし |
| `child_process` | ❌ 未サポート | プロセス生成なし |

### 重要な制限事項

> **重要:** ここに記載されていないモジュールは利用できないか、サポートされていません。コードと依存関係は、これらのモジュールが提供されることに依存してはいけません。

## Web標準APIの使用

### Fetch API

HTTPリクエストには`fetch`を使用：

```typescript
export async function GET(request: Request) {
  const response = await fetch('https://api.example.com/data');
  const data = await response.json();

  return Response.json(data);
}
```

**利点:**
- Web標準
- Node.jsの`http`/`https`より簡潔
- Promiseベース

### Web Crypto API

暗号化操作には Web Crypto APIを使用：

```typescript
export async function POST(request: Request) {
  const body = await request.text();

  // ハッシュを生成
  const encoder = new TextEncoder();
  const data = encoder.encode(body);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);

  // 16進数文字列に変換
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');

  return Response.json({ hash: hashHex });
}
```

### Streams API

ストリーミング処理には Streams APIを使用：

```typescript
export async function GET(request: Request) {
  const stream = new ReadableStream({
    start(controller) {
      controller.enqueue('First chunk\n');
      controller.enqueue('Second chunk\n');
      controller.close();
    }
  });

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/plain',
      'Transfer-Encoding': 'chunked'
    }
  });
}
```

## ベストプラクティス

### 1. Web標準を優先

```typescript
// ❌ 避けるべき
const http = require('http');

// ✅ 推奨
const response = await fetch('https://api.example.com');
```

### 2. 依存関係の確認

```typescript
// package.jsonで依存関係を確認
// Node.js固有の機能を使用していないライブラリを選択
```

### 3. ポリフィルの使用

```typescript
// 必要に応じてポリフィルを使用
import { Buffer } from 'buffer';

// Bufferを使用する処理
```

### 4. 環境検出

```typescript
// ランタイム環境の検出
const isCloudflareWorker = typeof caches !== 'undefined';

if (isCloudflareWorker) {
  // Cloudflare Worker固有の処理
} else {
  // Node.js環境の処理
}
```

## 一般的な移行パターン

### ファイルシステムからKVストレージへ

```typescript
// ❌ Node.js (動作しない)
const fs = require('fs');
const data = fs.readFileSync('data.json');

// ✅ Cloudflare Workers
// KVストレージまたは外部データソースを使用
const response = await fetch('https://storage.example.com/data.json');
const data = await response.json();
```

### HTTP ServerからFetch Handlerへ

```typescript
// ❌ Node.js (動作しない)
const http = require('http');
const server = http.createServer((req, res) => {
  res.end('Hello World');
});

// ✅ Cloudflare Workers
export async function GET(request: Request) {
  return new Response('Hello World');
}
```

### プロセス環境変数

```typescript
// ✅ どちらでも動作
const apiKey = process.env.API_KEY;
```

## パフォーマンスの最適化

### 1. コールドスタートの最小化

```typescript
// グローバルスコープで初期化（Workers間で共有）
const config = {
  apiUrl: process.env.API_URL,
  timeout: 30000
};

export async function GET(request: Request) {
  // configを使用
}
```

### 2. 外部リクエストの最小化

```typescript
// 可能な限りリクエストを結合
const [userData, postsData] = await Promise.all([
  fetch('https://api.example.com/users'),
  fetch('https://api.example.com/posts')
]);
```

### 3. キャッシュの活用

```typescript
export async function GET(request: Request) {
  const cache = caches.default;
  let response = await cache.match(request);

  if (!response) {
    response = await fetch('https://api.example.com/data');
    await cache.put(request, response.clone());
  }

  return response;
}
```

## デバッグのヒント

### 1. ログ出力

```typescript
export async function GET(request: Request) {
  console.log('Request URL:', request.url);
  console.log('Request Method:', request.method);

  // 処理

  return Response.json({ success: true });
}
```

### 2. エラーハンドリング

```typescript
export async function GET(request: Request) {
  try {
    const data = await fetchData();
    return Response.json(data);
  } catch (error) {
    console.error('Error:', error);
    return Response.json(
      { error: error.message },
      { status: 500 }
    );
  }
}
```

### 3. ランタイム情報

```typescript
export async function GET(request: Request) {
  return Response.json({
    runtime: 'Cloudflare Workers',
    nodeVersion: process.version || 'N/A',
    platform: process.platform || 'unknown'
  });
}
```

## トラブルシューティング

### モジュールが見つからないエラー

```typescript
// Error: Cannot find module 'fs'
// 解決策: Web標準APIを使用するか、サポートされているモジュールに置き換える
```

### 非同期処理の問題

```typescript
// ✅ Promiseを正しく処理
export async function GET(request: Request) {
  const data = await fetchData();  // awaitを使用
  return Response.json(data);
}
```

## 次のステップ

- [キャッシング戦略の最適化](/frameworks/expo/docs/eas/hosting/reference/caching)
- [レスポンスとヘッダーの理解](/frameworks/expo/docs/eas/hosting/reference/responses-and-headers)
- [APIルートの実装](/frameworks/expo/docs/eas/hosting/api-routes)

## 関連リソース

- [Cloudflare Workers ドキュメント](https://developers.cloudflare.com/workers/)
- [Web標準API リファレンス](https://developer.mozilla.org/en-US/docs/Web/API)
