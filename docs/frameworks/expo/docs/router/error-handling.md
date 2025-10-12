# エラーハンドリング

Expo Routerでエラーを処理する方法を学びます。

## エラーハンドリングとは

Expo Routerは、ルーティングエラーとランタイムエラーを処理するための柔軟なメカニズムを提供します。ネイティブアプリには従来の404エラーが存在しないため、独自のエラーハンドリング戦略を実装できます。

## マッチしないルート

### デフォルトの動作

ネイティブアプリには、Webのような伝統的な404エラーがありません。Expo Routerは、マッチしないルートを自動的に処理します。

### カスタムUnmatchedハンドラー

マッチしないルートのハンドラーをカスタマイズできます。

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

### Unmatchedコンポーネント

Expo Routerが提供する`Unmatched`コンポーネントを使用することもできます。

```typescript
// app/+not-found.tsx
import { Unmatched } from 'expo-router';

export default Unmatched;
```

## ルートの優先順位

Expo Routerは、以下の優先順位でルートをマッチングします：

1. **静的ファイル**: `public`ディレクトリ内の静的ファイル
2. **標準および動的ルート**: アプリディレクトリ内のルート
3. **APIルート**: `+api.ts`ファイル
4. **Not-foundルート**: `+not-found.tsx`（404ステータス付き）

### 例

**プロジェクト構造**：
```
app/
├── index.tsx
├── [user].tsx
├── api/
│   └── hello+api.ts
└── +not-found.tsx

public/
└── logo.png
```

**マッチング順序**：
1. `/logo.png` → `public/logo.png`（静的ファイル）
2. `/` → `app/index.tsx`（標準ルート）
3. `/john` → `app/[user].tsx`（動的ルート）
4. `/api/hello` → `app/api/hello+api.ts`（APIルート）
5. `/unknown` → `app/+not-found.tsx`（Not-foundルート）

## エラーバウンダリ

### エラーバウンダリとは

エラーバウンダリは、ルートごとにエラーをキャッチして表示するためのコンポーネントです。

### エラーバウンダリのエクスポート

各ルートで`ErrorBoundary`コンポーネントをエクスポートできます。

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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'red',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
  },
  message: {
    fontSize: 14,
    color: 'white',
    marginTop: 10,
  },
  retryButton: {
    marginTop: 20,
    padding: 10,
    backgroundColor: 'white',
    color: 'red',
    borderRadius: 5,
  },
});

export default function ProfileScreen() {
  // 画面のコンテンツ
  throw new Error('This is a test error');
}
```

### ErrorBoundaryPropsの型

```typescript
interface ErrorBoundaryProps {
  error: Error;
  retry: () => void;
}
```

**プロパティ**：
- `error`: キャッチされたエラーオブジェクト
- `retry`: エラーが発生したコンポーネントを再レンダリングする関数

### ネストされたエラーハンドリング

エラーバウンダリは、ネストされたルートでも機能します。

**プロジェクト構造**：
```
app/
├── _layout.tsx
├── index.tsx
└── (tabs)/
    ├── _layout.tsx
    ├── home.tsx
    └── profile.tsx
```

**ルートレイアウトのエラーバウンダリ**：
```typescript
// app/_layout.tsx
import { ErrorBoundaryProps } from 'expo-router';
import { View, Text } from 'react-native';

export function ErrorBoundary({ error, retry }: ErrorBoundaryProps) {
  return (
    <View style={{ flex: 1, backgroundColor: 'red' }}>
      <Text style={{ color: 'white' }}>App Error: {error.message}</Text>
      <Text onPress={retry}>Try Again?</Text>
    </View>
  );
}

export default function RootLayout() {
  return <Slot />;
}
```

**タブレイアウトのエラーバウンダリ**：
```typescript
// app/(tabs)/_layout.tsx
import { ErrorBoundaryProps } from 'expo-router';
import { View, Text } from 'react-native';

export function ErrorBoundary({ error, retry }: ErrorBoundaryProps) {
  return (
    <View style={{ flex: 1, backgroundColor: 'orange' }}>
      <Text>Tab Error: {error.message}</Text>
      <Text onPress={retry}>Try Again?</Text>
    </View>
  );
}

export default function TabLayout() {
  return <Tabs />;
}
```

## エラーの種類

### ルーティングエラー

**例**: マッチしないルート、無効なパラメータ

**処理方法**: `+not-found.tsx`でカスタマイズ

### ランタイムエラー

**例**: コンポーネント内のエラー、APIエラー

**処理方法**: `ErrorBoundary`コンポーネントでキャッチ

### ネットワークエラー

**例**: API呼び出しの失敗

**処理方法**: `try-catch`ブロックまたは`ErrorBoundary`

```typescript
// app/posts.tsx
import { useState, useEffect } from 'react';
import { View, Text } from 'react-native';

export default function PostsScreen() {
  const [error, setError] = useState(null);
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    fetch('https://api.example.com/posts')
      .then((res) => res.json())
      .then(setPosts)
      .catch(setError);
  }, []);

  if (error) {
    throw error; // ErrorBoundaryでキャッチ
  }

  return (
    <View>
      {posts.map((post) => (
        <Text key={post.id}>{post.title}</Text>
      ))}
    </View>
  );
}

export function ErrorBoundary({ error, retry }: ErrorBoundaryProps) {
  return (
    <View>
      <Text>Failed to load posts: {error.message}</Text>
      <Text onPress={retry}>Retry</Text>
    </View>
  );
}
```

## ベストプラクティス

### 1. 明確なエラーメッセージ

ユーザーに何が問題なのかを明確に伝えてください。

```typescript
export function ErrorBoundary({ error, retry }: ErrorBoundaryProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Oops! Something went wrong</Text>
      <Text style={styles.message}>
        We encountered an error while loading this page.
      </Text>
      <Text style={styles.detail}>{error.message}</Text>
      <Button title="Try Again" onPress={retry} />
    </View>
  );
}
```

### 2. 再試行オプションの提供

エラーが発生した場合は、ユーザーに再試行のオプションを提供してください。

```typescript
export function ErrorBoundary({ error, retry }: ErrorBoundaryProps) {
  return (
    <View>
      <Text>{error.message}</Text>
      <Button title="Retry" onPress={retry} />
      <Button title="Go Home" onPress={() => router.push('/')} />
    </View>
  );
}
```

### 3. エラーログの記録

エラーをログに記録して、問題の追跡と修正を支援してください。

```typescript
import * as Sentry from '@sentry/react-native';

export function ErrorBoundary({ error, retry }: ErrorBoundaryProps) {
  // エラーをSentryに送信
  Sentry.captureException(error);

  return (
    <View>
      <Text>An error occurred</Text>
      <Text>{error.message}</Text>
      <Button title="Retry" onPress={retry} />
    </View>
  );
}
```

### 4. カスタムエラー画面のデザイン

エラー画面をアプリのデザインと一致させてください。

```typescript
export function ErrorBoundary({ error, retry }: ErrorBoundaryProps) {
  return (
    <View style={styles.container}>
      <Image source={require('../assets/error-icon.png')} style={styles.icon} />
      <Text style={styles.title}>Oops!</Text>
      <Text style={styles.message}>Something went wrong.</Text>
      <Button title="Try Again" onPress={retry} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f5f5f5',
  },
  icon: {
    width: 100,
    height: 100,
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  message: {
    fontSize: 16,
    color: '#666',
    marginBottom: 20,
  },
});
```

## 既知の制限事項

### React Native LogBox

**問題**: React Native LogBoxが現在、エラーを過度に表示します。

**影響**: 開発中にエラーが過度に表示される可能性があります。

**回避策**:
- エラーバウンダリを適切に設定する
- 本番ビルドではLogBoxは無効化されます

## まとめ

Expo Routerのエラーハンドリングは、以下の特徴があります：

1. **柔軟なエラーハンドリング**: ルートレベルとコンポーネントレベル
2. **カスタマイズ可能**: エラー画面とメッセージをカスタマイズ
3. **ネストされたサポート**: 階層的なエラーハンドリング
4. **再試行機能**: ユーザーに再試行オプションを提供

**主な機能**：
- Not-foundルートのカスタマイズ
- ErrorBoundaryコンポーネント
- ネストされたエラーハンドリング
- 再試行メカニズム

**ベストプラクティス**：
- 明確なエラーメッセージを提供
- 再試行オプションを常に提供
- エラーをログに記録
- カスタムエラー画面をデザイン

これらの機能を活用して、ユーザーフレンドリーで堅牢なエラーハンドリングを実装できます。
