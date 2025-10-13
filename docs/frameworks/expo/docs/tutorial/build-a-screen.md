# 画面を構築

## 概要

このチュートリアルの章では、画像と画像を選択するための2つのボタンを表示するStickerSmashアプリの最初の画面を作成する方法を学びます。

## 1. 画面を分解

画面は2つの主要な要素で構成されます：
- 大きな中央配置の画像
- 画面の下半分にある2つのボタン

## 2. 画像を表示

`expo-image`ライブラリをインストール：

```bash
npx expo install expo-image
```

`components/ImageViewer.tsx`に`ImageViewer`コンポーネントを作成：

```typescript
import { ImageSourcePropType, StyleSheet } from 'react-native';
import { Image } from 'expo-image';

type Props = {
  imgSource: ImageSourcePropType;
};

export default function ImageViewer({ imgSource }: Props) {
  return <Image source={imgSource} style={styles.image} />;
}

const styles = StyleSheet.create({
  image: {
    width: 320,
    height: 440,
    borderRadius: 18,
  },
});
```

## 3. Pressableを使用したボタンの作成

`components/Button.tsx`に再利用可能な`Button`コンポーネントを作成：

```typescript
import { StyleSheet, View, Pressable, Text } from 'react-native';
import FontAwesome from '@expo/vector-icons/FontAwesome';

type Props = {
  label: string;
  theme?: 'primary';
};

export default function Button({ label, theme }: Props) {
  if (theme === 'primary') {
    return (
      <View style={[styles.buttonContainer, { borderWidth: 4, borderColor: '#ffd33d', borderRadius: 18 }]}>
        <Pressable
          style={[styles.button, { backgroundColor: '#fff' }]}
          onPress={() => alert('ボタンが押されました。')}>
          <FontAwesome name="picture-o" size={18} color="#25292e" style={styles.buttonIcon} />
          <Text style={[styles.buttonLabel, { color: '#25292e' }]}>{label}</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <View style={styles.buttonContainer}>
      <Pressable style={styles.button} onPress={() => alert('ボタンが押されました。')}>
        <Text style={styles.buttonLabel}>{label}</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  buttonContainer: {
    width: 320,
    height: 68,
    marginHorizontal: 20,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 3,
  },
  button: {
    borderRadius: 10,
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  buttonIcon: {
    paddingRight: 8,
  },
  buttonLabel: {
    color: '#fff',
    fontSize: 16,
  },
});
```

## まとめ

画像表示とインタラクティブなボタンコンポーネントを作成し、アプリの基本的なUIを構築しました。
