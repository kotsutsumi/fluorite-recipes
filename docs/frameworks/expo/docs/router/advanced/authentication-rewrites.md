# 認証とリライト

Expo Routerで認証とリライトを使用する方法を学びます。

## リライトを使用した認証

リライトは、React ContextとRoute Groupsを使用して、認証状態に基づいてユーザーをリダイレクトする高度な認証パターンです。

## 実装手順

### 1. 認証コンテキストの作成

認証状態を管理するReact Contextプロバイダーを作成します。

```typescript
// context/auth.tsx
import React from 'react';
import { useStorageState } from './useStorageState';

const AuthContext = React.createContext<{
  signIn: (token: string) => void;
  signOut: () => void;
  session?: string | null;
  isLoading: boolean;
}>({
  signIn: () => null,
  signOut: () => null,
  session: null,
  isLoading: false,
});

export function useSession() {
  const value = React.useContext(AuthContext);
  if (process.env.NODE_ENV !== 'production') {
    if (!value) {
      throw new Error('useSession must be wrapped in a <SessionProvider />');
    }
  }

  return value;
}

export function SessionProvider(props: React.PropsWithChildren) {
  const [[isLoading, session], setSession] = useStorageState('session');

  return (
    <AuthContext.Provider
      value={{
        signIn: (token: string) => {
          setSession(token);
        },
        signOut: () => {
          setSession(null);
        },
        session,
        isLoading,
      }}
    >
      {props.children}
    </AuthContext.Provider>
  );
}
```

### 2. useStorageStateフックの作成

プラットフォーム間でトークンを安全に保存するフックを作成します。

```typescript
// context/useStorageState.ts
import * as SecureStore from 'expo-secure-store';
import * as React from 'react';
import { Platform } from 'react-native';

type UseStateHook<T> = [[boolean, T | null], (value: T | null) => void];

function useAsyncState<T>(
  initialValue: [boolean, T | null] = [true, null],
): UseStateHook<T> {
  return React.useReducer(
    (state: [boolean, T | null], action: T | null = null): [boolean, T | null] => [false, action],
    initialValue
  ) as UseStateHook<T>;
}

export async function setStorageItemAsync(key: string, value: string | null) {
  if (Platform.OS === 'web') {
    try {
      if (value === null) {
        localStorage.removeItem(key);
      } else {
        localStorage.setItem(key, value);
      }
    } catch (e) {
      console.error('Local storage is unavailable:', e);
    }
  } else {
    if (value == null) {
      await SecureStore.deleteItemAsync(key);
    } else {
      await SecureStore.setItemAsync(key, value);
    }
  }
}

export function useStorageState(key: string): UseStateHook<string> {
  const [state, setState] = useAsyncState<string>();

  React.useEffect(() => {
    if (Platform.OS === 'web') {
      try {
        if (typeof localStorage !== 'undefined') {
          setState(localStorage.getItem(key));
        }
      } catch (e) {
        console.error('Local storage is unavailable:', e);
      }
    } else {
      SecureStore.getItemAsync(key).then(value => {
        setState(value);
      });
    }
  }, [key]);

  const setValue = React.useCallback(
    (value: string | null) => {
      setState(value);
      setStorageItemAsync(key, value);
    },
    [key]
  );

  return [state, setValue];
}
```

### 3. ルートレイアウトの設定

アプリを`SessionProvider`でラップし、`<Slot />`がナビゲーションイベントの前にマウントされるようにします。

```typescript
// app/_layout.tsx
import { Slot } from 'expo-router';
import { SessionProvider } from '../context/auth';

export default function RootLayout() {
  return (
    <SessionProvider>
      <Slot />
    </SessionProvider>
  );
}
```

**重要**: `<Slot />`は、ナビゲーションイベントの前にマウントされる必要があります。

### 4. 保護されたルートレイアウトの作成

認証をチェックし、未認証ユーザーをリダイレクトするネストされたレイアウトを作成します。

```typescript
// app/(app)/_layout.tsx
import { Redirect, Stack } from 'expo-router';
import { useSession } from '../../context/auth';
import { ActivityIndicator, View } from 'react-native';

export default function AppLayout() {
  const { session, isLoading } = useSession();

  // 認証状態が読み込まれるまでローディング表示
  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  // 未認証の場合は、サインイン画面にリダイレクト
  if (!session) {
    return <Redirect href="/sign-in" />;
  }

  return (
    <Stack>
      <Stack.Screen name="index" options={{ title: 'Home' }} />
      <Stack.Screen name="profile" options={{ title: 'Profile' }} />
    </Stack>
  );
}
```

### 5. サインイン画面の作成

```typescript
// app/sign-in.tsx
import { router } from 'expo-router';
import { Text, View, TextInput, Button, StyleSheet } from 'react-native';
import { useSession } from '../context/auth';
import React from 'react';

export default function SignIn() {
  const { signIn } = useSession();
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [error, setError] = React.useState('');

  const handleSignIn = async () => {
    try {
      // 認証APIを呼び出す
      const token = await authenticateUser(email, password);
      signIn(token);
      router.replace('/');
    } catch (e) {
      setError('Invalid email or password');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Sign In</Text>
      {error ? <Text style={styles.error}>{error}</Text> : null}
      <TextInput
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        style={styles.input}
        autoCapitalize="none"
        keyboardType="email-address"
      />
      <TextInput
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        style={styles.input}
      />
      <Button title="Sign In" onPress={handleSignIn} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 10,
    marginBottom: 10,
    borderRadius: 5,
  },
  error: {
    color: 'red',
    marginBottom: 10,
    textAlign: 'center',
  },
});

async function authenticateUser(email: string, password: string): Promise<string> {
  const response = await fetch('https://api.example.com/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });

  if (!response.ok) {
    throw new Error('Authentication failed');
  }

  const data = await response.json();
  return data.token;
}
```

## プロジェクト構造

```
app/
├── _layout.tsx             # ルートレイアウト（SessionProvider）
├── sign-in.tsx             # 公開サインインページ
└── (app)/
    ├── _layout.tsx         # 保護されたルートのレイアウト
    ├── index.tsx           # 認証済みホーム画面
    └── profile.tsx         # 認証済みプロフィール画面

context/
├── auth.tsx                # 認証コンテキスト
└── useStorageState.ts      # ストレージフック
```

## 重要な考慮事項

### ローディング状態の提供

認証チェック中は、常にローディング状態を提供してください。

```typescript
if (isLoading) {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <ActivityIndicator size="large" color="#f4511e" />
      <Text style={{ marginTop: 10 }}>Loading...</Text>
    </View>
  );
}
```

### Route Groupsの使用

Route Groupsを使用して、認証済み/未認証のルートを整理します。

```
app/
├── _layout.tsx
├── (auth)/
│   ├── sign-in.tsx
│   └── sign-up.tsx
└── (app)/
    ├── _layout.tsx
    ├── index.tsx
    └── profile.tsx
```

### Web静的レンダリングの処理

Web静的レンダリングには、クライアントサイド認証処理が必要です。

```typescript
// app/(app)/_layout.tsx
export const unstable_settings = {
  // 静的エクスポートが不要な場合は、この設定を削除
  initialRouteName: 'index',
};
```

## 制限事項

### サーバーサイドミドルウェアの非サポート

現在、サーバーサイドミドルウェアはサポートされていません。

**影響**:
- すべての認証処理はクライアントサイドで行われます
- サーバーサイドレンダリング（SSR）では、追加の対策が必要です

### クライアントサイド認証

認証は完全にクライアントサイドで管理されます。

**推奨事項**:
- APIリクエストには、認証トークンを常に含める
- トークンの有効期限を確認し、必要に応じてリフレッシュ
- セキュアストレージを使用してトークンを保存

## 高度なパターン

### トークンのリフレッシュ

```typescript
export function SessionProvider(props: React.PropsWithChildren) {
  const [[isLoading, session], setSession] = useStorageState('session');

  React.useEffect(() => {
    if (session) {
      // トークンの有効性を確認
      validateAndRefreshToken(session).then(newToken => {
        if (newToken && newToken !== session) {
          setSession(newToken);
        } else if (!newToken) {
          setSession(null);
        }
      });
    }
  }, [session]);

  return (
    <AuthContext.Provider
      value={{
        signIn: (token: string) => setSession(token),
        signOut: () => setSession(null),
        session,
        isLoading,
      }}
    >
      {props.children}
    </AuthContext.Provider>
  );
}

async function validateAndRefreshToken(token: string): Promise<string | null> {
  try {
    const response = await fetch('https://api.example.com/auth/refresh', {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (response.ok) {
      const data = await response.json();
      return data.token;
    }
    return null;
  } catch (error) {
    return null;
  }
}
```

### 役割ベースのアクセス制御

```typescript
// context/auth.tsx
type UserRole = 'admin' | 'user' | 'guest';

export function SessionProvider(props: React.PropsWithChildren) {
  const [[isLoading, session], setSession] = useStorageState('session');
  const [role, setRole] = React.useState<UserRole>('guest');

  React.useEffect(() => {
    if (session) {
      // セッションから役割を取得
      fetchUserRole(session).then(setRole);
    } else {
      setRole('guest');
    }
  }, [session]);

  return (
    <AuthContext.Provider
      value={{
        signIn: (token: string) => setSession(token),
        signOut: () => setSession(null),
        session,
        role,
        isLoading,
      }}
    >
      {props.children}
    </AuthContext.Provider>
  );
}

// app/(app)/_layout.tsx
export default function AppLayout() {
  const { session, role, isLoading } = useSession();

  if (isLoading) {
    return <LoadingScreen />;
  }

  if (!session) {
    return <Redirect href="/sign-in" />;
  }

  return (
    <Stack>
      <Stack.Screen name="index" />
      {role === 'admin' && (
        <Stack.Screen name="admin" options={{ title: 'Admin' }} />
      )}
    </Stack>
  );
}
```

## ベストプラクティス

### 1. セキュアストレージの使用

トークンは、セキュアストレージに保存してください。

### 2. トークンの検証

トークンの有効期限を常に確認してください。

### 3. エラーハンドリング

認証エラーを適切に処理してください。

### 4. ローディング状態の表示

認証状態の読み込み中は、ローディング表示を提供してください。

### 5. タイムアウトの設定

APIリクエストにタイムアウトを設定してください。

## まとめ

Expo Routerのリライトを使用した認証は、以下の特徴があります：

1. **React Contextベース**: 認証状態を管理
2. **Route Groups**: 認証済み/未認証のルートを整理
3. **クライアントサイドリダイレクト**: 未認証ユーザーをリダイレクト
4. **プラットフォーム間の永続性**: セキュアストレージでトークンを保存
5. **柔軟な実装**: 高度なパターンをサポート

これらの実装パターンを活用して、セキュアで使いやすい認証システムを構築できます。
