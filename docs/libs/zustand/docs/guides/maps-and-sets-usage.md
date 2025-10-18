---
title: MapとSetの使用方法
nav: 10
---

# MapとSetの使用方法

## 概要

MapとSetは可変なデータ構造です。Zustandで使用するには、更新時に新しいインスタンスを作成する必要があります。

## Mapの使用方法

### Mapの読み取り

```typescript
const foo = useSomeStore((state) => state.foo)
```

### Mapの更新

常に新しいMapインスタンスを作成してください:

```typescript
// 単一エントリの更新
set((state) => ({
  foo: new Map(state.foo).set(key, value),
}))

// エントリの削除
set((state) => {
  const next = new Map(state.foo)
  next.delete(key)
  return { foo: next }
})

// 複数エントリの更新
set((state) => {
  const next = new Map(state.foo)
  next.set('key1', 'value1')
  next.set('key2', 'value2')
  return { foo: next }
})

// クリア
set({ foo: new Map() })
```

## Setの使用方法

### Setの読み取り

```typescript
const bar = useSomeStore((state) => state.bar)
```

### Setの更新

常に新しいSetインスタンスを作成してください:

```typescript
// アイテムの追加
set((state) => ({
  bar: new Set(state.bar).add(item),
}))

// アイテムの削除
set((state) => {
  const next = new Set(state.bar)
  next.delete(item)
  return { bar: next }
})

// アイテムのトグル
set((state) => {
  const next = new Set(state.bar)
  next.has(item) ? next.delete(item) : next.add(item)
  return { bar: next }
})

// クリア
set({ bar: new Set() })
```

## なぜ新しいインスタンスが必要なのか？

Zustandは参照を比較することで変更を検出します。MapやSetを変更しても、その参照は変わりません:

```typescript
// ❌ 間違い - 同じ参照のため、再レンダリングされない
set((state) => {
  state.foo.set(key, value)
  return { foo: state.foo }
})

// ✅ 正しい - 新しい参照なので、再レンダリングされる
set((state) => ({
  foo: new Map(state.foo).set(key, value),
}))
```
