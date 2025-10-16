# Zustand の Immer ミドルウェア

## 概要
Zustand の Immer ミドルウェアにより、開発者は「ボイラープレートコードなしでストア内の不変更新を実行」できます。

## 主な機能
- 不変の状態更新を簡素化
- 手動でのオブジェクトのコピーを削減
- 状態ドラフトの直接変更を許可

## インストール
```typescript
import { immer } from 'zustand/middleware/immer'
```

## 重要な注意事項
「`zustand/middleware/immer` から `immer` を使用するには、`immer` ライブラリをインストールする必要があります。」

## 使用例
```typescript
const personStore = createStore<PersonStore>()(
  immer((set) => ({
    person: {
      firstName: 'Barbara',
      lastName: 'Hepworth',
      email: 'bhepworth@sculpture.com',
    },
    setPerson: (nextPerson) =>
      set((state) => {
        state.person =
          typeof nextPerson === 'function'
            ? nextPerson(state.person)
            : nextPerson
      }),
  }))
)
```

## 型シグネチャ
```typescript
immer<T>(stateCreatorFn: StateCreator<T, [], []>):
  StateCreator<T, [['zustand/immer', never]], []>
```

## メリット
- 手動でのオブジェクトのスプレッド構文が不要に
- ネストされた状態を更新するより直感的な方法を提供
- 不変更新のためのボイラープレートコードを削減
