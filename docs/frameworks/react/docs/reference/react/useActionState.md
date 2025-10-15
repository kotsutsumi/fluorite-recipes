# useActionState

`useActionState` は、フォームアクションの結果に基づいて state を更新するためのフックです。

## リファレンス

```javascript
const [state, formAction, isPending] = useActionState(fn, initialState, permalink?);
```

### パラメータ

- **`fn`**: フォームの送信またはボタンが押されたときに呼び出される関数
- **`initialState`**: state の初期値
- **`permalink`** (オプション): このフォームが変更する一意のページ URL

### 返り値

1. **`state`**: 現在の state。初回レンダー時は `initialState` と一致
2. **`formAction`**: フォームの `action` プロップまたはボタンの `formAction` プロップに渡せる新しいアクション
3. **`isPending`**: 処理中の遷移があるかどうかを示すフラグ

## 使用法

### フォームアクションで state を更新

```javascript
function StatefulForm({}) {
  const [state, formAction] = useActionState(increment, 0);
  return (
    <form>
      {state}
      <button formAction={formAction}>Increment</button>
    </form>
  )
}
```

### サーバ関数との併用

サーバ関数を `useActionState` に渡すと、フォームのハイドレーション前でもフォーム操作が可能になります。

### フォームエラーの表示

アクションから返された情報(エラーメッセージなど)を使用して、UI にフィードバックを表示できます。

### 構造化された情報の表示

サーバアクションから複数の値を含むオブジェクトを返すことができます。

## 注意事項

- React Canary バージョンでは以前 `useFormState` という名前でした
- アクション関数のシグネチャが変更される点に注意(第1引数が現在の state になる)

## トラブルシューティング

アクションが呼び出されても state が更新されない場合:
- アクションが最新の state を返しているか確認
- 依存配列を正しく設定しているか確認
