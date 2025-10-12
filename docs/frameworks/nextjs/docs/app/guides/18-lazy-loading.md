# 遅延読み込み（Lazy Loading）

遅延読み込みは、ルートのレンダリングに必要な JavaScript の量を減らすことで、初期ページ読み込みのパフォーマンスを向上させます。Client Components とライブラリの読み込みを、必要になるまで延期できます。

## 概要

遅延読み込みを使用すると、以下のメリットがあります：

- **初期バンドルサイズの削減**: 必要なコードのみを最初に読み込む
- **インタラクティブまでの時間の短縮**: ページが早く操作可能になる
- **パフォーマンスの向上**: リソースを効率的に使用

## 遅延読み込みの2つの主要な方法

1. **`next/dynamic` を使用する**（推奨）
2. **`React.lazy()` と Suspense を使用する**

## next/dynamic の使用

### Client Components のインポート

`next/dynamic` を使用して、Client Components を動的にインポートします。

```typescript
// app/page.tsx
'use client'

import dynamic from 'next/dynamic'

// Client Components を動的にインポート
const ComponentA = dynamic(() => import('../components/ComponentA'))
const ComponentB = dynamic(() => import('../components/ComponentB'))
const ComponentC = dynamic(() => import('../components/ComponentC'))

export default function Page() {
  return (
    <div>
      <ComponentA />
      <ComponentB />
      <ComponentC />
    </div>
  )
}
```

### サーバーサイドレンダリングのスキップ

Client Component のプリレンダリングを無効にするには、`ssr: false` を設定します。

```typescript
'use client'

import dynamic from 'next/dynamic'

const ComponentC = dynamic(() => import('../components/ComponentC'), {
  ssr: false,
})

export default function Page() {
  return (
    <div>
      <ComponentC />
    </div>
  )
}
```

これは、ブラウザ API（`window`、`localStorage` など）に依存するコンポーネントに便利です。

### カスタムローディングコンポーネント

読み込み中に表示するカスタムコンポーネントを指定できます。

```typescript
'use client'

import dynamic from 'next/dynamic'

const ComponentWithCustomLoading = dynamic(
  () => import('../components/ComponentWithCustomLoading'),
  {
    loading: () => <p>読み込み中...</p>,
  }
)

export default function Page() {
  return (
    <div>
      <ComponentWithCustomLoading />
    </div>
  )
}
```

スピナーやスケルトンを使用した例：

```typescript
'use client'

import dynamic from 'next/dynamic'

const ProductCard = dynamic(() => import('../components/ProductCard'), {
  loading: () => (
    <div className="animate-pulse">
      <div className="h-48 bg-gray-200 rounded"></div>
      <div className="h-4 bg-gray-200 mt-2 rounded"></div>
      <div className="h-4 bg-gray-200 mt-2 rounded w-3/4"></div>
    </div>
  ),
})

export default function ProductList() {
  return (
    <div className="grid grid-cols-3 gap-4">
      <ProductCard />
      <ProductCard />
      <ProductCard />
    </div>
  )
}
```

### 名前付きエクスポートのインポート

デフォルトエクスポートではなく、名前付きエクスポートを動的にインポートします。

```typescript
'use client'

import dynamic from 'next/dynamic'

// components/Hello.tsx から Hello をインポート
const Hello = dynamic(() =>
  import('../components/Hello').then((mod) => mod.Hello)
)

export default function Page() {
  return (
    <div>
      <Hello />
    </div>
  )
}
```

## 外部ライブラリの読み込み

オンデマンドで外部ライブラリを読み込みます。

### 検索ライブラリの例

```typescript
'use client'

import { useState } from 'react'

const names = ['Alice', 'Bob', 'Charlie', 'David', 'Eve']

export default function SearchPage() {
  const [results, setResults] = useState<any[]>([])

  return (
    <div>
      <input
        type="text"
        placeholder="検索..."
        onChange={async (e) => {
          const { value } = e.currentTarget

          // fuse.js を動的に読み込む
          const Fuse = (await import('fuse.js')).default
          const fuse = new Fuse(names)

          setResults(fuse.search(value))
        }}
      />

      <ul>
        {results.map((result) => (
          <li key={result.item}>{result.item}</li>
        ))}
      </ul>
    </div>
  )
}
```

### チャートライブラリの例

```typescript
'use client'

import { useState } from 'react'

export default function ChartPage() {
  const [chartData, setChartData] = useState(null)

  const loadChart = async () => {
    // chart.js を動的に読み込む
    const { Chart } = await import('chart.js')

    // チャートを初期化
    // ...
  }

  return (
    <div>
      <button onClick={loadChart}>チャートを表示</button>
      <canvas id="myChart"></canvas>
    </div>
  )
}
```

## React.lazy() と Suspense の使用

React の組み込み機能を使用することもできます。

```typescript
'use client'

import { lazy, Suspense } from 'react'

const LazyComponent = lazy(() => import('../components/LazyComponent'))

export default function Page() {
  return (
    <Suspense fallback={<div>読み込み中...</div>}>
      <LazyComponent />
    </Suspense>
  )
}
```

## 実用的な例

### モーダルの遅延読み込み

モーダルは開かれるまで読み込まない：

```typescript
'use client'

import { useState } from 'react'
import dynamic from 'next/dynamic'

const Modal = dynamic(() => import('../components/Modal'), {
  ssr: false,
})

export default function Page() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div>
      <button onClick={() => setIsOpen(true)}>モーダルを開く</button>

      {isOpen && <Modal onClose={() => setIsOpen(false)} />}
    </div>
  )
}
```

### タブコンテンツの遅延読み込み

各タブのコンテンツを個別に読み込む：

```typescript
'use client'

import { useState } from 'react'
import dynamic from 'next/dynamic'

const Tab1Content = dynamic(() => import('../components/Tab1Content'))
const Tab2Content = dynamic(() => import('../components/Tab2Content'))
const Tab3Content = dynamic(() => import('../components/Tab3Content'))

export default function TabsPage() {
  const [activeTab, setActiveTab] = useState(1)

  return (
    <div>
      <div className="tabs">
        <button onClick={() => setActiveTab(1)}>タブ 1</button>
        <button onClick={() => setActiveTab(2)}>タブ 2</button>
        <button onClick={() => setActiveTab(3)}>タブ 3</button>
      </div>

      <div className="tab-content">
        {activeTab === 1 && <Tab1Content />}
        {activeTab === 2 && <Tab2Content />}
        {activeTab === 3 && <Tab3Content />}
      </div>
    </div>
  )
}
```

### 地図コンポーネントの遅延読み込み

重い地図ライブラリを遅延読み込み：

```typescript
'use client'

import dynamic from 'next/dynamic'

const Map = dynamic(() => import('../components/Map'), {
  ssr: false,
  loading: () => <div>地図を読み込んでいます...</div>,
})

export default function LocationPage() {
  return (
    <div>
      <h1>店舗の場所</h1>
      <Map center={{ lat: 35.6762, lng: 139.6503 }} zoom={15} />
    </div>
  )
}
```

## パフォーマンス最適化のヒント

### 1. 適切な粒度

コンポーネントを適切なサイズに分割します。

```typescript
// ❌ 悪い例 - 全体を遅延読み込み
const EntirePage = dynamic(() => import('../components/EntirePage'))

// ✅ 良い例 - 重いコンポーネントのみを遅延読み込み
const HeavyChart = dynamic(() => import('../components/HeavyChart'))
const HeavyTable = dynamic(() => import('../components/HeavyTable'))
```

### 2. プリロード

ユーザーがコンポーネントを必要とする前にプリロードします。

```typescript
'use client'

import { useState, useEffect } from 'react'
import dynamic from 'next/dynamic'

const HeavyComponent = dynamic(() => import('../components/HeavyComponent'))

export default function Page() {
  const [showComponent, setShowComponent] = useState(false)

  // マウスオーバー時にプリロード
  const handleMouseEnter = () => {
    import('../components/HeavyComponent')
  }

  return (
    <div>
      <button
        onClick={() => setShowComponent(true)}
        onMouseEnter={handleMouseEnter}
      >
        コンポーネントを表示
      </button>

      {showComponent && <HeavyComponent />}
    </div>
  )
}
```

### 3. バンドル分析

Webpack Bundle Analyzer を使用して、遅延読み込みの効果を測定します。

```bash
npm install --save-dev @next/bundle-analyzer
```

```javascript
// next.config.js
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
})

module.exports = withBundleAnalyzer({
  // Next.js 設定
})
```

```bash
ANALYZE=true npm run build
```

## 重要な注意事項

### Server Components は自動的にコード分割される

Server Components は自動的にコード分割されるため、手動で遅延読み込みする必要はありません。

```typescript
// app/page.tsx
// Server Component - 自動的にコード分割される
import HeavyComponent from '@/components/HeavyComponent'

export default function Page() {
  return (
    <div>
      <HeavyComponent />
    </div>
  )
}
```

### Client Components のみに適用

遅延読み込みは主に Client Components に適用されます。

```typescript
// ✅ Client Component - 遅延読み込みが有効
'use client'
import dynamic from 'next/dynamic'
const Component = dynamic(() => import('./Component'))

// ❌ Server Component - 遅延読み込み不要
// import Component from './Component'
```

## まとめ

遅延読み込みを効果的に使用するポイント：

1. **重いコンポーネント**: 大きなライブラリや複雑なコンポーネント
2. **条件付き表示**: モーダル、タブ、アコーディオン
3. **外部ライブラリ**: チャート、地図、エディタ
4. **ブラウザ専用コンポーネント**: `window` や `document` に依存
5. **パフォーマンス測定**: Bundle Analyzer で効果を確認

適切な遅延読み込みにより、初期読み込み時間を大幅に短縮し、ユーザーエクスペリエンスを向上させることができます。
