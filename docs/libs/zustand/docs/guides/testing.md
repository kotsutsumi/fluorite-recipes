---
title: テスト
description: テストの書き方
nav: 8
---

## テスト環境のセットアップ

### テストランナー

通常、テストランナーはJavaScript/TypeScript構文を実行するように設定する必要があります。UIコンポーネントをテストする場合は、モックDOM環境を提供するためにJSDOMを使用するようにテストランナーを設定する必要がある可能性があります。

テストランナーの設定手順については、以下のリソースを参照してください:

- **Jest**
  - [Jest: Getting Started](https://jestjs.io/docs/getting-started)
  - [Jest: Configuration - Test Environment](https://jestjs.io/docs/configuration#testenvironment-string)
- **Vitest**
  - [Vitest: Getting Started](https://vitest.dev/guide)
  - [Vitest: Configuration - Test Environment](https://vitest.dev/config/#environment)

### UIとネットワークテストツール

**Zustandに接続するReactコンポーネントをテストするには、[React Testing Library (RTL)](https://testing-library.com/docs/react-testing-library/intro)の使用を推奨します**。RTLは、優れたテスト慣行を促進するシンプルで完全なReact DOMテストユーティリティです。ReactDOMの `render` 関数と `react-dom/tests-utils` の `act` を使用します。さらに、[Native Testing Library (RNTL)](https://testing-library.com/docs/react-native-testing-library/intro)は、React NativeコンポーネントをテストするためのRTLの代替です。[Testing Library](https://testing-library.com/)ファミリーのツールには、他の多くの人気のあるフレームワーク用のアダプターも含まれています。

また、ネットワークリクエストをモックするために[Mock Service Worker (MSW)](https://mswjs.io/)の使用を推奨します。これにより、テストを書く際にアプリケーションロジックを変更またはモックする必要がなくなります。

- **React Testing Library (DOM)**
  - [DOM Testing Library: Setup](https://testing-library.com/docs/dom-testing-library/setup)
  - [React Testing Library: Setup](https://testing-library.com/docs/react-testing-library/setup)
  - [Testing Library Jest-DOM Matchers](https://testing-library.com/docs/ecosystem-jest-dom)
- **Native Testing Library (React Native)**
  - [Native Testing Library: Setup](https://testing-library.com/docs/react-native-testing-library/setup)
- **User Event Testing Library (DOM)**
  - [User Event Testing Library: Setup](https://testing-library.com/docs/user-event/setup)
- **TypeScript for Jest**
  - [TypeScript for Jest: Setup](https://kulshekhar.github.io/ts-jest/docs/getting-started/installation)
- **TypeScript for Node**
  - [TypeScript for Node: Setup](https://typestrong.org/ts-node/docs/installation)
- **Mock Service Worker**
  - [MSW: Installation](https://mswjs.io/docs/getting-started/install)
  - [MSW: Setting up mock requests](https://mswjs.io/docs/getting-started/mocks/rest-api)
  - [MSW: Mock server configuration for Node](https://mswjs.io/docs/getting-started/integrate/node)

## テスト用のZustandのセットアップ

> **注意**: JestとVitestにはわずかな違いがあります。Vitestは**ESモジュール**を使用し、Jestは**CommonJSモジュール**を使用します。Jestの代わりにVitestを使用している場合は、この点に留意する必要があります。

以下に提供されるモックにより、関連するテストランナーが各テスト後にzustandストアをリセットできるようになります。

### テスト目的のみの共有コード

この共有コードは、`Context` APIの有無にかかわらず、両方の実装（それぞれ `createStore` と `create`）で同じカウンターストアクリエーターを使用するため、デモでのコードの重複を避けるために追加されました。

```ts
// shared/counter-store-creator.ts
import { type StateCreator } from 'zustand'

export type CounterStore = {
  count: number
  inc: () => void
}

export const counterStoreCreator: StateCreator<CounterStore> = (set) => ({
  count: 1,
  inc: () => set((state) => ({ count: state.count + 1 })),
})
```

### Jest

次のステップでは、Zustandをモックするために Jest環境をセットアップします。

```ts
// __mocks__/zustand.ts
import { act } from '@testing-library/react'
import type * as ZustandExportedTypes from 'zustand'
export * from 'zustand'

const { create: actualCreate, createStore: actualCreateStore } =
  jest.requireActual<typeof ZustandExportedTypes>('zustand')

// アプリで宣言されたすべてのストアのリセット関数を保持する変数
export const storeResetFns = new Set<() => void>()

const createUncurried = <T>(
  stateCreator: ZustandExportedTypes.StateCreator<T>,
) => {
  const store = actualCreate(stateCreator)
  const initialState = store.getInitialState()
  storeResetFns.add(() => {
    store.setState(initialState, true)
  })
  return store
}

// ストアを作成する際、初期状態を取得し、リセット関数を作成してセットに追加します
export const create = (<T>(
  stateCreator: ZustandExportedTypes.StateCreator<T>,
) => {
  console.log('zustand create mock')

  // createのカリー化バージョンをサポートするため
  return typeof stateCreator === 'function'
    ? createUncurried(stateCreator)
    : createUncurried
}) as typeof ZustandExportedTypes.create

const createStoreUncurried = <T>(
  stateCreator: ZustandExportedTypes.StateCreator<T>,
) => {
  const store = actualCreateStore(stateCreator)
  const initialState = store.getInitialState()
  storeResetFns.add(() => {
    store.setState(initialState, true)
  })
  return store
}

// ストアを作成する際、初期状態を取得し、リセット関数を作成してセットに追加します
export const createStore = (<T>(
  stateCreator: ZustandExportedTypes.StateCreator<T>,
) => {
  console.log('zustand createStore mock')

  // createStoreのカリー化バージョンをサポートするため
  return typeof stateCreator === 'function'
    ? createStoreUncurried(stateCreator)
    : createStoreUncurried
}) as typeof ZustandExportedTypes.createStore

// 各テスト実行後にすべてのストアをリセット
afterEach(() => {
  act(() => {
    storeResetFns.forEach((resetFn) => {
      resetFn()
    })
  })
})
```

```ts
// setup-jest.ts
import '@testing-library/jest-dom'
```

```ts
// jest.config.ts
import type { JestConfigWithTsJest } from 'ts-jest'

const config: JestConfigWithTsJest = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['./setup-jest.ts'],
}

export default config
```

> **注意**: TypeScriptを使用するには、`ts-jest` と `ts-node` の2つのパッケージをインストールする必要があります。

### Vitest

次のステップでは、Zustandをモックするために Vitest環境をセットアップします。

> **警告:** Vitestでは[root](https://vitest.dev/config/#root)を変更できます。そのため、`__mocks__` ディレクトリを正しい場所に作成していることを確認する必要があります。例えば、**root**を `./src` に変更した場合、`./src` の下に `__mocks__` ディレクトリを作成する必要があります。最終結果は `./__mocks__` ではなく `./src/__mocks__` になります。`__mocks__` ディレクトリを間違った場所に作成すると、Vitestを使用する際に問題が発生する可能性があります。

```ts
// __mocks__/zustand.ts
import { act } from '@testing-library/react'
import type * as ZustandExportedTypes from 'zustand'
export * from 'zustand'

const { create: actualCreate, createStore: actualCreateStore } =
  await vi.importActual<typeof ZustandExportedTypes>('zustand')

// アプリで宣言されたすべてのストアのリセット関数を保持する変数
export const storeResetFns = new Set<() => void>()

const createUncurried = <T>(
  stateCreator: ZustandExportedTypes.StateCreator<T>,
) => {
  const store = actualCreate(stateCreator)
  const initialState = store.getInitialState()
  storeResetFns.add(() => {
    store.setState(initialState, true)
  })
  return store
}

// ストアを作成する際、初期状態を取得し、リセット関数を作成してセットに追加します
export const create = (<T>(
  stateCreator: ZustandExportedTypes.StateCreator<T>,
) => {
  console.log('zustand create mock')

  // createのカリー化バージョンをサポートするため
  return typeof stateCreator === 'function'
    ? createUncurried(stateCreator)
    : createUncurried
}) as typeof ZustandExportedTypes.create

const createStoreUncurried = <T>(
  stateCreator: ZustandExportedTypes.StateCreator<T>,
) => {
  const store = actualCreateStore(stateCreator)
  const initialState = store.getInitialState()
  storeResetFns.add(() => {
    store.setState(initialState, true)
  })
  return store
}

// ストアを作成する際、初期状態を取得し、リセット関数を作成してセットに追加します
export const createStore = (<T>(
  stateCreator: ZustandExportedTypes.StateCreator<T>,
) => {
  console.log('zustand createStore mock')

  // createStoreのカリー化バージョンをサポートするため
  return typeof stateCreator === 'function'
    ? createStoreUncurried(stateCreator)
    : createStoreUncurried
}) as typeof ZustandExportedTypes.createStore

// 各テスト実行後にすべてのストアをリセット
afterEach(() => {
  act(() => {
    storeResetFns.forEach((resetFn) => {
      resetFn()
    })
  })
})
```

> **注意**: [globals設定](https://vitest.dev/config/#globals)を有効にしていない場合、上部に `import { afterEach, vi } from 'vitest'` を追加する必要があります。

```ts
// global.d.ts
/// <reference types="vite/client" />
/// <reference types="vitest/globals" />
```

> **注意**: [globals設定](https://vitest.dev/config/#globals)を有効にしていない場合、`/// <reference types="vitest/globals" />` を削除する必要があります。

```ts
// setup-vitest.ts
import '@testing-library/jest-dom'

vi.mock('zustand') // Jest（自動モック）のように動作させるため
```

> **注意**: [globals設定](https://vitest.dev/config/#globals)を有効にしていない場合、上部に `import { vi } from 'vitest'` を追加する必要があります。

```ts
// vitest.config.ts
import { defineConfig, mergeConfig } from 'vitest/config'
import viteConfig from './vite.config'

export default defineConfig((configEnv) =>
  mergeConfig(
    viteConfig(configEnv),
    defineConfig({
      test: {
        globals: true,
        environment: 'jsdom',
        setupFiles: ['./setup-vitest.ts'],
      },
    }),
  ),
)
```

### コンポーネントのテスト

次の例では `useCounterStore` を使用します

> **注意**: これらの例はすべてTypeScriptを使用して書かれています。

```ts
// shared/counter-store-creator.ts
import { type StateCreator } from 'zustand'

export type CounterStore = {
  count: number
  inc: () => void
}

export const counterStoreCreator: StateCreator<CounterStore> = (set) => ({
  count: 1,
  inc: () => set((state) => ({ count: state.count + 1 })),
})
```

```ts
// stores/use-counter-store.ts
import { create } from 'zustand'

import {
  type CounterStore,
  counterStoreCreator,
} from '../shared/counter-store-creator'

export const useCounterStore = create<CounterStore>()(counterStoreCreator)
```

```tsx
// contexts/use-counter-store-context.tsx
import { type ReactNode, createContext, useContext, useRef } from 'react'
import { createStore } from 'zustand'
import { useStoreWithEqualityFn } from 'zustand/traditional'
import { shallow } from 'zustand/shallow'

import {
  type CounterStore,
  counterStoreCreator,
} from '../shared/counter-store-creator'

export const createCounterStore = () => {
  return createStore<CounterStore>(counterStoreCreator)
}

export type CounterStoreApi = ReturnType<typeof createCounterStore>

export const CounterStoreContext = createContext<CounterStoreApi | undefined>(
  undefined,
)

export interface CounterStoreProviderProps {
  children: ReactNode
}

export const CounterStoreProvider = ({
  children,
}: CounterStoreProviderProps) => {
  const counterStoreRef = useRef<CounterStoreApi>(null)
  if (!counterStoreRef.current) {
    counterStoreRef.current = createCounterStore()
  }

  return (
    <CounterStoreContext.Provider value={counterStoreRef.current}>
      {children}
    </CounterStoreContext.Provider>
  )
}

export type UseCounterStoreContextSelector<T> = (store: CounterStore) => T

export const useCounterStoreContext = <T,>(
  selector: UseCounterStoreContextSelector<T>,
): T => {
  const counterStoreContext = useContext(CounterStoreContext)

  if (counterStoreContext === undefined) {
    throw new Error(
      'useCounterStoreContext must be used within CounterStoreProvider',
    )
  }

  return useStoreWithEqualityFn(counterStoreContext, selector, shallow)
}
```

```tsx
// components/counter/counter.tsx
import { useCounterStore } from '../../stores/use-counter-store'

export function Counter() {
  const { count, inc } = useCounterStore()

  return (
    <div>
      <h2>Counter Store</h2>
      <h4>{count}</h4>
      <button onClick={inc}>One Up</button>
    </div>
  )
}
```

```ts
// components/counter/index.ts
export * from './counter'
```

```tsx
// components/counter/counter.test.tsx
import { act, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import { Counter } from './counter'

describe('Counter', () => {
  test('should render with initial state of 1', async () => {
    renderCounter()

    expect(await screen.findByText(/^1$/)).toBeInTheDocument()
    expect(
      await screen.findByRole('button', { name: /one up/i }),
    ).toBeInTheDocument()
  })

  test('should increase count by clicking a button', async () => {
    const user = userEvent.setup()

    renderCounter()

    expect(await screen.findByText(/^1$/)).toBeInTheDocument()

    await user.click(await screen.findByRole('button', { name: /one up/i }))

    expect(await screen.findByText(/^2$/)).toBeInTheDocument()
  })
})

const renderCounter = () => {
  return render(<Counter />)
}
```

```tsx
// components/counter-with-context/counter-with-context.tsx
import {
  CounterStoreProvider,
  useCounterStoreContext,
} from '../../contexts/use-counter-store-context'

const Counter = () => {
  const { count, inc } = useCounterStoreContext((state) => state)

  return (
    <div>
      <h2>Counter Store Context</h2>
      <h4>{count}</h4>
      <button onClick={inc}>One Up</button>
    </div>
  )
}

export const CounterWithContext = () => {
  return (
    <CounterStoreProvider>
      <Counter />
    </CounterStoreProvider>
  )
}
```

```tsx
// components/counter-with-context/index.ts
export * from './counter-with-context'
```

```tsx
// components/counter-with-context/counter-with-context.test.tsx
import { act, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import { CounterWithContext } from './counter-with-context'

describe('CounterWithContext', () => {
  test('should render with initial state of 1', async () => {
    renderCounterWithContext()

    expect(await screen.findByText(/^1$/)).toBeInTheDocument()
    expect(
      await screen.findByRole('button', { name: /one up/i }),
    ).toBeInTheDocument()
  })

  test('should increase count by clicking a button', async () => {
    const user = userEvent.setup()

    renderCounterWithContext()

    expect(await screen.findByText(/^1$/)).toBeInTheDocument()

    await user.click(await screen.findByRole('button', { name: /one up/i }))

    expect(await screen.findByText(/^2$/)).toBeInTheDocument()
  })
})

const renderCounterWithContext = () => {
  return render(<CounterWithContext />)
}
```

> **注意**: [globals設定](https://vitest.dev/config/#globals)を有効にしていない場合、各テストファイルの上部に `import { describe, test, expect } from 'vitest'` を追加する必要があります。

**CodeSandboxデモ**

- Jestデモ: https://stackblitz.com/edit/jest-zustand
- Vitestデモ: https://stackblitz.com/edit/vitest-zustand

### ストアのテスト

次の例では `useCounterStore` を使用します

> **注意**: これらの例はすべてTypeScriptを使用して書かれています。

```ts
// shared/counter-store-creator.ts
import { type StateCreator } from 'zustand'

export type CounterStore = {
  count: number
  inc: () => void
}

export const counterStoreCreator: StateCreator<CounterStore> = (set) => ({
  count: 1,
  inc: () => set((state) => ({ count: state.count + 1 })),
})
```

```ts
// stores/use-counter-store.ts
import { create } from 'zustand'

import {
  type CounterStore,
  counterStoreCreator,
} from '../shared/counter-store-creator'

export const useCounterStore = create<CounterStore>()(counterStoreCreator)
```

```tsx
// contexts/use-counter-store-context.tsx
import { type ReactNode, createContext, useContext, useRef } from 'react'
import { createStore } from 'zustand'
import { useStoreWithEqualityFn } from 'zustand/traditional'
import { shallow } from 'zustand/shallow'

import {
  type CounterStore,
  counterStoreCreator,
} from '../shared/counter-store-creator'

export const createCounterStore = () => {
  return createStore<CounterStore>(counterStoreCreator)
}

export type CounterStoreApi = ReturnType<typeof createCounterStore>

export const CounterStoreContext = createContext<CounterStoreApi | undefined>(
  undefined,
)

export interface CounterStoreProviderProps {
  children: ReactNode
}

export const CounterStoreProvider = ({
  children,
}: CounterStoreProviderProps) => {
  const counterStoreRef = useRef<CounterStoreApi>(null)
  if (!counterStoreRef.current) {
    counterStoreRef.current = createCounterStore()
  }

  return (
    <CounterStoreContext.Provider value={counterStoreRef.current}>
      {children}
    </CounterStoreContext.Provider>
  )
}

export type UseCounterStoreContextSelector<T> = (store: CounterStore) => T

export const useCounterStoreContext = <T,>(
  selector: UseCounterStoreContextSelector<T>,
): T => {
  const counterStoreContext = useContext(CounterStoreContext)

  if (counterStoreContext === undefined) {
    throw new Error(
      'useCounterStoreContext must be used within CounterStoreProvider',
    )
  }

  return useStoreWithEqualityFn(counterStoreContext, selector, shallow)
}
```

```tsx
// components/counter/counter.tsx
import { useCounterStore } from '../../stores/use-counter-store'

export function Counter() {
  const { count, inc } = useCounterStore()

  return (
    <div>
      <h2>Counter Store</h2>
      <h4>{count}</h4>
      <button onClick={inc}>One Up</button>
    </div>
  )
}
```

```ts
// components/counter/index.ts
export * from './counter'
```

```tsx
// components/counter/counter.test.tsx
import { act, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import { Counter, useCounterStore } from '../../../stores/use-counter-store.ts'

describe('Counter', () => {
  test('should render with initial state of 1', async () => {
    renderCounter()

    expect(useCounterStore.getState().count).toBe(1)
  })

  test('should increase count by clicking a button', async () => {
    const user = userEvent.setup()

    renderCounter()

    expect(useCounterStore.getState().count).toBe(1)

    await user.click(await screen.findByRole('button', { name: /one up/i }))

    expect(useCounterStore.getState().count).toBe(2)
  })
})

const renderCounter = () => {
  return render(<Counter />)
}
```

```tsx
// components/counter-with-context/counter-with-context.tsx
import {
  CounterStoreProvider,
  useCounterStoreContext,
} from '../../contexts/use-counter-store-context'

const Counter = () => {
  const { count, inc } = useCounterStoreContext((state) => state)

  return (
    <div>
      <h2>Counter Store Context</h2>
      <h4>{count}</h4>
      <button onClick={inc}>One Up</button>
    </div>
  )
}

export const CounterWithContext = () => {
  return (
    <CounterStoreProvider>
      <Counter />
    </CounterStoreProvider>
  )
}
```

```tsx
// components/counter-with-context/index.ts
export * from './counter-with-context'
```

```tsx
// components/counter-with-context/counter-with-context.test.tsx
import { act, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import { CounterStoreContext } from '../../../contexts/use-counter-store-context'
import { counterStoreCreator } from '../../../shared/counter-store-creator'

describe('CounterWithContext', () => {
  test('should render with initial state of 1', async () => {
    const counterStore = counterStoreCreator()

    renderCounterWithContext(counterStore)

    expect(counterStore.getState().count).toBe(1)
    expect(
      await screen.findByRole('button', { name: /one up/i }),
    ).toBeInTheDocument()
  })

  test('should increase count by clicking a button', async () => {
    const user = userEvent.setup()
    const counterStore = counterStoreCreator()

    renderCounterWithContext(counterStore)

    expect(counterStore.getState().count).toBe(1)

    await user.click(await screen.findByRole('button', { name: /one up/i }))

    expect(counterStore.getState().count).toBe(2)
  })
})

const renderCounterWithContext = (store) => {
  return render(<CounterWithContext />, {
    wrapper: ({ children }) => (
      <CounterStoreContext.Provider value={store}>
        {children}
      </CounterStoreContext.Provider>
    ),
  })
}
```

## 参考文献

- **React Testing Library**: [React Testing Library (RTL)](https://testing-library.com/docs/react-testing-library/intro)は、Reactコンポーネントをテストするための非常に軽量なソリューションです。`react-dom` と `react-dom/test-utils` の上にユーティリティ関数を提供し、より良いテスト慣行を促進する方法で実装されています。その主要な指針は「テストがソフトウェアの使用方法に似ているほど、より多くの信頼を得られる」です。
- **Native Testing Library**: [Native Testing Library (RNTL)](https://testing-library.com/docs/react-native-testing-library/intro)は、RTLと同様に、React Nativeコンポーネントをテストするための非常に軽量なソリューションですが、その関数は `react-test-renderer` の上に構築されています。
- **実装の詳細のテスト**: Kent C. Doddsによるブログ投稿で、なぜ[実装の詳細のテスト](https://kentcdodds.com/blog/testing-implementation-details)を避けることを推奨するかについて説明しています。
