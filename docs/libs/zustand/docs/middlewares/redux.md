# Zustand の Redux ミドルウェア

## 概要
`redux` ミドルウェアを使用すると、Reduxと同様にアクションとリデューサーを通じてストアを更新できます。

## 基本的な使用方法
```typescript
const nextStateCreatorFn = redux(reducerFn, initialState)
```

## 型

### シグネチャ
```typescript
redux<T, A>(
  reducerFn: (state: T, action: A) => T,
  initialState: T
): StateCreator<...>
```

### ミューテーター
```typescript
['zustand/redux', A]
```

## 主要な概念
- 純粋なリデューサー関数は、現在の状態とアクションを受け取ります
- アクションを適用した後の新しい状態を返します
- 初期状態でストアを初期化します

## 詳細な例

### ストアのセットアップ
```typescript
type PersonStoreState = {
  firstName: string
  lastName: string
  email: string
}

type PersonStoreAction =
  | { type: 'person/setFirstName'; firstName: string }
  | { type: 'person/setLastName'; lastName: string }
  | { type: 'person/setEmail'; email: string }

const personStoreReducer = (
  state: PersonStoreState,
  action: PersonStoreAction
) => {
  switch (action.type) {
    case 'person/setFirstName':
      return { ...state, firstName: action.firstName }
    case 'person/setLastName':
      return { ...state, lastName: action.lastName }
    case 'person/setEmail':
      return { ...state, email: action.email }
    default:
      return state
  }
}
```

### ストアの作成
```typescript
const personStore = createStore<PersonStore>()(
  redux(personStoreReducer, personStoreInitialState)
)
```

### アクションのディスパッチ
```typescript
personStore.dispatch({
  type: 'person/setFirstName',
  firstName: inputValue
})
```

## トラブルシューティング
TBD（To Be Determined）
