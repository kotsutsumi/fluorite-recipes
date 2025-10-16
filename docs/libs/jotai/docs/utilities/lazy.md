# Lazy

## atomWithLazy

**Ref**: https://github.com/pmndrs/jotai/pull/2465

```ts
function atomWithLazy<Value>(
  makeInitial: () => Value,
): WritableAtom<Value, [SetStateAction<Value>], void>
```

`atomWithLazy`は、初期値の初期化を遅延させるprimitive atomを作成します。`makeInitial`関数は、ストアでatomが最初に使用されるまで呼び出されません。その後、値は通常のprimitive atomのように動作します。これは、`atom`コンストラクタの`init`引数に似ていますが、`init`の値がすぐに評価されるのに対し、`makeInitial`は遅延評価されます。

### パラメータ

**makeInitial** (必須): atomの初期値を返す関数

### 使用例

#### 基本的な使用法

高価な計算やリソースの初期化を遅延させる:

```jsx
import { useAtom } from 'jotai'
import { atomWithLazy } from 'jotai/utils'

const imageDataAtom = atomWithLazy(() => initializeExpensiveImage())

function ImageEditor() {
  // このコンポーネントがレンダリングされるときにのみ初期化されます
  const [imageData, setImageData] = useAtom(imageDataAtom)
  // ...
}
```

`imageDataAtom`は`ImageEditor`コンポーネントがマウントされるまで初期化されません。

#### 複数のストアでの動作

複数のストアを使用している場合、各ストアは独自にatomを初期化します:

```jsx
import { createStore } from 'jotai'
import { atomWithLazy } from 'jotai/utils'

const countAtom = atomWithLazy(() => Math.random())

const store1 = createStore()
const store2 = createStore()

// 各ストアは独自の初期値を取得します
store1.get(countAtom) // 例: 0.123
store2.get(countAtom) // 例: 0.456
```

#### 通常のatomとの比較

```jsx
import { atom } from 'jotai'
import { atomWithLazy } from 'jotai/utils'

// 通常のatom - すぐに初期化されます
const eagerAtom = atom(computeExpensiveValue())

// lazy atom - 最初の使用時に初期化されます
const lazyAtom = atomWithLazy(() => computeExpensiveValue())
```

`eagerAtom`では、`computeExpensiveValue()`はatomが定義されたときにすぐに実行されます。`lazyAtom`では、atomが最初に読み取られるまで実行されません。

### 使用上の注意

- `makeInitial`はストアごとに正確に1回呼び出されます
- 初期化後、atomは通常のprimitive atomと同様に動作します
- 複数のストアを作成する場合、各ストアは独自の初期化を受けます
