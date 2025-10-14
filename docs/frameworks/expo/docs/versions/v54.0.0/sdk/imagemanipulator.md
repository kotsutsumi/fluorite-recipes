# Expo ImageManipulator

## 概要

- ローカルファイルシステム上での画像操作のためのライブラリ
- 対応プラットフォーム: Android、iOS、tvOS、Web
- バンドルバージョン: ~14.0.7

## インストール

```bash
npx expo install expo-image-manipulator
```

## 主な機能

- 画像の回転
- 画像の垂直/水平反転
- 画像のリサイズ
- 画像のクロップ
- 異なる形式（PNG、JPEG、WEBP）で画像を保存

## 基本的な使用例

```javascript
import { useImageManipulator, FlipType, SaveFormat } from 'expo-image-manipulator';

const context = useImageManipulator(IMAGE.uri);
const rotate90andFlip = async () => {
  context.rotate(90).flip(FlipType.Vertical);
  const image = await context.renderAsync();
  const result = await image.saveAsync({
    format: SaveFormat.PNG
  });
}
```

## 主要なメソッド

- `manipulate(source)`: 操作のために画像を読み込む
- `crop(rect)`: 指定された矩形に画像をクロップ
- `resize(size)`: 画像をリサイズ
- `rotate(degrees)`: 画像を回転
- `flip(flipType)`: 画像を垂直または水平に反転
- `renderAsync()`: 画像操作を完了
- `saveAsync(options)`: 操作した画像を保存

## 保存オプション

- フォーマット（PNG/JPEG/WEBP）
- 圧縮レベル
- Base64エンコーディング

このドキュメントは、Expoアプリケーションでの柔軟な画像操作のための包括的なAPIを提供します。
