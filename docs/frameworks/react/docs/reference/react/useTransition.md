# useTransition

`useTransition` は、UI をブロックせずに state を更新するための React フックです。

## リファレンス

```javascript
const [isPending, startTransition] = useTransition()
```

### パラメータ

`useTransition` は引数を取りません。

### 返り値

1. **`isPending`**: 保留中のトランジションがあるかどうかを示すフラグ
2. **`startTransition`**: state 更新をトランジションとしてマークする関数

## 使用法

### state の更新をノンブロッキングなトランジションとしてマーク

```javascript
function TabContainer() {
  const [isPending, startTransition] = useTransition();
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
      {isPending && <div>Loading...</div>}
      {tab === 'about' && <AboutTab />}
      {tab === 'posts' && <PostsTab />}
      {tab === 'contact' && <ContactTab />}
    </>
  );
}
```

### トランジションで親コンポーネントを更新

```javascript
function TabButton({ children, onClick }) {
  const [isPending, startTransition] = useTransition();

  function handleClick() {
    startTransition(() => {
      onClick();
    });
  }

  if (isPending) {
    return <button disabled>{children} (Loading...)</button>;
  }

  return (
    <button onClick={handleClick}>
      {children}
    </button>
  );
}
```

### トランジション中に保留中の視覚的状態を表示

```javascript
function App() {
  const [isPending, startTransition] = useTransition();
  const [tab, setTab] = useState('about');

  function selectTab(nextTab) {
    startTransition(() => {
      setTab(nextTab);
    });
  }

  return (
    <>
      <TabButton
        isActive={tab === 'about'}
        onClick={() => selectTab('about')}
      >
        About
      </TabButton>
      <div style={{ opacity: isPending ? 0.5 : 1 }}>
        {tab === 'about' && <AboutTab />}
        {tab === 'posts' && <PostsTab />}
        {tab === 'contact' && <ContactTab />}
      </div>
    </>
  );
}
```

### 不要なローディングインジケータを防ぐ

```javascript
function App() {
  const [page, setPage] = useState('home');

  function navigate(url) {
    startTransition(() => {
      setPage(url);
    });
  }

  return (
    <>
      <Suspense fallback={<Spinner />}>
        {page === 'home' && <HomePage />}
        {page === 'about' && <AboutPage />}
      </Suspense>
    </>
  );
}
```

トランジションを使用することで、Suspense のフォールバックが表示される前に、既存のコンテンツを保持できます。

### Suspense 対応ルータの構築

React フレームワークやルータを構築している場合、ページナビゲーションをトランジションとしてマークすることを推奨します。

```javascript
function Router() {
  const [page, setPage] = useState('/');
  const [isPending, startTransition] = useTransition();

  function navigate(url) {
    startTransition(() => {
      setPage(url);
    });
  }

  // ルータの実装
}
```

## 主な利点

### ノンブロッキングな更新

トランジションを使用すると、遅いデバイスでも UI がレスポンシブに保たれます。

### 中断可能

ユーザーがトランジション中に別のアクションを実行した場合、React は進行中のトランジションを中断します。

### 不要なローディング状態を回避

既存のコンテンツを表示しながら、バックグラウンドで新しいコンテンツを準備します。

## トラブルシューティング

### トランジション内で入力フィールドを更新できない

トランジション内では、入力フィールドを制御する state 変数を更新できません。

```javascript
// ❌ 間違い
const [text, setText] = useState('');

function handleChange(e) {
  startTransition(() => {
    setText(e.target.value); // 入力が遅延する
  });
}

// ✅ 正しい: 2つの state に分ける
const [text, setText] = useState('');
const [deferredText, setDeferredText] = useState('');

function handleChange(e) {
  setText(e.target.value); // 即座に更新
  startTransition(() => {
    setDeferredText(e.target.value); // トランジションで更新
  });
}
```

### React が state 更新をトランジションとして扱わない

`startTransition` に渡す関数は同期的である必要があります:

```javascript
// ❌ 間違い: 非同期
startTransition(async () => {
  await someAsyncFunction();
  setPage('/about');
});

// ✅ 正しい: 同期的
startTransition(() => {
  setPage('/about');
});

// 非同期処理が必要な場合
async function handleClick() {
  await someAsyncFunction();
  startTransition(() => {
    setPage('/about');
  });
}
```

### useTransition の外から startTransition を呼び出したい

コンポーネントの外から `startTransition` を呼び出す必要がある場合は、スタンドアロンの `startTransition` を使用してください。

```javascript
import { startTransition } from 'react';

function someFunction() {
  startTransition(() => {
    // state の更新
  });
}
```

## ベストプラクティス

- ユーザー入力には直接的な state 更新を使用
- 重い計算や遅いレンダリングにはトランジションを使用
- `isPending` を活用して視覚的フィードバックを提供
- Suspense と組み合わせて使用する場合は、既存コンテンツの保持を検討

## startTransition との違い

`useTransition` と `startTransition` の主な違い:
- `useTransition` は `isPending` フラグを提供
- `useTransition` はコンポーネント内でのみ使用可能
- `startTransition` はどこからでも呼び出し可能(ただし `isPending` フラグがない)
