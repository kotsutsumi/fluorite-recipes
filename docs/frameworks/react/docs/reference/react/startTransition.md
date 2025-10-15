# startTransition

`startTransition` を使うことで、UI をブロックせずに state を更新できます。

## リファレンス

```javascript
startTransition(action)
```

### パラメータ

- **`action`**: 1つ以上の state 更新を呼び出す関数。React は引数なしで `action` を即座に呼び出し、`action` の実行中に同期的にスケジュールされたすべての state 更新をトランジションとしてマークします

### 返り値

`startTransition` は何も返しません。

## 使用法

### state 更新を非ブロッキングなトランジションとしてマーク

```javascript
import { startTransition } from 'react';

function TabContainer() {
  const [tab, setTab] = useState('about');

  function selectTab(nextTab) {
    startTransition(() => {
      setTab(nextTab);
    });
  }

  return (
    <>
      <button onClick={() => selectTab('about')}>About</button>
      <button onClick={() => selectTab('posts')}>Posts</button>
      <button onClick={() => selectTab('contact')}>Contact</button>
      <hr />
      {tab === 'about' && <AboutTab />}
      {tab === 'posts' && <PostsTab />}
      {tab === 'contact' && <ContactTab />}
    </>
  );
}
```

### 主な利点

トランジションを使用することで、遅いデバイスでもユーザインターフェースの更新をレスポンシブに保つことができます。

```javascript
// ❌ トランジションなし: UI がブロックされる
function handleClick() {
  setTab('posts'); // 遅い場合、UI が固まる
}

// ✅ トランジションあり: UI がレスポンシブ
function handleClick() {
  startTransition(() => {
    setTab('posts'); // バックグラウンドで実行
  });
}
```

### 中断可能な再レンダー

トランジションは中断可能です。ユーザーが連続してクリックした場合、React は前のトランジションを中断し、最新のものを優先します。

```javascript
function SearchResults() {
  const [query, setQuery] = useState('');

  function handleChange(e) {
    startTransition(() => {
      setQuery(e.target.value);
    });
  }

  return (
    <>
      <input onChange={handleChange} />
      <Results query={query} />
    </>
  );
}
```

## useTransition との違い

`startTransition` と `useTransition` の主な違い:

```javascript
// startTransition: isPending フラグなし
function handleClick() {
  startTransition(() => {
    setTab(nextTab);
  });
}

// useTransition: isPending フラグあり
function handleClick() {
  const [isPending, startTransition] = useTransition();

  startTransition(() => {
    setTab(nextTab);
  });

  // isPending を使用してローディング状態を表示可能
  return isPending ? <Spinner /> : null;
}
```

**いつ使い分けるか:**
- **`useTransition`**: コンポーネント内で保留状態を追跡したい場合
- **`startTransition`**: コンポーネント外から呼び出す場合や、保留状態が不要な場合

## 重要な注意事項

### トランジション内の state 更新のみマーク

```javascript
startTransition(() => {
  setPage('/about'); // ✅ トランジションとしてマークされる
});
```

### 同期的な関数のみ

`action` 関数は同期的である必要があります。

```javascript
// ❌ 間違い: 非同期関数
startTransition(async () => {
  await someAsyncFunction();
  setPage('/about');
});

// ✅ 正しい: 同期的な関数
async function handleClick() {
  await someAsyncFunction();
  startTransition(() => {
    setPage('/about');
  });
}
```

### テキスト入力の制御には使用できない

```javascript
// ❌ 間違い: 入力が遅延する
const [text, setText] = useState('');

function handleChange(e) {
  startTransition(() => {
    setText(e.target.value);
  });
}

// ✅ 正しい: 入力は即座に更新、検索は遅延
const [text, setText] = useState('');
const [deferredText, setDeferredText] = useState('');

function handleChange(e) {
  setText(e.target.value); // 即座に更新
  startTransition(() => {
    setDeferredText(e.target.value); // トランジションで更新
  });
}
```

## 使用例

### タブの切り替え

```javascript
function Tabs() {
  const [tab, setTab] = useState('home');

  return (
    <div>
      <button onClick={() => startTransition(() => setTab('home'))}>
        Home
      </button>
      <button onClick={() => startTransition(() => setTab('posts'))}>
        Posts
      </button>
      <button onClick={() => startTransition(() => setTab('profile'))}>
        Profile
      </button>

      {tab === 'home' && <HomePage />}
      {tab === 'posts' && <PostsPage />}
      {tab === 'profile' && <ProfilePage />}
    </div>
  );
}
```

### ルートナビゲーション

```javascript
function navigate(url) {
  startTransition(() => {
    setCurrentPage(url);
  });
}

<Link onClick={() => navigate('/about')}>About</Link>
```

### 検索結果の更新

```javascript
function SearchPage() {
  const [query, setQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);

  function handleSearch(newQuery) {
    setQuery(newQuery); // 即座に更新

    startTransition(() => {
      // 重い計算をバックグラウンドで実行
      const results = performExpensiveSearch(newQuery);
      setSearchResults(results);
    });
  }

  return (
    <>
      <SearchInput value={query} onChange={handleSearch} />
      <SearchResults results={searchResults} />
    </>
  );
}
```

## ベストプラクティス

- 重いレンダリングや計算にトランジションを使用
- ユーザー入力には直接的な state 更新を使用
- 可能な限り `useTransition` を使用して保留状態を表示
- Suspense と組み合わせて使用し、既存のコンテンツを保持
