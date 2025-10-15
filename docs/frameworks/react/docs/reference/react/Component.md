# Component

`Component` は、React のクラスコンポーネントを作成するための基底クラスです。

```javascript
class Greeting extends Component {
  render() {
    return <h1>Hello, {this.props.name}!</h1>;
  }
}
```

## 概要

クラスコンポーネントはまだサポートされていますが、新しいコードでは推奨されません。代わりに関数コンポーネントの使用を推奨します。

## リファレンス

### `Component`

React コンポーネントをクラスとして定義するには、組み込みの `Component` クラスを拡張し、`render` メソッドを定義します：

```javascript
import { Component } from 'react';

class Greeting extends Component {
  render() {
    return <h1>Hello, {this.props.name}!</h1>;
  }
}
```

`render` メソッドのみが必須です。他のメソッドはオプションです。

## プロパティ

### `context`

クラスコンポーネント内で利用可能な Context を読み取ります。

```javascript
class Button extends Component {
  static contextType = ThemeContext;

  render() {
    const theme = this.context;
    return <button className={theme} />;
  }
}
```

注意: 一度に読み取れる Context は1つだけです。

### `props`

クラスコンポーネントに渡されたプロパティは `this.props` で利用できます。

```javascript
class Greeting extends Component {
  render() {
    return <h1>Hello, {this.props.name}!</h1>;
  }
}

// 使用例
<Greeting name="Taylor" />
```

### `refs`

非推奨です。使用しないでください。

### `state`

クラスコンポーネントの状態は `this.state` で利用できます。`state` プロパティは必ずオブジェクトである必要があります。状態を直接変更しないでください。状態を変更したい場合は、新しい状態で `setState` を呼び出します。

```javascript
class Counter extends Component {
  state = {
    age: 42,
  };

  handleAgeChange = () => {
    this.setState({
      age: this.state.age + 1
    });
  };

  render() {
    return (
      <>
        <button onClick={this.handleAgeChange}>
          Increment age
        </button>
        <p>You are {this.state.age}.</p>
      </>
    );
  }
}
```

## メソッド

### `render()`

`render` メソッドは必須で、表示したい出力を定義します。

```javascript
import { Component } from 'react';

class Greeting extends Component {
  render() {
    return <h1>Hello, {this.props.name}!</h1>;
  }
}
```

`render` は以下を返すことができます：

- React 要素（JSX で作成）
- 配列またはフラグメント
- ポータル
- 文字列または数値
- `true`、`false`、`null`、`undefined`（何もレンダリングされません）

### `setState(nextState, callback?)`

コンポーネントの状態を更新します。

```javascript
class Form extends Component {
  state = {
    name: 'Taylor',
  };

  handleNameChange = (e) => {
    this.setState({
      name: e.target.value
    });
  };

  render() {
    return (
      <>
        <input
          value={this.state.name}
          onChange={this.handleNameChange}
        />
        <p>Hello, {this.state.name}.</p>
      </>
    );
  }
}
```

#### パラメータ

- `nextState`: オブジェクトまたは関数
  - オブジェクトの場合：`this.state` に浅くマージされます
  - 関数の場合：更新関数として扱われます。純粋である必要があり、保留中の状態とプロパティを引数として取り、返すオブジェクトが `this.state` に浅くマージされます

- **オプション** `callback`: 指定した場合、React は更新がコミットされた後にコールバックを呼び出します

#### 戻り値

`setState` は何も返しません。

#### 注意事項

- `setState` は、次のレンダリングのリクエストと考えてください。即座に状態を変更するわけではありません
- `setState` を呼び出した直後に `this.state` を読み取ると、呼び出し前の古い値が表示されます

### `forceUpdate(callback?)`

コンポーネントを強制的に再レンダリングします。

通常は必要ありません。コンポーネントの `render` メソッドが `this.props`、`this.state`、`this.context` のみから読み取る場合、コンポーネント内またはその親の1つで `setState` を呼び出すと、自動的に再レンダリングされます。

## ライフサイクルメソッド

### `componentDidMount()`

コンポーネントが画面に追加（マウント）された直後に呼び出されます。

```javascript
class ChatRoom extends Component {
  componentDidMount() {
    this.setupConnection();
  }

  componentWillUnmount() {
    this.destroyConnection();
  }
  // ...
}
```

### `componentDidUpdate(prevProps, prevState, snapshot?)`

コンポーネントが更新されたプロパティや状態で再レンダリングされた直後に呼び出されます。

```javascript
class ChatRoom extends Component {
  componentDidUpdate(prevProps, prevState) {
    if (
      this.props.roomId !== prevProps.roomId ||
      this.state.serverUrl !== prevState.serverUrl
    ) {
      this.destroyConnection();
      this.setupConnection();
    }
  }
  // ...
}
```

### `componentWillUnmount()`

コンポーネントが画面から削除（アンマウント）される前に呼び出されます。

```javascript
class ChatRoom extends Component {
  componentWillUnmount() {
    this.destroyConnection();
  }
  // ...
}
```

### `shouldComponentUpdate(nextProps, nextState, nextContext)`

パフォーマンス最適化のために使用されます。

```javascript
class Rectangle extends Component {
  shouldComponentUpdate(nextProps, nextState) {
    if (
      nextProps.position.x === this.props.position.x &&
      nextProps.position.y === this.props.position.y &&
      nextProps.size.width === this.props.size.width &&
      nextProps.size.height === this.props.size.height
    ) {
      return false; // 再レンダリングをスキップ
    }
    return true;
  }
  // ...
}
```

### `getSnapshotBeforeUpdate(prevProps, prevState)`

DOM が更新される直前に呼び出されます。

```javascript
class ScrollingList extends Component {
  getSnapshotBeforeUpdate(prevProps, prevState) {
    if (prevProps.list.length < this.props.list.length) {
      return this.listRef.current.scrollHeight;
    }
    return null;
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    if (snapshot !== null) {
      this.listRef.current.scrollTop =
        this.listRef.current.scrollHeight - snapshot;
    }
  }
  // ...
}
```

### `static getDerivedStateFromError(error)`

エラーバウンダリを作成するために使用されます。

```javascript
class ErrorBoundary extends Component {
  state = {
    hasError: false
  };

  static getDerivedStateFromError(error) {
    return {
      hasError: true
    };
  }

  render() {
    if (this.state.hasError) {
      return <h1>Something went wrong.</h1>;
    }

    return this.props.children;
  }
}
```

### `componentDidCatch(error, info)`

エラーをログに記録するために使用されます。

```javascript
class ErrorBoundary extends Component {
  state = {
    hasError: false
  };

  static getDerivedStateFromError(error) {
    return {
      hasError: true
    };
  }

  componentDidCatch(error, info) {
    logErrorToMyService(error, info.componentStack);
  }

  render() {
    if (this.state.hasError) {
      return <h1>Something went wrong.</h1>;
    }

    return this.props.children;
  }
}
```

## 使用方法

### クラスコンポーネントの定義

React コンポーネントをクラスとして定義するには、組み込みの `Component` クラスを拡張し、`render` メソッドを定義します：

```javascript
import { Component } from 'react';

class Greeting extends Component {
  render() {
    return <h1>Hello, {this.props.name}!</h1>;
  }
}
```

## 関数コンポーネントへの移行

### シンプルなコンポーネントの移行

```javascript
// クラスコンポーネント
class Greeting extends Component {
  render() {
    return <h1>Hello, {this.props.name}!</h1>;
  }
}

// 関数コンポーネント
function Greeting({ name }) {
  return <h1>Hello, {name}!</h1>;
}
```

### 状態を持つコンポーネントの移行

```javascript
// クラスコンポーネント
class Counter extends Component {
  state = {
    count: 0
  };

  handleClick = () => {
    this.setState({ count: this.state.count + 1 });
  };

  render() {
    return (
      <button onClick={this.handleClick}>
        Clicked {this.state.count} times
      </button>
    );
  }
}

// 関数コンポーネント
function Counter() {
  const [count, setCount] = useState(0);

  function handleClick() {
    setCount(count + 1);
  }

  return (
    <button onClick={handleClick}>
      Clicked {count} times
    </button>
  );
}
```

### ライフサイクルメソッドを持つコンポーネントの移行

```javascript
// クラスコンポーネント
class ChatRoom extends Component {
  componentDidMount() {
    this.setupConnection();
  }

  componentDidUpdate(prevProps) {
    if (this.props.roomId !== prevProps.roomId) {
      this.destroyConnection();
      this.setupConnection();
    }
  }

  componentWillUnmount() {
    this.destroyConnection();
  }

  // ...
}

// 関数コンポーネント
function ChatRoom({ roomId }) {
  useEffect(() => {
    const connection = setupConnection(roomId);
    return () => connection.destroy();
  }, [roomId]);

  // ...
}
```

### Context を持つコンポーネントの移行

```javascript
// クラスコンポーネント
class Button extends Component {
  static contextType = ThemeContext;

  render() {
    const theme = this.context;
    return <button className={theme} />;
  }
}

// 関数コンポーネント
function Button() {
  const theme = useContext(ThemeContext);
  return <button className={theme} />;
}
```

## 推奨事項

クラスコンポーネントは引き続きサポートされていますが、新しいコードでは関数コンポーネントとフックの使用を推奨します。関数コンポーネントは：

- より簡潔で読みやすい
- テストしやすい
- パフォーマンスの最適化が容易
- React の最新機能を活用できる

既存のクラスコンポーネントを書き直す必要はありませんが、新しいコンポーネントには関数コンポーネントを使用することを検討してください。
