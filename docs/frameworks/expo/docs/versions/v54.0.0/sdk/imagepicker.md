# Expo ImagePicker

## 概要

Expo ImagePickerは、システムUIにアクセスして画像やビデオを選択するためのライブラリです。

### 主な機能

- フォトライブラリから選択、またはカメラで写真を撮影
- Android、iOS、Webプラットフォームに対応
- Expo SDKバージョン~17.0.8の一部

## インストール

```bash
npx expo install expo-image-picker
```

## 基本的な使用例

```javascript
import * as ImagePicker from 'expo-image-picker';

export default function ImagePickerExample() {
  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images', 'videos'],
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };
}
```

## 主要なメソッド

- `launchImageLibraryAsync()`: システム画像ピッカーを開く
- `launchCameraAsync()`: カメラを直接開く
- `requestCameraPermissionsAsync()`: カメラアクセスを要求
- `requestMediaLibraryPermissionsAsync()`: フォトライブラリアクセスを要求

## 設定オプション

- `allowsEditing`: 画像のクロップを有効化
- `mediaTypes`: 画像、ビデオ、またはライブフォトのタイプを選択
- `quality`: 圧縮レベルを設定（0-1）
- `allowsMultipleSelection`: 複数のメディアファイルを選択

## パーミッション

- Android: カメラとストレージのパーミッションが必要
- iOS: カメラ、マイク、フォトライブラリの使用説明キーが必要

## プラットフォーム固有の注意点

- クロップや品質などの一部のオプションはプラットフォーム間で異なる
- Webはモバイルと比較して機能が限定的

## 既知の問題

- iOSでは特定の画像で解像度に関連するクロップのバグがある可能性がある
