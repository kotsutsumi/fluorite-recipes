# React Navigationからの移行

React NavigationからExpo Routerへの移行方法を学びます。

## 概要

Expo RouterはReact Navigationのラッパーであり、追加機能を提供します。

**主な利点**：
- 自動ディープリンク
- 型安全なルート
- 静的レンダリング対応
- シンプルなナビゲーション管理

**移行の概要**: プロジェクト構造の再構築、ナビゲーションフックの更新、ルーティングロジックの変更が必要です。

## 移行前の推奨事項

### 1. スクリーンコンポーネントの分割

各スクリーンを個別のファイルに分割します。

**変更前**：
```typescript
function HomeScreen() {
  return <Text>Home</Text>;
}

function SettingsScreen() {
  return <Text>Settings</Text>;
}

const Stack = createNativeStackNavigator();

function Navigation() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="Settings" component={SettingsScreen} />
    </Stack.Navigator>
  );
}
```

**変更後**：
```typescript
// app/index.tsx
export default function HomeScreen() {
  return <Text>Home</Text>;
}

// app/settings.tsx
export default function SettingsScreen() {
  return <Text>Settings</Text>;
}
```

### 2. TypeScriptへの変換

TypeScriptプロジェクトに変換します。

```bash
npx expo install --template expo-template-blank-typescript
```

### 3. 型付きパスエイリアスの使用

```json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["src/*"]
    }
  }
}
```

### 4. resetRootからの移行

`resetRoot`を使用している場合は、`router.replace()`に変更します。

**変更前**：
```typescript
navigation.dispatch(
  CommonActions.reset({
    index: 0,
    routes: [{ name: 'Home' }],
  })
);
```

**変更後**：
```typescript
router.replace('/');
```

### 5. 初期ルートの名前変更

初期ルートを`index`に名前変更します。

**変更前**：
```typescript
<Stack.Screen name="Home" component={HomeScreen} />
```

**変更後**：
```typescript
// app/index.tsx
export default function HomeScreen() {
  return <Text>Home</Text>;
}
```

## プロジェクト構造の変更

### appディレクトリの作成

ルートディレクトリに`app`ディレクトリを作成します。

```
project/
├── app/
│   ├── _layout.tsx
│   ├── index.tsx
│   ├── settings.tsx
│   └── (tabs)/
│       ├── _layout.tsx
│       ├── home.tsx
│       └── profile.tsx
├── components/
└── package.json
```

### ナビゲーターのディレクトリ構造への変換

**React Navigation**：
```typescript
const Stack = createNativeStackNavigator();

function RootNavigator() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="Settings" component={SettingsScreen} />
    </Stack.Navigator>
  );
}
```

**Expo Router**：
```
app/
├── _layout.tsx
├── index.tsx       # Home screen
└── settings.tsx    # Settings screen
```

```typescript
// app/_layout.tsx
import { Stack } from 'expo-router';

export default function Layout() {
  return <Stack />;
}
```

### タブナビゲーターの変換

**React Navigation**：
```typescript
const Tab = createBottomTabNavigator();

function TabNavigator() {
  return (
    <Tab.Navigator>
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
}
```

**Expo Router**：
```
app/
└── (tabs)/
    ├── _layout.tsx
    ├── home.tsx
    └── profile.tsx
```

```typescript
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
```

## ナビゲーションフックの更新

### navigation.push()からrouter.push()へ

**React Navigation**：
```typescript
import { useNavigation } from '@react-navigation/native';

function MyComponent() {
  const navigation = useNavigation();

  const handlePress = () => {
    navigation.push('Settings');
  };

  return <Button title="Go to Settings" onPress={handlePress} />;
}
```

**Expo Router**：
```typescript
import { useRouter } from 'expo-router';

function MyComponent() {
  const router = useRouter();

  const handlePress = () => {
    router.push('/settings');
  };

  return <Button title="Go to Settings" onPress={handlePress} />;
}
```

### route.paramsからuseLocalSearchParams()へ

**React Navigation**：
```typescript
import { useRoute } from '@react-navigation/native';

function UserScreen() {
  const route = useRoute();
  const { id } = route.params;

  return <Text>User ID: {id}</Text>;
}
```

**Expo Router**：
```typescript
import { useLocalSearchParams } from 'expo-router';

function UserScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();

  return <Text>User ID: {id}</Text>;
}
```

### navigation.navigate()からrouter.navigate()へ

**React Navigation**：
```typescript
navigation.navigate('Settings', { userId: '123' });
```

**Expo Router**：
```typescript
router.push({ pathname: '/settings', params: { userId: '123' } });
```

## Linkコンポーネントの更新

**React Navigation**：
```typescript
import { Link } from '@react-navigation/native';

function MyComponent() {
  return <Link to="Settings">Go to Settings</Link>;
}
```

**Expo Router**：
```typescript
import { Link } from 'expo-router';

function MyComponent() {
  return <Link href="/settings">Go to Settings</Link>;
}
```

## 画面トラッキングの更新

### React Navigation

```typescript
import { useNavigationContainerRef } from '@react-navigation/native';

function App() {
  const navigationRef = useNavigationContainerRef();
  const routeNameRef = useRef();

  return (
    <NavigationContainer
      ref={navigationRef}
      onReady={() => {
        routeNameRef.current = navigationRef.current.getCurrentRoute().name;
      }}
      onStateChange={async () => {
        const previousRouteName = routeNameRef.current;
        const currentRouteName = navigationRef.current.getCurrentRoute().name;

        if (previousRouteName !== currentRouteName) {
          await analytics.logScreenView({
            screen_name: currentRouteName,
            screen_class: currentRouteName,
          });
        }

        routeNameRef.current = currentRouteName;
      }}
    >
      {/* ナビゲーター */}
    </NavigationContainer>
  );
}
```

### Expo Router

```typescript
import { usePathname } from 'expo-router';
import { useEffect } from 'react';

export default function Layout() {
  const pathname = usePathname();

  useEffect(() => {
    analytics.logScreenView({
      screen_name: pathname,
      screen_class: pathname,
    });
  }, [pathname]);

  return <Slot />;
}
```

## API置き換えガイド

### NavigationContainer

**React Navigation**：
```typescript
<NavigationContainer>
  <RootNavigator />
</NavigationContainer>
```

**Expo Router**: 自動的に管理されるため、`NavigationContainer`は不要です。

### ナビゲーションフックの比較

| React Navigation | Expo Router | 説明 |
|-----------------|-------------|------|
| `useNavigation()` | `useRouter()` | ナビゲーション操作 |
| `useRoute()` | `useLocalSearchParams()` | ルートパラメータ取得 |
| `useFocusEffect()` | `useFocusEffect()` | 画面フォーカス時の処理 |
| `useIsFocused()` | `useIsFocused()` | 画面フォーカス状態 |
| - | `usePathname()` | 現在のパス取得 |
| - | `useSegments()` | パスセグメント取得 |

### カスタムナビゲーターの移行

**React Navigation**：
```typescript
import { createNavigatorFactory } from '@react-navigation/native';

const CustomNavigator = createNavigatorFactory(CustomRouter)(CustomView);
```

**Expo Router**：
```typescript
import { withLayoutContext } from 'expo-router';

const CustomNavigator = withLayoutContext(CustomView);
```

## 動的ルートの実装

### React Navigation

```typescript
<Stack.Screen
  name="User"
  component={UserScreen}
  initialParams={{ id: '1' }}
/>
```

### Expo Router

```
app/
└── user/
    └── [id].tsx
```

```typescript
// app/user/[id].tsx
import { useLocalSearchParams } from 'expo-router';

export default function UserScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();

  return <Text>User ID: {id}</Text>;
}
```

## モーダルの実装

### React Navigation

```typescript
<Stack.Screen
  name="Modal"
  component={ModalScreen}
  options={{ presentation: 'modal' }}
/>
```

### Expo Router

```
app/
├── _layout.tsx
├── index.tsx
└── modal.tsx
```

```typescript
// app/_layout.tsx
import { Stack } from 'expo-router';

export default function Layout() {
  return (
    <Stack>
      <Stack.Screen name="index" />
      <Stack.Screen
        name="modal"
        options={{ presentation: 'modal' }}
      />
    </Stack>
  );
}
```

## ディープリンクの設定

### React Navigation

```typescript
const linking = {
  prefixes: ['myapp://', 'https://myapp.com'],
  config: {
    screens: {
      Home: '',
      Profile: 'user/:id',
    },
  },
};

<NavigationContainer linking={linking}>
  {/* ナビゲーター */}
</NavigationContainer>
```

### Expo Router

Expo Routerは自動的にディープリンクを設定します。

```json
{
  "expo": {
    "scheme": "myapp"
  }
}
```

## ベストプラクティス

### 1. 段階的な移行

一度にすべてを移行するのではなく、画面ごとに段階的に移行します。

### 2. TypeScriptの活用

型安全なルートを活用して、エラーを早期に発見します。

```typescript
// 型チェックされる
router.push('/settings');

// エラー
router.push('/setings'); // タイプミス
```

### 3. 徹底的なテスト

各画面の移行後、ナビゲーションとパラメータの受け渡しをテストします。

### 4. ドキュメントの参照

最新のExpo Routerドキュメントを参照して、新機能を活用します。

## よくある問題と解決策

### 問題1: ナビゲーションが機能しない

**原因**: パスの先頭に `/` が必要です。

**解決策**：
```typescript
// ✅ 正しい
router.push('/settings');

// ❌ 間違い
router.push('settings');
```

### 問題2: パラメータが受け取れない

**原因**: `useLocalSearchParams()` を使用していない。

**解決策**：
```typescript
const { id } = useLocalSearchParams<{ id: string }>();
```

### 問題3: 戻るボタンが表示されない

**原因**: `initialRouteName` が設定されていない。

**解決策**：
```typescript
export const unstable_settings = {
  initialRouteName: 'index',
};
```

## まとめ

React NavigationからExpo Routerへの移行は、以下のステップで実行できます：

1. **移行前の準備**: スクリーンの分割、TypeScriptへの変換
2. **プロジェクト構造の変更**: `app` ディレクトリの作成、ファイルベースルーティング
3. **ナビゲーションフックの更新**: `useRouter()`、`useLocalSearchParams()` の使用
4. **Linkコンポーネントの更新**: `href` プロパティの使用
5. **画面トラッキングの更新**: `usePathname()` の活用
6. **API置き換え**: React NavigationのAPIをExpo Router APIに置き換え

**主な利点**：
- 自動ディープリンク
- 型安全なルート
- 静的レンダリング対応
- シンプルなナビゲーション管理

**推奨アプローチ**：
- 段階的な移行
- TypeScriptの活用
- 徹底的なテスト
- ドキュメントの参照

これらのガイドラインに従って、React NavigationからExpo Routerへのスムーズな移行を実現できます。
