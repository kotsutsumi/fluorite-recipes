# react-native-reanimated

`react-native-reanimated` は、React Nativeでスムーズで強力、かつメンテナンス可能なアニメーションを作成するためのライブラリです。

## 主な詳細

- Android、iOS、tvOS、Webをサポート
- バンドルされているバージョン: ~4.1.1
- デバッグにはHermes JavaScriptエンジンが必要

## インストール

```bash
npx expo install react-native-reanimated react-native-worklets
```

## 使用例

```javascript
import Animated, {
  useSharedValue,
  withTiming,
  useAnimatedStyle,
  Easing,
} from 'react-native-reanimated';

export default function AnimatedStyleUpdateExample() {
  const randomWidth = useSharedValue(10);

  const config = {
    duration: 500,
    easing: Easing.bezier(0.5, 0.01, 0, 1),
  };

  const style = useAnimatedStyle(() => ({
    width: withTiming(randomWidth.value, config),
  }));

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.box, style]} />
      <Button
        title="toggle"
        onPress={() => {
          randomWidth.value = Math.random() * 350;
        }}
      />
    </View>
  );
}
```

## 重要な注意事項

**Reanimatedは、JavaScriptCoreの「リモートJSデバッグ」と互換性のないReact Native APIを使用しています。**

デバッグを行う場合は、Hermesエンジンを使用する必要があります。

## 主なAPI

### useSharedValue

アニメーション間で共有される値を作成します。

### withTiming

指定された設定でアニメーションのタイミングを制御します。

### useAnimatedStyle

アニメーション化されたスタイルオブジェクトを作成します。

### Easing

イージング関数を提供します。

## その他のリソース

- [公式ドキュメント](https://docs.swmansion.com/react-native-reanimated/docs/fundamentals/your-first-animation) - 詳細な使用方法とAPIリファレンス
- [GitHub Repository](https://github.com/software-mansion/react-native-reanimated) - ソースコードとissue
- [npm Package](https://www.npmjs.com/package/react-native-reanimated) - パッケージ情報
