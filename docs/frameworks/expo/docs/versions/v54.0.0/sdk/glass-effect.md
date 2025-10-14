# GlassEffect

ネイティブiOSリキッドグラスエフェクトを使用した`UIVisualEffectView`をレンダリングするためのReactコンポーネントです。

> **注意**: このライブラリはiOS 26以降でのみ利用可能です。

## 概要

Expo GlassEffectは、iOSのネイティブグラスエフェクトをReact Nativeで簡単に使用できるようにします。カスタマイズ可能なグラススタイルと色合いをサポートします。

## インストール

```bash
npx expo install expo-glass-effect
```

## 基本的な使用方法

```javascript
import { GlassView } from 'expo-glass-effect';
import { Image, View, StyleSheet } from 'react-native';

export default function App() {
  return (
    <View style={styles.container}>
      <Image
        source={require('./background.jpg')}
        style={StyleSheet.absoluteFill}
      />
      <GlassView
        style={styles.glassView}
        glassEffectStyle="clear"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  glassView: {
    width: 300,
    height: 200,
    borderRadius: 20,
  },
});
```

## コンポーネント

### GlassView

ネイティブiOSグラスエフェクトをレンダリングするコンポーネントです。

#### Props

```typescript
type GlassViewProps = {
  glassEffectStyle?: 'clear' | 'regular';
  isInteractive?: boolean;
  tintColor?: string;
  style?: ViewStyle;
  children?: React.ReactNode;
};
```

**プロパティ:**

- `glassEffectStyle`: グラスエフェクトのスタイル
  - `'clear'`: 透明なグラスエフェクト（デフォルト）
  - `'regular'`: 標準のグラスエフェクト

- `isInteractive`: インタラクティブ動作の切り替え
  - `true`: タッチイベントが有効
  - `false`: タッチイベントが無効（デフォルト）
  - **注意**: マウント時に一度だけ設定可能

- `tintColor`: グラスの色合いをカスタマイズ
  - 任意のCSS色文字列（例: `'#FF0000'`, `'rgba(255, 0, 0, 0.5)'`）

- `style`: 標準のReact Native Viewスタイル

- `children`: 子コンポーネント

#### 使用例

```javascript
import { GlassView } from 'expo-glass-effect';

// 基本的な使用
<GlassView style={{ width: 200, height: 200 }} />

// clearスタイル
<GlassView
  glassEffectStyle="clear"
  style={{ width: 200, height: 200 }}
/>

// regularスタイル
<GlassView
  glassEffectStyle="regular"
  style={{ width: 200, height: 200 }}
/>

// カスタム色合い
<GlassView
  tintColor="#FF6B6B"
  style={{ width: 200, height: 200 }}
/>

// インタラクティブ
<GlassView
  isInteractive
  style={{ width: 200, height: 200 }}
/>
```

### GlassContainer

複数のグラスビューを組み合わせたエフェクトを作成するコンテナコンポーネントです。

#### Props

```typescript
type GlassContainerProps = {
  spacing?: number;
  style?: ViewStyle;
  children: React.ReactNode;
};
```

**プロパティ:**

- `spacing`: グラス要素間のスペース（ポイント単位）
- `style`: 標準のReact Native Viewスタイル
- `children`: 子のGlassViewコンポーネント

#### 使用例

```javascript
import { GlassView, GlassContainer } from 'expo-glass-effect';

<GlassContainer spacing={10}>
  <GlassView glassEffectStyle="clear" style={{ height: 100 }} />
  <GlassView glassEffectStyle="regular" style={{ height: 100 }} />
</GlassContainer>
```

## API

### `isLiquidGlassAvailable()`

デバイスでリキッドグラスエフェクトが利用可能かどうかを確認します。

```javascript
import { isLiquidGlassAvailable } from 'expo-glass-effect';

const isAvailable = isLiquidGlassAvailable();

if (isAvailable) {
  console.log('リキッドグラスエフェクトが利用可能です');
} else {
  console.log('このデバイスではリキッドグラスエフェクトは利用できません');
}
```

**戻り値:**
- `true`: iOS 26以降のデバイス
- `false`: iOS 26未満、またはiOS以外のプラットフォーム

## 使用例

### 背景画像の上にグラスエフェクト

```javascript
import { GlassView } from 'expo-glass-effect';
import { Image, View, Text, StyleSheet } from 'react-native';

export default function GlassCard() {
  return (
    <View style={styles.container}>
      <Image
        source={{ uri: 'https://example.com/background.jpg' }}
        style={StyleSheet.absoluteFill}
        resizeMode="cover"
      />
      <GlassView style={styles.card}>
        <Text style={styles.text}>グラスエフェクト カード</Text>
      </GlassView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    width: 320,
    height: 200,
    borderRadius: 20,
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
  },
});
```

### 複数のスタイルを組み合わせる

```javascript
import { GlassView, GlassContainer } from 'expo-glass-effect';
import { View, Text, StyleSheet } from 'react-native';

export default function MultiStyleGlass() {
  return (
    <View style={styles.container}>
      <GlassContainer spacing={15}>
        <GlassView
          glassEffectStyle="clear"
          style={styles.section}
        >
          <Text style={styles.label}>Clear Style</Text>
        </GlassView>

        <GlassView
          glassEffectStyle="regular"
          style={styles.section}
        >
          <Text style={styles.label}>Regular Style</Text>
        </GlassView>

        <GlassView
          glassEffectStyle="clear"
          tintColor="#FF6B6B"
          style={styles.section}
        >
          <Text style={styles.label}>Custom Tint</Text>
        </GlassView>
      </GlassContainer>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
  },
  section: {
    height: 120,
    borderRadius: 15,
    padding: 15,
    justifyContent: 'center',
  },
  label: {
    fontSize: 18,
    fontWeight: '600',
    color: 'white',
  },
});
```

### 条件付きレンダリング

```javascript
import { GlassView, isLiquidGlassAvailable } from 'expo-glass-effect';
import { View, Text, StyleSheet } from 'react-native';

export default function ConditionalGlass() {
  const glassAvailable = isLiquidGlassAvailable();

  if (!glassAvailable) {
    return (
      <View style={[styles.fallback, styles.card]}>
        <Text style={styles.text}>フォールバック UI</Text>
      </View>
    );
  }

  return (
    <GlassView style={styles.card}>
      <Text style={styles.text}>グラスエフェクト UI</Text>
    </GlassView>
  );
}

const styles = StyleSheet.create({
  card: {
    width: 300,
    height: 200,
    borderRadius: 20,
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  fallback: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    backdropFilter: 'blur(10px)', // Web用のフォールバック
  },
  text: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
  },
});
```

### インタラクティブなグラスビュー

```javascript
import { GlassView } from 'expo-glass-effect';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';

export default function InteractiveGlass() {
  const handlePress = () => {
    console.log('グラスビューがタップされました');
  };

  return (
    <TouchableOpacity onPress={handlePress}>
      <GlassView
        isInteractive
        style={styles.button}
      >
        <Text style={styles.buttonText}>タップしてください</Text>
      </GlassView>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    width: 200,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 18,
    fontWeight: '600',
    color: 'white',
  },
});
```

### アニメーション付きグラスエフェクト

```javascript
import { GlassView } from 'expo-glass-effect';
import { Animated, StyleSheet } from 'react-native';
import { useEffect, useRef } from 'react';

export default function AnimatedGlass() {
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(opacity, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start();
  }, []);

  return (
    <Animated.View style={{ opacity }}>
      <GlassView style={styles.card}>
        <Text style={styles.text}>フェードイン グラスエフェクト</Text>
      </GlassView>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  card: {
    width: 300,
    height: 200,
    borderRadius: 20,
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
  },
});
```

## 既知の制限事項

### `isInteractive`の制限

`isInteractive`プロパティは、コンポーネントのマウント時に一度だけ設定できます。動的に変更する必要がある場合は、コンポーネントを再マウントする必要があります。

```javascript
// ❌ 動作しません - 動的な変更
const [interactive, setInteractive] = useState(false);
<GlassView isInteractive={interactive} />

// ✅ 動作します - キーを使用して再マウント
const [interactive, setInteractive] = useState(false);
<GlassView
  key={interactive ? 'interactive' : 'non-interactive'}
  isInteractive={interactive}
/>
```

## プラットフォーム互換性

| プラットフォーム | サポート | 要件 |
|----------------|---------|------|
| iOS            | ✅      | iOS 26以降 |
| Android        | ❌      | - |
| Web            | ❌      | - |

## ベストプラクティス

1. **可用性チェック**: 使用前に`isLiquidGlassAvailable()`で確認
2. **フォールバック**: iOS 26未満のデバイス用の代替UIを用意
3. **パフォーマンス**: 過度な使用はパフォーマンスに影響する可能性があります
4. **背景**: グラスエフェクトは背景がある場合に最も効果的です
5. **色のコントラスト**: テキストの読みやすさを確保

## トラブルシューティング

### グラスエフェクトが表示されない

```javascript
// 問題: デバイスがサポートしていない
// 解決: 可用性をチェックしてフォールバックを提供

import { isLiquidGlassAvailable } from 'expo-glass-effect';

if (!isLiquidGlassAvailable()) {
  // フォールバックUIを表示
}
```

### インタラクティブモードが変更されない

```javascript
// 問題: isInteractiveを動的に変更しようとしている
// 解決: keyを使用してコンポーネントを再マウント

<GlassView
  key={isInteractive ? 'interactive' : 'static'}
  isInteractive={isInteractive}
/>
```

## スタイリングのヒント

```javascript
const styles = StyleSheet.create({
  // 丸い角
  rounded: {
    borderRadius: 20,
  },

  // 影を追加
  withShadow: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },

  // ボーダー
  withBorder: {
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
});
```

## 関連リソース

- [UIVisualEffectView - Apple Developer](https://developer.apple.com/documentation/uikit/uivisualeffectview)
- [iOS Design Guidelines](https://developer.apple.com/design/human-interface-guidelines/)
