# Vercel Formspreeインテグレーション

Formspreeは、静的ウェブサイト上のフォーム送信を処理するフォームバックエンドプラットフォームです。開発者はサーバーを必要とせずにフォームデータを収集および管理できます。

## はじめに

Vercelでのformspreeの利用を開始するには、以下の手順に従ってインテグレーションをインストールしてください：

### 1. Vercel CLIのインストール

環境変数をFormspreeからVercelプロジェクトに取り込むには、[Vercel CLI](/docs/cli)をインストールする必要があります。ターミナルで以下のコマンドを実行します：

```bash
pnpm i -g vercel@latest
```

```bash
yarn global add vercel@latest
```

```bash
npm i -g vercel@latest
```

```bash
bun add -g vercel@latest
```

### 2. CMSインテグレーションのインストール

[Formspreeインテグレーション](/integrations/formspree)に移動し、インストール手順に従ってください。

### 3. 環境変数の取り込み

Formspreeインテグレーションをインストールしたら、ターミナルで以下のコマンドを実行して、Formspreeからプロジェクトに環境変数を取り込むことができます：

```bash
vercel env pull
```

## Formspree の設定

### Formspree アカウントの作成

1. [Formspree](https://formspree.io/)にアクセス
2. アカウントを作成
3. 新しいフォームを作成

### フォーム ID の取得

1. Formspree ダッシュボードでフォームを選択
2. フォーム ID をコピー（例：`abc123xyz`）

## フォームの実装

### 基本的なフォーム

```typescript
// components/ContactForm.tsx
'use client';

import { useState } from 'react';

export function ContactForm() {
  const [status, setStatus] = useState<string>('');

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const form = e.currentTarget;
    const formData = new FormData(form);

    try {
      const response = await fetch(`https://formspree.io/f/${process.env.NEXT_PUBLIC_FORMSPREE_FORM_ID}`, {
        method: 'POST',
        body: formData,
        headers: {
          'Accept': 'application/json'
        }
      });

      if (response.ok) {
        setStatus('送信成功！ご連絡ありがとうございます。');
        form.reset();
      } else {
        setStatus('エラーが発生しました。もう一度お試しください。');
      }
    } catch (error) {
      setStatus('エラーが発生しました。もう一度お試しください。');
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="name" className="block text-sm font-medium">
          お名前
        </label>
        <input
          type="text"
          id="name"
          name="name"
          required
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
        />
      </div>

      <div>
        <label htmlFor="email" className="block text-sm font-medium">
          メールアドレス
        </label>
        <input
          type="email"
          id="email"
          name="email"
          required
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
        />
      </div>

      <div>
        <label htmlFor="message" className="block text-sm font-medium">
          メッセージ
        </label>
        <textarea
          id="message"
          name="message"
          rows={4}
          required
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
        />
      </div>

      <button
        type="submit"
        className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
      >
        送信
      </button>

      {status && (
        <p className="text-sm text-gray-600">{status}</p>
      )}
    </form>
  );
}
```

### React Hook Form との統合

```typescript
// components/ContactForm.tsx
'use client';

import { useForm } from 'react-hook-form';
import { useState } from 'react';

type FormData = {
  name: string;
  email: string;
  message: string;
};

export function ContactForm() {
  const { register, handleSubmit, reset, formState: { errors } } = useForm<FormData>();
  const [status, setStatus] = useState<string>('');

  async function onSubmit(data: FormData) {
    try {
      const response = await fetch(`https://formspree.io/f/${process.env.NEXT_PUBLIC_FORMSPREE_FORM_ID}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(data)
      });

      if (response.ok) {
        setStatus('送信成功！ご連絡ありがとうございます。');
        reset();
      } else {
        setStatus('エラーが発生しました。もう一度お試しください。');
      }
    } catch (error) {
      setStatus('エラーが発生しました。もう一度お試しください。');
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label htmlFor="name" className="block text-sm font-medium">
          お名前
        </label>
        <input
          {...register('name', { required: 'お名前を入力してください' })}
          type="text"
          id="name"
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
        />
        {errors.name && (
          <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
        )}
      </div>

      <div>
        <label htmlFor="email" className="block text-sm font-medium">
          メールアドレス
        </label>
        <input
          {...register('email', {
            required: 'メールアドレスを入力してください',
            pattern: {
              value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
              message: '有効なメールアドレスを入力してください'
            }
          })}
          type="email"
          id="email"
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
        />
        {errors.email && (
          <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
        )}
      </div>

      <div>
        <label htmlFor="message" className="block text-sm font-medium">
          メッセージ
        </label>
        <textarea
          {...register('message', { required: 'メッセージを入力してください' })}
          id="message"
          rows={4}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
        />
        {errors.message && (
          <p className="mt-1 text-sm text-red-600">{errors.message.message}</p>
        )}
      </div>

      <button
        type="submit"
        className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
      >
        送信
      </button>

      {status && (
        <p className="text-sm text-gray-600">{status}</p>
      )}
    </form>
  );
}
```

## 高度な機能

### ファイルアップロード

```typescript
async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
  e.preventDefault();

  const form = e.currentTarget;
  const formData = new FormData(form);

  try {
    const response = await fetch(`https://formspree.io/f/${process.env.NEXT_PUBLIC_FORMSPREE_FORM_ID}`, {
      method: 'POST',
      body: formData,
      headers: {
        'Accept': 'application/json'
      }
    });

    // 処理...
  } catch (error) {
    // エラー処理...
  }
}

// JSX
<input
  type="file"
  name="attachment"
  accept=".pdf,.doc,.docx"
  className="mt-1 block w-full"
/>
```

### カスタムフィールド

```typescript
<input type="hidden" name="_subject" value="新しいお問い合わせ" />
<input type="hidden" name="_cc" value="team@example.com" />
<input type="hidden" name="_replyto" value="customer@example.com" />
```

### スパム対策

```typescript
// ハニーポットフィールドを追加
<input
  type="text"
  name="_gotcha"
  style={{ display: 'none' }}
  tabIndex={-1}
  autoComplete="off"
/>
```

## 環境変数

`.env.local` ファイルに以下を追加：

```bash
NEXT_PUBLIC_FORMSPREE_FORM_ID=your_form_id
```

## ベストプラクティス

### バリデーション

- クライアント側とサーバー側の両方でバリデーションを実装
- 適切なエラーメッセージを表示
- 必須フィールドを明示

### ユーザーエクスペリエンス

- 送信中のローディング状態を表示
- 成功/エラーメッセージを明確に表示
- フォーム送信後にフォームをリセット

### セキュリティ

- CSRF 保護を実装
- レート制限を設定
- スパム対策を実装

## トラブルシューティング

### フォームが送信されない

1. フォーム ID が正しいか確認
2. ネットワークタブでリクエストを確認
3. CORS エラーがないか確認

### 環境変数が読み込まれない

1. `.env.local` ファイルが正しい場所にあるか確認
2. 環境変数名が `NEXT_PUBLIC_` で始まっているか確認
3. 開発サーバーを再起動

## 関連リソース

- [Formspree 公式ドキュメント](https://help.formspree.io/)
- [Formspree API リファレンス](https://help.formspree.io/hc/en-us/articles/360013580813-Formspree-API)
- [React Hook Form](https://react-hook-form.com/)
