# Expo Routerの記法

Expo Routerで使用される様々なルーティング記法を理解します。

## ルーティング記法の種類

Expo Routerは、5つの主要なルーティング記法をサポートしています。

## 1. シンプルな名前（静的ルート）

ファイル名やディレクトリ名が、そのままURLに一致します。

### 基本例

```
app/
  home.tsx          # /home
  about.tsx         # /about
  contact.tsx       # /contact
```

### ネストされた例

```
app/
  blog/
    index.tsx       # /blog
    latest.tsx      # /blog/latest
    archive.tsx     # /blog/archive
```

### コード例

```typescript
// app/home.tsx
export default function HomeScreen() {
  return <Text>Home Screen</Text>;
}
```

**URL**: `/home`

## 2. 角括弧（動的ルート）

角括弧を使用して、パラメータ化されたルートを表します。

### 基本例

```
app/
  users/
    [userName].tsx    # /users/evanbacon, /users/expo
  posts/
    [id].tsx          # /posts/1, /posts/hello
```

### パラメータへのアクセス

`useLocalSearchParams`フックを使用して、パラメータにアクセスします。

```typescript
// app/users/[userName].tsx
import { useLocalSearchParams } from 'expo-router';
import { Text } from 'react-native';

export default function UserScreen() {
  const { userName } = useLocalSearchParams();
  return <Text>User: {userName}</Text>;
}
```

**例**：
- URL: `/users/evanbacon` → `userName = "evanbacon"`
- URL: `/users/expo` → `userName = "expo"`

### 複数のパラメータ

```
app/
  posts/
    [category]/
      [slug].tsx      # /posts/tech/hello-world
```

```typescript
// app/posts/[category]/[slug].tsx
import { useLocalSearchParams } from 'expo-router';

export default function PostScreen() {
  const { category, slug } = useLocalSearchParams();
  return (
    <View>
      <Text>Category: {category}</Text>
      <Text>Slug: {slug}</Text>
    </View>
  );
}
```

**例**：
- URL: `/posts/tech/hello-world` → `category = "tech"`, `slug = "hello-world"`

### キャッチオール

`[...slug]`を使用して、複数のセグメントをキャッチします。

```
app/
  blog/
    [...slug].tsx     # /blog/2024/01/hello, /blog/about
```

```typescript
// app/blog/[...slug].tsx
import { useLocalSearchParams } from 'expo-router';

export default function BlogScreen() {
  const { slug } = useLocalSearchParams();
  // slug は配列または文字列
  return <Text>Blog: {Array.isArray(slug) ? slug.join('/') : slug}</Text>;
}
```

## 3. 括弧（ルートグループ）

括弧を使用して、URL構造に影響を与えずにルートをグループ化します。

### 基本例

```
app/
  (tabs)/
    index.tsx         # /
    settings.tsx      # /settings
    profile.tsx       # /profile
  _layout.tsx
```

**重要**: `(tabs)`はURLに含まれません。

### レイアウトでの使用

```typescript
// app/(tabs)/_layout.tsx
import { Tabs } from 'expo-router';

export default function TabLayout() {
  return (
    <Tabs>
      <Tabs.Screen name="index" options={{ title: 'Home' }} />
      <Tabs.Screen name="settings" options={{ title: 'Settings' }} />
      <Tabs.Screen name="profile" options={{ title: 'Profile' }} />
    </Tabs>
  );
}
```

### 複数のグループ

```
app/
  (auth)/
    login.tsx         # /login
    register.tsx      # /register
  (tabs)/
    index.tsx         # /
    profile.tsx       # /profile
  _layout.tsx
```

### グループの利点

- **論理的な整理**: 関連するルートをグループ化
- **共通レイアウト**: グループ内のルートに共通レイアウトを適用
- **URL構造の制御**: URLに影響を与えずに整理

## 4. index.tsx ファイル

`index.tsx`は、ディレクトリのデフォルトルートを表します。

### 基本例

```
app/
  profile/
    index.tsx         # /profile
    settings.tsx      # /profile/settings
```

```typescript
// app/profile/index.tsx
export default function ProfileScreen() {
  return <Text>Profile Screen</Text>;
}
```

**URL**: `/profile`

### ルートindex

```
app/
  index.tsx           # /
  about.tsx           # /about
```

```typescript
// app/index.tsx
export default function HomeScreen() {
  return <Text>Home Screen</Text>;
}
```

**URL**: `/`

## 5. _layout.tsx ファイル

`_layout.tsx`は、ルートグループ間の関係を定義します。

### 基本例

```
app/
  _layout.tsx         # ルートレイアウト
  (tabs)/
    _layout.tsx       # タブレイアウト
    index.tsx
    profile.tsx
```

### ルートレイアウト

```typescript
// app/_layout.tsx
import { Stack } from 'expo-router';

export default function RootLayout() {
  return (
    <Stack>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="modal" options={{ presentation: 'modal' }} />
    </Stack>
  );
}
```

### ネストされたレイアウト

```typescript
// app/(tabs)/_layout.tsx
import { Tabs } from 'expo-router';

export default function TabLayout() {
  return (
    <Tabs>
      <Tabs.Screen name="index" />
      <Tabs.Screen name="profile" />
    </Tabs>
  );
}
```

### レイアウトの特徴

- ページルートの前にレンダリング
- アプリ全体の設定を初期化可能
- ナビゲーション構造を定義

## 6. プラス記号ルート

特殊な目的を持つルートです。

### +not-found.tsx

マッチしないルートを処理します。

```
app/
  +not-found.tsx      # 404ページ
  index.tsx
  about.tsx
```

```typescript
// app/+not-found.tsx
import { Link } from 'expo-router';
import { View, Text } from 'react-native';

export default function NotFoundScreen() {
  return (
    <View>
      <Text>This screen doesn't exist.</Text>
      <Link href="/">Go to home screen</Link>
    </View>
  );
}
```

### +html.tsx

WebのHTMLボイラープレートをカスタマイズします。

```typescript
// app/+html.tsx
export default function CustomHTML() {
  return (
    <html>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>My App</title>
      </head>
      <body>
        <div id="root" />
      </body>
    </html>
  );
}
```

### +middleware.ts

ルートレンダリングの前にコードを実行します。

```typescript
// app/+middleware.ts
export default function middleware(req: Request) {
  // ルートレンダリング前の処理
  console.log('Middleware:', req.url);
}
```

## プロジェクト構造の例

複数の記法を組み合わせた完全な例：

```
app/
  (tabs)/
    _layout.tsx       # タブレイアウト
    index.tsx         # / (ホーム)
    feed.tsx          # /feed
    profile.tsx       # /profile
  _layout.tsx         # ルートレイアウト
  users/
    [userId].tsx      # /users/123 (動的ルート)
  +not-found.tsx      # 404ページ
  about.tsx           # /about
```

### レイアウトファイル

```typescript
// app/_layout.tsx
import { Stack } from 'expo-router';

export default function RootLayout() {
  return (
    <Stack>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="users/[userId]" options={{ title: 'User' }} />
    </Stack>
  );
}

// app/(tabs)/_layout.tsx
import { Tabs } from 'expo-router';

export default function TabLayout() {
  return (
    <Tabs>
      <Tabs.Screen name="index" options={{ title: 'Home' }} />
      <Tabs.Screen name="feed" options={{ title: 'Feed' }} />
      <Tabs.Screen name="profile" options={{ title: 'Profile' }} />
    </Tabs>
  );
}
```

## 記法の組み合わせ

### 動的ルート + ルートグループ

```
app/
  (shop)/
    products/
      [id].tsx        # /products/123
    cart.tsx          # /cart
```

### インデックス + 動的ルート

```
app/
  blog/
    index.tsx         # /blog
    [slug].tsx        # /blog/hello-world
```

### 複数レベルの動的ルート

```
app/
  [org]/
    [repo]/
      issues/
        [id].tsx      # /expo/expo/issues/123
```

```typescript
// app/[org]/[repo]/issues/[id].tsx
import { useLocalSearchParams } from 'expo-router';

export default function IssueScreen() {
  const { org, repo, id } = useLocalSearchParams();
  return (
    <View>
      <Text>Org: {org}</Text>
      <Text>Repo: {repo}</Text>
      <Text>Issue: {id}</Text>
    </View>
  );
}
```

## ベストプラクティス

### 1. 明確な命名

ファイル名は、ルートの目的を明確に示すべきです。

**推奨**：
```
app/
  user-profile.tsx
  product-details.tsx
```

**非推奨**：
```
app/
  page1.tsx
  screen2.tsx
```

### 2. ルートグループの活用

関連するルートは、ルートグループでまとめてください。

```
app/
  (auth)/
    login.tsx
    register.tsx
    forgot-password.tsx
```

### 3. 動的ルートの使用

同じパターンの複数のページには、動的ルートを使用してください。

```
app/
  posts/
    [id].tsx          # 単一の動的ルート
```

代わりに：
```
app/
  posts/
    1.tsx
    2.tsx
    3.tsx            # 推奨されません
```

### 4. レイアウトの共有

共通レイアウトは、`_layout.tsx`で定義してください。

## まとめ

Expo Routerの記法は、柔軟で直感的なルーティングシステムを提供します：

1. **シンプルな名前**: 静的ルート
2. **角括弧**: 動的ルート
3. **括弧**: ルートグループ（URL構造に影響なし）
4. **index.tsx**: デフォルトルート
5. **_layout.tsx**: レイアウト定義
6. **プラス記号**: 特殊なルート

これらの記法を組み合わせることで、複雑なナビゲーション構造を簡潔に定義できます。
