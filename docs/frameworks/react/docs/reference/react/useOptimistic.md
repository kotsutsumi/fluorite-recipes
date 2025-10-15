# useOptimistic

`useOptimistic` は、UI を楽観的に更新するための React フックで、非同期アクション中に異なる state を表示できます。

## リファレンス

```javascript
const [optimisticState, addOptimistic] = useOptimistic(state, updateFn);
```

### パラメータ

- **`state`**: 初期状態および保留中のアクションがない場合に返される値
- **`updateFn(currentState, optimisticValue)`**: 現在の state と `addOptimistic` に渡された楽観的更新値を受け取り、結果として得られる楽観的 state を返す純粋関数

### 返り値

1. **`optimisticState`**: 結果として得られる楽観的 state。アクションが保留中でない場合は `state` と等しく、そうでない場合は `updateFn` が返す値と等しい
2. **`addOptimistic`**: 楽観的更新を行う際に呼び出すディスパッチ関数

## 使用法

### フォームを楽観的に更新

```javascript
function Thread({ messages, sendMessageAction }) {
  const [optimisticMessages, addOptimisticMessage] = useOptimistic(
    messages,
    (state, newMessage) => [
      {
        text: newMessage,
        sending: true
      },
      ...state,
    ]
  );

  async function formAction(formData) {
    addOptimisticMessage(formData.get("message"));
    await sendMessageAction(formData);
  }

  return (
    <>
      {optimisticMessages.map((message, index) => (
        <div key={index}>
          {message.text}
          {message.sending && <small> (送信中...)</small>}
        </div>
      ))}
      <form action={formAction}>
        <input type="text" name="message" />
        <button type="submit">送信</button>
      </form>
    </>
  );
}
```

### 動作の流れ

1. ユーザーがフォームを送信
2. `addOptimisticMessage` が呼び出され、UI が即座に更新される
3. サーバリクエストがバックグラウンドで実行される
4. サーバレスポンスを受信すると、楽観的メッセージが実際のメッセージに置き換えられる

## 主な特徴

### ネットワークリクエスト中の即座の UI 更新

非同期操作の完了を待たずに、ユーザーに即座のフィードバックを提供します。

### ユーザーエクスペリエンスの向上

- レスポンシブな UI
- 待機時間の短縮感
- 予測される結果の即座の表示

### 自動ロールバック

サーバから実際のレスポンスが返されると、楽観的 state は自動的に実際の state に置き換えられます。

## ベストプラクティス

### いつ使用すべきか

- フォーム送信
- いいね/お気に入りの切り替え
- コメントやメッセージの投稿
- リストアイテムの追加/削除

### 注意点

- エラーハンドリングを適切に実装
- 楽観的更新が失敗する可能性を考慮
- ユーザーに操作が進行中であることを示す

## 例: いいねボタン

```javascript
function LikeButton({ postId, initialLikes }) {
  const [likes, setLikes] = useState(initialLikes);
  const [optimisticLikes, addOptimisticLike] = useOptimistic(
    likes,
    (state, newLikes) => newLikes
  );

  async function handleLike() {
    addOptimisticLike(optimisticLikes + 1);
    const newLikes = await likePost(postId);
    setLikes(newLikes);
  }

  return (
    <button onClick={handleLike}>
      いいね ({optimisticLikes})
    </button>
  );
}
```

`useOptimistic` は、非同期操作中のユーザーエクスペリエンスを大幅に改善する強力なツールです。
