# Expo Router 包括的ガイド

Expo RouterはUniversal React Nativeアプリケーションのためのファイルベースルーティングライブラリです。Android、iOS、Webプラットフォーム全体で一貫したナビゲーション体験を提供します。

## 目次

- [はじめに](#はじめに)
- [インストール](#インストール)
- [基本概念](#基本概念)
- [ルーティング記法](#ルーティング記法)
- [レイアウト](#レイアウト)
- [ナビゲーション](#ナビゲーション)
- [一般的なナビゲーションパターン](#一般的なナビゲーションパターン)
- [エラーハンドリング](#エラーハンドリング)
- [URLパラメータ](#urlパラメータ)
- [型付きルート](#型付きルート)
- [リダイレクト](#リダイレクト)
- [ミドルウェア](#ミドルウェア)
- [APIルート](#apiルート)
- [非同期ルート](#非同期ルート)
- [静的レンダリング](#静的レンダリング)
- [サイトマップ](#サイトマップ)
- [画面トラッキング](#画面トラッキング)
- [テスト](#テスト)
- [srcディレクトリ](#srcディレクトリ)
- [リンクプレビュー](#リンクプレビュー)
- [トラブルシューティング](#トラブルシューティング)
- [移行ガイド](#移行ガイド)

---

## はじめに

### Expo Routerとは

Expo Routerは、ファイルシステムの構造に基づいてルーティングを定義するライブラリです。React Navigationの上に構築されており、強力な追加機能を提供します。

### 主な特徴

```typescript
interface ExpoRouterFeatures {
  nativeNavigation: 'React Navigation上に構築';
  autoDeepLinks: '全画面に自動ディープリンク';
  offlineFirst: 'オフライン対応';
  lazyEvaluation: '遅延読み込み';
  universalNavigation: '全プラットフォーム統一';
  staticRendering: 'SEO対応';
}
```

#### ネイティブナビゲーション
- React Navigationで動作
- ネイティブアニメーション
- プラットフォーム固有のUI

#### 自動ディープリンク
- すべての画面に自動設定
- Web、iOS、Android対応

#### オフラインファースト
- オフラインでも機能
- ネイティブキャッシング

#### 遅延評価
- 必要なときのみコード読み込み
- 初期バンドルサイズ削減

#### ユニバーサルナビゲーション
- 統一されたルーティング構造
- クロスプラットフォーム対応

#### 静的レンダリング
- SEO最適化
- 検索エンジンインデックス可能

### ファイルベースルーティングの利点

#### 1. シンプルなメンタルモデル

ファイル構造がルーティング構造と一致します。

```bash
app/
├── index.tsx           # / (ホームページ)
├── about.tsx           # /about
└── profile/
    ├── index.tsx       # /profile
    └── [id].tsx        # /profile/:id (動的ルート)
```

#### 2. リファクタリングが簡単

ファイルを移動するだけで、ルートが自動的に更新されます。

#### 3. 自動ルート型付け

TypeScriptの型が自動生成されます。

```typescript
// 型安全なナビゲーション
router.push('/profile/123'); // ✅ 型チェックされる
router.push('/profilr/123'); // ❌ TypeScriptエラー
```

#### 4. 開発速度の向上

ルーティング設定が不要で、すぐに開発を開始できます。

#### 5. シームレスなディープリンク

```typescript
// 自動的に以下のディープリンクが利用可能
const deepLinks = {
  mobile: 'myapp://profile/123',
  web: 'https://myapp.com/profile/123',
};
```

---

## インストール

### クイックスタート

```bash
# 新しいExpoアプリを作成（Expo Router設定済み）
npx create-expo-app@latest

# プロジェクトを開始
npx expo start
```

#### 開発方法

```typescript
interface DevOptions {
  expoGo: '初期開発に推奨';
  web: 'wキーでWebブラウザ';
  android: 'aキーでAndroidエミュレーター';
  ios: 'iキーでiOSシミュレーター';
}
```

### 手動インストール

#### 依存関係のインストール

```bash
npx expo install expo-router react-native-safe-area-context \
  react-native-screens expo-linking expo-constants expo-status-bar
```

#### インストールされるパッケージ

```typescript
interface RequiredPackages {
  'expo-router': 'コアパッケージ';
  'react-native-safe-area-context': 'セーフエリアサポート';
  'react-native-screens': 'ネイティブナビゲーション';
  'expo-linking': 'ディープリンク';
  'expo-constants': 'アプリ定数';
  'expo-status-bar': 'ステータスバー管理';
}
```

### 設定

#### 1. package.jsonの更新

```json
{
  "main": "expo-router/entry"
}
```

#### 2. app.jsonの設定

```json
{
  "expo": {
    "scheme": "myapp"
  }
}
```

**schemeの役割**:
- ディープリンクのURLスキーム
- カスタムURLの定義

例: `myapp://profile/123`

#### 3. babel.config.jsの更新

```javascript
module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
  };
};
```

#### 4. Web開発用の追加依存関係

```bash
npx expo install react-native-web react-dom
```

#### 5. Metro Web bundlerの有効化

```json
{
  "expo": {
    "web": {
      "bundler": "metro"
    }
  }
}
```

### プロジェクト構造

```bash
my-app/
├── app/
│   ├── _layout.tsx     # ルートレイアウト
│   ├── index.tsx       # ホームページ
│   └── about.tsx       # Aboutページ
├── assets/             # 画像やフォント
├── components/         # 共有コンポーネント
├── app.json            # Expo設定
├── package.json        # 依存関係
└── tsconfig.json       # TypeScript設定
```

### TypeScript設定

```json
{
  "extends": "expo/tsconfig.base",
  "compilerOptions": {
    "strict": true
  }
}
```

### トラブルシューティング

#### エントリーポイントが見つからない

```json
// package.json
{
  "main": "expo-router/entry"
}
```

#### schemeが設定されていない

```json
// app.json
{
  "expo": {
    "scheme": "myapp"
  }
}
```

#### バンドラーキャッシュの問題

```bash
npx expo start --clear
```

---

## 基本概念

### ファイルベースルーティングの原則

```typescript
interface RoutingPrinciples {
  appDirectory: 'すべての画面とページはappディレクトリ内';
  uniqueURL: '各ファイルはユニークなURLを持つ';
  initialRoute: '最初のindex.tsxが初期ルート';
  rootLayout: 'ルート_layout.tsxがApp.jsx/tsxを置き換え';
}
```

### プロジェクト構造の例

```bash
app/
  index.tsx           # 初期ルート (/)
  home.tsx            # /home ルート
  _layout.tsx         # ルートレイアウト
  profile/
    friends.tsx       # /profile/friends ルート

components/           # ルート以外のコンポーネント
  TextField.tsx
  Toolbar.tsx
```

### ナビゲーションの原則

#### ユニバーサルディープリンク

```typescript
interface UniversalLinks {
  native: 'myapp://home';
  nativeNested: 'myapp://profile/friends';
  web: 'https://myapp.com/home';
  webNested: 'https://myapp.com/profile/friends';
}
```

#### URLとファイルの対応

| ファイル | URL |
|---------|-----|
| `app/index.tsx` | `/` |
| `app/home.tsx` | `/home` |
| `app/profile/friends.tsx` | `/profile/friends` |
| `app/settings/account.tsx` | `/settings/account` |

### React Navigationとの関係

```typescript
interface ReactNavigationCompatibility {
  compatibility: 'すべての設定オプションと互換';
  knowledge: 'React Navigationの知識を活用可能';
  migration: '段階的に移行可能';
}
```

### ルートグループ

括弧を使用して、URL構造に影響を与えずにルートをグループ化します。

```bash
app/
  (tabs)/
    index.tsx      # / ルート
    home.tsx       # /home ルート
    profile.tsx    # /profile ルート
  _layout.tsx
```

**重要**: `(tabs)`はURL構造に含まれません。

### クロスプラットフォームナビゲーション

```typescript
interface CrossPlatformSupport {
  web: {
    backForward: 'ブラウザの戻る/進むボタン',
    directURL: 'URLバーでの直接ナビゲーション',
    bookmarks: 'ブックマークとリンク共有',
  };
  mobile: {
    animations: 'ネイティブナビゲーションアニメーション',
    deepLinks: 'ディープリンクサポート',
    platformUI: 'プラットフォーム固有のUI',
  };
}
```

---

## ルーティング記法

### 1. シンプルな名前（静的ルート）

```bash
app/
  home.tsx          # /home
  about.tsx         # /about
  contact.tsx       # /contact
```

```typescript
// app/home.tsx
export default function HomeScreen() {
  return <Text>Home Screen</Text>;
}
```

### 2. 角括弧（動的ルート）

```bash
app/
  users/
    [userName].tsx    # /users/evanbacon, /users/expo
  posts/
    [id].tsx          # /posts/1, /posts/hello
```

```typescript
// app/users/[userName].tsx
import { useLocalSearchParams } from 'expo-router';
import { Text } from 'react-native';

export default function UserScreen() {
  const { userName } = useLocalSearchParams<{ userName: string }>();
  return <Text>User: {userName}</Text>;
}
```

#### キャッチオールパラメータ

```bash
app/
  blog/
    [...slug].tsx     # /blog/2024/01/hello, /blog/about
```

```typescript
// app/blog/[...slug].tsx
import { useLocalSearchParams } from 'expo-router';

export default function BlogScreen() {
  const { slug } = useLocalSearchParams<{ slug: string[] }>();
  return <Text>Blog: {Array.isArray(slug) ? slug.join('/') : slug}</Text>;
}
```

### 3. 括弧（ルートグループ）

```bash
app/
  (tabs)/
    index.tsx         # /
    settings.tsx      # /settings
    profile.tsx       # /profile
  _layout.tsx
```

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

### 4. index.tsx ファイル

```bash
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

### 5. _layout.tsx ファイル

```bash
app/
  _layout.tsx         # ルートレイアウト
  (tabs)/
    _layout.tsx       # タブレイアウト
    index.tsx
    profile.tsx
```

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

### 6. プラス記号ルート

#### +not-found.tsx

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

#### +html.tsx

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

---

## レイアウト

### レイアウトとは

```typescript
interface LayoutFeatures {
  navigationStructure: 'ナビゲーション構造の定義';
  commonUI: 'ヘッダー、フッター、サイドバー';
  initialization: 'フォント読み込み、認証チェック';
}
```

### ルートレイアウト

```typescript
// app/_layout.tsx
import { useEffect } from 'react';
import { Stack } from 'expo-router';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';

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

### ナビゲーションレイアウトの種類

#### 1. Stack Navigator

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

#### 2. Tab Navigator

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
    </Tabs>
  );
}
```

#### 3. Drawer Navigator

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
    </Drawer>
  );
}
```

#### 4. Slot Layout

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
```

---

## ナビゲーション

### 1. 命令的ナビゲーション（useRouter）

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

#### routerオブジェクトのメソッド

```typescript
interface RouterMethods {
  push(href: string): void;      // 新しいルートをプッシュ
  replace(href: string): void;   // 現在のルートを置換
  back(): void;                  // 前のページに戻る
  canGoBack(): boolean;          // 戻れるか確認
  navigate(href: string): void;  // ナビゲート
}
```

### 2. Linkコンポーネント

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

#### 絶対パスと相対パス

```typescript
// 絶対パス
<Link href="/about">About</Link>
<Link href="/users/123">User 123</Link>

// 相対パス
<Link href="./details">Details</Link>
<Link href="../home">Home</Link>
```

### 3. 動的ルートへのナビゲーション

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
    </>
  );
}
```

### 4. クエリパラメータ

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

```typescript
// app/users.tsx
import { useLocalSearchParams } from 'expo-router';

export default function UsersScreen() {
  const { sort, order } = useLocalSearchParams<{
    sort?: string;
    order?: string;
  }>();

  return (
    <Text>Sort: {sort}, Order: {order}</Text>
  );
}
```

### 5. Redirectコンポーネント

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

---

## 一般的なナビゲーションパターン

### 1. タブ内のStack（ネストされたナビゲーター）

```bash
app/
  (tabs)/
    _layout.tsx       # タブ構造を定義
    feed/
      _layout.tsx     # フィードタブ内のスタック
      index.tsx       # フィードリスト
      [postId].tsx    # 個別の投稿
```

```typescript
// app/(tabs)/_layout.tsx
import { Tabs } from 'expo-router';

export default function TabLayout() {
  return (
    <Tabs>
      <Tabs.Screen
        name="feed"
        options={{
          title: 'Feed',
          headerShown: false,
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
      <Stack.Screen name="index" options={{ title: 'Feed' }} />
      <Stack.Screen name="[postId]" options={{ title: 'Post Details' }} />
    </Stack>
  );
}
```

### 2. 認証用の保護されたルート

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
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        </>
      ) : (
        <Stack.Screen name="(auth)" options={{ headerShown: false }} />
      )}
    </Stack>
  );
}
```

### 3. モーダル表示

```typescript
// app/_layout.tsx
import { Stack } from 'expo-router';

export default function RootLayout() {
  return (
    <Stack>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
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

---

## エラーハンドリング

### マッチしないルート

```typescript
// app/+not-found.tsx
import { View, Text, StyleSheet } from 'react-native';
import { Link } from 'expo-router';

export default function NotFoundScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>This screen doesn't exist.</Text>
      <Link href="/" style={styles.link}>
        <Text style={styles.linkText}>Go to home screen!</Text>
      </Link>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  link: {
    marginTop: 15,
    paddingVertical: 15,
  },
  linkText: {
    fontSize: 14,
    color: '#2e78b7',
  },
});
```

### エラーバウンダリ

```typescript
// app/profile.tsx
import { View, Text, StyleSheet } from 'react-native';
import { ErrorBoundaryProps } from 'expo-router';

export function ErrorBoundary({ error, retry }: ErrorBoundaryProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>An error occurred</Text>
      <Text style={styles.message}>{error.message}</Text>
      <Text style={styles.retryButton} onPress={retry}>
        Try Again?
      </Text>
    </View>
  );
}

export default function ProfileScreen() {
  // 画面のコンテンツ
  return <Text>Profile Screen</Text>;
}
```

### ErrorBoundaryPropsの型

```typescript
interface ErrorBoundaryProps {
  error: Error;
  retry: () => void;
}
```

---

## URLパラメータ

### URLパラメータのタイプ

```typescript
interface URLParameters {
  routeParams: 'URLパスの動的セグメント';
  searchParams: 'URLに追加されるクエリパラメータ';
}
```

### パラメータにアクセスするフック

#### useLocalSearchParams()

```typescript
import { useLocalSearchParams } from 'expo-router';

export default function ProfileScreen() {
  const { user } = useLocalSearchParams<{ user: string }>();
  return <Text>User: {user}</Text>;
}
```

#### useGlobalSearchParams()

```typescript
import { useGlobalSearchParams } from 'expo-router';

export default function AnyScreen() {
  const params = useGlobalSearchParams();
  return <Text>Global params: {JSON.stringify(params)}</Text>;
}
```

### URLパラメータの更新

```typescript
import { useRouter } from 'expo-router';
import { TextInput } from 'react-native';

export default function SearchScreen() {
  const router = useRouter();
  const [searchText, setSearchText] = useState('');

  const handleSearch = (text: string) => {
    setSearchText(text);
    router.setParams({ query: text });
  };

  return (
    <TextInput
      value={searchText}
      onChangeText={handleSearch}
      placeholder="Search..."
    />
  );
}
```

### 動的ルートとパラメータ

```typescript
// app/posts/[category]/[id].tsx
import { useLocalSearchParams } from 'expo-router';

export default function PostScreen() {
  const { category, id } = useLocalSearchParams<{
    category: string;
    id: string;
  }>();

  return (
    <View>
      <Text>Category: {category}</Text>
      <Text>Post ID: {id}</Text>
    </View>
  );
}
```

---

## 型付きルート

### セットアップ

```json
// app.json
{
  "expo": {
    "experiments": {
      "typedRoutes": true
    }
  }
}
```

### 静的に型付けされたルートナビゲーション

```typescript
import { Link } from 'expo-router';

export default function Page() {
  return (
    <>
      {/* ✅ 有効なルート */}
      <Link href="/about" />
      <Link href="/user/1" />
      <Link href={`/user/${id}`} />

      {/* ❌ 無効なルート - TypeScriptエラー */}
      <Link href="/usser/1" />
    </>
  );
}
```

### 命令的ナビゲーション

```typescript
import { useRouter } from 'expo-router';

export default function Page() {
  const router = useRouter();

  const navigate = () => {
    // ✅ 型チェックされる
    router.push('/about');
    router.replace('/user/123');

    // ❌ TypeScriptエラー
    router.push('/invalid-route');
  };

  return <Button title="Navigate" onPress={navigate} />;
}
```

---

## リダイレクト

### Redirectコンポーネント

```typescript
import { Redirect } from 'expo-router';

export default function Page() {
  const { user } = useAuth();

  if (!user) {
    return <Redirect href="/login" />;
  }

  return (
    <View>
      <Text>Welcome Back!</Text>
    </View>
  );
}
```

### useRouterフック

```typescript
import { useRouter, useFocusEffect } from 'expo-router';

export default function MyScreen() {
  const router = useRouter();

  useFocusEffect(() => {
    router.replace('/profile/settings');
  });

  return <Text>My Screen</Text>;
}
```

### 条件付きリダイレクト

```typescript
// 認証ベース
import { Redirect } from 'expo-router';
import { useAuth } from '@/hooks/useAuth';

export default function ProtectedScreen() {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return <LoadingScreen />;
  }

  if (!user) {
    return <Redirect href="/login" />;
  }

  return <View><Text>Protected Content</Text></View>;
}

// 権限ベース
export default function AdminScreen() {
  const { user } = useAuth();

  if (!user) {
    return <Redirect href="/login" />;
  }

  if (!user.isAdmin) {
    return <Redirect href="/unauthorized" />;
  }

  return <View><Text>Admin Panel</Text></View>;
}
```

---

## ミドルウェア

### セットアップ

```json
// app.json
{
  "expo": {
    "web": {
      "output": "server"
    }
  }
}
```

### 基本的な使用方法

```typescript
// app/+middleware.ts
export default function middleware(request: Request) {
  console.log(`Middleware executed for: ${request.url}`);
}
```

### カスタムレスポンスの返却

```typescript
// app/+middleware.ts
export default function middleware(request: Request) {
  const url = new URL(request.url);

  if (url.pathname === '/maintenance') {
    return new Response('Site is under maintenance', {
      status: 503,
      headers: {
        'Content-Type': 'text/plain',
      },
    });
  }
}
```

### マッチャー設定

```typescript
// app/+middleware.ts
export const unstable_settings = {
  matcher: {
    methods: ['GET', 'POST'],
    patterns: ['/api/*', '/admin/*'],
  },
};

export default function middleware(request: Request) {
  console.log('Middleware executed for matched routes');
}
```

---

## APIルート

### 基本的なセットアップ

```typescript
// app/hello+api.ts
export function GET(request: Request) {
  return Response.json({ hello: 'world' });
}
```

### サポートされるHTTPメソッド

```typescript
// GET
export function GET(request: Request) {
  return Response.json({ method: 'GET' });
}

// POST
export async function POST(request: Request) {
  const body = await request.json();
  return Response.json({ received: body });
}

// PUT
export function PUT(request: Request) {
  return Response.json({ method: 'PUT' });
}

// DELETE
export function DELETE(request: Request) {
  return Response.json({ method: 'DELETE' });
}
```

### リクエストの処理

```typescript
// app/users+api.ts
export async function POST(request: Request) {
  const body = await request.json();
  const { name, email } = body;

  return Response.json({
    message: 'User created',
    user: { name, email },
  });
}
```

### クエリパラメータの解析

```typescript
// app/search+api.ts
export function GET(request: Request) {
  const url = new URL(request.url);
  const query = url.searchParams.get('q');
  const limit = url.searchParams.get('limit') || '10';

  return Response.json({
    query,
    limit: parseInt(limit),
    results: [],
  });
}
```

### 動的ルート

```typescript
// app/users/[id]+api.ts
export function GET(request: Request, { id }: { id: string }) {
  return Response.json({
    userId: id,
    name: 'User Name',
  });
}
```

---

## 非同期ルート

### セットアップ

```typescript
// app.config.ts
export default {
  expo: {
    plugins: [
      [
        'expo-router',
        {
          asyncRoutes: {
            web: true,
            default: 'development',
          },
        },
      ],
    ],
  },
};
```

### 設定オプション

```typescript
interface AsyncRoutesConfig {
  web: boolean;                         // Webで有効化
  default: 'development' | 'production' | false;  // ネイティブ設定
}
```

### プロジェクトの起動

```bash
npx expo start --clear
```

---

## 静的レンダリング

### セットアップ

```json
// app.json
{
  "expo": {
    "web": {
      "bundler": "metro",
      "output": "static"
    }
  }
}
```

### 本番デプロイ

```bash
npx expo export --platform web
```

### 動的ルート

```typescript
// app/posts/[id].tsx
import { View, Text } from 'react-native';
import { useLocalSearchParams } from 'expo-router';

export async function generateStaticParams(): Promise<
  Record<string, string>[]
> {
  const posts = await getPosts();
  return posts.map((post) => ({ id: post.id }));
}

export default function PostScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  return <View><Text>Post ID: {id}</Text></View>;
}
```

### メタタグの管理

```typescript
// app/about.tsx
import Head from 'expo-router/head';
import { View, Text } from 'react-native';

export default function AboutScreen() {
  return (
    <>
      <Head>
        <title>About Us</title>
        <meta name="description" content="Learn more about our company" />
        <meta property="og:title" content="About Us" />
      </Head>
      <View>
        <Text>About Screen</Text>
      </View>
    </>
  );
}
```

---

## サイトマップ

### アクセス方法

```
http://localhost:8081/_sitemap
```

### サイトマップの無効化

```json
// app.json
{
  "expo": {
    "plugins": [
      [
        "expo-router",
        {
          "sitemap": false
        }
      ]
    ]
  }
}
```

### ディープリンクのテスト

```bash
# iOS
npx uri-scheme open exp://192.168.87.39:19000/--/about --ios

# Android
npx uri-scheme open exp://192.168.87.39:19000/--/about --android
```

---

## 画面トラッキング

### 基本的な実装

```typescript
// app/_layout.tsx
import { useEffect } from 'react';
import { usePathname, useGlobalSearchParams, Slot } from 'expo-router';

export default function Layout() {
  const pathname = usePathname();
  const params = useGlobalSearchParams();

  useEffect(() => {
    analytics.track({ pathname, params });
  }, [pathname, params]);

  return <Slot />;
}
```

### アナリティクスプロバイダーとの統合

#### Firebase Analytics

```typescript
import { useEffect } from 'react';
import { usePathname } from 'expo-router';
import * as Analytics from 'expo-firebase-analytics';

export default function Layout() {
  const pathname = usePathname();

  useEffect(() => {
    Analytics.logEvent('screen_view', {
      screen_name: pathname,
      screen_class: pathname,
    });
  }, [pathname]);

  return <Slot />;
}
```

#### Google Analytics

```typescript
import { useEffect } from 'react';
import { usePathname } from 'expo-router';
import { GoogleAnalytics } from '@/lib/analytics';

export default function Layout() {
  const pathname = usePathname();

  useEffect(() => {
    GoogleAnalytics.send({
      hitType: 'pageview',
      page: pathname,
    });
  }, [pathname]);

  return <Slot />;
}
```

---

## テスト

### 必要なツール

```bash
npm install --save-dev jest-expo @testing-library/react-native
```

### renderRouter関数

```typescript
import { renderRouter } from 'expo-router/testing-library';

it('renders the index route', () => {
  const MockComponent = () => <Text>Hello</Text>;

  renderRouter(
    {
      index: MockComponent,
      'directory/a': MockComponent,
    },
    {
      initialUrl: '/directory/a',
    }
  );
});
```

### Jestマッチャー

```typescript
import { screen } from '@testing-library/react-native';

// パスネームをチェック
expect(screen).toHavePathname('/my-router');

// パスネームとパラメータをチェック
expect(screen).toHavePathnameWithParams('/user/[id]', {
  id: '123',
});

// セグメントをチェック
expect(screen).toHaveSegments(['user', '[id]']);

// ルーター状態をチェック
expect(screen).toHaveRouterState({
  pathname: '/user/[id]',
  params: { id: '123' },
  segments: ['user', '[id]'],
});
```

---

## srcディレクトリ

### 推奨される構造

```bash
src/
  app/
    _layout.tsx
    index.tsx
  components/
    button.tsx
package.json
```

### 重要な注意事項

```typescript
interface SrcDirectoryRules {
  configFiles: 'ルートディレクトリに配置';
  priority: 'src/appがルートのappより優先';
  publicDirectory: 'ルートに配置';
}
```

### マイグレーション手順

```bash
# 1. srcディレクトリの作成
mkdir src

# 2. appディレクトリの移動
mv app src/

# 3. コンポーネントの移動
mkdir src/components
mv components/* src/components/
```

---

## リンクプレビュー

### 基本的な実装

```typescript
import { Link } from 'expo-router';

export default function Page() {
  return (
    <Link href="/about">
      <Link.Trigger>About</Link.Trigger>
      <Link.Preview />
    </Link>
  );
}
```

### カスタムサイズ

```typescript
<Link href="/about">
  <Link.Trigger>About</Link.Trigger>
  <Link.Preview preferredSize={{ width: 400, height: 600 }} />
</Link>
```

### コンテキストメニュー

```typescript
<Link href="/about">
  <Link.Trigger>About</Link.Trigger>
  <Link.Preview />
  <Link.Menu>
    <Link.MenuAction
      title="Open"
      systemImage="arrow.up.right"
      onPress={() => {}}
    />
    <Link.MenuAction
      title="Share"
      systemImage="square.and.arrow.up"
      onPress={() => {}}
    />
  </Link.Menu>
</Link>
```

### useIsPreview()フック

```typescript
import { useIsPreview } from 'expo-router';

export default function AboutScreen() {
  const isPreview = useIsPreview();

  return (
    <View>
      {isPreview ? (
        <Text>This is a preview</Text>
      ) : (
        <Text>This is the full screen</Text>
      )}
    </View>
  );
}
```

---

## トラブルシューティング

### 一般的な問題と解決策

#### 1. EXPO_ROUTER_APP_ROOTが定義されていない

```bash
# キャッシュをクリア
npx expo start --clear
```

#### 2. require.contextが有効になっていない

```javascript
// metro.config.js
const { getDefaultConfig } = require('expo/metro-config');
module.exports = getDefaultConfig(__dirname);
```

#### 3. 戻るボタンが表示されない

```typescript
// app/_layout.tsx
export const unstable_settings = {
  initialRouteName: 'index',
};

export default function RootLayout() {
  return <Stack />;
}
```

#### 4. モジュールが見つからない

```bash
npx expo install expo-router
```

#### 5. Metroバンドラーエラー

```bash
npx expo start --clear
```

---

## 移行ガイド

### React Navigationからの移行

#### ナビゲーションフックの更新

**React Navigation**:
```typescript
import { useNavigation } from '@react-navigation/native';

const navigation = useNavigation();
navigation.push('Settings');
```

**Expo Router**:
```typescript
import { useRouter } from 'expo-router';

const router = useRouter();
router.push('/settings');
```

#### パラメータアクセスの更新

**React Navigation**:
```typescript
import { useRoute } from '@react-navigation/native';

const route = useRoute();
const { id } = route.params;
```

**Expo Router**:
```typescript
import { useLocalSearchParams } from 'expo-router';

const { id } = useLocalSearchParams<{ id: string }>();
```

#### Linkコンポーネントの更新

**React Navigation**:
```typescript
import { Link } from '@react-navigation/native';

<Link to="Settings">Go to Settings</Link>
```

**Expo Router**:
```typescript
import { Link } from 'expo-router';

<Link href="/settings">Go to Settings</Link>
```

### Expo Webpackからの移行

#### バンドラーの変更

**Expo Webpack**: Webpack bundler

**Expo Router**: Metro bundler

#### 設定の更新

**Expo Webpack**:
```javascript
// webpack.config.js
const createExpoWebpackConfigAsync = require('@expo/webpack-config');
```

**Expo Router**:
```javascript
// metro.config.js
const { getDefaultConfig } = require('expo/metro-config');
module.exports = getDefaultConfig(__dirname);
```

---

## コマンドリファレンス

```bash
# プロジェクトの作成
npx create-expo-app@latest

# 開発サーバーの起動
npx expo start

# キャッシュをクリアして起動
npx expo start --clear

# プラットフォーム固有の起動
npx expo start --web
npx expo start --ios
npx expo start --android

# Webビルド
npx expo export --platform web

# 依存関係のインストール
npx expo install expo-router react-native-safe-area-context \
  react-native-screens expo-linking expo-constants expo-status-bar

# ディープリンクのテスト
npx uri-scheme open exp://localhost:8081/--/about --ios
npx uri-scheme open exp://localhost:8081/--/about --android
```

---

## 型定義

```typescript
// ルーティング関連
interface RouterMethods {
  push(href: string | HrefObject): void;
  replace(href: string | HrefObject): void;
  back(): void;
  canGoBack(): boolean;
  navigate(href: string | HrefObject): void;
  setParams(params: Record<string, string>): void;
}

interface HrefObject {
  pathname: string;
  params?: Record<string, string>;
}

interface LocalSearchParams<T = Record<string, string>> {
  [key: string]: string | string[];
}

interface ErrorBoundaryProps {
  error: Error;
  retry: () => void;
}

// レイアウト関連
interface LayoutProps {
  children: React.ReactNode;
}

interface StackScreenOptions {
  title?: string;
  headerShown?: boolean;
  presentation?: 'card' | 'modal' | 'transparentModal';
  animation?: 'default' | 'fade' | 'slide_from_right' | 'slide_from_left';
}

interface TabScreenOptions {
  title?: string;
  tabBarIcon?: (props: { color: string; size: number }) => React.ReactNode;
  tabBarLabel?: string;
  headerShown?: boolean;
}

// APIルート関連
type APIHandler = (request: Request, context?: any) => Response | Promise<Response>;

interface MiddlewareConfig {
  matcher?: {
    methods?: string[];
    patterns?: string[];
  };
}

// 静的レンダリング関連
type GenerateStaticParamsFunction = () => Promise<Record<string, string>[]>;

// テスト関連
interface RenderRouterOptions {
  initialUrl?: string;
}

interface RouterTestMatchers {
  toHavePathname(pathname: string): void;
  toHavePathnameWithParams(pathname: string, params: Record<string, string>): void;
  toHaveSegments(segments: string[]): void;
  toHaveRouterState(state: {
    pathname: string;
    params: Record<string, string>;
    segments: string[];
  }): void;
}
```

---

## ベストプラクティス

### 1. ファイル構造を整理

```bash
app/
  (auth)/         # 認証関連
    login.tsx
    register.tsx
  (tabs)/         # タブナビゲーション
    index.tsx
    profile.tsx
  _layout.tsx     # ルートレイアウト
```

### 2. レイアウトを活用

共通のレイアウトには`_layout.tsx`を使用してください。

### 3. 型安全性を活用

```typescript
// 型安全なナビゲーション
router.push('/about'); // ✅
router.push('/abut');  // ❌ TypeScriptエラー

// 型安全なパラメータ
const { id } = useLocalSearchParams<{ id: string }>();
```

### 4. ディープリンクをテスト

すべての画面でディープリンクをテストしてください。

### 5. エラーハンドリングを実装

```typescript
export function ErrorBoundary({ error, retry }: ErrorBoundaryProps) {
  return (
    <View>
      <Text>Error: {error.message}</Text>
      <Button title="Retry" onPress={retry} />
    </View>
  );
}
```

---

## 関連リンク

- [公式ドキュメント](https://docs.expo.dev/router/introduction/)
- [GitHub リポジトリ](https://github.com/expo/expo)
- [React Navigation](https://reactnavigation.org/)
- [Expo CLI](https://docs.expo.dev/workflow/expo-cli/)

---

## まとめ

Expo Routerは、Universal React Nativeアプリケーションのための包括的で開発者フレンドリーなルーティングソリューションです。

### 主な利点

1. **ファイルベースルーティング**: 直感的なファイル構造
2. **自動ディープリンク**: すべての画面に自動設定
3. **型安全性**: TypeScript型の自動生成
4. **クロスプラットフォーム**: Web、iOS、Android対応
5. **静的レンダリング**: SEO最適化
6. **React Navigation互換**: 既存の知識を活用可能

### 推奨される使用パターン

- **小規模アプリ**: 基本的なStack/Tabsナビゲーション
- **中規模アプリ**: ネストされたナビゲーター、認証フロー
- **大規模アプリ**: モジュラー構造、APIルート、静的レンダリング

Expo Routerを使用することで、開発速度とユーザーエクスペリエンスを向上させ、保守性の高いアプリケーションを構築できます。
