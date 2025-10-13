# プラットフォーム固有モジュール

Expo Routerでプラットフォーム固有のコードを作成する方法を学びます。

## プラットフォーム固有コードとは

Expo Routerは、プラットフォームごとに異なる実装を提供する2つの主要な方法をサポートしています。

## 1. プラットフォーム固有の拡張子

### appディレクトリ内での使用

プラットフォーム固有のファイル拡張子を使用して、プラットフォームごとに異なる実装を提供できます。

**サポートされる拡張子**：
- `.android.tsx` - Android専用
- `.ios.tsx` - iOS専用
- `.web.tsx` - Web専用

### プロジェクト構造

```
app/
├── _layout.tsx
├── _layout.web.tsx
├── index.tsx
├── about.tsx
└── about.web.tsx
```

### 重要な要件

**ユニバーサルディープリンクのサポート**：
- プラットフォーム固有のファイルを使用する場合、非プラットフォーム版のファイルも必要です
- これにより、すべてのプラットフォームでディープリンクが機能します

**例**：
```
app/
├── about.tsx        # ベースファイル（必須）
└── about.web.tsx    # Web専用の実装
```

### appディレクトリ外での使用

コンポーネントをプラットフォーム固有に分離し、appディレクトリから再エクスポートする方法もあります。

**プロジェクト構造**：
```
app/
└── about.tsx        # プラットフォームコンポーネントを再エクスポート

components/
├── about.tsx        # デフォルト実装
├── about.ios.tsx    # iOS専用
└── about.web.tsx    # Web専用
```

**再エクスポートの例**：
```typescript
// app/about.tsx
export { default } from '@/components/about';
```

## 2. Platformモジュール

React NativeのPlatformモジュールを使用して、条件付きでコンテンツをレンダリングできます。

### 基本的な使用方法

```typescript
import { Platform } from 'react-native';
import { Link, Slot, Tabs } from 'expo-router';

export default function Layout() {
  if (Platform.OS === 'web') {
    // Webカスタムレイアウト
    return (
      <div>
        <header>
          <Link href="/">Home</Link>
          <Link href="/settings">Settings</Link>
        </header>
        <Slot />
      </div>
    );
  }

  // ネイティブボトムタブレイアウト
  return (
    <Tabs>
      <Tabs.Screen name="index" options={{ title: 'Home' }} />
      <Tabs.Screen name="settings" options={{ title: 'Settings' }} />
    </Tabs>
  );
}
```

### プラットフォームの判定

```typescript
import { Platform } from 'react-native';

// 現在のプラットフォームを確認
console.log(Platform.OS); // 'ios' | 'android' | 'web'

// プラットフォーム固有の値を選択
const styles = {
  padding: Platform.select({
    ios: 20,
    android: 16,
    web: 12,
  }),
};
```

### 条件付きインポート

```typescript
import { Platform } from 'react-native';

let Component;
if (Platform.OS === 'web') {
  Component = require('./components/web-component').default;
} else {
  Component = require('./components/native-component').default;
}

export default function Screen() {
  return <Component />;
}
```

## 実装パターン

### レイアウトのカスタマイズ

```typescript
// app/_layout.tsx
import { Platform } from 'react-native';
import { Stack, Tabs } from 'expo-router';

export default function RootLayout() {
  // Webではスタックナビゲーション
  if (Platform.OS === 'web') {
    return (
      <Stack>
        <Stack.Screen name="index" options={{ title: 'Home' }} />
        <Stack.Screen name="settings" options={{ title: 'Settings' }} />
      </Stack>
    );
  }

  // モバイルではタブナビゲーション
  return (
    <Tabs>
      <Tabs.Screen name="index" options={{ title: 'Home' }} />
      <Tabs.Screen name="settings" options={{ title: 'Settings' }} />
    </Tabs>
  );
}
```

### スタイリングのカスタマイズ

```typescript
import { Platform, StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: Platform.select({
      ios: 20,
      android: 16,
      web: 12,
    }),
    backgroundColor: Platform.select({
      ios: '#F5F5F5',
      android: '#FFFFFF',
      web: '#FAFAFA',
    }),
  },
});
```

## ベストプラクティス

### 1. 拡張子の使い分け

**推奨**: Expo Router 3.5.x+では、プラットフォーム固有の拡張子を使用してください。

**メリット**：
- 明確なファイル構造
- 自動的なプラットフォーム検出
- コードの分離と保守性の向上

### 2. Platformモジュールの活用

**推奨**: 小さな条件分岐や動的な判定にはPlatformモジュールを使用してください。

**メリット**：
- 柔軟な条件付きレンダリング
- 実行時の動的な判定
- シンプルなコード

### 3. コードの再利用

プラットフォーム固有のコードは必要最小限に抑え、共通ロジックは共有してください。

```typescript
// components/shared-logic.ts
export function useBusinessLogic() {
  // 共通のビジネスロジック
}

// components/about.tsx
import { useBusinessLogic } from './shared-logic';

export default function About() {
  const logic = useBusinessLogic();
  // デフォルト実装
}

// components/about.web.tsx
import { useBusinessLogic } from './shared-logic';

export default function About() {
  const logic = useBusinessLogic();
  // Web専用実装
}
```

### 4. テストのカバレッジ

プラットフォーム固有のコードもテストしてください。

```typescript
// __tests__/about.test.tsx
import { Platform } from 'react-native';

describe('About Component', () => {
  it('renders correctly on web', () => {
    Platform.OS = 'web';
    // テストコード
  });

  it('renders correctly on iOS', () => {
    Platform.OS = 'ios';
    // テストコード
  });
});
```

## 推奨される使用方法

### プラットフォーム固有の拡張子を優先

**Expo Router 3.5.x以降**では、プラットフォーム固有の拡張子を使用することを推奨します。

**理由**：
- ファイルシステムレベルでの分離
- 自動的なプラットフォーム検出
- ビルドサイズの最適化

### Platformモジュールは代替手段として

**小さな条件分岐**や**動的な判定**が必要な場合は、Platformモジュールを使用してください。

**理由**：
- 柔軟性が高い
- 実行時の判定が可能
- シンプルなコード

## まとめ

Expo Routerのプラットフォーム固有モジュールは、以下の方法で実装できます：

1. **プラットフォーム固有の拡張子**: `.android.tsx`、`.ios.tsx`、`.web.tsx`
2. **Platformモジュール**: 条件付きレンダリングと動的判定

**主な機能**：
- クロスプラットフォーム対応
- プラットフォームごとのUI/UXカスタマイズ
- クリーンでモジュール化されたコード構造

**推奨事項**：
- Expo Router 3.5.x+では拡張子を優先
- Platformモジュールは柔軟な代替手段
- コードの再利用を最大化
- すべてのプラットフォームでテストを実施

これらの機能を活用して、真にクロスプラットフォームなエクスペリエンスを提供できます。
