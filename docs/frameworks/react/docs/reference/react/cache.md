# cache

`cache` は、データフェッチや計算結果をキャッシュできるようにする React Server Components の機能です。

## リファレンス

```javascript
const cachedFn = cache(fn);
```

### パラメータ

- **`fn`**: キャッシュしたい関数。任意の引数を取り、任意の値を返すことができる

### 返り値

キャッシュされたバージョンの関数を返します。同じ引数で呼び出された場合、キャッシュされた結果を返します。

## 使用法

### 高コストな計算のキャッシュ

```javascript
import { cache } from 'react';

const getUserMetrics = cache(calculateUserMetrics);

function Profile({ user }) {
  const metrics = getUserMetrics(user);
  return <div>Score: {metrics.score}</div>;
}

function Settings({ user }) {
  const metrics = getUserMetrics(user);
  return <div>Level: {metrics.level}</div>;
}
```

同じ `user` オブジェクトに対して、`calculateUserMetrics` は一度だけ実行されます。

### データスナップショットの共有

```javascript
const getTemperature = cache(async (city) => {
  return await fetchTemperature(city);
});

async function AnimatedWeatherCard({ city }) {
  const temperature = await getTemperature(city);
  // ...
}

async function MinimalWeatherCard({ city }) {
  const temperature = await getTemperature(city);
  // ...
}
```

`AnimatedWeatherCard` と `MinimalWeatherCard` の両方が同じ `city` に対してレンダーされる場合、データフェッチは一度だけ行われます。

### データフェッチのメモ化

```javascript
const getUser = cache(async (id) => {
  const response = await fetch(`/api/users/${id}`);
  return response.json();
});

async function UserProfile({ userId }) {
  const user = await getUser(userId);
  return <div>{user.name}</div>;
}

async function UserAvatar({ userId }) {
  const user = await getUser(userId);
  return <img src={user.avatar} />;
}
```

## 重要な注意事項

### サーバーリクエストごとにリセット

キャッシュは各サーバーリクエストごとにリセットされます。複数のリクエスト間でデータは共有されません。

### Server Components でのみ使用可能

`cache` は React Server Components でのみ使用できます。

### オブジェクト参照の一貫性

プリミティブ型以外の引数を渡す場合、同じオブジェクト参照を渡す必要があります。

```javascript
// ✅ 正しい: 同じオブジェクト参照
const user = { id: 1, name: 'Alice' };
const metrics1 = getUserMetrics(user);
const metrics2 = getUserMetrics(user); // キャッシュがヒット

// ❌ 間違い: 異なるオブジェクト参照
const metrics1 = getUserMetrics({ id: 1, name: 'Alice' });
const metrics2 = getUserMetrics({ id: 1, name: 'Alice' }); // キャッシュミス
```

## トラブルシューティング

### キャッシュがヒットしない

**原因**: オブジェクトや配列を引数として渡す場合、毎回新しいオブジェクトを作成している可能性があります。

**解決策**:
- プリミティブ型の引数を使用する
- 同じオブジェクト参照を渡す
- オブジェクトの ID など、プリミティブ型の識別子を使用する

```javascript
// ✅ 推奨: プリミティブ型の引数
const getUser = cache(async (userId) => {
  return await db.users.find(userId);
});

// ❌ 避ける: オブジェクトの引数
const getUser = cache(async (userObj) => {
  return await db.users.find(userObj.id);
});
```

## ベストプラクティス

- データフェッチ関数をキャッシュして重複リクエストを防ぐ
- 高コストな計算をキャッシュしてパフォーマンスを向上
- プリミティブ型の引数を優先的に使用
- Server Components でのみ使用
- 同じサーバーリクエスト内でのデータ共有に活用

## 使用例

```javascript
import { cache } from 'react';
import { db } from './database';

export const getPost = cache(async (id) => {
  return await db.posts.find(id);
});

// 複数のコンポーネントで使用
async function PostPage({ postId }) {
  const post = await getPost(postId);
  return (
    <>
      <PostHeader post={post} />
      <PostContent post={post} />
      <PostComments post={post} />
    </>
  );
}
```

この例では、`getPost` は一度だけ呼び出され、結果は3つのコンポーネント間で共有されます。
