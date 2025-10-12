# 保護されたルート

Expo Routerで保護されたルートを実装する方法を学びます。

## 保護されたルートとは

保護されたルートは、クライアントサイドナビゲーションを通じて、ユーザーが特定の画面にアクセスするのを防ぎます。

### 必要なバージョン

- **Expo SDK 53以降**

### 動作

ユーザーが保護されたルートにアクセスしようとすると、アンカールート（通常は`index`）にリダイレクトされます。

## 基本的な使用方法

### プロジェクト構造

```
app/
├── _layout.tsx
├── index.tsx
├── login.tsx
└── private.tsx
```

### レイアウトでの保護

```typescript
// app/_layout.tsx
import { Stack } from 'expo-router';
import { useAuth } from '@/hooks/useAuth';

export default function RootLayout() {
  const { isLoggedIn } = useAuth();

  return (
    <Stack>
      <Stack.Protected guard={!isLoggedIn}>
        <Stack.Screen name="login" options={{ title: 'Login' }} />
      </Stack.Protected>

      <Stack.Protected guard={isLoggedIn}>
        <Stack.Screen name="private" options={{ title: 'Private' }} />
        <Stack.Screen name="profile" options={{ title: 'Profile' }} />
      </Stack.Protected>

      <Stack.Screen name="index" options={{ title: 'Home' }} />
    </Stack>
  );
}
```

### 認証フックの例

```typescript
// hooks/useAuth.ts
import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export function useAuth() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const token = await AsyncStorage.getItem('auth_token');
      setIsLoggedIn(!!token);
    } catch (error) {
      setIsLoggedIn(false);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (token: string) => {
    await AsyncStorage.setItem('auth_token', token);
    setIsLoggedIn(true);
  };

  const logout = async () => {
    await AsyncStorage.removeItem('auth_token');
    setIsLoggedIn(false);
  };

  return { isLoggedIn, isLoading, login, logout };
}
```

## ネストされた保護

階層的なアクセス制御を実装できます。

### プロジェクト構造

```
app/
├── _layout.tsx
├── index.tsx
├── login.tsx
├── private.tsx
└── admin.tsx
```

### 複数レベルの保護

```typescript
// app/_layout.tsx
import { Stack } from 'expo-router';
import { useAuth } from '@/hooks/useAuth';

export default function RootLayout() {
  const { isLoggedIn, isAdmin } = useAuth();

  return (
    <Stack>
      {/* 未認証ユーザー用 */}
      <Stack.Protected guard={!isLoggedIn}>
        <Stack.Screen name="login" options={{ title: 'Login' }} />
      </Stack.Protected>

      {/* 認証済みユーザー用 */}
      <Stack.Protected guard={isLoggedIn}>
        <Stack.Screen name="private" options={{ title: 'Private' }} />

        {/* 管理者用 */}
        <Stack.Protected guard={isAdmin}>
          <Stack.Screen name="admin" options={{ title: 'Admin' }} />
        </Stack.Protected>
      </Stack.Protected>

      {/* 公開ルート */}
      <Stack.Screen name="index" options={{ title: 'Home' }} />
    </Stack>
  );
}
```

### 認証フックの拡張

```typescript
// hooks/useAuth.ts
export function useAuth() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const token = await AsyncStorage.getItem('auth_token');
      const role = await AsyncStorage.getItem('user_role');
      setIsLoggedIn(!!token);
      setIsAdmin(role === 'admin');
    } catch (error) {
      setIsLoggedIn(false);
      setIsAdmin(false);
    } finally {
      setIsLoading(false);
    }
  };

  return { isLoggedIn, isAdmin, isLoading, login, logout };
}
```

## サポートされているナビゲーター

保護されたルートは、以下のナビゲーターでサポートされています：

### Stack

```typescript
<Stack>
  <Stack.Protected guard={isLoggedIn}>
    <Stack.Screen name="private" />
  </Stack.Protected>
</Stack>
```

### Tabs

```typescript
<Tabs>
  <Tabs.Protected guard={isLoggedIn}>
    <Tabs.Screen name="profile" />
  </Tabs.Protected>
</Tabs>
```

### Drawer

```typescript
<Drawer>
  <Drawer.Protected guard={isLoggedIn}>
    <Drawer.Screen name="settings" />
  </Drawer.Protected>
</Drawer>
```

### カスタムナビゲーター

カスタムナビゲーターでも使用できます。

## 重要な考慮事項

### 画面の重複禁止

画面は、1つのアクティブなルートグループにのみ存在できます。

**NG（画面の重複）**：
```typescript
<Stack>
  <Stack.Protected guard={!isLoggedIn}>
    <Stack.Screen name="private" />  {/* NG: 重複 */}
  </Stack.Protected>

  <Stack.Protected guard={isLoggedIn}>
    <Stack.Screen name="private" />  {/* NG: 重複 */}
  </Stack.Protected>
</Stack>
```

**OK（条件付きグループ）**：
```typescript
<Stack>
  {!isLoggedIn ? (
    <Stack.Protected guard={!isLoggedIn}>
      <Stack.Screen name="login" />
    </Stack.Protected>
  ) : (
    <Stack.Protected guard={isLoggedIn}>
      <Stack.Screen name="private" />
    </Stack.Protected>
  )}
</Stack>
```

### クライアントサイドのみの保護

保護されたルートは、クライアントサイドのナビゲーション保護のみを提供します。

**制限事項**：
- サーバーサイド認証の代替ではありません
- APIリクエストには、常に認証トークンが必要です
- 直接URLアクセスは防げません

### 静的レンダリング

保護されたルートでは、静的サイト生成中にHTMLファイルが生成されません。

**影響**：
- ユーザーは、直接URLリクエストで保護されたルートにアクセスできる可能性があります
- サーバーサイドでの追加認証が必要です

## フォールバック画面の設定

アクセスが拒否された場合のフォールバック画面を設定できます。

### カスタムフォールバック

```typescript
<Stack>
  <Stack.Protected
    guard={isLoggedIn}
    fallback={<UnauthorizedScreen />}
  >
    <Stack.Screen name="private" />
  </Stack.Protected>
</Stack>

function UnauthorizedScreen() {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>You are not authorized to access this page.</Text>
      <Button title="Login" onPress={() => router.push('/login')} />
    </View>
  );
}
```

## ローディング状態の処理

認証チェック中のローディング状態を適切に処理します。

```typescript
// app/_layout.tsx
import { Stack } from 'expo-router';
import { useAuth } from '@/hooks/useAuth';
import { ActivityIndicator, View } from 'react-native';

export default function RootLayout() {
  const { isLoggedIn, isLoading } = useAuth();

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <Stack>
      <Stack.Protected guard={!isLoggedIn}>
        <Stack.Screen name="login" />
      </Stack.Protected>

      <Stack.Protected guard={isLoggedIn}>
        <Stack.Screen name="private" />
      </Stack.Protected>

      <Stack.Screen name="index" />
    </Stack>
  );
}
```

## 完全な実装例

### プロジェクト構造

```
app/
├── _layout.tsx
├── index.tsx
├── login.tsx
├── (protected)/
│   ├── _layout.tsx
│   ├── home.tsx
│   ├── profile.tsx
│   └── settings.tsx
└── (admin)/
    ├── _layout.tsx
    ├── dashboard.tsx
    └── users.tsx

hooks/
└── useAuth.ts
```

### ルートレイアウト

```typescript
// app/_layout.tsx
import { Stack } from 'expo-router';
import { useAuth } from '@/hooks/useAuth';
import { LoadingScreen } from '@/components/LoadingScreen';

export default function RootLayout() {
  const { isLoggedIn, isAdmin, isLoading } = useAuth();

  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <Stack>
      {/* 公開ルート */}
      <Stack.Screen name="index" options={{ title: 'Home' }} />

      {/* ログインページ */}
      <Stack.Protected guard={!isLoggedIn}>
        <Stack.Screen name="login" options={{ title: 'Login' }} />
      </Stack.Protected>

      {/* 保護されたルート */}
      <Stack.Protected guard={isLoggedIn}>
        <Stack.Screen
          name="(protected)"
          options={{ headerShown: false }}
        />

        {/* 管理者ルート */}
        <Stack.Protected guard={isAdmin}>
          <Stack.Screen
            name="(admin)"
            options={{ headerShown: false }}
          />
        </Stack.Protected>
      </Stack.Protected>
    </Stack>
  );
}
```

## ベストプラクティス

### 1. 条件付きグループの使用

画面の重複を避けるため、条件付きグループを使用してください。

### 2. サーバーサイド認証の実装

クライアントサイドの保護に加えて、サーバーサイド認証を実装してください。

### 3. ローディング状態の提供

認証チェック中は、常にローディング状態を表示してください。

### 4. 明確なフォールバック

アクセスが拒否された場合の明確なフォールバックを提供してください。

### 5. 包括的な認証ロジック

すべてのアクセスポイントで認証ロジックを実装してください。

## まとめ

Expo Routerの保護されたルートは、以下の特徴があります：

1. **クライアントサイド保護**: ナビゲーションを通じたアクセス制御
2. **ネストされた保護**: 階層的なアクセス制御
3. **複数のナビゲーターサポート**: Stack、Tabs、Drawer
4. **柔軟な実装**: 条件付きグループとフォールバック

**重要な制限事項**：
- クライアントサイドのみの保護
- サーバーサイド認証の代替ではない
- 静的レンダリングではHTMLファイルが生成されない

これらの機能を活用して、セキュアで使いやすい認証システムを構築できます。ただし、サーバーサイド認証と組み合わせて使用することが重要です。
