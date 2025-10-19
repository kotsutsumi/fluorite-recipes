# Form Submissions

BotIDは、`action`と`method`属性を使用する従来のHTMLフォームをサポートしていません：

```html
<!-- このフォームはBotIDで動作しません -->
<form id="contact-form" method="POST" action="/api/contact">
  <!-- form fields -->
  <button type="submit">Send</button>
</form>
```

ネイティブのフォーム送信は、ブラウザでの処理方法により、BotIDが必要なヘッダーを添付できないため、連携できません。

必要なヘッダーを確実に添付するには、JavaScriptでフォーム送信を処理し、`fetch`または`XMLHttpRequest`を使用してリクエストを送信し、BotIDが適切に要求を検証できるようにする必要があります。

## BotIDでフォーム送信を有効にする

フォームをリファクタリングする方法は次のとおりです：

### React / Next.jsの場合

```typescript
async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
  e.preventDefault();
  const formData = new FormData(e.currentTarget);

  const response = await fetch('/api/contact', {
    method: 'POST',
    body: formData,
  });

  if (response.ok) {
    const data = await response.json();
    console.log('Success:', data);
  } else {
    console.error('Error:', response.status);
  }
}

return (
  <form onSubmit={handleSubmit}>
    <input name="email" type="email" required />
    <textarea name="message" required />
    <button type="submit">Send</button>
  </form>
);
```

### Vanilla JavaScriptの場合

```javascript
document.getElementById('contact-form').addEventListener('submit', async (e) => {
  e.preventDefault();

  const formData = new FormData(e.target);

  try {
    const response = await fetch('/api/contact', {
      method: 'POST',
      body: formData,
    });

    if (response.ok) {
      const data = await response.json();
      console.log('Success:', data);
    } else {
      console.error('Error:', response.status);
    }
  } catch (error) {
    console.error('Network error:', error);
  }
});
```

HTMLは従来通り：

```html
<form id="contact-form">
  <input name="email" type="email" required />
  <textarea name="message" required></textarea>
  <button type="submit">Send</button>
</form>
```

## Next.jsサーバーアクションでのフォーム送信

Next.jsを使用している場合、サーバーアクションを使用し、`checkBotId`関数でリクエストを検証できます：

### サーバーアクション

```typescript
'use server';

import { checkBotId } from 'botid/server';

export async function submitContact(formData: FormData) {
  const verification = await checkBotId();

  if (verification.isBot) {
    throw new Error('アクセス拒否');
  }

  // フォームデータを処理
  const email = formData.get('email');
  const message = formData.get('message');

  // データベースに保存、メール送信など
  console.log('Email:', email);
  console.log('Message:', message);

  return { success: true };
}
```

### クライアントコンポーネント

```typescript
'use client';

import { submitContact } from './actions';
import { useState } from 'react';

export function ContactForm() {
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  async function handleSubmit(formData: FormData) {
    setStatus('loading');
    try {
      await submitContact(formData);
      setStatus('success');
    } catch (error) {
      setStatus('error');
    }
  }

  return (
    <form action={handleSubmit}>
      <input name="email" type="email" required />
      <textarea name="message" required />
      <button type="submit" disabled={status === 'loading'}>
        {status === 'loading' ? 'Sending...' : 'Send'}
      </button>
      {status === 'success' && <p>Message sent successfully!</p>}
      {status === 'error' && <p>Error sending message. Please try again.</p>}
    </form>
  );
}
```

## JSON形式でのデータ送信

FormDataの代わりにJSON形式でデータを送信することもできます：

```typescript
async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
  e.preventDefault();
  const formData = new FormData(e.currentTarget);

  const data = {
    email: formData.get('email'),
    message: formData.get('message'),
  };

  const response = await fetch('/api/contact', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  if (response.ok) {
    const result = await response.json();
    console.log('Success:', result);
  }
}
```

サーバー側：

```typescript
import { checkBotId } from 'botid/server';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const verification = await checkBotId();

  if (verification.isBot) {
    return NextResponse.json(
      { error: 'Bot detected' },
      { status: 403 }
    );
  }

  const data = await request.json();
  // データを処理
  return NextResponse.json({ success: true });
}
```

## 完全な例

### お問い合わせフォーム

`app/contact/page.tsx`:

```typescript
'use client';

import { useState } from 'react';

export default function ContactPage() {
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus('loading');

    const formData = new FormData(e.currentTarget);

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        setStatus('success');
        setMessage('Thank you for your message!');
        e.currentTarget.reset();
      } else {
        const error = await response.json();
        setStatus('error');
        setMessage(error.error || 'An error occurred');
      }
    } catch (error) {
      setStatus('error');
      setMessage('Network error. Please try again.');
    }
  }

  return (
    <div>
      <h1>Contact Us</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="name">Name:</label>
          <input
            id="name"
            name="name"
            type="text"
            required
            disabled={status === 'loading'}
          />
        </div>
        <div>
          <label htmlFor="email">Email:</label>
          <input
            id="email"
            name="email"
            type="email"
            required
            disabled={status === 'loading'}
          />
        </div>
        <div>
          <label htmlFor="message">Message:</label>
          <textarea
            id="message"
            name="message"
            required
            disabled={status === 'loading'}
          />
        </div>
        <button type="submit" disabled={status === 'loading'}>
          {status === 'loading' ? 'Sending...' : 'Send Message'}
        </button>
      </form>
      {message && (
        <p className={status === 'error' ? 'error' : 'success'}>
          {message}
        </p>
      )}
    </div>
  );
}
```

`app/api/contact/route.ts`:

```typescript
import { checkBotId } from 'botid/server';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const verification = await checkBotId();

  if (verification.isBot) {
    return NextResponse.json(
      { error: 'Bot detected' },
      { status: 403 }
    );
  }

  const formData = await request.formData();
  const name = formData.get('name');
  const email = formData.get('email');
  const message = formData.get('message');

  // バリデーション
  if (!name || !email || !message) {
    return NextResponse.json(
      { error: 'All fields are required' },
      { status: 400 }
    );
  }

  // データベースに保存、メール送信など
  console.log('Contact form submission:', { name, email, message });

  return NextResponse.json({ success: true });
}
```

## ファイルアップロードを含むフォーム

```typescript
async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
  e.preventDefault();
  const formData = new FormData(e.currentTarget);

  const response = await fetch('/api/upload', {
    method: 'POST',
    body: formData, // FormDataは自動的にmultipart/form-dataとして送信される
  });

  if (response.ok) {
    console.log('Upload successful');
  }
}

return (
  <form onSubmit={handleSubmit}>
    <input name="file" type="file" required />
    <input name="description" type="text" />
    <button type="submit">Upload</button>
  </form>
);
```

## ベストプラクティス

1. **エラーハンドリング**: ネットワークエラーとサーバーエラーの両方を処理
2. **ローディング状態**: フォーム送信中は送信ボタンを無効化
3. **ユーザーフィードバック**: 成功/失敗メッセージを表示
4. **バリデーション**: クライアント側とサーバー側の両方でバリデーション
5. **プログレッシブエンハンスメント**: JavaScriptが無効の場合のフォールバック（可能であれば）

## トラブルシューティング

### フォーム送信が動作しない

1. `e.preventDefault()`が呼び出されているか確認
2. `fetch`が正しいURLを呼び出しているか確認
3. ネットワークタブでリクエストを確認
4. BotIDヘッダーが添付されているか確認

### サーバー側で403エラー

1. クライアント側でBotIDが初期化されているか確認
2. `protect`配列にパスが含まれているか確認
3. メソッドが一致しているか確認（POST vs GET等）

### ファイルアップロードが失敗する

1. `Content-Type`ヘッダーを手動で設定していないか確認（FormDataは自動設定）
2. サーバー側でファイルサイズ制限を確認
3. Next.jsの場合、`api`設定でボディサイズ制限を調整

詳細については、[BotID Documentation](/docs/botid)を参照してください。
