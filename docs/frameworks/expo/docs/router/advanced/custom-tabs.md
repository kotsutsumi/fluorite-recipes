# カスタムタブ

Expo Routerでカスタムタブレイアウトを実装する方法を学びます。

## カスタムタブとは

Expo Routerは、完全にカスタマイズ可能なタブナビゲーションを作成するための柔軟なコンポーネントを提供します。標準のタブバーではなく、独自のデザインとインタラクションを実装できます。

**実験的機能**: SDK 52以降で実験的に利用可能です。

## 主要なコンポーネント

### Tabs

タブナビゲーションのラッパーコンポーネントです。

### TabList

タブトリガーのコンテナです。

### TabTrigger

個別のタブボタンで、ルートを切り替えます。

### TabSlot

現在選択されているタブコンテンツをレンダリングします。

## 基本的な構造

### プロジェクト構造

```
app/
├── _layout.tsx
├── index.tsx
└── article.tsx
```

### シンプルな実装

```typescript
// app/_layout.tsx
import { Tabs, TabList, TabTrigger, TabSlot } from 'expo-router/ui';
import { Text } from 'react-native';

export default function Layout() {
  return (
    <Tabs>
      <TabSlot />
      <TabList>
        <TabTrigger name="home" href="/">
          <Text>Home</Text>
        </TabTrigger>
        <TabTrigger name="article" href="/article">
          <Text>Article</Text>
        </TabTrigger>
      </TabList>
    </Tabs>
  );
}
```

### タブ画面の作成

```typescript
// app/index.tsx
import { View, Text } from 'react-native';

export default function HomeScreen() {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Home Screen</Text>
    </View>
  );
}

// app/article.tsx
import { View, Text } from 'react-native';

export default function ArticleScreen() {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Article Screen</Text>
    </View>
  );
}
```

## タブのカスタマイズ

### スタイリング

```typescript
import { Tabs, TabList, TabTrigger, TabSlot } from 'expo-router/ui';
import { View, Text, StyleSheet } from 'react-native';

export default function Layout() {
  return (
    <Tabs>
      <TabSlot />
      <TabList style={styles.tabList}>
        <TabTrigger name="home" href="/" style={styles.tab}>
          <Text style={styles.tabText}>Home</Text>
        </TabTrigger>
        <TabTrigger name="article" href="/article" style={styles.tab}>
          <Text style={styles.tabText}>Article</Text>
        </TabTrigger>
      </TabList>
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabList: {
    flexDirection: 'row',
    backgroundColor: '#f5f5f5',
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
  },
  tabText: {
    fontSize: 14,
    fontWeight: '600',
  },
});
```

### アイコン付きタブ

```typescript
import { Tabs, TabList, TabTrigger, TabSlot } from 'expo-router/ui';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function Layout() {
  return (
    <Tabs>
      <TabSlot />
      <TabList style={styles.tabList}>
        <TabTrigger name="home" href="/" style={styles.tab}>
          <Ionicons name="home" size={24} color="#007AFF" />
          <Text style={styles.tabText}>Home</Text>
        </TabTrigger>
        <TabTrigger name="article" href="/article" style={styles.tab}>
          <Ionicons name="document-text" size={24} color="#007AFF" />
          <Text style={styles.tabText}>Article</Text>
        </TabTrigger>
        <TabTrigger name="profile" href="/profile" style={styles.tab}>
          <Ionicons name="person" size={24} color="#007AFF" />
          <Text style={styles.tabText}>Profile</Text>
        </TabTrigger>
      </TabList>
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabList: {
    flexDirection: 'row',
    backgroundColor: '#ffffff',
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  tab: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
  },
  tabText: {
    fontSize: 12,
    marginTop: 4,
    color: '#007AFF',
  },
});
```

## 高度なカスタマイズ

### asChildプロパティ

`asChild`プロパティを使用して、完全にカスタムコンポーネントに置き換えることができます。

```typescript
import { Tabs, TabList, TabTrigger, TabSlot } from 'expo-router/ui';
import { Pressable, Text, StyleSheet } from 'react-native';

function CustomTabButton({ children, ...props }) {
  return (
    <Pressable style={styles.customButton} {...props}>
      {children}
    </Pressable>
  );
}

export default function Layout() {
  return (
    <Tabs>
      <TabSlot />
      <TabList>
        <TabTrigger name="home" href="/" asChild>
          <CustomTabButton>
            <Text>Home</Text>
          </CustomTabButton>
        </TabTrigger>
        <TabTrigger name="article" href="/article" asChild>
          <CustomTabButton>
            <Text>Article</Text>
          </CustomTabButton>
        </TabTrigger>
      </TabList>
    </Tabs>
  );
}

const styles = StyleSheet.create({
  customButton: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    backgroundColor: '#007AFF',
    borderRadius: 8,
    margin: 4,
  },
});
```

### アクティブ状態のカスタマイズ

```typescript
import { Tabs, TabList, TabTrigger, TabSlot } from 'expo-router/ui';
import { Pressable, Text, StyleSheet } from 'react-native';
import { usePathname } from 'expo-router';

function TabButton({ name, href, children }) {
  const pathname = usePathname();
  const isActive = pathname === href;

  return (
    <TabTrigger name={name} href={href} asChild>
      <Pressable style={[styles.tab, isActive && styles.activeTab]}>
        <Text style={[styles.tabText, isActive && styles.activeTabText]}>
          {children}
        </Text>
      </Pressable>
    </TabTrigger>
  );
}

export default function Layout() {
  return (
    <Tabs>
      <TabSlot />
      <TabList style={styles.tabList}>
        <TabButton name="home" href="/">Home</TabButton>
        <TabButton name="article" href="/article">Article</TabButton>
        <TabButton name="profile" href="/profile">Profile</TabButton>
      </TabList>
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabList: {
    flexDirection: 'row',
    backgroundColor: '#ffffff',
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: '#007AFF',
  },
  tabText: {
    fontSize: 14,
    color: '#666',
  },
  activeTabText: {
    color: '#007AFF',
    fontWeight: '600',
  },
});
```

## 動的ルートのサポート

### ネストされたナビゲーション

カスタムタブは、動的ルートとネストされたナビゲーションをサポートしています。

```typescript
// app/_layout.tsx
import { Tabs, TabList, TabTrigger, TabSlot } from 'expo-router/ui';

export default function Layout() {
  return (
    <Tabs>
      <TabSlot />
      <TabList>
        <TabTrigger name="home" href="/">
          <Text>Home</Text>
        </TabTrigger>
        <TabTrigger name="articles" href="/articles">
          <Text>Articles</Text>
        </TabTrigger>
      </TabList>
    </Tabs>
  );
}
```

**プロジェクト構造**：
```
app/
├── _layout.tsx
├── index.tsx
├── articles/
│   ├── _layout.tsx
│   ├── index.tsx
│   └── [id].tsx
```

### resetプロパティ

`reset`プロパティを使用して、ナビゲーション状態をリセットできます。

```typescript
<TabTrigger name="home" href="/" reset="always">
  <Text>Home</Text>
</TabTrigger>
```

**reset値**：
- `"always"`: 常にナビゲーション状態をリセット
- `"onLongPress"`: 長押し時にリセット

## 複数のタブバー

### トップとボトムのタブバー

```typescript
import { Tabs, TabList, TabTrigger, TabSlot } from 'expo-router/ui';
import { View, Text, StyleSheet } from 'react-native';

export default function Layout() {
  return (
    <Tabs>
      {/* トップタブバー */}
      <TabList style={styles.topTabList}>
        <TabTrigger name="home" href="/">
          <Text>Home</Text>
        </TabTrigger>
        <TabTrigger name="search" href="/search">
          <Text>Search</Text>
        </TabTrigger>
      </TabList>

      <TabSlot />

      {/* ボトムタブバー */}
      <TabList style={styles.bottomTabList}>
        <TabTrigger name="profile" href="/profile">
          <Text>Profile</Text>
        </TabTrigger>
        <TabTrigger name="settings" href="/settings">
          <Text>Settings</Text>
        </TabTrigger>
      </TabList>
    </Tabs>
  );
}

const styles = StyleSheet.create({
  topTabList: {
    flexDirection: 'row',
    backgroundColor: '#f5f5f5',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  bottomTabList: {
    flexDirection: 'row',
    backgroundColor: '#ffffff',
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
});
```

## TabList外でのタブトリガー

### 任意の場所にタブトリガーを配置

```typescript
import { Tabs, TabList, TabTrigger, TabSlot } from 'expo-router/ui';
import { View, Text } from 'react-native';

export default function Layout() {
  return (
    <Tabs>
      {/* ヘッダー内のタブトリガー */}
      <View style={{ padding: 16 }}>
        <TabTrigger name="home" href="/">
          <Text>Go to Home</Text>
        </TabTrigger>
      </View>

      <TabSlot />

      <TabList>
        <TabTrigger name="home" href="/">
          <Text>Home</Text>
        </TabTrigger>
        <TabTrigger name="article" href="/article">
          <Text>Article</Text>
        </TabTrigger>
      </TabList>
    </Tabs>
  );
}
```

## カスタムレンダリング

### renderFnプロパティ

画面のレンダリング方法をカスタマイズできます。

```typescript
import { Tabs, TabSlot } from 'expo-router/ui';

export default function Layout() {
  return (
    <Tabs
      renderFn={(children) => (
        <View style={{ flex: 1, backgroundColor: '#f5f5f5' }}>
          {children}
        </View>
      )}
    >
      <TabSlot />
      <TabList>
        {/* タブトリガー */}
      </TabList>
    </Tabs>
  );
}
```

## ベストプラクティス

### 1. アクセシビリティ

タブボタンには適切なアクセシビリティラベルを提供してください。

```typescript
<TabTrigger
  name="home"
  href="/"
  accessibilityLabel="Home Tab"
  accessibilityHint="Navigate to home screen"
>
  <Text>Home</Text>
</TabTrigger>
```

### 2. パフォーマンス

大きなタブバーでは、`useMemo`や`useCallback`を使用して最適化してください。

```typescript
import { useMemo } from 'react';

export default function Layout() {
  const tabs = useMemo(() => [
    { name: 'home', href: '/', label: 'Home' },
    { name: 'article', href: '/article', label: 'Article' },
  ], []);

  return (
    <Tabs>
      <TabSlot />
      <TabList>
        {tabs.map((tab) => (
          <TabTrigger key={tab.name} name={tab.name} href={tab.href}>
            <Text>{tab.label}</Text>
          </TabTrigger>
        ))}
      </TabList>
    </Tabs>
  );
}
```

### 3. 一貫性

アプリ全体で一貫したタブデザインを使用してください。

```typescript
// components/CustomTab.tsx
export function CustomTab({ name, href, icon, label }) {
  return (
    <TabTrigger name={name} href={href} style={styles.tab}>
      <Icon name={icon} size={24} />
      <Text style={styles.label}>{label}</Text>
    </TabTrigger>
  );
}

// app/_layout.tsx
<TabList>
  <CustomTab name="home" href="/" icon="home" label="Home" />
  <CustomTab name="article" href="/article" icon="document" label="Article" />
</TabList>
```

### 4. レスポンシブデザイン

デバイスサイズに応じてタブレイアウトを調整してください。

```typescript
import { useWindowDimensions } from 'react-native';

export default function Layout() {
  const { width } = useWindowDimensions();
  const isSmallScreen = width < 375;

  return (
    <Tabs>
      <TabSlot />
      <TabList>
        <TabTrigger name="home" href="/">
          <Text style={{ fontSize: isSmallScreen ? 12 : 14 }}>Home</Text>
        </TabTrigger>
      </TabList>
    </Tabs>
  );
}
```

## まとめ

Expo Routerのカスタムタブレイアウトは、以下の特徴があります：

1. **完全なカスタマイズ**: 独自のデザインとインタラクションを実装
2. **柔軟なコンポーネント**: Tabs、TabList、TabTrigger、TabSlot
3. **動的ルート対応**: ネストされたナビゲーションとパラメータ化されたルート
4. **高度な機能**: asChild、reset、renderFn

**主な機能**：
- カスタムスタイリング
- アイコン付きタブ
- アクティブ状態のカスタマイズ
- 複数のタブバー
- 任意の場所にタブトリガーを配置

**実験的機能**: SDK 52以降で利用可能です。APIは変更される可能性があります。

これらの機能を活用して、複雑でカスタムなタブナビゲーション体験を作成できます。
