# instrumentation.js

`instrumentation.js|ts`ファイルは、監視とロギングのツールをアプリケーションに統合するために使用されます。これにより、アプリケーションのパフォーマンスと動作を追跡し、本番環境での問題をデバッグできます。

## 機能

`instrumentation`ファイルを使用するには、プロジェクトの**ルート**、または[`src`フォルダ](/docs/frameworks/nextjs/docs/app/building-your-application/configuring/src-directory)を使用している場合はその内部に配置します。

次に、2つのオプションの関数をエクスポートします：

### `register()`

ファイルから`register`関数をエクスポートして、新しいNext.jsサーバーインスタンスが起動されたときにコードを実行します。

```typescript
// instrumentation.ts
import { registerOTel } from '@vercel/otel'

export function register() {
  registerOTel('next-app')
}
```

> **Good to know:**
>
> - この関数はオプションです
> - `register`関数は、新しいNext.jsサーバーインスタンスが起動されたときに**1回だけ**呼び出されます
> - `async`関数にすることができます

### `onRequestError()`

サーバーエラーを追跡するために、`onRequestError`関数をエクスポートできます。

```typescript
// instrumentation.ts
import { type Instrumentation } from 'next'

export const onRequestError: Instrumentation.onRequestError = async (
  err,
  request,
  context
) => {
  await fetch('https://...', {
    method: 'POST',
    body: JSON.stringify({
      message: err.message,
      request,
      context,
    }),
    headers: {
      'Content-Type': 'application/json',
    },
  })
}
```

#### パラメータ

この関数は3つのパラメータを受け取ります：`error`、`request`、`context`。

```typescript
export function onRequestError(
  error: { digest: string } & Error,
  request: {
    path: string // リソースパス、例：/blog?name=foo
    method: string // リクエストメソッド、例：GET、POST、など
    headers: { [key: string]: string }
  },
  context: {
    routerKind: 'Pages Router' | 'App Router' // ルーターの種類
    routePath: string // ルートファイルのパス、例：/app/blog/[dynamic]
    routeType: 'render' | 'route' | 'action' | 'middleware' // Next.jsがリクエストを処理するコンテキスト
    renderSource:
      | 'react-server-components'
      | 'react-server-components-payload'
      | 'server-rendering'
    revalidateReason: 'on-demand' | 'stale' | undefined // undefinedは初回リクエストを意味します
    renderType: 'dynamic' | 'dynamic-resume' // 動的レンダリングか部分事前レンダリング（PPR）の動的部分か
  }
): void | Promise<void>
```

- `error`: キャッチされたエラーそのもの（常に`digest`プロパティを持つError）、およびエラーに関する追加情報
- `request`: エラーに関連付けられたリクエストに関する読み取り専用情報
- `context`: エラーが発生したコンテキスト。これはルーターの種類（App RouterまたはPages Router）と、サーバーコンポーネント（`'render'`）、ルートハンドラー（`'route'`）、サーバーアクション（`'action'`）、ミドルウェア（`'middleware'`）のいずれであるかを示します

### ランタイム固有のコード

`instrumentation`ファイルは、すべての環境で動作するグローバルコードを記述するためのものですが、`process.env.NEXT_RUNTIME`を使用してランタイム固有のコードをターゲットにすることができます。

```typescript
// instrumentation.ts
export async function register() {
  if (process.env.NEXT_RUNTIME === 'nodejs') {
    // Node.js固有のコード
    await import('./instrumentation-node')
  }

  if (process.env.NEXT_RUNTIME === 'edge') {
    // Edge Runtime固有のコード
    await import('./instrumentation-edge')
  }
}
```

## 例

### 副作用のあるファイルのインポート

場合によっては、副作用のためにコード内でファイルをインポートすると便利なことがあります。例えば、グローバル変数のセットを定義するファイルをインポートしても、コード内でインポートされたファイルを明示的に使用することはないかもしれません。それでも、パッケージが宣言したグローバル変数にアクセスできます。

`instrumentation.js`内の`register`関数で、JavaScriptの`import`構文を使用してファイルをインポートすることをお勧めします。次の例は、`register`関数での`import`の基本的な使用法を示しています：

```typescript
// instrumentation.ts
export async function register() {
  await import('package-with-side-effect')
}
```

> **Good to know:**
>
> ファイルの先頭からではなく、`register`関数内からファイルをインポートすることをお勧めします。こうすることで、すべての副作用をコード内の1か所に集約でき、ファイルの先頭でのグローバルインポートによる意図しない結果を避けることができます。

### OpenTelemetryのインポート

Next.jsアプリケーションで[OpenTelemetry](/docs/frameworks/nextjs/docs/app/building-your-application/optimizing/instrumentation)を使用する場合、`instrumentation.js`ファイルを使用してOpenTelemetryをインポートおよび設定できます：

```typescript
// instrumentation.ts
export async function register() {
  if (process.env.NEXT_RUNTIME === 'nodejs') {
    const { registerOTel } = await import('@vercel/otel')
    registerOTel({ serviceName: 'next-app' })
  }
}
```

### カスタムロギングの設定

```typescript
// instrumentation.ts
import * as Sentry from '@sentry/nextjs'

export function register() {
  if (process.env.NEXT_RUNTIME === 'nodejs') {
    Sentry.init({
      dsn: process.env.SENTRY_DSN,
      tracesSampleRate: 1.0,
    })
  }

  if (process.env.NEXT_RUNTIME === 'edge') {
    Sentry.init({
      dsn: process.env.SENTRY_DSN,
      tracesSampleRate: 1.0,
    })
  }
}

export const onRequestError = Sentry.captureRequestError
```

## バージョン履歴

| バージョン | 変更内容 |
|-----------|----------|
| `v15.0.0` | `onRequestError`が導入され、`instrumentation`が安定版になりました |
| `v14.0.4` | `instrumentation`のTurbopack対応 |
| `v13.2.0` | `instrumentation`が実験的機能として導入されました |

## 使用例

### パフォーマンスモニタリング

```typescript
// instrumentation.ts
export function register() {
  // カスタムメトリクスの収集
  if (typeof window !== 'undefined') {
    window.addEventListener('load', () => {
      const perfData = window.performance.timing
      const pageLoadTime = perfData.loadEventEnd - perfData.navigationStart
      console.log(`Page load time: ${pageLoadTime}ms`)
    })
  }
}
```

### エラートラッキング

```typescript
// instrumentation.ts
export const onRequestError = async (err, request, context) => {
  // エラーをカスタムログサービスに送信
  await fetch('https://your-logging-service.com/log', {
    method: 'POST',
    body: JSON.stringify({
      error: {
        message: err.message,
        digest: err.digest,
        stack: err.stack,
      },
      request: {
        path: request.path,
        method: request.method,
      },
      context: {
        routerKind: context.routerKind,
        routePath: context.routePath,
      },
      timestamp: new Date().toISOString(),
    }),
    headers: {
      'Content-Type': 'application/json',
    },
  })
}
```

## ベストプラクティス

1. **軽量な初期化**: `register`関数は軽量に保ち、起動時間を最小限に抑えます
2. **非同期処理**: 重い初期化処理は非同期で実行します
3. **エラーハンドリング**: `onRequestError`で適切なエラーハンドリングを実装します
4. **環境分離**: 開発環境と本番環境で異なる設定を使用します
5. **セキュリティ**: 機密情報を環境変数で管理します

## 関連機能

- [OpenTelemetry](/docs/frameworks/nextjs/docs/app/building-your-application/optimizing/instrumentation)
- [エラーハンドリング](/docs/frameworks/nextjs/docs/app/building-your-application/routing/error-handling)
- [環境変数](/docs/frameworks/nextjs/docs/app/building-your-application/configuring/environment-variables)
