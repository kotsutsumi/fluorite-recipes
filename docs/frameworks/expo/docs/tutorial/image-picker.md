# 画像ピッカーを使用

React Nativeはデバイスのメディアギャラリーから画像を選択するための組み込みコンポーネントを提供していません。このチュートリアルでは、`expo-image-picker`を使用してこの機能を追加する方法を示します。

## expo-image-pickerをインストール

次のコマンドを使用してライブラリをインストール：

```bash
npx expo install expo-image-picker
```

## デバイスのメディアライブラリから画像を選択

ライブラリをインポートし、画像ピッカーを起動する非同期関数を作成：

```typescript
import * as ImagePicker from 'expo-image-picker';

export default function Index() {
  const pickImageAsync = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      console.log(result);
    } else {
      alert('画像が選択されませんでした。');
    }
  };
}
```

## ボタンコンポーネントを更新

画像ピッカーを処理するように`Button`コンポーネントを変更：

```typescript
export default function Button({ label, theme, onPress }: Props) {
  if (theme === 'primary') {
    return (
      <View style={[styles.buttonContainer]}>
        <Pressable
          style={[styles.button]}
          onPress={onPress}
        >
          <FontAwesome name="picture-o" size={18} color="#25292e" />
          <Text style={styles.buttonLabel}>{label}</Text>
        </Pressable>
      </View>
    );
  }
}
```

## 選択した画像を使用

選択した画像を保存する状態変数を作成：

```typescript
export default function Index() {
  const [selectedImage, setSelectedImage] = useState<string | undefined>(undefined);

  const pickImageAsync = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      setSelectedImage(result.assets[0].uri);
    } else {
      alert('画像が選択されませんでした。');
    }
  };

  return (
    <ImageViewer imgSource={selectedImage || PlaceholderImage} />
  );
}
```

## まとめ

デバイスのメディアライブラリから画像を選択する機能を実装し、アプリにインタラクティブな機能を追加しました。
