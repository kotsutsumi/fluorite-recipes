# Atom内のAtom

このドキュメントでは、atom設定をさまざまな方法で保存および操作する方法を説明します。

## 主要な概念

- `atom()`は、値を持たないオブジェクトであるatom設定を作成します
- Atom設定は参照等価性によって識別されます
- Atom設定は以下のように使用できます:
  - `useState`に保存
  - 他のatomの値として使用
  - atomの配列またはオブジェクトに保存

## 例

### useStateに保存

```javascript
const Component = ({ atom1, atom2 }) => {
  const [selectedAtom, setSelectedAtom] = useState(atom1)
  const [value] = useAtom(selectedAtom)

  return (
    <div>
      <div>Value: {value}</div>
      <button onClick={() => setSelectedAtom(atom1)}>Atom 1を使用</button>
      <button onClick={() => setSelectedAtom(atom2)}>Atom 2を使用</button>
    </div>
  )
}
```

この例では、2つのatomを切り替えて、現在選択されているatomの値を表示します。

### 別のAtomに保存

```javascript
const firstNameAtom = atom('John')
const lastNameAtom = atom('Doe')
const showingNameAtom = atom(firstNameAtom)

const Component = () => {
  const [nameAtom, setNameAtom] = useAtom(showingNameAtom)
  const [name] = useAtom(nameAtom)

  return (
    <div>
      <div>Name: {name}</div>
      <button onClick={() => setNameAtom(firstNameAtom)}>名を表示</button>
      <button onClick={() => setNameAtom(lastNameAtom)}>姓を表示</button>
    </div>
  )
}
```

### Atom設定の配列

```javascript
const countsAtom = atom([atom(1), atom(2), atom(3)])

const Parent = () => {
  const [counts, setCounts] = useAtom(countsAtom)

  const addNewCount = () => {
    const newAtom = atom(0)
    setCounts((prev) => [...prev, newAtom])
  }

  return (
    <div>
      {counts.map((countAtom) => (
        <Counter key={`${countAtom}`} countAtom={countAtom} />
      ))}
      <button onClick={addNewCount}>カウンターを追加</button>
    </div>
  )
}

const Counter = ({ countAtom }) => {
  const [count, setCount] = useAtom(countAtom)
  return (
    <div>
      {count} <button onClick={() => setCount((c) => c + 1)}>+1</button>
    </div>
  )
}
```

この例では、動的にカウンターatomを作成および管理します。`toString()`を使用してatomを一意に識別します。

### Atom設定のマップ

```javascript
const pricesAtom = atom({
  apple: atom(15),
  orange: atom(12),
  pineapple: atom(25),
})

const Prices = () => {
  const [prices] = useAtom(pricesAtom)

  return (
    <div>
      {Object.entries(prices).map(([fruit, priceAtom]) => (
        <Price key={fruit} fruit={fruit} priceAtom={priceAtom} />
      ))}
    </div>
  )
}

const Price = ({ fruit, priceAtom }) => {
  const [price, setPrice] = useAtom(priceAtom)
  return (
    <div>
      {fruit}: ${price}
      <button onClick={() => setPrice((p) => p + 1)}>値上げ</button>
      <button onClick={() => setPrice((p) => p - 1)}>値下げ</button>
    </div>
  )
}
```

### 動的なAtom作成

```javascript
const todoListAtom = atom([
  { id: 1, text: 'Buy milk', completed: false },
  { id: 2, text: 'Walk dog', completed: false },
])

const todoAtomsAtom = atom((get) => {
  const todoList = get(todoListAtom)
  return todoList.map((todo) =>
    atom(
      (get) => get(todoListAtom).find((t) => t.id === todo.id),
      (get, set, update) => {
        set(todoListAtom, (prev) =>
          prev.map((t) => (t.id === todo.id ? { ...t, ...update } : t))
        )
      }
    )
  )
})

const TodoList = () => {
  const [todoAtoms] = useAtom(todoAtomsAtom)

  return (
    <div>
      {todoAtoms.map((todoAtom) => (
        <TodoItem key={`${todoAtom}`} todoAtom={todoAtom} />
      ))}
    </div>
  )
}

const TodoItem = ({ todoAtom }) => {
  const [todo, setTodo] = useAtom(todoAtom)

  return (
    <div>
      <input
        type="checkbox"
        checked={todo.completed}
        onChange={(e) => setTodo({ completed: e.target.checked })}
      />
      {todo.text}
    </div>
  )
}
```

## 主な利点

1. **きめ細かいリアクティビティ**: 個々のアイテムが独立して更新できます
2. **動的なAtom管理**: 実行時にatomを作成および削除できます
3. **一意の識別**: `toString()`を使用してatomをkeyとして使用できます
4. **柔軟な構造**: 配列、オブジェクト、またはネストされた構造でatomを整理できます

## ベストプラクティス

- Reactのkeyには`toString()`を使用してatomを一意に識別します
- 動的なatomリストには派生atomを使用します
- 各atomが単一の責任を持つようにします
- 複雑な状態構造には`atomFamily`または`selectAtom`を検討します

このドキュメントは、状態管理のためのJotaiのatomシステムの柔軟性を強調しています。Atom設定を値として扱うことで、動的で保守可能な状態管理ソリューションを作成できます。
