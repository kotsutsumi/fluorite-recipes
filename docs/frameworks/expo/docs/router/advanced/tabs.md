# JavaScriptタブナビゲーション

Expo RouterのJavaScriptタブを使用して、ボトムタブバーナビゲーションを実装します。

## タブナビゲーターとは

JavaScriptタブは、画面下部にタブバーを表示するナビゲーション方法です。Expo Routerでは、3種類のタブナビゲーターをサポートしています：

1. **JavaScriptタブ**: React NavigationベースのJavaScriptタブ
2. **ネイティブタブ**: ネイティブプラットフォームのタブバー（実験的）
3. **カスタムタブ**: 完全にカスタマイズされたタブ実装

このドキュメントでは、JavaScriptタブに焦点を当てます。

## 基本的な設定

### プロジェクト構造

```
app/
  _layout.tsx         # ルートレイアウト
  (tabs)/
    _layout.tsx       # タブレイアウト
    index.tsx         # ホームタブ
    explore.tsx       # 探索タブ
    profile.tsx       # プロフィールタブ
```

### ルートレイアウト

```typescript
// app/_layout.tsx
import { Stack } from 'expo-router';

export default function RootLayout() {
  return (
    <Stack>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
    </Stack>
  );
}
```

### タブレイアウト

```typescript
// app/(tabs)/_layout.tsx
import { Tabs } from 'expo-router';
import FontAwesome from '@expo/vector-icons/FontAwesome';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: 'blue',
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color }) => (
            <FontAwesome name="home" size={28} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="explore"
        options={{
          title: 'Explore',
          tabBarIcon: ({ color }) => (
            <FontAwesome name="search" size={28} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color }) => (
            <FontAwesome name="user" size={28} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
```

## タブのカスタマイズ

### タブバーの色

```typescript
<Tabs
  screenOptions={{
    tabBarActiveTintColor: '#f4511e',
    tabBarInactiveTintColor: '#888',
    tabBarStyle: {
      backgroundColor: '#fff',
    },
  }}
/>
```

### タブアイコンのカスタマイズ

```typescript
import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function TabLayout() {
  return (
    <Tabs>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color, size, focused }) => (
            <Ionicons
              name={focused ? 'home' : 'home-outline'}
              size={size}
              color={color}
            />
          ),
        }}
      />
    </Tabs>
  );
}
```

### タブラベルのカスタマイズ

```typescript
<Tabs.Screen
  name="index"
  options={{
    title: 'Home',
    tabBarLabel: 'ホーム',
    tabBarLabelStyle: {
      fontSize: 12,
      fontWeight: 'bold',
    },
  }}
/>
```

### バッジの追加

```typescript
<Tabs.Screen
  name="notifications"
  options={{
    title: 'Notifications',
    tabBarBadge: 3,
    tabBarIcon: ({ color }) => (
      <Ionicons name="notifications" size={28} color={color} />
    ),
  }}
/>
```

## タブの非表示

### 特定のタブを非表示

```typescript
<Tabs.Screen
  name="hidden-tab"
  options={{
    href: null, // タブバーに表示しない
  }}
/>
```

### 条件付きでタブを非表示

```typescript
import { Tabs } from 'expo-router';
import { useAuth } from '@/hooks/useAuth';

export default function TabLayout() {
  const { isAdmin } = useAuth();

  return (
    <Tabs>
      <Tabs.Screen
        name="admin"
        options={{
          href: isAdmin ? undefined : null,
          title: 'Admin',
        }}
      />
    </Tabs>
  );
}
```

## 動的ルートのサポート

### 動的ルートの設定

```
app/
  (tabs)/
    _layout.tsx
    index.tsx
    [id].tsx          # 動的ルート
```

```typescript
// app/(tabs)/_layout.tsx
<Tabs>
  <Tabs.Screen
    name="index"
    options={{
      title: 'Home',
    }}
  />
  <Tabs.Screen
    name="[id]"
    options={{
      href: null, // タブバーに表示しない
    }}
  />
</Tabs>
```

### ユニークな動的ルート

動的ルートは、タブ内でユニークである必要があります。

**推奨**：

```
app/
  (tabs)/
    posts/
      [id].tsx
    users/
      [id].tsx
```

**非推奨**：

```
app/
  (tabs)/
    [id].tsx
    profile/
      [id].tsx    # 競合！
```

## ヘッダーの設定

### ヘッダーの表示/非表示

```typescript
<Tabs
  screenOptions={{
    headerShown: true,
  }}
>
  <Tabs.Screen
    name="index"
    options={{
      headerShown: false, // このタブではヘッダーを非表示
    }}
  />
</Tabs>
```

### ヘッダーのカスタマイズ

```typescript
<Tabs.Screen
  name="index"
  options={{
    title: 'Home',
    headerStyle: {
      backgroundColor: '#f4511e',
    },
    headerTintColor: '#fff',
    headerTitleStyle: {
      fontWeight: 'bold',
    },
  }}
/>
```

## タブバーのカスタマイズ

### タブバーの位置

```typescript
<Tabs
  screenOptions={{
    tabBarPosition: 'bottom', // 'top' も可能
  }}
/>
```

### タブバーのスタイル

```typescript
<Tabs
  screenOptions={{
    tabBarStyle: {
      backgroundColor: '#fff',
      borderTopWidth: 1,
      borderTopColor: '#e0e0e0',
      paddingBottom: 5,
      height: 60,
    },
  }}
/>
```

### タブバーの非表示

```typescript
<Tabs
  screenOptions={{
    tabBarStyle: {
      display: 'none',
    },
  }}
/>
```

または：

```typescript
import { usePathname } from 'expo-router';

export default function TabLayout() {
  const pathname = usePathname();

  return (
    <Tabs
      screenOptions={{
        tabBarStyle: {
          display: pathname === '/hidden' ? 'none' : 'flex',
        },
      }}
    />
  );
}
```

## カスタムタブバー

### 完全カスタムタブバー

```typescript
import { Tabs } from 'expo-router';
import { View, TouchableOpacity, Text } from 'react-native';

function CustomTabBar({ state, descriptors, navigation }) {
  return (
    <View style={{ flexDirection: 'row', backgroundColor: '#fff' }}>
      {state.routes.map((route, index) => {
        const { options } = descriptors[route.key];
        const isFocused = state.index === index;

        const onPress = () => {
          const event = navigation.emit({
            type: 'tabPress',
            target: route.key,
          });

          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name);
          }
        };

        return (
          <TouchableOpacity
            key={route.key}
            onPress={onPress}
            style={{
              flex: 1,
              padding: 10,
              alignItems: 'center',
              backgroundColor: isFocused ? '#f4511e' : '#fff',
            }}
          >
            <Text style={{ color: isFocused ? '#fff' : '#000' }}>
              {options.title || route.name}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

export default function TabLayout() {
  return (
    <Tabs
      tabBar={(props) => <CustomTabBar {...props} />}
    >
      <Tabs.Screen name="index" options={{ title: 'Home' }} />
      <Tabs.Screen name="explore" options={{ title: 'Explore' }} />
    </Tabs>
  );
}
```

## タブ内のStack

タブ内にStackナビゲーションをネストできます。

### プロジェクト構造

```
app/
  (tabs)/
    _layout.tsx
    home/
      _layout.tsx     # ホームタブ内のStack
      index.tsx
      details.tsx
    profile/
      _layout.tsx     # プロフィールタブ内のStack
      index.tsx
      settings.tsx
```

### タブレイアウト

```typescript
// app/(tabs)/_layout.tsx
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
```

### タブ内のStackレイアウト

```typescript
// app/(tabs)/home/_layout.tsx
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

## React Navigationのオプション

Expo RouterのTabsは、React Navigationのすべてのオプションをサポートしています。

### スクロール可能なタブ

```typescript
<Tabs
  screenOptions={{
    tabBarScrollEnabled: true,
  }}
/>
```

### タブバーのアクセシビリティ

```typescript
<Tabs.Screen
  name="index"
  options={{
    title: 'Home',
    tabBarAccessibilityLabel: 'Navigate to Home',
    tabBarTestID: 'home-tab',
  }}
/>
```

## ベストプラクティス

### 1. 5タブ以下

タブは5つ以下に保つことをお勧めします。

**推奨**：
```
Home | Explore | Notifications | Profile
```

**非推奨**：
```
Home | Explore | Create | Notifications | Messages | Profile | Settings
```

### 2. 明確なアイコン

タブアイコンは、明確で認識しやすいものを使用してください。

### 3. 一貫したスタイル

アプリ全体で一貫したタブバースタイルを使用してください。

### 4. ユニークな動的ルート

動的ルートは、タブ内でユニークである必要があります。

## まとめ

Expo RouterのJavaScriptタブは、以下の機能を提供します：

1. **ファイルベースのルーティング**: シンプルな設定
2. **カスタマイズ可能なタブバー**: 色、アイコン、ラベル
3. **動的ルートのサポート**: パラメータ化されたルート
4. **タブの非表示**: 条件付きでタブを非表示
5. **ネストされたナビゲーション**: タブ内のStack
6. **React Navigation互換**: すべてのオプションをサポート

これらの機能を活用して、直感的で美しいタブナビゲーションを実装できます。
