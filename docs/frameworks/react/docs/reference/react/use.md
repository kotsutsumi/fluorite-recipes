# use

`use` は、プロミスやコンテクストなどのリソースから値を読み取るための React API です。

## リファレンス

```javascript
const value = use(resource);
```

### パラメータ

- **`resource`**: 値を読み取りたいデータソース。Promise または Context オブジェクト

### 返り値

Promise が渡された場合は解決された値、Context が渡された場合はコンテクストの値を返します。

## 使用法

### Context の読み取り

`useContext` と似ていますが、より柔軟に使用できます。

```javascript
import { use } from 'react';

function Button() {
  const theme = use(ThemeContext);
  return <button className={theme}>Click me</button>;
}
```

### useContext との違い

`use` は条件文やループ内で呼び出すことができます。

```javascript
function HorizontalRule({ show }) {
  if (show) {
    const theme = use(ThemeContext);
    return <hr className={theme} />;
  }
  return null;
}
```

### サーバからクライアントへのデータストリーミング

サーバコンポーネントからクライアントコンポーネントに Promise を渡すことができます。

```javascript
// Server Component
export default function App() {
  const messagePromise = fetchMessage();
  return (
    <Suspense fallback={<p>waiting for message...</p>}>
      <Message messagePromise={messagePromise} />
    </Suspense>
  );
}

// Client Component
'use client';

export function Message({ messagePromise }) {
  const messageContent = use(messagePromise);
  return <p>Here is the message: {messageContent}</p>;
}
```

### 拒否された Promise の処理

#### エラーバウンダリを使用

```javascript
import { use, Suspense } from 'react';
import { ErrorBoundary } from 'react-error-boundary';

function MessageContainer({ messagePromise }) {
  const message = use(messagePromise);
  return <p>{message}</p>;
}

function App() {
  return (
    <ErrorBoundary fallback={<p>⚠️ Something went wrong</p>}>
      <Suspense fallback={<p>⌛ Downloading message...</p>}>
        <MessageContainer messagePromise={messagePromise} />
      </Suspense>
    </ErrorBoundary>
  );
}
```

#### Promise.catch を使用

```javascript
export default function App() {
  const messagePromise = fetchMessage().catch(() => {
    return "no new message found.";
  });

  return (
    <Suspense fallback={<p>waiting for message...</p>}>
      <Message messagePromise={messagePromise} />
    </Suspense>
  );
}
```

## 重要な特性

### 条件付きで呼び出し可能

他の React フックとは異なり、`use` は条件文やループ内で呼び出すことができます。

```javascript
function MyComponent({ condition }) {
  if (condition) {
    const value = use(MyContext); // ✅ 許可されている
    // ...
  }
}
```

### コンポーネントまたはフック内でのみ呼び出し可能

```javascript
// ✅ 正しい: コンポーネント内
function MyComponent() {
  const value = use(resource);
  return <div>{value}</div>;
}

// ✅ 正しい: カスタムフック内
function useMyResource() {
  return use(resource);
}

// ❌ 間違い: コンポーネント外
const value = use(resource);
```

### try-catch ブロック内では使用不可

```javascript
// ❌ 間違い
try {
  const value = use(resource);
} catch (error) {
  // エラーハンドリング
}

// ✅ 正しい: エラーバウンダリを使用
<ErrorBoundary fallback={<Error />}>
  <Component resource={resource} />
</ErrorBoundary>
```

## Promise との使用

### データフェッチ

```javascript
async function fetchUserData(userId) {
  const response = await fetch(`/api/users/${userId}`);
  return response.json();
}

function UserProfile({ userId }) {
  const userDataPromise = fetchUserData(userId);

  return (
    <Suspense fallback={<LoadingSkeleton />}>
      <UserData userDataPromise={userDataPromise} />
    </Suspense>
  );
}

function UserData({ userDataPromise }) {
  const user = use(userDataPromise);
  return <div>{user.name}</div>;
}
```

### 複数の Promise

```javascript
function Dashboard() {
  const userPromise = fetchUser();
  const postsPromise = fetchPosts();

  return (
    <Suspense fallback={<Loading />}>
      <UserInfo userPromise={userPromise} />
      <PostsList postsPromise={postsPromise} />
    </Suspense>
  );
}

function UserInfo({ userPromise }) {
  const user = use(userPromise);
  return <h1>{user.name}</h1>;
}

function PostsList({ postsPromise }) {
  const posts = use(postsPromise);
  return posts.map(post => <Post key={post.id} post={post} />);
}
```

## Context との使用

### コンポーネントツリーの検索

`use` は、呼び出し元のコンポーネントより上位のツリーを検索して、最も近いコンテクストプロバイダを見つけます。

```javascript
function Form() {
  const theme = use(ThemeContext);
  // theme は最も近い ThemeContext.Provider の値
  return <form className={theme}>...</form>;
}
```

### 条件付きでコンテクストを読み取る

```javascript
function SaveButton({ show }) {
  if (show) {
    const theme = use(ThemeContext);
    return <button className={theme}>Save</button>;
  }
  return null;
}
```

## トラブルシューティング

### "use must be called in a component or hook"

`use` がコンポーネントまたはカスタムフック内で呼び出されていることを確認してください。

### Promise が解決されない

- Promise が正しく解決されることを確認
- `Suspense` バウンダリが適切に配置されているか確認
- エラーバウンダリでエラーをキャッチ

## ベストプラクティス

- サーバコンポーネントからクライアントコンポーネントへデータをストリーミング
- `Suspense` でローディング状態を処理
- エラーバウンダリでエラーを処理
- 条件付きレンダリングが必要な場合は `use` を `useContext` の代わりに使用
