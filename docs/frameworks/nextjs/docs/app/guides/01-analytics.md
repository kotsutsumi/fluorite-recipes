# アナリティクス

Next.jsアプリケーションにおけるアナリティクスの実装について説明します。

## 概要

Next.jsは、アプリケーションにアナリティクスを実装するための複数の方法を提供しています。

## 1. 組み込みのWeb Vitals追跡

Next.jsは重要なパフォーマンス指標を自動的に追跡します。

### 追跡される指標

- **Time to First Byte (TTFB)**: 最初のバイトまでの時間
- **First Contentful Paint (FCP)**: 最初のコンテンツ描画
- **Largest Contentful Paint (LCP)**: 最大コンテンツ描画
- **First Input Delay (FID)**: 最初の入力遅延
- **Cumulative Layout Shift (CLS)**: 累積レイアウトシフト
- **Interaction to Next Paint (INP)**: 次の描画までのインタラクション

## 2. クライアント計測方法

### a. \`useReportWebVitals\` フックの使用

\`\`\`javascript
'use client'

import { useReportWebVitals } from 'next/web-vitals'

export function WebVitals() {
  useReportWebVitals((metric) => {
    console.log(metric)
  })
}
\`\`\`

### b. 外部システムへの結果送信

\`\`\`javascript
useReportWebVitals((metric) => {
  const body = JSON.stringify(metric)
  const url = 'https://example.com/analytics'

  // 利用可能な場合は navigator.sendBeacon を使用
  if (navigator.sendBeacon) {
    navigator.sendBeacon(url, body)
  } else {
    fetch(url, { body, method: 'POST', keepalive: true })
  }
})
\`\`\`

## 3. クライアント計測ファイル

プロジェクトのルートディレクトリに \`instrumentation-client.js\` または \`instrumentation-client.ts\` を作成できます。

このファイルは、フロントエンドコードの実行前に実行され、グローバルなアナリティクス設定に最適です。

### 例

\`\`\`javascript
// アプリ起動前にアナリティクスを初期化
console.log('Analytics initialized')

// グローバルエラー追跡の設定
window.addEventListener('error', (event) => {
  reportError(event.error)
})
\`\`\`

## 4. 統合オプション

Next.jsでは以下の統合オプションを利用できます：

- \`useReportWebVitals\` による手動追跡
- Vercelの管理されたアナリティクスサービス
- Google Analyticsなどの外部サービスとのカスタム実装

## 主な推奨事項

- Web Vitals追跡用に別のクライアントコンポーネントを使用する
- 組み込みのパフォーマンス測定ツールを活用する
- Vercelのアナリティクスサービスの利用を検討する
- パフォーマンスデータを継続的にモニタリングする

## まとめ

Next.jsは、パフォーマンス追跡とアナリティクス実装のための強力なツールを提供しています。これらを活用することで、アプリケーションのパフォーマンスを継続的に改善できます。
