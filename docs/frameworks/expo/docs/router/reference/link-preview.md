# リンクプレビュー

Expo Routerでリンクプレビューポップアップを作成する方法を学びます。

## リンクプレビューとは

リンクプレビューは、iOS専用の機能で、リンクのプレビューポップアップを作成できます。

**必要なバージョン**: SDK 54以降

## 基本的な実装

### シンプルなプレビュー

```typescript
import { Link } from 'expo-router';

export default function Page() {
  return (
    <Link href="/about">
      <Link.Trigger>About</Link.Trigger>
      <Link.Preview />
    </Link>
  );
}
```

## カスタマイズオプション

### カスタムサイズ

推奨する幅と高さを設定できます。

```typescript
<Link href="/about">
  <Link.Trigger>About</Link.Trigger>
  <Link.Preview preferredSize={{ width: 400, height: 600 }} />
</Link>
```

**注意**: システムは利用可能なスペースに基づいてサイズを調整する可能性があります。

### カスタムプレビューコンテンツ

デフォルトのページスナップショットをカスタムコンテンツで置き換えることができます。

```typescript
import { Link } from 'expo-router';
import { Image, View, Text } from 'react-native';

export default function Page() {
  return (
    <Link href="/about">
      <Link.Trigger>About</Link.Trigger>
      <Link.Preview>
        <View style={{ padding: 20 }}>
          <Image source={{ uri: '/preview-image.jpg' }} style={{ width: 300, height: 200 }} />
          <Text>Custom Preview Content</Text>
        </View>
      </Link.Preview>
    </Link>
  );
}
```

### コンテキストメニュー

メニューアクションを追加できます。

```typescript
import { Link } from 'expo-router';

export default function Page() {
  return (
    <Link href="/about">
      <Link.Trigger>About</Link.Trigger>
      <Link.Preview />
      <Link.Menu>
        <Link.MenuAction
          title="Open"
          systemImage="arrow.up.right"
          onPress={() => {
            // アクション処理
          }}
        />
        <Link.MenuAction
          title="Share"
          systemImage="square.and.arrow.up"
          onPress={() => {
            // シェア処理
          }}
        />
      </Link.Menu>
    </Link>
  );
}
```

**SF Symbolsのサポート**: `systemImage`プロパティでSF Symbolsアイコンを使用できます。

### ネストされたメニュー

```typescript
<Link.Menu>
  <Link.MenuAction title="Open" onPress={() => {}} />
  <Link.Menu title="More Options">
    <Link.MenuAction title="Edit" onPress={() => {}} />
    <Link.MenuAction title="Delete" onPress={() => {}} destructive />
  </Link.Menu>
</Link.Menu>
```

## useIsPreview()フック

コンポーネントがプレビューモードかどうかを検出できます。

```typescript
import { useIsPreview } from 'expo-router';
import { View, Text } from 'react-native';

export default function AboutScreen() {
  const isPreview = useIsPreview();

  return (
    <View>
      {isPreview ? (
        <Text>This is a preview</Text>
      ) : (
        <Text>This is the full screen</Text>
      )}
    </View>
  );
}
```

## 動的クエリパラメータの変更

プレビューが開いている間、クエリパラメータを変更できます。

```typescript
import { Link } from 'expo-router';
import { useState } from 'react';

export default function Page() {
  const [tab, setTab] = useState('profile');

  return (
    <Link href={`/user?tab=${tab}`}>
      <Link.Trigger>User Profile</Link.Trigger>
      <Link.Preview />
      <Link.Menu>
        <Link.MenuAction
          title="Profile"
          onPress={() => setTab('profile')}
        />
        <Link.MenuAction
          title="Settings"
          onPress={() => setTab('settings')}
        />
      </Link.Menu>
    </Link>
  );
}
```

## 既知の制限事項

### 1. pushナビゲーションモードのみ

`push`ナビゲーションモードでのみ動作します。

```typescript
// ✅ 動作する
<Link href="/about" push>
  <Link.Trigger>About</Link.Trigger>
  <Link.Preview />
</Link>

// ❌ 動作しない
<Link href="/about" replace>
  <Link.Trigger>About</Link.Trigger>
  <Link.Preview />
</Link>
```

### 2. JavaScriptタブ/スロットと互換性なし

JavaScriptで実装されたタブやスロットとは互換性がありません。

### 3. Link.Trigger必須

`Link.Trigger`コンポーネントが必要です。

```typescript
// ✅ 推奨
<Link href="/about">
  <Link.Trigger>About</Link.Trigger>
  <Link.Preview />
</Link>

// ❌ 動作しない
<Link href="/about">
  <Text>About</Text>
  <Link.Preview />
</Link>
```

### 4. hrefの完全変更不可

プレビューが開いている間、完全な`href`を変更することはできません。

**可能**: クエリパラメータの変更
```typescript
href={`/user?tab=${tab}`} // ✅ 動作する
```

**不可**: パスの完全変更
```typescript
href={isProfile ? '/profile' : '/settings'} // ❌ 動作しない
```

## まとめ

Expo Routerのリンクプレビューは、以下の特徴があります：

1. **iOS専用機能**: SDK 54以降で利用可能
2. **カスタマイズ可能**: サイズ、コンテンツ、メニュー
3. **SF Symbolsサポート**: システムアイコンの使用
4. **プレビュー検出**: useIsPreview()フック

**主な機能**：
- Link.Trigger
- Link.Preview
- Link.Menu
- Link.MenuAction
- useIsPreview()

**制限事項**：
- pushナビゲーションモードのみ
- JavaScriptタブ/スロット非対応
- Link.Trigger必須
- href完全変更不可

これらの機能を活用して、iOSアプリに洗練されたリンクプレビュー体験を提供できます。
