# デバッグ

このガイドでは、Jotai atomsをデバッグする方法を説明します。

## React Dev Toolsを使用したデバッグ

JotaiはReact Dev Toolsとシームレスに統合されています。開発モードでは、`useDebugValue`を使用してatom値を表示します。

### useAtomでのデバッグ

`useAtom`フックは自動的にReact Dev Toolsにatom値を表示します：

```javascript
import { atom, useAtom } from 'jotai'

const countAtom = atom(0)

function Counter() {
  const [count, setCount] = useAtom(countAtom)
  // React Dev Toolsでcountの値が表示されます
  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={() => setCount((c) => c + 1)}>+1</button>
    </div>
  )
}
```

### useAtomsDebugValueを使用する

コンポーネントツリー内のすべてのatom値をキャプチャするには、`useAtomsDebugValue`を使用します：

```javascript
import { useAtomsDebugValue } from 'jotai-devtools/utils'

function DebugAtoms() {
  useAtomsDebugValue()
  return null
}

function App() {
  return (
    <>
      <DebugAtoms />
      <Counter />
      <OtherComponents />
    </>
  )
}
```

これにより、React Dev Toolsですべてのatom値を一度に確認できます。

## Redux DevToolsを使用したデバッグ

より高度なデバッグ機能には、Redux DevTools統合を使用できます。

### useAtomDevtoolsで特定のatomをデバッグ

```javascript
import { atom, useAtom } from 'jotai'
import { useAtomDevtools } from 'jotai-devtools/utils'

const countAtom = atom(0)

function Counter() {
  const [count, setCount] = useAtom(countAtom)
  useAtomDevtools(countAtom)

  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={() => setCount((c) => c + 1)}>+1</button>
    </div>
  )
}
```

### useAtomsDevtoolsですべてのatomsをデバッグ

```javascript
import { useAtomsDevtools } from 'jotai-devtools/utils'

function App() {
  useAtomsDevtools('demo')

  return (
    <>
      <Counter />
      <OtherComponents />
    </>
  )
}
```

### Redux DevToolsの機能

Redux DevToolsを使用すると、以下の機能が利用できます：

- **タイムトラベル**：atom状態の履歴をさかのぼる
- **変更の一時停止**：atomの変更記録を一時停止
- **値のディスパッチ**：atom値を手動で設定
- **依存関係の表示**：atomの依存関係グラフを確認

## デバッグラベル

Atomsを区別しやすくするために、デバッグラベルを追加できます：

```javascript
const countAtom = atom(0)

if (process.env.NODE_ENV !== 'production') {
  countAtom.debugLabel = 'count'
}
```

これにより、デバッグツールでatomを識別しやすくなります。

### 複数のatomsにラベルを追加

```javascript
const userAtom = atom({ name: '', email: '' })
const postsAtom = atom([])
const settingsAtom = atom({ theme: 'light' })

if (process.env.NODE_ENV !== 'production') {
  userAtom.debugLabel = 'user'
  postsAtom.debugLabel = 'posts'
  settingsAtom.debugLabel = 'settings'
}
```

## Frozen Atoms（凍結されたAtoms）

意図しないオブジェクトの変更を検出するために、`freezeAtom`を使用できます：

```javascript
import { atom } from 'jotai'
import { freezeAtom } from 'jotai/utils'

const userAtom = freezeAtom(
  atom({ name: 'John', email: 'john@example.com' })
)

function UserProfile() {
  const [user, setUser] = useAtom(userAtom)

  // これはエラーになります（開発モードで）
  // user.name = 'Jane'

  // 正しい方法：新しいオブジェクトを作成
  const updateName = (newName) => {
    setUser({ ...user, name: newName })
  }

  return <div>{user.name}</div>
}
```

### freezeAtomCreatorを使用する

Atom作成関数全体を凍結することもできます：

```javascript
import { freezeAtomCreator } from 'jotai/utils'

const createFrozenAtom = freezeAtomCreator(atom)

const userAtom = createFrozenAtom({ name: 'John' })
const postsAtom = createFrozenAtom([])
```

## Jotai DevTools（拡張機能）

Jotai DevToolsは、ブラウザ拡張機能とReactコンポーネントの両方で利用できます。

### ブラウザ拡張機能のインストール

- [Chrome Web Store](https://chrome.google.com/webstore/detail/jotai-devtools)
- [Firefox Add-ons](https://addons.mozilla.org/firefox/addon/jotai-devtools)

### DevToolsコンポーネントの使用

```javascript
import { DevTools } from 'jotai-devtools'
import 'jotai-devtools/styles.css'

function App() {
  return (
    <>
      <DevTools />
      <Counter />
      <OtherComponents />
    </>
  )
}
```

### DevToolsの機能

- **Atom一覧**：すべてのatomsとその値を表示
- **依存関係グラフ**：atomの依存関係を視覚化
- **タイムトラベル**：状態の履歴をさかのぼる
- **値の編集**：atom値を直接編集

## デバッグのベストプラクティス

1. **デバッグラベルを追加する**：すべてのatomsに意味のあるラベルを付ける
2. **開発モードでのみデバッグツールを使用する**：本番環境ではデバッグコードを削除
3. **freezeAtomを使用する**：意図しない変更を早期に検出
4. **Redux DevToolsを活用する**：複雑な状態遷移のデバッグに使用
5. **小さなatomsを使用する**：デバッグしやすくなります

## トラブルシューティング

### Redux DevToolsが動作しない

1. Redux DevTools拡張機能がインストールされていることを確認
2. `useAtomsDevtools`または`useAtomDevtools`を使用していることを確認
3. 開発モードで実行していることを確認

### Atom値が表示されない

1. `useAtom`または`useAtomValue`を使用していることを確認
2. デバッグラベルが設定されていることを確認
3. React Dev Toolsが最新バージョンであることを確認

### Frozen Atomsのエラー

Frozen atomsは開発モードでのみ動作します。本番環境では通常のatomsとして動作します。

## パフォーマンスデバッグ

### 再レンダリングのトラッキング

```javascript
import { useEffect } from 'react'
import { useAtom } from 'jotai'

function Counter() {
  const [count, setCount] = useAtom(countAtom)

  useEffect(() => {
    console.log('Counter rendered with count:', count)
  })

  return <div>Count: {count}</div>
}
```

### React Profilerを使用する

```javascript
import { Profiler } from 'react'

function onRenderCallback(
  id,
  phase,
  actualDuration,
  baseDuration,
  startTime,
  commitTime
) {
  console.log(`${id} (${phase}) took ${actualDuration}ms`)
}

function App() {
  return (
    <Profiler id="App" onRender={onRenderCallback}>
      <Counter />
    </Profiler>
  )
}
```

## まとめ

Jotaiは、React Dev Tools、Redux DevTools、専用のJotai DevToolsなど、複数のデバッグ方法を提供します。デバッグラベル、frozen atoms、パフォーマンスプロファイリングを活用して、効率的にデバッグを行いましょう。
