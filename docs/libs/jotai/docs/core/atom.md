# atom

`atom`関数は、Reactの状態管理のためのアトム設定を作成します。

## 主な機能

### アトムの作成

1. プリミティブアトム
```javascript
const priceAtom = atom(10)
const messageAtom = atom('hello')
const productAtom = atom({ id: 12, name: 'good stuff' })
```

2. 派生アトム（3つのパターン）:
- 読み取り専用アトム
- 書き込み専用アトム
- 読み書きアトム

### 派生アトムの例

```javascript
// 読み取り専用アトム
const readOnlyAtom = atom((get) => get(priceAtom) * 2)

// 書き込み専用アトム
const writeOnlyAtom = atom(
  null,
  (get, set, update) => {
    set(priceAtom, get(priceAtom) - update.discount)
  }
)

// 読み書きアトム
const readWriteAtom = atom(
  (get) => get(priceAtom) * 2,
  (get, set, newPrice) => {
    set(priceAtom, newPrice / 2)
  }
)
```

### 重要な注意事項

- レンダー関数内でアトムを作成する場合は`useMemo`または`useRef`が必要です
- アトム設定は不変オブジェクトです
- プリミティブアトムは常に書き込み可能です

### 高度な機能

- デバッグ用の`debugLabel`
- ライフサイクルメソッド`onMount`
- `signal`と`setSelf`オプションを持つ高度なread関数

### シグネチャ

```typescript
// プリミティブアトム
function atom<Value>(initialValue: Value): PrimitiveAtom<Value>

// 読み取り専用アトム
function atom<Value>(read: (get: Getter) => Value): Atom<Value>

// 書き込み可能な派生アトム
function atom<Value, Args, Result>(
  read: (get: Getter) => Value,
  write: (get: Getter, set: Setter, ...args: Args) => Result
): WritableAtom<Value, Args, Result>
```

### 非同期フェッチの例

```javascript
const userIdAtom = atom(async (get) => {
  const response = await fetch('/api/user')
  const data = await response.json()
  return data.id
})
```

## まとめ

`atom`関数は、Jotaiの状態管理における基本的な構成要素であり、プリミティブな値から複雑な派生状態まで、柔軟な状態管理を可能にします。
