# useFormStatus

`useFormStatus` は、最新のフォーム送信のステータス情報を提供する React フックです。

## リファレンス

```javascript
const { pending, data, method, action } = useFormStatus();
```

### パラメータ

`useFormStatus` は引数を取りません。

### 返り値

以下のプロパティを持つ `status` オブジェクトを返します:

- **`pending`**: ブール値。`true` の場合、親 `<form>` が送信中
- **`data`**: `FormData` インターフェースを実装したオブジェクト。親 `<form>` が送信しているデータを含む。アクティブな送信がない場合や親 `<form>` がない場合は `null`
- **`method`**: `'get'` または `'post'` の文字列値。親 `<form>` が `GET` または `POST` HTTP メソッドのどちらで送信しているかを表す
- **`action`**: 親 `<form>` の `action` プロップに渡された関数への参照。親 `<form>` がない場合、プロパティは `null`

## 使用法

### 保留中の状態を表示

```javascript
import { useFormStatus } from 'react-dom';

function Submit() {
  const { pending } = useFormStatus();

  return (
    <button type="submit" disabled={pending}>
      {pending ? 'Submitting...' : 'Submit'}
    </button>
  );
}
```

### 送信されたフォームデータを読み取る

```javascript
import { useFormStatus } from 'react-dom';

function UsernameForm() {
  const { pending, data } = useFormStatus();

  return (
    <div>
      <input type="text" name="username" disabled={pending} />
      {data && <p>Requesting {data.get("username")}...</p>}
    </div>
  );
}
```

### 完全な例

```javascript
import { useFormStatus } from 'react-dom';

function SubmitButton() {
  const { pending, data, method, action } = useFormStatus();

  return (
    <button type="submit" disabled={pending}>
      {pending ? (
        <>
          Submitting {data?.get('email')} via {method}...
        </>
      ) : (
        'Submit'
      )}
    </button>
  );
}

function MyForm() {
  async function handleSubmit(formData) {
    await submitToServer(formData);
  }

  return (
    <form action={handleSubmit}>
      <input name="email" type="email" required />
      <SubmitButton />
    </form>
  );
}
```

## 重要な考慮事項

### `<form>` 内でレンダーされたコンポーネントで呼び出す

`useFormStatus` は、`<form>` 要素内でレンダーされるコンポーネントに対してのみステータス情報を返します。

```javascript
// ✅ 正しい
function MyForm() {
  return (
    <form>
      <SubmitButton /> {/* ✅ useFormStatus が動作 */}
    </form>
  );
}

function SubmitButton() {
  const { pending } = useFormStatus(); // ✅ 親フォームのステータスを取得
  return <button disabled={pending}>Submit</button>;
}

// ❌ 間違い
function MyForm() {
  const { pending } = useFormStatus(); // ❌ 動作しない(同じコンポーネント)
  return (
    <form>
      <button disabled={pending}>Submit</button>
    </form>
  );
}
```

### 親 `<form>` のステータスのみを返す

同じコンポーネント内の `<form>` や子の `<form>` のステータスは追跡しません。

```javascript
function Form() {
  return (
    <form>
      <fieldset>
        <SubmitButton /> {/* 親フォームのステータスを追跡 */}
        <form> {/* このネストされたフォームは追跡されない */}
          <SubmitButton /> {/* このボタンはネストされたフォームを追跡 */}
        </form>
      </fieldset>
    </form>
  );
}
```

## トラブルシューティング

### `status.pending` が常に `false`

以下を確認してください:

1. `useFormStatus` が `<form>` 内でレンダーされるコンポーネントで呼び出されているか
2. コンポーネントが `<form>` の**子**として配置されているか
3. 親 `<form>` が実際に送信されているか

```javascript
// ❌ 動作しない例
function MyForm() {
  const { pending } = useFormStatus(); // 親フォームがない
  return <form>...</form>;
}

// ✅ 動作する例
function MyForm() {
  return (
    <form>
      <FormContent /> {/* フォームの子 */}
    </form>
  );
}

function FormContent() {
  const { pending } = useFormStatus(); // 正しく動作
  return <button disabled={pending}>Submit</button>;
}
```

## ベストプラクティス

### ボタンを個別のコンポーネントに分離

```javascript
// ✅ 推奨: 再利用可能なボタンコンポーネント
function SubmitButton({ children }) {
  const { pending } = useFormStatus();
  return (
    <button type="submit" disabled={pending}>
      {pending ? 'Loading...' : children}
    </button>
  );
}

// 複数のフォームで使用可能
function LoginForm() {
  return (
    <form>
      <input name="username" />
      <SubmitButton>Log in</SubmitButton>
    </form>
  );
}

function SignupForm() {
  return (
    <form>
      <input name="email" />
      <SubmitButton>Sign up</SubmitButton>
    </form>
  );
}
```

### ローディングインジケータ

```javascript
function EnhancedSubmitButton() {
  const { pending } = useFormStatus();

  return (
    <button type="submit" disabled={pending} className={pending ? 'loading' : ''}>
      {pending && <Spinner />}
      {pending ? 'Submitting...' : 'Submit'}
    </button>
  );
}
```

### フォーム全体を無効化

```javascript
function FormFields() {
  const { pending } = useFormStatus();

  return (
    <fieldset disabled={pending}>
      <input name="email" type="email" />
      <input name="password" type="password" />
      <button type="submit">Submit</button>
    </fieldset>
  );
}
```

## 関連 API

- `useActionState`: フォームアクションの結果に基づいて state を更新
- `useOptimistic`: フォームを楽観的に更新
- `useTransition`: UI をブロックせずに state を更新
