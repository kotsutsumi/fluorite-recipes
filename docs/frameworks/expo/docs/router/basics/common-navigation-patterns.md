# 一般的なナビゲーションパターン

Expo Routerで使用される一般的なナビゲーションパターンを学びます。

## 1. タブ内のStack（ネストされたナビゲーター）

タブベースのアプリ内に複雑なナビゲーション構造を作成します。

### プロジェクト構造

```
app/
  (tabs)/
    _layout.tsx       # タブ構造を定義
    feed/
      _layout.tsx     # フィードタブ内のスタック
      index.tsx       # フィードリスト
      [postId].tsx    # 個別の投稿
    profile/
      _layout.tsx     # プロフィールタブ内のスタック
      index.tsx       # プロフィール
      settings.tsx    # 設定
```

### レイアウトコード

```typescript
// app/(tabs)/_layout.tsx
import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function TabLayout() {
  return (
    <Tabs>
      <Tabs.Screen
        name="feed"
        options={{
          title: 'Feed',
          headerShown: false,
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="list" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          headerShown: false,
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="person" size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}

// app/(tabs)/feed/_layout.tsx
import { Stack } from 'expo-router';

export default function FeedLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{ title: 'Feed' }}
      />
      <Stack.Screen
        name="[postId]"
        options={{ title: 'Post Details' }}
      />
    </Stack>
  );
}

// app/(tabs)/profile/_layout.tsx
import { Stack } from 'expo-router';

export default function ProfileLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{ title: 'Profile' }}
      />
      <Stack.Screen
        name="settings"
        options={{ title: 'Settings' }}
      />
    </Stack>
  );
}
```

### ナビゲーション

```typescript
// app/(tabs)/feed/index.tsx
import { Link } from 'expo-router';
import { View, Text } from 'react-native';

export default function FeedScreen() {
  return (
    <View>
      <Link href="/feed/123">
        <Text>Post 123</Text>
      </Link>
      <Link href="/feed/456">
        <Text>Post 456</Text>
      </Link>
    </View>
  );
}

// app/(tabs)/feed/[postId].tsx
import { useLocalSearchParams } from 'expo-router';
import { View, Text } from 'react-native';

export default function PostScreen() {
  const { postId } = useLocalSearchParams();
  return (
    <View>
      <Text>Post {postId}</Text>
    </View>
  );
}
```

### URLルーティング

このパターンにより、直感的なURLルーティングが可能になります：

- `/feed` - フィードリスト
- `/feed/123` - 投稿123の詳細
- `/profile` - プロフィール
- `/profile/settings` - 設定

## 2. タブ間でルートを共有

複数のタブから同じ画面にアクセスできるようにします。

### プロジェクト構造

```
app/
  (tabs)/
    _layout.tsx
    feed/
      index.tsx
    search/
      index.tsx
  user/
    [id].tsx          # 両方のタブから共有
```

### レイアウトコード

```typescript
// app/_layout.tsx
import { Stack } from 'expo-router';

export default function RootLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="(tabs)"
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="user/[id]"
        options={{ title: 'User Profile' }}
      />
    </Stack>
  );
}

// app/(tabs)/_layout.tsx
import { Tabs } from 'expo-router';

export default function TabLayout() {
  return (
    <Tabs>
      <Tabs.Screen name="feed" options={{ title: 'Feed' }} />
      <Tabs.Screen name="search" options={{ title: 'Search' }} />
    </Tabs>
  );
}
```

### ナビゲーション

```typescript
// app/(tabs)/feed/index.tsx
import { Link } from 'expo-router';
import { View, Text } from 'react-native';

export default function FeedScreen() {
  return (
    <View>
      <Link href="/user/123">
        <Text>@evanbacon</Text>
      </Link>
    </View>
  );
}

// app/(tabs)/search/index.tsx
import { Link } from 'expo-router';
import { View, Text } from 'react-native';

export default function SearchScreen() {
  return (
    <View>
      <Link href="/user/456">
        <Text>@expo</Text>
      </Link>
    </View>
  );
}

// app/user/[id].tsx
import { useLocalSearchParams } from 'expo-router';
import { View, Text } from 'react-native';

export default function UserScreen() {
  const { id } = useLocalSearchParams();
  return (
    <View>
      <Text>User Profile {id}</Text>
    </View>
  );
}
```

### ディープリンクの動作

このパターンにより、予測可能なディープリンク動作が可能になります：

- `myapp://feed` - フィードタブに移動してフィードを表示
- `myapp://user/123` - ユーザープロフィール123を表示（最後にアクティブだったタブの上）
- `myapp://search` - 検索タブに移動して検索を表示

## 3. 認証用の保護されたルート

ログイン状態に基づいて、特定の画面へのアクセスを制限します。

### プロジェクト構造

```
app/
  _layout.tsx
  (auth)/
    login.tsx
    register.tsx
  (tabs)/
    _layout.tsx
    index.tsx
    profile.tsx
```

### 認証チェック

```typescript
// app/_layout.tsx
import { Stack, Redirect } from 'expo-router';
import { useAuth } from '@/hooks/useAuth';

export default function RootLayout() {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <Stack>
      {isAuthenticated ? (
        <>
          <Stack.Screen
            name="(tabs)"
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="modal"
            options={{ presentation: 'modal' }}
          />
        </>
      ) : (
        <Stack.Screen
          name="(auth)"
          options={{ headerShown: false }}
        />
      )}
    </Stack>
  );
}
```

### 個別画面での保護

```typescript
// app/(tabs)/profile.tsx
import { Redirect } from 'expo-router';
import { useAuth } from '@/hooks/useAuth';
import { View, Text } from 'react-native';

export default function ProfileScreen() {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Redirect href="/login" />;
  }

  return (
    <View>
      <Text>Profile Screen</Text>
    </View>
  );
}
```

### 条件付きタブ表示

```typescript
// app/(tabs)/_layout.tsx
import { Tabs, Redirect } from 'expo-router';
import { useAuth } from '@/hooks/useAuth';

export default function TabLayout() {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Redirect href="/login" />;
  }

  return (
    <Tabs>
      <Tabs.Screen name="index" options={{ title: 'Home' }} />
      <Tabs.Screen name="profile" options={{ title: 'Profile' }} />
    </Tabs>
  );
}
```

## 4. モーダル表示

モーダルとして画面を表示します。

### プロジェクト構造

```
app/
  _layout.tsx
  (tabs)/
    _layout.tsx
    index.tsx
  modal.tsx
```

### レイアウトコード

```typescript
// app/_layout.tsx
import { Stack } from 'expo-router';

export default function RootLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="(tabs)"
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="modal"
        options={{
          presentation: 'modal',
          title: 'Modal'
        }}
      />
    </Stack>
  );
}
```

### モーダルを開く

```typescript
// app/(tabs)/index.tsx
import { Link } from 'expo-router';
import { View, Text } from 'react-native';

export default function HomeScreen() {
  return (
    <View>
      <Link href="/modal">
        <Text>Open Modal</Text>
      </Link>
    </View>
  );
}

// app/modal.tsx
import { useRouter } from 'expo-router';
import { View, Text, Button } from 'react-native';

export default function ModalScreen() {
  const router = useRouter();

  return (
    <View>
      <Text>Modal Screen</Text>
      <Button
        title="Close"
        onPress={() => router.back()}
      />
    </View>
  );
}
```

## 5. 読み取り専用ブラウジングモード

ログインなしでコンテンツを閲覧できるようにします。

### プロジェクト構造

```
app/
  _layout.tsx
  (browse)/
    _layout.tsx
    index.tsx
    [postId].tsx
  (auth)/
    login.tsx
```

### レイアウトコード

```typescript
// app/_layout.tsx
import { Stack } from 'expo-router';

export default function RootLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="(browse)"
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="(auth)"
        options={{ headerShown: false }}
      />
    </Stack>
  );
}

// app/(browse)/_layout.tsx
import { Stack } from 'expo-router';
import { useAuth } from '@/hooks/useAuth';
import { Button } from 'react-native';
import { useRouter } from 'expo-router';

export default function BrowseLayout() {
  const { isAuthenticated } = useAuth();
  const router = useRouter();

  return (
    <Stack
      screenOptions={{
        headerRight: () => (
          !isAuthenticated && (
            <Button
              title="Login"
              onPress={() => router.push('/login')}
            />
          )
        ),
      }}
    >
      <Stack.Screen name="index" options={{ title: 'Browse' }} />
      <Stack.Screen name="[postId]" options={{ title: 'Post' }} />
    </Stack>
  );
}
```

### コンテンツへのアクセス制御

```typescript
// app/(browse)/[postId].tsx
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useAuth } from '@/hooks/useAuth';
import { View, Text, Button } from 'react-native';

export default function PostScreen() {
  const { postId } = useLocalSearchParams();
  const { isAuthenticated } = useAuth();
  const router = useRouter();

  return (
    <View>
      <Text>Post {postId}</Text>
      {!isAuthenticated && (
        <View>
          <Text>Login to interact with this post</Text>
          <Button
            title="Login"
            onPress={() => router.push('/login')}
          />
        </View>
      )}
    </View>
  );
}
```

## 6. オーバーレイ認証プロンプト

完全なルートリダイレクトなしで、認証プロンプトをオーバーレイします。

### プロジェクト構造

```
app/
  _layout.tsx
  (tabs)/
    _layout.tsx
    index.tsx
  auth-prompt.tsx
```

### レイアウトコード

```typescript
// app/_layout.tsx
import { Stack } from 'expo-router';

export default function RootLayout() {
  return (
    <>
      <Stack>
        <Stack.Screen
          name="(tabs)"
          options={{ headerShown: false }}
        />
      </Stack>
      <AuthPromptOverlay />
    </>
  );
}

function AuthPromptOverlay() {
  const { needsAuth } = useAuth();
  const router = useRouter();

  if (!needsAuth) return null;

  return (
    <Modal visible={needsAuth} animationType="slide">
      <View>
        <Text>Please login to continue</Text>
        <Button
          title="Login"
          onPress={() => router.push('/login')}
        />
      </View>
    </Modal>
  );
}
```

## ベストプラクティス

### 1. シンプルなナビゲーション構造

ナビゲーション構造をシンプルに保ち、必要な場合のみネストしてください。

### 2. ディープリンクの考慮

すべてのナビゲーションパターンで、ディープリンクの動作を考慮してください。

### 3. ユーザーエクスペリエンス優先

ナビゲーションは、技術的な制約ではなく、ユーザーエクスペリエンスに基づいて設計してください。

### 4. 柔軟な認証

認証チェックは、柔軟に実装し、ユーザーがコンテンツにアクセスできるようにしてください。

## まとめ

Expo Routerの一般的なナビゲーションパターンは、以下を含みます：

1. **タブ内のStack**: 複雑なナビゲーション構造
2. **ルート共有**: 複数のタブから同じ画面にアクセス
3. **保護されたルート**: 認証ベースのアクセス制御
4. **モーダル**: モーダル表示
5. **読み取り専用ブラウジング**: ログインなしでの閲覧
6. **オーバーレイプロンプト**: 認証プロンプトのオーバーレイ

これらのパターンを活用して、柔軟でユーザーフレンドリーなナビゲーションエクスペリエンスを提供できます。
