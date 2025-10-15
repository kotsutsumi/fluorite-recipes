# useEffect

`useEffect` は、コンポーネントを外部システムと同期させるための React フックです。

## リファレンス

```javascript
useEffect(setup, dependencies?)
```

### パラメータ

- **`setup`**: Effect のロジックを含む関数。オプションでクリーンアップ関数を返すことができる
- **`dependencies`** (オプション): `setup` 内で参照されるすべてのリアクティブな値のリスト

### 返り値

`useEffect` は `undefined` を返します。

## 使用法

### 外部システムへの接続

```javascript
function ChatRoom({ roomId }) {
  const [serverUrl, setServerUrl] = useState('https://localhost:1234');

  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    connection.connect();
    return () => {
      connection.disconnect();
    };
  }, [serverUrl, roomId]);
}
```

ネットワーク、ブラウザ API、サードパーティライブラリなどとの接続を維持するために使用します。

### カスタムフックで Effect をラップ

```javascript
function useChatRoom({ serverUrl, roomId }) {
  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    connection.connect();
    return () => {
      connection.disconnect();
    };
  }, [serverUrl, roomId]);
}
```

再利用可能なロジックとして Effect を管理できます。

### 非 React ウィジェットの制御

```javascript
useEffect(() => {
  const map = mapRef.current;
  map.setZoomLevel(zoomLevel);
}, [zoomLevel]);
```

外部システムを React コンポーネントの state と同期させます。

### データのフェッチ

```javascript
useEffect(() => {
  let ignore = false;

  async function startFetching() {
    const json = await fetchTodos(userId);
    if (!ignore) {
      setTodos(json);
    }
  }

  startFetching();

  return () => {
    ignore = true;
  };
}, [userId]);
```

## ベストプラクティス

- すべてのリアクティブな依存関係を指定
- 適切なクリーンアップ関数を実装
- 不要な Effect の再実行を防ぐ
- 外部システムとの同期に使用し、一般的な state 管理には使用しない

## トラブルシューティング

### 開発モードで Effect が2回実行される

React は開発モードでクリーンアップ関数が適切に実装されているか確認するため、Effect を2回実行します。

### 無限の再レンダーループを防ぐ

依存配列を慎重に管理し、Effect 内で state を更新する際は条件を付けてください。

### クリーンアップ関数でリソースを管理

接続、購読、タイマーなどのリソースは、クリーンアップ関数で適切に解放してください。

## 主要な原則

- Effect は外部システムとの同期に使用
- コンポーネントがマウント、更新、アンマウントされる際に自動的に実行
- クリーンアップ関数で副作用を適切に管理
