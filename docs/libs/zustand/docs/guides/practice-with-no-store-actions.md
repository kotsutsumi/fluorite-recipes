---
title: ストア外でのアクション定義
nav: 6
---

# ストア外でのアクション定義

推奨されるアプローチは、アクションと状態をストア内に配置することです。

例:

```javascript
export const useBoundStore = create((set) => ({
  count: 0,
  text: 'hello',
  inc: () => set((state) => ({ count: state.count + 1 })),
  setText: (text) => set({ text }),
}))
```

## 代替アプローチ

これにより、モジュールレベルでストアの外部にアクションを定義できます。

```javascript
export const useBoundStore = create(() => ({
  count: 0,
  text: 'hello',
}))

export const inc = () =>
  useBoundStore.setState((state) => ({ count: state.count + 1 }))

export const setText = (text) => useBoundStore.setState({ text })
```

### 利点

- アクションを呼び出すのにフックを必要としません
- コード分割を容易にします

### トレードオフ

このパターンには欠点はありませんが、カプセル化の性質上、配置による方法を好む人もいます。
