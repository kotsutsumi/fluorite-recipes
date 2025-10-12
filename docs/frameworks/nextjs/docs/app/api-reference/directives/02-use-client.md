# use client

`'use client'`ディレクティブは、クライアント側でレンダリングされるコンポーネントのエントリーポイントを宣言します。このディレクティブは、状態管理、イベント処理、ブラウザAPIへのアクセスなど、クライアント側のJavaScript機能が必要なインタラクティブなユーザーインターフェースを作成するために使用します。

## 概要

Next.jsのApp Routerでは、デフォルトですべてのコンポーネントがサーバーコンポーネントとしてレンダリングされます。`'use client'`ディレクティブを使用することで、特定のコンポーネントとその子コンポーネントをクライアント側でレンダリングするように指定できます。

これにより、Next.jsアプリケーション内でクライアントとサーバーの境界を明確に定義できます。

## 使用方法

### 基本的な使用例

ファイルの先頭、インポート文の前に`'use client'`を配置します:

```typescript
'use client'

import { useState } from 'react'

export default function Counter() {
  const [count, setCount] = useState(0)

  return (
    <div>
      <p>カウント: {count}</p>
      <button onClick={() => setCount(count + 1)}>増加</button>
    </div>
  )
}
```

### 状態管理を使用する例

Reactの`useState`フックを使用してクライアント側の状態を管理:

```typescript
'use client'

import { useState } from 'react'

export default function TodoList() {
  const [todos, setTodos] = useState<string[]>([])
  const [input, setInput] = useState('')

  const addTodo = () => {
    if (input.trim()) {
      setTodos([...todos, input])
      setInput('')
    }
  }

  return (
    <div>
      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="新しいタスクを入力"
      />
      <button onClick={addTodo}>追加</button>
      <ul>
        {todos.map((todo, index) => (
          <li key={index}>{todo}</li>
        ))}
      </ul>
    </div>
  )
}
```

### イベントハンドラを使用する例

クライアント側のイベントハンドラを使用:

```typescript
'use client'

export default function InteractiveButton() {
  const handleClick = () => {
    alert('ボタンがクリックされました!')
  }

  const handleMouseEnter = () => {
    console.log('マウスが入りました')
  }

  return (
    <button
      onClick={handleClick}
      onMouseEnter={handleMouseEnter}
      className="px-4 py-2 bg-blue-500 text-white rounded"
    >
      クリックしてください
    </button>
  )
}
```

### ブラウザAPIを使用する例

`window`や`document`などのブラウザAPIにアクセス:

```typescript
'use client'

import { useEffect, useState } from 'react'

export default function WindowSize() {
  const [size, setSize] = useState({ width: 0, height: 0 })

  useEffect(() => {
    const updateSize = () => {
      setSize({
        width: window.innerWidth,
        height: window.innerHeight
      })
    }

    updateSize()
    window.addEventListener('resize', updateSize)

    return () => window.removeEventListener('resize', updateSize)
  }, [])

  return (
    <div>
      <p>ウィンドウの幅: {size.width}px</p>
      <p>ウィンドウの高さ: {size.height}px</p>
    </div>
  )
}
```

## クライアントコンポーネントとサーバーコンポーネントの組み合わせ

### サーバーコンポーネント内でクライアントコンポーネントを使用

サーバーコンポーネント内でクライアントコンポーネントをインポートして使用できます:

```typescript
// app/page.tsx (サーバーコンポーネント)
import ClientCounter from '@/components/ClientCounter'

export default async function Page() {
  // サーバー側でデータを取得
  const data = await fetch('https://api.example.com/data').then(res => res.json())

  return (
    <div>
      <h1>サーバーレンダリングされたページ</h1>
      <p>データ: {data.value}</p>

      {/* クライアントコンポーネントを埋め込み */}
      <ClientCounter />
    </div>
  )
}
```

```typescript
// components/ClientCounter.tsx
'use client'

import { useState } from 'react'

export default function ClientCounter() {
  const [count, setCount] = useState(0)

  return (
    <div>
      <p>カウント: {count}</p>
      <button onClick={() => setCount(count + 1)}>増加</button>
    </div>
  )
}
```

### クライアントコンポーネントにサーバーコンポーネントを渡す

クライアントコンポーネントに子要素としてサーバーコンポーネントを渡すことができます:

```typescript
// components/ClientWrapper.tsx
'use client'

import { ReactNode } from 'react'
import { useState } from 'react'

export default function ClientWrapper({ children }: { children: ReactNode }) {
  const [isVisible, setIsVisible] = useState(true)

  return (
    <div>
      <button onClick={() => setIsVisible(!isVisible)}>
        {isVisible ? '非表示' : '表示'}
      </button>
      {isVisible && <div>{children}</div>}
    </div>
  )
}
```

```typescript
// app/page.tsx
import ClientWrapper from '@/components/ClientWrapper'
import ServerContent from '@/components/ServerContent'

export default function Page() {
  return (
    <ClientWrapper>
      <ServerContent />
    </ClientWrapper>
  )
}
```

## 重要な考慮事項

### 1. propsはシリアライズ可能である必要がある

クライアントコンポーネントに渡すpropsは、サーバーからクライアントへ送信可能なようにシリアライズ可能である必要があります:

```typescript
// ✅ 良い例: シリアライズ可能なprops
<ClientComponent
  name="John"
  age={30}
  tags={['developer', 'next.js']}
  metadata={{ role: 'admin' }}
/>

// ❌ 悪い例: 関数はシリアライズできない
<ClientComponent
  onClick={() => console.log('clicked')} // エラー!
  callback={someFunction} // エラー!
/>
```

### 2. ファイルの先頭に配置

`'use client'`ディレクティブは、ファイルの最上部、インポート文より前に配置する必要があります:

```typescript
// ✅ 正しい
'use client'

import { useState } from 'react'

// ❌ 間違い
import { useState } from 'react'

'use client' // インポートより後に配置されている
```

### 3. エントリーポイントでのみ必要

`'use client'`は、クライアント側でレンダリングする必要があるコンポーネントツリーのエントリーポイントでのみ必要です。そのコンポーネントがインポートする他のコンポーネントは自動的にクライアントコンポーネントとして扱われます:

```typescript
// components/ClientEntry.tsx
'use client'

import ChildComponent from './ChildComponent' // 自動的にクライアントコンポーネント

export default function ClientEntry() {
  return <ChildComponent />
}
```

```typescript
// components/ChildComponent.tsx
// 'use client'は不要 - 親がクライアントコンポーネントのため
export default function ChildComponent() {
  return <div>子コンポーネント</div>
}
```

## クライアントコンポーネントを使用すべき場合

以下の場合にクライアントコンポーネントを使用します:

### 1. インタラクティビティとイベントリスナー

```typescript
'use client'

export default function LikeButton() {
  const [liked, setLiked] = useState(false)

  return (
    <button onClick={() => setLiked(!liked)}>
      {liked ? '♥' : '♡'} いいね
    </button>
  )
}
```

### 2. 状態とライフサイクル

```typescript
'use client'

import { useState, useEffect } from 'react'

export default function Timer() {
  const [seconds, setSeconds] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setSeconds(s => s + 1)
    }, 1000)

    return () => clearInterval(interval)
  }, [])

  return <div>経過時間: {seconds}秒</div>
}
```

### 3. ブラウザ専用API

```typescript
'use client'

import { useEffect, useState } from 'react'

export default function LocalStorageExample() {
  const [value, setValue] = useState('')

  useEffect(() => {
    const stored = localStorage.getItem('myValue')
    if (stored) setValue(stored)
  }, [])

  const handleSave = (newValue: string) => {
    setValue(newValue)
    localStorage.setItem('myValue', newValue)
  }

  return (
    <input
      value={value}
      onChange={(e) => handleSave(e.target.value)}
    />
  )
}
```

### 4. カスタムフック

```typescript
'use client'

import { useState, useEffect } from 'react'

function useMediaQuery(query: string) {
  const [matches, setMatches] = useState(false)

  useEffect(() => {
    const media = window.matchMedia(query)
    setMatches(media.matches)

    const listener = () => setMatches(media.matches)
    media.addEventListener('change', listener)

    return () => media.removeEventListener('change', listener)
  }, [query])

  return matches
}

export default function ResponsiveComponent() {
  const isMobile = useMediaQuery('(max-width: 768px)')

  return (
    <div>
      {isMobile ? 'モバイル表示' : 'デスクトップ表示'}
    </div>
  )
}
```

## ベストプラクティス

### 1. サーバーコンポーネントを優先

可能な限りサーバーコンポーネントを使用し、必要な部分のみをクライアントコンポーネントにします:

```typescript
// app/page.tsx (サーバーコンポーネント)
import InteractiveButton from '@/components/InteractiveButton'

export default async function Page() {
  const data = await fetchData() // サーバー側で実行

  return (
    <div>
      <h1>{data.title}</h1>
      <p>{data.description}</p>
      {/* インタラクティブな部分のみクライアント側 */}
      <InteractiveButton />
    </div>
  )
}
```

### 2. クライアントコンポーネントをリーフノードに

クライアントコンポーネントをコンポーネントツリーのできるだけ下層（リーフノード）に配置します:

```typescript
// ✅ 良い例: クライアントコンポーネントは小さく限定的
export default async function Page() {
  return (
    <div>
      <StaticHeader />
      <StaticContent />
      <InteractiveWidget /> {/* これだけがクライアントコンポーネント */}
      <StaticFooter />
    </div>
  )
}

// ❌ 避けるべき: ページ全体がクライアントコンポーネント
'use client'

export default function Page() {
  return (
    <div>
      <Header />
      <Content />
      <Widget />
      <Footer />
    </div>
  )
}
```

### 3. クライアントとサーバーコンポーネントを組み合わせる

両方の強みを活かしてコンポーネントを構成します:

```typescript
// app/dashboard/page.tsx
import { Suspense } from 'react'
import UserStats from '@/components/UserStats' // サーバーコンポーネント
import InteractiveChart from '@/components/InteractiveChart' // クライアントコンポーネント

export default function Dashboard() {
  return (
    <div>
      <h1>ダッシュボード</h1>

      {/* サーバーコンポーネント - データ取得 */}
      <Suspense fallback={<div>読み込み中...</div>}>
        <UserStats />
      </Suspense>

      {/* クライアントコンポーネント - インタラクティブなグラフ */}
      <InteractiveChart />
    </div>
  )
}
```

## まとめ

`'use client'`ディレクティブは、Next.jsアプリケーションでクライアント側のインタラクティビティが必要なコンポーネントを明示的に宣言するために使用します。以下の点を押さえておきましょう:

- **状態管理、イベントハンドラ、ブラウザAPIが必要な場合に使用**
- **ファイルの先頭に配置し、インポート文より前に記述**
- **propsはシリアライズ可能である必要がある**
- **可能な限りサーバーコンポーネントを優先し、必要な部分のみクライアント化**
- **クライアントコンポーネントをコンポーネントツリーのリーフノードに配置**

サーバーコンポーネントとクライアントコンポーネントを適切に組み合わせることで、パフォーマンスとユーザーエクスペリエンスの両方を最適化できます。

## 関連リンク

- [Server Components](https://nextjs.org/docs/app/building-your-application/rendering/server-components)
- [Client Components](https://nextjs.org/docs/app/building-your-application/rendering/client-components)
- [Composition Patterns](https://nextjs.org/docs/app/building-your-application/rendering/composition-patterns)
- [React Documentation: 'use client'](https://react.dev/reference/react/use-client)
