# cloneElement

`cloneElement` を使用すると、既存の要素を基に新しい React 要素を作成できます。

```javascript
const clonedElement = cloneElement(element, props, ...children)
```

## リファレンス

### `cloneElement(element, props, ...children)`

`cloneElement` を呼び出して、別の `element` を基に React 要素を作成し、プロパティと子をオーバーライドします：

```javascript
import { cloneElement } from 'react';

const clonedElement = cloneElement(
  <Row title="Cabbage" />,
  { isHighlighted: true },
  'Hello'
);

console.log(clonedElement);
/*
{
  type: Row,
  props: { title: "Cabbage", isHighlighted: true, children: "Hello" },
  key: null,
  ref: null
}
*/
```

#### パラメータ

- `element`: `element` 引数は有効な React 要素である必要があります。たとえば、`<Something />` のような JSX ノード、`createElement` の呼び出し結果、または別の `cloneElement` の呼び出し結果などです。

- `props`: `props` 引数は、オブジェクトまたは `null` である必要があります。`null` を渡すと、クローンされた要素は元の `element.props` をすべて保持します。それ以外の場合、`props` オブジェクト内の各プロパティについて、返される要素は `props` からの値を優先し、`element.props` からの値を使用します。`props.key` または `props.ref` が存在する場合、元のものを置き換えます。

- **オプション** `...children`: ゼロ個以上の子ノード。React 要素、文字列、数値、ポータル、空のノード（`null`、`undefined`、`true`、`false`）、React ノードの配列など、任意の React ノードを指定できます。`...children` 引数を渡さない場合、元の `element.props.children` が保持されます。

#### 戻り値

`cloneElement` は次のプロパティを持つ React 要素オブジェクトを返します：

- `type`: `element.type` と同じです。
- `props`: `element.props` を渡した `props` で浅くマージした結果です。
- `ref`: `props.ref` で上書きされていない限り、元の `element.ref` です。
- `key`: `props.key` で上書きされていない限り、元の `element.key` です。

通常、要素はコンポーネントから返すか、別の要素の子にします。要素のプロパティを検査することはできますが、作成後はすべての要素を不透明として扱い、レンダリングのみを行うことをお勧めします。

#### 注意事項

要素をクローンしても**元の要素は変更されません**。

`cloneElement` で渡す**静的な子（複数の引数）のみが、元の子を上書きします**。これは、元の要素にすでに静的な子がある場合、それらが完全に置き換えられることを意味します。

`cloneElement(element, null, child1, child2, child3)` は `cloneElement(element, null, [child1, child2, child3])` と同等です。

## 使用方法

### 要素のプロパティをオーバーライドする

React 要素のプロパティをオーバーライドするには、`cloneElement` に要素とオーバーライドするプロパティを渡します：

```javascript
import { cloneElement } from 'react';

function List({ children }) {
  return (
    <div className="List">
      {children.map((child, index) =>
        cloneElement(child, {
          isHighlighted: index === 0
        })
      )}
    </div>
  );
}

export default function App() {
  return (
    <List>
      <Row title="Cabbage" />
      <Row title="Garlic" />
      <Row title="Apple" />
    </List>
  );
}

function Row({ title, isHighlighted }) {
  return (
    <div className={[
      'Row',
      isHighlighted ? 'RowHighlighted' : ''
    ].join(' ')}>
      {title}
    </div>
  );
}
```

この例では、`List` コンポーネントが最初の子要素に `isHighlighted={true}` プロパティを動的に追加しています。

### データをオーバーライドして props として渡す

`cloneElement` を使用する代わりに、より明示的な方法として、データをプロパティとして直接渡すことができます：

```javascript
function List({ children }) {
  return (
    <div className="List">
      {children.map((child, index) =>
        <div className="ListItem">
          {child}
          <button onClick={() => console.log(index)}>Select</button>
        </div>
      )}
    </div>
  );
}
```

## 代替手段

### レンダープロップを使用する

`cloneElement` の代わりに、レンダープロップパターンを使用することを検討してください：

```javascript
function List({ items, renderItem }) {
  return (
    <div className="List">
      {items.map((item, index) =>
        <div key={item.id}>
          {renderItem(item, index === 0)}
        </div>
      )}
    </div>
  );
}

export default function App() {
  return (
    <List
      items={products}
      renderItem={(product, isHighlighted) =>
        <Row
          title={product.title}
          isHighlighted={isHighlighted}
        />
      }
    />
  );
}
```

このアプローチは、データフローがより明確で追跡しやすくなります。

### Context を使用する

React Context を使用してコンポーネントツリーを通じてデータを深く渡すことができます：

```javascript
const HighlightContext = createContext(false);

function List({ children }) {
  return (
    <div className="List">
      {children.map((child, index) =>
        <HighlightContext.Provider value={index === 0}>
          {child}
        </HighlightContext.Provider>
      )}
    </div>
  );
}

function Row({ title }) {
  const isHighlighted = useContext(HighlightContext);
  return (
    <div className={isHighlighted ? 'RowHighlighted' : 'Row'}>
      {title}
    </div>
  );
}
```

### カスタムフックを使用する

非視覚的なロジックを再利用可能なフックに抽出します：

```javascript
function useHighlight(index) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  return index === selectedIndex;
}

function Row({ title, index }) {
  const isHighlighted = useHighlight(index);
  return (
    <div className={isHighlighted ? 'RowHighlighted' : 'Row'}>
      {title}
    </div>
  );
}
```

## 警告

`cloneElement` を使用すると、データフローの追跡が困難になる可能性があります。代わりに、レンダープロップ、Context、またはカスタムフックなどの代替パターンを使用することを推奨します。

## まとめ

- `cloneElement` は既存の React 要素を基に新しい要素を作成します
- プロパティと子をオーバーライドできます
- 一般的には推奨されず、より明示的な代替手段があります
- レンダープロップ、Context、カスタムフックの使用を検討してください
