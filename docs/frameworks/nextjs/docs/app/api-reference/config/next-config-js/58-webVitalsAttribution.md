# webVitalsAttribution

> **警告**: この機能は現在実験的であり、変更される可能性があります。本番環境での使用は推奨されません。

Web Vitalsのパフォーマンス問題の原因を特定するのに役立ちます。

## 目的

Web Vitalsをデバッグする際、この機能により以下を特定できます：

- Cumulative Layout Shift (CLS)を引き起こす最初の要素
- Largest Contentful Paint (LCP)に対応する要素
- パフォーマンスメトリクスに寄与する特定のリソースの詳細

## 設定

```javascript filename="next.config.js"
module.exports = {
  experimental: {
    webVitalsAttribution: ['CLS', 'LCP'],
  },
}
```

TypeScriptの場合：

```typescript filename="next.config.ts"
import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  experimental: {
    webVitalsAttribution: ['CLS', 'LCP'],
  },
}

export default nextConfig
```

## 有効なアトリビューションメトリクス

`NextWebVitalsMetric`型から指定できるメトリクス：

- `'CLS'` - Cumulative Layout Shift
- `'FCP'` - First Contentful Paint
- `'FID'` - First Input Delay
- `'INP'` - Interaction to Next Paint
- `'LCP'` - Largest Contentful Paint
- `'TTFB'` - Time to First Byte

### すべてのメトリクスを有効にする

```javascript filename="next.config.js"
module.exports = {
  experimental: {
    webVitalsAttribution: ['CLS', 'FCP', 'FID', 'INP', 'LCP', 'TTFB'],
  },
}
```

## アトリビューション情報

アトリビューションを有効にすると、以下の詳細情報が提供されます：

### CLS (Cumulative Layout Shift)

- レイアウトシフトを引き起こす最初の要素
- 要素のセレクター
- シフトの値とタイミング

### LCP (Largest Contentful Paint)

- LCPの要素
- 要素のタイプ（画像、テキストなど）
- リソースの読み込み時間

### その他のメトリクス

- `PerformanceEventTiming`
- `PerformanceNavigationTiming`
- `PerformanceResourceTiming`

## 使用例

### 基本的な実装

```typescript filename="app/layout.tsx"
import { sendToAnalytics } from './analytics'

export function reportWebVitals(metric: NextWebVitalsMetric) {
  // コンソールにメトリクスを記録
  console.log(metric)

  // アナリティクスに送信
  sendToAnalytics(metric)
}
```

### アトリビューション情報の使用

```typescript filename="app/layout.tsx"
export function reportWebVitals(metric: NextWebVitalsMetric) {
  if (metric.name === 'CLS' && metric.attribution) {
    console.log('CLS caused by:', metric.attribution.largestShiftTarget)
    console.log('Shift value:', metric.attribution.largestShiftValue)
  }

  if (metric.name === 'LCP' && metric.attribution) {
    console.log('LCP element:', metric.attribution.element)
    console.log('Resource:', metric.attribution.url)
  }
}
```

### アナリティクスへの送信

```typescript filename="lib/analytics.ts"
export function sendToAnalytics(metric: NextWebVitalsMetric) {
  const body = JSON.stringify({
    name: metric.name,
    value: metric.value,
    attribution: metric.attribution,
  })

  const url = 'https://example.com/analytics'

  // `navigator.sendBeacon()`を使用して送信
  if (navigator.sendBeacon) {
    navigator.sendBeacon(url, body)
  } else {
    fetch(url, { body, method: 'POST', keepalive: true })
  }
}
```

## 型定義

```typescript
interface NextWebVitalsMetric {
  id: string
  name: 'CLS' | 'FCP' | 'FID' | 'INP' | 'LCP' | 'TTFB'
  value: number
  startTime: number
  attribution?: {
    // CLS固有
    largestShiftTarget?: string
    largestShiftValue?: number
    largestShiftTime?: number

    // LCP固有
    element?: string
    url?: string
    renderTime?: number
    loadTime?: number

    // その他の情報
    [key: string]: any
  }
}
```

## パフォーマンスへの影響

- アトリビューションはデフォルトで無効になっています
- メトリクスごとに有効にできます
- わずかなパフォーマンスオーバーヘッドがありますが、通常は無視できる程度です

## デバッグ例

### CLSの問題を特定

```typescript
export function reportWebVitals(metric: NextWebVitalsMetric) {
  if (metric.name === 'CLS' && metric.value > 0.1) {
    console.warn('High CLS detected!')
    console.log('Element causing shift:', metric.attribution?.largestShiftTarget)
    console.log('Shift value:', metric.attribution?.largestShiftValue)

    // 開発ツールで要素をハイライト
    const element = document.querySelector(metric.attribution?.largestShiftTarget || '')
    if (element) {
      element.style.outline = '2px solid red'
    }
  }
}
```

### LCPの最適化

```typescript
export function reportWebVitals(metric: NextWebVitalsMetric) {
  if (metric.name === 'LCP') {
    const loadTime = metric.attribution?.loadTime
    const renderTime = metric.attribution?.renderTime

    console.log('LCP element:', metric.attribution?.element)
    console.log('Load time:', loadTime)
    console.log('Render time:', renderTime)

    if (loadTime && loadTime > 2500) {
      console.warn('Slow LCP resource detected:', metric.attribution?.url)
    }
  }
}
```

## ベストプラクティス

1. **開発環境でのみ詳細ログを記録**
   ```typescript
   export function reportWebVitals(metric: NextWebVitalsMetric) {
     if (process.env.NODE_ENV === 'development') {
       console.log(metric)
     }
     sendToAnalytics(metric)
   }
   ```

2. **閾値を設定して警告を出す**
   ```typescript
   const THRESHOLDS = {
     CLS: 0.1,
     FCP: 1800,
     LCP: 2500,
     FID: 100,
     TTFB: 800,
   }

   export function reportWebVitals(metric: NextWebVitalsMetric) {
     const threshold = THRESHOLDS[metric.name]
     if (threshold && metric.value > threshold) {
       console.warn(`${metric.name} exceeded threshold:`, metric.value)
     }
   }
   ```

3. **サンプリングを使用してデータ量を削減**
   ```typescript
   export function reportWebVitals(metric: NextWebVitalsMetric) {
     // 10%のトラフィックのみをサンプリング
     if (Math.random() < 0.1) {
       sendToAnalytics(metric)
     }
   }
   ```

## フィードバック

この機能を試して、[GitHub](https://github.com/vercel/next.js/issues)でフィードバックを共有することをお勧めします。

## バージョン履歴

| バージョン | 変更内容 |
|-----------|---------|
| `v13.0.0` | `experimental.webVitalsAttribution`が導入されました |

## 関連項目

- [Web Vitals](/docs/app/building-your-application/optimizing/analytics#web-vitals)
- [パフォーマンス測定](/docs/app/building-your-application/optimizing/analytics)
- [Core Web Vitals (web.dev)](https://web.dev/vitals/)
