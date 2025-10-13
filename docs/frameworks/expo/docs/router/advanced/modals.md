# モーダル

Expo Routerでモーダルを実装する方法を学びます。

## モーダルの実装方法

Expo Routerでは、モーダルを実装する2つの主な方法があります：

1. **React NativeのModalコンポーネント**: スタンドアロンのインタラクション用
2. **Expo Routerのファイルベースモーダルルーティング**: ナビゲーション統合用

## React NativeのModalコンポーネント

### 基本的な使用方法

```typescript
import { Modal, View, Text, Button, StyleSheet } from 'react-native';
import { useState } from 'react';

export default function Screen() {
  const [visible, setVisible] = useState(false);

  return (
    <View style={styles.container}>
      <Button title="Open Modal" onPress={() => setVisible(true)} />

      <Modal
        visible={visible}
        animationType="slide"
        transparent={false}
        onRequestClose={() => setVisible(false)}
      >
        <View style={styles.modalContainer}>
          <Text style={styles.modalText}>This is a Modal</Text>
          <Button title="Close" onPress={() => setVisible(false)} />
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  modalText: {
    fontSize: 20,
    marginBottom: 20,
  },
});
```

### アニメーションタイプ

```typescript
<Modal
  visible={visible}
  animationType="slide"  // "slide" | "fade" | "none"
  onRequestClose={() => setVisible(false)}
>
  {/* モーダルコンテンツ */}
</Modal>
```

### 透過モーダル

```typescript
<Modal
  visible={visible}
  animationType="fade"
  transparent={true}
  onRequestClose={() => setVisible(false)}
>
  <View style={styles.overlay}>
    <View style={styles.modalContent}>
      <Text>Transparent Modal</Text>
      <Button title="Close" onPress={() => setVisible(false)} />
    </View>
  </View>
</Modal>

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    minWidth: 300,
  },
});
```

### 最適な使用例

- 一時的なアラート
- 確認ダイアログ
- 簡単なフォーム入力
- スタンドアロンのインタラクション

## Expo Routerのモーダル画面

### プロジェクト構造

```
app/
├── _layout.tsx
├── index.tsx
└── modal.tsx
```

### レイアウトの設定

```typescript
// app/_layout.tsx
import { Stack } from 'expo-router';

export default function RootLayout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ title: 'Home' }} />
      <Stack.Screen
        name="modal"
        options={{
          presentation: 'modal',
          title: 'Modal',
        }}
      />
    </Stack>
  );
}
```

### モーダル画面の作成

```typescript
// app/modal.tsx
import { View, Text, Button, StyleSheet } from 'react-native';
import { router } from 'expo-router';

export default function ModalScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Modal Screen</Text>
      <Text style={styles.subtitle}>This is a modal screen</Text>
      <Button
        title="Close"
        onPress={() => router.back()}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 20,
  },
});
```

### ホーム画面からモーダルを開く

```typescript
// app/index.tsx
import { View, Button, StyleSheet } from 'react-native';
import { Link, router } from 'expo-router';

export default function HomeScreen() {
  return (
    <View style={styles.container}>
      {/* Linkコンポーネントを使用 */}
      <Link href="/modal" asChild>
        <Button title="Open Modal (Link)" />
      </Link>

      {/* routerを使用 */}
      <Button
        title="Open Modal (Router)"
        onPress={() => router.push('/modal')}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 10,
  },
});
```

## プラットフォーム固有の動作

### Android

- モーダルは画面の上にスライドします
- 戻るボタンでモーダルを閉じることができます

### iOS

- モーダルは下から上にスライドします
- 下にスワイプしてモーダルを閉じることができます

### Web

- Webでは、手動で閉じるロジックを実装する必要があります

```typescript
import { useRouter } from 'expo-router';

export default function ModalScreen() {
  const router = useRouter();

  const handleClose = () => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.push('/');
    }
  };

  return (
    <View>
      <Button title="Close" onPress={handleClose} />
    </View>
  );
}
```

## プレゼンテーションスタイル

### card（デフォルト）

```typescript
<Stack.Screen
  name="modal"
  options={{
    presentation: 'card',
  }}
/>
```

### modal

```typescript
<Stack.Screen
  name="modal"
  options={{
    presentation: 'modal',
  }}
/>
```

### transparentModal

```typescript
<Stack.Screen
  name="modal"
  options={{
    presentation: 'transparentModal',
  }}
/>
```

### containedModal

```typescript
<Stack.Screen
  name="modal"
  options={{
    presentation: 'containedModal',
  }}
/>
```

### fullScreenModal

```typescript
<Stack.Screen
  name="modal"
  options={{
    presentation: 'fullScreenModal',
  }}
/>
```

### formSheet

```typescript
<Stack.Screen
  name="modal"
  options={{
    presentation: 'formSheet',
  }}
/>
```

## ステータスバーの設定

### ステータスバーの色

```typescript
<Stack.Screen
  name="modal"
  options={{
    presentation: 'modal',
    statusBarStyle: 'light',
    statusBarColor: '#f4511e',
  }}
/>
```

### ステータスバーの非表示

```typescript
<Stack.Screen
  name="modal"
  options={{
    presentation: 'modal',
    statusBarHidden: true,
  }}
/>
```

## ディープリンクモーダル

モーダルは、ディープリンクでも開くことができます。

### URL

```
myapp://modal
https://myapp.com/modal
```

### コード

```typescript
// app/modal.tsx
import { useLocalSearchParams } from 'expo-router';

export default function ModalScreen() {
  const { id } = useLocalSearchParams();

  return (
    <View>
      <Text>Modal for ID: {id}</Text>
    </View>
  );
}
```

### ナビゲーション

```typescript
router.push('/modal?id=123');
```

または：

```typescript
router.push({
  pathname: '/modal',
  params: { id: '123' },
});
```

## カスタムモーダルヘッダー

### ヘッダーのカスタマイズ

```typescript
<Stack.Screen
  name="modal"
  options={{
    presentation: 'modal',
    title: 'My Modal',
    headerStyle: {
      backgroundColor: '#f4511e',
    },
    headerTintColor: '#fff',
    headerTitleStyle: {
      fontWeight: 'bold',
    },
    headerLeft: () => null,
    headerRight: () => (
      <Button title="Done" onPress={() => router.back()} />
    ),
  }}
/>
```

### ヘッダーの非表示

```typescript
<Stack.Screen
  name="modal"
  options={{
    presentation: 'modal',
    headerShown: false,
  }}
/>
```

## モーダルのネスト

モーダル内から別のモーダルを開くことができます。

### プロジェクト構造

```
app/
├── _layout.tsx
├── index.tsx
├── modal1.tsx
└── modal2.tsx
```

### レイアウト

```typescript
// app/_layout.tsx
<Stack>
  <Stack.Screen name="index" />
  <Stack.Screen name="modal1" options={{ presentation: 'modal' }} />
  <Stack.Screen name="modal2" options={{ presentation: 'modal' }} />
</Stack>
```

### ナビゲーション

```typescript
// app/modal1.tsx
<Button
  title="Open Second Modal"
  onPress={() => router.push('/modal2')}
/>
```

## ベストプラクティス

### 1. 適切なモーダルタイプの選択

- **React Native Modal**: 簡単なアラートや確認
- **Expo Router Modal**: ナビゲーション統合が必要な場合

### 2. 閉じるボタンの提供

常に明確な閉じる方法を提供してください。

```typescript
<Button title="Close" onPress={() => router.back()} />
```

### 3. Webでの戻るボタンのサポート

Webでは、`router.canGoBack()`をチェックしてください。

```typescript
const handleClose = () => {
  if (router.canGoBack()) {
    router.back();
  } else {
    router.push('/');
  }
};
```

### 4. プラットフォーム固有の動作の考慮

プラットフォームごとに動作が異なることを考慮してください。

## まとめ

Expo Routerのモーダルは、以下の方法で実装できます：

1. **React Native Modal**: スタンドアロンのインタラクション用
2. **Expo Router Modal**: ナビゲーション統合用

**主な機能**：
- 複数のプレゼンテーションスタイル
- プラットフォーム固有の動作
- ディープリンクサポート
- カスタマイズ可能なヘッダー
- ネストされたモーダル

これらの機能を活用して、直感的で美しいモーダルエクスペリエンスを提供できます。
