# React

React パッケージは、React をプログラム的に使用するための機能を提供します。フック、コンポーネント、API など、React アプリケーションの構築に必要なすべての要素が含まれています。

---

## 📋 クイックナビゲーション

| セクション | 概要 | API 数 | 詳細リンク |
|----------|------|--------|-----------|
| **フック** | コンポーネント内で使用する React の機能 | 18+ | [hooks.md](./react/hooks.md) |
| **コンポーネント** | JSX で使用できる組み込みコンポーネント | 6 | [components.md](./react/components.md) |
| **API** | コンポーネントを定義するための API | 10+ | [apis.md](./react/apis.md) |
| **レガシー** | 非推奨の API とレガシーパターン | 8 | [legacy.md](./react/legacy.md) |

---

## 1. React フック

フックを用いると、コンポーネントから様々な React の機能を使えるようになります。

### State フック

コンポーネントにデータを記憶させます。

| フック | 用途 | 使用例 |
|--------|------|--------|
| `useState` | 直接更新できる state 変数を定義 | `const [count, setCount] = useState(0)` |
| `useReducer` | リデューサ関数内に更新ロジックを持つ state 変数 | `const [state, dispatch] = useReducer(reducer, initialState)` |

**使用例:**

```javascript
function Counter() {
  const [count, setCount] = useState(0);

  return (
    <button onClick={() => setCount(count + 1)}>
      Count: {count}
    </button>
  );
}
```

### Context フック

Props を渡さずに遠くの親から情報を受け取ります。

| フック | 用途 |
|--------|------|
| `useContext` | context 値を読み取り、変更を受信 |

**使用例:**

```javascript
const ThemeContext = createContext('light');

function Button() {
  const theme = useContext(ThemeContext);
  return <button className={theme}>Click me</button>;
}
```

### Ref フック

レンダーに使用されない情報を保持します。

| フック | 用途 | 一般的な使用法 |
|--------|------|--------------|
| `useRef` | 任意の値を格納できる ref を宣言 | DOM ノード、タイマー ID |
| `useImperativeHandle` | 公開する ref をカスタマイズ | 親に特定のメソッドを公開 |

### Effect フック

コンポーネントを外部システムに接続し、同期します。

| フック | 用途 | 発火タイミング |
|--------|------|--------------|
| `useEffect` | 外部システムに接続 | レンダー後 |
| `useLayoutEffect` | レイアウト測定と同期変更 | ブラウザ再描画前 |
| `useInsertionEffect` | CSS-in-JS ライブラリ用 | React が DOM 変更前 |

**使用例:**

```javascript
function ChatRoom({ roomId }) {
  useEffect(() => {
    const connection = createConnection(roomId);
    connection.connect();
    return () => connection.disconnect();
  }, [roomId]);

  return <div>Chat room: {roomId}</div>;
}
```

### パフォーマンスフック

再レンダー時の不要な処理を減らします。

| フック | 用途 | キャッシュ対象 |
|--------|------|--------------|
| `useMemo` | 重い計算結果をキャッシュ | 計算結果の値 |
| `useCallback` | 関数定義をキャッシュ | 関数自体 |
| `useTransition` | state の遷移を非ブロッキングに | - |
| `useDeferredValue` | UI の更新を遅延 | 値 |

**使用例:**

```javascript
function SearchResults({ query }) {
  const deferredQuery = useDeferredValue(query);
  const results = useMemo(
    () => searchData(deferredQuery),
    [deferredQuery]
  );

  return <Results items={results} />;
}
```

### リソースフック

Promise や context などのリソースから値を読み取ります。

| フック | 用途 |
|--------|------|
| `use` | Promise や context から値を読み取る |

**使用例:**

```javascript
function Comments({ commentsPromise }) {
  const comments = use(commentsPromise);
  return comments.map(comment => <Comment key={comment.id} {...comment} />);
}
```

### その他のフック

主にライブラリ開発者向けのフックです。

| フック | 用途 |
|--------|------|
| `useDebugValue` | カスタムフックに React DevTools のラベルを追加 |
| `useId` | コンポーネントに一意の ID を関連付け |
| `useSyncExternalStore` | 外部ストアを購読 |

### サーバコンポーネント専用フック

| フック | 用途 |
|--------|------|
| `useActionState` | フォームアクションの結果に基づいて state を更新 |
| `useOptimistic` | フォームを楽観的に更新 |

[詳細ドキュメント → hooks.md](./react/hooks.md)

---

## 2. React コンポーネント

React は、JSX で使用できる組み込みコンポーネントを提供します。

### 組み込みコンポーネント一覧

| コンポーネント | 用途 | 主な機能 | 詳細リンク |
|--------------|------|----------|-----------|
| `<Fragment>` | 複数の JSX ノードをまとめる | `<>...</>` の省略記法 | [詳細](./react/Fragment.md) |
| `<Profiler>` | レンダーパフォーマンスを測定 | onRender コールバック | [詳細](./react/Profiler.md) |
| `<Suspense>` | 子のロード中にフォールバックを表示 | 非同期データフェッチ、遅延読み込み | [詳細](./react/Suspense.md) |
| `<StrictMode>` | 開発環境でバグを早期発見 | 追加チェック、二重レンダリング | [詳細](./react/StrictMode.md) |
| `<Activity>` | アクティビティ追跡 | ナビゲーション、トランジション追跡 | [詳細](./react/Activity.md) |
| `<ViewTransition>` | ビュー遷移の制御 | ページ遷移アニメーション | [詳細](./react/ViewTransition.md) |

**使用例:**

```javascript
// Fragment: 複数要素をグループ化
<>
  <Header />
  <Main />
  <Footer />
</>

// Suspense: 非同期コンポーネントのローディング
<Suspense fallback={<Loading />}>
  <LazyComponent />
</Suspense>

// StrictMode: 開発時の追加チェック
<StrictMode>
  <App />
</StrictMode>

// Profiler: パフォーマンス測定
<Profiler id="App" onRender={onRenderCallback}>
  <App />
</Profiler>
```

[詳細ドキュメント → components.md](./react/components.md)

---

## 3. React API

React パッケージが提供する、コンポーネント定義に役立つモダンな API です。

### Context 管理

| API | 用途 | 使用例 |
|-----|------|--------|
| `createContext` | Context を作成 | グローバル状態、テーマ、認証情報 |

**使用例:**

```javascript
const ThemeContext = createContext('light');

function App() {
  return (
    <ThemeContext.Provider value="dark">
      <Page />
    </ThemeContext.Provider>
  );
}

function Page() {
  const theme = useContext(ThemeContext);
  return <div className={theme}>Content</div>;
}
```

### 遅延読み込み

| API | 用途 | 使用例 |
|-----|------|--------|
| `lazy` | コンポーネントの遅延読み込み | コード分割、動的インポート |

**使用例:**

```javascript
const MarkdownPreview = lazy(() => import('./MarkdownPreview'));

function Editor() {
  return (
    <Suspense fallback={<Loading />}>
      <MarkdownPreview />
    </Suspense>
  );
}
```

### パフォーマンス最適化

| API | 用途 | 使用例 |
|-----|------|--------|
| `memo` | 同じ props での再レンダーをスキップ | 重いコンポーネント |
| `startTransition` | state 更新を低緊急度にマーク | UI をブロックしない更新 |
| `cache` | データフェッチ結果をキャッシュ | サーバコンポーネント |

**使用例:**

```javascript
// memo: 不要な再レンダーを防ぐ
const MemoizedComponent = memo(function ExpensiveComponent({ data }) {
  return <div>{/* 重い処理 */}</div>;
});

// startTransition: 緊急度の低い更新
function SearchPage() {
  const [query, setQuery] = useState('');

  function handleChange(e) {
    startTransition(() => {
      setQuery(e.target.value);
    });
  }

  return <input onChange={handleChange} />;
}

// cache: サーバコンポーネントでのキャッシュ
const getUser = cache(async (userId) => {
  return await db.user.findById(userId);
});
```

### テスト

| API | 用途 | 使用例 |
|-----|------|--------|
| `act` | テスト環境でレンダーをラップ | ユニットテスト、統合テスト |

### リソース API

| API | 用途 | 使用例 |
|-----|------|--------|
| `use` | Promise や context から値を読み取る | 非同期データ、Context |

### その他の API

| API | 用途 | 使用場面 |
|-----|------|----------|
| `captureOwnerStack` | コンポーネントのスタックトレースをキャプチャ | デバッグ、エラー追跡 |
| `experimental_taintObjectReference` | オブジェクトをクライアントに渡せないようにする | セキュリティ |
| `experimental_taintUniqueValue` | 特定の値をクライアントに渡せないようにする | セキュリティ |
| `addTransitionType` | トランジションタイプを追加 | カスタムトランジション |

[詳細ドキュメント → apis.md](./react/apis.md)

---

## 4. レガシー API

`react` パッケージからエクスポートされているが、新しいコードでは推奨されない API です。

### レガシー API 一覧

| API | 代替手段 | 備考 |
|-----|---------|------|
| `Children` | 直接子要素を操作 | children を配列として扱う |
| `cloneElement` | 別の要素を基に新しい要素を作成 | 代わりに props を使用 |
| `Component` | クラスコンポーネントを定義 | 関数コンポーネントを使用 |
| `createElement` | React 要素を作成 | JSX を使用 |
| `createRef` | ref オブジェクトを作成 | `useRef` を使用 |
| `forwardRef` | ref を親に公開 | 最新のパターンで使用可能 |
| `isValidElement` | 値が React 要素かチェック | 型チェックを使用 |
| `PureComponent` | 同じ props で再レンダーをスキップ | `memo` を使用 |

**React 19 で削除された API:**
- `createFactory` - 削除されました
- `propTypes` - TypeScript を使用
- `this.refs` - `useRef` を使用
- `getChildContext` - `createContext` を使用

**移行推奨:**

```javascript
// ❌ レガシー: クラスコンポーネント
class Counter extends Component {
  state = { count: 0 };
  render() {
    return <button onClick={() => this.setState({ count: this.state.count + 1 })}>
      {this.state.count}
    </button>;
  }
}

// ✅ モダン: 関数コンポーネント + フック
function Counter() {
  const [count, setCount] = useState(0);
  return <button onClick={() => setCount(count + 1)}>{count}</button>;
}

// ❌ レガシー: createRef
class MyComponent extends Component {
  constructor(props) {
    super(props);
    this.inputRef = createRef();
  }
  render() {
    return <input ref={this.inputRef} />;
  }
}

// ✅ モダン: useRef
function MyComponent() {
  const inputRef = useRef(null);
  return <input ref={inputRef} />;
}
```

[詳細ドキュメント → legacy.md](./react/legacy.md)

---

## React の使用パターン

### 基本的なコンポーネント

```javascript
import { useState, useEffect } from 'react';

function UserProfile({ userId }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUser(userId)
      .then(data => {
        setUser(data);
        setLoading(false);
      });
  }, [userId]);

  if (loading) return <div>Loading...</div>;
  return <div>{user.name}</div>;
}
```

### Context を使用したグローバル状態管理

```javascript
const AppContext = createContext(null);

function App() {
  const [state, setState] = useState({
    theme: 'light',
    user: null
  });

  return (
    <AppContext.Provider value={{ state, setState }}>
      <Router />
    </AppContext.Provider>
  );
}

function useAppContext() {
  const context = useContext(AppContext);
  if (!context) throw new Error('useAppContext must be used within App');
  return context;
}
```

### パフォーマンス最適化パターン

```javascript
// 1. memo でコンポーネントをメモ化
const ExpensiveList = memo(function ExpensiveList({ items }) {
  return items.map(item => <ExpensiveItem key={item.id} item={item} />);
});

// 2. useMemo で計算結果をメモ化
function SearchResults({ query, items }) {
  const filteredItems = useMemo(
    () => items.filter(item => item.name.includes(query)),
    [query, items]
  );

  return <List items={filteredItems} />;
}

// 3. useCallback で関数をメモ化
function Parent() {
  const handleClick = useCallback(() => {
    console.log('clicked');
  }, []);

  return <Child onClick={handleClick} />;
}

// 4. useTransition で緊急度の低い更新を実行
function SearchPage() {
  const [query, setQuery] = useState('');
  const [isPending, startTransition] = useTransition();

  function handleChange(e) {
    startTransition(() => {
      setQuery(e.target.value);
    });
  }

  return (
    <>
      <input onChange={handleChange} />
      {isPending && <Spinner />}
      <SearchResults query={query} />
    </>
  );
}
```

### サスペンスを使用した非同期処理

```javascript
// データフェッチを遅延読み込み
const UserProfile = lazy(() => import('./UserProfile'));

function App() {
  return (
    <Suspense fallback={<Loading />}>
      <UserProfile userId={123} />
    </Suspense>
  );
}

// 複数のサスペンス境界
function Page() {
  return (
    <div>
      <Header />
      <Suspense fallback={<Spinner />}>
        <Sidebar />
      </Suspense>
      <Suspense fallback={<Spinner />}>
        <MainContent />
      </Suspense>
    </div>
  );
}
```

---

## ベストプラクティス

### 1. フックのルールを守る

- **トップレベルでのみ呼び出す**: ループ、条件分岐、ネストした関数内では呼び出さない
- **React 関数内でのみ呼び出す**: 関数コンポーネントまたはカスタムフック内

```javascript
// ✅ 正しい
function MyComponent() {
  const [count, setCount] = useState(0);
  const value = useContext(MyContext);

  if (count > 10) {
    // ここで何かする
  }

  return <div>{count}</div>;
}

// ❌ 間違い
function MyComponent() {
  if (someCondition) {
    const [count, setCount] = useState(0); // 条件内でフックを呼び出している
  }
}
```

### 2. 状態の適切な配置

- **ローカル状態**: 単一コンポーネント内でのみ使用する状態は `useState`
- **共有状態**: 複数コンポーネントで使用する状態は Context または状態管理ライブラリ
- **サーバ状態**: サーバからのデータは React Query などの専用ライブラリ

### 3. パフォーマンス最適化は計測してから

```javascript
// ⚠️ 過度な最適化は避ける
// 最適化が必要かどうかを React DevTools Profiler で確認

// 最適化前
function TodoList({ todos }) {
  return todos.map(todo => <TodoItem key={todo.id} todo={todo} />);
}

// 最適化後 (必要な場合のみ)
const TodoList = memo(function TodoList({ todos }) {
  return todos.map(todo => <TodoItem key={todo.id} todo={todo} />);
});
```

### 4. Effect の依存配列を正しく設定

```javascript
// ✅ 正しい
useEffect(() => {
  fetchData(userId);
}, [userId]); // userId を依存配列に含める

// ❌ 間違い
useEffect(() => {
  fetchData(userId);
}, []); // userId が変わっても再実行されない
```

### 5. カスタムフックで ロジックを再利用

```javascript
// カスタムフック: useAsync
function useAsync(asyncFunction) {
  const [state, setState] = useState({
    loading: true,
    data: null,
    error: null
  });

  useEffect(() => {
    asyncFunction()
      .then(data => setState({ loading: false, data, error: null }))
      .catch(error => setState({ loading: false, data: null, error }));
  }, [asyncFunction]);

  return state;
}

// 使用例
function UserProfile({ userId }) {
  const { loading, data: user, error } = useAsync(
    () => fetchUser(userId)
  );

  if (loading) return <Loading />;
  if (error) return <Error error={error} />;
  return <div>{user.name}</div>;
}
```

---

## トラブルシューティング

### よくあるエラーと解決策

#### 1. フックのルール違反

**エラー**: "Rendered more hooks than during the previous render"

**原因**: 条件分岐やループ内でフックを呼び出している

**解決策**:
```javascript
// ❌ 間違い
function MyComponent({ showAdvanced }) {
  if (showAdvanced) {
    const [value, setValue] = useState('');
  }
}

// ✅ 正しい
function MyComponent({ showAdvanced }) {
  const [value, setValue] = useState('');

  if (!showAdvanced) return <BasicView />;
  return <AdvancedView value={value} onChange={setValue} />;
}
```

#### 2. 無限ループ

**エラー**: コンポーネントが無限にレンダリングされる

**原因**: useEffect の依存配列が毎回変わる

**解決策**:
```javascript
// ❌ 間違い
useEffect(() => {
  setData(processData(input));
}, [processData(input)]); // 毎回新しい値が作られる

// ✅ 正しい
const processedData = useMemo(() => processData(input), [input]);
useEffect(() => {
  setData(processedData);
}, [processedData]);
```

#### 3. メモリリーク

**エラー**: "Can't perform a React state update on an unmounted component"

**原因**: コンポーネントがアンマウント後に setState を呼び出している

**解決策**:
```javascript
useEffect(() => {
  let isMounted = true;

  fetchData().then(data => {
    if (isMounted) {
      setData(data);
    }
  });

  return () => {
    isMounted = false;
  };
}, []);
```

---

## 関連リソース

### 主要ドキュメント

- [フック](./react/hooks.md) - すべての React フックの詳細
- [コンポーネント](./react/components.md) - 組み込みコンポーネント
- [API](./react/apis.md) - React パッケージの API
- [レガシー](./react/legacy.md) - 非推奨の API

### フックの詳細ドキュメント

- [useState](./react/useState.md) - 状態管理
- [useEffect](./react/useEffect.md) - 副作用
- [useContext](./react/useContext.md) - Context
- [useRef](./react/useRef.md) - Ref
- [useMemo](./react/useMemo.md) - メモ化
- [useCallback](./react/useCallback.md) - 関数のメモ化
- [useReducer](./react/useReducer.md) - 複雑な状態管理
- [useTransition](./react/useTransition.md) - トランジション
- [useDeferredValue](./react/useDeferredValue.md) - 遅延値

### コンポーネントの詳細ドキュメント

- [Fragment](./react/Fragment.md)
- [Suspense](./react/Suspense.md)
- [StrictMode](./react/StrictMode.md)
- [Profiler](./react/Profiler.md)

### API の詳細ドキュメント

- [createContext](./react/createContext.md)
- [lazy](./react/lazy.md)
- [memo](./react/memo.md)
- [startTransition](./react/startTransition.md)
- [cache](./react/cache.md)
- [use](./react/use.md)
