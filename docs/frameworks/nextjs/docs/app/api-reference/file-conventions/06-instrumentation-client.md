# instrumentation-client.js

`instrumentation-client.js|ts`ファイルは、Next.jsアプリケーションがインタラクティブになる前に、クライアント側のモニタリング、分析、副作用を追加するために使用されます。

## 機能

`instrumentation-client`ファイルを使用するには、プロジェクトの**ルート**、または[`src`フォルダ](/docs/frameworks/nextjs/docs/app/building-your-application/configuring/src-directory)を使用している場合はその内部に配置します。

このファイルは、HTMLドキュメントがロードされた後、Reactのハイドレーション前、ユーザーインタラクションが可能になる前に実行されます。

## 特徴

- 特定のエクスポート要件はありません
- HTMLドキュメントのロード後に実行されます
- Reactのハイドレーション前に実行されます
- ユーザーインタラクションが可能になる前に実行されます

## 主な使用ケース

### 1. パフォーマンスモニタリング

アプリケーションの初期化時のパフォーマンスを追跡します。

```typescript
// instrumentation-client.ts
performance.mark('app-init')

export function onRouterTransitionStart(
  url: string,
  navigationType: 'push' | 'replace' | 'traverse'
) {
  console.log(`ナビゲーション開始: ${navigationType} to ${url}`)
  performance.mark(`navigation-start-${url}`)
}

export function onRouterTransitionEnd(url: string) {
  console.log(`ナビゲーション完了: ${url}`)
  performance.mark(`navigation-end-${url}`)

  // パフォーマンスメトリクスを計算
  const startMark = `navigation-start-${url}`
  const endMark = `navigation-end-${url}`

  if (performance.getEntriesByName(startMark).length > 0) {
    performance.measure(`navigation-${url}`, startMark, endMark)
  }
}
```

### 2. エラートラッキング

クライアント側のエラーをモニタリングサービスに送信します。

```typescript
// instrumentation-client.ts
import Monitor from './lib/monitoring'

// モニタリングサービスを初期化
Monitor.initialize()

export function onRouterTransitionStart(url: string) {
  Monitor.pushEvent({
    message: `${url}へのナビゲーション`,
    category: 'navigation',
  })
}

export function onRouterTransitionError(
  url: string,
  error: Error
) {
  Monitor.pushError({
    message: `${url}へのナビゲーション中にエラー: ${error.message}`,
    category: 'navigation-error',
    error,
  })
}
```

### 3. 分析の初期化

分析ツールを早期に初期化します。

```typescript
// instrumentation-client.ts
import analytics from './lib/analytics'

// 分析を初期化
analytics.init({
  trackingId: process.env.NEXT_PUBLIC_GA_ID,
  debug: process.env.NODE_ENV === 'development',
})

export function onRouterTransitionEnd(url: string) {
  // ページビューを追跡
  analytics.pageview(url)
}
```

### 4. ポリフィルのロード

必要なポリフィルを早期にロードします。

```typescript
// instrumentation-client.ts
// 古いブラウザのためのポリフィルをロード
if (!('IntersectionObserver' in window)) {
  import('intersection-observer')
}

if (!('ResizeObserver' in window)) {
  import('@juggle/resize-observer')
}
```

## ルーターイベントフック

`instrumentation-client.js`では、ルーターイベントに反応するための関数をエクスポートできます：

### `onRouterTransitionStart`

ルート遷移が開始されたときに呼び出されます。

```typescript
export function onRouterTransitionStart(
  url: string,
  navigationType: 'push' | 'replace' | 'traverse'
) {
  console.log(`${url}への${navigationType}ナビゲーション開始`)
}
```

### `onRouterTransitionEnd`

ルート遷移が完了したときに呼び出されます。

```typescript
export function onRouterTransitionEnd(url: string) {
  console.log(`${url}へのナビゲーション完了`)
}
```

### `onRouterTransitionError`

ルート遷移中にエラーが発生したときに呼び出されます。

```typescript
export function onRouterTransitionError(
  url: string,
  error: Error
) {
  console.error(`${url}へのナビゲーション中にエラー:`, error)
}
```

## パフォーマンスの考慮事項

`instrumentation-client.js`ファイルは、アプリケーションのインタラクティブになるタイミングに直接影響を与える可能性があるため、軽量に保つことが重要です。

### 推奨事項

1. **軽量なコード**: 初期化コードは最小限に保ちます
2. **非同期ロード**: 重い依存関係は動的にインポートします
3. **パフォーマンス監視**: Next.jsは初期化に16ms以上かかる場合、警告をログに記録します

### 警告の例

```
Warning: instrumentation-client took longer than 16ms to initialize.
This may delay your app from becoming interactive.
```

## 実装例

### 包括的なモニタリング設定

```typescript
// instrumentation-client.ts
import analytics from './lib/analytics'
import errorTracking from './lib/error-tracking'

// 初期化
const startTime = performance.now()

// 分析を初期化
analytics.init({
  trackingId: process.env.NEXT_PUBLIC_GA_ID,
})

// エラートラッキングを初期化
errorTracking.init({
  dsn: process.env.NEXT_PUBLIC_ERROR_TRACKING_DSN,
})

// グローバルエラーハンドラー
window.addEventListener('error', (event) => {
  errorTracking.captureException(event.error)
})

window.addEventListener('unhandledrejection', (event) => {
  errorTracking.captureException(event.reason)
})

// ルーターイベント
export function onRouterTransitionStart(
  url: string,
  navigationType: 'push' | 'replace' | 'traverse'
) {
  analytics.trackEvent('navigation_start', {
    url,
    navigationType,
  })
}

export function onRouterTransitionEnd(url: string) {
  analytics.pageview(url)
}

export function onRouterTransitionError(url: string, error: Error) {
  errorTracking.captureException(error, {
    tags: {
      type: 'navigation_error',
      url,
    },
  })
}

// 初期化時間をログ
const initTime = performance.now() - startTime
if (initTime > 16) {
  console.warn(`Instrumentation took ${initTime.toFixed(2)}ms`)
}
```

## バージョン履歴

| バージョン | 変更内容 |
|-----------|----------|
| `v15.3.0` | `instrumentation-client.js`が導入されました |

## ベストプラクティス

1. **初期化時間を最小化**: 16ms以下を目指します
2. **必要最小限のコード**: 本当に必要な初期化だけを含めます
3. **遅延ロード**: 重い処理は後で実行します
4. **エラーハンドリング**: 初期化エラーを適切に処理します
5. **パフォーマンス測定**: 初期化時間を監視します

## 関連機能

- [instrumentation.js](/docs/frameworks/nextjs/docs/app/api-reference/file-conventions/instrumentation)
- [Next.js Analytics](/docs/frameworks/nextjs/docs/app/building-your-application/optimizing/analytics)
- [パフォーマンスモニタリング](/docs/frameworks/nextjs/docs/app/building-your-application/optimizing/instrumentation)

## 注意事項

1. **クライアント専用**: このファイルはクライアント側でのみ実行されます
2. **早期実行**: Reactのハイドレーション前に実行されるため、DOMの状態に注意してください
3. **パフォーマンス**: 初期化が遅いとアプリケーションのインタラクティブ性が遅れます
4. **エラー処理**: 初期化エラーはアプリケーション全体に影響する可能性があります
