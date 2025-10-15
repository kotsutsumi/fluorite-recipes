# 'use client'

`'use client'` は、クライアントで実行されるコードをマークするためのディレクティブです。

## リファレンス

### `'use client'`

ファイルの先頭に `'use client'` を追加して、モジュールとその推移的依存関係をクライアントコードとしてマークします。

```javascript
'use client';

import { useState } from 'react';
import { formatDate } from './formatters';
import Button from './button';

export default function RichTextEditor({ timestamp, text }) {
  const [editing, setEditing] = useState(false);
  // ...
  return (
    <div>
      <button onClick={() => setEditing(!editing)}>
        編集
      </button>
      {editing ? <textarea>{text}</textarea> : <p>{text}</p>}
      <p>{formatDate(timestamp)}</p>
    </div>
  );
}
```

### 配置ルール

`'use client'` は、ファイルの最初の行に配置する必要があります。`'use client'` の上には、コメント以外何も配置できません。

```javascript
// ✓ 正しい
'use client';

import React from 'react';

export default function Component() {
  // ...
}
```

```javascript
// ✗ 間違い
import React from 'react';

'use client'; // エラー: import の後に配置できない
```

### モジュールの評価

`'use client'` でマークされたファイルがインポートされた場合の動作は、そのファイルがどこからインポートされるかによって異なります：

**サーバコンポーネントからインポートされた場合：**
- モジュールはクライアントコードとして扱われます
- そのすべての依存関係もクライアントバンドルに含まれます

**クライアントコンポーネントからインポートされた場合：**
- モジュールは通常のクライアントコードとして評価されます
- 特別な処理は行われません

```javascript
// ServerComponent.js (サーバコンポーネント)
import ClientComponent from './ClientComponent'; // ClientComponent はクライアントコードとして扱われる

export default function ServerComponent() {
  return <ClientComponent />;
}
```

```javascript
// ClientComponent.js
'use client';

import { useState } from 'react';

export default function ClientComponent() {
  const [count, setCount] = useState(0);
  return <button onClick={() => setCount(count + 1)}>{count}</button>;
}
```

## 使用法

### クライアントコンポーネントでインタラクティビティを追加する

React コンポーネントで `useState` のような[クライアント専用機能](/reference/rsc/use-client#what-features-are-client-only)を使用するには、ファイルの先頭に `'use client'` を追加します。

```javascript
'use client';

import { useState } from 'react';

export default function Counter() {
  const [count, setCount] = useState(0);

  return (
    <div>
      <p>カウント: {count}</p>
      <button onClick={() => setCount(count + 1)}>
        増やす
      </button>
    </div>
  );
}
```

`'use client'` を追加すると、このコンポーネントとそのすべての依存関係がクライアントバンドルに含まれ、ブラウザで実行されます。

### イベントハンドラーを使用する

クライアントコンポーネントでは、`onClick`、`onChange` などのイベントハンドラーを使用できます：

```javascript
'use client';

export default function Button() {
  function handleClick() {
    alert('クリックされました！');
  }

  return <button onClick={handleClick}>クリック</button>;
}
```

サーバコンポーネントでは、イベントハンドラーを直接使用することはできません。インタラクティブな機能が必要な場合は、クライアントコンポーネントを使用する必要があります。

### ブラウザ API を使用する

クライアントコンポーネントでは、`window`、`document`、`localStorage` などのブラウザ API を使用できます：

```javascript
'use client';

import { useState, useEffect } from 'react';

export default function LocalStorageExample() {
  const [value, setValue] = useState('');

  useEffect(() => {
    // ブラウザ API を使用可能
    const saved = localStorage.getItem('myValue');
    if (saved) {
      setValue(saved);
    }
  }, []);

  const handleSave = () => {
    localStorage.setItem('myValue', value);
  };

  return (
    <div>
      <input value={value} onChange={(e) => setValue(e.target.value)} />
      <button onClick={handleSave}>保存</button>
    </div>
  );
}
```

### React のフックを使用する

クライアントコンポーネントでは、以下のような React のフックを使用できます：

- `useState`
- `useEffect`
- `useContext`
- `useReducer`
- `useRef`
- `useCallback`
- `useMemo`
- その他のクライアント側フック

```javascript
'use client';

import { useState, useEffect, useRef } from 'react';

export default function FormExample() {
  const [name, setName] = useState('');
  const inputRef = useRef(null);

  useEffect(() => {
    // コンポーネントがマウントされたときに入力にフォーカス
    inputRef.current?.focus();
  }, []);

  return (
    <input
      ref={inputRef}
      value={name}
      onChange={(e) => setName(e.target.value)}
    />
  );
}
```

### サードパーティのクライアント専用ライブラリを使用する

クライアント専用の機能を持つサードパーティライブラリを使用する場合は、それらを `'use client'` でマークされたコンポーネント内で使用します：

```javascript
'use client';

import { Carousel } from 'react-responsive-carousel';
import 'react-responsive-carousel/lib/styles/carousel.min.css';

export default function ImageCarousel({ images }) {
  return (
    <Carousel>
      {images.map((image, index) => (
        <div key={index}>
          <img src={image.url} alt={image.alt} />
        </div>
      ))}
    </Carousel>
  );
}
```

サードパーティライブラリに `'use client'` ディレクティブがない場合は、独自のクライアントコンポーネントでラップできます。

### Context を使用する

クライアントコンポーネントでは、React Context を使用してコンポーネント間で状態を共有できます：

```javascript
// ThemeContext.js
'use client';

import { createContext, useContext, useState } from 'react';

const ThemeContext = createContext();

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState('light');

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}
```

```javascript
// ThemedButton.js
'use client';

import { useTheme } from './ThemeContext';

export default function ThemedButton() {
  const { theme, setTheme } = useTheme();

  return (
    <button onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}>
      {theme === 'light' ? '🌙' : '☀️'}
    </button>
  );
}
```

## クライアント専用機能

以下は、クライアントコンポーネントでのみ使用できる機能の一覧です：

### React フック
- `useState`
- `useEffect`
- `useLayoutEffect`
- `useReducer`
- `useRef`
- `useCallback`
- `useMemo`
- `useContext`
- `useId`
- `useDeferredValue`
- `useTransition`
- `useSyncExternalStore`
- `useInsertionEffect`

### ブラウザ API
- `window`
- `document`
- `localStorage`
- `sessionStorage`
- `navigator`
- `fetch` (ブラウザ環境で)
- DOM 操作
- イベントリスナー

### インタラクティブ機能
- イベントハンドラー (`onClick`、`onChange` など)
- フォーム操作
- アニメーション
- ユーザー入力処理

### サードパーティライブラリ
- ブラウザ専用機能を使用するライブラリ
- UI コンポーネントライブラリ（多くの場合）
- アニメーションライブラリ
- チャートライブラリ

## サーバコンポーネントとクライアントコンポーネントの組み合わせ

### サーバコンポーネントからクライアントコンポーネントに props を渡す

サーバコンポーネントは、クライアントコンポーネントに props を渡すことができます。ただし、props はシリアライズ可能である必要があります。

```javascript
// ServerComponent.js (サーバコンポーネント)
import ClientComponent from './ClientComponent';

export default async function ServerComponent() {
  const data = await fetchData();

  return (
    <ClientComponent
      // シリアライズ可能な props
      title={data.title}
      items={data.items}
      timestamp={new Date()}
    />
  );
}
```

```javascript
// ClientComponent.js
'use client';

export default function ClientComponent({ title, items, timestamp }) {
  return (
    <div>
      <h1>{title}</h1>
      <ul>
        {items.map(item => <li key={item.id}>{item.name}</li>)}
      </ul>
      <p>{timestamp.toISOString()}</p>
    </div>
  );
}
```

### シリアライズ可能な型

サーバコンポーネントからクライアントコンポーネントに渡せる型：

**サポートされる型：**
- プリミティブ型（string、number、boolean、null、undefined）
- 配列
- プレーンなオブジェクト
- Date オブジェクト
- Map、Set
- TypedArray（Int8Array など）
- Promise
- サーバ関数
- JSX 要素（React 要素）

**サポートされない型：**
- 関数（サーバ関数を除く）
- クラスインスタンス（Date などの組み込みクラスを除く）
- シンボル（グローバルシンボルを除く）

```javascript
// ServerComponent.js
import ClientComponent from './ClientComponent';

export default function ServerComponent() {
  return (
    <ClientComponent
      // ✓ OK
      text="Hello"
      count={42}
      items={[1, 2, 3]}
      data={{ name: 'John' }}
      date={new Date()}

      // ✗ NG
      // onClick={() => console.log('clicked')} // 関数は渡せない
      // user={new User()} // カスタムクラスインスタンスは渡せない
    />
  );
}
```

### クライアントコンポーネントに children を渡す

クライアントコンポーネントは、サーバコンポーネントを `children` として受け取ることができます：

```javascript
// ClientWrapper.js
'use client';

export default function ClientWrapper({ children }) {
  return (
    <div className="wrapper">
      {children}
    </div>
  );
}
```

```javascript
// ServerPage.js (サーバコンポーネント)
import ClientWrapper from './ClientWrapper';
import ServerComponent from './ServerComponent';

export default function ServerPage() {
  return (
    <ClientWrapper>
      {/* ServerComponent はサーバで実行される */}
      <ServerComponent />
    </ClientWrapper>
  );
}
```

この方法を使用すると、クライアントコンポーネントでラッパーを提供しながら、その中身をサーバコンポーネントとして保つことができます。

## ベストプラクティス

### 1. クライアントコンポーネントをツリーの下層に配置

パフォーマンスを最適化するために、クライアントコンポーネントをコンポーネントツリーの可能な限り下層に配置します：

```javascript
// ✓ 推奨
// Page.js (サーバコンポーネント)
import Header from './Header';
import Content from './Content';
import InteractiveButton from './InteractiveButton'; // クライアントコンポーネント

export default function Page() {
  return (
    <div>
      <Header /> {/* サーバコンポーネント */}
      <Content /> {/* サーバコンポーネント */}
      <InteractiveButton /> {/* この部分のみクライアント */}
    </div>
  );
}
```

```javascript
// ✗ 非推奨
// Page.js
'use client'; // ページ全体がクライアントコンポーネントになる

import Header from './Header';
import Content from './Content';
import InteractiveButton from './InteractiveButton';

export default function Page() {
  return (
    <div>
      <Header />
      <Content />
      <InteractiveButton />
    </div>
  );
}
```

### 2. サーバコンポーネントとクライアントコンポーネントを分離

サーバ専用のロジックとクライアント専用のロジックを明確に分離します：

```javascript
// DataFetcher.js (サーバコンポーネント)
import ClientDisplay from './ClientDisplay';

export default async function DataFetcher() {
  const data = await fetchFromDatabase(); // サーバでのみ実行

  return <ClientDisplay data={data} />;
}
```

```javascript
// ClientDisplay.js
'use client';

import { useState } from 'react';

export default function ClientDisplay({ data }) {
  const [selected, setSelected] = useState(null);

  return (
    <div>
      {data.map(item => (
        <button key={item.id} onClick={() => setSelected(item)}>
          {item.name}
        </button>
      ))}
      {selected && <p>選択: {selected.name}</p>}
    </div>
  );
}
```

### 3. Props の最適化

不要な props を渡さないようにして、シリアライゼーションのオーバーヘッドを最小限に抑えます：

```javascript
// ✓ 推奨
<ClientComponent
  id={user.id}
  name={user.name}
/>

// ✗ 非推奨
<ClientComponent
  user={user} // user オブジェクト全体を渡す（不要なデータも含む）
/>
```

### 4. コンポーネントの再利用性

クライアントコンポーネントは、汎用的で再利用可能な設計にします：

```javascript
'use client';

// 汎用的なボタンコンポーネント
export default function Button({ onClick, children, variant = 'primary' }) {
  const className = `btn btn-${variant}`;

  return (
    <button onClick={onClick} className={className}>
      {children}
    </button>
  );
}
```

### 5. サードパーティライブラリのラップ

サードパーティライブラリに `'use client'` がない場合は、独自のクライアントコンポーネントでラップします：

```javascript
// Chart.js
'use client';

import { Chart as ChartJS } from 'chart.js';

export default function Chart({ data, options }) {
  return <ChartJS data={data} options={options} />;
}
```

これで、サーバコンポーネントから `Chart` を使用できます：

```javascript
// Dashboard.js (サーバコンポーネント)
import Chart from './Chart';

export default async function Dashboard() {
  const data = await fetchChartData();

  return <Chart data={data} options={{ responsive: true }} />;
}
```

## トラブルシューティング

### エラー: "useState can only be used in Client Components"

このエラーは、サーバコンポーネント内で `useState` などのクライアント専用フックを使用しようとしたときに発生します。

**解決方法：** ファイルの先頭に `'use client'` を追加します。

```javascript
// ✗ エラー
import { useState } from 'react';

export default function Component() {
  const [state, setState] = useState(0); // エラー
  // ...
}
```

```javascript
// ✓ 修正
'use client';

import { useState } from 'react';

export default function Component() {
  const [state, setState] = useState(0); // OK
  // ...
}
```

### エラー: "Event handlers cannot be passed to Client Component props"

サーバコンポーネントからクライアントコンポーネントに関数を直接渡そうとするとエラーが発生します。

**解決方法：** サーバ関数を使用するか、クライアントコンポーネント内でハンドラーを定義します。

```javascript
// ✗ エラー
// ServerComponent.js
export default function ServerComponent() {
  const handleClick = () => console.log('clicked');

  return <ClientComponent onClick={handleClick} />; // エラー
}
```

```javascript
// ✓ 修正 1: サーバ関数を使用
// ServerComponent.js
import ClientComponent from './ClientComponent';

export default function ServerComponent() {
  async function handleClick() {
    'use server';
    console.log('clicked on server');
  }

  return <ClientComponent onClick={handleClick} />;
}
```

```javascript
// ✓ 修正 2: クライアントコンポーネント内で定義
// ClientComponent.js
'use client';

export default function ClientComponent() {
  const handleClick = () => console.log('clicked');

  return <button onClick={handleClick}>Click</button>;
}
```

### バンドルサイズが大きい

クライアントコンポーネントが多すぎると、バンドルサイズが大きくなります。

**解決方法：**
1. 不要なクライアントコンポーネントをサーバコンポーネントに変換
2. コード分割を使用して動的インポート
3. クライアントコンポーネントをツリーの下層に配置

```javascript
// コード分割の例
'use client';

import dynamic from 'next/dynamic';

const HeavyComponent = dynamic(() => import('./HeavyComponent'), {
  loading: () => <p>読み込み中...</p>,
});

export default function Page() {
  return (
    <div>
      <HeavyComponent />
    </div>
  );
}
```

## まとめ

`'use client'` ディレクティブは、React Server Components でインタラクティブな機能を追加するために不可欠です：

- ファイルの先頭に配置してクライアントコードをマーク
- React のフック、イベントハンドラー、ブラウザ API を使用可能
- サーバコンポーネントと組み合わせて使用
- パフォーマンスのためにツリーの下層に配置

適切に使用することで、高性能でインタラクティブなアプリケーションを構築できます。
