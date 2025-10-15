# MeshGradient

SwiftUIのMeshGradientビューを公開し、複雑でカラフルなグラデーション背景を作成できるReact Nativeモジュールです。

## 概要

`expo-mesh-gradient` は、SwiftUIの `MeshGradient` ビューをReact Nativeで利用できるようにしたモジュールです。複雑でカラフルなグラデーション背景を作成でき、カスタマイズ可能な列、行、カラーポイントをサポートします。

## 主な機能

- iOSとtvOSをサポート
- 列、行、カラーポイントでカスタマイズ可能なメッシュグラデーション
- スムーズなカラー補間
- セーフエリアの処理

## インストール

```bash
npx expo install expo-mesh-gradient
```

## 使用方法

### 基本的なメッシュグラデーション

```jsx
import { MeshGradientView } from 'expo-mesh-gradient';

function App() {
  return (
    <MeshGradientView
      style={{ flex: 1 }}
      columns={3}
      rows={3}
      colors={[
        'red', 'purple', 'indigo',
        'orange', 'white', 'blue',
        'yellow', 'green', 'cyan'
      ]}
      points={[
        [0.0, 0.0], [0.5, 0.0], [1.0, 0.0],
        [0.0, 0.5], [0.5, 0.5], [1.0, 0.5],
        [0.0, 1.0], [0.5, 1.0], [1.0, 1.0],
      ]}
    />
  );
}
```

### 16進数カラーコードの使用

```jsx
import { MeshGradientView } from 'expo-mesh-gradient';

function GradientBackground() {
  return (
    <MeshGradientView
      style={{ flex: 1 }}
      columns={2}
      rows={2}
      colors={['#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A']}
      points={[
        [0.0, 0.0], [1.0, 0.0],
        [0.0, 1.0], [1.0, 1.0],
      ]}
      smoothsColors={true}
    />
  );
}
```

### カスタムポイント配置

```jsx
import { MeshGradientView } from 'expo-mesh-gradient';

function CustomGradient() {
  return (
    <MeshGradientView
      style={{ flex: 1 }}
      columns={3}
      rows={3}
      colors={[
        'blue', 'cyan', 'blue',
        'purple', 'white', 'purple',
        'blue', 'cyan', 'blue',
      ]}
      points={[
        [0.0, 0.0], [0.5, 0.1], [1.0, 0.0],
        [0.1, 0.5], [0.5, 0.5], [0.9, 0.5],
        [0.0, 1.0], [0.5, 0.9], [1.0, 1.0],
      ]}
      smoothsColors={true}
    />
  );
}
```

### アニメーション付きグラデーション

```jsx
import { useState, useEffect } from 'react';
import { MeshGradientView } from 'expo-mesh-gradient';
import Animated, {
  useAnimatedProps,
  useSharedValue,
  withRepeat,
  withTiming
} from 'react-native-reanimated';

const AnimatedMeshGradient = Animated.createAnimatedComponent(MeshGradientView);

function AnimatedGradient() {
  const offset = useSharedValue(0);

  useEffect(() => {
    offset.value = withRepeat(
      withTiming(1, { duration: 3000 }),
      -1,
      true
    );
  }, []);

  const animatedProps = useAnimatedProps(() => ({
    points: [
      [0.0, offset.value * 0.2], [0.5, 0.0], [1.0, offset.value * 0.2],
      [0.0, 0.5], [0.5, 0.5], [1.0, 0.5],
      [0.0, 1.0 - offset.value * 0.2], [0.5, 1.0], [1.0, 1.0 - offset.value * 0.2],
    ],
  }));

  return (
    <AnimatedMeshGradient
      style={{ flex: 1 }}
      columns={3}
      rows={3}
      colors={[
        'red', 'purple', 'blue',
        'orange', 'white', 'cyan',
        'yellow', 'green', 'magenta',
      ]}
      animatedProps={animatedProps}
      smoothsColors={true}
    />
  );
}
```

## API

### MeshGradientView

#### Props

##### `columns` (必須)

- **型**: `number`
- **説明**: メッシュの幅（各行の頂点数）

##### `rows` (必須)

- **型**: `number`
- **説明**: メッシュの高さ（各列の頂点数）

##### `colors` (必須)

- **型**: `string[]`
- **説明**: 色の配列（必須長: `columns * rows`）
- **形式**: カラー名、16進数コード、RGBAなど

##### `points` (必須)

- **型**: `[number, number][]`
- **説明**: メッシュを定義する2D点の配列
- **範囲**: 各値は 0.0 から 1.0
- **長さ**: `columns * rows` と一致する必要があります

##### `smoothsColors`

- **型**: `boolean`
- **デフォルト**: `true`
- **説明**: スムーズなカラー補間を有効にする

##### `ignoresSafeArea`

- **型**: `boolean | 'all' | 'keyboard' | 'container'`
- **デフォルト**: `false`
- **説明**: iOSのセーフエリアの処理方法
- **プラットフォーム**: iOS

##### `mask`

- **型**: `ReactElement`
- **説明**: グラデーションに適用するマスク
- **プラットフォーム**: iOS

##### `style`

- **型**: `ViewStyle`
- **説明**: 標準のReact Nativeスタイルプロパティ

## 型定義

### MeshGradientViewProps

```typescript
interface MeshGradientViewProps {
  columns: number;
  rows: number;
  colors: string[];
  points: [number, number][];
  smoothsColors?: boolean;
  ignoresSafeArea?: boolean | 'all' | 'keyboard' | 'container';
  mask?: ReactElement;
  style?: ViewStyle;
}
```

## カラーフォーマット

以下のカラーフォーマットをサポートしています：

```javascript
// カラー名
colors={['red', 'blue', 'green']}

// 16進数コード
colors={['#FF0000', '#0000FF', '#00FF00']}

// RGB
colors={['rgb(255, 0, 0)', 'rgb(0, 0, 255)', 'rgb(0, 255, 0)']}

// RGBA
colors={['rgba(255, 0, 0, 0.5)', 'rgba(0, 0, 255, 0.8)', 'rgba(0, 255, 0, 1)']}
```

## ポイント座標

ポイント座標は 0.0 から 1.0 の範囲で指定します：

```javascript
points={[
  [0.0, 0.0],  // 左上
  [0.5, 0.0],  // 上中央
  [1.0, 0.0],  // 右上
  [0.0, 0.5],  // 左中央
  [0.5, 0.5],  // 中央
  [1.0, 0.5],  // 右中央
  [0.0, 1.0],  // 左下
  [0.5, 1.0],  // 下中央
  [1.0, 1.0],  // 右下
]}
```

## プラットフォーム固有の考慮事項

### iOS

- SwiftUIの `MeshGradient` を使用
- iOS 18以降で利用可能
- セーフエリアの処理をサポート
- マスク機能をサポート

### tvOS

- 基本的なメッシュグラデーション機能をサポート
- tvOS固有の制限がある場合があります

## パフォーマンスの考慮事項

1. **グリッドサイズ**: 大きなグリッド（高い `columns` と `rows` の値）はパフォーマンスに影響する可能性があります
2. **アニメーション**: アニメーションを使用する場合は、`react-native-reanimated` を使用してスムーズな動作を実現
3. **カラー数**: 多数の色を使用すると、レンダリングが複雑になる可能性があります

## ベストプラクティス

1. **適切なグリッドサイズ**: パフォーマンスとビジュアル品質のバランスを取るため、3x3 または 4x4 から始める
2. **カラー補間**: スムーズなグラデーションには `smoothsColors={true}` を使用
3. **アニメーション**: `react-native-reanimated` を使用して高パフォーマンスなアニメーションを実装
4. **セーフエリア**: UIとの重なりを避けるため、必要に応じて `ignoresSafeArea` を設定

## 実用例

### グラデーション背景画面

```jsx
import { View, Text, StyleSheet } from 'react-native';
import { MeshGradientView } from 'expo-mesh-gradient';

function WelcomeScreen() {
  return (
    <View style={styles.container}>
      <MeshGradientView
        style={StyleSheet.absoluteFill}
        columns={3}
        rows={3}
        colors={[
          '#6366F1', '#8B5CF6', '#6366F1',
          '#EC4899', '#F59E0B', '#EC4899',
          '#6366F1', '#8B5CF6', '#6366F1',
        ]}
        points={[
          [0.0, 0.0], [0.5, 0.0], [1.0, 0.0],
          [0.0, 0.5], [0.5, 0.5], [1.0, 0.5],
          [0.0, 1.0], [0.5, 1.0], [1.0, 1.0],
        ]}
        smoothsColors={true}
      />
      <View style={styles.content}>
        <Text style={styles.title}>ようこそ</Text>
        <Text style={styles.subtitle}>美しいグラデーション</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 48,
    fontWeight: 'bold',
    color: 'white',
  },
  subtitle: {
    fontSize: 24,
    color: 'white',
    opacity: 0.9,
  },
});
```

## サポートプラットフォーム

- iOS (iOS 18以降推奨)
- tvOS

## バンドルバージョン

~0.4.7
