# react-native-view-shot

`react-native-view-shot` は、React Nativeのビューを画像としてキャプチャするためのライブラリです。

## 主な機能

- 特定のビューをスクリーンショットして画像を返す
- 署名パッドの描画を保存するなどのシナリオで便利
- AndroidとiOSで動作

## インストール

```bash
npx expo install react-native-view-shot
```

## バンドルされているバージョン

現在のバンドルバージョン: 4.0.3

## 基本的な使用方法

```javascript
import { captureRef } from 'react-native-view-shot';

// ビューをキャプチャ
const result = await captureRef(viewRef, {
  result: 'tmpfile',
  quality: 1,
  format: 'png',
});
```

## 重要なピクセル比の考慮事項

デバイスピクセルは論理ピクセルと異なります。ピクセルスケーリングを処理するために `PixelRatio.get()` を使用します。

### フルHD画像を作成する例

```javascript
import { PixelRatio } from 'react-native';
import { captureRef } from 'react-native-view-shot';

const targetPixelCount = 1080;
const pixelRatio = PixelRatio.get();
const pixels = targetPixelCount / pixelRatio;

const result = await captureRef(this.imageContainer, {
  result: 'tmpfile',
  height: pixels,
  width: pixels,
  quality: 1,
  format: 'png',
});
```

## オプションパラメータ

### result

キャプチャ結果の形式:

- `'tmpfile'`: 一時ファイルとして保存
- `'base64'`: Base64エンコードされた文字列として返す
- `'data-uri'`: Data URIとして返す

### quality

画像の品質（0-1の範囲）:

- `1`: 最高品質
- `0.8`: 高品質（推奨）
- `0.5`: 中品質

### format

画像フォーマット:

- `'png'`: PNG形式（デフォルト、透明度サポート）
- `'jpg'` / `'jpeg'`: JPEG形式（ファイルサイズが小さい）

### width / height

出力画像のサイズ（ピクセル単位）。

## GLViewのスナップショット

GLViewのスナップショットには、`captureRef` の代わりに `GLView.takeSnapshotAsync()` を使用してください。

```javascript
import { GLView } from 'expo-gl';

const snapshot = await GLView.takeSnapshotAsync(glViewRef);
```

## 追加の注意事項

- ビューがレンダリングされた後にキャプチャを実行してください
- 大きな画像をキャプチャする場合はメモリ使用量に注意してください
- iOSとAndroidでピクセル比が異なる場合があります

## リソース

- [公式GitHub Repository](https://github.com/gre/react-native-view-shot) - 詳細なドキュメント
- [npm Package](https://www.npmjs.com/package/react-native-view-shot) - パッケージ情報

## 概要

このライブラリは、React Nativeアプリケーションでビューのコンテンツをプログラム的にキャプチャして保存する必要がある開発者に推奨されます。
