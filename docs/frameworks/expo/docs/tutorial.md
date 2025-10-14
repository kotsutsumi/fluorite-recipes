# Expo チュートリアル - React NativeとExpoで始める包括的ガイド

## 📋 概要

このチュートリアルは、Android、iOS、WebでExpoを使用して実行されるユニバーサルアプリケーションを構築する方法を学ぶための包括的なガイドです。実践的なStickerSmashアプリの開発を通じて、Expo SDKの基礎から高度な機能までをカバーします。

```typescript
interface ExpoTutorialSystem {
  coreTopics: {
    projectSetup: ProjectInitialization;
    uiDevelopment: UIComponents;
    navigation: ExpoRouter;
    mediaHandling: ImagePicker;
    interactions: GestureHandling;
    platformSupport: CrossPlatform;
    configuration: AppConfiguration;
  };
  learning: {
    approach: "実践による学習";
    duration: "最大2時間";
    chapters: 9;
    difficulty: "初心者向け";
  };
  output: {
    app: "StickerSmash";
    platforms: ["Android", "iOS", "Web"];
    features: [
      "画像選択・表示",
      "ステッカー追加",
      "ジェスチャー操作",
      "スクリーンショット撮影",
      "プラットフォーム対応"
    ];
  };
}
```

## 🚀 プロジェクトセットアップ

### 前提条件

```typescript
interface Prerequisites {
  devices: {
    mobile: "物理デバイスにインストールされたExpo Go";
    development: {
      nodejs: "Node.js LTSバージョン";
      editor: "VS Codeまたは別のコードエディタ";
      terminal: "macOS、Linux、またはWindowsのターミナル";
    };
  };
  knowledge: {
    required: ["TypeScript基礎知識", "React基礎知識"];
    learning: "実践による学習";
  };
}
```

**詳細ドキュメント**: [`introduction.md`](./tutorial/introduction.md)

### プロジェクト初期化

```typescript
interface ProjectInitialization {
  creation: {
    command: "npx create-expo-app@latest StickerSmash";
    template: "デフォルトテンプレート（TypeScript有効）";
    benefits: [
      "Expoパッケージを使用したReact Nativeプロジェクト",
      "推奨ツールが含まれる",
      "複数のプラットフォーム向けに設定済み",
      "デフォルトでTypeScript設定",
    ];
  };

  setup: {
    assets: {
      source: "アセットアーカイブダウンロード";
      location: "プロジェクトimagesディレクトリ";
      action: "デフォルトアセットを置き換え";
    };
    cleanup: {
      command: "npm run reset-project";
      purpose: "ボイラープレートコード削除";
      result: "appディレクトリに2つのファイルのみ";
    };
  };

  execution: {
    start: "npx expo start";
    platforms: {
      mobile: "Expo GoでQRコードをスキャン";
      web: "ターミナルで'w'を押す";
    };
  };
}
```

**実装例**：

```bash
# プロジェクト作成
npx create-expo-app@latest StickerSmash

# ディレクトリ移動
cd StickerSmash

# クリーンアップ
npm run reset-project

# 開発サーバー起動
npx expo start
```

**基本画面実装**：

```typescript
import { Text, View, StyleSheet } from 'react-native';

export default function Index() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>ホーム画面</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#25292e',
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    color: '#fff',
  },
});
```

**詳細ドキュメント**: [`create-your-first-app.md`](./tutorial/create-your-first-app.md)

## 🎨 UI開発とコンポーネント

### 画像表示コンポーネント

```typescript
interface ImageDisplay {
  library: {
    name: "expo-image";
    installation: "npx expo install expo-image";
    features: [
      "高性能画像レンダリング",
      "プログレッシブローディング",
      "複数フォーマットサポート",
    ];
  };

  component: {
    name: "ImageViewer";
    props: {
      imgSource: "ImageSourcePropType";
    };
    styling: {
      width: 320;
      height: 440;
      borderRadius: 18;
    };
  };
}
```

**ImageViewerコンポーネント実装**：

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

### ボタンコンポーネント

```typescript
interface ButtonComponent {
  usage: {
    component: "Pressable";
    purpose: "タッチ可能な要素の作成";
    features: ["カスタムスタイル", "イベントハンドリング", "視覚的フィードバック"];
  };

  variants: {
    primary: {
      border: "4px solid #ffd33d";
      background: "#fff";
      icon: "FontAwesome";
      textColor: "#25292e";
    };
    secondary: {
      border: "none";
      background: "transparent";
      textColor: "#fff";
    };
  };

  props: {
    label: "string";
    theme?: "'primary'";
    onPress?: "() => void";
  };
}
```

**Buttonコンポーネント実装**：

```typescript
import { StyleSheet, View, Pressable, Text } from 'react-native';
import FontAwesome from '@expo/vector-icons/FontAwesome';

type Props = {
  label: string;
  theme?: 'primary';
  onPress?: () => void;
};

export default function Button({ label, theme, onPress }: Props) {
  if (theme === 'primary') {
    return (
      <View style={[styles.buttonContainer, {
        borderWidth: 4,
        borderColor: '#ffd33d',
        borderRadius: 18
      }]}>
        <Pressable
          style={[styles.button, { backgroundColor: '#fff' }]}
          onPress={onPress}>
          <FontAwesome
            name="picture-o"
            size={18}
            color="#25292e"
            style={styles.buttonIcon}
          />
          <Text style={[styles.buttonLabel, { color: '#25292e' }]}>
            {label}
          </Text>
        </Pressable>
      </View>
    );
  }

  return (
    <View style={styles.buttonContainer}>
      <Pressable style={styles.button} onPress={onPress}>
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

**詳細ドキュメント**: [`build-a-screen.md`](./tutorial/build-a-screen.md)

## 🧭 ナビゲーション実装

### Expo Routerの基本

```typescript
interface ExpoRouterSystem {
  concept: "ファイルベースルーティング";
  architecture: {
    directory: "app/";
    purpose: "ルートとレイアウトを含む";
  };

  conventions: {
    rootLayout: {
      file: "app/_layout.tsx";
      purpose: "共有UI要素を定義";
    };
    indexFiles: {
      pattern: "index.tsx";
      behavior: "親ディレクトリのルートと一致";
    };
    routes: {
      requirement: "Reactコンポーネントをエクスポート";
      platform: "Android、iOS、Web全体で統一";
    };
  };

  navigation: {
    component: "Link";
    stackNavigation: "Stack from expo-router";
    screenConfig: "Stack.Screen options";
  };
}
```

**ルートレイアウト実装**：

```typescript
import { Stack } from 'expo-router';

export default function RootLayout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ title: 'Home' }} />
      <Stack.Screen name="about" options={{ title: 'About' }} />
    </Stack>
  );
}
```

**画面間ナビゲーション**：

```typescript
import { Text, View, StyleSheet } from 'react-native';
import { Link } from 'expo-router';

export default function Index() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>ホーム画面</Text>
      <Link href="/about" style={styles.button}>
        About画面へ移動
      </Link>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#25292e',
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    color: '#fff',
  },
  button: {
    fontSize: 20,
    textDecorationLine: 'underline',
    color: '#fff',
  },
});
```

**詳細ドキュメント**: [`add-navigation.md`](./tutorial/add-navigation.md)

## 📸 画像ピッカー統合

### expo-image-picker実装

```typescript
interface ImagePickerIntegration {
  library: {
    name: "expo-image-picker";
    installation: "npx expo install expo-image-picker";
    purpose: "デバイスメディアライブラリから画像選択";
  };

  functionality: {
    launchImageLibrary: {
      method: "ImagePicker.launchImageLibraryAsync()";
      options: {
        mediaTypes: "['images']";
        allowsEditing: boolean;
        quality: "0-1の範囲";
      };
      return: "ImagePickerResult";
    };
  };

  implementation: {
    stateManagement: "useState<string | undefined>";
    eventHandling: "非同期関数";
    errorHandling: "result.canceled チェック";
  };
}
```

**画像ピッカー実装**：

```typescript
import * as ImagePicker from 'expo-image-picker';
import { useState } from 'react';

export default function Index() {
  const [selectedImage, setSelectedImage] = useState<string | undefined>(
    undefined
  );

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
    <View style={styles.container}>
      <ImageViewer imgSource={selectedImage || PlaceholderImage} />
      <Button
        label="画像を選択"
        theme="primary"
        onPress={pickImageAsync}
      />
    </View>
  );
}
```

**ボタンコンポーネント更新**：

```typescript
type Props = {
  label: string;
  theme?: 'primary';
  onPress?: () => void;
};

export default function Button({ label, theme, onPress }: Props) {
  if (theme === 'primary') {
    return (
      <View style={styles.buttonContainer}>
        <Pressable style={styles.button} onPress={onPress}>
          <FontAwesome name="picture-o" size={18} color="#25292e" />
          <Text style={styles.buttonLabel}>{label}</Text>
        </Pressable>
      </View>
    );
  }
  // ... 残りのコード
}
```

**詳細ドキュメント**: [`image-picker.md`](./tutorial/image-picker.md)

## 🎭 モーダルとインタラクション

### モーダル実装パターン

```typescript
interface ModalImplementation {
  stateManagement: {
    showOptions: "boolean";
    selectedEmoji: "string | undefined";
    purpose: "UI表示制御とデータ管理";
  };

  components: {
    CircleButton: {
      purpose: "絵文字追加トリガー";
      icon: "MaterialIcons plus";
      styling: "円形、白背景";
    };
    IconButton: {
      purpose: "汎用アイコンボタン";
      props: ["icon", "label", "onPress"];
      icons: "MaterialIcons";
    };
    EmojiPicker: {
      purpose: "絵文字選択モーダル";
      component: "React Native Modal";
      behavior: "画面下部からスライドアップ";
    };
    EmojiList: {
      purpose: "絵文字リスト表示";
      component: "FlatList";
      orientation: "水平スクロール";
    };
    EmojiSticker: {
      purpose: "選択した絵文字表示";
      positioning: "画像上にオーバーレイ";
    };
  };
}
```

**CircleButtonコンポーネント**：

```typescript
import { StyleSheet, View, Pressable } from 'react-native';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';

type Props = {
  onPress: () => void;
};

export default function CircleButton({ onPress }: Props) {
  return (
    <View style={styles.circleButtonContainer}>
      <Pressable style={styles.circleButton} onPress={onPress}>
        <MaterialIcons name="add" size={38} color="#25292e" />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  circleButtonContainer: {
    width: 84,
    height: 84,
    marginHorizontal: 60,
    borderWidth: 4,
    borderColor: '#ffd33d',
    borderRadius: 42,
    padding: 3,
  },
  circleButton: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 42,
    backgroundColor: '#fff',
  },
});
```

**EmojiPickerコンポーネント**：

```typescript
import { Modal, View, Text, Pressable, StyleSheet } from 'react-native';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';

type Props = {
  isVisible: boolean;
  children: React.ReactNode;
  onClose: () => void;
};

export default function EmojiPicker({ isVisible, children, onClose }: Props) {
  return (
    <Modal animationType="slide" transparent={true} visible={isVisible}>
      <View style={styles.modalContent}>
        <View style={styles.titleContainer}>
          <Text style={styles.title}>絵文字を選択</Text>
          <Pressable onPress={onClose}>
            <MaterialIcons name="close" color="#fff" size={22} />
          </Pressable>
        </View>
        {children}
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalContent: {
    height: '25%',
    width: '100%',
    backgroundColor: '#25292e',
    borderTopRightRadius: 18,
    borderTopLeftRadius: 18,
    position: 'absolute',
    bottom: 0,
  },
  titleContainer: {
    height: '16%',
    backgroundColor: '#464C55',
    borderTopRightRadius: 10,
    borderTopLeftRadius: 10,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  title: {
    color: '#fff',
    fontSize: 16,
  },
});
```

**EmojiListコンポーネント**：

```typescript
import { useState } from 'react';
import { StyleSheet, FlatList, Image, Platform, Pressable } from 'react-native';

type Props = {
  onSelect: (emoji: string) => void;
  onCloseModal: () => void;
};

export default function EmojiList({ onSelect, onCloseModal }: Props) {
  const [emoji] = useState([
    require('../assets/images/emoji1.png'),
    require('../assets/images/emoji2.png'),
    require('../assets/images/emoji3.png'),
    // ... 他の絵文字
  ]);

  return (
    <FlatList
      horizontal
      showsHorizontalScrollIndicator={Platform.OS === 'web'}
      data={emoji}
      contentContainerStyle={styles.listContainer}
      renderItem={({ item, index }) => (
        <Pressable
          onPress={() => {
            onSelect(item);
            onCloseModal();
          }}>
          <Image source={item} key={index} style={styles.image} />
        </Pressable>
      )}
    />
  );
}

const styles = StyleSheet.create({
  listContainer: {
    borderTopRightRadius: 10,
    borderTopLeftRadius: 10,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  image: {
    width: 100,
    height: 100,
    marginRight: 20,
  },
});
```

**詳細ドキュメント**: [`create-a-modal.md`](./tutorial/create-a-modal.md)

## ✋ ジェスチャーハンドリング

### React Native Gesture Handler統合

```typescript
interface GestureHandling {
  libraries: {
    gestureHandler: {
      name: "react-native-gesture-handler";
      purpose: "ジェスチャー検出と処理";
      components: ["GestureHandlerRootView", "GestureDetector", "Gesture"];
    };
    reanimated: {
      name: "react-native-reanimated";
      purpose: "アニメーション実装";
      features: [
        "useSharedValue",
        "useAnimatedStyle",
        "withSpring",
        "Animated.Image"
      ];
    };
  };

  gestures: {
    tap: {
      type: "Gesture.Tap()";
      config: "numberOfTaps";
      useCase: "ダブルタップでスケール変更";
    };
    pan: {
      type: "Gesture.Pan()";
      events: "onChange";
      useCase: "ドラッグで位置移動";
    };
  };

  implementation: {
    rootSetup: "GestureHandlerRootView at root level";
    animatedComponent: "Animated.Image from reanimated";
    sharedValues: "useSharedValue for animation state";
    animatedStyles: "useAnimatedStyle for dynamic styling";
  };
}
```

**GestureHandlerRootView設定**：

```typescript
import { GestureHandlerRootView } from 'react-native-gesture-handler';

export default function Index() {
  return (
    <GestureHandlerRootView style={styles.container}>
      {/* アプリコンテンツ */}
    </GestureHandlerRootView>
  );
}
```

**タップジェスチャー実装**：

```typescript
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';

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

**パンジェスチャー実装**：

```typescript
const translateX = useSharedValue(0);
const translateY = useSharedValue(0);

const drag = Gesture.Pan().onChange((event) => {
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

return (
  <GestureDetector gesture={drag}>
    <Animated.View style={[containerStyle, { top: -350 }]}>
      <GestureDetector gesture={doubleTap}>
        <Animated.Image
          source={stickerSource}
          resizeMode="contain"
          style={[imageStyle]}
        />
      </GestureDetector>
    </Animated.View>
  </GestureDetector>
);
```

**詳細ドキュメント**: [`gestures.md`](./tutorial/gestures.md)

## 📷 スクリーンショット機能

### スクリーンショットキャプチャ実装

```typescript
interface ScreenshotCapture {
  libraries: {
    viewShot: {
      name: "react-native-view-shot";
      installation: "npx expo install react-native-view-shot";
      purpose: "ビューのスクリーンショットキャプチャ";
      method: "captureRef()";
    };
    mediaLibrary: {
      name: "expo-media-library";
      installation: "npx expo install expo-media-library";
      purpose: "デバイスメディアライブラリへの保存";
      permissions: "usePermissions() hook";
    };
  };

  implementation: {
    refSetup: {
      hook: "useRef<View>(null)";
      prop: "collapsable={false}";
      purpose: "キャプチャ対象ビューの参照";
    };
    permissions: {
      check: "permissionResponse?.granted";
      request: "requestPermission()";
      timing: "useEffect on mount";
    };
    capture: {
      method: "captureRef(imageRef, options)";
      options: {
        height: "number";
        quality: "0-1の範囲";
      };
      save: "MediaLibrary.saveToLibraryAsync(localUri)";
    };
  };
}
```

**権限リクエスト実装**：

```typescript
import { useEffect } from 'react';
import * as MediaLibrary from 'expo-media-library';

export default function Index() {
  const [status, requestPermission] = MediaLibrary.usePermissions();

  useEffect(() => {
    if (!status?.granted) {
      requestPermission();
    }
  }, []);

  // ... 残りのコード
}
```

**Ref設定**：

```typescript
import { useRef } from 'react';
import { View } from 'react-native';
import { captureRef } from 'react-native-view-shot';

export default function Index() {
  const imageRef = useRef<View>(null);

  return (
    <View ref={imageRef} collapsable={false}>
      <ImageViewer imgSource={selectedImage || PlaceholderImage} />
      {pickedEmoji && (
        <EmojiSticker imageSize={40} stickerSource={pickedEmoji} />
      )}
    </View>
  );
}
```

**スクリーンショット保存機能**：

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

**詳細ドキュメント**: [`screenshot.md`](./tutorial/screenshot.md)

## 🌐 プラットフォーム対応

### プラットフォーム固有実装

```typescript
interface PlatformSpecificCode {
  module: {
    name: "Platform from react-native";
    property: "Platform.OS";
    values: ["ios", "android", "web"];
  };

  webLibrary: {
    name: "dom-to-image";
    installation: "npm install dom-to-image";
    purpose: "Web用スクリーンショット";
    method: "domtoimage.toJpeg()";
  };

  implementation: {
    conditional: {
      check: "Platform.OS !== 'web'";
      native: "react-native-view-shot使用";
      web: "dom-to-image使用";
    };
    typescript: {
      issue: "Module declaration missing";
      solution: "types.d.ts ファイル作成";
    };
  };
}
```

**プラットフォーム条件分岐実装**：

```typescript
import { Platform } from 'react-native';
import { captureRef } from 'react-native-view-shot';
import domtoimage from 'dom-to-image';

const onSaveImageAsync = async () => {
  if (Platform.OS !== 'web') {
    // ネイティブプラットフォーム
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
  } else {
    // Webプラットフォーム
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

**TypeScript型定義**：

プロジェクトルートに`types.d.ts`を作成：

```typescript
declare module 'dom-to-image' {
  export function toJpeg(node: HTMLElement, options?: any): Promise<string>;
  export function toPng(node: HTMLElement, options?: any): Promise<string>;
  export function toBlob(node: HTMLElement, options?: any): Promise<Blob>;
}
```

**詳細ドキュメント**: [`platform-differences.md`](./tutorial/platform-differences.md)

## ⚙️ アプリ設定

### ステータスバー設定

```typescript
interface StatusBarConfiguration {
  library: {
    name: "expo-status-bar";
    preinstalled: true;
    component: "StatusBar";
  };

  configuration: {
    location: "app/_layout.tsx";
    props: {
      style: "'light' | 'dark' | 'auto'";
      backgroundColor?: "string";
      hidden?: "boolean";
    };
  };

  implementation: {
    placement: "RootLayout内、Stackの外側";
    purpose: "アプリ全体のステータスバースタイル制御";
  };
}
```

**ステータスバー実装**：

```typescript
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

export default function RootLayout() {
  return (
    <>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      </Stack>
      <StatusBar style="light" />
    </>
  );
}
```

### アプリアイコン設定

```typescript
interface AppIconConfiguration {
  location: {
    default: "assets/images/icon.png";
    config: "app.json";
  };

  configuration: {
    property: "icon";
    format: "PNG";
    resolution: "推奨1024x1024以上";
  };

  eas: {
    optimization: true;
    purpose: "デバイス別最適化アイコン生成";
    timing: "アプリストアビルド時";
  };
}
```

**app.json設定例**：

```json
{
  "expo": {
    "icon": "./assets/images/icon.png"
  }
}
```

### スプラッシュスクリーン設定

```typescript
interface SplashScreenConfiguration {
  library: {
    name: "expo-splash-screen";
    plugin: "expo-splash-screen";
    preinstalled: true;
  };

  configuration: {
    location: "app.json";
    properties: {
      image: "スプラッシュスクリーン画像パス";
      resizeMode: "'contain' | 'cover' | 'native'";
      backgroundColor: "背景色";
    };
  };

  testing: {
    limitation: ["Expo Go不可", "開発ビルド不可"];
    required: ["プレビュービルド", "本番ビルド"];
  };
}
```

**app.json設定例**：

```json
{
  "expo": {
    "splash": {
      "image": "./assets/images/splash-icon.png",
      "resizeMode": "contain",
      "backgroundColor": "#25292e"
    },
    "plugins": [
      [
        "expo-splash-screen",
        {
          "image": "./assets/images/splash-icon.png"
        }
      ]
    ]
  }
}
```

**スプラッシュスクリーンテスト手順**：

1. プレビューまたは本番ビルドを作成
2. 物理デバイスまたはエミュレーターにインストール
3. アプリ起動時にスプラッシュスクリーンを確認

**詳細ドキュメント**: [`configuration.md`](./tutorial/configuration.md)

## 🎯 実装パターンとベストプラクティス

### コンポーネント設計パターン

```typescript
interface ComponentDesignPatterns {
  structure: {
    composition: "再利用可能な小さなコンポーネント";
    props: "TypeScript型定義必須";
    styling: "StyleSheet.createで一元管理";
  };

  naming: {
    components: "PascalCase（例: ImageViewer）";
    files: "コンポーネント名と一致";
    props: "明確で説明的な名前";
  };

  organization: {
    directory: "components/";
    grouping: "機能別または画面別";
    exports: "default export推奨";
  };
}
```

### 状態管理パターン

```typescript
interface StateManagementPatterns {
  localState: {
    hook: "useState";
    usage: "コンポーネント固有の状態";
    examples: [
      "選択された画像",
      "モーダル表示状態",
      "選択された絵文字"
    ];
  };

  refs: {
    hook: "useRef";
    usage: "DOM参照、タイマー、前の値保持";
    examples: ["スクリーンショット用のView参照"];
  };

  effects: {
    hook: "useEffect";
    usage: "副作用、権限リクエスト、データ取得";
    examples: ["メディアライブラリ権限リクエスト"];
  };
}
```

### スタイリングベストプラクティス

```typescript
interface StylingBestPractices {
  flexbox: {
    principle: "レイアウトの基本";
    properties: [
      "flex: 画面全体を埋める",
      "flexDirection: 子要素の方向",
      "justifyContent: 主軸の配置",
      "alignItems: 交差軸の配置",
    ];
  };

  dimensions: {
    fixed: "固定サイズ（width, height）";
    flexible: "flex値で相対サイズ";
    responsive: "Dimensionsで画面サイズ取得";
  };

  colors: {
    naming: "意味のある変数名";
    consistency: "アプリ全体で一貫したカラーパレット";
    darkMode: "ダークモード対応を考慮";
  };
}
```

### エラーハンドリングパターン

```typescript
interface ErrorHandlingPatterns {
  asyncOperations: {
    pattern: "try-catch";
    logging: "console.log or console.error";
    userFeedback: "alert or Toast";
  };

  permissions: {
    check: "権限状態確認";
    request: "権限リクエスト";
    fallback: "権限拒否時の代替処理";
  };

  validation: {
    input: "ユーザー入力検証";
    state: "状態遷移検証";
    platform: "プラットフォーム互換性チェック";
  };
}
```

**エラーハンドリング実装例**：

```typescript
// 非同期操作のエラーハンドリング
const pickImageAsync = async () => {
  try {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      setSelectedImage(result.assets[0].uri);
    } else {
      // ユーザーがキャンセルした場合
      console.log('画像選択がキャンセルされました');
    }
  } catch (error) {
    console.error('画像選択エラー:', error);
    alert('画像の選択中にエラーが発生しました');
  }
};

// 権限チェックとリクエスト
useEffect(() => {
  const requestPermissions = async () => {
    try {
      const { status } = await MediaLibrary.requestPermissionsAsync();
      if (status !== 'granted') {
        alert('メディアライブラリへのアクセス権限が必要です');
      }
    } catch (error) {
      console.error('権限リクエストエラー:', error);
    }
  };

  requestPermissions();
}, []);
```

## 📚 学習リソースと次のステップ

### 推奨学習パス

```typescript
interface LearningPath {
  fundamentals: {
    react: {
      resources: [
        "Reactドキュメント - クイックスタートセクション",
        "Hooksセクション",
      ];
      url: "https://react.dev/learn";
    };
    reactNative: {
      resources: [
        "React Nativeの基本ガイド",
        "View APIリファレンス",
        "Text APIリファレンス",
        "プラットフォーム固有のコード",
        "Flexboxレイアウト",
      ];
      url: "https://reactnative.dev/docs/getting-started";
    };
  };

  advanced: {
    gesturesAnimation: {
      resources: [
        "React Native Gesture Handler",
        "React Native Reanimated",
      ];
      topics: [
        "複雑なジェスチャー",
        "カスタムアニメーション",
        "パフォーマンス最適化",
      ];
    };
    expoRouter: {
      resource: "Expo Routerドキュメント";
      topics: [
        "高度なルーティング",
        "ディープリンク",
        "認証フロー",
      ];
    };
  };

  developmentTools: {
    resources: [
      "開発ツール",
      "開発ビルド",
      "開発概要",
      "デバッグガイド",
    ];
  };

  deployment: {
    topics: [
      "アプリアイコンとスプラッシュスクリーン",
      "アプリの配信",
      "EAS Build",
      "EAS Submit",
    ];
  };
}
```

### 実践プロジェクトアイデア

```typescript
interface ProjectIdeas {
  beginner: [
    "ToDoリストアプリ",
    "天気情報アプリ",
    "簡単な電卓",
    "画像ギャラリー",
  ];

  intermediate: [
    "ソーシャルメディアクローン",
    "Eコマースアプリ",
    "メモ・ノート取りアプリ",
    "音楽プレーヤー",
  ];

  advanced: [
    "リアルタイムチャットアプリ",
    "位置情報ベースアプリ",
    "AR機能統合",
    "オフライン対応アプリ",
  ];
}
```

### コミュニティリソース

```typescript
interface CommunityResources {
  discord: {
    url: "https://chat.expo.dev/";
    purpose: "質問、ディスカッション、サポート";
  };

  forums: {
    github: "GitHub Issues・Discussions";
    stackoverflow: "Stack Overflow - expo tag";
  };

  contribution: {
    opensource: "Expoオープンソースプロジェクト";
    documentation: "ドキュメント改善";
    examples: "サンプルアプリ共有";
  };
}
```

**詳細ドキュメント**: [`follow-up.md`](./tutorial/follow-up.md)

## 🔗 関連リソース

### チュートリアル関連ドキュメント

- [`introduction.md`](./tutorial/introduction.md) - チュートリアル概要と目的
- [`create-your-first-app.md`](./tutorial/create-your-first-app.md) - プロジェクトセットアップ
- [`build-a-screen.md`](./tutorial/build-a-screen.md) - UI構築
- [`add-navigation.md`](./tutorial/add-navigation.md) - ナビゲーション実装
- [`image-picker.md`](./tutorial/image-picker.md) - 画像ピッカー統合
- [`create-a-modal.md`](./tutorial/create-a-modal.md) - モーダル実装
- [`gestures.md`](./tutorial/gestures.md) - ジェスチャーハンドリング
- [`screenshot.md`](./tutorial/screenshot.md) - スクリーンショット機能
- [`platform-differences.md`](./tutorial/platform-differences.md) - プラットフォーム対応
- [`configuration.md`](./tutorial/configuration.md) - アプリ設定
- [`follow-up.md`](./tutorial/follow-up.md) - 学習リソース

### EASチュートリアル

- [EAS Tutorial Overview](./tutorial/eas/) - EAS統合チュートリアル
- [EAS Build](./tutorial/eas/build.md) - アプリビルド
- [EAS Submit](./tutorial/eas/submit.md) - アプリストア提出
- [EAS Update](./tutorial/eas/update.md) - OTAアップデート

### 外部リソース

- [チュートリアル完全ソースコード](https://github.com/expo/examples/tree/master/stickersmash) - GitHubリポジトリ
- [Expo Documentation](https://docs.expo.dev/) - 公式ドキュメント
- [React Native Documentation](https://reactnative.dev/) - React Native公式ドキュメント
- [Expo Discord](https://chat.expo.dev/) - コミュニティサポート

### 関連フレームワークドキュメント

- **[Expo Router](../router/)** - ファイルベースルーティング
- **[Expo SDK](../versions/)** - SDKライブラリリファレンス
- **[EAS Build](../build/)** - クラウドビルドサービス
- **[Development Workflow](../workflow/)** - 開発ワークフロー

## 📋 まとめ

このチュートリアルでは、ExpoとReact Nativeを使用した実践的なアプリケーション開発の基礎から応用までをカバーしました：

```typescript
interface TutorialSummary {
  keyTopics: [
    "プロジェクトセットアップとTypeScript設定",
    "React Nativeコンポーネントの基本",
    "Expo Routerでのナビゲーション",
    "expo-image-pickerでの画像選択",
    "モーダルとインタラクティブUI",
    "ジェスチャーハンドリングとアニメーション",
    "スクリーンショット機能実装",
    "プラットフォーム固有コード対応",
    "アプリ設定とカスタマイズ",
  ];

  skillsAcquired: [
    "TypeScript + React Nativeでの開発",
    "Expoエコシステムの理解",
    "クロスプラットフォーム対応",
    "モダンなUI/UXパターン",
    "状態管理とイベントハンドリング",
    "サードパーティライブラリ統合",
    "プラットフォーム固有実装",
  ];

  nextSteps: [
    "チュートリアルプロジェクトのカスタマイズ",
    "推奨学習リソースの探索",
    "実践プロジェクトの開始",
    "EASサービスの学習（ビルド、提出、更新）",
    "コミュニティへの参加と貢献",
  ];

  buildYourApp: {
    start: "npx create-expo-app@latest";
    develop: "継続的な学習と実践";
    deploy: "EAS Buildで本番リリース";
    community: "Discordでサポート取得";
  };
}
```

このチュートリアルを完了したら、学んだ知識を活用して独自のアプリケーションを構築し、Expoエコシステムのさらなる機能を探索してください。
