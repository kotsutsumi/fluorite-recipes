# createElement

`createElement` を使用すると、JSX を記述する代わりに React 要素を作成できます。

```javascript
const element = createElement(type, props, ...children)
```

## リファレンス

### `createElement(type, props, ...children)`

`createElement` を呼び出して、指定された `type`、`props`、`children` で React 要素を作成します。

```javascript
import { createElement } from 'react';

function Greeting({ name }) {
  return createElement(
    'h1',
    { className: 'greeting' },
    'Hello'
  );
}
```

#### パラメータ

- `type`: `type` 引数は有効な React コンポーネントタイプである必要があります。たとえば、タグ名の文字列（`'div'` や `'span'` など）、または React コンポーネント（関数、クラス、または `Fragment` のような特殊なコンポーネント）などです。

- `props`: `props` 引数は、オブジェクトまたは `null` である必要があります。`null` を渡すと、空のオブジェクトと同じように扱われます。React は、渡した `props` と一致するプロパティを持つ要素を作成します。`props` オブジェクトの `ref` と `key` は特別で、返される `element` の `element.props.ref` や `element.props.key` としては利用できません。これらは `element.ref` と `element.key` として利用できます。

- **オプション** `...children`: ゼロ個以上の子ノード。React ノード（React 要素、文字列、数値、ポータル、空のノード（`null`、`undefined`、`true`、`false`）、React ノードの配列など）を指定できます。

#### 戻り値

`createElement` は以下のプロパティを持つ React 要素オブジェクトを返します：

- `type`: 渡した `type`
- `props`: `ref` と `key` を除いて渡した `props`。`type` がレガシー `type.defaultProps` を持つコンポーネントの場合、不足または未定義の `props` は `type.defaultProps` からの値を取得します
- `ref`: 渡した `ref`。不足している場合は `null`
- `key`: 渡した `key`。文字列に強制されます。不足している場合は `null`

通常、要素はコンポーネントから返すか、別の要素の子にします。要素のプロパティを読み取ることはできますが、作成後はすべての要素を不透明として扱い、レンダリングのみを行うことをお勧めします。

#### 注意事項

**React 要素とそのプロパティを不変として扱い**、作成後にその内容を変更しないでください。開発中に、React はこれを強制するために、返される要素とその `props` プロパティを浅くフリーズします。

JSX を使用する場合、**カスタムコンポーネントをレンダリングするには、タグを大文字で開始する必要があります**。つまり、`<Something />` は `createElement(Something)` と同等ですが、`<something />`（小文字）は `createElement('something')` と同等です（文字列であることに注意してください。組み込みの HTML タグとして扱われます）。

**すべての子が静的にわかっている場合にのみ**、複数の引数として `createElement` に子を渡します（`createElement('h1', {}, child1, child2, child3)` など）。子が動的な場合は、配列全体を3番目の引数として渡します（`createElement('ul', {}, listItems)` など）。これにより、React は動的なリストに不足している `key` について警告します。静的なリストの場合、並べ替えられることはないため、これは必要ありません。

## 使用方法

### JSX なしで要素を作成する

JSX が好きでない場合、またはプロジェクトで JSX を使用できない場合は、代替として `createElement` を使用できます。

`createElement` で要素を作成するには、`type`、`props`、`children` を渡します：

```javascript
import { createElement } from 'react';

function Greeting({ name }) {
  return createElement(
    'h1',
    { className: 'greeting' },
    'Hello ',
    createElement('i', null, name),
    '. Welcome!'
  );
}
```

`children` はオプションで、必要な数だけ渡すことができます（上記の例には3つの子があります）。このコードは、挨拶とともに `<h1>` ヘッダーを表示します。

```javascript
export default function App() {
  return createElement(
    Greeting,
    { name: 'Taylor' }
  );
}
```

### JSX と createElement の比較

以下は、JSX で記述された例です：

```javascript
function Greeting({ name }) {
  return (
    <h1 className="greeting">
      Hello <i>{name}</i>. Welcome!
    </h1>
  );
}
```

同じコンポーネントを `createElement` で記述した場合：

```javascript
function Greeting({ name }) {
  return createElement(
    'h1',
    { className: 'greeting' },
    'Hello ',
    createElement('i', null, name),
    '. Welcome!'
  );
}
```

両方のスタイルは問題ありませんので、プロジェクトに好みのスタイルを使用できます。JSX と比較した `createElement` の主な利点は、プロジェクトに追加のビルドステップを設定する必要がないことです。

### 要素を作成してレンダリングする

完全な例：

```javascript
import { createElement } from 'react';
import { createRoot } from 'react-dom/client';

const root = createRoot(document.getElementById('root'));

function Greeting({ name }) {
  return createElement(
    'h1',
    { className: 'greeting' },
    'Hello ',
    createElement('i', null, name),
    '. Welcome!'
  );
}

root.render(
  createElement(Greeting, { name: 'Taylor' })
);
```

### カスタムコンポーネントの作成

コンポーネント関数を `type` として渡すことができます：

```javascript
function Button({ children, onClick }) {
  return createElement(
    'button',
    { onClick, className: 'button' },
    children
  );
}

function App() {
  return createElement(
    'div',
    null,
    createElement(Button, {
      onClick: () => alert('Clicked!')
    }, 'Click me')
  );
}
```

### 複数の子を持つ要素

複数の子を個別の引数として渡すことができます：

```javascript
createElement(
  'div',
  { className: 'container' },
  createElement('h1', null, 'Title'),
  createElement('p', null, 'Paragraph 1'),
  createElement('p', null, 'Paragraph 2')
)
```

または、配列として渡すこともできます：

```javascript
const paragraphs = [
  createElement('p', { key: 1 }, 'Paragraph 1'),
  createElement('p', { key: 2 }, 'Paragraph 2')
];

createElement(
  'div',
  { className: 'container' },
  createElement('h1', null, 'Title'),
  ...paragraphs
);
```

動的な子のリストには、必ず `key` を提供してください。

## 詳細

### React 要素とは

React 要素は、ユーザーインターフェースの一部の軽量な説明です。例：`<Greeting name="Taylor" />` と `createElement(Greeting, { name: 'Taylor' })` の両方で、次のようなオブジェクトが生成されます：

```javascript
{
  type: Greeting,
  props: {
    name: 'Taylor'
  },
  key: null,
  ref: null
}
```

**この説明では、`Greeting` コンポーネントはレンダリングされず、DOM ノードも作成されないことに注意してください。**

React 要素は、React に `Greeting` コンポーネントを後で `name="Taylor"` プロパティでレンダリングするように指示する説明のようなものです。この要素をコンポーネントから返すことで、React にこれを行うように指示します。

### 要素の作成は安価

React 要素の作成は非常に安価なので、最適化や回避を試みる必要はありません。

### JSX vs createElement

コード例（JSX）：

```javascript
function Greeting({ name }) {
  return (
    <h1 className="greeting">
      Hello <i>{name}</i>. Welcome!
    </h1>
  );
}
```

同じコード（createElement）：

```javascript
function Greeting({ name }) {
  return createElement(
    'h1',
    { className: 'greeting' },
    'Hello ',
    createElement('i', null, name),
    '. Welcome!'
  );
}
```

両方とも全く同じ結果を生成します。JSX は単なる構文糖衣で、内部では `createElement` 呼び出しに変換されます。

## まとめ

- `createElement` は JSX の代替手段として React 要素を作成します
- `type`、`props`、`children` を引数として受け取ります
- JSX と同じ結果を生成しますが、構文が異なります
- JSX の方が読みやすいことが多いですが、`createElement` はビルドステップが不要です
- React 要素は軽量で作成は安価です
- 要素は不変として扱い、作成後は変更しないでください
