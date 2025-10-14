# SystemUI

システムUI要素、特にルートビューの背景色やAndroidでのユーザーインターフェーススタイルのロックと対話するためのライブラリです。

## インストール

ターミナルで以下のコマンドを実行してライブラリをインストールします。

```bash
npx expo install expo-system-ui
```

## 概要

`expo-system-ui`は、以下のシステムUI要素との対話を提供します。

- ルートビューの背景色
- Androidでのユーザーインターフェーススタイルのロック

## プラットフォームサポート

- Android
- iOS
- tvOS
- Web

## 主な機能

- Reactツリーの外側にあるUI要素との対話
- ルートビューの背景色の制御
- システムUIの外観管理

## API リファレンス

### getBackgroundColorAsync()

現在のルートビューの背景色を取得します。

```javascript
import * as SystemUI from 'expo-system-ui';

const color = await SystemUI.getBackgroundColorAsync();
console.log('現在の背景色:', color);
```

**戻り値**: `Promise<string | null>` - 現在の背景色、または設定されていない場合は`null`

### setBackgroundColorAsync(color)

ルートビューの背景色を変更します。

```javascript
import * as SystemUI from 'expo-system-ui';

await SystemUI.setBackgroundColorAsync('black');
```

**パラメータ**:
- `color` (string): 任意の有効なCSS 3 (SVG)カラー

**戻り値**: `Promise<void>` - 完了時にresolveされる

**注意**: このメソッドは、コンポーネントの外側、ルートファイルで呼び出す必要があります。

## 使用例

### 基本的な使用

```javascript
import * as SystemUI from 'expo-system-ui';

// アプリのルートファイル（App.jsなど）
SystemUI.setBackgroundColorAsync('black');

export default function App() {
  return (
    // アプリのコンテンツ
  );
}
```

### 背景色の取得と設定

```javascript
import * as SystemUI from 'expo-system-ui';
import { useEffect, useState } from 'react';

export default function App() {
  const [currentColor, setCurrentColor] = useState(null);

  useEffect(() => {
    // 現在の背景色を取得
    SystemUI.getBackgroundColorAsync().then(color => {
      setCurrentColor(color);
      console.log('現在の色:', color);
    });

    // 背景色を設定
    SystemUI.setBackgroundColorAsync('#1a1a1a');
  }, []);

  return (
    // アプリのコンテンツ
  );
}
```

### ダークモード対応

```javascript
import * as SystemUI from 'expo-system-ui';
import { useColorScheme } from 'react-native';
import { useEffect } from 'react';

export default function App() {
  const colorScheme = useColorScheme();

  useEffect(() => {
    // カラースキームに基づいて背景色を設定
    const backgroundColor = colorScheme === 'dark' ? '#000000' : '#ffffff';
    SystemUI.setBackgroundColorAsync(backgroundColor);
  }, [colorScheme]);

  return (
    // アプリのコンテンツ
  );
}
```

### テーマの切り替え

```javascript
import * as SystemUI from 'expo-system-ui';
import { useState } from 'react';
import { Button, View } from 'react-native';

const THEMES = {
  light: '#ffffff',
  dark: '#000000',
  blue: '#1e3a8a',
  green: '#065f46'
};

export default function App() {
  const [theme, setTheme] = useState('light');

  const changeTheme = async (newTheme) => {
    await SystemUI.setBackgroundColorAsync(THEMES[newTheme]);
    setTheme(newTheme);
  };

  return (
    <View>
      <Button title="Light" onPress={() => changeTheme('light')} />
      <Button title="Dark" onPress={() => changeTheme('dark')} />
      <Button title="Blue" onPress={() => changeTheme('blue')} />
      <Button title="Green" onPress={() => changeTheme('green')} />
    </View>
  );
}
```

### グラデーション背景

```javascript
import * as SystemUI from 'expo-system-ui';

// 注意: SystemUIは単色のみサポート
// グラデーションには、Reactコンポーネントを使用してください

export default function App() {
  // 背景の基本色を設定
  SystemUI.setBackgroundColorAsync('#1a1a1a');

  return (
    <LinearGradient
      colors={['#1a1a1a', '#2a2a2a']}
      style={{ flex: 1 }}
    >
      {/* アプリのコンテンツ */}
    </LinearGradient>
  );
}
```

### アプリ起動時の初期化

```javascript
import * as SystemUI from 'expo-system-ui';
import { useEffect } from 'react';

// アプリのルートファイル
SystemUI.setBackgroundColorAsync('#000000');

export default function App() {
  useEffect(() => {
    // アプリの初期化処理
    async function initialize() {
      // 現在の背景色を確認
      const currentColor = await SystemUI.getBackgroundColorAsync();
      console.log('アプリ起動時の背景色:', currentColor);
    }

    initialize();
  }, []);

  return (
    // アプリのコンテンツ
  );
}
```

### カスタムカラーパレット

```javascript
import * as SystemUI from 'expo-system-ui';

const ColorPalette = {
  background: {
    light: '#f5f5f5',
    dark: '#121212',
    custom: '#1e293b'
  },
  primary: '#3b82f6',
  secondary: '#8b5cf6'
};

// 背景色を設定
SystemUI.setBackgroundColorAsync(ColorPalette.background.dark);
```

## 色の指定

サポートされている色の形式:

### 1. 名前付きカラー

```javascript
SystemUI.setBackgroundColorAsync('black');
SystemUI.setBackgroundColorAsync('white');
SystemUI.setBackgroundColorAsync('red');
```

### 2. 16進数カラーコード

```javascript
SystemUI.setBackgroundColorAsync('#000000');
SystemUI.setBackgroundColorAsync('#ffffff');
SystemUI.setBackgroundColorAsync('#ff0000');
```

### 3. RGB/RGBA

```javascript
SystemUI.setBackgroundColorAsync('rgb(0, 0, 0)');
SystemUI.setBackgroundColorAsync('rgba(0, 0, 0, 0.8)');
```

### 4. HSL/HSLA

```javascript
SystemUI.setBackgroundColorAsync('hsl(0, 0%, 0%)');
SystemUI.setBackgroundColorAsync('hsla(0, 0%, 0%, 0.8)');
```

## ベストプラクティス

### 1. ルートレベルでの設定

```javascript
// App.js - アプリのエントリーポイント
import * as SystemUI from 'expo-system-ui';

// コンポーネント定義の外で呼び出す
SystemUI.setBackgroundColorAsync('#000000');

export default function App() {
  // アプリのコンテンツ
}
```

### 2. テーマプロバイダーとの統合

```javascript
import * as SystemUI from 'expo-system-ui';
import { ThemeProvider, useTheme } from './theme';

function AppContent() {
  const { colors } = useTheme();

  useEffect(() => {
    SystemUI.setBackgroundColorAsync(colors.background);
  }, [colors.background]);

  return (
    // アプリのコンテンツ
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
}
```

### 3. エラーハンドリング

```javascript
import * as SystemUI from 'expo-system-ui';

async function setSystemBackground(color) {
  try {
    await SystemUI.setBackgroundColorAsync(color);
  } catch (error) {
    console.error('背景色の設定に失敗:', error);
    // フォールバック処理
  }
}
```

### 4. パフォーマンスの最適化

```javascript
import * as SystemUI from 'expo-system-ui';
import { useEffect, useRef } from 'react';

export default function App() {
  const colorRef = useRef(null);

  useEffect(() => {
    const newColor = '#000000';

    // 同じ色への不要な設定を避ける
    if (colorRef.current !== newColor) {
      SystemUI.setBackgroundColorAsync(newColor);
      colorRef.current = newColor;
    }
  }, []);
}
```

## プラットフォーム固有の動作

### Android

- ルートビューの背景色を完全に制御可能
- ステータスバーとナビゲーションバーの色との調和に注意

### iOS

- ルートビューの背景色を設定可能
- セーフエリアとの組み合わせに注意

### Web

- ボディ要素の背景色を制御
- CSSとの互換性を考慮

### tvOS

- 基本的な背景色制御をサポート
- TV特有のUIガイドラインに従う

## トラブルシューティング

### 背景色が適用されない

1. **タイミング**: コンポーネントの外で呼び出しているか確認
2. **色の形式**: 有効なCSS色形式を使用しているか確認
3. **プラットフォーム**: 対象プラットフォームがサポートしているか確認

### ちらつきが発生する

```javascript
// アプリの最初に設定を行う
import * as SystemUI from 'expo-system-ui';

// index.jsまたはApp.jsの最初
SystemUI.setBackgroundColorAsync('#000000');

// その後でコンポーネントをレンダリング
```

### 色が期待通りでない

```javascript
// 色の形式を確認
const isValidColor = (color) => {
  const s = new Option().style;
  s.color = color;
  return s.color !== '';
};

console.log(isValidColor('#000000')); // true
console.log(isValidColor('black')); // true
console.log(isValidColor('invalid')); // false
```

## バージョン情報

- **バンドルバージョン**: ~6.0.7

## 関連API

- StatusBar: ステータスバーの制御
- NavigationBar: ナビゲーションバーの制御（Android）
- SafeAreaView: セーフエリアの管理

## まとめ

`expo-system-ui`は、Reactツリーの外側にあるシステムUI要素を制御するためのシンプルで強力なAPIを提供します。アプリの背景色を簡単に管理し、一貫したユーザー体験を実現できます。
