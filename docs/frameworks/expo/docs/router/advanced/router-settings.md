# ルーター設定

Expo Routerの設定オプションを学びます。

## ルーター設定とは

Expo Routerでは、`unstable_settings`を使用してルーターの動作をカスタマイズできます。主に、スタックのデフォルト画面を設定するために使用されます。

**重要**: `unstable_settings`という名前が示すように、この機能は現在不安定な状態です。特に、非同期ルートでは機能しません。

## initialRouteNameプロパティ

### 基本的な設定

`initialRouteName`は、スタックのデフォルト画面を設定します。

```typescript
// app/_layout.tsx
import { Stack } from 'expo-router';

export const unstable_settings = {
  // どのルートからも `/` に戻れるようにする
  initialRouteName: 'index',
};

export default function RootLayout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ title: 'Home' }} />
      <Stack.Screen name="about" options={{ title: 'About' }} />
      <Stack.Screen name="settings" options={{ title: 'Settings' }} />
    </Stack>
  );
}
```

### 重要な注意事項

**ファイル名との一致**：
- `initialRouteName`は、有効なファイル名（拡張子なし）と一致する必要があります
- 例: `index.tsx`の場合、`initialRouteName: 'index'`

**ディープリンク時のみ動作**：
- ディープリンク時にのみ適用されます
- 通常のアプリフロー中のナビゲーションは上書きしません

## ディープリンクでの「戻る」ボタン

`initialRouteName`の主な目的は、ディープリンク時に「戻る」ボタンを提供することです。

### 動作の仕組み

**ディープリンクなし**：
```
アプリ起動 → index画面（戻るボタンなし）
```

**ディープリンクあり（initialRouteNameなし）**：
```
アプリ起動 → /about画面（戻るボタンなし）
```

**ディープリンクあり（initialRouteNameあり）**：
```
アプリ起動 → /about画面（戻るボタンあり → indexに戻る）
```

### 設定例

```typescript
// app/_layout.tsx
export const unstable_settings = {
  initialRouteName: 'index',
};

export default function RootLayout() {
  return (
    <Stack>
      <Stack.Screen name="index" />
      <Stack.Screen name="profile" />
      <Stack.Screen name="settings" />
    </Stack>
  );
}
```

**結果**：
- `/profile`や`/settings`にディープリンクすると、戻るボタンが表示されます
- 戻るボタンをタップすると、`index`画面に移動します

## グループルートの設定

### 基本的なグループ設定

グループルートにも`initialRouteName`を設定できます。

```typescript
// app/(tabs)/_layout.tsx
export const unstable_settings = {
  initialRouteName: 'home',
};

export default function TabLayout() {
  return (
    <Tabs>
      <Tabs.Screen name="home" options={{ title: 'Home' }} />
      <Tabs.Screen name="search" options={{ title: 'Search' }} />
      <Tabs.Screen name="profile" options={{ title: 'Profile' }} />
    </Tabs>
  );
}
```

### 複数グループの設定

複数のグループルートに異なる初期ルートを設定できます。

```typescript
// app/_layout.tsx
export const unstable_settings = {
  // (foo)グループ用
  initialRouteName: 'first',
  // (bar)グループ用
  bar: {
    initialRouteName: 'second',
  },
};
```

**プロジェクト構造**：
```
app/
├── _layout.tsx
├── (foo)/
│   ├── _layout.tsx
│   ├── first.tsx
│   └── third.tsx
└── (bar)/
    ├── _layout.tsx
    ├── second.tsx
    └── fourth.tsx
```

### ネストされたグループ

```typescript
// app/_layout.tsx
export const unstable_settings = {
  initialRouteName: 'index',
  tabs: {
    initialRouteName: 'home',
    settings: {
      initialRouteName: 'profile',
    },
  },
};
```

**プロジェクト構造**：
```
app/
├── _layout.tsx
├── index.tsx
└── (tabs)/
    ├── _layout.tsx
    ├── home.tsx
    └── (settings)/
        ├── _layout.tsx
        ├── profile.tsx
        └── preferences.tsx
```

## 初期ルートの無効化

### Linkコンポーネントでの無効化

`initial={false}`プロパティを使用して、初期ルート動作を無効化できます。

```typescript
import { Link } from 'expo-router';

export default function Screen() {
  return (
    <Link href="/details" initial={false}>
      View Details (no back button)
    </Link>
  );
}
```

### 命令的ナビゲーションでの無効化

```typescript
import { router } from 'expo-router';

export default function Screen() {
  const navigateWithoutInitial = () => {
    router.push({
      pathname: '/details',
      params: { overrideInitialScreen: false },
    });
  };

  return (
    <Button title="Navigate" onPress={navigateWithoutInitial} />
  );
}
```

## 実装パターン

### パターン1: シンプルなアプリ

```typescript
// app/_layout.tsx
export const unstable_settings = {
  initialRouteName: 'index',
};

export default function RootLayout() {
  return (
    <Stack>
      <Stack.Screen name="index" />
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
    </Stack>
  );
}
```

### パターン2: タブ付きアプリ

```typescript
// app/_layout.tsx
export const unstable_settings = {
  initialRouteName: '(tabs)',
};

// app/(tabs)/_layout.tsx
export const unstable_settings = {
  initialRouteName: 'home',
};
```

### パターン3: 認証フロー

```typescript
// app/_layout.tsx
export const unstable_settings = {
  initialRouteName: '(public)',
  authenticated: {
    initialRouteName: 'home',
  },
};
```

## ベストプラクティス

### 1. 明確な初期ルート

ユーザーがアプリに戻る明確なパスを提供してください。

```typescript
export const unstable_settings = {
  // ホーム画面を明確に設定
  initialRouteName: 'index',
};
```

### 2. ディープリンク体験の最適化

ディープリンクから戻る際のユーザー体験を考慮してください。

```typescript
export const unstable_settings = {
  // ディープリンクから戻る場合の目的地
  initialRouteName: 'home',
};
```

### 3. グループ構造の整理

グループルートの初期ルートを適切に設定してください。

```typescript
export const unstable_settings = {
  initialRouteName: 'index',
  tabs: {
    initialRouteName: 'home',
  },
  settings: {
    initialRouteName: 'profile',
  },
};
```

### 4. 非同期ルートの制限に注意

現在、`unstable_settings`は非同期ルートでは機能しません。

```typescript
// ⚠️ 非同期ルートでは機能しない
export const unstable_settings = {
  initialRouteName: 'async-screen', // 機能しない可能性あり
};
```

## 既知の制限事項

### 非同期ルートとの非互換性

**警告**: `unstable_settings`は現在、非同期ルートでは機能しません。

**回避策**：
- 非同期ルートでは、カスタムナビゲーションロジックを使用してください
- `useEffect`と`useRouter`で初期ルートを手動設定してください

```typescript
// app/_layout.tsx
import { useEffect } from 'react';
import { useRouter, usePathname } from 'expo-router';

export default function RootLayout() {
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // 手動で初期ルートを設定
    if (pathname !== '/' && !router.canGoBack()) {
      // 戻るボタンのために履歴にindexを追加
      router.push('/');
      router.replace(pathname);
    }
  }, [pathname]);

  return <Slot />;
}
```

## デバッグとトラブルシューティング

### 設定の確認

```typescript
// app/_layout.tsx
export const unstable_settings = {
  initialRouteName: 'index',
};

// デバッグ用のログ出力
console.log('Router settings:', unstable_settings);
```

### ナビゲーション状態の監視

```typescript
import { useEffect } from 'react';
import { usePathname, useRouter } from 'expo-router';

export default function RootLayout() {
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    console.log('Current path:', pathname);
    console.log('Can go back:', router.canGoBack());
  }, [pathname]);

  return <Slot />;
}
```

## まとめ

Expo Routerの`unstable_settings`は、以下の機能を提供します：

1. **initialRouteName**: スタックのデフォルト画面を設定
2. **ディープリンクサポート**: ディープリンク時に「戻る」ボタンを提供
3. **グループルート対応**: 個別およびネストされたグループに設定可能
4. **無効化オプション**: `initial={false}`で初期ルート動作を無効化

**主な使用例**：
- ディープリンクからのナビゲーション改善
- ユーザー体験の最適化
- 明確な戻り先の提供

**重要な制限**：
- 非同期ルートでは機能しない（現在）
- ディープリンク時のみ適用
- 通常のアプリフローは上書きしない

**安定性**: `unstable_settings`という名前が示すように、この機能は現在開発中です。本番環境での使用には注意が必要です。
