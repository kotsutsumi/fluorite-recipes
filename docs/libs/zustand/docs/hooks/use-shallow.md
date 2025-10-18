---
title: 'useShallow'
section: 'Hooks'
description: 'シャロー比較を使用してセレクター関数をメモ化する'
---

# `useShallow` ⚛️

## 概要

`useShallow` は、シャロー比較を使用してセレクター関数をメモ化することで、再レンダリングを最適化するのに役立つ React フックです。

## シグネチャ

```typescript
useShallow<T, U = T>(selectorFn: (state: T) => U): (state: T) => U
```

## 使用例

### ストアの作成

```typescript
type BearFamilyMealsStore = {
  [key: string]: string
}

const useBearFamilyMealsStore = create<BearFamilyMealsStore>()(() => ({
  papaBear: 'large porridge-pot',
  mamaBear: 'middle-size porridge pot',
  babyBear: 'A little, small, wee pot',
}))
```

### 最適化されたコンポーネント

```typescript
function BearNames() {
  const names = useBearFamilyMealsStore(
    useShallow((state) => Object.keys(state))
  )

  return <div>{names.join(', ')}</div>
}
```

## 主な利点

- 不必要な再レンダリングを防止します
- セレクター関数のシャロー比較を提供します
- React コンポーネントのパフォーマンスを最適化するのに役立ちます

## 重要な注意事項

- `useShallow` を使用しないと、特定のデータが変更されていない場合でも、コンポーネントが再レンダリングされる可能性があります
- 複雑な状態管理シナリオで役立ちます
- `zustand/react/shallow` からインポートします
