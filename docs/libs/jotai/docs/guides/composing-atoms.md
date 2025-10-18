# Atomの組み合わせ

このドキュメントでは、Jotaiでatomを柔軟な方法で作成および組み合わせる方法を探ります。

## 主要な概念

### 基本的な派生Atom

- atomは他のatomから派生させることができます
- 既存のatomから値を取得することで、読み取り専用atomを作成できます
- atomは読み取り関数と書き込み関数を持つことができます

### 例: 読み取り専用の派生Atom

```javascript
import { atom } from 'jotai'

export const textAtom = atom('hello')
export const textLenAtom = atom((get) => get(textAtom).length)
```

この例では、`textLenAtom`は`textAtom`から派生し、テキストの長さを返します。

### 例: 書き込み可能な派生Atom

```javascript
const textAtom = atom('hello')

export const textUpperCaseAtom = atom(
  (get) => get(textAtom).toUpperCase(),
  (get, set, newText) => set(textAtom, newText)
)
```

この例では、`textUpperCaseAtom`は大文字のテキストを返しますが、元の`textAtom`に書き込むこともできます。

## 高度なテクニック

### デフォルト値のオーバーライド

デフォルト値をオーバーライドできる複雑なatomを作成します。

```javascript
const overwrittenAtom = atom(null)

export const effectiveAtom = atom(
  (get) => get(overwrittenAtom) ?? get(originalAtom),
  (get, set, update) => {
    // カスタムロジック
    set(overwrittenAtom, update)
  }
)
```

`atomWithDefault`ユーティリティを使用することもできます:

```javascript
import { atomWithDefault } from 'jotai/utils'

export const effectiveAtom = atomWithDefault((get) => {
  const overwritten = get(overwrittenAtom)
  if (overwritten !== null) return overwritten
  return get(originalAtom)
})
```

### 外部値との同期

`localStorage`と同期するatomを作成します。

```javascript
const baseAtom = atom(localStorage.getItem('myKey') || 'default')

export const persistedAtom = atom(
  (get) => get(baseAtom),
  (get, set, newValue) => {
    set(baseAtom, newValue)
    localStorage.setItem('myKey', newValue)
  }
)
```

または、`atomWithStorage`ユーティリティを使用します:

```javascript
import { atomWithStorage } from 'jotai/utils'

export const persistedAtom = atomWithStorage('myKey', 'default')
```

### アクションAtom

特定のアクションのための書き込み専用atomを作成します。

```javascript
export const decrementCountAtom = atom(null, (get, set) => {
  set(countAtom, get(countAtom) - 1)
})

export const incrementCountAtom = atom(null, (get, set) => {
  set(countAtom, get(countAtom) + 1)
})
```

コンポーネントでの使用:

```javascript
const [, decrement] = useAtom(decrementCountAtom)
const [, increment] = useAtom(incrementCountAtom)

return (
  <div>
    <button onClick={decrement}>-1</button>
    <button onClick={increment}>+1</button>
  </div>
)
```

### 非同期アクション

非同期ロジックを持つアクションatomを作成します。

```javascript
export const fetchUserAtom = atom(null, async (get, set, userId) => {
  const response = await fetch(`https://api.example.com/users/${userId}`)
  const userData = await response.json()
  set(userAtom, userData)
})
```

## 重要なポイント

> **「Atomはビルディングブロックです。他のatomに基づいてatomを組み合わせることで、複雑なロジックを実装できます。」**

このドキュメントは、状態管理プリミティブを作成および組み合わせる際のJotaiの柔軟性を強調しています。

## atomの組み合わせのベストプラクティス

1. **シンプルに保つ**: 各atomは単一の責任を持つべきです
2. **派生を活用**: 既存のatomから新しいatomを作成します
3. **アクションを分離**: 書き込み専用atomを使用して状態変更をカプセル化します
4. **ストレージを統合**: ユーティリティを使用して永続化を処理します
5. **非同期を受け入れる**: atomは非同期操作を自然にサポートします

Jotaiのatomベースのアーキテクチャは、スケーラブルで保守可能な状態管理ソリューションを可能にします。
