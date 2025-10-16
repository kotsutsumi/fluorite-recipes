# レンダリング時の状態の初期化

このドキュメントでは、コンポーネントに渡されたpropsによって初期状態が決定される、atomを使用した再利用可能なコンポーネントの作成方法を説明します。

## 主要な概念

- `Provider`と`initialValues`を使用してatomの状態を初期化します
- 初期値を設定するための`HydrateAtoms`コンポーネントを作成します
- 特定の初期値を持つプロバイダーで子コンポーネントをラップします

## 基本的な例

この例では、以下を持つ`TextDisplay`コンポーネントを示します:
- 共有状態のための`textAtom`
- テキストを表示する`PrettyText`コンポーネント
- テキストを変更する`UpdateTextInput`コンポーネント
- atomの値を初期化する`HydrateAtoms`

### コード構造

```javascript
import { atom, Provider, useAtom } from 'jotai'
import { useHydrateAtoms } from 'jotai/utils'

const textAtom = atom('')

const HydrateAtoms = ({ initialValues, children }) => {
  useHydrateAtoms(initialValues)
  return children
}

const PrettyText = () => {
  const [text] = useAtom(textAtom)
  return (
    <div>
      <h1>Pretty Text: {text}</h1>
    </div>
  )
}

const UpdateTextInput = () => {
  const [text, setText] = useAtom(textAtom)
  return (
    <input
      value={text}
      onChange={(e) => setText(e.target.value)}
      placeholder="テキストを入力..."
    />
  )
}

export const TextDisplay = ({ initialTextValue }) => (
  <Provider>
    <HydrateAtoms initialValues={[[textAtom, initialTextValue]]}>
      <PrettyText />
      <UpdateTextInput />
    </HydrateAtoms>
  </Provider>
)
```

### 使用例

```javascript
const App = () => {
  return (
    <div>
      <TextDisplay initialTextValue="Hello World" />
      <TextDisplay initialTextValue="Goodbye World" />
    </div>
  )
}
```

この例では、それぞれ異なる初期値を持つ2つの独立した`TextDisplay`インスタンスを作成します。

## TypeScriptでの使用

TypeScriptでより良い型推論を得るために、`useHydrateAtoms`に初期atom値を渡すときに`Map`を使用することをお勧めします。

```typescript
import { atom, Provider, useAtom } from 'jotai'
import { useHydrateAtoms } from 'jotai/utils'

const countAtom = atom(0)
const nameAtom = atom('')

const HydrateAtoms = ({
  initialValues,
  children,
}: {
  initialValues: Map<typeof countAtom | typeof nameAtom, any>
  children: React.ReactNode
}) => {
  useHydrateAtoms(Array.from(initialValues))
  return children
}

export const MyComponent = ({
  initialCount,
  initialName,
}: {
  initialCount: number
  initialName: string
}) => {
  const initialValues = new Map([
    [countAtom, initialCount],
    [nameAtom, initialName],
  ])

  return (
    <Provider>
      <HydrateAtoms initialValues={initialValues}>
        <Counter />
        <NameDisplay />
      </HydrateAtoms>
    </Provider>
  )
}
```

## 高度な例: 複数のAtomの初期化

```javascript
import { atom, Provider, useAtom } from 'jotai'
import { useHydrateAtoms } from 'jotai/utils'

const userAtom = atom({ name: '', email: '' })
const settingsAtom = atom({ theme: 'light', language: 'en' })

const HydrateAtoms = ({ initialValues, children }) => {
  useHydrateAtoms(initialValues)
  return children
}

export const UserProfile = ({ initialUser, initialSettings }) => (
  <Provider>
    <HydrateAtoms
      initialValues={[
        [userAtom, initialUser],
        [settingsAtom, initialSettings],
      ]}
    >
      <UserInfo />
      <SettingsPanel />
    </HydrateAtoms>
  </Provider>
)

const UserInfo = () => {
  const [user] = useAtom(userAtom)
  return (
    <div>
      <p>Name: {user.name}</p>
      <p>Email: {user.email}</p>
    </div>
  )
}

const SettingsPanel = () => {
  const [settings, setSettings] = useAtom(settingsAtom)
  return (
    <div>
      <p>Theme: {settings.theme}</p>
      <p>Language: {settings.language}</p>
    </div>
  )
}
```

## 重要なポイント

1. **Atomは動的に初期化できます**: propsに基づいて初期状態を設定します
2. **`Provider`と`useHydrateAtoms`が柔軟な状態管理を可能にします**: 各コンポーネントインスタンスは独立した状態を持てます
3. **コンポーネントは独立した初期値を維持しながら状態を共有できます**: 各Providerは独自のスコープを作成します
4. **TypeScriptの型安全性**: `Map`を使用してより良い型推論を得ます

## ベストプラクティス

- 複数のコンポーネントインスタンスには`Provider`を使用します
- `useHydrateAtoms`で初期値を設定します
- TypeScriptでの型安全性のために`Map`を使用します
- 各Providerが独自の分離された状態スコープを作成することを覚えておきます
- 初期化ロジックをカプセル化するために再利用可能な`HydrateAtoms`コンポーネントを作成します

このパターンにより、propsに基づいて初期化される独立した状態を持つ、再利用可能なコンポーネントを作成できます。
