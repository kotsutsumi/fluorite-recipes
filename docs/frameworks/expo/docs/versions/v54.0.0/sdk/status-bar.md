# StatusBar

Expo最適化されたデフォルト設定を備えたReact Native StatusBar APIを提供するライブラリです。

## インストール

ターミナルで以下のコマンドを実行してライブラリをインストールします。

```bash
npx expo install expo-status-bar
```

## 概要

`expo-status-bar`は、アプリのステータスバーを制御するためのReact Native StatusBar APIをExpo最適化されたデフォルト設定で提供します。

## プラットフォームサポート

- **Android**: 完全サポート
- **iOS**: 完全サポート
- **tvOS**: コンパイル可能だがステータスバーは表示されない
- **Web**: OSのステータスバーを制御できない

## 基本的な使用方法

```javascript
import { StatusBar } from 'expo-status-bar';
import { View, Text, StyleSheet } from 'react-native';

export default function App() {
  return (
    <View style={styles.container}>
      <Text>ステータスバーのテキストが明るい色になっています！</Text>
      <StatusBar style="light" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
```

## API リファレンス

### Props

#### animated

ステータスバーの変更をアニメーションで表示します。

- **型**: `boolean`
- **デフォルト**: `false`

```javascript
<StatusBar animated={true} />
```

#### backgroundColor

ステータスバーの背景色を設定します（Androidのみ）。

- **型**: `string`
- **プラットフォーム**: Android

```javascript
<StatusBar backgroundColor="#ff0000" />
```

#### hidden

ステータスバーを非表示にします。

- **型**: `boolean`
- **デフォルト**: `false`

```javascript
<StatusBar hidden={true} />
```

#### style

ステータスバーのテキスト色を設定します。

- **型**: `'auto' | 'inverted' | 'light' | 'dark'`
- **デフォルト**: `'auto'`

```javascript
<StatusBar style="light" />
```

**オプション**:
- `'auto'`: OSのカラースキームに基づいて自動選択
- `'light'`: 明るいテキスト（暗い背景用）
- `'dark'`: 暗いテキスト（明るい背景用）
- `'inverted'`: 現在のテーマの反対色

#### translucent

ステータスバーの下にアプリを描画します（Androidのみ）。

- **型**: `boolean`
- **デフォルト**: `true`（Android）
- **プラットフォーム**: Android

```javascript
<StatusBar translucent={true} />
```

### メソッド

#### setStatusBarStyle(style, animated)

ステータスバーのスタイルを設定します。

```javascript
import { setStatusBarStyle } from 'expo-status-bar';

setStatusBarStyle('light');
```

**パラメータ**:
- `style` ('light' | 'dark' | 'auto'): スタイル
- `animated` (boolean, オプション): アニメーション有効化

#### setStatusBarHidden(hidden, animation)

ステータスバーの表示/非表示を設定します。

```javascript
import { setStatusBarHidden } from 'expo-status-bar';

setStatusBarHidden(true, 'fade');
```

**パラメータ**:
- `hidden` (boolean): 非表示にするかどうか
- `animation` ('none' | 'fade' | 'slide', オプション): アニメーションタイプ

#### setStatusBarBackgroundColor(color, animated)

ステータスバーの背景色を設定します（Androidのみ）。

```javascript
import { setStatusBarBackgroundColor } from 'expo-status-bar';

setStatusBarBackgroundColor('#ff0000', true);
```

**パラメータ**:
- `color` (string): 背景色
- `animated` (boolean, オプション): アニメーション有効化

#### setStatusBarTranslucent(translucent)

ステータスバーの半透明設定を変更します（Androidのみ）。

```javascript
import { setStatusBarTranslucent } from 'expo-status-bar';

setStatusBarTranslucent(true);
```

## 使用例

### ダークモード対応

```javascript
import { StatusBar } from 'expo-status-bar';
import { useColorScheme } from 'react-native';

export default function App() {
  const colorScheme = useColorScheme();

  return (
    <>
      <StatusBar style={colorScheme === 'dark' ? 'light' : 'dark'} />
      {/* アプリのコンテンツ */}
    </>
  );
}
```

### 画面ごとに異なる設定

```javascript
function HomeScreen() {
  return (
    <View>
      <StatusBar style="light" backgroundColor="#000" />
      {/* ホーム画面のコンテンツ */}
    </View>
  );
}

function SettingsScreen() {
  return (
    <View>
      <StatusBar style="dark" backgroundColor="#fff" />
      {/* 設定画面のコンテンツ */}
    </View>
  );
}
```

### 動的な変更

```javascript
import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';
import { Button, View } from 'react-native';

export default function App() {
  const [isLight, setIsLight] = useState(true);

  return (
    <View>
      <StatusBar
        style={isLight ? 'light' : 'dark'}
        animated={true}
      />
      <Button
        title="トグル"
        onPress={() => setIsLight(!isLight)}
      />
    </View>
  );
}
```

### フルスクリーン体験

```javascript
import { StatusBar } from 'expo-status-bar';

export default function VideoPlayer() {
  return (
    <View>
      <StatusBar hidden={true} />
      {/* ビデオプレイヤー */}
    </View>
  );
}
```

## 重要な注意事項

### 複数のStatusBarコンポーネント

複数の`StatusBar`コンポーネントをマウントできます。プロパティはマウント順にマージされます。

```javascript
<View>
  <StatusBar style="light" />
  <StatusBar backgroundColor="#ff0000" />
  {/* style="light"とbackgroundColor="#ff0000"の両方が適用される */}
</View>
```

### プラットフォーム固有の動作

- **iOS**: `backgroundColor`プロパティは無視されます
- **Android**: デフォルトで`translucent={true}`です
- **Web**: ステータスバーの制御はできません
- **tvOS**: ステータスバーは存在しません

### autoスタイル

`style="auto"`は、デバイスのカラースキーム（ライト/ダーク）に基づいて自動的にテキスト色を選択します。

```javascript
<StatusBar style="auto" />
// ライトモード → dark（暗いテキスト）
// ダークモード → light（明るいテキスト）
```

## ベストプラクティス

1. **画面ごとに設定**: 各画面で適切なステータスバースタイルを設定
2. **アニメーションを使用**: スムーズな遷移のため`animated={true}`を使用
3. **ダークモード対応**: `useColorScheme()`で自動対応
4. **一貫性を保つ**: アプリ全体で一貫したステータスバースタイルを維持

```javascript
// 推奨パターン
import { StatusBar } from 'expo-status-bar';
import { useColorScheme } from 'react-native';

export default function AppContent() {
  const colorScheme = useColorScheme();

  return (
    <>
      <StatusBar
        style={colorScheme === 'dark' ? 'light' : 'dark'}
        animated={true}
      />
      {/* アプリのコンテンツ */}
    </>
  );
}
```

## トラブルシューティング

### ステータスバーが表示されない

- Androidで`translucent={false}`を試す
- `hidden={false}`が設定されているか確認

### 色が適用されない

- iOSでは`backgroundColor`は機能しません
- プラットフォーム固有の設定を確認

### 変更が反映されない

- `animated={true}`を追加してアニメーション遷移を確認
- コンポーネントの再レンダリングを確認
