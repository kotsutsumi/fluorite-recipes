# Font

React Nativeコンポーネントでカスタムフォントを読み込んで使用するためのライブラリです。Android、iOS、tvOS、Webプラットフォームで動作します。

## 概要

Expo Fontを使用すると、以下のことが可能になります：
- WebやローカルソースからフォントをロードInterview
- ランタイムでのフォント読み込み
- アプリ設定プラグイン経由での設定
- クロスプラットフォーム互換性

## インストール

```bash
npx expo install expo-font
```

## 基本的な使用方法

### useFontsフックを使用

```javascript
import { useFonts } from 'expo-font';
import { Text, View } from 'react-native';

export default function App() {
  const [fontsLoaded] = useFonts({
    'Inter-Black': require('./assets/fonts/Inter-Black.otf'),
  });

  if (!fontsLoaded) {
    return null; // またはローディングコンポーネント
  }

  return (
    <View>
      <Text style={{ fontFamily: 'Inter-Black' }}>
        カスタムフォントのテキスト
      </Text>
    </View>
  );
}
```

### 複数のフォントを読み込む

```javascript
import { useFonts } from 'expo-font';

export default function App() {
  const [fontsLoaded] = useFonts({
    'Inter-Black': require('./assets/fonts/Inter-Black.otf'),
    'Inter-Bold': require('./assets/fonts/Inter-Bold.otf'),
    'Inter-Regular': require('./assets/fonts/Inter-Regular.otf'),
    'Inter-Light': require('./assets/fonts/Inter-Light.otf'),
  });

  if (!fontsLoaded) {
    return null;
  }

  return (
    <View>
      <Text style={{ fontFamily: 'Inter-Black' }}>Black</Text>
      <Text style={{ fontFamily: 'Inter-Bold' }}>Bold</Text>
      <Text style={{ fontFamily: 'Inter-Regular' }}>Regular</Text>
      <Text style={{ fontFamily: 'Inter-Light' }}>Light</Text>
    </View>
  );
}
```

## API

### Hooks

#### `useFonts(fonts)`

フォントをロードし、読み込み状態を返すReactフックです。

```javascript
const [fontsLoaded, error] = useFonts({
  'FontName': require('./path/to/font.otf'),
});
```

**パラメータ:**
- `fonts`: フォント名とソースのマッピングオブジェクト

**戻り値:**
- 配列の最初の要素: フォントが読み込まれたかどうかの真偽値
- 配列の2番目の要素: エラーオブジェクト（エラーがある場合）

### メソッド

#### `loadAsync(fonts)`

フォントを非同期で読み込みます。

```javascript
import * as Font from 'expo-font';

await Font.loadAsync({
  'custom-font': require('./assets/fonts/custom-font.ttf'),
});
```

**パラメータ:**
- `fonts`: フォント名とソース（require()またはURL）のマッピング

#### `isLoaded(fontFamily)`

特定のフォントが読み込まれているかどうかを確認します。

```javascript
import * as Font from 'expo-font';

const isLoaded = Font.isLoaded('Inter-Black');
console.log('フォントが読み込まれています:', isLoaded);
```

**パラメータ:**
- `fontFamily`: 確認するフォント名

**戻り値:**
- フォントが読み込まれている場合は`true`

#### `isLoading(fontFamily)`

特定のフォントが現在読み込み中かどうかを確認します。

```javascript
import * as Font from 'expo-font';

const isLoading = Font.isLoading('Inter-Black');
console.log('フォントを読み込み中:', isLoading);
```

#### `getLoadedFonts()`

読み込まれたすべてのフォントのリストを取得します。

```javascript
import * as Font from 'expo-font';

const loadedFonts = Font.getLoadedFonts();
console.log('読み込まれたフォント:', loadedFonts);
```

**戻り値:**
- 読み込まれたフォント名の配列

## 設定

### Config Pluginでの設定

`app.json`または`app.config.js`でフォントを設定できます：

```json
{
  "expo": {
    "plugins": [
      [
        "expo-font",
        {
          "fonts": [
            "./assets/fonts/Inter-Black.otf",
            "./assets/fonts/Inter-Bold.otf",
            "./assets/fonts/Inter-Regular.otf"
          ]
        }
      ]
    ]
  }
}
```

この設定により、フォントはビルド時に埋め込まれます。

### 動的 vs 静的読み込み

**動的読み込み（ランタイム）:**
```javascript
// アプリ起動時に読み込まれる
const [fontsLoaded] = useFonts({
  'Inter': require('./assets/fonts/Inter.otf'),
});
```

**静的読み込み（ビルド時）:**
```json
// app.jsonで設定
{
  "expo": {
    "plugins": [
      ["expo-font", { "fonts": ["./assets/fonts/Inter.otf"] }]
    ]
  }
}
```

## 使用例

### Google Fontsを使用

```javascript
import { useFonts } from 'expo-font';

export default function App() {
  const [fontsLoaded] = useFonts({
    'Roboto': 'https://fonts.gstatic.com/s/roboto/v30/KFOmCnqEu92Fr1Mu4mxK.woff2',
  });

  if (!fontsLoaded) {
    return null;
  }

  return (
    <Text style={{ fontFamily: 'Roboto' }}>
      Google Fontsを使用したテキスト
    </Text>
  );
}
```

### エラーハンドリング

```javascript
import { useFonts } from 'expo-font';
import { Text, View } from 'react-native';

export default function App() {
  const [fontsLoaded, error] = useFonts({
    'CustomFont': require('./assets/fonts/CustomFont.otf'),
  });

  if (error) {
    console.error('フォント読み込みエラー:', error);
    return (
      <View>
        <Text>フォントの読み込みに失敗しました</Text>
      </View>
    );
  }

  if (!fontsLoaded) {
    return null;
  }

  return (
    <Text style={{ fontFamily: 'CustomFont' }}>
      カスタムフォントのテキスト
    </Text>
  );
}
```

### ローディング画面の表示

```javascript
import { useFonts } from 'expo-font';
import { ActivityIndicator, View } from 'react-native';

export default function App() {
  const [fontsLoaded] = useFonts({
    'Inter': require('./assets/fonts/Inter.otf'),
  });

  if (!fontsLoaded) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <Text style={{ fontFamily: 'Inter' }}>
      フォントが読み込まれました
    </Text>
  );
}
```

### Expo SplashScreenとの統合

```javascript
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';

// スプラッシュスクリーンを表示し続ける
SplashScreen.preventAutoHideAsync();

export default function App() {
  const [fontsLoaded] = useFonts({
    'Inter': require('./assets/fonts/Inter.otf'),
  });

  useEffect(() => {
    if (fontsLoaded) {
      // フォントが読み込まれたらスプラッシュスクリーンを非表示
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    return null;
  }

  return (
    <Text style={{ fontFamily: 'Inter' }}>
      アプリのコンテンツ
    </Text>
  );
}
```

### フォントウェイトとスタイルの管理

```javascript
import { useFonts } from 'expo-font';

export default function App() {
  const [fontsLoaded] = useFonts({
    'Inter-Thin': require('./assets/fonts/Inter-Thin.otf'),
    'Inter-Light': require('./assets/fonts/Inter-Light.otf'),
    'Inter-Regular': require('./assets/fonts/Inter-Regular.otf'),
    'Inter-Medium': require('./assets/fonts/Inter-Medium.otf'),
    'Inter-SemiBold': require('./assets/fonts/Inter-SemiBold.otf'),
    'Inter-Bold': require('./assets/fonts/Inter-Bold.otf'),
    'Inter-ExtraBold': require('./assets/fonts/Inter-ExtraBold.otf'),
    'Inter-Black': require('./assets/fonts/Inter-Black.otf'),
  });

  if (!fontsLoaded) {
    return null;
  }

  return (
    <View>
      <Text style={{ fontFamily: 'Inter-Thin' }}>Thin (100)</Text>
      <Text style={{ fontFamily: 'Inter-Light' }}>Light (300)</Text>
      <Text style={{ fontFamily: 'Inter-Regular' }}>Regular (400)</Text>
      <Text style={{ fontFamily: 'Inter-Medium' }}>Medium (500)</Text>
      <Text style={{ fontFamily: 'Inter-SemiBold' }}>SemiBold (600)</Text>
      <Text style={{ fontFamily: 'Inter-Bold' }}>Bold (700)</Text>
      <Text style={{ fontFamily: 'Inter-ExtraBold' }}>ExtraBold (800)</Text>
      <Text style={{ fontFamily: 'Inter-Black' }}>Black (900)</Text>
    </View>
  );
}
```

### 非同期読み込み

```javascript
import * as Font from 'expo-font';
import { useEffect, useState } from 'react';

export default function App() {
  const [fontsLoaded, setFontsLoaded] = useState(false);

  useEffect(() => {
    async function loadFonts() {
      await Font.loadAsync({
        'CustomFont': require('./assets/fonts/CustomFont.otf'),
      });
      setFontsLoaded(true);
    }

    loadFonts();
  }, []);

  if (!fontsLoaded) {
    return null;
  }

  return (
    <Text style={{ fontFamily: 'CustomFont' }}>
      カスタムフォント
    </Text>
  );
}
```

## サポートされるフォントフォーマット

- **OTF** (OpenType Font)
- **TTF** (TrueType Font)
- **WOFF** (Web Open Font Format) - Webのみ
- **WOFF2** (Web Open Font Format 2) - Webのみ

## プラットフォーム互換性

| プラットフォーム | サポート |
|----------------|---------|
| Android        | ✅      |
| iOS            | ✅      |
| tvOS           | ✅      |
| Web            | ✅      |

## ベストプラクティス

1. **フォントのプリロード**: アプリの起動時にフォントをロードして、ちらつきを防ぐ
2. **エラーハンドリング**: フォント読み込みの失敗に備えてフォールバックを用意
3. **ローディング状態**: フォント読み込み中は適切なローディング表示を行う
4. **ファイルサイズ**: 必要なウェイトのみをロードしてアプリサイズを最適化
5. **キャッシュ**: フォントは自動的にキャッシュされ、再ロードは不要

## トラブルシューティング

### フォントが表示されない

```javascript
// 問題: フォント名が正しくない
<Text style={{ fontFamily: 'Inter-Black.otf' }}>❌</Text>

// 解決: 拡張子なしのフォント名を使用
<Text style={{ fontFamily: 'Inter-Black' }}>✅</Text>
```

### フォント読み込みのタイミング

```javascript
// 問題: フォントが読み込まれる前にレンダリング
const [fontsLoaded] = useFonts({...});
return <Text style={{ fontFamily: 'CustomFont' }}>テキスト</Text>;

// 解決: 読み込み確認を追加
if (!fontsLoaded) return null;
return <Text style={{ fontFamily: 'CustomFont' }}>テキスト</Text>;
```

### Androidでのフォント問題

Androidでは、フォント名が大文字小文字を区別します。正確なフォント名を使用してください。

## パフォーマンスの考慮事項

- フォントファイルはアプリバンドルサイズに影響します
- 必要最小限のフォントウェイトのみをロード
- ビルド時のフォント埋め込みを検討（起動時間の改善）
- Webではフォントのサブセット化を検討

## 関連リソース

- [Google Fonts](https://fonts.google.com/)
- [Font Squirrel](https://www.fontsquirrel.com/)
- [DaFont](https://www.dafont.com/)
