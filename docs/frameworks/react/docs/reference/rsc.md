# React Server Components (RSC)

React Server Components は、サーバとクライアントの境界を明確に定義し、効率的なコンポーネントレンダリングを実現する新しいアーキテクチャです。

## 概要

React Server Components (RSC) は、クライアントアプリケーションや SSR サーバとは別の環境で、バンドル前に事前にレンダーされるコンポーネントです。サーバコンポーネントはビルド時に実行することも、リクエスト時にウェブサーバで実行することもできます。

### 主な利点

- **バンドルサイズの削減** - サーバコンポーネントのコードはクライアントバンドルに含まれません
- **データアクセスの効率化** - API を構築せずにデータレイヤに直接アクセス可能
- **初期ページロードの高速化** - 事前レンダリングによりコンテンツをすぐに表示
- **セキュリティの向上** - サーバ専用のロジックをクライアントから隠蔽

## コアコンセプト

### サーバコンポーネント

デフォルトではすべてのコンポーネントがサーバコンポーネントです。これらは：

- サーバ側で実行され、クライアントに送信されない
- データベースやファイルシステムへの直接アクセスが可能
- インタラクティブな機能（`useState` など）は使用不可

```javascript
// サーバコンポーネント（デフォルト）
async function BlogPost({ id }) {
  const post = await db.posts.findById(id);

  return (
    <article>
      <h1>{post.title}</h1>
      <p>{post.content}</p>
    </article>
  );
}
```

詳細: [サーバコンポーネント](/reference/rsc/server-components)

### クライアントコンポーネント

`'use client'` ディレクティブでマークされたコンポーネントは、ブラウザで実行されます：

- インタラクティブな機能（フック、イベントハンドラー）を使用可能
- ブラウザ API にアクセス可能
- クライアントバンドルに含まれる

```javascript
'use client';

import { useState } from 'react';

export default function Counter() {
  const [count, setCount] = useState(0);

  return (
    <button onClick={() => setCount(count + 1)}>
      カウント: {count}
    </button>
  );
}
```

詳細: [`'use client'` ディレクティブ](/reference/rsc/use-client)

### サーバ関数

`'use server'` ディレクティブでマークされた関数は、クライアントから呼び出し可能なサーバサイド関数です：

- クライアントコンポーネントから呼び出し可能
- サーバでのみ実行される
- フォームアクションとして使用可能

```javascript
'use server';

export async function createNote(formData) {
  const title = formData.get('title');
  await db.notes.create({ title });
}
```

詳細: [サーバ関数](/reference/rsc/server-functions)、[`'use server'` ディレクティブ](/reference/rsc/use-server)

## ディレクティブ

RSC では、2つの主要なディレクティブを使用してコードの実行環境を指定します：

### `'use client'`

クライアントで実行されるコードをマークします。

```javascript
'use client';

import { useState } from 'react';

export default function InteractiveComponent() {
  const [state, setState] = useState(0);
  // インタラクティブな機能を使用可能
}
```

**使用場面:**
- React のフック（`useState`、`useEffect` など）を使用する場合
- イベントハンドラーを使用する場合
- ブラウザ API を使用する場合
- サードパーティのクライアント専用ライブラリを使用する場合

詳細: [`'use client'` リファレンス](/reference/rsc/use-client)

### `'use server'`

サーバで実行される関数をマークします。

```javascript
'use server';

export async function saveData(data) {
  // サーバでのみ実行される
  await db.save(data);
  return { success: true };
}
```

**使用場面:**
- データベース操作を実行する場合
- ファイルシステムへのアクセスが必要な場合
- API キーなどの機密情報を扱う場合
- サーバ専用のライブラリを使用する場合

詳細: [`'use server'` リファレンス](/reference/rsc/use-server)、[ディレクティブの詳細](/reference/rsc/directives)

## コンポーネント構成パターン

### サーバコンポーネントからクライアントコンポーネントへ

サーバコンポーネントは、クライアントコンポーネントをインポートして使用できます：

```javascript
// ServerPage.js (サーバコンポーネント)
import ClientButton from './ClientButton';

export default async function ServerPage() {
  const data = await fetchData(); // サーバで実行

  return (
    <div>
      <h1>サーバコンポーネント</h1>
      <ClientButton data={data} />
    </div>
  );
}
```

```javascript
// ClientButton.js
'use client';

export default function ClientButton({ data }) {
  return <button onClick={() => alert(data)}>クリック</button>;
}
```

### クライアントコンポーネントからサーバ関数へ

クライアントコンポーネントは、サーバ関数を呼び出すことができます：

```javascript
// actions.js
'use server';

export async function submitForm(formData) {
  await db.save(formData);
}
```

```javascript
// Form.js
'use client';

import { submitForm } from './actions';

export default function Form() {
  return (
    <form action={submitForm}>
      <input name="title" />
      <button type="submit">送信</button>
    </form>
  );
}
```

### サーバコンポーネントを children として渡す

クライアントコンポーネントは、サーバコンポーネントを `children` として受け取れます：

```javascript
// ClientWrapper.js
'use client';

export default function ClientWrapper({ children }) {
  return <div className="wrapper">{children}</div>;
}
```

```javascript
// Page.js (サーバコンポーネント)
import ClientWrapper from './ClientWrapper';
import ServerContent from './ServerContent';

export default function Page() {
  return (
    <ClientWrapper>
      {/* ServerContent はサーバで実行される */}
      <ServerContent />
    </ClientWrapper>
  );
}
```

## データの受け渡し

### シリアライズ可能な型

サーバコンポーネントからクライアントコンポーネント、またはサーバ関数との間でデータを受け渡す場合、シリアライズ可能である必要があります。

**サポートされる型:**
- プリミティブ型（string、number、boolean、null、undefined）
- 配列とオブジェクト
- Date オブジェクト
- Map、Set
- TypedArray
- Promise
- サーバ関数

**サポートされない型:**
- 関数（サーバ関数を除く）
- クラスインスタンス（Date などの組み込みクラスを除く）
- React 要素（props として渡す場合）
- シンボル（グローバルシンボルを除く）

```javascript
// ✓ OK
<ClientComponent
  text="Hello"
  count={42}
  items={[1, 2, 3]}
  data={{ name: 'John' }}
  date={new Date()}
/>

// ✗ NG
<ClientComponent
  onClick={() => console.log('clicked')} // 関数は渡せない
  user={new User()} // カスタムクラスは渡せない
/>
```

## フォームとの統合

サーバ関数は、React のフォームとシームレスに統合されます：

```javascript
// actions.js
'use server';

export async function createNote(formData) {
  const title = formData.get('title');

  if (!title) {
    return { error: 'タイトルは必須です' };
  }

  await db.notes.create({ title });
  return { success: true };
}
```

```javascript
// NoteForm.js
'use client';

import { useActionState } from 'react';
import { createNote } from './actions';

export default function NoteForm() {
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

## セキュリティのベストプラクティス

### 入力の検証

サーバ関数では、必ずすべての入力を検証してください：

```javascript
'use server';

export async function updateUser(formData) {
  const age = formData.get('age');

  // 入力を検証
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

ユーザーの権限を必ず確認してください：

```javascript
'use server';

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

クライアントに機密情報を返さないように注意してください：

```javascript
// ✗ 危険
'use server';
export async function getUser(userId) {
  const user = await db.users.findById(userId);
  return user; // password が含まれる可能性
}

// ✓ 安全
'use server';
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

## パフォーマンスの最適化

### クライアントコンポーネントをツリーの下層に配置

パフォーマンスを最適化するために、クライアントコンポーネントを可能な限りツリーの下層に配置します：

```javascript
// ✓ 推奨
function Page() {
  return (
    <div>
      <Header /> {/* サーバコンポーネント */}
      <Content /> {/* サーバコンポーネント */}
      <InteractiveButton /> {/* クライアントコンポーネント */}
    </div>
  );
}

// ✗ 非推奨
'use client';
function Page() {
  // ページ全体がクライアントバンドルに含まれる
  return (
    <div>
      <Header />
      <Content />
      <InteractiveButton />
    </div>
  );
}
```

### データフェッチをサーバ側で実行

可能な限り、データフェッチはサーバコンポーネントで行います：

```javascript
// サーバコンポーネント
async function UserProfile({ userId }) {
  const user = await db.users.findById(userId); // サーバで実行

  return (
    <div>
      <h1>{user.name}</h1>
      <ClientInteractiveSection user={user} />
    </div>
  );
}
```

## 関連ドキュメント

### コアコンセプト

- [サーバコンポーネント](/reference/rsc/server-components) - サーバ側で実行されるコンポーネントの詳細
- [サーバ関数](/reference/rsc/server-functions) - クライアントから呼び出し可能なサーバ関数

### ディレクティブ

- [ディレクティブ](/reference/rsc/directives) - ディレクティブの詳細ガイド
- [`'use client'`](/reference/rsc/use-client) - クライアントコンポーネントをマークするディレクティブ
- [`'use server'`](/reference/rsc/use-server) - サーバ関数をマークするディレクティブ

## まとめ

React Server Components は、サーバとクライアントの最適な分離を実現する強力なアーキテクチャです：

- **サーバコンポーネント** - デフォルトでサーバで実行、バンドルサイズを削減
- **クライアントコンポーネント** - `'use client'` でマーク、インタラクティブな機能を提供
- **サーバ関数** - `'use server'` でマーク、クライアントから安全に呼び出し可能
- **シリアライゼーション** - データの受け渡しにはシリアライズ可能な型を使用
- **セキュリティ** - 入力検証、認証・認可、機密情報の保護が重要

適切に使用することで、高性能でセキュアなアプリケーションを構築できます。
