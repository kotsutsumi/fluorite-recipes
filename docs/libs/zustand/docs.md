# Zustand - Introduction

## Zustandの使い方

小規模、高速、スケーラブルなベアボーン状態管理ソリューション。Zustandはフックベースの使いやすいAPIを提供しています。ボイラープレートが不要で、過度に意見を押し付けることなく、明示的でFluxライクな構造を持つのに十分な規約があります。

可愛いからといって見くびらないでください。爪を持っています！恐ろしい[zombie child problem](https://react-redux.js.org/api/hooks#stale-props-and-zombie-children)、[React concurrency](https://github.com/bvaughn/rfcs/blob/useMutableSource/text/0000-use-mutable-source.md)、混在したレンダラー間の[context loss](https://github.com/facebook/react/issues/13332)など、一般的な落とし穴に対処するために多くの時間が費やされました。React領域でこれらすべてを正しく処理する唯一の状態管理ライブラリかもしれません。

ライブデモは[こちら](https://codesandbox.io/s/dazzling-moon-itop4)でお試しいただけます。

## インストール

ZustandはNPMでパッケージとして利用できます：

```bash
# NPM
npm install zustand
# または、お好みのパッケージマネージャーを使用してください。
```

## 最初にストアを作成する

ストアはフックです！プリミティブ、オブジェクト、関数など、何でも入れることができます。`set`関数は状態を*マージ*します。

```javascript
import { create } from 'zustand'

const useBear = create((set) => ({
  bears: 0,
  increasePopulation: () => set((state) => ({ bears: state.bears + 1 })),
  removeAllBears: () => set({ bears: 0 }),
  updateBears: (newBears) => set({ bears: newBears }),
}))
```

## コンポーネントをバインドする、これで完了！

プロバイダーを必要とせず、どこでもフックを使用できます。状態を選択すると、その状態が変更されたときに、消費しているコンポーネントが再レンダリングされます。

```jsx
function BearCounter() {
  const bears = useBear((state) => state.bears)
  return <h1>{bears} bears around here...</h1>
}

function Controls() {
  const increasePopulation = useBear((state) => state.increasePopulation)
  return <button onClick={increasePopulation}>one up</button>
}
```
