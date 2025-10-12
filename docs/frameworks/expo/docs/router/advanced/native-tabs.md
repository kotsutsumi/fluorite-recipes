# ネイティブタブ（実験的機能）

Expo RouterのネイティブタブBを使用して、プラットフォームネイティブのタブバーを実装します。

## ネイティブタブとは

ネイティブタブは、Expo SDK 54以降で利用可能な実験的機能です。JavaScriptベースのタブの代わりに、ネイティブシステムのタブバーを使用します。

### 重要な注意事項

> **実験的機能**: ネイティブタブは実験的機能であり、APIは変更される可能性があります。

## 基本的な設定

### プロジェクト構造

```
app/
  _layout.tsx         # タブレイアウト
  index.tsx           # ホームタブ
  settings.tsx        # 設定タブ
  profile.tsx         # プロフィールタブ
```

### タブレイアウトの作成

```typescript
// app/_layout.tsx
import { NativeTabs, Icon, Label } from 'expo-router/unstable-native-tabs';

export default function TabLayout() {
  return (
    <NativeTabs>
      <NativeTabs.Trigger name="index">
        <Label>Home</Label>
        <Icon sf="house.fill" />
      </NativeTabs.Trigger>

      <NativeTabs.Trigger name="settings">
        <Label>Settings</Label>
        <Icon sf="gearshape" />
      </NativeTabs.Trigger>

      <NativeTabs.Trigger name="profile">
        <Label>Profile</Label>
        <Icon sf="person.fill" />
      </NativeTabs.Trigger>
    </NativeTabs>
  );
}
```

### 画面の作成

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
```

## タブのカスタマイズ

### アイコンのカスタマイズ

#### SF Symbols（iOS）

```typescript
<NativeTabs.Trigger name="index">
  <Icon sf="house.fill" />
</NativeTabs.Trigger>
```

#### Drawable（Android）

```typescript
<NativeTabs.Trigger name="index">
  <Icon drawable="ic_home" />
</NativeTabs.Trigger>
```

#### カスタム画像

```typescript
<NativeTabs.Trigger name="index">
  <Icon src={require('./assets/home-icon.png')} />
</NativeTabs.Trigger>
```

**制限事項**: Androidでは、カスタム画像のサポートが制限されています。

### ラベルのカスタマイズ

#### ラベルの表示

```typescript
<NativeTabs.Trigger name="index">
  <Label>Home</Label>
  <Icon sf="house.fill" />
</NativeTabs.Trigger>
```

#### ラベルの非表示

```typescript
<NativeTabs.Trigger name="index">
  <Icon sf="house.fill" />
  {/* Labelコンポーネントを省略 */}
</NativeTabs.Trigger>
```

### バッジの追加

```typescript
<NativeTabs.Trigger name="notifications">
  <Label>Notifications</Label>
  <Badge count={5} />
  <Icon sf="bell.fill" />
</NativeTabs.Trigger>
```

## 条件付きタブの表示/非表示

### 条件付きでタブを非表示

```typescript
import { NativeTabs, Icon, Label } from 'expo-router/unstable-native-tabs';
import { useAuth } from '@/hooks/useAuth';

export default function TabLayout() {
  const { isAdmin } = useAuth();

  return (
    <NativeTabs>
      <NativeTabs.Trigger name="index">
        <Label>Home</Label>
        <Icon sf="house.fill" />
      </NativeTabs.Trigger>

      {isAdmin && (
        <NativeTabs.Trigger name="admin">
          <Label>Admin</Label>
          <Icon sf="lock.fill" />
        </NativeTabs.Trigger>
      )}

      <NativeTabs.Trigger name="profile">
        <Label>Profile</Label>
        <Icon sf="person.fill" />
      </NativeTabs.Trigger>
    </NativeTabs>
  );
}
```

## iOS 26の特殊機能

### 検索タブ

```typescript
<NativeTabs.Trigger name="search" search>
  <Label>Search</Label>
  <Icon sf="magnifyingglass" />
</NativeTabs.Trigger>
```

### タブの最小化

```typescript
<NativeTabs minimized>
  <NativeTabs.Trigger name="index">
    <Label>Home</Label>
    <Icon sf="house.fill" />
  </NativeTabs.Trigger>
</NativeTabs>
```

## dismissとscrollの動作カスタマイズ

### dismissの動作

```typescript
<NativeTabs.Trigger name="index" dismissBehavior="dismiss">
  <Label>Home</Label>
  <Icon sf="house.fill" />
</NativeTabs.Trigger>
```

**オプション**：
- `dismiss`: タブを選択すると閉じる
- `none`: 何もしない

### scrollの動作

```typescript
<NativeTabs.Trigger name="index" scrollBehavior="scrollToTop">
  <Label>Home</Label>
  <Icon sf="house.fill" />
</NativeTabs.Trigger>
```

**オプション**：
- `scrollToTop`: タブを再選択するとトップにスクロール
- `none`: 何もしない

## プラットフォーム固有の設定

### iOSのみの設定

```typescript
import { Platform } from 'react-native';

<NativeTabs.Trigger
  name="index"
  {...Platform.OS === 'ios' && { search: true }}
>
  <Label>Home</Label>
  <Icon sf="house.fill" />
</NativeTabs.Trigger>
```

### Androidのみの設定

```typescript
<NativeTabs.Trigger
  name="index"
  {...Platform.OS === 'android' && { drawable: 'ic_home' }}
>
  <Label>Home</Label>
  <Icon sf="house.fill" />
</NativeTabs.Trigger>
```

## 制限事項

### Androidの制限

#### 最大5タブ

Androidでは、最大5つのタブまでサポートされています。

```typescript
// OK: 5タブ
<NativeTabs>
  <NativeTabs.Trigger name="home">...</NativeTabs.Trigger>
  <NativeTabs.Trigger name="explore">...</NativeTabs.Trigger>
  <NativeTabs.Trigger name="create">...</NativeTabs.Trigger>
  <NativeTabs.Trigger name="notifications">...</NativeTabs.Trigger>
  <NativeTabs.Trigger name="profile">...</NativeTabs.Trigger>
</NativeTabs>

// NG: 6タブ（エラー）
```

#### カスタム画像のサポート制限

Androidでは、カスタム画像のサポートが制限されています。SF SymbolsやDrawableの使用を推奨します。

### ネストされたネイティブタブの制限

ネイティブタブ内に別のネイティブタブをネストすることはできません。

**非推奨**：

```
app/
  _layout.tsx         # NativeTabs
  home/
    _layout.tsx       # NativeTabs（NG）
```

### FlatListの統合問題

FlatListとの統合に潜在的な問題があります。

**回避策**：

```typescript
import { FlatList } from 'react-native';
import { useFocusEffect } from 'expo-router';

export default function HomeScreen() {
  const [refreshing, setRefreshing] = React.useState(false);

  useFocusEffect(() => {
    // タブがフォーカスされたときにリフレッシュ
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 100);
  });

  return (
    <FlatList
      data={data}
      refreshing={refreshing}
      onRefresh={() => {}}
      renderItem={({ item }) => <Text>{item}</Text>}
    />
  );
}
```

## JavaScriptタブとの比較

### JavaScriptタブ

**利点**：
- 完全なカスタマイズが可能
- すべてのプラットフォームで一貫した動作
- 制限なし

**欠点**：
- ネイティブ感がやや劣る
- パフォーマンスがやや低い

### ネイティブタブ

**利点**：
- ネイティブプラットフォームの外観と感触
- 優れたパフォーマンス
- プラットフォームネイティブのアニメーション

**欠点**：
- カスタマイズが制限されている
- 実験的機能（APIが変更される可能性）
- プラットフォーム固有の制限

## ベストプラクティス

### 1. 明示的なタブ設定

すべてのタブに`NativeTabs.Trigger`を使用してください。

```typescript
<NativeTabs>
  <NativeTabs.Trigger name="index">
    <Label>Home</Label>
    <Icon sf="house.fill" />
  </NativeTabs.Trigger>
  {/* その他のタブ */}
</NativeTabs>
```

### 2. プラットフォーム固有のアイコン

プラットフォームに適したアイコンを使用してください。

```typescript
<Icon
  sf="house.fill"           // iOS
  drawable="ic_home"        // Android
/>
```

### 3. タブ数の制限

タブは5つ以下に保つことをお勧めします。

### 4. フォールバック戦略

ネイティブタブがサポートされていない場合のフォールバック戦略を用意してください。

```typescript
import { NativeTabs } from 'expo-router/unstable-native-tabs';
import { Tabs } from 'expo-router';
import { Platform } from 'react-native';

export default function TabLayout() {
  const useNativeTabs = Platform.OS === 'ios' && Platform.Version >= 26;

  if (useNativeTabs) {
    return <NativeTabLayout />;
  }

  return <JavaScriptTabLayout />;
}
```

## まとめ

Expo Routerのネイティブタブは、以下の特徴があります：

1. **実験的機能**: APIは変更される可能性があります
2. **ネイティブプラットフォームのタブバー**: 優れたパフォーマンスとネイティブ感
3. **明示的なタブ設定**: `NativeTabs.Trigger`が必要
4. **プラットフォーム固有の制限**: Androidは最大5タブ
5. **カスタマイズの制限**: JavaScriptタブより柔軟性が低い

ネイティブプラットフォームのタブバーエクスペリエンスを求めるアプリに推奨されます。ただし、実験的機能であることに注意してください。
