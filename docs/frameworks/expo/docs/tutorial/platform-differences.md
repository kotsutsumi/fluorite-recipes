# プラットフォームの違いを処理

このチュートリアルでは、ユニバーサルアプリを作成する際にネイティブとWeb間のプラットフォームの違いを処理する方法を学びます。

## dom-to-imageをインストールしてインポート

Webでスクリーンショットをキャプチャして画像として保存するには、[`dom-to-image`](https://github.com/tsayen/dom-to-image#readme)ライブラリを使用します。

ライブラリをインストール：

```terminal
npm install dom-to-image
```

## プラットフォーム固有のコードを追加

React Nativeの`Platform`モジュールを使用してプラットフォーム固有の動作を実装：

1. `react-native`から`Platform`をインポート
2. `dom-to-image`から`domtoimage`をインポート
3. プラットフォームをチェックしてスクリーンショットのキャプチャを処理するように`onSaveImageAsync()`を更新

`app/(tabs)/index.tsx`のコード例：

```typescript
import * as ImagePicker from 'expo-image-picker';
import * as MediaLibrary from 'expo-media-library';
import { useEffect, useRef, useState } from 'react';
import { ImageSourcePropType, View, StyleSheet, Platform } from 'react-native';
import { captureRef } from 'react-native-view-shot';
import domtoimage from 'dom-to-image';

const onSaveImageAsync = async () => {
  if (Platform.OS !== 'web') {
    // ネイティブプラットフォームのスクリーンショットロジック
  } else {
    // dom-to-imageを使用したWebプラットフォームのスクリーンショットロジック
    try {
      const dataUrl = await domtoimage.toJpeg(imageRef.current, {
        quality: 0.95,
        width: 320,
        height: 440,
      });

      let link = document.createElement('a');
      link.download = 'sticker-smash.jpeg';
      link.href = dataUrl;
      link.click();
    } catch (e) {
      console.log(e);
    }
  }
};
```

### TypeScriptモジュールエラーを修正

プロジェクトのルートに`types.d.ts`ファイルを作成：

```typescript
declare module 'dom-to-image' {
  export function toJpeg(node: HTMLElement, options?: any): Promise<string>;
}
```

## まとめ

プラットフォーム固有のコードを使用して、ネイティブとWebの両方でスクリーンショット機能を実装しました。
