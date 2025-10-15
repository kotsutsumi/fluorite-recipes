# サーバ関数

サーバ関数は、クライアントサイドのコードから呼び出せるサーバサイドの関数です。

## 概要

サーバ関数を使用すると、クライアントコンポーネントからサーバで実行される関数を呼び出すことができます。サーバ関数は `"use server"` ディレクティブでマークされます。クライアントコンポーネントに props として渡すか、クライアントコンポーネントからインポートして使用できます。

### 用語の注意

2024年9月までは、すべてのサーバ関数を「サーバアクション (Server Action)」と呼んでいました。サーバアクションは、フォームアクションとして使用されるサーバ関数を指します。すべてのサーバ関数がサーバアクションであるとは限りませんが、すべてのサーバアクションはサーバ関数です。

## 使用方法

### サーバコンポーネントでのサーバ関数の作成

サーバコンポーネント内で `"use server"` ディレクティブを使用してサーバ関数を定義できます：

```javascript
async function EmptyNote() {
  async function createNoteAction() {
    'use server';
    // データベースにノートを作成
    await db.notes.create();
  }

  return <Button onClick={createNoteAction} />;
}
```

React がサーバコンポーネント `EmptyNote` をレンダーする際、`createNoteAction` 関数への参照を作成し、その参照をクライアントコンポーネント `Button` に渡します。ボタンがクリックされると、React はサーバにリクエストを送信して `createNoteAction` 関数を実行します。

```javascript
"use client";

export default function Button({ onClick }) {
  console.log(onClick);
  // {$$typeof: Symbol.for("react.server.reference"), $$id: 'createNoteAction'}
  return <button onClick={onClick}>Create Empty Note</button>;
}
```

### クライアントコンポーネントからのサーバ関数のインポート

クライアントコンポーネントは、`"use server"` ディレクティブを使用するファイルからサーバ関数をインポートできます：

```javascript
"use server";

export async function createNote() {
  await db.notes.create();
}
```

バンドラーがクライアントコンポーネント `EmptyNote` をビルドする際、バンドルに `createNote` 関数への参照を作成します。`button` がクリックされると、React はサーバにリクエストを送信して、提供された参照を使用して `createNote` 関数を実行します。

```javascript
"use client";
import { createNote } from './actions';

export default function EmptyNote() {
  console.log(createNote);
  // {$$typeof: Symbol.for("react.server.reference"), $$id: 'createNote'}
  return <button onClick={createNote}>Create Empty Note</button>;
}
```

### サーバ関数とアクションの組み合わせ

サーバ関数をクライアント側のアクション内で呼び出すことができます：

```javascript
"use server";

export async function updateName(name) {
  if (!name) {
    return { error: 'Name is required' };
  }
  await db.users.updateName(name);
}
```

クライアント側：

```javascript
"use client";

import { updateName } from './actions';
import { useState } from 'react';

export default function UpdateName() {
  const [name, setName] = useState('');
  const [error, setError] = useState(null);

  const submitAction = async () => {
    const { error } = await updateName(name);
    if (error) {
      setError(error);
      return;
    }
    // 成功時の処理
    redirect('/success');
  };

  return (
    <form action={submitAction}>
      <input value={name} onChange={(e) => setName(e.target.value)} />
      <button type="submit">Update Name</button>
      {error && <p>{error}</p>}
    </form>
  );
}
```

この例では、クライアントコンポーネントのアクション `submitAction` がサーバ関数 `updateName` を呼び出しています。

## フォームでサーバ関数を使用する

サーバ関数は、React のフォームと統合されています。

### フォームアクションとしてのサーバ関数

サーバ関数は、フォームの `action` プロパティとして使用できます：

```javascript
"use server";

export async function createNote(formData) {
  const title = formData.get('title');
  const content = formData.get('content');

  await db.notes.create({ title, content });
}
```

```javascript
"use client";

import { createNote } from './actions';

export default function NewNote() {
  return (
    <form action={createNote}>
      <input name="title" placeholder="タイトル" />
      <textarea name="content" placeholder="内容" />
      <button type="submit">作成</button>
    </form>
  );
}
```

### プログレッシブエンハンスメント

サーバ関数は、JavaScript が読み込まれる前でもフォームが送信できるようにします。これにより、ユーザーが低速なネットワーク環境や JavaScript が無効な環境でもフォームを送信できます。

```javascript
"use server";

export async function createNote(formData) {
  // JavaScript が読み込まれていなくてもフォームは動作する
  const title = formData.get('title');
  await db.notes.create({ title });
}
```

### フォームデータの読み取り

フォームアクションとして使用されるサーバ関数は、`FormData` オブジェクトを引数として受け取ります：

```javascript
"use server";

export async function updateUser(formData) {
  const name = formData.get('name');
  const email = formData.get('email');
  const age = Number(formData.get('age'));

  await db.users.update({ name, email, age });
}
```

### リダイレクト

サーバ関数の実行後、別のページにリダイレクトすることができます：

```javascript
"use server";

import { redirect } from 'next/navigation';

export async function createNote(formData) {
  const title = formData.get('title');
  const note = await db.notes.create({ title });

  redirect(`/notes/${note.id}`);
}
```

### フォームの状態管理

`useActionState` フックを使用して、フォームの状態を管理できます：

```javascript
"use client";

import { useActionState } from 'react';
import { createNote } from './actions';

export default function NewNote() {
  const [state, formAction] = useActionState(createNote, { error: null });

  return (
    <form action={formAction}>
      <input name="title" placeholder="タイトル" />
      {state.error && <p className="error">{state.error}</p>}
      <button type="submit">作成</button>
    </form>
  );
}
```

サーバ関数側：

```javascript
"use server";

export async function createNote(prevState, formData) {
  const title = formData.get('title');

  if (!title) {
    return { error: 'タイトルは必須です' };
  }

  await db.notes.create({ title });
  return { error: null };
}
```

### 保留状態の表示

`useFormStatus` フックを使用して、フォームの送信中に保留状態を表示できます：

```javascript
"use client";

import { useFormStatus } from 'react-dom';

export default function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <button type="submit" disabled={pending}>
      {pending ? '送信中...' : '送信'}
    </button>
  );
}
```

### 楽観的更新

`useOptimistic` フックを使用して、サーバの応答を待つ前に UI を更新できます：

```javascript
"use client";

import { useOptimistic } from 'react';
import { createNote } from './actions';

export default function Notes({ notes }) {
  const [optimisticNotes, addOptimisticNote] = useOptimistic(
    notes,
    (state, newNote) => [...state, newNote]
  );

  async function formAction(formData) {
    const title = formData.get('title');
    addOptimisticNote({ id: Math.random(), title, pending: true });
    await createNote(formData);
  }

  return (
    <>
      <form action={formAction}>
        <input name="title" />
        <button type="submit">追加</button>
      </form>
      <ul>
        {optimisticNotes.map(note => (
          <li key={note.id} style={{ opacity: note.pending ? 0.5 : 1 }}>
            {note.title}
          </li>
        ))}
      </ul>
    </>
  );
}
```

## シリアライズ可能な引数と返り値

サーバ関数は、ネットワーク経由で呼び出されるため、引数と返り値はシリアライズ可能である必要があります。

### サポートされる型

クライアントからサーバに渡すことができる型：

- **プリミティブ型**
  - string
  - number
  - bigint
  - boolean
  - undefined
  - null
  - symbol (Symbol.for で登録されたグローバルシンボルのみ)

- **シリアライズ可能な Iterable**
  - Array
  - Map
  - Set
  - TypedArray (Int8Array, Uint8Array など)

- **特殊な型**
  - Date
  - FormData
  - プレーンなオブジェクト (オブジェクトリテラルで作成され、シリアライズ可能なプロパティを持つもの)
  - サーバ関数 (クライアントからサーバに、サーバからクライアントに渡す場合)
  - Promise

### サポートされない型

以下の型はサーバ関数の引数や返り値として使用できません：

- React 要素 (JSX)
- 関数 (サーバ関数としてマークされていない通常の関数)
- クラス
- 特定のクラスのインスタンスであるオブジェクト (前述の組み込みクラス以外)
- Symbol.for で登録されていないシンボル

```javascript
// NG: React 要素は返せない
"use server";
export async function getComponent() {
  return <div>Hello</div>; // エラー
}

// OK: データを返す
"use server";
export async function getData() {
  return { message: 'Hello' }; // OK
}
```

## セキュリティ上の考慮事項

### 入力の検証

サーバ関数の引数は、クライアントから送信されるため、常に信頼できない入力として扱う必要があります：

```javascript
"use server";

export async function updateUser(formData) {
  const age = formData.get('age');

  // 入力を検証する
  if (typeof age !== 'string' || isNaN(Number(age))) {
    throw new Error('Invalid age');
  }

  const ageNumber = Number(age);
  if (ageNumber < 0 || ageNumber > 150) {
    throw new Error('Age out of range');
  }

  await db.users.update({ age: ageNumber });
}
```

### 認証と認可

サーバ関数内で、ユーザーの権限を必ず確認してください：

```javascript
"use server";

import { auth } from './auth';

export async function deleteNote(noteId) {
  const user = await auth.getCurrentUser();

  if (!user) {
    throw new Error('Unauthorized');
  }

  const note = await db.notes.findById(noteId);

  if (note.userId !== user.id) {
    throw new Error('Forbidden');
  }

  await db.notes.delete(noteId);
}
```

### 機密情報の扱い

サーバ関数の返り値は、クライアントに送信されます。機密情報を返さないように注意してください：

```javascript
// NG: パスワードを返している
"use server";
export async function getUser(userId) {
  const user = await db.users.findById(userId);
  return user; // { id, name, email, password } - パスワードが含まれる
}

// OK: 必要な情報のみを返す
"use server";
export async function getUser(userId) {
  const user = await db.users.findById(userId);
  return {
    id: user.id,
    name: user.name,
    email: user.email
    // password は含めない
  };
}
```

## エラーハンドリング

サーバ関数内で発生したエラーは、クライアントに送信されます：

```javascript
"use server";

export async function createNote(formData) {
  const title = formData.get('title');

  if (!title) {
    throw new Error('タイトルは必須です');
  }

  try {
    await db.notes.create({ title });
  } catch (error) {
    console.error('Database error:', error);
    throw new Error('ノートの作成に失敗しました');
  }
}
```

クライアント側でエラーをキャッチする：

```javascript
"use client";

import { createNote } from './actions';
import { useState } from 'react';

export default function NewNote() {
  const [error, setError] = useState(null);

  async function handleSubmit(formData) {
    try {
      await createNote(formData);
      // 成功時の処理
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <form action={handleSubmit}>
      <input name="title" />
      <button type="submit">作成</button>
      {error && <p className="error">{error}</p>}
    </form>
  );
}
```

## ベストプラクティス

### 1. サーバ関数は非同期関数として定義する

サーバ関数は常に `async` 関数として定義してください：

```javascript
"use server";

// OK
export async function createNote() {
  await db.notes.create();
}

// NG: async がない
export function createNote() {
  db.notes.create();
}
```

### 2. 明確な命名規則を使用する

サーバ関数の名前は、その機能を明確に表すようにしてください：

```javascript
"use server";

// 推奨
export async function createNote() { }
export async function updateNote() { }
export async function deleteNote() { }

// 避ける
export async function doSomething() { }
export async function action1() { }
```

### 3. 1つのファイルに関連するサーバ関数をまとめる

関連するサーバ関数は、1つのファイルにまとめることができます：

```javascript
// actions/notes.js
"use server";

export async function createNote(formData) {
  // ...
}

export async function updateNote(id, formData) {
  // ...
}

export async function deleteNote(id) {
  // ...
}
```

### 4. 型安全性を確保する (TypeScript)

TypeScript を使用する場合、サーバ関数の引数と返り値に型を付けてください：

```typescript
"use server";

interface Note {
  id: string;
  title: string;
  content: string;
}

export async function createNote(formData: FormData): Promise<Note> {
  const title = formData.get('title') as string;
  const content = formData.get('content') as string;

  const note = await db.notes.create({ title, content });
  return note;
}
```

## まとめ

サーバ関数は、クライアントとサーバー間の通信を簡素化する強力な機能です。適切に使用することで：

- API エンドポイントを作成する必要がない
- 型安全な通信が可能
- フォームとのシームレスな統合
- プログレッシブエンハンスメントのサポート

セキュリティとパフォーマンスを考慮しながら、サーバ関数を活用することで、より保守性の高いアプリケーションを構築できます。
