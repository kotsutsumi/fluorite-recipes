# 共有ルート

Expo Routerで、複数のナビゲーショングループ間でルートを共有する方法を学びます。

## 共有ルートとは

共有ルートは、異なるレイアウトを持つ複数のナビゲーショングループで、同じURLをマッチさせることを可能にします。

### 使用例

アプリの異なるタブ間で、ユーザープロフィールを表示する場合などに便利です。

## 実装方法

共有ルートを実装する2つの方法があります：

1. **グループ方法**: 重複する子ルートを持つルートグループを使用
2. **配列方法**: 配列構文`(,)`を使用してルートを複製

## 1. グループ方法

### プロジェクト構造

```
app/
├── _layout.tsx
├── (home)/
│   ├── _layout.tsx
│   └── [user].tsx
├── (search)/
│   ├── _layout.tsx
│   └── [user].tsx
└── (profile)/
    ├── _layout.tsx
    └── [user].tsx
```

### ルートレイアウト

```typescript
// app/_layout.tsx
import { Tabs } from 'expo-router';

export default function RootLayout() {
  return (
    <Tabs>
      <Tabs.Screen name="(home)" options={{ title: 'Home' }} />
      <Tabs.Screen name="(search)" options={{ title: 'Search' }} />
      <Tabs.Screen name="(profile)" options={{ title: 'Profile' }} />
    </Tabs>
  );
}
```

### グループレイアウト

```typescript
// app/(home)/_layout.tsx
import { Stack } from 'expo-router';

export default function HomeLayout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ title: 'Home' }} />
      <Stack.Screen name="[user]" options={{ title: 'User' }} />
    </Stack>
  );
}

// app/(search)/_layout.tsx
import { Stack } from 'expo-router';

export default function SearchLayout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ title: 'Search' }} />
      <Stack.Screen name="[user]" options={{ title: 'User' }} />
    </Stack>
  );
}
```

### ユーザー画面

```typescript
// app/(home)/[user].tsx
import { useLocalSearchParams } from 'expo-router';
import { View, Text } from 'react-native';

export default function UserScreen() {
  const { user } = useLocalSearchParams();
  return (
    <View>
      <Text>User: {user} (from Home)</Text>
    </View>
  );
}

// app/(search)/[user].tsx
import { useLocalSearchParams } from 'expo-router';
import { View, Text } from 'react-native';

export default function UserScreen() {
  const { user } = useLocalSearchParams();
  return (
    <View>
      <Text>User: {user} (from Search)</Text>
    </View>
  );
}
```

### ナビゲーション

```typescript
import { router } from 'expo-router';

// グループ名を使用してナビゲート
router.push('/(home)/baconbrix');
router.push('/(search)/baconbrix');
router.push('/(profile)/baconbrix');

// グループ名なしでナビゲート（最初にマッチするグループ）
router.push('/baconbrix');  // アルファベット順で最初のグループにマッチ
```

### 重要な注意事項

再読み込み時は、最初にアルファベット順でマッチするグループがレンダリングされます。

**例**：
- URL: `/baconbrix`
- マッチするグループ: `(home)`（アルファベット順で最初）

## 2. 配列方法

### プロジェクト構造

```
app/
├── _layout.tsx
├── (home,search,profile)/
│   └── [user].tsx
├── (home)/
│   └── index.tsx
├── (search)/
│   └── index.tsx
└── (profile)/
    └── index.tsx
```

### ルートの作成

```typescript
// app/(home,search,profile)/[user].tsx
import { useLocalSearchParams, useSegments } from 'expo-router';
import { View, Text } from 'react-native';

export default function UserScreen() {
  const { user } = useLocalSearchParams();
  const segments = useSegments();

  // どのグループからアクセスされたかを判断
  const group = segments[0];

  return (
    <View>
      <Text>User: {user}</Text>
      <Text>From: {group}</Text>
    </View>
  );
}
```

### レイアウトでの区別

```typescript
// app/_layout.tsx
import { Tabs } from 'expo-router';

export default function RootLayout() {
  return (
    <Tabs>
      <Tabs.Screen name="(home)" options={{ title: 'Home' }} />
      <Tabs.Screen name="(search)" options={{ title: 'Search' }} />
      <Tabs.Screen name="(profile)" options={{ title: 'Profile' }} />
    </Tabs>
  );
}

// app/(home)/_layout.tsx
import { Stack } from 'expo-router';

export default function HomeLayout() {
  return (
    <Stack>
      <Stack.Screen name="index" />
      <Stack.Screen
        name="[user]"
        options={{
          title: 'User Profile',
          headerStyle: { backgroundColor: '#f4511e' },
        }}
      />
    </Stack>
  );
}
```

### segmentプロパティの使用

`segment`プロパティを使用して、ルートを区別します。

```typescript
// app/(home,search)/_layout.tsx
import { Stack, useSegments } from 'expo-router';

export default function Layout() {
  const segments = useSegments();
  const group = segments[0];

  return (
    <Stack
      screenOptions={{
        headerStyle: {
          backgroundColor: group === '(home)' ? '#f4511e' : '#2196F3',
        },
      }}
    />
  );
}
```

### initialRouteNameの設定

`unstable_settings`で`initialRouteName`を設定する必要があります。

```typescript
// app/(home,search)/_layout.tsx
import { Stack } from 'expo-router';

export const unstable_settings = {
  initialRouteName: 'index',
};

export default function Layout() {
  return <Stack />;
}
```

## 制限事項

### 現在のナビゲーターのグループのみ使用可能

現在のナビゲーターのグループのみを使用できます。

**OK**：
```
app/
├── _layout.tsx         # Tabs
├── (home)/
│   └── [user].tsx
└── (search)/
    └── [user].tsx
```

**NG**：
```
app/
├── _layout.tsx         # Stack
├── (tabs)/
│   ├── _layout.tsx     # Tabs
│   ├── (home)/
│   └── (search)/
└── [user].tsx          # (home)と(search)は異なるナビゲーター
```

### ネストされたグループの制限

ネストされたグループを使用する場合、最後のグループのセグメントのみがルートマッチングに使用されます。

**例**：
```
app/
├── _layout.tsx
├── (tabs)/
│   ├── (home)/
│   │   └── [user].tsx
│   └── (search)/
│       └── [user].tsx
```

この場合、`(home)`と`(search)`のセグメントのみが使用されます。

### 複数のinitialRouteNamesの処理

複数の`initialRouteNames`が存在する場合、最初のグループのものがデフォルトで使用されます。

## 使用例

### タブ間でユーザープロフィールを共有

```
app/
├── _layout.tsx
├── (home)/
│   ├── _layout.tsx
│   ├── index.tsx
│   └── [user].tsx      # ユーザープロフィール
├── (search)/
│   ├── _layout.tsx
│   ├── index.tsx
│   └── [user].tsx      # 同じユーザープロフィール
└── (notifications)/
    ├── _layout.tsx
    ├── index.tsx
    └── [user].tsx      # 同じユーザープロフィール
```

### ナビゲーション

```typescript
// app/(home)/index.tsx
import { Link } from 'expo-router';

export default function HomeScreen() {
  return (
    <>
      <Link href="/(home)/baconbrix">View User (from Home)</Link>
      <Link href="/(search)/baconbrix">View User (from Search)</Link>
    </>
  );
}
```

### 動的レイアウト

```typescript
// app/(home,search)/[user].tsx
import { useSegments } from 'expo-router';
import { View, Text } from 'react-native';

export default function UserScreen() {
  const segments = useSegments();
  const isFromHome = segments[0] === '(home)';

  return (
    <View style={{
      backgroundColor: isFromHome ? '#f4511e' : '#2196F3',
    }}>
      <Text>User Profile</Text>
      <Text>From: {isFromHome ? 'Home' : 'Search'}</Text>
    </View>
  );
}
```

## ベストプラクティス

### 1. 明確なグループ名

グループ名は、明確で説明的なものを使用してください。

**推奨**：
```
(home)
(search)
(profile)
```

**非推奨**：
```
(a)
(b)
(c)
```

### 2. 一貫したルート構造

すべてのグループで一貫したルート構造を維持してください。

### 3. segmentプロパティの活用

`useSegments`を使用して、どのグループからアクセスされたかを判断してください。

### 4. initialRouteNameの設定

配列方法を使用する場合は、`initialRouteName`を設定してください。

## まとめ

Expo Routerの共有ルートは、以下の方法で実装できます：

1. **グループ方法**: 重複する子ルートを持つルートグループ
2. **配列方法**: 配列構文`(,)`で複数のグループにルートを複製

**主な機能**：
- 同じURLを異なるレイアウトでマッチ
- タブ間でルートを共有
- `useSegments`でグループを区別
- 柔軟なナビゲーション

**制限事項**：
- 現在のナビゲーターのグループのみ使用可能
- ネストされたグループは最後のセグメントのみ使用
- 複数の`initialRouteNames`は最初のものがデフォルト

これは、ネイティブアプリ開発で主に使用される高度な技術です。
