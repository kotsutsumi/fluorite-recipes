# Next.jsとのセットアップ

このドキュメントでは、ZustandをNext.jsで使用する方法を説明し、いくつかの主要な課題と推奨事項を強調しています。

## Next.jsでの課題

1. **リクエストごとのストア**: 「Next.jsサーバーは複数のリクエストを同時に処理できます。これは、ストアがリクエストごとに作成される必要があり、リクエスト間で共有されるべきではないことを意味します。」

2. **SSRフレンドリー**: 「Next.jsアプリケーションは2回レンダリングされます...クライアントとサーバーの両方で異なる出力を持つと、『ハイドレーションエラー』が発生します。」

3. **SPAルーティング**: Contextを使用してコンポーネントレベルでストアを初期化する必要があります

4. **サーバーキャッシング**: Next.js App Routerアーキテクチャと互換性があります

## 一般的な推奨事項

- **グローバルストアなし**: リクエストごとにストアを作成する
- **React Server Components**: ストアからの読み取りや書き込みを行うべきではありません

## 主要な実装ステップ

1. ストアファクトリー関数を作成する
2. コンテキストプロバイダーを使用してストアを提供する
3. 適切なメソッドでストアを初期化する
4. コンポーネントでストアを使用する

このドキュメントでは、以下の詳細なTypeScriptコード例を提供しています：
- TypeScriptの設定
- カウンターストアの作成
- ストアプロバイダーの設定
- ストアの初期化
- Pages RouterとApp Routerアーキテクチャでのストアの使用

このガイドでは、再レンダリングセーフなストアプロバイダーを作成し、サーバーサイドレンダリングでの問題を防ぐためにストアの初期化を慎重に処理することを強調しています。

## 実装例

### ストアの作成

```typescript
import { createStore } from 'zustand/vanilla'

export type CounterStore = {
  count: number
  increment: () => void
}

export const createCounterStore = () => {
  return createStore<CounterStore>()((set) => ({
    count: 0,
    increment: () => set((state) => ({ count: state.count + 1 })),
  }))
}
```

### コンテキストプロバイダーの設定

```typescript
'use client'

import { type ReactNode, createContext, useRef, useContext } from 'react'
import { type StoreApi, useStore } from 'zustand'
import { type CounterStore, createCounterStore } from './store'

export const CounterStoreContext = createContext<StoreApi<CounterStore> | null>(
  null,
)

export interface CounterStoreProviderProps {
  children: ReactNode
}

export const CounterStoreProvider = ({ children }: CounterStoreProviderProps) => {
  const storeRef = useRef<StoreApi<CounterStore>>()
  if (!storeRef.current) {
    storeRef.current = createCounterStore()
  }

  return (
    <CounterStoreContext.Provider value={storeRef.current}>
      {children}
    </CounterStoreContext.Provider>
  )
}

export const useCounterStore = <T,>(
  selector: (store: CounterStore) => T,
): T => {
  const counterStoreContext = useContext(CounterStoreContext)

  if (!counterStoreContext) {
    throw new Error(`useCounterStore must be used within CounterStoreProvider`)
  }

  return useStore(counterStoreContext, selector)
}
```

このパターンにより、Next.jsアプリケーションでZustandを安全に使用し、SSRとクライアントサイドのハイドレーションの両方で正しく動作させることができます。
