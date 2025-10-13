# ジェスチャーを追加

このチュートリアルでは、React Native Gesture HandlerとReanimatedライブラリからジェスチャーを実装する方法を学びます。

## 1. GestureHandlerRootViewを追加

ルートレベルの`<View>`コンポーネントを`<GestureHandlerRootView>`に置き換え：

```typescript
import { GestureHandlerRootView } from 'react-native-gesture-handler';

export default function Index() {
  return (
    <GestureHandlerRootView style={styles.container}>
      {/* ...残りのコードは同じ */}
    </GestureHandlerRootView>
  )
}
```

## 2. アニメーション化されたコンポーネントを使用

`react-native-reanimated`から`Animated`をインポートし、`Image`を`Animated.Image`に置き換え：

```typescript
import Animated from 'react-native-reanimated';

export default function EmojiSticker({ imageSize, stickerSource }: Props) {
  return (
    <View style={{ top: -350 }}>
      <Animated.Image
        source={stickerSource}
        resizeMode="contain"
        style={{ width: imageSize, height: imageSize }}
      />
    </View>
  );
}
```

## 3. タップジェスチャーを追加

ステッカーをスケールするためのダブルタップジェスチャーを作成：

```typescript
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';

export default function EmojiSticker({ imageSize, stickerSource }: Props) {
  const scaleImage = useSharedValue(imageSize);

  const doubleTap = Gesture.Tap()
    .numberOfTaps(2)
    .onStart(() => {
      if (scaleImage.value !== imageSize * 2) {
        scaleImage.value = scaleImage.value * 2;
      } else {
        scaleImage.value = imageSize;
      }
    });

  const imageStyle = useAnimatedStyle(() => {
    return {
      width: withSpring(scaleImage.value),
      height: withSpring(scaleImage.value),
    };
  });

  return (
    <GestureDetector gesture={doubleTap}>
      <Animated.Image
        source={stickerSource}
        resizeMode="contain"
        style={[{ width: imageSize, height: imageSize }, imageStyle]}
      />
    </GestureDetector>
  );
}
```

## 4. パンジェスチャーを追加

ステッカーをドラッグするためのパンジェスチャーを実装：

```typescript
const translateX = useSharedValue(0);
const translateY = useSharedValue(0);

const drag = Gesture.Pan()
  .onChange((event) => {
    translateX.value += event.changeX;
    translateY.value += event.changeY;
  });

const containerStyle = useAnimatedStyle(() => {
  return {
    transform: [
      { translateX: translateX.value },
      { translateY: translateY.value },
    ],
  };
});
```

## まとめ

タップとパンのジェスチャーを使用してインタラクティブなステッカー機能を実装し、React Native Gesture HandlerとReanimatedの基本を学びました。
