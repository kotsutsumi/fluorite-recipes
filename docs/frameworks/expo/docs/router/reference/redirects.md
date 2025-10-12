# リダイレクト

Expo Routerでリダイレクトを実装する方法を学びます。

## リダイレクトとは

リダイレクトは、ユーザーをあるルートから別のルートに自動的に移動させる機能です。認証、権限チェック、URLの変更などに使用されます。

## リダイレクトの実装方法

Expo Routerでは、2つの主要な方法でリダイレクトを実装できます。

### 1. Redirectコンポーネント

宣言的にリダイレクトを実装します。

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

### 2. useRouterフック

命令的にリダイレクトを実装します。

```typescript
import { useRouter, useFocusEffect } from 'expo-router';

export default function MyScreen() {
  const router = useRouter();

  useFocusEffect(() => {
    // 履歴に追加せずにリダイレクト
    router.replace('/profile/settings');
  });

  return <Text>My Screen</Text>;
}
```

## 条件付きリダイレクト

### 認証ベースのリダイレクト

```typescript
import { Redirect } from 'expo-router';
import { useAuth } from '@/hooks/useAuth';

export default function ProtectedScreen() {
  const { user, isLoading } = useAuth();

  // ローディング中はローディング画面を表示
  if (isLoading) {
    return <LoadingScreen />;
  }

  // 未認証ユーザーをログインページにリダイレクト
  if (!user) {
    return <Redirect href="/login" />;
  }

  return (
    <View>
      <Text>Protected Content</Text>
    </View>
  );
}
```

### 権限ベースのリダイレクト

```typescript
import { Redirect } from 'expo-router';
import { useAuth } from '@/hooks/useAuth';

export default function AdminScreen() {
  const { user } = useAuth();

  if (!user) {
    return <Redirect href="/login" />;
  }

  if (!user.isAdmin) {
    return <Redirect href="/unauthorized" />;
  }

  return (
    <View>
      <Text>Admin Panel</Text>
    </View>
  );
}
```

### オンボーディングリダイレクト

```typescript
import { Redirect } from 'expo-router';
import { useOnboarding } from '@/hooks/useOnboarding';

export default function HomeScreen() {
  const { hasCompletedOnboarding } = useOnboarding();

  if (!hasCompletedOnboarding) {
    return <Redirect href="/onboarding" />;
  }

  return (
    <View>
      <Text>Home Screen</Text>
    </View>
  );
}
```

## useRouterフックを使用したリダイレクト

### router.push()

履歴に追加してナビゲートします。

```typescript
import { useRouter } from 'expo-router';

export default function Screen() {
  const router = useRouter();

  const handleLogin = () => {
    // ログイン後にダッシュボードへ
    router.push('/dashboard');
  };

  return <Button title="Login" onPress={handleLogin} />;
}
```

### router.replace()

履歴に追加せずにナビゲートします（リダイレクトに適しています）。

```typescript
import { useRouter } from 'expo-router';

export default function Screen() {
  const router = useRouter();

  const handleLogout = () => {
    // ログアウト後、戻るボタンで戻れないようにする
    router.replace('/login');
  };

  return <Button title="Logout" onPress={handleLogout} />;
}
```

### router.back()

前の画面に戻ります。

```typescript
import { useRouter } from 'expo-router';

export default function Screen() {
  const router = useRouter();

  return <Button title="Go Back" onPress={() => router.back()} />;
}
```

## useFocusEffectを使用したリダイレクト

### 画面フォーカス時のリダイレクト

```typescript
import { useRouter, useFocusEffect } from 'expo-router';
import { useCallback } from 'react';

export default function Screen() {
  const router = useRouter();
  const { isSubscribed } = useSubscription();

  useFocusEffect(
    useCallback(() => {
      if (!isSubscribed) {
        router.replace('/subscribe');
      }
    }, [isSubscribed])
  );

  return <Text>Premium Content</Text>;
}
```

### 条件付きリダイレクト

```typescript
import { useRouter, useFocusEffect } from 'expo-router';
import { useCallback } from 'react';

export default function ProfileScreen() {
  const router = useRouter();
  const { hasProfileData } = useProfile();

  useFocusEffect(
    useCallback(() => {
      if (!hasProfileData) {
        router.replace('/profile/edit');
      }
    }, [hasProfileData])
  );

  return <Text>Profile Screen</Text>;
}
```

## リダイレクトパターン

### パターン1: 認証フロー

```typescript
// app/(auth)/login.tsx
import { useRouter } from 'expo-router';

export default function LoginScreen() {
  const router = useRouter();

  const handleLogin = async (credentials) => {
    await login(credentials);
    router.replace('/(tabs)/home');
  };

  return <LoginForm onSubmit={handleLogin} />;
}

// app/(tabs)/home.tsx
import { Redirect } from 'expo-router';
import { useAuth } from '@/hooks/useAuth';

export default function HomeScreen() {
  const { user } = useAuth();

  if (!user) {
    return <Redirect href="/(auth)/login" />;
  }

  return <Text>Welcome, {user.name}!</Text>;
}
```

### パターン2: ロール制御

```typescript
// app/admin/_layout.tsx
import { Redirect } from 'expo-router';
import { useAuth } from '@/hooks/useAuth';

export default function AdminLayout() {
  const { user } = useAuth();

  if (!user) {
    return <Redirect href="/login" />;
  }

  if (user.role !== 'admin') {
    return <Redirect href="/unauthorized" />;
  }

  return <Slot />;
}
```

### パターン3: フィーチャーフラグ

```typescript
import { Redirect } from 'expo-router';
import { useFeatureFlag } from '@/hooks/useFeatureFlag';

export default function BetaFeatureScreen() {
  const { isEnabled } = useFeatureFlag('beta_feature');

  if (!isEnabled) {
    return <Redirect href="/" />;
  }

  return <Text>Beta Feature</Text>;
}
```

## リダイレクトとパラメータ

### パラメータ付きリダイレクト

```typescript
import { Redirect } from 'expo-router';

export default function Screen() {
  const redirectTo = '/profile?tab=settings';

  return <Redirect href={redirectTo} />;
}
```

### 動的パラメータ

```typescript
import { Redirect } from 'expo-router';
import { useLocalSearchParams } from 'expo-router';

export default function Screen() {
  const { returnUrl } = useLocalSearchParams<{ returnUrl?: string }>();

  if (!user) {
    return <Redirect href={`/login?returnUrl=${returnUrl || '/'}`} />;
  }

  return <Text>Content</Text>;
}
```

## ベストプラクティス

### 1. router.replace()をリダイレクトに使用

履歴に追加しないことで、戻るボタンの動作を最適化します。

```typescript
// ✅ 推奨（リダイレクト）
router.replace('/login');

// ⚠️ 非推奨（通常のナビゲーション）
router.push('/login');
```

### 2. ローディング状態の処理

リダイレクト前にローディング状態を表示します。

```typescript
export default function Screen() {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return <LoadingScreen />;
  }

  if (!user) {
    return <Redirect href="/login" />;
  }

  return <Text>Content</Text>;
}
```

### 3. レイアウトでのリダイレクト

グループ全体を保護する場合は、レイアウトでリダイレクトします。

```typescript
// app/(protected)/_layout.tsx
import { Redirect, Slot } from 'expo-router';
import { useAuth } from '@/hooks/useAuth';

export default function ProtectedLayout() {
  const { user } = useAuth();

  if (!user) {
    return <Redirect href="/login" />;
  }

  return <Slot />;
}
```

### 4. リダイレクトループの回避

無限ループを防ぐために、条件を慎重に設定します。

```typescript
// ❌ リダイレクトループの可能性
export default function Screen() {
  return <Redirect href="/screen" />; // 自分自身へのリダイレクト
}

// ✅ 条件付きリダイレクト
export default function Screen() {
  const { user } = useAuth();

  if (!user) {
    return <Redirect href="/login" />;
  }

  return <Text>Content</Text>;
}
```

### 5. リダイレクト理由の記録

デバッグのためにリダイレクト理由を記録します。

```typescript
import { Redirect } from 'expo-router';

export default function Screen() {
  const { user } = useAuth();

  if (!user) {
    console.log('Redirecting to login: User not authenticated');
    return <Redirect href="/login" />;
  }

  if (!user.isVerified) {
    console.log('Redirecting to verification: User not verified');
    return <Redirect href="/verify-email" />;
  }

  return <Text>Content</Text>;
}
```

## まとめ

Expo Routerのリダイレクトは、以下の特徴があります：

1. **2つの実装方法**: RedirectコンポーネントとuseRouterフック
2. **柔軟な条件付きリダイレクト**: 認証、権限、フィーチャーフラグ
3. **useFocusEffectとの統合**: 画面フォーカス時のリダイレクト
4. **パラメータサポート**: 動的パラメータ付きリダイレクト

**主な使用例**：
- 認証フロー
- 権限チェック
- オンボーディング
- フィーチャーフラグ

**ベストプラクティス**：
- router.replace()をリダイレクトに使用
- ローディング状態の処理
- レイアウトでのグループ保護
- リダイレクトループの回避
- リダイレクト理由の記録

これらの機能を活用して、柔軟で堅牢なリダイレクトを実装できます。
