# ScreenOrientation

デバイスの画面の向きを管理するためのユニバーサルライブラリです。

## 概要

ScreenOrientationは、Android、iOS、Webプラットフォーム全体でデバイスの画面の向きを管理するための包括的なライブラリです。

## インストール

```bash
npx expo install expo-screen-orientation
```

## プラットフォーム

- Android
- iOS
- Web

## 主な機能

- 現在の画面の向きの取得
- 特定の向きへの画面のロック
- デフォルトの向きへのリセット
- 向き変更イベントのリスニング
- プラットフォーム固有の動作のサポート

## 基本的な使用例

```typescript
import * as ScreenOrientation from 'expo-screen-orientation';
import { useEffect } from 'react';
import { View, Button, Text } from 'react-native';

export default function App() {
  useEffect(() => {
    // 向き変更リスナーを設定
    const subscription = ScreenOrientation.addOrientationChangeListener(
      (event) => {
        console.log('向きが変更されました:', event.orientationInfo.orientation);
      }
    );

    return () => {
      ScreenOrientation.removeOrientationChangeListener(subscription);
    };
  }, []);

  const lockToLandscape = async () => {
    await ScreenOrientation.lockAsync(
      ScreenOrientation.OrientationLock.LANDSCAPE
    );
  };

  const lockToPortrait = async () => {
    await ScreenOrientation.lockAsync(
      ScreenOrientation.OrientationLock.PORTRAIT
    );
  };

  const unlockOrientation = async () => {
    await ScreenOrientation.unlockAsync();
  };

  return (
    <View style={{ flex: 1, justifyContent: 'center', padding: 20 }}>
      <Button title="横向きにロック" onPress={lockToLandscape} />
      <Button title="縦向きにロック" onPress={lockToPortrait} />
      <Button title="ロック解除" onPress={unlockOrientation} />
    </View>
  );
}
```

## API

### `ScreenOrientation.getOrientationAsync()`

現在の画面の向きを取得します。

**戻り値:**
- `Promise<Orientation>` - 現在の向き

```typescript
const orientation = await ScreenOrientation.getOrientationAsync();
console.log('現在の向き:', orientation);
```

### `ScreenOrientation.lockAsync(orientationLock)`

画面を特定の向きにロックします。

**パラメータ:**
- `orientationLock` (OrientationLock): ロックする向き

**戻り値:**
- `Promise<void>`

```typescript
// 横向きにロック
await ScreenOrientation.lockAsync(
  ScreenOrientation.OrientationLock.LANDSCAPE
);

// 縦向きにロック
await ScreenOrientation.lockAsync(
  ScreenOrientation.OrientationLock.PORTRAIT
);
```

### `ScreenOrientation.unlockAsync()`

向きのロックをリセットし、デフォルトの向きに戻します。

**戻り値:**
- `Promise<void>`

```typescript
await ScreenOrientation.unlockAsync();
```

### `ScreenOrientation.getPlatformOrientationLockAsync()`

プラットフォーム固有の現在の向きロックを取得します。

**戻り値:**
- `Promise<PlatformOrientationLock>`

```typescript
const lock = await ScreenOrientation.getPlatformOrientationLockAsync();
console.log('現在のロック:', lock);
```

### `ScreenOrientation.lockPlatformAsync(options)`

プラットフォーム固有の向きオプションで画面をロックします。

**パラメータ:**
- `options` (PlatformOrientationLock): プラットフォーム固有のロックオプション

**戻り値:**
- `Promise<void>`

```typescript
await ScreenOrientation.lockPlatformAsync({
  screenOrientationLockWeb: 'landscape-primary'
});
```

## 向き変更リスナー

### `ScreenOrientation.addOrientationChangeListener(listener)`

向き変更イベントをリッスンします。

**パラメータ:**
- `listener` (function): 向きが変更されたときに呼び出されるコールバック

**戻り値:**
- `Subscription`: サブスクリプションオブジェクト

```typescript
const subscription = ScreenOrientation.addOrientationChangeListener((event) => {
  console.log('新しい向き:', event.orientationInfo.orientation);
});

// クリーンアップ
subscription.remove();
```

### `ScreenOrientation.removeOrientationChangeListener(subscription)`

向き変更リスナーを削除します。

**パラメータ:**
- `subscription` (Subscription): 削除するサブスクリプション

```typescript
ScreenOrientation.removeOrientationChangeListener(subscription);
```

### `ScreenOrientation.removeOrientationChangeListeners()`

すべての向き変更リスナーを削除します。

```typescript
ScreenOrientation.removeOrientationChangeListeners();
```

## 列挙型

### `Orientation`

デバイスの向きを表します。

```typescript
enum Orientation {
  UNKNOWN = 0,
  PORTRAIT_UP = 1,
  PORTRAIT_DOWN = 2,
  LANDSCAPE_LEFT = 3,
  LANDSCAPE_RIGHT = 4,
}
```

**値:**
- `UNKNOWN`: 向きが不明
- `PORTRAIT_UP`: デバイスが縦向き、ホームボタンが下
- `PORTRAIT_DOWN`: デバイスが縦向き、ホームボタンが上
- `LANDSCAPE_LEFT`: デバイスが横向き、ホームボタンが左
- `LANDSCAPE_RIGHT`: デバイスが横向き、ホームボタンが右

### `OrientationLock`

向きロックモードを表します。

```typescript
enum OrientationLock {
  DEFAULT = 0,
  ALL = 1,
  PORTRAIT = 2,
  PORTRAIT_UP = 3,
  PORTRAIT_DOWN = 4,
  LANDSCAPE = 5,
  LANDSCAPE_LEFT = 6,
  LANDSCAPE_RIGHT = 7,
}
```

**値:**
- `DEFAULT`: デフォルトの向き（通常は縦向き）
- `ALL`: すべての向きを許可
- `PORTRAIT`: 縦向きのみ許可
- `PORTRAIT_UP`: 縦向き上のみ
- `PORTRAIT_DOWN`: 縦向き下のみ
- `LANDSCAPE`: 横向きのみ許可
- `LANDSCAPE_LEFT`: 横向き左のみ
- `LANDSCAPE_RIGHT`: 横向き右のみ

## 設定

### アプリ設定プラグイン

`app.json`で初期向きを設定できます：

```json
{
  "expo": {
    "plugins": [
      [
        "expo-screen-orientation",
        {
          "initialOrientation": "DEFAULT"
        }
      ]
    ]
  }
}
```

**オプション:**
- `initialOrientation` (string): アプリ起動時の向き（"DEFAULT", "PORTRAIT", "LANDSCAPE"）

## 実用例

### ビデオプレーヤー

```typescript
import React, { useEffect } from 'react';
import * as ScreenOrientation from 'expo-screen-orientation';
import { Video } from 'expo-av';

export default function VideoPlayer() {
  useEffect(() => {
    // ビデオ再生時は横向きにロック
    const lockToLandscape = async () => {
      await ScreenOrientation.lockAsync(
        ScreenOrientation.OrientationLock.LANDSCAPE
      );
    };

    lockToLandscape();

    // クリーンアップ時にロック解除
    return () => {
      ScreenOrientation.unlockAsync();
    };
  }, []);

  return <Video source={require('./video.mp4')} />;
}
```

### 向きに基づくレイアウト

```typescript
import React, { useState, useEffect } from 'react';
import * as ScreenOrientation from 'expo-screen-orientation';
import { View, Text } from 'react-native';

export default function OrientationLayout() {
  const [orientation, setOrientation] = useState(
    ScreenOrientation.Orientation.PORTRAIT_UP
  );

  useEffect(() => {
    const checkOrientation = async () => {
      const o = await ScreenOrientation.getOrientationAsync();
      setOrientation(o);
    };

    checkOrientation();

    const subscription = ScreenOrientation.addOrientationChangeListener(
      (event) => {
        setOrientation(event.orientationInfo.orientation);
      }
    );

    return () => {
      ScreenOrientation.removeOrientationChangeListener(subscription);
    };
  }, []);

  const isPortrait = orientation === ScreenOrientation.Orientation.PORTRAIT_UP ||
                     orientation === ScreenOrientation.Orientation.PORTRAIT_DOWN;

  return (
    <View style={{
      flex: 1,
      flexDirection: isPortrait ? 'column' : 'row'
    }}>
      <Text>現在の向き: {isPortrait ? '縦向き' : '横向き'}</Text>
    </View>
  );
}
```

### ゲームの向きロック

```typescript
import React, { useEffect } from 'react';
import * as ScreenOrientation from 'expo-screen-orientation';

export default function GameScreen() {
  useEffect(() => {
    // ゲームは横向き左のみ
    const lockOrientation = async () => {
      await ScreenOrientation.lockAsync(
        ScreenOrientation.OrientationLock.LANDSCAPE_LEFT
      );
    };

    lockOrientation();

    return () => {
      ScreenOrientation.unlockAsync();
    };
  }, []);

  return <GameComponent />;
}
```

## プラットフォーム固有の考慮事項

### iOS
- システム設定を上書きします
- すべての向きロックオプションをサポート
- アプリ設定で許可された向きに制限されます

### Android
- ユーザー設定を尊重できます
- システム設定と統合されます
- より柔軟な向き制御を提供

### Web
- CSS Media Queriesを使用
- ブラウザのサポートに依存
- 機能が制限される場合があります

## ベストプラクティス

1. **クリーンアップ**: コンポーネントのアンマウント時に必ず向きのロックを解除
2. **ユーザー体験**: ユーザーの向き設定を尊重
3. **適切な使用**: 必要な場合にのみ向きをロック（ビデオ、ゲームなど）
4. **テスト**: すべてのプラットフォームで向きの動作をテスト
5. **エラー処理**: 向き変更操作を適切なエラー処理でラップ

## トラブルシューティング

- **ロックが機能しない**: アプリ設定で向きが許可されていることを確認
- **リスナーが呼び出されない**: サブスクリプションが適切に設定されていることを確認
- **向きがすぐに変わらない**: プラットフォーム固有の遅延に注意

このライブラリは、プラットフォーム全体で画面の向きを管理するための包括的な制御を提供します。
