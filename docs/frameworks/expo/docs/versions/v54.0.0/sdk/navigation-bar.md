# NavigationBar

Androidデバイスのネイティブナビゲーションバーとの対話を提供するライブラリです。

## 概要

`expo-navigation-bar` は、Androidデバイスのネイティブナビゲーションバーとの対話を提供するライブラリです。ナビゲーションバーの表示/非表示、色、動作などのプロパティを変更できます。

## 主な機能

- ナビゲーションバーのプロパティ（表示、色、動作）を変更
- Android固有のナビゲーションバーの操作をサポート
- 各種ナビゲーションバー属性の取得と設定メソッドを提供

## 重要な注意事項

- Androidでのみ動作します
- 「ジェスチャーナビゲーション」が有効な場合は効果がありません
- 一部のメソッドは、エッジツーエッジモードが無効な場合のみ動作します

## インストール

```bash
npx expo install expo-navigation-bar
```

## 使用方法

### ナビゲーションバーの背景色を変更

```javascript
import * as NavigationBar from 'expo-navigation-bar';

// 白色に設定
await NavigationBar.setBackgroundColorAsync('white');

// 16進数カラーコードを使用
await NavigationBar.setBackgroundColorAsync('#FF0000');
```

### ナビゲーションバーの表示/非表示

```javascript
import * as NavigationBar from 'expo-navigation-bar';

// ナビゲーションバーを非表示
await NavigationBar.setVisibilityAsync('hidden');

// ナビゲーションバーを表示
await NavigationBar.setVisibilityAsync('visible');
```

### ナビゲーションバーの動作を設定

```javascript
import * as NavigationBar from 'expo-navigation-bar';

// スワイプで一時的に表示
await NavigationBar.setBehaviorAsync('overlay-swipe');

// スワイプで表示し、コンテンツを調整
await NavigationBar.setBehaviorAsync('inset-swipe');

// タッチで表示し、コンテンツを調整
await NavigationBar.setBehaviorAsync('inset-touch');
```

### 現在の背景色を取得

```javascript
import * as NavigationBar from 'expo-navigation-bar';

const color = await NavigationBar.getBackgroundColorAsync();
console.log('現在の背景色:', color);
```

### ボーダー色の設定（Android 15+）

```javascript
import * as NavigationBar from 'expo-navigation-bar';

// ボーダー色を設定
await NavigationBar.setBorderColorAsync('#000000');
```

## API

### メソッド

#### `setBackgroundColorAsync(color)`

ナビゲーションバーの背景色を変更します。

**パラメータ:**
- `color: string` - 色の文字列（カラー名または16進数コード）

**戻り値:**
- `Promise<void>`

#### `getBackgroundColorAsync()`

ナビゲーションバーの背景色を取得します。

**戻り値:**
- `Promise<string>` - 現在の背景色

#### `setVisibilityAsync(visibility)`

ナビゲーションバーの表示を制御します。

**パラメータ:**
- `visibility: 'visible' | 'hidden'` - 表示状態

**戻り値:**
- `Promise<void>`

#### `getVisibilityAsync()`

ナビゲーションバーの表示状態を取得します。

**戻り値:**
- `Promise<'visible' | 'hidden'>` - 現在の表示状態

#### `setBehaviorAsync(behavior)`

ナビゲーションバーが非表示の場合の動作を設定します。

**パラメータ:**
- `behavior: 'overlay-swipe' | 'inset-swipe' | 'inset-touch'` - 動作タイプ

**戻り値:**
- `Promise<void>`

#### `getBehaviorAsync()`

現在のナビゲーションバーの動作を取得します。

**戻り値:**
- `Promise<'overlay-swipe' | 'inset-swipe' | 'inset-touch'>` - 現在の動作

#### `setBorderColorAsync(color)`

ナビゲーションバーのボーダー色を設定します（Android 15+）。

**パラメータ:**
- `color: string` - ボーダーの色

**戻り値:**
- `Promise<void>`

#### `getBorderColorAsync()`

ナビゲーションバーのボーダー色を取得します（Android 15+）。

**戻り値:**
- `Promise<string>` - 現在のボーダー色

#### `setButtonStyleAsync(style)`

ナビゲーションボタンのスタイルを設定します。

**パラメータ:**
- `style: 'light' | 'dark'` - ボタンのスタイル

**戻り値:**
- `Promise<void>`

#### `getButtonStyleAsync()`

現在のナビゲーションボタンのスタイルを取得します。

**戻り値:**
- `Promise<'light' | 'dark'>` - 現在のボタンスタイル

## 型定義

### Visibility

```typescript
type Visibility = 'visible' | 'hidden';
```

### Behavior

```typescript
type Behavior =
  | 'overlay-swipe'   // スワイプで一時的にシステムUIを表示
  | 'inset-swipe'     // スワイプでシステムUIを表示し、アプリコンテンツを調整
  | 'inset-touch';    // タッチでシステムUIを表示
```

### ButtonStyle

```typescript
type ButtonStyle = 'light' | 'dark';
```

## 動作タイプの説明

### `overlay-swipe`

- スワイプジェスチャーでシステムUIを一時的に表示
- アプリコンテンツはそのまま
- UIは自動的に非表示になります

### `inset-swipe`

- スワイプジェスチャーでシステムUIを表示
- アプリコンテンツがシステムUIに合わせて調整されます
- UIは自動的に非表示になります

### `inset-touch`

- 画面をタッチするとシステムUIが表示されます
- アプリコンテンツがシステムUIに合わせて調整されます

## 実用例

### イマーシブモードの実装

```javascript
import { useEffect } from 'react';
import * as NavigationBar from 'expo-navigation-bar';

function ImmersiveScreen() {
  useEffect(() => {
    // イマーシブモードを有効化
    const setupImmersive = async () => {
      await NavigationBar.setVisibilityAsync('hidden');
      await NavigationBar.setBehaviorAsync('overlay-swipe');
    };

    setupImmersive();

    // クリーンアップ
    return () => {
      NavigationBar.setVisibilityAsync('visible');
    };
  }, []);

  return (
    // コンテンツ
  );
}
```

### テーマに合わせた色の設定

```javascript
import { useColorScheme } from 'react-native';
import * as NavigationBar from 'expo-navigation-bar';

function ThemedApp() {
  const colorScheme = useColorScheme();

  useEffect(() => {
    const setupTheme = async () => {
      if (colorScheme === 'dark') {
        await NavigationBar.setBackgroundColorAsync('#000000');
        await NavigationBar.setButtonStyleAsync('light');
      } else {
        await NavigationBar.setBackgroundColorAsync('#FFFFFF');
        await NavigationBar.setButtonStyleAsync('dark');
      }
    };

    setupTheme();
  }, [colorScheme]);

  return (
    // コンテンツ
  );
}
```

### 動的なナビゲーションバーの制御

```javascript
import { useState } from 'react';
import { Button, View } from 'react-native';
import * as NavigationBar from 'expo-navigation-bar';

function NavigationBarController() {
  const [isVisible, setIsVisible] = useState(true);

  const toggleVisibility = async () => {
    const newVisibility = isVisible ? 'hidden' : 'visible';
    await NavigationBar.setVisibilityAsync(newVisibility);
    setIsVisible(!isVisible);
  };

  const changeColor = async (color) => {
    await NavigationBar.setBackgroundColorAsync(color);
  };

  return (
    <View>
      <Button
        title={isVisible ? 'ナビゲーションバーを非表示' : 'ナビゲーションバーを表示'}
        onPress={toggleVisibility}
      />
      <Button title="赤色に変更" onPress={() => changeColor('#FF0000')} />
      <Button title="青色に変更" onPress={() => changeColor('#0000FF')} />
      <Button title="白色に変更" onPress={() => changeColor('#FFFFFF')} />
    </View>
  );
}
```

## プラットフォーム固有の考慮事項

### Android

- Androidでのみ動作します
- 「ジェスチャーナビゲーション」が有効な場合、一部の機能が動作しません
- エッジツーエッジモードが無効な場合、一部のメソッドのみ動作します
- Android 15以降では、ボーダー色の設定がサポートされます

### その他のプラットフォーム

- iOS、Web、その他のプラットフォームでは効果がありません
- メソッドを呼び出してもエラーは発生しませんが、何も起こりません

## ベストプラクティス

1. **プラットフォームチェック**: Androidでのみ実行するようにプラットフォームをチェック
2. **ユーザー体験**: ナビゲーションバーを非表示にする場合は、ユーザーが操作できるようにする
3. **テーマ対応**: アプリのテーマに合わせてナビゲーションバーの色を設定
4. **状態管理**: ナビゲーションバーの状態を適切に管理

## エラーハンドリング

```javascript
import * as NavigationBar from 'expo-navigation-bar';
import { Platform } from 'react-native';

async function safelySetNavigationBar() {
  if (Platform.OS !== 'android') {
    console.log('NavigationBarはAndroidでのみ動作します');
    return;
  }

  try {
    await NavigationBar.setBackgroundColorAsync('#000000');
    await NavigationBar.setVisibilityAsync('hidden');
  } catch (error) {
    console.error('ナビゲーションバーの設定エラー:', error);
  }
}
```

## 制限事項

1. Androidでのみ動作します
2. ジェスチャーナビゲーションが有効な場合、効果がありません
3. エッジツーエッジモードの設定により、一部のメソッドが動作しない場合があります
4. デバイスやAndroidバージョンによって動作が異なる場合があります

## サポートプラットフォーム

- Android: サポート
- iOS: 非サポート
- Web: 非サポート
