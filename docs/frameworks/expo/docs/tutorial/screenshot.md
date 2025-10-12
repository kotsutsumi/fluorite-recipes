# スクリーンショットを撮る - Expoチュートリアル

## 概要
このチュートリアルでは、以下を使用してExpoアプリでスクリーンショットをキャプチャする方法を示します：
- スクリーンショットをキャプチャするための`react-native-view-shot`
- デバイスのメディアライブラリに画像を保存するための`expo-media-library`

## 手順

### 1. ライブラリをインストール
```bash
npx expo install react-native-view-shot expo-media-library
```

### 2. 権限を求める
`expo-media-library`の`usePermissions()`フックを使用してメディアライブラリへのアクセスを要求：

```typescript
useEffect(() => {
  if (!permissionResponse?.granted) {
    requestPermission();
  }
}, []);
```

### 3. 現在のビューを保存するためのRefを作成
`useRef`と`captureRef`を使用してスクリーンショット用のビューを参照：

```typescript
const imageRef = useRef<View>(null);

return (
  <View ref={imageRef} collapsable={false}>
    <ImageViewer />
    {pickedEmoji && <EmojiSticker />}
  </View>
);
```

### 4. スクリーンショットをキャプチャして保存
スクリーンショットのキャプチャと保存機能を実装：

```typescript
const onSaveImageAsync = async () => {
  try {
    const localUri = await captureRef(imageRef, {
      height: 440,
      quality: 1,
    });

    await MediaLibrary.saveToLibraryAsync(localUri);
    if (localUri) {
      alert('保存されました！');
    }
  } catch (e) {
    console.log(e);
  }
};
```

## 重要なポイント
- 高度な機能にはサードパーティライブラリを使用
- センシティブなデバイスアクセスには常に権限を要求
- 特定のビューコンポーネントをキャプチャするためにrefを活用
- スクリーンショットのキャプチャと保存を非同期的に処理
