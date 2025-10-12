# ネストされたナビゲーター

Expo Routerで、ナビゲーターを別のナビゲーター内にネストする方法を学びます。

## ネストされたナビゲーターとは

ネストされたナビゲーターは、あるナビゲーターを別のナビゲーターの画面内にレンダリングすることを可能にします。これにより、複雑なナビゲーション階層を作成できます。

### 基本概念

Expo Routerのネストされたナビゲーターは、React Navigationのネストナビゲーターの概念に基づいています。

## プロジェクト構造の例

```
app/
├── _layout.tsx           # ルートレイアウト（Stack）
├── index.tsx             # ホーム画面
└── home/
    ├── _layout.tsx       # ホームレイアウト（Tabs）
    ├── feed.tsx          # フィードタブ
    └── messages.tsx      # メッセージタブ
```

## ネストされたナビゲーターの設定

### ルートレイアウト（Stack）

```typescript
// app/_layout.tsx
import { Stack } from 'expo-router';

export default function RootLayout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ title: 'Home' }} />
      <Stack.Screen name="home" options={{ headerShown: false }} />
    </Stack>
  );
}
```

### ネストされたレイアウト（Tabs）

```typescript
// app/home/_layout.tsx
import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function HomeLayout() {
  return (
    <Tabs>
      <Tabs.Screen
        name="feed"
        options={{
          title: 'Feed',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="list" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="messages"
        options={{
          title: 'Messages',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="chatbubbles" size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
```

### 画面の作成

```typescript
// app/index.tsx
import { Link } from 'expo-router';
import { View, Text, StyleSheet } from 'react-native';

export default function IndexScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome</Text>
      <Link href="/home/feed" style={styles.link}>
        <Text>Go to Feed</Text>
      </Link>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
  },
  link: {
    color: '#f4511e',
  },
});

// app/home/feed.tsx
import { View, Text } from 'react-native';

export default function FeedScreen() {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Feed Screen</Text>
    </View>
  );
}

// app/home/messages.tsx
import { View, Text } from 'react-native';

export default function MessagesScreen() {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Messages Screen</Text>
    </View>
  );
}
```

## ナビゲーション

### Expo Routerのナビゲーション

Expo Routerでは、ナビゲーションが簡素化されています。

```typescript
import { router } from 'expo-router';

// ネストされたルートに直接ナビゲート
router.push('/home/feed');
router.push('/home/messages');
```

### React Navigationとの比較

#### React Navigation（複雑）

```javascript
navigation.navigate('root', {
  screen: 'settings',
  params: {
    screen: 'media',
  },
});
```

#### Expo Router（シンプル）

```javascript
router.push('/root/settings/media');
```

## 複雑なネスト構造

### 3レベルのネスト

```
app/
├── _layout.tsx               # レベル1: Stack
├── index.tsx
└── (tabs)/
    ├── _layout.tsx           # レベル2: Tabs
    ├── home/
    │   ├── _layout.tsx       # レベル3: Stack
    │   ├── index.tsx
    │   └── details.tsx
    └── profile/
        ├── _layout.tsx       # レベル3: Stack
        ├── index.tsx
        └── settings.tsx
```

### レイアウトコード

```typescript
// app/_layout.tsx（レベル1: Stack）
import { Stack } from 'expo-router';

export default function RootLayout() {
  return (
    <Stack>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
    </Stack>
  );
}

// app/(tabs)/_layout.tsx（レベル2: Tabs）
import { Tabs } from 'expo-router';

export default function TabLayout() {
  return (
    <Tabs>
      <Tabs.Screen
        name="home"
        options={{
          title: 'Home',
          headerShown: false,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          headerShown: false,
        }}
      />
    </Tabs>
  );
}

// app/(tabs)/home/_layout.tsx（レベル3: Stack）
import { Stack } from 'expo-router';

export default function HomeLayout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ title: 'Home' }} />
      <Stack.Screen name="details" options={{ title: 'Details' }} />
    </Stack>
  );
}
```

### ナビゲーション

```typescript
import { router } from 'expo-router';

// 3レベル深いルートに直接ナビゲート
router.push('/home/details');
router.push('/profile/settings');
```

## 動的ルートのネスト

### プロジェクト構造

```
app/
├── _layout.tsx
├── index.tsx
└── posts/
    ├── _layout.tsx
    ├── [id].tsx
    └── [id]/
        ├── _layout.tsx
        ├── comments.tsx
        └── edit.tsx
```

### レイアウトコード

```typescript
// app/posts/_layout.tsx
import { Stack } from 'expo-router';

export default function PostsLayout() {
  return (
    <Stack>
      <Stack.Screen name="[id]" options={{ title: 'Post' }} />
      <Stack.Screen name="[id]/comments" options={{ title: 'Comments' }} />
      <Stack.Screen name="[id]/edit" options={{ title: 'Edit Post' }} />
    </Stack>
  );
}
```

### ナビゲーション

```typescript
import { router } from 'expo-router';

// 動的ルートにナビゲート
router.push('/posts/123');
router.push('/posts/123/comments');
router.push('/posts/123/edit');
```

## スクリーンオプションのカスタマイズ

### ネストされたナビゲーターのヘッダー

```typescript
// app/home/_layout.tsx
import { Tabs } from 'expo-router';

export default function HomeLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: true,
        headerStyle: {
          backgroundColor: '#f4511e',
        },
        headerTintColor: '#fff',
      }}
    >
      <Tabs.Screen
        name="feed"
        options={{
          title: 'Feed',
          headerRight: () => (
            <Button title="Filter" onPress={() => {}} />
          ),
        }}
      />
    </Tabs>
  );
}
```

### 親ナビゲーターのヘッダーを使用

```typescript
// app/_layout.tsx
import { Stack } from 'expo-router';

export default function RootLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="home"
        options={{
          headerShown: true,
          title: 'My App',
        }}
      />
    </Stack>
  );
}

// app/home/_layout.tsx
import { Tabs } from 'expo-router';

export default function HomeLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false, // 親のヘッダーを使用
      }}
    >
      <Tabs.Screen name="feed" />
      <Tabs.Screen name="messages" />
    </Tabs>
  );
}
```

## ネストされたナビゲーターのベストプラクティス

### 1. 過度なネストを避ける

ネストは2〜3レベルまでに保つことをお勧めします。

**推奨**：
```
Stack → Tabs → Stack
```

**非推奨**：
```
Stack → Tabs → Stack → Tabs → Stack（過度なネスト）
```

### 2. ヘッダーの重複を避ける

ネストされたナビゲーターでは、ヘッダーが重複しないように注意してください。

```typescript
// 親ナビゲーター
<Stack.Screen name="home" options={{ headerShown: true }} />

// 子ナビゲーター
<Tabs screenOptions={{ headerShown: false }} />
```

### 3. 明確なファイル構造

ネストされたナビゲーターには、明確なファイル構造を使用してください。

```
app/
├── _layout.tsx
└── feature/
    ├── _layout.tsx
    ├── screen1.tsx
    └── screen2.tsx
```

### 4. Route Groupsの活用

Route Groupsを使用して、ネストされたナビゲーターを整理してください。

```
app/
├── _layout.tsx
└── (tabs)/
    ├── _layout.tsx
    ├── home/
    └── profile/
```

## 将来の変更

ナビゲーションUI要素は、将来的にExpo Routerライブラリから移動する可能性があります。

**現在**: Expo Routerに含まれる

**将来**: 別のライブラリに移動する可能性

## まとめ

Expo Routerのネストされたナビゲーターは、以下の特徴があります：

1. **柔軟な階層**: 複雑なナビゲーション階層をサポート
2. **シンプルなナビゲーション**: パスベースのナビゲーション
3. **動的ルートのサポート**: パラメータ化されたルート
4. **カスタマイズ可能**: スクリーンオプションとレイアウト
5. **React Navigation互換**: React Navigationの概念に基づく

これらの機能を活用して、複雑で柔軟なナビゲーション構造を構築できます。
