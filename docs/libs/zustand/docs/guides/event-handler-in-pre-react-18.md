---
title: React 18以前でのイベントハンドラ外でのアクション呼び出し
nav: 9
---

# React 18以前でのイベントハンドラ外でのアクション呼び出し

React 18以前では、Reactイベントハンドラの外で `setState` を呼び出すと、同期的なコンポーネント更新が発生する可能性があります。

## 問題

これにより「ゾンビチャイルド」効果が発生する可能性があります。

## 解決策

この問題を修正するには、アクションを `unstable_batchedUpdates` でラップします。

```javascript
import { unstable_batchedUpdates } from 'react-dom' // または 'react-native'

const useFishStore = create((set) => ({
  fishes: 0,
  increaseFishes: () => set((prev) => ({ fishes: prev.fishes + 1 })),
}))

const nonReactCallback = () => {
  unstable_batchedUpdates(() => {
    useFishStore.getState().increaseFishes()
  })
}
```

## 詳細情報

詳細については、以下のGitHub issueを参照してください:
https://github.com/pmndrs/zustand/issues/302
