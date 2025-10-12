# 認証

Expo Routerで認証を実装する方法を学びます。

## 認証アプローチ

Expo Routerでは、ランタイムロジックを使用して、認証状態に基づいてユーザーをリダイレクトします。

### 必要なバージョン

- **Expo SDK 53以降**

### クライアントサイド認証

この実装は、クライアントサイドの認証保護を提供します。

**重要**: すべてのルートは初期状態でアクセス可能です。ランタイムロジックがルート保護を処理します。

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
          // セッショントークンを保存
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

### 3. スプラッシュスクリーンの管理

認証状態が読み込まれるまで、スプラッシュスクリーンを表示します。

```typescript
// utils/SplashScreenController.tsx
import { SplashScreen } from 'expo-router';
import { useEffect } from 'react';

export function SplashScreenController({ isLoading }: { isLoading: boolean }) {
  useEffect(() => {
    if (!isLoading) {
      SplashScreen.hideAsync();
    }
  }, [isLoading]);

  return null;
}

// app/_layout.tsx で使用
import { SplashScreen } from 'expo-router';

// スプラッシュスクリーンを自動的に非表示にしない
SplashScreen.preventAutoHideAsync();
```

### 4. ルートレイアウトの設定

アプリを`SessionProvider`でラップし、保護されたルートを設定します。

```typescript
// app/_layout.tsx
import { Slot, Stack } from 'expo-router';
import { SessionProvider } from '../context/auth';
import { SplashScreenController } from '../utils/SplashScreenController';
import { useSession } from '../context/auth';

export default function RootLayout() {
  return (
    <SessionProvider>
      <RootLayoutNav />
    </SessionProvider>
  );
}

function RootLayoutNav() {
  const { session, isLoading } = useSession();

  return (
    <>
      <SplashScreenController isLoading={isLoading} />
      <Stack>
        {!session ? (
          <Stack.Screen
            name="sign-in"
            options={{
              title: 'Sign In',
            }}
          />
        ) : (
          <>
            <Stack.Screen
              name="(app)"
              options={{
                headerShown: false,
              }}
            />
          </>
        )}
      </Stack>
    </>
  );
}
```

### 5. サインイン画面の作成

```typescript
// app/sign-in.tsx
import { router } from 'expo-router';
import { Text, View, TextInput, Button } from 'react-native';
import { useSession } from '../context/auth';
import React from 'react';

export default function SignIn() {
  const { signIn } = useSession();
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');

  const handleSignIn = async () => {
    // ここで認証APIを呼び出す
    const token = await authenticateUser(email, password);
    signIn(token);
    router.replace('/');
  };

  return (
    <View style={{ flex: 1, justifyContent: 'center', padding: 20 }}>
      <Text style={{ fontSize: 24, marginBottom: 20 }}>Sign In</Text>
      <TextInput
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        style={{ borderWidth: 1, padding: 10, marginBottom: 10 }}
      />
      <TextInput
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        style={{ borderWidth: 1, padding: 10, marginBottom: 10 }}
      />
      <Button title="Sign In" onPress={handleSignIn} />
    </View>
  );
}

async function authenticateUser(email: string, password: string): Promise<string> {
  // APIリクエストを実装
  const response = await fetch('https://api.example.com/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
  const data = await response.json();
  return data.token;
}
```

### 6. 保護されたルートの作成

```typescript
// app/(app)/_layout.tsx
import { Stack } from 'expo-router';

export default function AppLayout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ title: 'Home' }} />
      <Stack.Screen name="profile" options={{ title: 'Profile' }} />
    </Stack>
  );
}

// app/(app)/index.tsx
import { Text, View, Button } from 'react-native';
import { useSession } from '../../context/auth';
import { router } from 'expo-router';

export default function Home() {
  const { signOut } = useSession();

  const handleSignOut = () => {
    signOut();
    router.replace('/sign-in');
  };

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Welcome to the protected area!</Text>
      <Button title="Sign Out" onPress={handleSignOut} />
    </View>
  );
}
```

## プロジェクト構造

```
app/
├── _layout.tsx         # ルートレイアウト
├── sign-in.tsx         # サインイン画面
└── (app)/
    ├── _layout.tsx     # 認証済みルートのレイアウト
    ├── index.tsx       # 保護されたホーム画面
    └── profile.tsx     # 保護されたプロフィール画面

context/
├── auth.tsx            # 認証コンテキスト
└── useStorageState.ts  # ストレージフック

utils/
└── SplashScreenController.tsx
```

## モーダル認証パターン

モーダルとして認証画面を表示する代替パターンです。

```typescript
// app/_layout.tsx
import { Stack } from 'expo-router';

export default function RootLayout() {
  return (
    <SessionProvider>
      <Stack>
        <Stack.Screen name="(app)" options={{ headerShown: false }} />
        <Stack.Screen
          name="sign-in"
          options={{
            presentation: 'modal',
            title: 'Sign In',
          }}
        />
      </Stack>
    </SessionProvider>
  );
}

// app/(app)/_layout.tsx
import { Redirect, Stack } from 'expo-router';
import { useSession } from '../../context/auth';

export default function AppLayout() {
  const { session, isLoading } = useSession();

  if (isLoading) {
    return <Text>Loading...</Text>;
  }

  if (!session) {
    return <Redirect href="/sign-in" />;
  }

  return (
    <Stack>
      <Stack.Screen name="index" options={{ title: 'Home' }} />
    </Stack>
  );
}
```

## 条件付きルート表示

認証状態に基づいて、ルートを条件付きで表示します。

```typescript
// app/_layout.tsx
import { Stack } from 'expo-router';
import { useSession } from '../context/auth';

export default function RootLayout() {
  const { session } = useSession();

  return (
    <SessionProvider>
      <Stack>
        {session ? (
          <>
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            <Stack.Screen name="modal" options={{ presentation: 'modal' }} />
          </>
        ) : (
          <>
            <Stack.Screen name="sign-in" />
            <Stack.Screen name="sign-up" />
          </>
        )}
      </Stack>
    </SessionProvider>
  );
}
```

## サーバーサイド認証

現在、サーバーサイドミドルウェアはサポートされていません。

**制限事項**：
- Web認証はクライアントサイドリダイレクトに依存
- すべてのルートは初期状態でアクセス可能
- ランタイムロジックが保護を処理

## ベストプラクティス

### 1. セキュアストレージの使用

モバイルでは`expo-secure-store`、Webでは`localStorage`を使用します。

### 2. トークンの検証

トークンの有効期限を確認し、必要に応じてリフレッシュします。

```typescript
export function SessionProvider(props: React.PropsWithChildren) {
  const [[isLoading, session], setSession] = useStorageState('session');

  React.useEffect(() => {
    if (session) {
      // トークンの有効性を確認
      validateToken(session).then(isValid => {
        if (!isValid) {
          setSession(null);
        }
      });
    }
  }, [session]);

  // ...
}
```

### 3. エラーハンドリング

認証エラーを適切に処理します。

```typescript
const handleSignIn = async () => {
  try {
    const token = await authenticateUser(email, password);
    signIn(token);
    router.replace('/');
  } catch (error) {
    Alert.alert('Error', 'Invalid email or password');
  }
};
```

### 4. ローディング状態

認証状態の読み込み中は、適切なローディング表示を提供します。

```typescript
if (isLoading) {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <ActivityIndicator size="large" />
    </View>
  );
}
```

## まとめ

Expo Routerの認証実装は、以下の特徴があります：

1. **クライアントサイド保護**: ランタイムロジックでルートを保護
2. **セキュアストレージ**: プラットフォーム間でトークンを安全に保存
3. **柔軟な実装**: 標準とモーダルパターンをサポート
4. **スプラッシュスクリーン管理**: 認証状態の読み込み中に表示
5. **条件付きルート**: 認証状態に基づいてルートを表示

これらの実装パターンを活用して、セキュアで使いやすい認証システムを構築できます。
