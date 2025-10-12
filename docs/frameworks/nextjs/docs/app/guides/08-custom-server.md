# カスタムサーバー

Next.js では、カスタムサーバーを使用してプログラムでサーバーを起動し、カスタムパターンを実装できます。ただし、この機能は Next.js の統合ルーターがアプリケーションの要件を満たせない場合にのみ使用すべきです。

## 重要な警告

> **カスタムサーバーを使用する前に、Next.js の統合ルーターがアプリケーションの要件を満たせない場合にのみ使用すべきであることを念頭に置いてください。**

カスタムサーバーを使用すると、**自動静的最適化** などの重要なパフォーマンス最適化が削除されます。

## 基本的な実装

### サーバーファイルの作成

`server.ts` または `server.js` を作成：

```typescript
import { createServer } from 'http'
import { parse } from 'url'
import next from 'next'

const port = parseInt(process.env.PORT || '3000', 10)
const dev = process.env.NODE_ENV !== 'production'
const app = next({ dev })
const handle = app.getRequestHandler()

app.prepare().then(() => {
  createServer((req, res) => {
    const parsedUrl = parse(req.url!, true)
    handle(req, res, parsedUrl)
  }).listen(port)

  console.log(
    `> Server listening at http://localhost:${port} as ${
      dev ? 'development' : process.env.NODE_ENV
    }`
  )
})
```

### TypeScript の設定

TypeScript を使用する場合、`tsconfig.server.json` を作成：

```json
{
  "extends": "./tsconfig.json",
  "compilerOptions": {
    "module": "commonjs",
    "outDir": "dist",
    "lib": ["es2019"],
    "target": "es2019",
    "isolatedModules": false,
    "noEmit": false
  },
  "include": ["server.ts"]
}
```

### パッケージスクリプトの設定

`package.json` を更新：

```json
{
  "scripts": {
    "dev": "node server.js",
    "build": "next build",
    "start": "NODE_ENV=production node server.js"
  }
}
```

TypeScript の場合：

```json
{
  "scripts": {
    "dev": "ts-node --project tsconfig.server.json server.ts",
    "build": "next build && tsc --project tsconfig.server.json",
    "start": "NODE_ENV=production node dist/server.js"
  }
}
```

## 設定オプション

`next()` 関数は、以下のオプションを持つオブジェクトを受け取ります：

| オプション | 型 | 説明 |
|-----------|------|------|
| `conf` | `Object` | Next.js の設定オブジェクト（デフォルト: `{}`） |
| `dev` | `Boolean` | 開発モードの有効化（デフォルト: `false`） |
| `dir` | `String` | Next.js プロジェクトの場所（デフォルト: `'.'`） |
| `quiet` | `Boolean` | エラーメッセージを非表示（デフォルト: `false`） |
| `hostname` | `String` | サーバーが動作するホスト名 |
| `port` | `Number` | サーバーが動作するポート番号 |
| `httpServer` | `node:http#Server` | カスタム HTTP サーバー |
| `turbo` | `Boolean` | Turbopack の有効化 |
| `turbopack` | `Boolean` | Turbopack の有効化（エイリアス） |

## カスタムルーティングの例

### 単一ルートのカスタマイズ

```typescript
app.prepare().then(() => {
  createServer((req, res) => {
    const parsedUrl = parse(req.url!, true)
    const { pathname, query } = parsedUrl

    if (pathname === '/a') {
      app.render(req, res, '/b', query)
    } else if (pathname === '/b') {
      app.render(req, res, '/a', query)
    } else {
      handle(req, res, parsedUrl)
    }
  }).listen(port)
})
```

### 複数ルートのパターンマッチング

```typescript
import { match } from 'path-to-regexp'

app.prepare().then(() => {
  createServer((req, res) => {
    const parsedUrl = parse(req.url!, true)
    const { pathname } = parsedUrl

    // /post/:id パターンのマッチング
    const postMatch = match('/post/:id', { decode: decodeURIComponent })
    const matched = postMatch(pathname)

    if (matched) {
      app.render(req, res, '/post', {
        ...parsedUrl.query,
        id: matched.params.id,
      })
    } else {
      handle(req, res, parsedUrl)
    }
  }).listen(port)
})
```

## Express との統合

Express と組み合わせて使用する例：

```typescript
import express from 'express'
import next from 'next'

const dev = process.env.NODE_ENV !== 'production'
const app = next({ dev })
const handle = app.getRequestHandler()
const port = 3000

app.prepare().then(() => {
  const server = express()

  // カスタム Express ルート
  server.get('/custom-route', (req, res) => {
    return res.json({ message: 'Custom route' })
  })

  // すべての Next.js ルートを処理
  server.all('*', (req, res) => {
    return handle(req, res)
  })

  server.listen(port, () => {
    console.log(`> Ready on http://localhost:${port}`)
  })
})
```

## 重要な制限事項

### 1. Standalone 出力モードと非互換

カスタムサーバーは `output: 'standalone'` と併用できません：

```javascript
// next.config.js - カスタムサーバーでは使用不可
module.exports = {
  output: 'standalone', // ❌ カスタムサーバーと非互換
}
```

### 2. パフォーマンス最適化の削除

カスタムサーバーを使用すると、以下が無効化されます：

- **自動静的最適化**: 静的ページの事前レンダリング
- **自動静的エクスポート**: 静的ファイルの生成
- **最適化されたコード分割**: バンドルサイズの最適化

### 3. サーバーレス環境で使用不可

カスタムサーバーは以下の環境では使用できません：

- Vercel のサーバーレス関数
- AWS Lambda
- その他のサーバーレスプラットフォーム

## ベストプラクティス

### 1. 本当に必要か検討する

カスタムサーバーを使用する前に、以下の代替手段を検討してください：

- **Middleware**: ルーティングとリクエスト処理
- **Rewrites**: URL の書き換え
- **Redirects**: リダイレクト
- **Headers**: カスタムヘッダーの設定
- **API Routes**: バックエンド機能

### 2. 最小限の変更にとどめる

カスタムサーバーでは、Next.js のデフォルトハンドラーを可能な限り使用してください：

```typescript
// ✅ 良い例
if (customCondition) {
  // カスタムロジック
} else {
  handle(req, res, parsedUrl) // Next.js に委譲
}

// ❌ 悪い例
// すべてのルーティングを手動で実装
```

### 3. エラーハンドリング

適切なエラーハンドリングを実装してください：

```typescript
app.prepare().then(() => {
  createServer((req, res) => {
    try {
      const parsedUrl = parse(req.url!, true)
      handle(req, res, parsedUrl)
    } catch (err) {
      console.error('Error occurred handling', req.url, err)
      res.statusCode = 500
      res.end('Internal Server Error')
    }
  }).listen(port)
}).catch((err) => {
  console.error('Error starting server:', err)
  process.exit(1)
})
```

## 使用例

カスタムサーバーが適している場合の例：

1. **レガシーシステムとの統合**: 既存の Express アプリケーションに Next.js を統合
2. **カスタム認証**: 複雑な認証フローの実装
3. **プロトコルレベルのカスタマイズ**: WebSocket サーバーとの統合
4. **複雑なプロキシ**: 高度なリバースプロキシの設定

## まとめ

カスタムサーバーは強力な機能ですが、慎重に使用する必要があります。Next.js の統合機能（Middleware、Rewrites、API Routes など）で要件を満たせるかを十分に検討してから、カスタムサーバーの使用を決定してください。

カスタムサーバーを使用する場合は、パフォーマンスへの影響を理解し、適切なエラーハンドリングとテストを実装することが重要です。
