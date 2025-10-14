# SplashScreen

ExpoおよびReact Nativeアプリケーションでネイティブスプラッシュスクリーンの表示を制御するライブラリです。

## インストール

ターミナルで以下のコマンドを実行してライブラリをインストールします。

```bash
npx expo install expo-splash-screen
```

## 概要

`expo-splash-screen`ライブラリは、アプリ初期化中のネイティブスプラッシュスクリーンの表示を制御する機能を提供します。

## プラットフォームサポート

- Android
- iOS
- tvOS

## 主な機能

- アプリの初期化中にスプラッシュスクリーンを表示
- スプラッシュスクリーンの外観を設定可能
- アニメーションのサポート
- 自動非表示の防止と手動制御

## 基本的な使用方法

```typescript
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';

// スプラッシュスクリーンの自動非表示を防止
SplashScreen.preventAutoHideAsync();

export default function App() {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    // リソースの読み込み処理
    loadResourcesAsync().then(() => {
      setLoaded(true);
    });
  }, []);

  useEffect(() => {
    // 準備ができたらスプラッシュスクリーンを非表示
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  // アプリのコンテンツ
}
```

## 設定オプション

### app.jsonでの設定

```json
{
  "expo": {
    "plugins": [
      [
        "expo-splash-screen",
        {
          "backgroundColor": "#232323",
          "image": "./assets/splash-icon.png",
          "imageWidth": 200,
          "resizeMode": "contain",
          "dark": {
            "backgroundColor": "#000000",
            "image": "./assets/splash-icon-dark.png"
          }
        }
      ]
    ]
  }
}
```

### 設定可能なプロパティ

- `backgroundColor` (string): 背景色
- `image` (string): スプラッシュ画像のパス
- `imageWidth` (number): 画像の幅
- `resizeMode` ('contain' | 'cover'): 画像のリサイズモード
- `dark` (object): ダークモード用の設定

## API リファレンス

### hide()

スプラッシュスクリーンを即座に非表示にします。

```javascript
SplashScreen.hide();
```

### hideAsync()

スプラッシュスクリーンを非同期で非表示にします。

```javascript
await SplashScreen.hideAsync();
```

**戻り値**: 完了時にresolveされるPromise。

### preventAutoHideAsync()

スプラッシュスクリーンの自動非表示を防止します。

```javascript
SplashScreen.preventAutoHideAsync();
```

**注意**: このメソッドは、アプリのルートコンポーネントがマウントされる前に呼び出す必要があります。

### setOptions(options)

スプラッシュスクリーンのアニメーションを設定します。

```javascript
SplashScreen.setOptions({
  duration: 1000,
  fade: true
});
```

## 使用例

### リソース読み込み完了後に非表示

```typescript
import * as SplashScreen from 'expo-splash-screen';
import { useEffect, useState } from 'react';

// 自動非表示を防止
SplashScreen.preventAutoHideAsync();

export default function App() {
  const [appIsReady, setAppIsReady] = useState(false);

  useEffect(() => {
    async function prepare() {
      try {
        // フォント、画像などのリソースを読み込む
        await loadFonts();
        await loadImages();
        // 人工的に遅延を追加（オプション）
        await new Promise(resolve => setTimeout(resolve, 2000));
      } catch (e) {
        console.warn(e);
      } finally {
        setAppIsReady(true);
      }
    }

    prepare();
  }, []);

  useEffect(() => {
    if (appIsReady) {
      SplashScreen.hideAsync();
    }
  }, [appIsReady]);

  if (!appIsReady) {
    return null;
  }

  return <YourApp />;
}
```

### フェードアニメーション付き

```javascript
import * as SplashScreen from 'expo-splash-screen';

SplashScreen.setOptions({
  duration: 500,
  fade: true
});

// 準備完了後
await SplashScreen.hideAsync();
```

## 重要な注意事項

1. **リリースビルドでのテスト**: スプラッシュスクリーンはリリースビルドでテストすることを推奨します。

2. **Expo Goの制限**: Expo Goでは最終的なスプラッシュスクリーンの表示を完全に再現できない場合があります。

3. **preventAutoHideAsyncのタイミング**: `preventAutoHideAsync()`は、アプリのルートコンポーネントがマウントされる前に呼び出す必要があります。

4. **ダークモード**: ダークモード用に別の画像と背景色を設定できます。

## ベストプラクティス

1. スプラッシュスクリーンは短時間（2-3秒以内）に抑える
2. リソースの読み込みが完了したら速やかに非表示にする
3. ユーザー体験を損なわないよう、過度に長いスプラッシュスクリーンは避ける
4. エラー処理を適切に実装し、読み込みに失敗した場合でもスプラッシュスクリーンを非表示にする
