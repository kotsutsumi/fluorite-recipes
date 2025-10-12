# useReportWebVitals

`useReportWebVitals` は、Core Web Vitals のパフォーマンスメトリクスをレポートおよび追跡するための Next.js フックです。

## 概要

- ページロード時のパフォーマンスメトリクスをレポートします
- アナリティクスサービスと併用できます
- 詳細なメトリック情報を提供します

## 使用方法

```javascript
'use client'

import { useReportWebVitals } from 'next/web-vitals'

export function WebVitals() {
  useReportWebVitals((metric) => {
    console.log(metric)
  })
}
```

## パラメータ

コールバック関数を受け取ります。このコールバック関数は、以下のプロパティを持つ `metric` オブジェクトを受け取ります：

### メトリックプロパティ

- `id`: 現在のページロードの一意の識別子
- `name`: パフォーマンスメトリクス名
- `delta`: メトリック値の変化
- `value`: 実際のパフォーマンス測定値
- `rating`: パフォーマンス品質 (`"good"`, `"needs-improvement"`, `"poor"`)

## 追跡される Web Vitals

以下のメトリクスが追跡されます：

### コア Web Vitals

- **LCP (Largest Contentful Paint)**: 最大のコンテンツの描画時間
- **FID (First Input Delay)**: 初回入力遅延（非推奨、INP に置き換えられました）
- **CLS (Cumulative Layout Shift)**: 累積レイアウトシフト
- **INP (Interaction to Next Paint)**: 次の描画までのインタラクション時間

### その他のメトリクス

- **TTFB (Time to First Byte)**: 最初のバイトまでの時間
- **FCP (First Contentful Paint)**: 最初のコンテンツの描画時間

## 実装例

### 基本的な使用例

```javascript
'use client'

import { useReportWebVitals } from 'next/web-vitals'

export function WebVitals() {
  useReportWebVitals((metric) => {
    console.log(metric)
  })

  return null
}
```

### アナリティクスへの送信

```javascript
'use client'

import { useReportWebVitals } from 'next/web-vitals'

export function WebVitals() {
  useReportWebVitals((metric) => {
    // Google Analytics へ送信
    window.gtag('event', metric.name, {
      value: Math.round(metric.name === 'CLS' ? metric.delta * 1000 : metric.delta),
      event_label: metric.id,
      non_interaction: true,
    })
  })

  return null
}
```

### Vercel Analytics への送信

```javascript
'use client'

import { useReportWebVitals } from 'next/web-vitals'

export function WebVitals() {
  useReportWebVitals((metric) => {
    const body = JSON.stringify(metric)
    const url = 'https://vitals.vercel-analytics.com/v1/vitals'

    if (navigator.sendBeacon) {
      navigator.sendBeacon(url, body)
    } else {
      fetch(url, { body, method: 'POST', keepalive: true })
    }
  })

  return null
}
```

## レイアウトでの使用

ルートレイアウトで使用して、すべてのページでメトリクスを追跡できます：

```javascript
// app/layout.js
import { WebVitals } from './components/web-vitals'

export default function Layout({ children }) {
  return (
    <html>
      <body>
        <WebVitals />
        {children}
      </body>
    </html>
  )
}
```

## ベストプラクティス

1. **専用コンポーネントを使用**: Web Vitals 追跡用に別のクライアントコンポーネントを作成します
2. **外部アナリティクスに送信**: メトリクスを外部アナリティクスシステムに送信できます
3. **パフォーマンスモニタリング**: 継続的なパフォーマンス監視を実装します
4. **レーティングの活用**: `rating` プロパティを使用して、パフォーマンスの品質を判断します

## メトリックの解釈

### レーティングの基準

- **"good"**: 優れたパフォーマンス
- **"needs-improvement"**: 改善が必要
- **"poor"**: パフォーマンスが低い

### 推奨値

- **LCP**: 2.5秒以下が「良好」
- **FID**: 100ミリ秒以下が「良好」
- **CLS**: 0.1以下が「良好」
- **INP**: 200ミリ秒以下が「良好」

## TypeScript での使用

```typescript
'use client'

import { useReportWebVitals } from 'next/web-vitals'
import type { Metric } from 'web-vitals'

export function WebVitals() {
  useReportWebVitals((metric: Metric) => {
    console.log(metric.name, metric.value)
  })

  return null
}
```

## 注意事項

> **Good to know**: このフックは Client Components でのみ使用できます。`'use client'` ディレクティブが必要です。

## 関連リソース

- [Web Vitals について詳しく学ぶ](https://web.dev/vitals/)
- [Chrome User Experience Report](https://developers.google.com/web/tools/chrome-user-experience-report)
- [Next.js パフォーマンス最適化](https://nextjs.org/docs/app/building-your-application/optimizing)

## バージョン履歴

| バージョン | 変更内容 |
|---------|---------|
| `v13.0.0` | `useReportWebVitals` が導入されました |
