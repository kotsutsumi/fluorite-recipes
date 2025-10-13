# TVアプリのビルド

Expo for TVを使用して、Android TVとApple TV向けのアプリをビルドする方法を学びます。

## 概要

Expo for TVを使用すると、モバイルとTVの両方のデバイスをターゲットにしたReact Nativeアプリを構築できます。

**サポートされるプラットフォーム**：
- Android TV
- Apple TV (tvOS 17+)

**システム要件**：
- Node.js LTS
- Android Studio（Android TV用）
- Xcode 16+（Apple TV用）

## プロジェクトの作成

### TV専用プロジェクト

```bash
# TV専用プロジェクトを作成
npx create-expo-app my-tv-app --template expo-template-blank-tv

cd my-tv-app
```

### 既存プロジェクトをTV対応に

```bash
# 既存プロジェクトのディレクトリで
npm install react-native-tvos
```

**package.json**を更新：
```json
{
  "dependencies": {
    "react-native": "npm:react-native-tvos@latest"
  }
}
```

## 設定

### app.json

```json
{
  "expo": {
    "name": "My TV App",
    "slug": "my-tv-app",
    "version": "1.0.0",
    "platforms": ["android", "ios", "tv"],

    // Android TV設定
    "android": {
      "package": "com.mycompany.mytvapp"
    },

    // Apple TV設定
    "ios": {
      "bundleIdentifier": "com.mycompany.mytvapp",
      "supportsTablet": false
    },

    "plugins": [
      "@react-native-tvos/config-tv"
    ]
  }
}
```

### TV Config Pluginの追加

```bash
npm install @react-native-tvos/config-tv
```

**app.json**に追加：
```json
{
  "expo": {
    "plugins": [
      "@react-native-tvos/config-tv"
    ]
  }
}
```

## プロジェクトのプリビルド

```bash
# EXPO_TV環境変数を設定してプリビルド
EXPO_TV=1 npx expo prebuild --clean
```

**この処理により**：
- TV固有のネイティブコード設定が追加
- Android TVとApple TV用のプロジェクトファイルが生成

## 開発

### 開発サーバーの起動

```bash
# EXPO_TV環境変数を設定して開発サーバーを起動
EXPO_TV=1 npx expo start
```

### Android TVでの実行

```bash
# Android TVエミュレーターで実行
EXPO_TV=1 npx expo run:android

# または、接続されたAndroid TVデバイスで実行
EXPO_TV=1 npx expo run:android --device
```

### Apple TVでの実行

```bash
# Apple TVシミュレーターで実行
EXPO_TV=1 npx expo run:ios --scheme MyTVApp-tvOS

# または、接続されたApple TVデバイスで実行
EXPO_TV=1 npx expo run:ios --scheme MyTVApp-tvOS --device
```

## TV UIの考慮事項

### フォーカス可能な要素

```typescript
import { TouchableOpacity, View, Text } from 'react-native';

export default function TVButton() {
  return (
    <TouchableOpacity
      // TVでフォーカス可能
      hasTVPreferredFocus={false}
      // フォーカススタイル
      style={({ focused }) => ({
        backgroundColor: focused ? '#007AFF' : '#333333',
        padding: 20,
        borderRadius: 8,
      })}
      onPress={() => console.log('Button pressed')}
    >
      <Text style={{ color: '#FFFFFF', fontSize: 18 }}>Click Me</Text>
    </TouchableOpacity>
  );
}
```

### フォーカス管理

```typescript
import { useTVEventHandler } from 'react-native';
import { useState } from 'react';

export default function TVNavigationComponent() {
  const [selectedIndex, setSelectedIndex] = useState(0);

  useTVEventHandler((event) => {
    // リモコンイベントを処理
    if (event.eventType === 'right') {
      setSelectedIndex((prev) => Math.min(prev + 1, items.length - 1));
    } else if (event.eventType === 'left') {
      setSelectedIndex((prev) => Math.max(prev - 1, 0));
    } else if (event.eventType === 'select') {
      handleItemSelect(selectedIndex);
    }
  });

  return (
    <View>
      {items.map((item, index) => (
        <TouchableOpacity
          key={item.id}
          hasTVPreferredFocus={index === selectedIndex}
        >
          <Text>{item.title}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}
```

### リモコン入力の処理

```typescript
import { useTVEventHandler } from 'react-native';

export default function TVRemoteHandler() {
  useTVEventHandler((event) => {
    console.log('TV Event:', event.eventType);

    switch (event.eventType) {
      case 'up':
        // 上ボタンが押された
        handleUpPress();
        break;
      case 'down':
        // 下ボタンが押された
        handleDownPress();
        break;
      case 'left':
        // 左ボタンが押された
        handleLeftPress();
        break;
      case 'right':
        // 右ボタンが押された
        handleRightPress();
        break;
      case 'select':
        // 選択ボタンが押された
        handleSelectPress();
        break;
      case 'playPause':
        // 再生/一時停止ボタンが押された
        handlePlayPausePress();
        break;
      case 'menu':
        // メニューボタンが押された
        handleMenuPress();
        break;
    }
  });

  return (
    // コンポーネントのUI
  );
}
```

## React Navigationとの統合

### TV向けナビゲーション

```typescript
// app/index.tsx
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Platform } from 'react-native';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <Stack.Navigator
      screenOptions={{
        // TVでのフォーカススタイル
        headerShown: Platform.isTV,
      }}
    >
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="Details" component={DetailsScreen} />
    </Stack.Navigator>
  );
}
```

### TV用カスタムナビゲーション

```typescript
import { FlatList, TouchableOpacity, View, Text } from 'react-native';
import { useState } from 'react';

export default function TVMenuScreen() {
  const [selectedItem, setSelectedItem] = useState(0);

  const menuItems = [
    { id: '1', title: 'Home', screen: 'Home' },
    { id: '2', title: 'Movies', screen: 'Movies' },
    { id: '3', title: 'TV Shows', screen: 'TVShows' },
    { id: '4', title: 'Settings', screen: 'Settings' },
  ];

  return (
    <FlatList
      data={menuItems}
      horizontal
      renderItem={({ item, index }) => (
        <TouchableOpacity
          hasTVPreferredFocus={index === selectedItem}
          onPress={() => navigation.navigate(item.screen)}
          style={({ focused }) => ({
            padding: 20,
            backgroundColor: focused ? '#007AFF' : '#333333',
          })}
        >
          <Text style={{ color: '#FFFFFF' }}>{item.title}</Text>
        </TouchableOpacity>
      )}
      keyExtractor={(item) => item.id}
    />
  );
}
```

## ビルド

### EAS Buildでのビルド

**eas.json**:
```json
{
  "build": {
    "android-tv": {
      "android": {
        "buildType": "apk"
      },
      "env": {
        "EXPO_TV": "1"
      }
    },
    "ios-tv": {
      "ios": {
        "simulator": false
      },
      "env": {
        "EXPO_TV": "1"
      }
    }
  }
}
```

**ビルドコマンド**：
```bash
# Android TVビルド
npx eas build --platform android --profile android-tv

# Apple TVビルド
npx eas build --platform ios --profile ios-tv
```

## サポートされているライブラリ

### Expo SDKライブラリ

40以上のExpo SDKライブラリがTVと互換性があります：

**メディア**：
- `expo-av`: 音声とビデオ再生
- `expo-image`: 画像表示
- `expo-video`: ビデオコンポーネント

**ストレージ**：
- `expo-file-system`: ファイルシステムアクセス
- `expo-secure-store`: 安全なストレージ

**ネットワーク**：
- `expo-network`: ネットワーク情報
- `expo-web-browser`: ブラウザ機能

**その他**：
- `expo-constants`: アプリ定数
- `expo-device`: デバイス情報
- `expo-font`: カスタムフォント

### サードパーティライブラリ

多くのReact NativeライブラリがTV対応：

- React Navigation: 完全サポート
- React Native Video: TV対応
- React Native SVG: TV対応

## プラットフォーム検出

### TVプラットフォームの確認

```typescript
import { Platform } from 'react-native';

// TV環境かどうかを確認
if (Platform.isTV) {
  console.log('Running on TV');

  // 特定のTVプラットフォームを確認
  if (Platform.OS === 'android') {
    console.log('Running on Android TV');
  } else if (Platform.OS === 'ios') {
    console.log('Running on Apple TV');
  }
}
```

### TV固有のコード

```typescript
// ファイル拡張子を使用
// Button.tv.tsx（TV用）
// Button.tsx（モバイル用）

// または、条件分岐
import { Platform } from 'react-native';

export default function MyComponent() {
  if (Platform.isTV) {
    return <TVSpecificComponent />;
  }

  return <MobileComponent />;
}
```

## ベストプラクティス

### 1. 大きなタッチターゲット

```typescript
// ✅ 推奨: TV向けに大きなボタン
<TouchableOpacity
  style={{
    padding: 20, // 最小44x44pt
    minWidth: 200,
    minHeight: 60,
  }}
>
  <Text style={{ fontSize: 24 }}>Button Text</Text>
</TouchableOpacity>

// ❌ 非推奨: 小さなボタン
<TouchableOpacity style={{ padding: 5 }}>
  <Text style={{ fontSize: 12 }}>Button</Text>
</TouchableOpacity>
```

### 2. 明確なフォーカス表示

```typescript
<TouchableOpacity
  style={({ focused }) => ({
    backgroundColor: focused ? '#007AFF' : '#333333',
    borderWidth: focused ? 3 : 0,
    borderColor: '#FFFFFF',
    padding: 20,
  })}
>
  <Text style={{ color: '#FFFFFF' }}>Focused Button</Text>
</TouchableOpacity>
```

### 3. 適切なテキストサイズ

```typescript
// TV向けのテキストサイズ
const styles = StyleSheet.create({
  title: {
    fontSize: Platform.isTV ? 48 : 24,
    fontWeight: 'bold',
  },
  body: {
    fontSize: Platform.isTV ? 24 : 16,
  },
  caption: {
    fontSize: Platform.isTV ? 20 : 12,
  },
});
```

### 4. シンプルなナビゲーション

```typescript
// ✅ 推奨: シンプルで直感的なナビゲーション
<View style={{ flexDirection: 'row' }}>
  <TVButton title="Home" />
  <TVButton title="Movies" />
  <TVButton title="Settings" />
</View>

// ❌ 非推奨: 複雑な多層ナビゲーション
<ComplexNestedNavigator />
```

## 制限事項

### DevClientの制限

- Apple TVでの部分的な機能
- 一部の開発ツールが利用不可

### サポートされない機能

- タッチジェスチャー（スワイプ、ピンチ）
- 一部のモバイル固有のAPI
- カメラ、GPS等のハードウェア機能

## トラブルシューティング

### 問題1: TVビルドが失敗する

**原因**: `EXPO_TV`環境変数が設定されていない

**解決策**：
```bash
# プリビルドとビルドで環境変数を設定
EXPO_TV=1 npx expo prebuild --clean
EXPO_TV=1 npx expo run:android
```

### 問題2: フォーカスが機能しない

**原因**: `hasTVPreferredFocus`プロパティが設定されていない

**解決策**：
```typescript
<TouchableOpacity
  hasTVPreferredFocus={true}
  style={({ focused }) => ({
    backgroundColor: focused ? '#007AFF' : '#333333',
  })}
>
  <Text>Button</Text>
</TouchableOpacity>
```

### 問題3: リモコンイベントが検出されない

**原因**: `useTVEventHandler`が正しく使用されていない

**解決策**：
```typescript
import { useTVEventHandler } from 'react-native';

export default function TVComponent() {
  useTVEventHandler((event) => {
    console.log('TV Event:', event.eventType);
    // イベント処理
  });

  return (
    // コンポーネント
  );
}
```

## まとめ

Expo for TVは、以下の機能を提供します：

### サポートされるプラットフォーム
- **Android TV**: Android TVデバイスとエミュレーター
- **Apple TV**: tvOS 17+のApple TVデバイスとシミュレーター

### 主な機能
- モバイルとTVの統一コードベース
- TV固有のUI/UXコンポーネント
- リモコン入力の処理
- フォーカス管理

### 開発ワークフロー
- `EXPO_TV=1`環境変数でTVモード有効化
- EAS Buildでの別プロファイル設定
- TV固有のテストとシミュレーション

### ベストプラクティス
- 大きなタッチターゲット（最小44x44pt）
- 明確なフォーカス表示
- TV向けの大きなテキストサイズ
- シンプルなナビゲーション

これらのガイドラインに従うことで、モバイルとTV両方で動作する高品質なアプリを構築できます。
