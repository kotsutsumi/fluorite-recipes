# atomWithRefreshAndDefault

## モチベーション

`atomWithRefreshAndDefault`は、次のようなシナリオの解決策として導入されています：
- 派生atomが切断された後に再接続する必要がある場合
- 派生atomが元のatomに基づいてリセットされる必要がある場合
- リセットがシンプルで宣言的である必要がある場合

## 主要な概念

実装には以下が含まれます：
- `refreshCountAtom`
- ベースデータatom
- リフレッシュ状態を追跡するatom作成関数

## コード例

```javascript
const refreshCountAtom = atom(0)

const baseDataAtom = atom(1)

const dataAtom = atom(
  (get) => {
    get(refreshCountAtom)
    return get(baseDataAtom)
  },
  (get, set, update) => {
    set(baseDataAtom, update)
  },
)

const atomWithRefreshAndDefault = (refreshAtom, getDefault) => {
  const overwrittenAtom = atom(null)

  return atom(
    (get) => {
      const lastState = get(overwrittenAtom)

      if (lastState && lastState.refresh === get(refreshAtom)) {
        return lastState.value
      }

      return getDefault(get)
    },
    (get, set, update) => {
      set(overwrittenAtom, { refresh: get(refreshAtom), value: update })
    },
  )
}

// atomWithDefaultの代替
const refreshableAtom = atomWithRefreshAndDefault(
  refreshCountAtom,
  (get) => get(dataAtom) * 2,
)

// リセットメカニズム
const resetRootAtom = atom(null, (get, set) => {
  set(refreshCountAtom, get(refreshCountAtom) + 1)
})
```

このドキュメントでは、リフレッシュとデフォルト機能を備えた、より柔軟なatomを作成する方法について詳しく説明しています。
