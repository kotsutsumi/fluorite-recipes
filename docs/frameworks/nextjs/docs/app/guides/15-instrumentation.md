# Instrumentation

Instrumentation は、監視とログツールをアプリケーションに統合するためのコードを使用するプロセスです。これにより、本番環境でのパフォーマンスを追跡し、問題をデバッグできます。

## 規約

Instrumentation を設定するには、プロジェクトの**ルートディレクトリ**（または `src` フォルダ内）に `instrumentation.ts|js` ファイルを作成します。新しい Next.js サーバーインスタンスが起動したときに**一度だけ**呼び出される `register` 関数をエクスポートします。

## 基本的な実装

### OpenTelemetry の例

```typescript
// instrumentation.ts
import { registerOTel } from '@vercel/otel'

export function register() {
  registerOTel('next-app')
}
```

### カスタムインストルメンテーション

```typescript
// instrumentation.ts
export async function register() {
  // ここに初期化コードを記述
  console.log('Instrumentation initialized')

  // 監視ツールのセットアップ
  if (process.env.NEXT_RUNTIME === 'nodejs') {
    // Node.js 環境での初期化
    await setupNodeMonitoring()
  }
}

async function setupNodeMonitoring() {
  // 監視ツールの初期化ロジック
}
```

## 重要なポイント

### ファイルの配置

- プロジェクトルートまたは `src` フォルダに配置
- `app` や `pages` ディレクトリ内には配置しない

```
my-app/
├── instrumentation.ts  ← ここ
├── app/
├── pages/
└── package.json

# または

my-app/
├── src/
│   ├── instrumentation.ts  ← ここ
│   └── app/
└── package.json
```

### ファイル拡張子の設定

`pageExtensions` 設定を使用している場合、ファイル名を更新する必要があります。

```javascript
// next.config.js
module.exports = {
  pageExtensions: ['ts', 'tsx', 'js', 'jsx'],
  // instrumentation.ts は自動的に認識される
}
```

## 副作用を持つファイルのインポート

副作用を持つパッケージをインポートする場合、`register` 関数内でインポートすることをお勧めします。

```typescript
// instrumentation.ts
export async function register() {
  // ✅ 良い例 - register 関数内でインポート
  await import('package-with-side-effect')
}

// ❌ 悪い例 - ファイルのトップレベルでインポート
// import 'package-with-side-effect'
```

この方法により、すべての副作用を一箇所に集約し、コード内での意図しない結果を避けることができます。

## ランタイム固有のコード

Next.js は複数のランタイム環境（Node.js と Edge）をサポートしています。ランタイムに応じて条件付きでコードをインポートできます。

```typescript
// instrumentation.ts
export async function register() {
  if (process.env.NEXT_RUNTIME === 'nodejs') {
    // Node.js 固有のインストルメンテーション
    await import('./instrumentation-node')
  }

  if (process.env.NEXT_RUNTIME === 'edge') {
    // Edge 固有のインストルメンテーション
    await import('./instrumentation-edge')
  }
}
```

### Node.js 固有のコード

```typescript
// instrumentation-node.ts
import { NodeSDK } from '@opentelemetry/sdk-node'
import { getNodeAutoInstrumentations } from '@opentelemetry/auto-instrumentations-node'

export function setupNodeInstrumentation() {
  const sdk = new NodeSDK({
    instrumentations: [getNodeAutoInstrumentations()],
  })

  sdk.start()
}
```

### Edge 固有のコード

```typescript
// instrumentation-edge.ts
export function setupEdgeInstrumentation() {
  // Edge ランタイム用の軽量な監視
  console.log('Edge runtime instrumentation initialized')
}
```

## 実用的な例

### 1. Sentry との統合

```typescript
// instrumentation.ts
import * as Sentry from '@sentry/nextjs'

export function register() {
  if (process.env.NEXT_RUNTIME === 'nodejs') {
    Sentry.init({
      dsn: process.env.SENTRY_DSN,
      tracesSampleRate: 1.0,
      environment: process.env.NODE_ENV,
    })
  }

  if (process.env.NEXT_RUNTIME === 'edge') {
    Sentry.init({
      dsn: process.env.SENTRY_DSN,
      tracesSampleRate: 1.0,
      environment: process.env.NODE_ENV,
    })
  }
}
```

### 2. DataDog との統合

```typescript
// instrumentation.ts
export async function register() {
  if (process.env.NEXT_RUNTIME === 'nodejs') {
    const tracer = await import('dd-trace')

    tracer.default.init({
      service: 'my-next-app',
      env: process.env.NODE_ENV,
    })
  }
}
```

### 3. カスタムメトリクスの収集

```typescript
// instrumentation.ts
export async function register() {
  if (process.env.NEXT_RUNTIME === 'nodejs') {
    const { setupMetrics } = await import('./lib/metrics')
    setupMetrics()
  }
}
```

```typescript
// lib/metrics.ts
import { Counter, Registry } from 'prom-client'

export function setupMetrics() {
  const register = new Registry()

  const requestCounter = new Counter({
    name: 'http_requests_total',
    help: 'Total number of HTTP requests',
    registers: [register],
  })

  // メトリクスのエクスポート設定
  console.log('Metrics initialized')
}
```

### 4. パフォーマンスモニタリング

```typescript
// instrumentation.ts
export async function register() {
  if (process.env.NEXT_RUNTIME === 'nodejs') {
    // パフォーマンスメトリクスの収集
    const { PerformanceObserver } = await import('perf_hooks')

    const obs = new PerformanceObserver((items) => {
      items.getEntries().forEach((entry) => {
        console.log(`${entry.name}: ${entry.duration}ms`)
      })
    })

    obs.observe({ entryTypes: ['measure', 'function'] })
  }
}
```

## ベストプラクティス

### 1. 環境変数の使用

設定を環境変数で管理します。

```typescript
// instrumentation.ts
export function register() {
  if (process.env.ENABLE_MONITORING === 'true') {
    // 監視ツールの初期化
  }
}
```

```bash
# .env.production
ENABLE_MONITORING=true
SENTRY_DSN=https://...
```

### 2. エラーハンドリング

初期化エラーを適切に処理します。

```typescript
// instrumentation.ts
export async function register() {
  try {
    if (process.env.NEXT_RUNTIME === 'nodejs') {
      await import('./instrumentation-node')
    }
  } catch (error) {
    console.error('Failed to initialize instrumentation:', error)
    // エラーが発生してもアプリケーションは起動する
  }
}
```

### 3. 開発環境での無効化

本番環境でのみ有効化します。

```typescript
// instrumentation.ts
export function register() {
  // 本番環境でのみ有効化
  if (process.env.NODE_ENV === 'production') {
    // 監視ツールの初期化
  }
}
```

### 4. 遅延読み込み

重いパッケージは必要になったときにのみ読み込みます。

```typescript
// instrumentation.ts
export async function register() {
  if (process.env.NEXT_RUNTIME === 'nodejs') {
    // 必要な時だけインポート
    const monitoring = await import('./lib/monitoring')
    monitoring.init()
  }
}
```

## 注意事項

### 1. 一度だけ実行される

`register` 関数は、サーバーインスタンスの起動時に一度だけ呼び出されます。

### 2. ビルド時には実行されない

ビルド時（`next build`）には実行されません。ランタイムでのみ実行されます。

### 3. サーバーサイドのみ

クライアントサイドのコードでは使用できません。

### 4. 同期的な初期化を避ける

可能な限り非同期でインポートと初期化を行います。

```typescript
// ✅ 良い例
export async function register() {
  await import('./monitoring')
}

// ❌ 悪い例
import './monitoring' // トップレベルの同期インポート

export function register() {
  // ...
}
```

## トラブルシューティング

### register 関数が呼び出されない

1. ファイル名を確認（`instrumentation.ts` または `instrumentation.js`）
2. プロジェクトルートまたは `src` フォルダに配置されているか確認
3. `next.config.js` で `experimental.instrumentationHook` が有効になっているか確認（Next.js 15 以降は不要）

### ランタイムエラーが発生する

1. `process.env.NEXT_RUNTIME` を確認
2. ランタイム固有のコードを分離
3. try-catch でエラーをキャッチ

## まとめ

Instrumentation を使用することで、以下が可能になります：

1. **パフォーマンス監視**: アプリケーションのパフォーマンスを追跡
2. **エラートラッキング**: 本番環境のエラーを捕捉
3. **メトリクス収集**: カスタムメトリクスの収集と分析
4. **ログ管理**: 統合されたログシステムのセットアップ

適切な Instrumentation により、本番環境での問題を迅速に特定し、解決できます。
