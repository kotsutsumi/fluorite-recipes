# Symbols

iOS向けにAppleのSF Symbolsライブラリへのアクセスを提供するライブラリです。

## インストール

ターミナルで以下のコマンドを実行してライブラリをインストールします。

```bash
npx expo install expo-symbols
```

## 概要

`expo-symbols`は、iOS上でAppleのSF Symbolsライブラリへのアクセスを提供します。現在ベータ版です。

## プラットフォームサポート

- iOS
- tvOS

**注意**: このライブラリはiOSとtvOSでのみ動作します。

## 主な機能

- SF Symbolsの表示
- シンボルのカスタマイズ（サイズ、色、重さなど）
- アニメーション効果
- 複数のレンダリングモード

## 基本的な使用方法

```javascript
import { SymbolView } from 'expo-symbols';
import { StyleSheet, View } from 'react-native';

export default function App() {
  return (
    <View style={styles.container}>
      <SymbolView
        name="airpods.chargingcase"
        style={styles.symbol}
        type="hierarchical"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  symbol: {
    width: 100,
    height: 100,
  },
});
```

## API リファレンス

### SymbolView

SF Symbolsを表示するためのコンポーネントです。

#### Props

##### name（必須）

表示するSF Symbolの名前。

- **型**: `string`
- **必須**: はい

```javascript
<SymbolView name="heart.fill" />
```

**利用可能なシンボル**: [SF Symbols アプリ](https://developer.apple.com/sf-symbols/)で確認できます。

##### type

シンボルのレンダリングタイプ。

- **型**: `'monochrome' | 'hierarchical' | 'palette' | 'multicolor'`
- **デフォルト**: `'monochrome'`

```javascript
<SymbolView name="heart.fill" type="multicolor" />
```

**タイプの説明**:
- `monochrome`: 単色表示
- `hierarchical`: 階層的な色の濃淡
- `palette`: カスタムカラーパレット
- `multicolor`: SF Symbolsの組み込みカラー

##### size

シンボルのサイズ（ポイント単位）。

- **型**: `number`
- **デフォルト**: `24`

```javascript
<SymbolView name="star.fill" size={48} />
```

##### tintColor

シンボルに適用する色。

- **型**: `string` (色コード)
- **オプション**

```javascript
<SymbolView name="heart.fill" tintColor="#ff0000" />
```

##### colors

パレットタイプで使用する色の配列。

- **型**: `string[]`
- **オプション**

```javascript
<SymbolView
  name="person.3.fill"
  type="palette"
  colors={['#ff0000', '#00ff00', '#0000ff']}
/>
```

##### scale

シンボルのスケール。

- **型**: `'small' | 'medium' | 'large'`
- **デフォルト**: `'medium'`

```javascript
<SymbolView name="star" scale="large" />
```

##### weight

シンボルの線の太さ。

- **型**: `'ultraLight' | 'thin' | 'light' | 'regular' | 'medium' | 'semibold' | 'bold' | 'heavy' | 'black'`
- **デフォルト**: `'regular'`

```javascript
<SymbolView name="star" weight="bold" />
```

##### animationSpec

シンボルのアニメーション設定。

- **型**: `AnimationSpec`
- **オプション**

```javascript
<SymbolView
  name="heart.fill"
  animationSpec={{
    effect: {
      type: 'bounce'
    },
    repeating: true
  }}
/>
```

##### fallback

シンボルが利用できない場合の代替コンポーネント。

- **型**: `React.ReactElement`
- **オプション**

```javascript
<SymbolView
  name="custom.symbol"
  fallback={<Image source={require('./fallback.png')} />}
/>
```

##### resizeMode

シンボルのリサイズモード。

- **型**: `'center' | 'contain' | 'stretch'`
- **デフォルト**: `'center'`

## 使用例

### 基本的なシンボル表示

```javascript
import { SymbolView } from 'expo-symbols';
import { View, StyleSheet } from 'react-native';

export default function BasicExample() {
  return (
    <View style={styles.container}>
      <SymbolView name="heart.fill" style={styles.icon} />
      <SymbolView name="star.fill" style={styles.icon} />
      <SymbolView name="person.fill" style={styles.icon} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    gap: 20,
  },
  icon: {
    width: 40,
    height: 40,
  },
});
```

### カラフルなシンボル

```javascript
<View style={styles.container}>
  <SymbolView
    name="heart.fill"
    tintColor="#ff0000"
    style={styles.icon}
  />
  <SymbolView
    name="star.fill"
    tintColor="#ffcc00"
    style={styles.icon}
  />
  <SymbolView
    name="circle.fill"
    tintColor="#0000ff"
    style={styles.icon}
  />
</View>
```

### マルチカラーシンボル

```javascript
<SymbolView
  name="person.3.fill"
  type="multicolor"
  size={60}
  style={styles.icon}
/>
```

### パレットモード

```javascript
<SymbolView
  name="paintpalette.fill"
  type="palette"
  colors={['#ff0000', '#00ff00', '#0000ff']}
  size={60}
  style={styles.icon}
/>
```

### 階層的スタイル

```javascript
<SymbolView
  name="thermometer.sun.fill"
  type="hierarchical"
  tintColor="#ff6600"
  size={60}
  style={styles.icon}
/>
```

### サイズと重さのバリエーション

```javascript
<View style={styles.container}>
  <SymbolView
    name="star"
    size={30}
    weight="light"
  />
  <SymbolView
    name="star"
    size={40}
    weight="regular"
  />
  <SymbolView
    name="star"
    size={50}
    weight="bold"
  />
</View>
```

### アニメーション付きシンボル

```javascript
import { useState } from 'react';

export default function AnimatedSymbol() {
  const [isFavorite, setIsFavorite] = useState(false);

  return (
    <Pressable onPress={() => setIsFavorite(!isFavorite)}>
      <SymbolView
        name={isFavorite ? "heart.fill" : "heart"}
        tintColor={isFavorite ? "#ff0000" : "#999999"}
        animationSpec={{
          effect: {
            type: 'bounce'
          },
          repeating: false
        }}
        size={40}
      />
    </Pressable>
  );
}
```

### 複数アニメーション効果

```javascript
<SymbolView
  name="arrow.clockwise"
  animationSpec={{
    effect: {
      type: 'pulse'
    },
    repeating: true,
    speed: 2.0
  }}
/>
```

## アニメーション効果

利用可能なアニメーション効果:

- `bounce`: バウンス効果
- `pulse`: パルス効果
- `scale`: スケール変更
- `variableColor`: 色の変化
- `appear`: フェードイン
- `disappear`: フェードアウト

### アニメーション設定例

```javascript
const animationSpec = {
  effect: {
    type: 'bounce',
    direction: 'up' // 'up', 'down', 'left', 'right'
  },
  repeating: true,
  speed: 1.5,
  delay: 0
};

<SymbolView
  name="arrow.up"
  animationSpec={animationSpec}
/>
```

## SF Symbolsの検索

SF Symbolsを検索するには:

1. Macで「SF Symbols」アプリをダウンロード
2. アプリを開いてシンボルを検索
3. シンボル名をコピーして使用

**SF Symbols アプリ**: [developer.apple.com/sf-symbols/](https://developer.apple.com/sf-symbols/)

## ベストプラクティス

### 1. 一貫性のあるスタイル

```javascript
// テーマ定義
const iconTheme = {
  size: 24,
  weight: 'regular',
  type: 'hierarchical',
  tintColor: '#007AFF'
};

<SymbolView name="house" {...iconTheme} />
<SymbolView name="person" {...iconTheme} />
<SymbolView name="gear" {...iconTheme} />
```

### 2. フォールバックの提供

```javascript
import { Platform } from 'react-native';

function Icon({ name, ...props }) {
  if (Platform.OS === 'ios') {
    return <SymbolView name={name} {...props} />;
  }

  // Android用のフォールバック
  return <MaterialIcon name={androidIconName} {...props} />;
}
```

### 3. アクセシビリティ

```javascript
<View accessible accessibilityLabel="お気に入りに追加">
  <SymbolView name="heart.fill" tintColor="#ff0000" />
</View>
```

## パフォーマンスの考慮事項

1. **大量のシンボル**: 一度に多くのシンボルを表示する場合はパフォーマンスに注意
2. **アニメーション**: 複数のアニメーションを同時に実行すると負荷が高くなる可能性
3. **サイズ**: 適切なサイズを指定してレンダリングを最適化

## トラブルシューティング

### シンボルが表示されない

- シンボル名のスペルを確認
- iOSバージョンがシンボルをサポートしているか確認
- fallbackプロパティを使用して代替表示を提供

### 色が適用されない

- `type`プロパティを確認（multicolorは独自の色を使用）
- `tintColor`と`colors`を適切に使用

### アニメーションが動作しない

- `animationSpec`の構文を確認
- iOSバージョンがアニメーションをサポートしているか確認

## プラットフォーム互換性

```javascript
import { Platform } from 'react-native';

const Icon = Platform.select({
  ios: () => <SymbolView name="star.fill" />,
  android: () => <MaterialIcon name="star" />,
  default: () => <Text>⭐</Text>
});
```

## 型定義

### AnimationSpec

```typescript
interface AnimationSpec {
  effect: {
    type: 'bounce' | 'pulse' | 'scale' | 'variableColor' | 'appear' | 'disappear';
    direction?: 'up' | 'down' | 'left' | 'right';
  };
  repeating?: boolean;
  speed?: number;
  delay?: number;
}
```

### SymbolWeight

```typescript
type SymbolWeight =
  | 'ultraLight'
  | 'thin'
  | 'light'
  | 'regular'
  | 'medium'
  | 'semibold'
  | 'bold'
  | 'heavy'
  | 'black';
```
