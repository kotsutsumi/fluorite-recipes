# useSyncExternalStore

`useSyncExternalStore` は、外部ストアを購読するための React フックです。

## リファレンス

```javascript
const snapshot = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot?)
```

### パラメータ

- **`subscribe`**: 1つのコールバック引数を取り、ストアを購読する関数。ストアが変更されたときにコールバックを呼び出す必要がある。購読を解除する関数を返す
- **`getSnapshot`**: ストアから現在のデータのスナップショットを返す関数
- **`getServerSnapshot`** (オプション): サーバレンダリング中およびクライアントでのハイドレーション中に使用されるスナップショットを返す関数

### 返り値

レンダリングロジックで使用できる、ストアの現在のスナップショットを返します。

## 使用法

### 外部ストアへの購読

```javascript
function TodosApp() {
  const todos = useSyncExternalStore(
    todosStore.subscribe,
    todosStore.getSnapshot
  );
  // ...
}
```

ほとんどの組み込み React コンポーネントは、React の state からのみ読み取ります。しかし、時には外部データソースからデータを読み取る必要があります:
- React の外部でデータを保持するサードパーティの state 管理ライブラリ
- 変更可能な値を公開するブラウザ API

### ブラウザ API への購読

```javascript
function useOnlineStatus() {
  const isOnline = useSyncExternalStore(
    subscribe,
    getSnapshot,
    getServerSnapshot
  );
  return isOnline;
}

function subscribe(callback) {
  window.addEventListener('online', callback);
  window.addEventListener('offline', callback);
  return () => {
    window.removeEventListener('online', callback);
    window.removeEventListener('offline', callback);
  };
}

function getSnapshot() {
  return navigator.onLine;
}

function getServerSnapshot() {
  return true; // サーバでは常にオンラインと表示
}
```

### ロジックをカスタムフックに抽出

```javascript
function useOnlineStatus() {
  const isOnline = useSyncExternalStore(subscribe, getSnapshot);
  return isOnline;
}

// コンポーネントで使用
function ChatIndicator() {
  const isOnline = useOnlineStatus();
  return <h1>{isOnline ? '✅ Online' : '❌ Disconnected'}</h1>;
}
```

## 重要な考慮事項

### getSnapshot は不変のスナップショットを返す

`getSnapshot` 関数が返すデータのスナップショットがイミュータブルな場合、変更されたときに新しいスナップショットオブジェクトを返してください。それ以外の場合、キャッシュされたスナップショットを返してください。

```javascript
// ✅ 正しい: 毎回新しいオブジェクトを返さない
function getSnapshot() {
  return todosStore.getSnapshot();
}

// ❌ 間違い: 毎回新しいオブジェクトを返す
function getSnapshot() {
  return { todos: todosStore.todos };
}
```

### subscribe 関数の再作成を防ぐ

```javascript
// ✅ 正しい: コンポーネント外で定義
function subscribe(callback) {
  // ...
}

function ChatIndicator() {
  const isOnline = useSyncExternalStore(subscribe, getSnapshot);
  // ...
}

// ❌ 間違い: レンダーごとに再作成される
function ChatIndicator() {
  const subscribe = (callback) => {
    // ...
  };
  const isOnline = useSyncExternalStore(subscribe, getSnapshot);
  // ...
}

// ✅ または useCallback でラップ
function ChatIndicator() {
  const subscribe = useCallback((callback) => {
    // ...
  }, []);
  const isOnline = useSyncExternalStore(subscribe, getSnapshot);
  // ...
}
```

## ベストプラクティス

### React の state を優先

可能な限り、`useState` と `useReducer` を使用してください。`useSyncExternalStore` は主に既存の非 React コードと統合する必要がある場合に有用です。

### カスタムフックにロジックを抽出

購読ロジックをカスタムフックに抽出することで、コンポーネントをシンプルに保つことができます。

### サーバーサイドレンダリングに対応

サーバーサイドレンダリングを使用する場合は、`getServerSnapshot` を提供してください。

## トラブルシューティング

### エラー: "getSnapshot should return a cached value"

`getSnapshot` が呼び出されるたびに新しいオブジェクトを返していることを意味します。

解決策:
- ストアが変更されたときのみ新しいスナップショットを返す
- 変更されていない場合はキャッシュされたスナップショットを返す

### subscribe 関数が毎レンダー実行される

`subscribe` 関数がコンポーネント内で定義されており、毎レンダーで新しい関数になっている可能性があります。

解決策:
- `subscribe` 関数をコンポーネント外で定義
- `useCallback` でラップ

## 主な使用例

- サードパーティの state 管理ライブラリ(Redux, MobX など)との統合
- ブラウザ API の購読(オンライン/オフライン状態、メディアクエリなど)
- React 外部で管理されるデータの購読
