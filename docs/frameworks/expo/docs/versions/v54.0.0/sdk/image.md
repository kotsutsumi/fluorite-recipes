# Expo Image

## 概要

Expo Imageは、高度な機能を備えた画像の読み込みとレンダリングのためのクロスプラットフォームReactコンポーネントです。

### 主な機能

- 高パフォーマンスを実現する設計
- 複数の画像フォーマットに対応
- ディスクおよびメモリキャッシング
- BlurHashとThumbHashプレースホルダーに対応
- スムーズな画像トランジション
- CSSライクな`object-fit`と`object-position`を実装

### サポートプラットフォーム

- Android
- iOS
- tvOS
- Web

## インストール

```bash
npx expo install expo-image
```

## 基本的な使い方

```javascript
import { Image } from 'expo-image';

export default function App() {
  return (
    <Image
      source="https://picsum.photos/seed/696/3000/2000"
      style={styles.image}
      placeholder={{ blurhash }}
      contentFit="cover"
      transition={1000}
    />
  );
}
```

## 主要なProps

- `source`: 画像ソース（URL、ローカルファイル、またはrequire）
- `contentFit`: 画像のサイズ調整モード（cover、contain、fillなど）
- `placeholder`: 読み込み中に表示する一時的な画像
- `transition`: スムーズな画像読み込み効果
- `cachePolicy`: 画像キャッシングの動作を制御

## 高度な機能

- Blurhashの生成
- 画像のプリフェッチ
- アニメーション画像のサポート
- アクセシビリティオプション
- レスポンシブな画像読み込み

## 静的メソッド

- `clearDiskCache()`: ディスクキャッシュをクリア
- `clearMemoryCache()`: メモリキャッシュをクリア
- `generateBlurhashAsync()`: Blurhashを生成
- `prefetch()`: 画像をプリフェッチ

このドキュメントは、異なるプラットフォーム間での実装、設定、使用方法に関する包括的な詳細を提供します。
