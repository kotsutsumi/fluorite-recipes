# 組み込みの React DOM フック

`react-dom` パッケージには、ブラウザ DOM 環境で実行されるウェブアプリケーション専用のフックが含まれています。

## 注意

これらのフックは iOS、Android、Windows アプリケーションなど非ブラウザ環境ではサポートされていません。

## フォーム関連フック

フォームを使用して、情報を送信するためのインタラクティブなコントロールを作成できます。

### `useFormStatus`

フォームのステータスに基づいて UI を更新できます。

```javascript
import { useFormStatus } from 'react-dom';
import { useActionState } from 'react';

function Form({ action }) {
  async function increment(n) {
    return n + 1;
  }

  const [count, incrementFormAction] = useActionState(increment, 0);

  return (
    <form action={action}>
      <button formAction={incrementFormAction}>Count: {count}</button>
      <SubmitButton />
    </form>
  );
}

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <button disabled={pending} type="submit">
      {pending ? 'Submitting...' : 'Submit'}
    </button>
  );
}
```

## 主な用途

### フォームの送信状態を追跡

`useFormStatus` を使用して、フォームが送信中かどうかを確認し、UI を適切に更新できます。

### ローディングインジケータの表示

```javascript
function FormButton() {
  const { pending, data } = useFormStatus();

  return (
    <button type="submit" disabled={pending}>
      {pending ? (
        <>
          <Spinner /> Submitting...
        </>
      ) : (
        'Submit'
      )}
    </button>
  );
}
```

### 送信データへのアクセス

```javascript
function FormStatus() {
  const { pending, data, method, action } = useFormStatus();

  return (
    <div>
      {pending && (
        <p>
          Submitting {data?.get('username')} via {method}...
        </p>
      )}
    </div>
  );
}
```

## 重要な注意事項

### フォームの子コンポーネント内で呼び出す

`useFormStatus` は、`<form>` 要素の**子コンポーネント**内で呼び出す必要があります。

```javascript
// ✅ 正しい: フォームの子コンポーネント内
function SubmitButton() {
  const { pending } = useFormStatus();
  return <button disabled={pending}>Submit</button>;
}

function MyForm() {
  return (
    <form>
      <SubmitButton /> {/* useFormStatus を呼び出す */}
    </form>
  );
}

// ❌ 間違い: フォームと同じコンポーネント内
function MyForm() {
  const { pending } = useFormStatus(); // これは動作しない
  return (
    <form>
      <button disabled={pending}>Submit</button>
    </form>
  );
}
```

### 親フォームのステータスのみを返す

`useFormStatus` は、同じコンポーネント内の `<form>` のステータスは追跡しません。最も近い親 `<form>` のステータスのみを返します。

## ベストプラクティス

- フォームボタンを個別のコンポーネントに分離
- `pending` 状態を活用して UX を向上
- 送信中はフォームを無効化
- 明確なローディングインジケータを提供

## 関連する React フック

- `useActionState`: フォームアクションの結果に基づいて state を更新
- `useOptimistic`: フォームを楽観的に更新
- `useTransition`: UI をブロックせずに state を更新

## 使用例

### 完全なフォームの例

```javascript
import { useFormStatus } from 'react-dom';
import { useActionState } from 'react';

async function submitForm(formData) {
  await new Promise(resolve => setTimeout(resolve, 2000));
  return { success: true, message: 'Form submitted!' };
}

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <button type="submit" disabled={pending}>
      {pending ? 'Submitting...' : 'Submit'}
    </button>
  );
}

function ContactForm() {
  const [state, formAction] = useActionState(submitForm, null);

  return (
    <form action={formAction}>
      <input name="name" placeholder="Name" required />
      <input name="email" type="email" placeholder="Email" required />
      <textarea name="message" placeholder="Message" required />

      <SubmitButton />

      {state?.success && <p>{state.message}</p>}
    </form>
  );
}
```
