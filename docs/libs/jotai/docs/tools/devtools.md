# Devtools

## インストール

```bash
npm install jotai-devtools
```

## 注意事項

- `<DevTools/>`は本番ビルド用にツリーシェイク可能に最適化されており、**非本番環境でのみ動作します**
- フックは開発専用で、非本番環境で動作するように設計されています
- フィードバックは[Jotai DevTools GitHubリポジトリ](https://github.com/jotaijs/jotai-devtools/discussions)で歓迎されます

## クイックリンク

- [UI Devtools](#ui-devtools)
- フック
  - [useAtomsDebugValue](#useatomsdebugvalue)
  - [useAtomDevtools](#useatomdevtools)
  - [useAtomsDevtools](#useatomsdevtools)
  - [useAtomsSnapshot](#useatomssnapshot)
  - [useGotoAtomsSnapshot](#usegotoatomssnapshot)

## UI DevTools

### Babelプラグインのセットアップ（オプションだが推奨）

```json
{
  "presets": [
    "jotai/babel/preset"
  ]
}
```

### Next.jsのセットアップ

```typescript
// next.config.ts
const nextConfig = {
  transpilePackages: ['jotai-devtools'],
}

module.exports = nextConfig
```

### 利用可能なプロパティ

```typescript
type DevToolsProps = {
  isInitialOpen?: boolean
  store?: Store
  theme?: 'dark' | 'light'
  position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left'
  nonce?: string
  options?: {
    shouldShowPrivateAtoms?: boolean
    shouldExpandJsonTreeViewInitially?: boolean
    timeTravelPlaybackInterval?: number
    snapshotHistoryLimit?: number
  }
}
```

### 使用方法

#### Provider-less

```jsx
import { DevTools } from 'jotai-devtools'
import 'jotai-devtools/styles.css'

const App = () => {
  return (
    <>
      <DevTools />
      {/* あなたのアプリケーション */}
    </>
  )
}
```

#### カスタムストア付き

```jsx
import { createStore } from 'jotai'
import { DevTools } from 'jotai-devtools'
import 'jotai-devtools/styles.css'

const customStore = createStore()

const App = () => {
  return (
    <>
      <DevTools store={customStore} />
      {/* あなたのアプリケーション */}
    </>
  )
}
```

## フック

### useAtomsDebugValue

Reactの`useDebugValue`と同様に、すべてのatomのデバッグ値を表示します。

```typescript
import { useAtomsDebugValue } from 'jotai-devtools/utils'

function DebugAtoms() {
  useAtomsDebugValue()
  return null
}
```

### useAtomDevtools

特定のatomにデバッグラベルを割り当て、React DevToolsでその値を検査します。

```typescript
import { useAtomDevtools } from 'jotai-devtools/utils'

function Counter() {
  const [count, setCount] = useAtom(countAtom)
  useAtomDevtools(countAtom, { name: 'count' })

  return <div>{count}</div>
}
```

### useAtomsDevtools

複数のatomをデバッグします。

```typescript
import { useAtomsDevtools } from 'jotai-devtools/utils'

function App() {
  useAtomsDevtools('app')
  return <div>アプリケーション</div>
}
```

### useAtomsSnapshot

現在のすべてのatom値のスナップショットを取得します。

```typescript
import { useAtomsSnapshot } from 'jotai-devtools/utils'

function DebugButton() {
  const atoms = useAtomsSnapshot()

  return (
    <button onClick={() => console.log(atoms)}>
      Atomをログ出力
    </button>
  )
}
```

### useGotoAtomsSnapshot

タイムトラベルデバッグのために、以前のスナップショットに戻ります。

```typescript
import { useGotoAtomsSnapshot } from 'jotai-devtools/utils'

function TimeTravel() {
  const goToSnapshot = useGotoAtomsSnapshot()

  return (
    <button onClick={() => goToSnapshot(previousSnapshot)}>
      巻き戻し
    </button>
  )
}
```

## 機能

### タイムトラベルデバッグ

Atomの状態変更を巻き戻しおよび再生できます。

### Atom検査

すべてのatom、その値、および依存関係を表示します。

### カスタマイズ可能なUI

テーマ、位置、およびさまざまな表示オプションをサポートします。

## ベストプラクティス

1. 本番環境では常にdevtoolsが除外されることを確認する
2. デバッグラベルにはBabelプリセットを使用する
3. パフォーマンスのために`shouldShowPrivateAtoms`を慎重に使用する
4. 大規模なアプリケーションではスナップショット履歴制限を設定する
