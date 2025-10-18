# テスト

Jotaiアプリケーションのテストは、Testing Libraryの指針である「テストがソフトウェアの使用方法に似ているほど、信頼性が高まる」に従います。

## 基本的なコンポーネントのテスト

React Testing Libraryを使用してコンポーネントのインタラクションをテストします。

カウンターコンポーネントの例:

```typescript
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Counter } from './Counter'

test('should increment counter', async () => {
  render(<Counter />)
  const counter = screen.getByText('0')
  const incrementButton = screen.getByText('one up')
  await userEvent.click(incrementButton)
  expect(counter.textContent).toEqual('1')
})
```

## 注入された値

`Provider`と`useHydrateAtoms`を使用して、テスト用にatomの初期状態を設定します。これにより、最大カウンター値などのエッジケースをテストできます。

```typescript
import { useHydrateAtoms } from 'jotai/utils'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { countAtom } from './atoms'
import { Counter } from './Counter'

const HydrateAtoms = ({ initialValues, children }) => {
  useHydrateAtoms(initialValues)
  return children
}

const TestProvider = ({ initialValues, children }) => (
  <Provider>
    <HydrateAtoms initialValues={initialValues}>{children}</HydrateAtoms>
  </Provider>
)

test('should increment counter with initial value', async () => {
  render(
    <TestProvider initialValues={[[countAtom, 9]]}>
      <Counter />
    </TestProvider>,
  )
  const counter = screen.getByText('9')
  const incrementButton = screen.getByText('one up')
  await userEvent.click(incrementButton)
  expect(counter.textContent).toEqual('10')
})
```

## カスタムフックのテスト

React Hooks Testing Libraryを使用して、atomを単体でテストします。

reducerベースのatomの例:

```typescript
import { renderHook, act } from '@testing-library/react'
import { useAtom } from 'jotai'
import { countAtom } from './atoms'

test('should increment counter', () => {
  const { result } = renderHook(() => useAtom(countAtom))

  act(() => {
    result.current[1]('INCREASE')
  })

  expect(result.current[0]).toBe(1)
})
```

Providerを使用したテスト:

```typescript
import { renderHook, act } from '@testing-library/react'
import { Provider } from 'jotai'
import { useAtom } from 'jotai'
import { countAtom } from './atoms'

test('should increment counter with provider', () => {
  const wrapper = ({ children }) => <Provider>{children}</Provider>
  const { result } = renderHook(() => useAtom(countAtom), { wrapper })

  act(() => {
    result.current[1]('INCREASE')
  })

  expect(result.current[0]).toBe(1)
})
```

## React Nativeのテスト

React Nativeアプリケーションも同様のテストアプローチを使用します。React Native Testing Libraryの`render`と`fireEvent`を使用します。

```typescript
import { render, fireEvent } from '@testing-library/react-native'
import { Counter } from './Counter'

test('should increment counter in React Native', () => {
  const { getByText } = render(<Counter />)
  const counter = getByText('0')
  const incrementButton = getByText('one up')

  fireEvent.press(incrementButton)

  expect(counter.props.children).toEqual('1')
})
```

## テストのベストプラクティス

- コンポーネントの使用方法に似たテストを書く
- エッジケースをテストするために初期値を注入する
- 単体テストにはフックのレンダリングを使用する
- 統合テストには完全なコンポーネントのレンダリングを使用する

このドキュメントは、さまざまなシナリオとプラットフォームでJotaiアプリケーションをテストするための包括的なガイダンスを提供します。
