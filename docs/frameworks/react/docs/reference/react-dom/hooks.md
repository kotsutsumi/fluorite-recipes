# 組み込みの React DOM フック

`react-dom` パッケージには、ブラウザ DOM 環境で実行されるウェブアプリケーション専用のフックが含まれています。

---

## ⚠️ 重要な注意事項

これらのフックは**ブラウザ DOM 環境専用**です。以下の環境ではサポートされていません：
- iOS アプリケーション
- Android アプリケーション
- Windows デスクトップアプリケーション
- その他の非ブラウザ環境

---

## 📋 利用可能なフック一覧

| フック | 用途 | 主な機能 | 詳細リンク |
|--------|------|----------|-----------|
| `useFormStatus` | フォーム送信状態の追跡 | pending、data、method、action の取得 | [詳細](/reference/react-dom/hooks/useFormStatus) |

---

## フォーム関連フック

### useFormStatus

**概要**: フォームの送信ステータスに基づいて UI を動的に更新できるフックです。

**主な用途**:
- ✅ フォーム送信中の UI 無効化
- ✅ ローディングインジケータの表示
- ✅ 送信データへのアクセス
- ✅ 送信メソッド（GET/POST）の確認

**返り値**:

```typescript
{
  pending: boolean;    // フォームが送信中かどうか
  data: FormData | null;    // 送信中のフォームデータ
  method: 'get' | 'post';   // HTTP メソッド
  action: Function | null;  // フォームアクション関数
}
```

**基本的な使用例**:

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

**重要な制約**:

1. **フォームの子コンポーネント内で呼び出す必要がある**

```javascript
// ✅ 正しい: フォームの子コンポーネント内
function SubmitButton() {
  const { pending } = useFormStatus();
  return <button disabled={pending}>Submit</button>;
}

function MyForm() {
  return (
    <form>
      <SubmitButton />
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

2. **親フォームのステータスのみを返す**

同じコンポーネント内の `<form>` や子の `<form>` のステータスは追跡しません。最も近い親 `<form>` のステータスのみを返します。

[詳細ドキュメント →](/reference/react-dom/hooks/useFormStatus)

---

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
