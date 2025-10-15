# React リファレンス概要

このセクションは React で開発をする際の詳細なリファレンスドキュメントです。React の使い方の概要については Learn セクションをご覧ください。

---

## 📋 クイックナビゲーション

| セクション | 概要 | 主な内容 | 詳細リンク |
|----------|------|----------|-----------|
| **React** | React パッケージの API | フック、コンポーネント、API、レガシー | [react.md](./reference/react.md) |
| **React DOM** | ウェブアプリケーション専用 API | クライアント、サーバ、静的、フック、コンポーネント | [react-dom.md](./reference/react-dom.md) |
| **Rules** | React のルールとベストプラクティス | 純粋性、フックのルール、React の呼び出し | [rules.md](./reference/rules.md) |
| **RSC** | React Server Components | サーバコンポーネント、ディレクティブ、サーバ関数 | [rsc.md](./reference/rsc.md) |

---

## 1. React パッケージ

React をプログラム的に使用するための機能が含まれます。

### フック (Hooks)

コンポーネント内で使用する様々な React の機能です。

#### カテゴリ別フック一覧

| カテゴリ | フック | 用途 |
|---------|--------|------|
| **State** | `useState`, `useReducer` | データの記憶 |
| **Context** | `useContext` | Props なしで情報を受け取る |
| **Ref** | `useRef`, `useImperativeHandle` | レンダー外の情報保持 |
| **Effect** | `useEffect`, `useLayoutEffect`, `useInsertionEffect` | 外部システムとの同期 |
| **パフォーマンス** | `useMemo`, `useCallback`, `useTransition`, `useDeferredValue` | 最適化 |
| **リソース** | `use` | Promise/Context から値を読み取る |
| **その他** | `useDebugValue`, `useId`, `useSyncExternalStore` | ライブラリ開発者向け |
| **サーバ** | `useActionState`, `useOptimistic` | フォームとアクション |

**使用例:**

```javascript
import { useState, useEffect, useContext } from 'react';

function Component() {
  const [state, setState] = useState(initialState);
  const context = useContext(MyContext);

  useEffect(() => {
    // 副作用
  }, [dependencies]);

  return <div>{state}</div>;
}
```

[詳細 → react/hooks.md](./reference/react/hooks.md)

### コンポーネント (Components)

JSX で使用できる組み込みコンポーネントです。

| コンポーネント | 用途 | 主な機能 |
|--------------|------|----------|
| `<Fragment>` | 複数要素をグループ化 | `<>...</>` 省略記法 |
| `<Profiler>` | パフォーマンス測定 | onRender コールバック |
| `<Suspense>` | ローディング状態管理 | 非同期データフェッチ |
| `<StrictMode>` | 開発時のチェック | バグの早期発見 |
| `<Activity>` | アクティビティ追跡 | ナビゲーション追跡 |
| `<ViewTransition>` | ビュー遷移 | アニメーション |

[詳細 → react/components.md](./reference/react/components.md)

### API

コンポーネントを定義するための API です。

#### 主要 API

| API | 用途 | 使用場面 |
|-----|------|----------|
| `createContext` | Context 作成 | グローバル状態 |
| `lazy` | 遅延読み込み | コード分割 |
| `memo` | 再レンダー最適化 | パフォーマンス向上 |
| `startTransition` | 低緊急度更新 | UI応答性 |
| `cache` | データキャッシュ | サーバコンポーネント |
| `use` | リソース読み取り | Promise/Context |
| `act` | テスト | ユニットテスト |

[詳細 → react/apis.md](./reference/react/apis.md)

### レガシー API

新しいコードでは推奨されない API です。

| API | 代替手段 |
|-----|---------|
| `Children` | 配列操作 |
| `cloneElement` | props 使用 |
| `Component` | 関数コンポーネント |
| `createElement` | JSX |
| `createRef` | `useRef` |
| `forwardRef` | 現代的パターン |
| `isValidElement` | 型チェック |
| `PureComponent` | `memo` |

[詳細 → react/legacy.md](./reference/react/legacy.md)

[React パッケージ全体の詳細 →](./reference/react.md)

---

## 2. React DOM パッケージ

Web アプリケーション(ブラウザの DOM 環境)専用の機能が含まれます。

### クライアント API (`react-dom/client`)

ブラウザでのレンダリング用 API です。

| API | 用途 | 使用場面 |
|-----|------|----------|
| `createRoot` | CSR ルート作成 | クライアントサイドレンダリング |
| `hydrateRoot` | SSR ハイドレーション | サーバサイドレンダリング |

**使用例:**

```javascript
import { createRoot } from 'react-dom/client';

const root = createRoot(document.getElementById('root'));
root.render(<App />);
```

[詳細 → react-dom/client.md](./reference/react-dom/client.md)

### サーバ API (`react-dom/server`)

サーバ上での HTML レンダリング用 API です。

#### ストリーミング API (推奨)

| API | 環境 | Suspense |
|-----|------|----------|
| `renderToPipeableStream` | Node.js | ✅ 完全サポート |
| `renderToReadableStream` | Web Stream | ✅ 完全サポート |

#### レガシー API

| API | 推奨度 |
|-----|--------|
| `renderToString` | レガシー |
| `renderToStaticMarkup` | 静的コンテンツのみ |

[詳細 → react-dom/server.md](./reference/react-dom/server.md)

### 静的 API (`react-dom/static`)

静的サイト生成 (SSG) 用 API です。

| API | 環境 | 用途 |
|-----|------|------|
| `prerender` | Web Stream | ビルド時 HTML 生成 |
| `prerenderToNodeStream` | Node.js | ビルド時 HTML 生成 |

[詳細 → react-dom/static.md](./reference/react-dom/static.md)

### フック (`react-dom/hooks`)

ブラウザ DOM 環境専用のフックです。

| フック | 用途 |
|--------|------|
| `useFormStatus` | フォーム送信状態追跡 |

[詳細 → react-dom/hooks.md](./reference/react-dom/hooks.md)

### コンポーネント (`react-dom/components`)

HTML と SVG の組み込みコンポーネントです。

| カテゴリ | 主なコンポーネント |
|---------|-------------------|
| **フォーム** | `<input>`, `<select>`, `<textarea>`, `<form>` |
| **リソース** | `<link>`, `<meta>`, `<script>`, `<style>`, `<title>` |
| **HTML** | すべての HTML 要素 |
| **SVG** | すべての SVG 要素 |

[詳細 → react-dom/components.md](./reference/react-dom/components.md)

### トップレベル API

| API | 用途 |
|-----|------|
| `createPortal` | DOM の別の場所にレンダー |
| `flushSync` | 同期的な DOM 更新 |
| `preconnect` | サーバ事前接続 |
| `prefetchDNS` | DNS 事前フェッチ |
| `preload` | リソース事前ロード |
| `preloadModule` | モジュール事前ロード |
| `preinit` | リソース初期化 |
| `preinitModule` | モジュール初期化 |

[React DOM パッケージ全体の詳細 →](./reference/react-dom.md)

---

## 3. React のルール

高品質なアプリケーションを作成するための慣用的なパターンです。

### 主要なルール

#### コンポーネントとフックを純粋に保つ

純関数として実装することで、コードの理解とデバッグが容易になり、React が自動的に最適化できるようになります。

**重要なポイント:**
- レンダー中に外部の値を変更しない
- 同じ入力には同じ出力を返す
- 副作用は Effect 内で実行

```javascript
// ✅ 純粋なコンポーネント
function Greeting({ name }) {
  return <h1>Hello, {name}!</h1>;
}

// ❌ 純粋でないコンポーネント
let globalCount = 0;
function Counter() {
  globalCount++; // 外部の値を変更している
  return <div>{globalCount}</div>;
}
```

[詳細 → rules/components-and-hooks-must-be-pure.md](./reference/rules/components-and-hooks-must-be-pure.md)

#### React がコンポーネントとフックを呼び出す

React は宣言型です。コンポーネントやフックを呼び出すタイミングは React が決定します。

**重要なポイント:**
- コンポーネントを直接呼び出さない
- フックを条件分岐やループ内で呼び出さない
- React にレンダー制御を任せる

```javascript
// ✅ 正しい
function App() {
  return <Greeting name="Alice" />;
}

// ❌ 間違い
function App() {
  return Greeting({ name: "Alice" }); // コンポーネントを関数として呼び出している
}
```

[詳細 → rules/react-calls-components-and-hooks.md](./reference/rules/react-calls-components-and-hooks.md)

#### フックのルール

フックは特別な種類の再利用可能な UI ロジックで、呼び出せる場所に制約があります。

**フックのルール:**
1. トップレベルでのみ呼び出す
2. React 関数内でのみ呼び出す
3. カスタムフックは "use" で始める

```javascript
// ✅ 正しい
function MyComponent() {
  const [state, setState] = useState(0);
  const value = useContext(MyContext);

  if (state > 10) {
    // ロジック
  }

  return <div>{state}</div>;
}

// ❌ 間違い
function MyComponent() {
  if (someCondition) {
    const [state, setState] = useState(0); // 条件内でフックを呼び出している
  }
}
```

[詳細 → rules/rules-of-hooks.md](./reference/rules/rules-of-hooks.md)

### ツールによるサポート

- **ESLint プラグイン**: ルール違反を自動検出
- **Strict Mode**: 開発時の追加チェック
- **TypeScript**: 型安全性

[React のルール全体の詳細 →](./reference/rules.md)

---

## 4. React Server Components (RSC)

サーバとクライアントの境界を明確に定義し、効率的なレンダリングを実現します。

### 主な利点

- ✅ バンドルサイズの削減
- ✅ データアクセスの効率化
- ✅ 初期ページロードの高速化
- ✅ セキュリティの向上

### サーバコンポーネント

デフォルトではすべてのコンポーネントがサーバコンポーネントです。

**特徴:**
- サーバ側で実行
- データベースへの直接アクセス可能
- インタラクティブな機能は使用不可

```javascript
// サーバコンポーネント (デフォルト)
async function BlogPost({ id }) {
  const post = await db.posts.findById(id);

  return (
    <article>
      <h1>{post.title}</h1>
      <p>{post.content}</p>
    </article>
  );
}
```

[詳細 → rsc/server-components.md](./reference/rsc/server-components.md)

### クライアントコンポーネント

`'use client'` ディレクティブでマークされたコンポーネントです。

**特徴:**
- ブラウザで実行
- インタラクティブな機能を使用可能
- フック、イベントハンドラーが使える

```javascript
'use client';

import { useState } from 'react';

export default function Counter() {
  const [count, setCount] = useState(0);

  return (
    <button onClick={() => setCount(count + 1)}>
      Count: {count}
    </button>
  );
}
```

[詳細 → rsc/use-client.md](./reference/rsc/use-client.md)

### サーバ関数

`'use server'` ディレクティブでマークされた関数です。

**特徴:**
- クライアントから呼び出し可能
- サーバでのみ実行
- フォームアクションとして使用可能

```javascript
'use server';

export async function createNote(formData) {
  const title = formData.get('title');
  await db.notes.create({ title });
}
```

[詳細 → rsc/server-functions.md](./reference/rsc/server-functions.md)

### ディレクティブ

| ディレクティブ | 用途 | 使用場面 |
|-------------|------|----------|
| `'use client'` | クライアントコードをマーク | フック、イベントハンドラー |
| `'use server'` | サーバ関数をマーク | データベース操作、API キー |

[詳細 → rsc/directives.md](./reference/rsc/directives.md)

### コンポーネント構成パターン

#### サーバからクライアントへ

```javascript
// ServerPage.js (サーバコンポーネント)
import ClientButton from './ClientButton';

export default async function ServerPage() {
  const data = await fetchData();

  return (
    <div>
      <h1>サーバコンポーネント</h1>
      <ClientButton data={data} />
    </div>
  );
}
```

#### クライアントからサーバ関数へ

```javascript
// Form.js (クライアントコンポーネント)
'use client';

import { submitForm } from './actions';

export default function Form() {
  return (
    <form action={submitForm}>
      <input name="title" />
      <button type="submit">送信</button>
    </form>
  );
}
```

#### children としてサーバコンポーネントを渡す

```javascript
// Page.js (サーバコンポーネント)
import ClientWrapper from './ClientWrapper';
import ServerContent from './ServerContent';

export default function Page() {
  return (
    <ClientWrapper>
      <ServerContent /> {/* サーバで実行される */}
    </ClientWrapper>
  );
}
```

### セキュリティのベストプラクティス

1. **入力の検証**: すべての入力を検証
2. **認証と認可**: ユーザー権限を確認
3. **機密情報の保護**: クライアントに機密情報を返さない

[React Server Components 全体の詳細 →](./reference/rsc.md)

---

## 使用パターンガイド

### 1. クライアントサイドレンダリング (CSR)

```javascript
// index.js
import { createRoot } from 'react-dom/client';
import App from './App';

const root = createRoot(document.getElementById('root'));
root.render(<App />);
```

**用途**: SPA、管理画面、SEO が不要なアプリ

### 2. サーバサイドレンダリング (SSR)

```javascript
// server.js
import { renderToPipeableStream } from 'react-dom/server';

const { pipe } = renderToPipeableStream(<App />, {
  bootstrapScripts: ['/client.js'],
  onShellReady() {
    pipe(response);
  }
});

// client.js
import { hydrateRoot } from 'react-dom/client';
hydrateRoot(document.getElementById('root'), <App />);
```

**用途**: 公開サイト、ブログ、EC サイト

### 3. 静的サイト生成 (SSG)

```javascript
import { prerender } from 'react-dom/static';

async function generatePage() {
  const { prelude } = await prerender(<App />, {
    bootstrapScripts: ['/main.js']
  });
  return prelude;
}
```

**用途**: ドキュメント、ブログ、マーケティングサイト

### 4. React Server Components

```javascript
// サーバコンポーネント
async function Page() {
  const data = await fetchData();
  return <ClientComponent data={data} />;
}

// クライアントコンポーネント
'use client';
function ClientComponent({ data }) {
  const [state, setState] = useState(data);
  return <div onClick={() => setState(newValue)}>{state}</div>;
}
```

**用途**: Next.js App Router、最新のフルスタックアプリ

---

## ベストプラクティス

### 1. 適切な API を選択

- **CSR**: SEO 不要、インタラクティブなアプリ
- **SSR**: SEO 重要、動的コンテンツ
- **SSG**: 静的コンテンツ、高速なページロード
- **RSC**: フルスタックアプリ、サーバデータへの直接アクセス

### 2. パフォーマンス最適化

```javascript
// リソースプリロード
preload('/fonts/main.woff2', { as: 'font' });
preinit('/styles/critical.css', { as: 'style' });

// コンポーネントメモ化
const MemoizedComponent = memo(ExpensiveComponent);

// 計算のメモ化
const result = useMemo(() => expensiveCalc(data), [data]);

// 関数のメモ化
const handleClick = useCallback(() => {}, []);

// 低緊急度更新
startTransition(() => {
  setQuery(newQuery);
});
```

### 3. エラーハンドリング

```javascript
// エラーバウンダリ
<ErrorBoundary fallback={<Error />}>
  <App />
</ErrorBoundary>

// Suspense でのローディング
<Suspense fallback={<Loading />}>
  <AsyncComponent />
</Suspense>

// Effect でのクリーンアップ
useEffect(() => {
  const subscription = subscribe();
  return () => subscription.unsubscribe();
}, []);
```

### 4. TypeScript との統合

```typescript
import { FC, useState, useEffect } from 'react';

interface Props {
  userId: number;
}

const UserProfile: FC<Props> = ({ userId }) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    fetchUser(userId).then(setUser);
  }, [userId]);

  return <div>{user?.name}</div>;
};
```

---

## トラブルシューティング

### よくある問題と解決策

#### 1. ハイドレーションエラー

**問題**: サーバとクライアントの HTML が一致しない

**解決策**:
- 同じ props を使用
- 非決定的な値を避ける
- ブラウザ API は useEffect 内で使用

#### 2. 無限レンダリング

**問題**: コンポーネントが無限にレンダリングされる

**解決策**:
- useEffect の依存配列を正しく設定
- オブジェクトや配列は useMemo でメモ化

#### 3. メモリリーク

**問題**: アンマウント後の setState 呼び出し

**解決策**:
- Effect のクリーンアップ関数を実装
- マウント状態を追跡

---

## 関連リソース

### 主要ドキュメント

- [React パッケージ](./reference/react.md) - フック、コンポーネント、API
- [React DOM パッケージ](./reference/react-dom.md) - クライアント、サーバ、静的 API
- [React のルール](./reference/rules.md) - ベストプラクティスとルール
- [React Server Components](./reference/rsc.md) - RSC の詳細ガイド

### 学習リソース

- [Learn セクション](../learn.md) - React の基礎から応用まで
- [チュートリアル](../learn/installation.md) - ハンズオン学習
- [React の流儀](../learn/thinking-in-react.md) - React の考え方

### ツールとエコシステム

- **フレームワーク**: Next.js、Remix、Gatsby
- **状態管理**: Redux、Zustand、Jotai
- **スタイリング**: Tailwind CSS、CSS Modules、Styled Components
- **テスト**: Jest、React Testing Library、Playwright
- **型安全性**: TypeScript、Flow
