# Expo Router UI

カスタムタブレイアウトを作成するためのヘッドレスタブコンポーネントを提供します。

## 概要

Expo Router UIは、`expo-router`ライブラリに含まれるヘッドレスタブコンポーネントのセットを提供します。これらのコンポーネントを使用すると、完全にカスタマイズ可能なタブナビゲーションを作成できます。

## プラットフォーム

- Android
- iOS
- tvOS
- Web

## バージョン

- Bundled: ~6.0.12

## インストールと設定

### インストール

```bash
npx expo install expo-router
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

## インポート

```typescript
import { Tabs, TabList, TabTrigger, TabSlot } from 'expo-router/ui';
```

## 主要なコンポーネント

### `Tabs`

ヘッドレスタブのルートコンポーネントです。

```typescript
import { Tabs } from 'expo-router/ui';

export default function Layout() {
  return (
    <Tabs>
      {/* タブコンテンツ */}
    </Tabs>
  );
}
```

**Props:**
- `children` (ReactNode): タブコンテンツ
- `defaultValue` (string): デフォルトで選択されるタブ
- `value` (string): 制御されたタブの値
- `onValueChange` (function): 値変更時のコールバック

### `TabList`

タブトリガーのラッパーコンポーネントです。

```typescript
import { TabList } from 'expo-router/ui';

<TabList>
  {/* TabTriggerコンポーネントをここに配置 */}
</TabList>
```

### `TabTrigger`

タブのナビゲーショントリガーを作成します。

```typescript
import { TabTrigger } from 'expo-router/ui';

<TabTrigger name="home" href="/">
  <Text>ホーム</Text>
</TabTrigger>
```

**Props:**
- `name` (string, required): タブ名
- `href` (string, required): ナビゲーション先のパス
- `asChild` (boolean): 子要素をトリガーとして使用
- `children` (ReactNode): トリガーコンテンツ

### `TabSlot`

現在のタブをレンダリングします。

```typescript
import { TabSlot } from 'expo-router/ui';

<TabSlot />
```

## 基本的な使用例

```typescript
import { Tabs, TabList, TabTrigger, TabSlot } from 'expo-router/ui';
import { View, Text, StyleSheet } from 'react-native';

export default function Layout() {
  return (
    <Tabs>
      <TabSlot />
      <TabList style={styles.tabBar}>
        <TabTrigger name="home" href="/">
          <View style={styles.tab}>
            <Text>ホーム</Text>
          </View>
        </TabTrigger>
        <TabTrigger name="settings" href="/settings">
          <View style={styles.tab}>
            <Text>設定</Text>
          </View>
        </TabTrigger>
      </TabList>
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  tab: {
    flex: 1,
    padding: 16,
    alignItems: 'center',
  },
});
```

## 主要なフック

### `useTabSlot()`

現在のタブ要素を返します。

```typescript
import { useTabSlot } from 'expo-router/ui';

function CustomTabSlot() {
  const slot = useTabSlot();

  return (
    <View>
      {slot}
    </View>
  );
}
```

### `useTabsWithChildren()`

`Tabs`コンポーネントのフック版です。

```typescript
import { useTabsWithChildren } from 'expo-router/ui';

function CustomTabs() {
  const tabs = useTabsWithChildren({
    children: /* タブコンテンツ */,
  });

  return tabs;
}
```

### `useTabsWithTriggers()`

代替タブナビゲーションフックです。

```typescript
import { useTabsWithTriggers } from 'expo-router/ui';

function CustomTabs() {
  const tabs = useTabsWithTriggers({
    triggers: [
      { name: 'home', href: '/' },
      { name: 'settings', href: '/settings' },
    ],
  });

  return tabs;
}
```

## カスタムタブバーの作成

```typescript
import { Tabs, TabList, TabTrigger, TabSlot } from 'expo-router/ui';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function Layout() {
  return (
    <Tabs>
      <TabSlot />
      <TabList style={styles.tabBar}>
        <TabTrigger name="home" href="/" asChild>
          <Pressable style={({ pressed }) => [
            styles.tab,
            pressed && styles.tabPressed
          ]}>
            {({ pressed }) => (
              <View style={styles.tabContent}>
                <Ionicons
                  name="home"
                  size={24}
                  color={pressed ? '#007AFF' : '#8E8E93'}
                />
                <Text style={[
                  styles.tabText,
                  pressed && styles.tabTextActive
                ]}>
                  ホーム
                </Text>
              </View>
            )}
          </Pressable>
        </TabTrigger>

        <TabTrigger name="search" href="/search" asChild>
          <Pressable style={({ pressed }) => [
            styles.tab,
            pressed && styles.tabPressed
          ]}>
            {({ pressed }) => (
              <View style={styles.tabContent}>
                <Ionicons
                  name="search"
                  size={24}
                  color={pressed ? '#007AFF' : '#8E8E93'}
                />
                <Text style={[
                  styles.tabText,
                  pressed && styles.tabTextActive
                ]}>
                  検索
                </Text>
              </View>
            )}
          </Pressable>
        </TabTrigger>
      </TabList>
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    flexDirection: 'row',
    backgroundColor: '#ffffff',
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
    paddingBottom: 8,
  },
  tab: {
    flex: 1,
    paddingTop: 8,
  },
  tabPressed: {
    opacity: 0.7,
  },
  tabContent: {
    alignItems: 'center',
  },
  tabText: {
    fontSize: 12,
    marginTop: 4,
    color: '#8E8E93',
  },
  tabTextActive: {
    color: '#007AFF',
  },
});
```

## 制御されたタブ

```typescript
import { useState } from 'react';
import { Tabs, TabList, TabTrigger, TabSlot } from 'expo-router/ui';

export default function Layout() {
  const [activeTab, setActiveTab] = useState('home');

  return (
    <Tabs value={activeTab} onValueChange={setActiveTab}>
      <TabSlot />
      <TabList>
        <TabTrigger name="home" href="/">
          <Text>ホーム</Text>
        </TabTrigger>
        <TabTrigger name="settings" href="/settings">
          <Text>設定</Text>
        </TabTrigger>
      </TabList>
    </Tabs>
  );
}
```

## アニメーション付きタブ

```typescript
import { Tabs, TabList, TabTrigger, TabSlot } from 'expo-router/ui';
import Animated, {
  useAnimatedStyle,
  withTiming
} from 'react-native-reanimated';

function AnimatedTab({ name, href, children, isActive }) {
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { scale: withTiming(isActive ? 1.1 : 1) }
    ],
    opacity: withTiming(isActive ? 1 : 0.6),
  }));

  return (
    <TabTrigger name={name} href={href} asChild>
      <Animated.View style={animatedStyle}>
        {children}
      </Animated.View>
    </TabTrigger>
  );
}
```

## バッジ付きタブ

```typescript
import { View, Text, StyleSheet } from 'react-native';
import { TabTrigger } from 'expo-router/ui';

function TabWithBadge({ name, href, label, badge }) {
  return (
    <TabTrigger name={name} href={href}>
      <View style={styles.tabContainer}>
        <Text>{label}</Text>
        {badge > 0 && (
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{badge}</Text>
          </View>
        )}
      </View>
    </TabTrigger>
  );
}

const styles = StyleSheet.create({
  tabContainer: {
    position: 'relative',
    padding: 16,
  },
  badge: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: 'red',
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  badgeText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
});
```

## TypeScript型定義

```typescript
type TabsProps = {
  children: React.ReactNode;
  defaultValue?: string;
  value?: string;
  onValueChange?: (value: string) => void;
};

type TabTriggerProps = {
  name: string;
  href: string;
  asChild?: boolean;
  children: React.ReactNode;
};

type TabListProps = {
  children: React.ReactNode;
  style?: ViewStyle;
};
```

## ベストプラクティス

1. **アクセシビリティ**: タブトリガーに意味のあるラベルを提供
2. **パフォーマンス**: 複雑なアニメーションは最適化を検討
3. **レスポンシブ**: さまざまな画面サイズでタブバーをテスト
4. **一貫性**: アプリ全体で一貫したタブスタイルを維持
5. **フィードバック**: ユーザーインタラクションに視覚的フィードバックを提供

## 完全な例

```typescript
import { Tabs, TabList, TabTrigger, TabSlot } from 'expo-router/ui';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';

export default function Layout() {
  const [activeTab, setActiveTab] = useState('home');

  const tabs = [
    { name: 'home', href: '/', icon: 'home', label: 'ホーム' },
    { name: 'search', href: '/search', icon: 'search', label: '検索' },
    { name: 'notifications', href: '/notifications', icon: 'notifications', label: '通知', badge: 3 },
    { name: 'profile', href: '/profile', icon: 'person', label: 'プロフィール' },
  ];

  return (
    <Tabs value={activeTab} onValueChange={setActiveTab}>
      <TabSlot />
      <TabList style={styles.tabBar}>
        {tabs.map((tab) => (
          <TabTrigger key={tab.name} name={tab.name} href={tab.href} asChild>
            <Pressable
              style={styles.tab}
              accessibilityLabel={tab.label}
              accessibilityRole="tab"
            >
              <View style={styles.tabContent}>
                <Ionicons
                  name={tab.icon}
                  size={24}
                  color={activeTab === tab.name ? '#007AFF' : '#8E8E93'}
                />
                <Text style={[
                  styles.tabText,
                  activeTab === tab.name && styles.tabTextActive
                ]}>
                  {tab.label}
                </Text>
                {tab.badge && (
                  <View style={styles.badge}>
                    <Text style={styles.badgeText}>{tab.badge}</Text>
                  </View>
                )}
              </View>
            </Pressable>
          </TabTrigger>
        ))}
      </TabList>
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    flexDirection: 'row',
    backgroundColor: '#ffffff',
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
    paddingBottom: 8,
  },
  tab: {
    flex: 1,
    paddingTop: 8,
  },
  tabContent: {
    alignItems: 'center',
    position: 'relative',
  },
  tabText: {
    fontSize: 12,
    marginTop: 4,
    color: '#8E8E93',
  },
  tabTextActive: {
    color: '#007AFF',
    fontWeight: '600',
  },
  badge: {
    position: 'absolute',
    top: -4,
    right: '30%',
    backgroundColor: '#FF3B30',
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  badgeText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
});
```

Expo Router UIは、Expoアプリケーションで柔軟でカスタマイズ可能なタブナビゲーションを作成するための強力なツールセットを提供します。
