# Expo Router Native Tabs

モバイルとWeb向けのネイティブタブレイアウトを作成するための実験的機能です。

## 概要

Native Tabsは、プラットフォームネイティブなシステムタブをモバイルとWebアプリケーションに提供します。この機能は実験的であり、APIが変更される可能性があります。

## プラットフォーム

- Android
- iOS
- tvOS
- Web

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

## 基本的な使用例

```typescript
// app/_layout.tsx
import { NativeTabs } from 'expo-router/unstable-native-tabs';

export default function TabLayout() {
  return (
    <NativeTabs>
      <NativeTabs.Trigger name="home" />
      <NativeTabs.Trigger name="settings" />
    </NativeTabs>
  );
}
```

## 主要なコンポーネント

### `NativeTabs`

ネイティブタブレイアウトのルートコンポーネントです。

```typescript
import { NativeTabs } from 'expo-router/unstable-native-tabs';

export default function Layout() {
  return (
    <NativeTabs>
      {/* タブトリガーをここに配置 */}
    </NativeTabs>
  );
}
```

### `NativeTabs.Trigger`

個々のタブオプションを定義します。

```typescript
<NativeTabs.Trigger
  name="home"
  options={{
    title: 'ホーム',
  }}
/>
```

**Props:**
- `name` (string, required): ルート名
- `options` (object): タブの設定オプション

## カスタマイズ

### アイコンの追加

```typescript
import { NativeTabs } from 'expo-router/unstable-native-tabs';
import { Icon } from './components/Icon';

export default function TabLayout() {
  return (
    <NativeTabs>
      <NativeTabs.Trigger
        name="home"
        options={{
          title: 'ホーム',
          icon: ({ color, size }) => (
            <Icon name="home" color={color} size={size} />
          ),
        }}
      />
      <NativeTabs.Trigger
        name="settings"
        options={{
          title: '設定',
          icon: ({ color, size }) => (
            <Icon name="settings" color={color} size={size} />
          ),
        }}
      />
    </NativeTabs>
  );
}
```

### ラベルのカスタマイズ

```typescript
<NativeTabs.Trigger
  name="home"
  options={{
    title: 'ホーム',
    label: 'マイホーム',
  }}
/>
```

### バッジの追加

```typescript
<NativeTabs.Trigger
  name="notifications"
  options={{
    title: '通知',
    badge: 5, // バッジに数字を表示
  }}
/>
```

## 詳細設定

### プラットフォーム固有のスタイル

```typescript
import { Platform } from 'react-native';

<NativeTabs.Trigger
  name="home"
  options={{
    title: 'ホーム',
    ...Platform.select({
      ios: {
        icon: ({ color }) => <IOSIcon color={color} />,
      },
      android: {
        icon: ({ color }) => <AndroidIcon color={color} />,
      },
    }),
  }}
/>
```

### タブバーの設定

```typescript
<NativeTabs
  tabBarOptions={{
    activeTintColor: '#007AFF',
    inactiveTintColor: '#8E8E93',
    style: {
      backgroundColor: '#FFFFFF',
    },
  }}
>
  <NativeTabs.Trigger name="home" />
  <NativeTabs.Trigger name="settings" />
</NativeTabs>
```

### 動的バッジ

```typescript
import { useState } from 'react';
import { NativeTabs } from 'expo-router/unstable-native-tabs';

export default function TabLayout() {
  const [notificationCount, setNotificationCount] = useState(3);

  return (
    <NativeTabs>
      <NativeTabs.Trigger
        name="notifications"
        options={{
          title: '通知',
          badge: notificationCount > 0 ? notificationCount : undefined,
        }}
      />
    </NativeTabs>
  );
}
```

## ベクトルアイコンの使用

### Expo Vector Iconsとの統合

```typescript
import { NativeTabs } from 'expo-router/unstable-native-tabs';
import { Ionicons } from '@expo/vector-icons';

export default function TabLayout() {
  return (
    <NativeTabs>
      <NativeTabs.Trigger
        name="home"
        options={{
          title: 'ホーム',
          icon: ({ color, size }) => (
            <Ionicons name="home" color={color} size={size} />
          ),
        }}
      />
      <NativeTabs.Trigger
        name="search"
        options={{
          title: '検索',
          icon: ({ color, size }) => (
            <Ionicons name="search" color={color} size={size} />
          ),
        }}
      />
      <NativeTabs.Trigger
        name="profile"
        options={{
          title: 'プロフィール',
          icon: ({ color, size }) => (
            <Ionicons name="person" color={color} size={size} />
          ),
        }}
      />
    </NativeTabs>
  );
}
```

## プラットフォーム固有の動作

### iOS
- ネイティブUITabBarを使用
- 半透明効果をサポート
- スワイプジェスチャーをサポート

### Android
- Material Designボトムナビゲーションを使用
- リップルエフェクトをサポート
- Material Designガイドラインに準拠

### Web
- カスタムタブバー実装を使用
- アクセシビリティ機能をサポート
- レスポンシブデザイン

## 完全な例

```typescript
// app/(tabs)/_layout.tsx
import { NativeTabs } from 'expo-router/unstable-native-tabs';
import { Ionicons } from '@expo/vector-icons';

export default function TabLayout() {
  return (
    <NativeTabs
      tabBarOptions={{
        activeTintColor: '#007AFF',
        inactiveTintColor: '#8E8E93',
      }}
    >
      <NativeTabs.Trigger
        name="index"
        options={{
          title: 'ホーム',
          icon: ({ color, size }) => (
            <Ionicons name="home" color={color} size={size} />
          ),
        }}
      />
      <NativeTabs.Trigger
        name="search"
        options={{
          title: '検索',
          icon: ({ color, size }) => (
            <Ionicons name="search" color={color} size={size} />
          ),
        }}
      />
      <NativeTabs.Trigger
        name="notifications"
        options={{
          title: '通知',
          badge: 3,
          icon: ({ color, size }) => (
            <Ionicons name="notifications" color={color} size={size} />
          ),
        }}
      />
      <NativeTabs.Trigger
        name="profile"
        options={{
          title: 'プロフィール',
          icon: ({ color, size }) => (
            <Ionicons name="person" color={color} size={size} />
          ),
        }}
      />
    </NativeTabs>
  );
}
```

## 重要な注意事項

1. **実験的機能**: このAPIは実験的であり、将来のバージョンで変更される可能性があります
2. **インポートパス**: `expo-router/unstable-native-tabs`からインポートする必要があります
3. **プラットフォーム互換性**: すべてのオプションがすべてのプラットフォームで利用できるわけではありません

## ベストプラクティス

1. **一貫性のあるアイコン**: すべてのタブで同じアイコンライブラリを使用
2. **明確なラベル**: 簡潔で説明的なタブラベルを使用
3. **適切なバッジ**: バッジは重要な情報にのみ使用
4. **アクセシビリティ**: アイコンに意味のあるラベルを提供
5. **パフォーマンス**: 重いコンポーネントをタブアイコンに使用しない

## トラブルシューティング

- **アイコンが表示されない**: アイコンコンポーネントが正しくインポートされていることを確認
- **バッジが更新されない**: 状態が正しく管理されていることを確認
- **スタイルが適用されない**: プラットフォーム固有のスタイルオプションを確認

Native Tabsは、Expoアプリケーションでネイティブのタブナビゲーションを実装するための強力で柔軟なソリューションを提供します。
