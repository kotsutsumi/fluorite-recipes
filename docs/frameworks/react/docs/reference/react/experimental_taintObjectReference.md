# experimental_taintObjectReference (実験的)

`taintObjectReference` は、特定のオブジェクトインスタンスをクライアントコンポーネントに渡すことを防ぐ実験的な React API です。

## 注意

この機能は実験的であり、安定版の React ではまだ利用できません。

## リファレンス

```javascript
experimental_taintObjectReference(message, object)
```

### パラメータ

- **`message`**: オブジェクトがクライアントコンポーネントに渡された場合に表示されるエラーメッセージ
- **`object`**: タグ付けするオブジェクト。関数、クラスインスタンス、型付き配列も可

### 返り値

`experimental_taintObjectReference` は `undefined` を返します。

## 使用法

### 機密データの漏洩を防ぐ

```javascript
import {experimental_taintObjectReference} from 'react';

export async function getUser(id) {
  const user = await db`SELECT * FROM users WHERE id = ${id}`;

  experimental_taintObjectReference(
    'クライアントに全てのユーザーオブジェクトを渡さないでください。' +
    '必要な特定のプロパティのみを選択してください。',
    user
  );

  return user;
}
```

### サーバーコンポーネント内でのみ使用

この API はサーバーコンポーネント内でのみ使用できます。

```javascript
// Server Component
export async function UserProfile({ userId }) {
  const user = await getUser(userId);

  experimental_taintObjectReference(
    'Do not pass user objects to the client',
    user
  );

  // ✅ 正しい: 特定のプロパティのみ渡す
  return <ClientUserCard name={user.name} email={user.email} />;

  // ❌ エラー: オブジェクト全体を渡すとエラー
  // return <ClientUserCard user={user} />;
}
```

### オブジェクトの種類

以下の種類のオブジェクトをタグ付けできます:

- 通常のオブジェクト
- 関数
- クラスインスタンス
- 型付き配列

```javascript
// オブジェクト
experimental_taintObjectReference('Do not share', userData);

// 関数
experimental_taintObjectReference('Do not share', secretFunction);

// クラスインスタンス
experimental_taintObjectReference('Do not share', userInstance);

// 型付き配列
experimental_taintObjectReference('Do not share', uint8Array);
```

## 重要な注意事項

### セキュリティの補助層として使用

これは機密データが意図せずクライアント側に漏洩することを防ぐための **補助的な保護層** です。セキュリティの唯一の層として頼るべきではありません。

### 複製は新しいオブジェクトを作成

タグ付けされたオブジェクトの複製は、新しい未タグ付けオブジェクトを作成する可能性があります。

```javascript
const user = await getUser(id);
experimental_taintObjectReference('Do not share', user);

// ❌ スプレッド構文は新しいオブジェクトを作成(タグなし)
const userCopy = { ...user };

// ❌ Object.assign も新しいオブジェクトを作成(タグなし)
const userCopy2 = Object.assign({}, user);
```

### 実験版のみ

本番環境では使用しないでください。

## 使用例

### データベースクエリの結果を保護

```javascript
import {experimental_taintObjectReference} from 'react';

export async function getPost(postId) {
  const post = await db.posts.findUnique({
    where: { id: postId },
    include: { author: true }
  });

  experimental_taintObjectReference(
    'Do not pass entire post objects to client components',
    post
  );

  return post;
}

// Server Component
export async function PostPage({ postId }) {
  const post = await getPost(postId);

  // ✅ 正しい: 必要なデータのみ渡す
  return (
    <ClientPostCard
      title={post.title}
      content={post.content}
      authorName={post.author.name}
    />
  );
}
```

### API レスポンスの保護

```javascript
export async function fetchUserData(userId) {
  const response = await fetch(`/api/users/${userId}`);
  const data = await response.json();

  experimental_taintObjectReference(
    'Complete user data should not be sent to client',
    data
  );

  return data;
}
```

## ベストプラクティス

- サーバーコンポーネントで機密データを扱う際に使用
- 明確なエラーメッセージを提供
- 必要な特定のプロパティのみをクライアントに渡す
- 他のセキュリティ対策と組み合わせて使用
- 実験的機能であることを認識して使用
