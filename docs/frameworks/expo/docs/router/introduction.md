# Expo Routerの紹介

Expo Routerは、Universal React Nativeアプリケーションのためのオープンソースルーティングライブラリです。

## Expo Routerとは

Expo Routerは、Android、iOS、Webプラットフォーム全体でファイルベースのルーティングを提供します。

### 主な特徴

- **ネイティブナビゲーション**: React Navigationで動作
- **自動ディープリンク**: すべての画面に自動的にディープリンクを設定
- **オフラインファースト**: オフラインでも機能
- **遅延評価**: 必要なときにのみコードを読み込み
- **ユニバーサルナビゲーション**: すべてのプラットフォームで統一された構造
- **静的レンダリング**: 検索エンジンでインデックス可能

## ファイルベースルーティングの利点

### 1. シンプルなメンタルモデル

ファイル構造がルーティング構造と一致します。

**例**：

```
app/
├── index.tsx           # ホームページ（/）
├── about.tsx           # Aboutページ（/about）
└── profile/
    ├── index.tsx       # プロフィールページ（/profile）
    └── [id].tsx        # 動的ルート（/profile/:id）
```

### 2. リファクタリングが簡単

ファイルを移動するだけで、ルートが自動的に更新されます。

### 3. 自動ルート型付け

TypeScriptの型が自動生成されます。

### 4. 開発速度の向上

ルーティング設定が不要で、すぐに開発を開始できます。

### 5. シームレスなディープリンク

すべての画面に自動的にディープリンクが設定されます。

### 6. プラットフォーム統合の強化

ネイティブプラットフォームとの統合が向上します。

## コアコンセプト

### ファイルベースルーティング

ファイルシステムの構造が、アプリのルーティング構造を定義します。

**例**：

```typescript
// app/index.tsx
export default function HomeScreen() {
  return <Text>Home Screen</Text>;
}

// app/profile/[id].tsx
import { useLocalSearchParams } from 'expo-router';

export default function ProfileScreen() {
  const { id } = useLocalSearchParams();
  return <Text>Profile {id}</Text>;
}
```

### ナビゲーション

`Link`コンポーネントを使用してナビゲートします：

```typescript
import { Link } from 'expo-router';

export default function HomeScreen() {
  return (
    <View>
      <Link href="/profile/123">Go to Profile</Link>
    </View>
  );
}
```

プログラムでナビゲートする場合：

```typescript
import { router } from 'expo-router';

export default function HomeScreen() {
  return (
    <Button
      title="Go to Profile"
      onPress={() => router.push('/profile/123')}
    />
  );
}
```

### レイアウト

`_layout.tsx`ファイルを使用して、共通のレイアウトを定義します：

```typescript
// app/_layout.tsx
import { Stack } from 'expo-router';

export default function Layout() {
  return <Stack />;
}
```

### 動的ルート

角括弧を使用して、動的ルートを定義します：

```typescript
// app/posts/[id].tsx
import { useLocalSearchParams } from 'expo-router';

export default function PostScreen() {
  const { id } = useLocalSearchParams();
  return <Text>Post {id}</Text>;
}
```

### タブナビゲーション

`_layout.tsx`でタブナビゲーションを定義します：

```typescript
// app/(tabs)/_layout.tsx
import { Tabs } from 'expo-router';

export default function TabLayout() {
  return (
    <Tabs>
      <Tabs.Screen name="index" options={{ title: 'Home' }} />
      <Tabs.Screen name="profile" options={{ title: 'Profile' }} />
    </Tabs>
  );
}
```

## 互換性

### Expo CLI

Expo CLIプロジェクトで動作します。

### 既存のReact Nativeアプリ

既存のReact Nativeアプリに統合できます。

### React Navigation

React Navigationの上に構築されています。

### カスタムナビゲーションライブラリ

カスタムナビゲーションライブラリもサポートしています。

## ユニバーサルリンク

Expo Routerは、すべてのプラットフォームでユニバーサルリンクをサポートします。

### ディープリンク

すべての画面に自動的にディープリンクが設定されます。

**例**：

```
myapp://profile/123
```

### Webリンク

Webプラットフォームでは、通常のURLとして動作します。

**例**：

```
https://myapp.com/profile/123
```

### 共有可能なリンク

アプリのコンテンツへのリンクを簡単に共有できます。

## パフォーマンス最適化

### 遅延評価

必要なときにのみコードを読み込みます。

### 繰り延べバンドル

バンドルを分割して、初期読み込み時間を短縮します。

### 自動ルート最適化

ルートが自動的に最適化されます。

## 開発者エクスペリエンス

### Fast Refresh

コードの変更が即座に反映されます。

### TypeScript統合

ルートの型が自動生成されます。

### デバッグツール

React DevToolsとの統合により、デバッグが簡単になります。

## 次のステップ

### 1. クイックスタート

Expo Routerをインストールして、プロジェクトを開始します。

### 2. Router 101

コアコンセプトを学びます。

### 3. サンプルアプリ

サンプルアプリを確認して、実装を理解します。

### 4. ドキュメント

詳細な実装については、ドキュメントを参照してください。

## サンプルアプリ

### シンプルなナビゲーション

```typescript
// app/index.tsx
import { Link } from 'expo-router';
import { View, Text } from 'react-native';

export default function HomeScreen() {
  return (
    <View>
      <Text>Home Screen</Text>
      <Link href="/about">About</Link>
    </View>
  );
}

// app/about.tsx
export default function AboutScreen() {
  return <Text>About Screen</Text>;
}
```

### 動的ルート

```typescript
// app/posts/index.tsx
import { Link } from 'expo-router';
import { View } from 'react-native';

export default function PostsScreen() {
  return (
    <View>
      <Link href="/posts/1">Post 1</Link>
      <Link href="/posts/2">Post 2</Link>
    </View>
  );
}

// app/posts/[id].tsx
import { useLocalSearchParams } from 'expo-router';
import { Text } from 'react-native';

export default function PostScreen() {
  const { id } = useLocalSearchParams();
  return <Text>Post {id}</Text>;
}
```

### タブナビゲーション

```typescript
// app/(tabs)/_layout.tsx
import { Tabs } from 'expo-router';

export default function TabLayout() {
  return (
    <Tabs>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color }) => <Icon name="home" color={color} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color }) => <Icon name="person" color={color} />,
        }}
      />
    </Tabs>
  );
}
```

## ベストプラクティス

### 1. ファイル構造を整理

論理的なファイル構造を維持してください。

### 2. レイアウトを使用

共通のレイアウトには`_layout.tsx`を使用してください。

### 3. 型安全性を活用

TypeScriptの型を活用してください。

### 4. ディープリンクをテスト

すべての画面でディープリンクをテストしてください。

## まとめ

Expo Routerは、Universal React Nativeアプリケーションのための包括的で開発者フレンドリーなルーティングソリューションです。ファイルベースのルーティング、自動ディープリンク、ユニバーサルリンクのサポートにより、開発速度とユーザーエクスペリエンスを向上させます。
