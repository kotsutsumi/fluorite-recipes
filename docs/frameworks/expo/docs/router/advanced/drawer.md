# Drawerナビゲーション

Expo RouterのDrawerナビゲーターを使用して、サイドメニューナビゲーションを実装します。

## Drawerナビゲーションとは

Drawerナビゲーションは、画面の端からスワイプして開くサイドメニューを提供するモバイルアプリのパターンです。iOS/AndroidとWebの両方のプラットフォームでサポートされています。

## インストール

### SDK 54以降

```bash
npx expo install @react-navigation/drawer react-native-reanimated react-native-worklets
```

### SDK 53以前

```bash
npx expo install @react-navigation/drawer react-native-gesture-handler react-native-reanimated
```

## 基本的な設定

### プロジェクト構造

```
app/
  _layout.tsx         # Drawerレイアウト
  index.tsx           # ホーム画面
  settings.tsx        # 設定画面
  profile.tsx         # プロフィール画面
```

### Drawerレイアウトの作成

```typescript
// app/_layout.tsx
import { Drawer } from 'expo-router/drawer';

export default function Layout() {
  return <Drawer />;
}
```

この基本設定により、`app`ディレクトリ内のすべてのファイルがDrawer項目として表示されます。

## Drawerのカスタマイズ

### Drawer項目のカスタマイズ

```typescript
// app/_layout.tsx
import { Drawer } from 'expo-router/drawer';

export default function Layout() {
  return (
    <Drawer>
      <Drawer.Screen
        name="index"
        options={{
          drawerLabel: 'Home',
          title: 'Home',
        }}
      />
      <Drawer.Screen
        name="settings"
        options={{
          drawerLabel: 'Settings',
          title: 'Settings',
        }}
      />
      <Drawer.Screen
        name="profile"
        options={{
          drawerLabel: 'Profile',
          title: 'My Profile',
        }}
      />
    </Drawer>
  );
}
```

### アイコンの追加

```typescript
// app/_layout.tsx
import { Drawer } from 'expo-router/drawer';
import { Ionicons } from '@expo/vector-icons';

export default function Layout() {
  return (
    <Drawer
      screenOptions={{
        drawerActiveTintColor: '#f4511e',
        drawerInactiveTintColor: '#888',
      }}
    >
      <Drawer.Screen
        name="index"
        options={{
          drawerLabel: 'Home',
          title: 'Home',
          drawerIcon: ({ color, size }) => (
            <Ionicons name="home" size={size} color={color} />
          ),
        }}
      />
      <Drawer.Screen
        name="settings"
        options={{
          drawerLabel: 'Settings',
          title: 'Settings',
          drawerIcon: ({ color, size }) => (
            <Ionicons name="settings" size={size} color={color} />
          ),
        }}
      />
      <Drawer.Screen
        name="profile"
        options={{
          drawerLabel: 'Profile',
          title: 'Profile',
          drawerIcon: ({ color, size }) => (
            <Ionicons name="person" size={size} color={color} />
          ),
        }}
      />
    </Drawer>
  );
}
```

## 動的ルートの処理

### 動的ルートの設定

Drawerの画面名は、ルートからのURLと一致する必要があります。

```
app/
  _layout.tsx
  index.tsx
  user/
    [id].tsx          # 動的ルート
```

```typescript
// app/_layout.tsx
import { Drawer } from 'expo-router/drawer';

export default function Layout() {
  return (
    <Drawer>
      <Drawer.Screen
        name="index"
        options={{
          drawerLabel: 'Home',
          title: 'Home',
        }}
      />
      <Drawer.Screen
        name="user/[id]"
        options={{
          drawerLabel: 'User',
          title: 'User Profile',
        }}
      />
    </Drawer>
  );
}
```

**重要**: 画面名は、ルートからの完全なURLパスと一致する必要があります。

## Drawerのスタイルカスタマイズ

### Drawerの背景色

```typescript
<Drawer
  screenOptions={{
    drawerStyle: {
      backgroundColor: '#f5f5f5',
      width: 240,
    },
  }}
/>
```

### アクティブ/非アクティブの色

```typescript
<Drawer
  screenOptions={{
    drawerActiveTintColor: '#f4511e',
    drawerInactiveTintColor: '#888',
    drawerActiveBackgroundColor: '#ffe0d0',
  }}
/>
```

### ラベルのスタイル

```typescript
<Drawer
  screenOptions={{
    drawerLabelStyle: {
      fontSize: 16,
      fontWeight: '600',
    },
  }}
/>
```

### アイテムのスタイル

```typescript
<Drawer
  screenOptions={{
    drawerItemStyle: {
      borderRadius: 5,
      marginHorizontal: 10,
    },
  }}
/>
```

## カスタムDrawerコンテンツ

### 完全カスタムDrawer

```typescript
import { Drawer } from 'expo-router/drawer';
import { DrawerContentScrollView, DrawerItemList } from '@react-navigation/drawer';
import { View, Text, Image } from 'react-native';

function CustomDrawerContent(props) {
  return (
    <DrawerContentScrollView {...props}>
      <View style={{ padding: 20, backgroundColor: '#f4511e' }}>
        <Image
          source={require('./assets/avatar.png')}
          style={{ width: 60, height: 60, borderRadius: 30 }}
        />
        <Text style={{ color: '#fff', fontSize: 18, marginTop: 10 }}>
          John Doe
        </Text>
        <Text style={{ color: '#fff', fontSize: 14 }}>
          john.doe@example.com
        </Text>
      </View>
      <DrawerItemList {...props} />
      <View style={{ padding: 20 }}>
        <Text style={{ color: '#888' }}>Version 1.0.0</Text>
      </View>
    </DrawerContentScrollView>
  );
}

export default function Layout() {
  return (
    <Drawer
      drawerContent={(props) => <CustomDrawerContent {...props} />}
    >
      <Drawer.Screen name="index" options={{ drawerLabel: 'Home' }} />
      <Drawer.Screen name="settings" options={{ drawerLabel: 'Settings' }} />
    </Drawer>
  );
}
```

## Drawerの開閉

### プログラムで開く

```typescript
import { useRouter } from 'expo-router';
import { Button } from 'react-native';

export default function HomeScreen() {
  const router = useRouter();

  return (
    <Button
      title="Open Drawer"
      onPress={() => router.push('/')}
    />
  );
}
```

### ナビゲーションを使用して開く

```typescript
import { useNavigation } from 'expo-router';
import { DrawerActions } from '@react-navigation/native';
import { Button } from 'react-native';

export default function HomeScreen() {
  const navigation = useNavigation();

  return (
    <Button
      title="Open Drawer"
      onPress={() => navigation.dispatch(DrawerActions.openDrawer())}
    />
  );
}
```

## Drawerの位置

### 左側（デフォルト）

```typescript
<Drawer
  screenOptions={{
    drawerPosition: 'left',
  }}
/>
```

### 右側

```typescript
<Drawer
  screenOptions={{
    drawerPosition: 'right',
  }}
/>
```

## Drawer項目の非表示

### 特定の項目を非表示

```typescript
<Drawer.Screen
  name="hidden"
  options={{
    drawerItemStyle: { display: 'none' },
  }}
/>
```

### 条件付きで非表示

```typescript
import { Drawer } from 'expo-router/drawer';
import { useAuth } from '@/hooks/useAuth';

export default function Layout() {
  const { isAdmin } = useAuth();

  return (
    <Drawer>
      <Drawer.Screen
        name="admin"
        options={{
          drawerItemStyle: {
            display: isAdmin ? 'flex' : 'none',
          },
          drawerLabel: 'Admin',
        }}
      />
    </Drawer>
  );
}
```

## Webプラットフォーム

Webプラットフォームでは、CSSアニメーションがデフォルトで使用されます。

### Webでのアニメーション設定

```typescript
<Drawer
  screenOptions={{
    drawerType: 'slide', // 'front', 'back', 'permanent'
  }}
/>
```

**オプション**：
- `slide`: スライドアニメーション
- `front`: 前面に表示
- `back`: 背面に表示
- `permanent`: 常に表示（サイドバー）

## モバイルプラットフォーム

モバイルでは、追加の設定が必要です。

### iOS/Androidでのアニメーション

Reanimatedとworkletsが必要です：

```bash
npx expo install react-native-reanimated react-native-worklets
```

### ジェスチャーの有効化

```typescript
<Drawer
  screenOptions={{
    swipeEnabled: true,
    swipeEdgeWidth: 50,
  }}
/>
```

## ヘッダーのカスタマイズ

### ヘッダーの表示/非表示

```typescript
<Drawer
  screenOptions={{
    headerShown: true,
  }}
>
  <Drawer.Screen
    name="index"
    options={{
      headerShown: false, // この画面ではヘッダーを非表示
    }}
  />
</Drawer>
```

### ヘッダーのスタイル

```typescript
<Drawer.Screen
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

### ヘッダーボタンの追加

```typescript
<Drawer.Screen
  name="index"
  options={{
    title: 'Home',
    headerRight: () => (
      <Button title="Info" onPress={() => alert('Info')} />
    ),
  }}
/>
```

## ベストプラクティス

### 1. 明確なラベル

Drawer項目には、明確で説明的なラベルを使用してください。

### 2. アイコンの使用

すべてのDrawer項目にアイコンを追加して、視認性を向上させてください。

### 3. グループ化

関連する項目は、カスタムDrawerコンテンツでグループ化してください。

### 4. アクセシビリティ

アクセシビリティラベルを追加してください：

```typescript
<Drawer.Screen
  name="index"
  options={{
    drawerLabel: 'Home',
    drawerAccessibilityLabel: 'Navigate to Home',
  }}
/>
```

## まとめ

Expo RouterのDrawerナビゲーションは、以下の機能を提供します：

1. **サイドメニューナビゲーション**: スワイプで開くメニュー
2. **カスタマイズ可能**: スタイル、アイコン、ラベル
3. **動的ルートのサポート**: パラメータ化されたルート
4. **クロスプラットフォーム**: iOS、Android、Web
5. **カスタムDrawerコンテンツ**: 完全にカスタマイズ可能
6. **React Navigation互換**: すべてのオプションをサポート

これらの機能を活用して、直感的で使いやすいDrawerナビゲーションを実装できます。
