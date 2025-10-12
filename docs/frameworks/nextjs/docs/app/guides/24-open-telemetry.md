# OpenTelemetry

Next.js アプリケーションのパフォーマンスと動作を監視するための OpenTelemetry 統合ガイドです。

## 概要

OpenTelemetry は、アプリケーションの観測性（Observability）を向上させるためのオープンソースの計装フレームワークです。Next.js では、OpenTelemetry を使用してアプリケーションの動作を詳細に分析できます。

### OpenTelemetry とは

OpenTelemetry は、以下の 3 つの主要なシグナルを提供します：

1. **トレース（Traces）**: リクエストの処理フローを追跡
2. **メトリクス（Metrics）**: パフォーマンスと使用状況の測定
3. **ログ（Logs）**: アプリケーションイベントの記録

### Next.js での利点

- **自動計装**: Next.js のビルトイン計装により、手動設定を最小限に抑える
- **パフォーマンス分析**: ページレンダリング、データフェッチング、API レスポンスの詳細な分析
- **プロダクション監視**: 本番環境でのパフォーマンスとエラーの追跡
- **ベンダー中立**: 様々な監視プラットフォームと統合可能

## セットアップ

### ステップ 1: パッケージのインストール

```bash
npm install @vercel/otel @opentelemetry/sdk-logs @opentelemetry/api-logs @opentelemetry/instrumentation
```

または pnpm を使用する場合：

```bash
pnpm add @vercel/otel @opentelemetry/sdk-logs @opentelemetry/api-logs @opentelemetry/instrumentation
```

### ステップ 2: Instrumentation ファイルの作成

プロジェクトのルートディレクトリに `instrumentation.ts`（または `.js`）を作成します。

```typescript
// instrumentation.ts
import { registerOTel } from '@vercel/otel'

export function register() {
  registerOTel({
    serviceName: 'next-app',
  })
}
```

**注意**: `instrumentation.ts` ファイルは、`src` フォルダを使用している場合は `src` 内に配置します。

### ステップ 3: Next.js 設定の更新

`next.config.ts` で instrumentation を有効にします。

```typescript
// next.config.ts
import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  experimental: {
    instrumentationHook: true,
  },
}

export default nextConfig
```

## 基本的な使用方法

### カスタムスパンの追加

```typescript
// app/api/user/route.ts
import { trace } from '@opentelemetry/api'

export async function GET(request: Request) {
  const tracer = trace.getTracer('next-app')

  return tracer.startActiveSpan('fetch-user', async (span) => {
    try {
      const user = await fetchUser()

      // スパンに属性を追加
      span.setAttribute('user.id', user.id)
      span.setAttribute('user.email', user.email)

      return Response.json(user)
    } catch (error) {
      // エラーをスパンに記録
      span.recordException(error as Error)
      span.setStatus({ code: 2 }) // ERROR

      return Response.json({ error: 'Failed to fetch user' }, { status: 500 })
    } finally {
      span.end()
    }
  })
}

async function fetchUser() {
  // ユーザーデータを取得
  return { id: 1, email: 'user@example.com' }
}
```

### Server Components でのトレース

```typescript
// app/products/page.tsx
import { trace } from '@opentelemetry/api'

async function getProducts() {
  const tracer = trace.getTracer('next-app')

  return tracer.startActiveSpan('fetch-products', async (span) => {
    try {
      const response = await fetch('https://api.example.com/products', {
        next: { revalidate: 3600 },
      })

      const products = await response.json()

      // メトリクスを記録
      span.setAttribute('products.count', products.length)
      span.setAttribute('cache.hit', response.headers.get('x-cache') === 'HIT')

      return products
    } catch (error) {
      span.recordException(error as Error)
      span.setStatus({ code: 2 })
      throw error
    } finally {
      span.end()
    }
  })
}

export default async function ProductsPage() {
  const products = await getProducts()

  return (
    <div>
      <h1>商品一覧</h1>
      <ul>
        {products.map((product: any) => (
          <li key={product.id}>{product.name}</li>
        ))}
      </ul>
    </div>
  )
}
```

### Client Components でのトレース

```typescript
// app/components/SearchForm.tsx
'use client'

import { trace } from '@opentelemetry/api'
import { useState } from 'react'

export function SearchForm() {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState([])

  const handleSearch = async () => {
    const tracer = trace.getTracer('next-app')

    await tracer.startActiveSpan('client-search', async (span) => {
      try {
        span.setAttribute('search.query', query)
        span.setAttribute('search.length', query.length)

        const response = await fetch(`/api/search?q=${encodeURIComponent(query)}`)
        const data = await response.json()

        setResults(data)

        span.setAttribute('search.results', data.length)
      } catch (error) {
        span.recordException(error as Error)
        span.setStatus({ code: 2 })
      } finally {
        span.end()
      }
    })
  }

  return (
    <div>
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="検索..."
      />
      <button onClick={handleSearch}>検索</button>
    </div>
  )
}
```

## 高度な設定

### カスタム Exporter の設定

```typescript
// instrumentation.ts
import { NodeSDK } from '@opentelemetry/sdk-node'
import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-http'
import { Resource } from '@opentelemetry/resources'
import { SEMRESATTRS_SERVICE_NAME } from '@opentelemetry/semantic-conventions'

export function register() {
  const sdk = new NodeSDK({
    resource: new Resource({
      [SEMRESATTRS_SERVICE_NAME]: 'next-app',
    }),
    traceExporter: new OTLPTraceExporter({
      url: process.env.OTEL_EXPORTER_OTLP_ENDPOINT,
      headers: {
        'x-api-key': process.env.OTEL_API_KEY || '',
      },
    }),
  })

  sdk.start()
}
```

### 環境変数の設定

```bash
# .env.local

# OpenTelemetry エクスポーター設定
OTEL_EXPORTER_OTLP_ENDPOINT=https://api.honeycomb.io
OTEL_API_KEY=your-api-key

# 詳細ログを有効化（開発環境のみ）
NEXT_OTEL_VERBOSE=1

# サービス名
OTEL_SERVICE_NAME=next-app

# トレースのサンプリングレート（0.0 から 1.0）
OTEL_TRACES_SAMPLER=parentbased_traceidratio
OTEL_TRACES_SAMPLER_ARG=0.1
```

### サンプリング戦略

```typescript
// instrumentation.ts
import { NodeSDK } from '@opentelemetry/sdk-node'
import { TraceIdRatioBasedSampler } from '@opentelemetry/sdk-trace-node'

export function register() {
  const sdk = new NodeSDK({
    sampler: new TraceIdRatioBasedSampler(
      process.env.NODE_ENV === 'production' ? 0.1 : 1.0
    ),
  })

  sdk.start()
}
```

## 監視プラットフォームとの統合

### Vercel での使用

Vercel では、OpenTelemetry が自動的に設定されます。

```typescript
// instrumentation.ts
import { registerOTel } from '@vercel/otel'

export function register() {
  registerOTel({
    serviceName: 'next-app',
  })
}
```

Vercel Analytics と組み合わせることで、パフォーマンスの詳細な分析が可能です。

### Datadog との統合

```typescript
// instrumentation.ts
import { NodeSDK } from '@opentelemetry/sdk-node'
import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-http'

export function register() {
  const sdk = new NodeSDK({
    traceExporter: new OTLPTraceExporter({
      url: `https://http-intake.logs.datadoghq.com/api/v2/traces`,
      headers: {
        'DD-API-KEY': process.env.DD_API_KEY || '',
      },
    }),
  })

  sdk.start()
}
```

### Honeycomb との統合

```typescript
// instrumentation.ts
import { NodeSDK } from '@opentelemetry/sdk-node'
import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-http'

export function register() {
  const sdk = new NodeSDK({
    traceExporter: new OTLPTraceExporter({
      url: 'https://api.honeycomb.io/v1/traces',
      headers: {
        'x-honeycomb-team': process.env.HONEYCOMB_API_KEY || '',
      },
    }),
  })

  sdk.start()
}
```

### New Relic との統合

```typescript
// instrumentation.ts
import { NodeSDK } from '@opentelemetry/sdk-node'
import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-http'

export function register() {
  const sdk = new NodeSDK({
    traceExporter: new OTLPTraceExporter({
      url: 'https://otlp.nr-data.net:4318/v1/traces',
      headers: {
        'api-key': process.env.NEW_RELIC_LICENSE_KEY || '',
      },
    }),
  })

  sdk.start()
}
```

### Grafana / Tempo との統合

```typescript
// instrumentation.ts
import { NodeSDK } from '@opentelemetry/sdk-node'
import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-http'

export function register() {
  const sdk = new NodeSDK({
    traceExporter: new OTLPTraceExporter({
      url: process.env.TEMPO_ENDPOINT || 'http://localhost:4318/v1/traces',
    }),
  })

  sdk.start()
}
```

## メトリクスの収集

### カスタムメトリクスの作成

```typescript
// lib/metrics.ts
import { metrics } from '@opentelemetry/api'

const meter = metrics.getMeter('next-app')

// カウンター
export const pageViewCounter = meter.createCounter('page.views', {
  description: 'Number of page views',
})

// ヒストグラム
export const apiDurationHistogram = meter.createHistogram('api.duration', {
  description: 'API request duration',
  unit: 'ms',
})

// ゲージ
export const activeUsersGauge = meter.createObservableGauge('users.active', {
  description: 'Number of active users',
})
```

### メトリクスの記録

```typescript
// app/api/data/route.ts
import { apiDurationHistogram } from '@/lib/metrics'

export async function GET(request: Request) {
  const startTime = Date.now()

  try {
    const data = await fetchData()

    // API 処理時間を記録
    const duration = Date.now() - startTime
    apiDurationHistogram.record(duration, {
      endpoint: '/api/data',
      method: 'GET',
      status: 'success',
    })

    return Response.json(data)
  } catch (error) {
    const duration = Date.now() - startTime
    apiDurationHistogram.record(duration, {
      endpoint: '/api/data',
      method: 'GET',
      status: 'error',
    })

    return Response.json({ error: 'Failed to fetch data' }, { status: 500 })
  }
}

async function fetchData() {
  return { message: 'Hello, World!' }
}
```

### ページビューの追跡

```typescript
// app/components/Analytics.tsx
'use client'

import { pageViewCounter } from '@/lib/metrics'
import { usePathname } from 'next/navigation'
import { useEffect } from 'react'

export function Analytics() {
  const pathname = usePathname()

  useEffect(() => {
    pageViewCounter.add(1, {
      page: pathname,
      userAgent: navigator.userAgent,
    })
  }, [pathname])

  return null
}
```

```typescript
// app/layout.tsx
import { Analytics } from './components/Analytics'

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html>
      <body>
        <Analytics />
        {children}
      </body>
    </html>
  )
}
```

## ログの統合

### 構造化ログ

```typescript
// lib/logger.ts
import { logs } from '@opentelemetry/api-logs'

const logger = logs.getLogger('next-app')

export function logInfo(message: string, attributes?: Record<string, any>) {
  logger.emit({
    severityNumber: 9, // INFO
    severityText: 'INFO',
    body: message,
    attributes,
  })
}

export function logError(message: string, error?: Error, attributes?: Record<string, any>) {
  logger.emit({
    severityNumber: 17, // ERROR
    severityText: 'ERROR',
    body: message,
    attributes: {
      ...attributes,
      'error.type': error?.name,
      'error.message': error?.message,
      'error.stack': error?.stack,
    },
  })
}

export function logWarning(message: string, attributes?: Record<string, any>) {
  logger.emit({
    severityNumber: 13, // WARN
    severityText: 'WARN',
    body: message,
    attributes,
  })
}
```

### ログの使用例

```typescript
// app/api/process/route.ts
import { logInfo, logError } from '@/lib/logger'

export async function POST(request: Request) {
  try {
    const body = await request.json()

    logInfo('Processing request', {
      userId: body.userId,
      action: body.action,
    })

    const result = await processData(body)

    logInfo('Request processed successfully', {
      userId: body.userId,
      resultId: result.id,
    })

    return Response.json(result)
  } catch (error) {
    logError('Failed to process request', error as Error, {
      requestBody: await request.text(),
    })

    return Response.json({ error: 'Processing failed' }, { status: 500 })
  }
}

async function processData(data: any) {
  return { id: 1, status: 'processed' }
}
```

## パフォーマンス分析

### レンダリング時間の追跡

```typescript
// app/dashboard/page.tsx
import { trace } from '@opentelemetry/api'

async function getDashboardData() {
  const tracer = trace.getTracer('next-app')

  return tracer.startActiveSpan('fetch-dashboard-data', async (span) => {
    const startTime = Date.now()

    try {
      // 複数のデータソースから並列取得
      const [user, stats, notifications] = await Promise.all([
        fetchUser(),
        fetchStats(),
        fetchNotifications(),
      ])

      const duration = Date.now() - startTime

      span.setAttribute('fetch.duration', duration)
      span.setAttribute('fetch.user.id', user.id)
      span.setAttribute('fetch.stats.count', stats.length)
      span.setAttribute('fetch.notifications.count', notifications.length)

      return { user, stats, notifications }
    } finally {
      span.end()
    }
  })
}

export default async function DashboardPage() {
  const data = await getDashboardData()

  return (
    <div>
      <h1>ダッシュボード</h1>
      {/* ダッシュボードコンテンツ */}
    </div>
  )
}

async function fetchUser() {
  return { id: 1, name: 'User' }
}

async function fetchStats() {
  return []
}

async function fetchNotifications() {
  return []
}
```

### データベースクエリの追跡

```typescript
// lib/db.ts
import { trace } from '@opentelemetry/api'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function findUserById(id: number) {
  const tracer = trace.getTracer('next-app')

  return tracer.startActiveSpan('db-query-user', async (span) => {
    try {
      span.setAttribute('db.system', 'postgresql')
      span.setAttribute('db.operation', 'SELECT')
      span.setAttribute('db.table', 'User')
      span.setAttribute('db.query.id', id)

      const user = await prisma.user.findUnique({
        where: { id },
      })

      span.setAttribute('db.result.found', !!user)

      return user
    } finally {
      span.end()
    }
  })
}
```

## デバッグとトラブルシューティング

### 詳細ログの有効化

開発環境で詳細なトレース情報を確認：

```bash
# .env.local
NEXT_OTEL_VERBOSE=1
```

### コンソールエクスポーターの使用

開発環境でトレースをコンソールに出力：

```typescript
// instrumentation.ts
import { NodeSDK } from '@opentelemetry/sdk-node'
import { ConsoleSpanExporter } from '@opentelemetry/sdk-trace-node'

export function register() {
  if (process.env.NODE_ENV === 'development') {
    const sdk = new NodeSDK({
      traceExporter: new ConsoleSpanExporter(),
    })

    sdk.start()
  }
}
```

### スパンのデバッグ

```typescript
// app/api/debug/route.ts
import { trace, context } from '@opentelemetry/api'

export async function GET() {
  const tracer = trace.getTracer('next-app')

  return tracer.startActiveSpan('debug-span', async (span) => {
    // 現在のスパンコンテキストを取得
    const spanContext = span.spanContext()

    console.log('Trace ID:', spanContext.traceId)
    console.log('Span ID:', spanContext.spanId)

    // 子スパンを作成
    await tracer.startActiveSpan('child-span', async (childSpan) => {
      childSpan.setAttribute('child.attribute', 'value')
      childSpan.end()
    })

    span.end()

    return Response.json({
      traceId: spanContext.traceId,
      spanId: spanContext.spanId,
    })
  })
}
```

## ベストプラクティス

### 1. 適切なサンプリング

本番環境では、すべてのトレースを収集すると負荷が高くなります。

```typescript
// instrumentation.ts
const samplingRate = process.env.NODE_ENV === 'production' ? 0.1 : 1.0

const sdk = new NodeSDK({
  sampler: new TraceIdRatioBasedSampler(samplingRate),
})
```

### 2. 意味のある属性の追加

```typescript
span.setAttribute('user.id', userId)
span.setAttribute('request.method', 'GET')
span.setAttribute('response.status', 200)
span.setAttribute('cache.hit', true)
```

### 3. エラーの適切な記録

```typescript
try {
  // 処理
} catch (error) {
  span.recordException(error as Error)
  span.setStatus({
    code: 2, // ERROR
    message: error instanceof Error ? error.message : 'Unknown error',
  })
  throw error
} finally {
  span.end()
}
```

### 4. スパンの階層構造

```typescript
await tracer.startActiveSpan('parent-operation', async (parentSpan) => {
  // 親スパン内の処理

  await tracer.startActiveSpan('child-operation-1', async (childSpan1) => {
    // 子スパン 1 の処理
    childSpan1.end()
  })

  await tracer.startActiveSpan('child-operation-2', async (childSpan2) => {
    // 子スパン 2 の処理
    childSpan2.end()
  })

  parentSpan.end()
})
```

### 5. リソース属性の設定

```typescript
// instrumentation.ts
import { Resource } from '@opentelemetry/resources'
import { SEMRESATTRS_SERVICE_NAME, SEMRESATTRS_SERVICE_VERSION } from '@opentelemetry/semantic-conventions'

const sdk = new NodeSDK({
  resource: new Resource({
    [SEMRESATTRS_SERVICE_NAME]: 'next-app',
    [SEMRESATTRS_SERVICE_VERSION]: process.env.APP_VERSION || '1.0.0',
    'deployment.environment': process.env.NODE_ENV,
  }),
})
```

## まとめ

OpenTelemetry を Next.js に統合することで、以下が可能になります：

1. **パフォーマンス分析**: ページレンダリング、API レスポンス、データベースクエリの詳細な追跡
2. **エラー追跡**: エラーの発生箇所と原因の特定
3. **ユーザー体験の可視化**: ユーザーのジャーニーとパフォーマンスボトルネックの把握
4. **プロダクション監視**: 本番環境での問題の早期発見と対応
5. **ベンダー中立性**: 様々な監視プラットフォームとの統合

OpenTelemetry を活用して、Next.js アプリケーションの観測性を向上させましょう。
