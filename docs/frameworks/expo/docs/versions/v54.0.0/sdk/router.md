# Expo Router

React NavigationをベースにしたReact NativeとWebアプリケーション向けのファイルベースルーティングライブラリです。

## 概要

Expo Routerは、React NativeとWebアプリケーションのための強力なルーティングソリューションを提供します。ファイルベースのルーティングシステムを使用することで、直感的で拡張性の高いナビゲーション構造を作成できます。

## インストールと設定

### インストール

```bash
npx expo install expo-router react-native-safe-area-context react-native-screens expo-linking expo-constants expo-status-bar
```

### 設定

`app.json`にプラグインを追加します：

```json
{
  "expo": {
    "plugins": ["expo-router"]
  }
}
```

## プラットフォーム

- Android
- iOS
- Web

## 主な機能

- **ファイルベースルーティング**: ファイル構造に基づく自動ルート生成
- **動的ルート**: パラメータベースのルーティングサポート
- **クロスプラットフォーム**: Android、iOS、Webで動作
- **ディープリンク**: URLベースのナビゲーション
- **タイプセーフ**: TypeScriptの完全サポート

## 基本的な使用例

### ファイル構造

```
app/
├── index.tsx          # ホームページ (/)
├── about.tsx          # Aboutページ (/about)
├── user/
│   └── [id].tsx      # 動的ルート (/user/:id)
└── _layout.tsx       # レイアウトラッパー
```

### ナビゲーションの例

```typescript
import { Link, useRouter } from 'expo-router';
import { View, Text, Pressable } from 'react-native';

export default function Home() {
  const router = useRouter();

  return (
    <View>
      <Text>ホームページ</Text>

      {/* Linkコンポーネントを使用 */}
      <Link href="/about">
        <Text>Aboutへ</Text>
      </Link>

      {/* 命令的ナビゲーション */}
      <Pressable onPress={() => router.push('/user/123')}>
        <Text>ユーザープロフィールへ</Text>
      </Pressable>
    </View>
  );
}
```

## 主要なコンポーネント

### `<Link>`

宣言的なナビゲーション用のコンポーネントです。

```typescript
import { Link } from 'expo-router';

<Link href="/profile">
  <Text>プロフィールへ</Text>
</Link>

// パラメータ付き
<Link
  href={{
    pathname: '/user/[id]',
    params: { id: '123' }
  }}
>
  <Text>ユーザーへ</Text>
</Link>
```

### `<Redirect>`

プログラム的にユーザーをリダイレクトします。

```typescript
import { Redirect } from 'expo-router';

export default function Index() {
  const user = useUser();

  if (!user) {
    return <Redirect href="/login" />;
  }

  return <HomeScreen />;
}
```

### `<Slot>`

現在選択されているコンテンツをレンダリングします。

```typescript
import { Slot } from 'expo-router';
import { View } from 'react-native';

export default function Layout() {
  return (
    <View>
      <Header />
      <Slot />
      <Footer />
    </View>
  );
}
```

## 主要なフック

### `useRouter()`

命令的ナビゲーション用のルーターオブジェクトを返します。

```typescript
import { useRouter } from 'expo-router';

export default function Screen() {
  const router = useRouter();

  const navigate = () => {
    router.push('/profile');
    // router.replace('/login');
    // router.back();
  };

  return <Button onPress={navigate} title="プロフィールへ" />;
}
```

**メソッド:**
- `push(href)`: 新しいルートをスタックにプッシュ
- `replace(href)`: 現在のルートを置き換え
- `back()`: 前のルートに戻る
- `canGoBack()`: 戻ることができるかチェック
- `setParams(params)`: 現在のルートのパラメータを更新

### `useLocalSearchParams()`

現在のルートのURLパラメータにアクセスします。

```typescript
import { useLocalSearchParams } from 'expo-router';

// ルート: /user/[id].tsx
export default function UserScreen() {
  const { id } = useLocalSearchParams();

  return <Text>ユーザーID: {id}</Text>;
}
```

### `usePathname()`

現在のルートパスを返します。

```typescript
import { usePathname } from 'expo-router';

export default function Screen() {
  const pathname = usePathname();

  return <Text>現在のパス: {pathname}</Text>;
}
```

### `useSegments()`

現在のルートセグメントの配列を返します。

```typescript
import { useSegments } from 'expo-router';

export default function Screen() {
  const segments = useSegments();
  // ['user', '123'] for /user/123

  return <Text>セグメント: {segments.join('/')}</Text>;
}
```

## 動的ルート

### 基本的な動的ルート

```
app/
└── user/
    └── [id].tsx
```

```typescript
// app/user/[id].tsx
import { useLocalSearchParams } from 'expo-router';

export default function UserScreen() {
  const { id } = useLocalSearchParams();
  return <Text>ユーザー: {id}</Text>;
}
```

### キャッチオールルート

```
app/
└── blog/
    └── [...slug].tsx
```

```typescript
// app/blog/[...slug].tsx
import { useLocalSearchParams } from 'expo-router';

export default function BlogPost() {
  const { slug } = useLocalSearchParams();
  // slug は配列: ['2024', '01', 'post-title']

  return <Text>投稿: {slug}</Text>;
}
```

## レイアウト

レイアウトを使用して、複数のルート間で共有UIをラップします。

```typescript
// app/_layout.tsx
import { Stack } from 'expo-router';

export default function RootLayout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ title: 'ホーム' }} />
      <Stack.Screen name="about" options={{ title: 'About' }} />
    </Stack>
  );
}
```

### タブレイアウト

```typescript
// app/(tabs)/_layout.tsx
import { Tabs } from 'expo-router';

export default function TabLayout() {
  return (
    <Tabs>
      <Tabs.Screen
        name="home"
        options={{
          title: 'ホーム',
          tabBarIcon: ({ color }) => <HomeIcon color={color} />
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: '設定',
          tabBarIcon: ({ color }) => <SettingsIcon color={color} />
        }}
      />
    </Tabs>
  );
}
```

## ナビゲーションパターン

### モーダル

```typescript
// app/_layout.tsx
import { Stack } from 'expo-router';

export default function RootLayout() {
  return (
    <Stack>
      <Stack.Screen name="home" />
      <Stack.Screen
        name="modal"
        options={{
          presentation: 'modal',
          title: 'モーダル'
        }}
      />
    </Stack>
  );
}
```

### ヘッダーのカスタマイズ

```typescript
import { Stack } from 'expo-router';

export default function Layout() {
  return (
    <Stack>
      <Stack.Screen
        name="home"
        options={{
          title: 'ホーム',
          headerStyle: { backgroundColor: '#f4511e' },
          headerTintColor: '#fff',
          headerTitleStyle: { fontWeight: 'bold' },
        }}
      />
    </Stack>
  );
}
```

## ディープリンク

Expo Routerは自動的にディープリンクを処理します。

```json
// app.json
{
  "expo": {
    "scheme": "myapp",
    "plugins": ["expo-router"]
  }
}
```

URLを開く：
- `myapp://user/123` → `/user/123`
- `https://myapp.com/profile` → `/profile`

## ベストプラクティス

1. **レイアウトを活用**: 共通のUIとロジックを共有するためにレイアウトを使用
2. **タイプセーフなルート**: TypeScriptでルートパラメータを定義
3. **リンクよりもナビゲート**: 動的ナビゲーションには`useRouter`を使用
4. **グループルート**: 組織化のために括弧でルートをグループ化
5. **エラー境界**: エラー処理のためにエラー境界を実装

## トラブルシューティング

- **ルートが見つからない**: ファイル名とディレクトリ構造を確認
- **パラメータが未定義**: パラメータ名がファイル名と一致することを確認
- **ナビゲーションが動作しない**: ルーターがレイアウトで適切に設定されていることを確認

Expo Routerは、React NativeとWebアプリケーションでルーティングを実装するための包括的で強力なソリューションを提供します。
