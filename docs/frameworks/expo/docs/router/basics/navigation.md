# Expo Routerのナビゲーション

Expo Routerでページ間を移動する方法を学びます。

## ナビゲーションの方法

Expo Routerは、複数のナビゲーション方法を提供します。

## 1. 命令的ナビゲーション（useRouter）

`useRouter`フックを使用して、プログラムでページ間を移動します。

### 基本的な使用方法

```typescript
import { useRouter } from 'expo-router';
import { Button } from 'react-native';

export default function HomeScreen() {
  const router = useRouter();

  return (
    <Button
      title="Go to About"
      onPress={() => router.push('/about')}
    />
  );
}
```

### routerオブジェクトのメソッド

#### push

新しいルートをスタックにプッシュします。

```typescript
router.push('/about');
router.push('/users/123');
router.push({ pathname: '/users/[id]', params: { id: '123' } });
```

#### replace

現在のルートを置き換えます。

```typescript
router.replace('/login');
```

#### back

前のページに戻ります。

```typescript
router.back();
```

#### canGoBack

戻ることができるか確認します。

```typescript
if (router.canGoBack()) {
  router.back();
} else {
  router.replace('/');
}
```

#### navigate

指定したルートにナビゲートします（存在する場合は置換、存在しない場合はプッシュ）。

```typescript
router.navigate('/about');
```

### 完全な例

```typescript
import { useRouter } from 'expo-router';
import { View, Button, StyleSheet } from 'react-native';

export default function NavigationExample() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Button
        title="Push About"
        onPress={() => router.push('/about')}
      />
      <Button
        title="Replace with Login"
        onPress={() => router.replace('/login')}
      />
      <Button
        title="Go Back"
        onPress={() => router.back()}
        disabled={!router.canGoBack()}
      />
      <Button
        title="Navigate to Settings"
        onPress={() => router.navigate('/settings')}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    gap: 10,
    padding: 20,
  },
});
```

## 2. Linkコンポーネント

`Link`コンポーネントを使用して、クリック可能なナビゲーションを作成します。

### 基本的な使用方法

```typescript
import { Link } from 'expo-router';
import { View, Text } from 'react-native';

export default function HomeScreen() {
  return (
    <View>
      <Link href="/about">
        <Text>About</Text>
      </Link>
    </View>
  );
}
```

### 絶対パスと相対パス

#### 絶対パス

```typescript
<Link href="/about">About</Link>
<Link href="/users/123">User 123</Link>
```

#### 相対パス

```typescript
<Link href="./details">Details</Link>
<Link href="../home">Home</Link>
```

### スタイル付きLink

```typescript
import { Link } from 'expo-router';
import { Text, StyleSheet } from 'react-native';

export default function StyledLink() {
  return (
    <Link href="/about" style={styles.link}>
      <Text style={styles.text}>About</Text>
    </Link>
  );
}

const styles = StyleSheet.create({
  link: {
    padding: 10,
    backgroundColor: '#f4511e',
    borderRadius: 5,
  },
  text: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
```

### Linkのプロパティ

#### asChild

子コンポーネントをカスタマイズします。

```typescript
import { Link } from 'expo-router';
import { Pressable, Text } from 'react-native';

export default function CustomLink() {
  return (
    <Link href="/about" asChild>
      <Pressable>
        <Text>About</Text>
      </Pressable>
    </Link>
  );
}
```

#### replace

現在のルートを置き換えます。

```typescript
<Link href="/login" replace>
  <Text>Login</Text>
</Link>
```

## 3. 動的ルートへのナビゲーション

動的ルートにパラメータを渡します。

### URLパラメータ

```typescript
import { Link } from 'expo-router';

export default function UserList() {
  return (
    <>
      <Link href="/users/123">User 123</Link>
      <Link href="/users/456">User 456</Link>
    </>
  );
}
```

### paramsオブジェクト

```typescript
import { Link } from 'expo-router';

export default function UserList() {
  return (
    <>
      <Link
        href={{
          pathname: '/users/[id]',
          params: { id: '123' }
        }}
      >
        User 123
      </Link>
      <Link
        href={{
          pathname: '/users/[id]',
          params: { id: '456' }
        }}
      >
        User 456
      </Link>
    </>
  );
}
```

### routerでの動的ナビゲーション

```typescript
import { useRouter } from 'expo-router';
import { Button } from 'react-native';

export default function UserList() {
  const router = useRouter();

  const navigateToUser = (userId: string) => {
    router.push({
      pathname: '/users/[id]',
      params: { id: userId }
    });
  };

  return (
    <>
      <Button title="User 123" onPress={() => navigateToUser('123')} />
      <Button title="User 456" onPress={() => navigateToUser('456')} />
    </>
  );
}
```

## 4. クエリパラメータ

クエリパラメータを使用して、追加のデータを渡します。

### URLでのクエリパラメータ

```typescript
<Link href="/users?sort=name&order=asc">
  Users (sorted)
</Link>
```

### paramsでのクエリパラメータ

```typescript
<Link
  href={{
    pathname: '/users',
    params: { sort: 'name', order: 'asc' }
  }}
>
  Users (sorted)
</Link>
```

### クエリパラメータの取得

```typescript
// app/users.tsx
import { useLocalSearchParams } from 'expo-router';
import { Text } from 'react-native';

export default function UsersScreen() {
  const { sort, order } = useLocalSearchParams();

  return (
    <Text>
      Sort: {sort}, Order: {order}
    </Text>
  );
}
```

### 複数の値

```typescript
<Link href="/search?tags=react&tags=native&tags=expo">
  Search
</Link>
```

```typescript
// app/search.tsx
import { useLocalSearchParams } from 'expo-router';

export default function SearchScreen() {
  const { tags } = useLocalSearchParams();
  // tags は配列または文字列
  const tagArray = Array.isArray(tags) ? tags : [tags];

  return (
    <View>
      {tagArray.map(tag => (
        <Text key={tag}>{tag}</Text>
      ))}
    </View>
  );
}
```

## 5. Redirectコンポーネント

条件に基づいて、別のルートにリダイレクトします。

### 基本的な使用方法

```typescript
import { Redirect } from 'expo-router';
import { useAuth } from '@/hooks/useAuth';

export default function ProtectedScreen() {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Redirect href="/login" />;
  }

  return <Text>Protected Content</Text>;
}
```

### 条件付きリダイレクト

```typescript
import { Redirect } from 'expo-router';
import { useUser } from '@/hooks/useUser';

export default function ProfileScreen() {
  const { user, loading } = useUser();

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!user) {
    return <Redirect href="/login" />;
  }

  if (!user.hasCompletedProfile) {
    return <Redirect href="/onboarding" />;
  }

  return <Profile user={user} />;
}
```

## 6. プリフェッチ

パフォーマンスを向上させるために、ルートを事前に読み込みます。

### Linkでのプリフェッチ

```typescript
import { Link } from 'expo-router';

export default function HomeScreen() {
  return (
    <Link href="/about" prefetch>
      <Text>About (Prefetched)</Text>
    </Link>
  );
}
```

### routerでのプリフェッチ

```typescript
import { useRouter } from 'expo-router';
import { useEffect } from 'react';

export default function HomeScreen() {
  const router = useRouter();

  useEffect(() => {
    // コンポーネントマウント時にプリフェッチ
    router.prefetch('/about');
  }, []);

  return (
    <Button
      title="Go to About"
      onPress={() => router.push('/about')}
    />
  );
}
```

## 7. 初期ルートの設定

アプリの起動時に表示するルートを設定します。

### app.jsonでの設定

```json
{
  "expo": {
    "experiments": {
      "typedRoutes": true
    },
    "plugins": [
      [
        "expo-router",
        {
          "origin": "https://myapp.com",
          "initialRouteName": "home"
        }
      ]
    ]
  }
}
```

### コードでの設定

```typescript
// app/_layout.tsx
import { Stack } from 'expo-router';

export default function RootLayout() {
  return (
    <Stack
      initialRouteName="home"
    >
      <Stack.Screen name="home" />
      <Stack.Screen name="about" />
    </Stack>
  );
}
```

## ナビゲーションのベストプラクティス

### 1. 適切な方法の選択

- **Link**: ユーザーがタップできる要素
- **router**: プログラムでのナビゲーション
- **Redirect**: 条件付きリダイレクト

### 2. 型安全性の確保

```typescript
import { useRouter } from 'expo-router';

type Routes =
  | '/'
  | '/about'
  | `/users/${string}`
  | '/settings';

export default function TypeSafeNavigation() {
  const router = useRouter();

  const navigate = (route: Routes) => {
    router.push(route);
  };

  return (
    <>
      <Button title="Home" onPress={() => navigate('/')} />
      <Button title="About" onPress={() => navigate('/about')} />
      <Button title="User" onPress={() => navigate('/users/123')} />
    </>
  );
}
```

### 3. パフォーマンスの最適化

プリフェッチを使用して、ナビゲーションを高速化します。

```typescript
import { Link } from 'expo-router';

export default function OptimizedNavigation() {
  return (
    <>
      <Link href="/frequently-accessed" prefetch>
        Frequently Accessed Page
      </Link>
    </>
  );
}
```

### 4. エラーハンドリング

```typescript
import { useRouter } from 'expo-router';

export default function SafeNavigation() {
  const router = useRouter();

  const navigateWithFallback = (route: string) => {
    try {
      router.push(route);
    } catch (error) {
      console.error('Navigation error:', error);
      router.push('/error');
    }
  };

  return (
    <Button
      title="Navigate"
      onPress={() => navigateWithFallback('/about')}
    />
  );
}
```

## まとめ

Expo Routerのナビゲーションは、以下の方法を提供します：

1. **useRouter**: 命令的ナビゲーション
2. **Link**: 宣言的ナビゲーション
3. **動的ルート**: パラメータを渡す
4. **クエリパラメータ**: 追加データを渡す
5. **Redirect**: 条件付きリダイレクト
6. **プリフェッチ**: パフォーマンス最適化
7. **初期ルート**: アプリ起動時のルート設定

これらの方法を適切に使用して、スムーズで直感的なナビゲーションエクスペリエンスを提供できます。
