# 'use server'

`'use server'` は、クライアントサイドのコードから呼び出せるサーバサイドの関数をマークするためのディレクティブです。

## リファレンス

### `'use server'`

非同期関数の本体の先頭に `'use server'` を追加して、その関数をクライアントから呼び出し可能としてマークします。これらの関数を[サーバ関数](/reference/rsc/server-functions)と呼びます。

```javascript
async function addToCart(data) {
  'use server';
  // ...
}
```

クライアントでサーバ関数を呼び出すと、シリアライズされた引数のコピーを含むネットワークリクエストがサーバに送信されます。サーバ関数が値を返す場合、その値はシリアライズされてクライアントに返されます。

### ファイルレベルでの使用

関数を個別にマークする代わりに、ファイルの先頭に `'use server'` ディレクティブを追加できます。これにより、そのファイル内のすべてのエクスポートが、クライアントコードでのインポートを含め、あらゆる場所で使用できるサーバ関数としてマークされます。

```javascript
'use server';

export async function createNote(data) {
  // サーバで実行される
}

export async function updateNote(id, data) {
  // サーバで実行される
}
```

### 配置ルール

`'use server'` ディレクティブは、関数またはモジュールの先頭にのみ配置でき、import を含む他のコードの上に配置する必要があります（ディレクティブの上のコメントは OK です）。

`'use server'` は、二重引用符または一重引用符で記述する必要があり、バックティックは使用できません。

```javascript
// ✓ 正しい
async function serverAction() {
  'use server';
  // ...
}

// または
'use server';
export async function serverAction() {
  // ...
}
```

```javascript
// ✗ 間違い
async function serverAction() {
  const x = 1;
  'use server'; // エラー: 関数の先頭に配置する必要がある
}
```

### サーバサイドファイルでのみ使用可能

`'use server'` は、サーバサイドのファイルでのみ使用できます。結果として得られるサーバ関数は、props を介してクライアントコンポーネントに渡すことができます。サポートされている[シリアライゼーション型](#serializable-parameters-and-return-values)を参照してください。

### 非同期関数でのみ使用可能

`'use server'` は、非同期関数でのみ使用できます。

```javascript
// ✓ 正しい
async function serverFunction() {
  'use server';
  // ...
}

// ✗ 間違い
function syncFunction() {
  'use server'; // エラー: 非同期関数である必要がある
  // ...
}
```

## 使用法

### フォームでのサーバ関数

サーバ関数の最も一般的な使用例は、データを変更するサーバ関数を呼び出すことです。ブラウザでは、[HTML フォーム要素](https://developer.mozilla.org/ja/docs/Web/HTML/Element/form)がユーザーが変更を送信するための伝統的なアプローチです。React Server Components により、React はフォームでのサーバ関数のファーストクラスサポートを導入します。

ユーザーがユーザー名をリクエストできるフォームの例：

```javascript
// App.js
async function requestUsername(formData) {
  'use server';
  const username = formData.get('username');
  // ...
}

export default function App() {
  return (
    <form action={requestUsername}>
      <input type="text" name="username" />
      <button type="submit">リクエスト</button>
    </form>
  );
}
```

この例では、`requestUsername` はフォームに渡されるサーバ関数です。ユーザーがこのフォームを送信すると、サーバ関数 `requestUsername` へのネットワークリクエストが発生します。フォームでサーバ関数を呼び出す場合、React はフォームの [FormData](https://developer.mozilla.org/ja/docs/Web/API/FormData) を最初の引数としてサーバ関数に提供します。

### フォームアクションでの返り値の処理

ユーザー名リクエストフォームでは、ユーザー名が利用できない可能性があります。`requestUsername` は、失敗したかどうかを通知する必要があります。

プログレッシブエンハンスメントをサポートしながら、サーバ関数の結果に基づいて UI を更新するには、[`useActionState`](/reference/react/useActionState) を使用します。

```javascript
// requestUsername.js
'use server';

export async function requestUsername(formData) {
  const username = formData.get('username');
  if (canRequest(username)) {
    // ...
    return 'successful';
  }
  return 'failed';
}
```

```javascript
// UsernameForm.js
'use client';

import { useActionState } from 'react';
import { requestUsername } from './requestUsername';

function UsernameForm() {
  const [state, action] = useActionState(requestUsername, null, 'n/a');

  return (
    <>
      <form action={action}>
        <input type="text" name="username" />
        <button type="submit">リクエスト</button>
      </form>
      <p>前回の送信: {state}</p>
    </>
  );
}
```

ほとんどのフックと同様に、`useActionState` は[クライアントコード](/reference/rsc/use-client)でのみ呼び出すことができます。

### フォーム以外でのサーバ関数の呼び出し

サーバ関数は、サーバとクライアント間の公開されたエンドポイントであり、任意の場所で呼び出すことができます。

[フォーム](/reference/react-dom/components/form)の外でサーバ関数を使用する場合は、[トランジション](/reference/react/useTransition)でサーバ関数を呼び出します。これにより、ローディングインジケーターを表示したり、[楽観的な状態更新](/reference/react/useOptimistic)を表示したり、予期しないエラーを処理したりできます。フォームは、トランジションでサーバ関数を自動的にラップします。

```javascript
// App.js
import { useTransition } from 'react';
import { addToCart } from './actions';

function AddToCartButton({ productId }) {
  const [isPending, startTransition] = useTransition();

  const handleClick = () => {
    startTransition(async () => {
      await addToCart(productId);
    });
  };

  return (
    <button onClick={handleClick} disabled={isPending}>
      {isPending ? '追加中...' : 'カートに追加'}
    </button>
  );
}
```

```javascript
// actions.js
'use server';

export async function addToCart(productId) {
  // カートにアイテムを追加
  await db.cart.add(productId);
}
```

### サーバ関数からのリダイレクト

サーバ関数の実行後に別のページにリダイレクトしたい場合は、[`redirect`](/reference/react/redirect) を使用できます：

```javascript
'use server';

import { redirect } from 'next/navigation';

export async function createNote(formData) {
  const title = formData.get('title');
  const note = await db.notes.create({ title });

  // 新しいノートページにリダイレクト
  redirect(`/notes/${note.id}`);
}
```

### カスタムエラーハンドリング

サーバ関数は、エラーをスローして、それをクライアント側でキャッチできます：

```javascript
'use server';

export async function deleteNote(noteId) {
  const note = await db.notes.findById(noteId);

  if (!note) {
    throw new Error('ノートが見つかりません');
  }

  await db.notes.delete(noteId);
}
```

```javascript
'use client';

import { deleteNote } from './actions';
import { useState } from 'react';

export default function DeleteButton({ noteId }) {
  const [error, setError] = useState(null);

  async function handleDelete() {
    try {
      await deleteNote(noteId);
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <>
      <button onClick={handleDelete}>削除</button>
      {error && <p className="error">{error}</p>}
    </>
  );
}
```

### サーバ関数の再検証

サーバ関数を使用してデータを変更した後、多くの場合、キャッシュされたデータを更新したいと思います。Next.js では、[`revalidatePath`](https://nextjs.org/docs/app/api-reference/functions/revalidatePath) や [`revalidateTag`](https://nextjs.org/docs/app/api-reference/functions/revalidateTag) を使用できます：

```javascript
'use server';

import { revalidatePath } from 'next/cache';

export async function createNote(formData) {
  const title = formData.get('title');
  await db.notes.create({ title });

  // ノート一覧ページを再検証
  revalidatePath('/notes');
}
```

### 楽観的更新

[`useOptimistic`](/reference/react/useOptimistic) フックを使用して、サーバ関数の完了を待つ前に UI を楽観的に更新できます：

```javascript
'use client';

import { useOptimistic } from 'react';
import { createNote } from './actions';

export default function Notes({ notes }) {
  const [optimisticNotes, addOptimisticNote] = useOptimistic(
    notes,
    (state, newNote) => [...state, newNote]
  );

  async function formAction(formData) {
    const title = formData.get('title');
    const tempNote = { id: Math.random(), title, pending: true };

    // UI を即座に更新
    addOptimisticNote(tempNote);

    // サーバ関数を呼び出す
    await createNote(formData);
  }

  return (
    <>
      <form action={formAction}>
        <input name="title" placeholder="新しいノート" />
        <button type="submit">追加</button>
      </form>
      <ul>
        {optimisticNotes.map(note => (
          <li
            key={note.id}
            style={{ opacity: note.pending ? 0.5 : 1 }}
          >
            {note.title}
          </li>
        ))}
      </ul>
    </>
  );
}
```

### ネストされたフォームとサーバ関数

サーバ関数は、`<form>` の `action` プロパティに渡すことができます。ただし、ネストされたフォームは HTML で許可されていません。フレームワークは、サーバ関数をネストされた `<form>` で呼び出すか、`<button>` の `formAction` プロパティで呼び出すことをサポートする場合があります。

```javascript
'use client';

import { createNote } from './actions';

export default function NoteForm() {
  return (
    <form action={createNote}>
      <input name="title" />
      <button type="submit">作成</button>

      {/* formAction を使用した別のアクション */}
      <button formAction={saveDraft}>下書き保存</button>
    </form>
  );
}
```

### クッキーの操作

サーバ関数内で、Next.js の [`cookies`](https://nextjs.org/docs/app/api-reference/functions/cookies) API を使用してクッキーを読み取りおよび設定できます：

```javascript
'use server';

import { cookies } from 'next/headers';

export async function savePreferences(formData) {
  const theme = formData.get('theme');

  // クッキーを設定
  cookies().set('theme', theme, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    maxAge: 60 * 60 * 24 * 365, // 1年
  });
}

export async function getPreferences() {
  // クッキーを読み取る
  const theme = cookies().get('theme')?.value || 'light';
  return { theme };
}
```

### ヘッダーの読み取り

サーバ関数内で、Next.js の [`headers`](https://nextjs.org/docs/app/api-reference/functions/headers) API を使用してヘッダーを読み取ることができます：

```javascript
'use server';

import { headers } from 'next/headers';

export async function logUserAgent() {
  const headersList = headers();
  const userAgent = headersList.get('user-agent');

  console.log('User Agent:', userAgent);
}
```

## シリアライズ可能なパラメータと返り値

クライアントコードがネットワーク経由でサーバ関数を呼び出すため、呼び出しに渡す引数はシリアライズ可能である必要があります。

### サポートされる型

サーバ関数のパラメータとしてサポートされる型：

**プリミティブ型：**
- string
- number
- bigint
- boolean
- undefined
- null
- symbol（Symbol.for でグローバルシンボルレジストリに登録されたもののみ）

**シリアライズ可能な Iterable およびコレクション：**
- Array
- Map
- Set
- Int8Array、Uint8Array などの TypedArray

**特殊なオブジェクト：**
- Date
- FormData
- プレーンな[オブジェクト](https://developer.mozilla.org/ja/docs/Web/JavaScript/Reference/Global_Objects/Object)：[オブジェクト初期化子](https://developer.mozilla.org/ja/docs/Web/JavaScript/Reference/Operators/Object_initializer)で作成され、シリアライズ可能なプロパティを持つもの

**関数：**
- サーバ関数（クライアントからサーバへ、またはサーバからクライアントへ）

**Promise：**
- Promise（シリアライズ可能な値を解決するもの）

### サポートされない型

以下の型はサーバ関数でサポートされていません：

- React 要素（JSX）
- 関数（サーバ関数以外）
- クラス
- 特定のクラスのインスタンスであるオブジェクト（前述の組み込みクラス以外）または [null プロトタイプ](https://developer.mozilla.org/ja/docs/Web/JavaScript/Reference/Global_Objects/Object#null-prototype_objects)を持つオブジェクト
- グローバルに登録されていないシンボル（例：`Symbol('my symbol')`）
- イベント（ブラウザの [Event](https://developer.mozilla.org/ja/docs/Web/API/Event) オブジェクト）

```javascript
// ✗ サポートされない型
'use server';

// React 要素は返せない
export async function getComponent() {
  return <div>Hello</div>; // エラー
}

// 通常の関数は返せない
export async function getHandler() {
  return () => console.log('clicked'); // エラー
}

// クラスインスタンスは返せない
export async function getUser() {
  return new User(); // エラー（User がカスタムクラスの場合）
}
```

```javascript
// ✓ サポートされる型
'use server';

// プリミティブとシリアライズ可能なオブジェクトは OK
export async function getData() {
  return {
    message: 'Hello',
    count: 42,
    items: [1, 2, 3],
    date: new Date(),
  };
}

// サーバ関数は返せる
export async function getAction() {
  async function serverAction() {
    'use server';
    console.log('action called');
  }
  return serverAction;
}
```

## セキュリティ上の考慮事項

### 引数は信頼できない入力として扱う

サーバ関数に渡されるすべての引数は、クライアントから送信されるため、信頼できない入力として扱う必要があります。常に入力を検証してください：

```javascript
'use server';

export async function updateAge(age) {
  // 入力を検証
  if (typeof age !== 'number' || isNaN(age)) {
    throw new Error('Invalid age: must be a number');
  }

  if (age < 0 || age > 150) {
    throw new Error('Invalid age: out of range');
  }

  await db.users.updateAge(age);
}
```

### 認証と認可を確認

サーバ関数内で、ユーザーの認証状態と権限を必ず確認してください：

```javascript
'use server';

import { auth } from './auth';

export async function deletePost(postId) {
  // 認証確認
  const user = await auth.getCurrentUser();
  if (!user) {
    throw new Error('Unauthorized: User not authenticated');
  }

  // 認可確認
  const post = await db.posts.findById(postId);
  if (post.authorId !== user.id && !user.isAdmin) {
    throw new Error('Forbidden: You do not have permission to delete this post');
  }

  await db.posts.delete(postId);
}
```

### 機密情報を返さない

サーバ関数の返り値は、クライアントに送信されます。機密情報を含めないように注意してください：

```javascript
// ✗ 危険: パスワードを返している
'use server';

export async function getUser(userId) {
  const user = await db.users.findById(userId);
  return user; // { id, name, email, password } - パスワードが含まれる
}
```

```javascript
// ✓ 安全: 必要な情報のみを返す
'use server';

export async function getUser(userId) {
  const user = await db.users.findById(userId);
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    // password は含めない
  };
}
```

### SQL インジェクションを防ぐ

データベースクエリを実行する場合は、SQL インジェクション攻撃を防ぐために、パラメータ化されたクエリまたは ORM を使用してください：

```javascript
// ✗ 危険: SQL インジェクションの脆弱性
'use server';

export async function getUserByName(name) {
  const query = `SELECT * FROM users WHERE name = '${name}'`; // 危険
  return await db.query(query);
}
```

```javascript
// ✓ 安全: パラメータ化されたクエリ
'use server';

export async function getUserByName(name) {
  const query = 'SELECT * FROM users WHERE name = ?';
  return await db.query(query, [name]);
}
```

### レート制限

サーバ関数に対するレート制限を実装して、悪用を防ぎます：

```javascript
'use server';

import { rateLimit } from './rate-limit';

export async function sendEmail(to, subject, body) {
  // レート制限をチェック
  const identifier = `email:${to}`;
  const { success } = await rateLimit.check(identifier, 5, '1h'); // 1時間に5回まで

  if (!success) {
    throw new Error('Rate limit exceeded. Please try again later.');
  }

  await emailService.send(to, subject, body);
}
```

## ベストプラクティス

### 1. 明確な命名規則を使用

サーバ関数の名前は、その機能を明確に表すようにしてください：

```javascript
'use server';

// ✓ 推奨
export async function createUser(data) { }
export async function updateUserProfile(userId, data) { }
export async function deleteUserAccount(userId) { }

// ✗ 非推奨
export async function doSomething(data) { }
export async function action1() { }
export async function handle() { }
```

### 2. 関連する関数を同じファイルにグループ化

関連するサーバ関数は、同じファイルにまとめることができます：

```javascript
// actions/users.js
'use server';

export async function createUser(data) {
  // ...
}

export async function updateUser(id, data) {
  // ...
}

export async function deleteUser(id) {
  // ...
}

export async function listUsers(filters) {
  // ...
}
```

### 3. 型安全性を確保する（TypeScript）

TypeScript を使用する場合、サーバ関数に適切な型を付けてください：

```typescript
'use server';

interface User {
  id: string;
  name: string;
  email: string;
}

interface CreateUserData {
  name: string;
  email: string;
  password: string;
}

export async function createUser(data: CreateUserData): Promise<User> {
  // パスワードをハッシュ化
  const hashedPassword = await hash(data.password);

  // ユーザーを作成
  const user = await db.users.create({
    name: data.name,
    email: data.email,
    password: hashedPassword,
  });

  // 機密情報を除いて返す
  return {
    id: user.id,
    name: user.name,
    email: user.email,
  };
}
```

### 4. エラーハンドリングを統一

一貫したエラーハンドリングパターンを使用してください：

```javascript
'use server';

class AppError extends Error {
  constructor(message, statusCode = 500) {
    super(message);
    this.statusCode = statusCode;
  }
}

export async function updateProfile(userId, data) {
  try {
    // 認証確認
    const currentUser = await auth.getCurrentUser();
    if (!currentUser) {
      throw new AppError('Unauthorized', 401);
    }

    if (currentUser.id !== userId) {
      throw new AppError('Forbidden', 403);
    }

    // データ検証
    if (!data.name || data.name.length < 2) {
      throw new AppError('Invalid name', 400);
    }

    // 更新実行
    const user = await db.users.update(userId, data);
    return user;

  } catch (error) {
    if (error instanceof AppError) {
      throw error;
    }
    console.error('Unexpected error:', error);
    throw new AppError('Internal server error', 500);
  }
}
```

### 5. ロギングとモニタリング

サーバ関数の実行をログに記録し、監視してください：

```javascript
'use server';

import { logger } from './logger';

export async function deletePost(postId) {
  const startTime = Date.now();

  try {
    logger.info('Deleting post', { postId });

    const user = await auth.getCurrentUser();
    if (!user) {
      logger.warn('Unauthorized delete attempt', { postId });
      throw new Error('Unauthorized');
    }

    await db.posts.delete(postId);

    const duration = Date.now() - startTime;
    logger.info('Post deleted successfully', { postId, duration, userId: user.id });

  } catch (error) {
    const duration = Date.now() - startTime;
    logger.error('Failed to delete post', {
      postId,
      duration,
      error: error.message,
    });
    throw error;
  }
}
```

## まとめ

`'use server'` ディレクティブは、React Server Components でクライアントとサーバー間の安全な通信を実現する重要な機能です：

- サーバ専用のロジックをマーク
- クライアントから簡単に呼び出し可能
- フォームとのシームレスな統合
- 型安全性とシリアライゼーションのサポート

セキュリティとパフォーマンスを考慮しながら、適切に使用することで、安全で保守性の高いアプリケーションを構築できます。

重要なポイント：
- 常に入力を検証する
- 認証と認可を確認する
- 機密情報を返さない
- 明確な命名規則を使用する
- 一貫したエラーハンドリングを実装する
