# PureComponent

`PureComponent` は、プロパティと状態が同じ場合に再レンダリングをスキップする React クラスコンポーネントです。

```javascript
class Greeting extends PureComponent {
  render() {
    return <h1>Hello, {this.props.name}!</h1>;
  }
}
```

## 概要

新しいコードでは、クラスコンポーネントの代わりに関数コンポーネントを使用することを推奨します。

## リファレンス

### `PureComponent`

`Component` の代わりに `PureComponent` を使用して、プロパティと状態が同じ場合の再レンダリングをスキップします：

```javascript
import { PureComponent } from 'react';

class Greeting extends PureComponent {
  render() {
    return <h1>Hello, {this.props.name}!</h1>;
  }
}
```

`PureComponent` は `Component` のサブクラスで、すべての `Component` API をサポートします。`PureComponent` を拡張することは、プロパティと状態を浅く比較するカスタム `shouldComponentUpdate` メソッドを定義することと同等です。

## 使用方法

### クラスコンポーネントで不要な再レンダリングをスキップする

React は通常、親が再レンダリングされるたびにコンポーネントを再レンダリングします。最適化として、親が再レンダリングされても、新しいプロパティと状態が古いプロパティと状態と同じ場合に React が再レンダリングしないコンポーネントを作成できます。クラスコンポーネントは、`PureComponent` を拡張することでこの動作を選択できます：

```javascript
class Greeting extends PureComponent {
  render() {
    return <h1>Hello, {this.props.name}!</h1>;
  }
}
```

React コンポーネントは常に純粋なレンダリングロジックを持つべきです。これは、プロパティ、状態、コンテキストが変更されていない場合、同じ出力を返す必要があることを意味します。`PureComponent` を使用することで、コンポーネントがこの要件を満たしていることを React に伝え、プロパティと状態が変更されていない限り、React は再レンダリングする必要がありません。ただし、使用しているコンテキストが変更された場合、コンポーネントは再レンダリングされます。

### 完全な例

```javascript
import { PureComponent } from 'react';

class Greeting extends PureComponent {
  render() {
    console.log('Greeting was rendered at', new Date().toLocaleTimeString());
    return <h3>Hello{this.props.name && ', '}{this.props.name}!</h3>;
  }
}
```

この例では、`name` プロパティが変更されない限り、`Greeting` コンポーネントは再レンダリングされません。

### 入力フィールドの例

以下の例では、`Greeting` は入力フィールドをクリックしても再レンダリングされませんが、その親コンポーネントは更新されます：

```javascript
import { PureComponent, useState } from 'react';

export default function MyApp() {
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  return (
    <>
      <label>
        Name{': '}
        <input value={name} onChange={e => setName(e.target.value)} />
      </label>
      <label>
        Address{': '}
        <input value={address} onChange={e => setAddress(e.target.value)} />
      </label>
      <Greeting name={name} />
    </>
  );
}

class Greeting extends PureComponent {
  render() {
    console.log('Greeting was rendered at', new Date().toLocaleTimeString());
    return <h3>Hello{this.props.name && ', '}{this.props.name}!</h3>;
  }
}
```

この例では、`address` 入力を変更しても `Greeting` コンポーネントは再レンダリングされません。なぜなら、`name` プロパティが変更されていないからです。

## PureComponent vs Component

### Component の動作

通常の `Component` は、親が再レンダリングされるたびに再レンダリングされます：

```javascript
import { Component } from 'react';

class Greeting extends Component {
  render() {
    console.log('Greeting was rendered at', new Date().toLocaleTimeString());
    return <h3>Hello{this.props.name && ', '}{this.props.name}!</h3>;
  }
}
```

### PureComponent の動作

`PureComponent` は、プロパティと状態が変更されていない場合、再レンダリングをスキップします：

```javascript
import { PureComponent } from 'react';

class Greeting extends PureComponent {
  render() {
    console.log('Greeting was rendered at', new Date().toLocaleTimeString());
    return <h3>Hello{this.props.name && ', '}{this.props.name}!</h3>;
  }
}
```

## 注意事項

### 浅い比較

`PureComponent` は、プロパティと状態を**浅く比較**します。つまり、オブジェクトや配列の内容が変更されても、参照が同じ場合は変更が検出されません：

```javascript
// これは再レンダリングをトリガーしません
this.setState({ items: this.state.items }); // 同じ配列参照

// これは再レンダリングをトリガーします
this.setState({ items: [...this.state.items, newItem] }); // 新しい配列参照
```

### ネストされたオブジェクトの更新

ネストされたオブジェクトを更新する場合は、新しいオブジェクトを作成する必要があります：

```javascript
// 間違い：浅い比較では検出されない
this.state.user.name = 'Taylor';
this.setState({ user: this.state.user });

// 正しい：新しいオブジェクトを作成
this.setState({
  user: {
    ...this.state.user,
    name: 'Taylor'
  }
});
```

## 関数コンポーネントへの移行

新しいコードでは、`PureComponent` の代わりに `memo` を使用した関数コンポーネントを推奨します。

### クラスコンポーネント（PureComponent）

```javascript
import { PureComponent } from 'react';

class Greeting extends PureComponent {
  render() {
    return <h3>Hello{this.props.name && ', '}{this.props.name}!</h3>;
  }
}
```

### 関数コンポーネント（memo）

```javascript
import { memo } from 'react';

const Greeting = memo(function Greeting({ name }) {
  return <h3>Hello{name && ', '}{name}!</h3>;
});
```

`memo` は `PureComponent` と同等の機能を関数コンポーネントで提供します。

## いつ PureComponent を使用するか

### 使用すべき場合

1. **頻繁に再レンダリングされるコンポーネント**: 親コンポーネントが頻繁に更新されるが、このコンポーネント自体のプロパティはあまり変更されない場合

2. **レンダリングコストが高いコンポーネント**: レンダリングに時間がかかるコンポーネント（複雑な計算や多数の要素を含む場合）

3. **プロパティと状態がプリミティブな場合**: プロパティと状態が主に文字列、数値、真偽値などのプリミティブ型の場合

### 使用を避けるべき場合

1. **複雑なオブジェクトや配列を持つ場合**: ネストされたオブジェクトや配列を含むプロパティが多い場合、浅い比較では不十分な場合があります

2. **ほとんど再レンダリングされないコンポーネント**: 最適化のオーバーヘッドが利益を上回る場合

3. **新しいコード**: 新しいコードでは、関数コンポーネントと `memo` を使用することを推奨します

## カスタム比較

`PureComponent` の比較ロジックをカスタマイズしたい場合は、`shouldComponentUpdate` を実装できます：

```javascript
class Greeting extends Component {
  shouldComponentUpdate(nextProps, nextState) {
    // カスタム比較ロジック
    return (
      nextProps.name !== this.props.name ||
      nextProps.age !== this.props.age
    );
  }

  render() {
    return <h3>Hello, {this.props.name}!</h3>;
  }
}
```

関数コンポーネントでは、`memo` の第2引数でカスタム比較関数を提供できます：

```javascript
const Greeting = memo(
  function Greeting({ name, age }) {
    return <h3>Hello, {name}!</h3>;
  },
  (prevProps, nextProps) => {
    // true を返すと再レンダリングをスキップ
    return prevProps.name === nextProps.name && prevProps.age === nextProps.age;
  }
);
```

## パフォーマンスに関する考慮事項

### 比較のコスト

`PureComponent` は、すべての再レンダリングの前にプロパティと状態を比較します。プロパティが多い場合、この比較自体がコストになる可能性があります。

### 不必要な最適化

Donald Knuth の有名な言葉: 「時期尚早な最適化は諸悪の根源」

パフォーマンスの問題が実際に発生してから最適化を検討してください。

## まとめ

- `PureComponent` は、プロパティと状態が同じ場合に再レンダリングをスキップします
- `Component` と同じ API をサポートしますが、自動的に浅い比較を行います
- オブジェクトや配列を更新する場合は、新しい参照を作成する必要があります
- 新しいコードでは、関数コンポーネントと `memo` の使用を推奨します
- パフォーマンスの問題が実際に発生してから最適化を検討してください
- すべてのコンポーネントに `PureComponent` を使用する必要はありません

**最重要:** 新しい React プロジェクトでは、クラスコンポーネントの代わりに関数コンポーネントとフックを使用することを強く推奨します。
