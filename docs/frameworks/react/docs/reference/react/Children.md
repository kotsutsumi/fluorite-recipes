# Children

`Children` を使用すると、`children` プロパティとして受け取った JSX を操作および変換できます。

```javascript
const mappedChildren = Children.map(children, child =>
  <div className="Row">
    {child}
  </div>
);
```

## リファレンス

### `Children.count(children)`

`children` データ構造内の子の数を数えます。

```javascript
import { Children } from 'react';

function RowList({ children }) {
  return (
    <>
      <h1>Total rows: {Children.count(children)}</h1>
      ...
    </>
  );
}
```

#### パラメータ

- `children`: コンポーネントが受け取った `children` プロパティの値

#### 戻り値

これらの `children` 内のノード数を返します。

#### 注意点

空のノード（`null`、`undefined`、真偽値）、文字列、数値、React 要素はすべて個別のノードとしてカウントされます。配列は個別のノードとしてカウントされませんが、その子要素はカウントされます。**React 要素を超えた走査は行われません**：レンダリングされず、その子要素は走査されません。フラグメントも走査されません。

### `Children.forEach(children, fn, thisArg?)`

`children` データ構造内の各子に対してコードを実行できます。

```javascript
import { Children } from 'react';

function SeparatorList({ children }) {
  const result = [];
  Children.forEach(children, (child, index) => {
    result.push(child);
    result.push(<hr key={index} />);
  });
  // ...
}
```

#### パラメータ

- `children`: コンポーネントが受け取った `children` プロパティの値
- `fn`: 各子に対して実行する関数。`Array.prototype.forEach` メソッドのコールバックと同様です。最初の引数として子、2番目の引数としてインデックスで呼び出されます。インデックスは0から始まり、呼び出しごとに増加します。
- **オプション** `thisArg`: `fn` 関数が呼び出されるときの `this` 値。省略した場合は `undefined` です。

#### 戻り値

`Children.forEach` は `undefined` を返します。

#### 注意点

空のノード（`null`、`undefined`、真偽値）、文字列、数値、React 要素はすべて個別のノードとして扱われます。配列は個別のノードとして扱われませんが、その子要素は扱われます。**React 要素を超えた走査は行われません**：レンダリングされず、その子要素は走査されません。フラグメントも走査されません。

### `Children.map(children, fn, thisArg?)`

`children` データ構造内の各子をマッピングまたは変換します。

```javascript
import { Children } from 'react';

function RowList({ children }) {
  return (
    <div className="RowList">
      {Children.map(children, child =>
        <div className="Row">
          {child}
        </div>
      )}
    </div>
  );
}
```

#### パラメータ

- `children`: コンポーネントが受け取った `children` プロパティの値
- `fn`: マッピング関数。`Array.prototype.map` メソッドのコールバックと同様です。最初の引数として子、2番目の引数としてインデックスで呼び出されます。インデックスは0から始まり、呼び出しごとに増加します。この関数から React ノードを返す必要があります。これは空のノード（`null`、`undefined`、真偽値）、文字列、数値、React 要素、または他の React ノードの配列である可能性があります。
- **オプション** `thisArg`: `fn` 関数が呼び出されるときの `this` 値。省略した場合は `undefined` です。

#### 戻り値

`children` が `null` または `undefined` の場合、同じ値を返します。

それ以外の場合は、`fn` 関数から返されたノードで構成されるフラットな配列を返します。返される配列には、`null` と `undefined` を除くすべてのノードが含まれます。

#### 注意点

空のノード（`null`、`undefined`、真偽値）、文字列、数値、React 要素はすべて個別のノードとして扱われます。配列は個別のノードとして扱われませんが、その子要素は扱われます。**React 要素を超えた走査は行われません**：レンダリングされず、その子要素は走査されません。フラグメントも走査されません。

配列を返す場合、キーを持つ要素は元の `children` の対応する項目にリンクされます。配列から複数の要素を返す場合、それらのキーは互いに対してのみローカルに一意である必要があります。

### `Children.only(children)`

`children` が単一の React 要素を表していることを確認します。

```javascript
import { Children } from 'react';

function Box({ children }) {
  const element = Children.only(children);
  // ...
}
```

#### パラメータ

- `children`: コンポーネントが受け取った `children` プロパティの値

#### 戻り値

`children` が有効な要素の場合、その要素を返します。

それ以外の場合、エラーをスローします。

#### 注意点

このメソッドは、配列（`Children.map` の戻り値など）を渡すと**常にエラーをスローします**。つまり、`children` が配列ではなく、単一の React 要素であることを強制します。

### `Children.toArray(children)`

`children` データ構造から配列を作成します。

```javascript
import { Children } from 'react';

export default function ReversedList({ children }) {
  const result = Children.toArray(children);
  result.reverse();
  // ...
}
```

#### パラメータ

- `children`: コンポーネントが受け取った `children` プロパティの値

#### 戻り値

`children` 内の要素のフラットな配列を返します。

#### 注意点

空のノードは返される配列から除外されます。**返される要素のキーは、元の要素のキーとそのネストレベルと位置から計算されます**。これにより、配列をフラット化してもその動作が変わらないことが保証されます。

## 使用方法

### 子をマップする

`children` プロパティとして受け取った JSX をマップするには、`Children.map` を使用します。

```javascript
import { Children } from 'react';

function RowList({ children }) {
  return (
    <div className="RowList">
      {Children.map(children, child =>
        <div className="Row">
          {child}
        </div>
      )}
    </div>
  );
}
```

上記の例では、`RowList` はすべての子を `<div className="Row">` コンテナでラップします。たとえば、親コンポーネントが `RowList` に3つの `<p>` タグを `children` として渡したとします：

```javascript
<RowList>
  <p>This is the first item.</p>
  <p>This is the second item.</p>
  <p>This is the third item.</p>
</RowList>
```

その場合、上記の `RowList` 実装により、最終的なレンダリング結果は次のようになります：

```javascript
<div className="RowList">
  <div className="Row">
    <p>This is the first item.</p>
  </div>
  <div className="Row">
    <p>This is the second item.</p>
  </div>
  <div className="Row">
    <p>This is the third item.</p>
  </div>
</div>
```

### 子の数を数える

`Children.count(children)` を呼び出して、子の数を計算します。

```javascript
import { Children } from 'react';

function RowList({ children }) {
  return (
    <>
      <h1>Total rows: {Children.count(children)}</h1>
      <div className="RowList">
        {children}
      </div>
    </>
  );
}
```

### 子を配列に変換する

`Children.toArray(children)` を使用して、`children` データ構造を通常の JavaScript 配列に変換します。これにより、`filter`、`sort`、`reverse` などの組み込み配列メソッドで配列を操作できます。

```javascript
import { Children } from 'react';

export default function ReversedList({ children }) {
  const result = Children.toArray(children);
  result.reverse();
  return result;
}
```

## `Children` の代替手段

多くの場合、`Children` メソッドを使用するよりも、以下の代替手段の方が明示的で保守しやすいコードになります。

### 複数のコンポーネントを公開する

子を操作する代わりに、複数のコンポーネントを公開することを検討してください。

```javascript
// 推奨されない方法
<RowList>
  <p>First item</p>
  <MoreRows />
</RowList>

// 推奨される方法
<RowList>
  <Row>
    <p>First item</p>
  </Row>
  <Row>
    <p>Second item</p>
  </Row>
  <Row>
    <p>Third item</p>
  </Row>
</RowList>
```

これにより、より明示的で予測可能なコードになります。

### プロパティとして配列を渡す

構造化されたデータを使用することで、より柔軟な実装が可能になります：

```javascript
<RowList rows={[
  { id: 'first', content: <p>First item</p> },
  { id: 'second', content: <p>Second item</p> },
  { id: 'third', content: <p>Third item</p> }
]} />
```

このアプローチでは、各行に関する追加のメタデータを簡単に含めることができます。

### レンダープロップを使用する

レンダリング関数をプロパティとして渡すことで、より柔軟な制御が可能になります：

```javascript
<MouseTracker
  render={mousePosition => (
    <p>The mouse is at {mousePosition.x}, {mousePosition.y}</p>
  )}
/>
```

## 注意事項

- `Children` メソッドは、ネストされたコンポーネントのレンダリング出力を明らかにしません
- `Children` を使用すると、コードが脆弱になる可能性があります
- 可能な限り代替パターンを使用することを推奨します

`Children` は React の古いパターンであり、現代の React 開発では、より明示的で柔軟なコンポーネント構成技術を使用することが推奨されています。
