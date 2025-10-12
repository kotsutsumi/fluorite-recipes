# Expo Routerのレイアウト

レイアウトファイル（`_layout.tsx`）を使用して、アプリのナビゲーション構造を定義します。

## レイアウトとは

レイアウトファイルは、ディレクトリ内のページがどのように配置されるかを制御します。

### 主な機能

- **ナビゲーション構造の定義**: Stack、Tabs、Drawerなどのナビゲーションタイプを指定
- **共通UI要素**: ヘッダー、フッター、サイドバーなどを追加
- **初期化コード**: フォントの読み込み、認証チェックなどを実行

## ルートレイアウト

ルートレイアウトは、アプリ全体の構造を定義します。

### 基本例

```typescript
// app/_layout.tsx
import { Stack } from 'expo-router';

export default function RootLayout() {
  return <Stack />;
}
```

### フォントとスプラッシュスクリーンの管理

```typescript
// app/_layout.tsx
import { useEffect } from 'react';
import { Stack } from 'expo-router';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';

// スプラッシュスクリーンを自動的に非表示にしない
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded, error] = useFonts({
    'SpaceMono': require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  useEffect(() => {
    if (loaded || error) {
      SplashScreen.hideAsync();
    }
  }, [loaded, error]);

  if (!loaded && !error) {
    return null;
  }

  return <Stack />;
}
```

## ナビゲーションレイアウトの種類

Expo Routerは、複数のナビゲーションタイプをサポートしています。

## 1. Stack Navigator

Stackナビゲーターは、ページを線形シーケンスでプッシュ/ポップします。

### 基本的なStack

```typescript
// app/_layout.tsx
import { Stack } from 'expo-router';

export default function RootLayout() {
  return <Stack />;
}
```

### カスタマイズされたStack

```typescript
// app/_layout.tsx
import { Stack } from 'expo-router';

export default function RootLayout() {
  return (
    <Stack
      screenOptions={{
        headerStyle: {
          backgroundColor: '#f4511e',
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      }}
    >
      <Stack.Screen name="index" options={{ title: 'Home' }} />
      <Stack.Screen name="about" options={{ title: 'About' }} />
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

### Stackの特徴

- **自動戻るナビゲーション**: 自動的に戻るボタンを生成
- **プッシュ/ポップ**: 新しいページをスタックにプッシュ、戻るでポップ
- **カスタマイズ可能**: ヘッダー、トランジションなどをカスタマイズ

## 2. Tab Navigator

タブナビゲーターは、複数の画面をボトムタブとして表示します。

### 基本的なTabs

```typescript
// app/(tabs)/_layout.tsx
import { Tabs } from 'expo-router';

export default function TabLayout() {
  return <Tabs />;
}
```

### カスタマイズされたTabs

```typescript
// app/(tabs)/_layout.tsx
import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: '#f4511e',
        tabBarInactiveTintColor: '#888',
        headerShown: false,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="explore"
        options={{
          title: 'Explore',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="search" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="person" size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
```

### Tabsの特徴

- **ボトムタブ**: 画面下部にタブバーを表示
- **カスタムアイコン**: 各タブにカスタムアイコンを設定
- **デフォルトタブ**: `index`ルートがデフォルトで選択

### プロジェクト構造

```
app/
  (tabs)/
    _layout.tsx       # タブレイアウト
    index.tsx         # ホームタブ
    explore.tsx       # 探索タブ
    profile.tsx       # プロフィールタブ
```

## 3. Drawer Navigator

Drawerナビゲーターは、サイドメニューを表示します。

### 基本的なDrawer

```typescript
// app/_layout.tsx
import { Drawer } from 'expo-router/drawer';

export default function DrawerLayout() {
  return <Drawer />;
}
```

### カスタマイズされたDrawer

```typescript
// app/_layout.tsx
import { Drawer } from 'expo-router/drawer';
import { Ionicons } from '@expo/vector-icons';

export default function DrawerLayout() {
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
          title: 'Home',
          drawerIcon: ({ color, size }) => (
            <Ionicons name="home" size={size} color={color} />
          ),
        }}
      />
      <Drawer.Screen
        name="settings"
        options={{
          title: 'Settings',
          drawerIcon: ({ color, size }) => (
            <Ionicons name="settings" size={size} color={color} />
          ),
        }}
      />
    </Drawer>
  );
}
```

## 4. Slot Layout

Slotレイアウトは、特定のナビゲーションなしでルートのラッパーを提供します。

### 基本的なSlot

```typescript
// app/_layout.tsx
import { Slot } from 'expo-router';

export default function RootLayout() {
  return (
    <>
      <Header />
      <Slot />
      <Footer />
    </>
  );
}
```

### Slotの特徴

- **ラッパーとして機能**: 一貫したヘッダー/フッターを追加
- **ページ置換**: 新しいページをプッシュせず、現在のページを置換
- **柔軟性**: カスタムUIを簡単に追加

### 使用例

```typescript
// app/_layout.tsx
import { Slot } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function RootLayout() {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Header />
      <Slot />
    </SafeAreaView>
  );
}

function Header() {
  return (
    <View style={{ padding: 20, backgroundColor: '#f4511e' }}>
      <Text style={{ color: '#fff', fontSize: 20 }}>My App</Text>
    </View>
  );
}
```

## レイアウトのネスト

レイアウトは、ネストすることができます。

### 基本的なネスト

```
app/
  _layout.tsx         # ルートレイアウト（Stack）
  (tabs)/
    _layout.tsx       # タブレイアウト（Tabs）
    home/
      _layout.tsx     # ホームレイアウト（Stack）
      index.tsx
      details.tsx
```

### コード例

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

// app/(tabs)/_layout.tsx
import { Tabs } from 'expo-router';

export default function TabLayout() {
  return (
    <Tabs>
      <Tabs.Screen name="home" />
      <Tabs.Screen name="profile" />
    </Tabs>
  );
}

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

## 高度なレイアウトオプション

### 条件付きレイアウト

```typescript
// app/_layout.tsx
import { Stack } from 'expo-router';
import { useAuth } from '@/hooks/useAuth';

export default function RootLayout() {
  const { isAuthenticated } = useAuth();

  return (
    <Stack>
      {isAuthenticated ? (
        <>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="settings" />
        </>
      ) : (
        <Stack.Screen name="login" />
      )}
    </Stack>
  );
}
```

### グローバル状態の提供

```typescript
// app/_layout.tsx
import { Stack } from 'expo-router';
import { AuthProvider } from '@/context/AuthContext';
import { ThemeProvider } from '@/context/ThemeContext';

export default function RootLayout() {
  return (
    <AuthProvider>
      <ThemeProvider>
        <Stack />
      </ThemeProvider>
    </AuthProvider>
  );
}
```

### エラーバウンダリ

```typescript
// app/_layout.tsx
import { Stack } from 'expo-router';
import { ErrorBoundary } from 'react-error-boundary';

export default function RootLayout() {
  return (
    <ErrorBoundary
      FallbackComponent={ErrorFallback}
      onReset={() => {
        // エラーリセット処理
      }}
    >
      <Stack />
    </ErrorBoundary>
  );
}

function ErrorFallback({ error, resetErrorBoundary }) {
  return (
    <View>
      <Text>Something went wrong:</Text>
      <Text>{error.message}</Text>
      <Button title="Try again" onPress={resetErrorBoundary} />
    </View>
  );
}
```

## ベストプラクティス

### 1. レイアウトのシンプル化

レイアウトはシンプルに保ち、必要な場合のみネストしてください。

**推奨**：
```
app/
  _layout.tsx         # Stack
  (tabs)/
    _layout.tsx       # Tabs
```

**非推奨**：
```
app/
  _layout.tsx
  (group1)/
    _layout.tsx
    (group2)/
      _layout.tsx     # 過度なネスト
```

### 2. 共通コードの抽出

レイアウト間で共通のコードは、別ファイルに抽出してください。

```typescript
// app/_layout.tsx
import { Stack } from 'expo-router';
import { useCommonSetup } from '@/hooks/useCommonSetup';

export default function RootLayout() {
  useCommonSetup(); // 共通の初期化処理
  return <Stack />;
}
```

### 3. 型安全性の確保

TypeScriptを使用して、型安全性を確保してください。

```typescript
// app/_layout.tsx
import { Stack, StackScreenProps } from 'expo-router';

type RootStackParamList = {
  index: undefined;
  about: undefined;
  'user/[id]': { id: string };
};

export default function RootLayout() {
  return (
    <Stack<RootStackParamList>>
      <Stack.Screen name="index" />
      <Stack.Screen name="about" />
      <Stack.Screen name="user/[id]" />
    </Stack>
  );
}
```

## まとめ

Expo Routerのレイアウトシステムは、以下の機能を提供します：

1. **複数のナビゲーションタイプ**: Stack、Tabs、Drawer、Slot
2. **柔軟なネスト**: 複雑なナビゲーション構造をサポート
3. **カスタマイズ可能**: スタイル、アイコン、動作をカスタマイズ
4. **初期化コード**: フォント読み込み、認証チェックなどを実行
5. **React Navigation互換**: React Navigationのすべてのオプションをサポート

これらの機能を活用して、ユーザーフレンドリーで保守性の高いナビゲーション構造を構築できます。
