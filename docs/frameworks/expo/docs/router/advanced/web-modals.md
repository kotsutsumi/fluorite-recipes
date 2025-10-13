# Webモーダル

Expo RouterでWebモーダルを実装する方法を学びます。

## Webモーダルとは

Webモーダルは、Expo SDK 54以降で利用可能な機能で、Webアプリに柔軟なモーダルエクスペリエンスを提供します。

## 基本的な設定

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
      <Text style={styles.title}>Web Modal</Text>
      <Button title="Close" onPress={() => router.back()} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
  },
});
```

## プレゼンテーションスタイル

### modal（中央オーバーレイ）

大画面では中央にオーバーレイとして表示されます。

```typescript
<Stack.Screen
  name="modal"
  options={{
    presentation: 'modal',
  }}
/>
```

### formSheet（ボトムシート）

モバイル画面ではボトムシートとして表示されます。

```typescript
<Stack.Screen
  name="modal"
  options={{
    presentation: 'formSheet',
  }}
/>
```

### transparentModal（透過オーバーレイ）

背景を隠さないオーバーレイです。

```typescript
<Stack.Screen
  name="modal"
  options={{
    presentation: 'transparentModal',
  }}
/>
```

### containedTransparentModal

透過モーダルと同様ですが、コンテナ内に収まります。

```typescript
<Stack.Screen
  name="modal"
  options={{
    presentation: 'containedTransparentModal',
  }}
/>
```

## Webモーダルのカスタマイズ

### webModalStyleオプション

Web固有のスタイリングプロパティを使用します。

```typescript
<Stack.Screen
  name="modal"
  options={{
    presentation: 'modal',
    webModalStyle: {
      width: '95vw',
      height: '95vh',
      maxWidth: 1200,
      maxHeight: 800,
      border: 'none',
      borderRadius: 10,
      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
    },
  }}
/>
```

### サイズとポジション

```typescript
<Stack.Screen
  name="modal"
  options={{
    presentation: 'modal',
    webModalStyle: {
      width: '80vw',
      height: '80vh',
      top: '10vh',
      left: '10vw',
    },
  }}
/>
```

### ボーダーとシャドウ

```typescript
<Stack.Screen
  name="modal"
  options={{
    presentation: 'modal',
    webModalStyle: {
      border: '1px solid #e0e0e0',
      borderRadius: 12,
      boxShadow: '0 10px 25px rgba(0, 0, 0, 0.2)',
    },
  }}
/>
```

## シートのカスタマイズ

### sheetAllowedDetents

モーダルのスナップ位置を制御します。

```typescript
<Stack.Screen
  name="modal"
  options={{
    presentation: 'formSheet',
    sheetAllowedDetents: 'fitToContents',  // 'all' | 'large' | 'medium'
  }}
/>
```

**オプション**：
- `fitToContents`: コンテンツに合わせる
- `all`: すべてのdetents
- `large`: 大きいサイズ
- `medium`: 中サイズ

### sheetCornerRadius

モーダルの角の丸みを調整します。

```typescript
<Stack.Screen
  name="modal"
  options={{
    presentation: 'formSheet',
    sheetCornerRadius: 20,
  }}
/>
```

### sheetGrabberVisible

グラバーの表示/非表示を制御します。

```typescript
<Stack.Screen
  name="modal"
  options={{
    presentation: 'formSheet',
    sheetGrabberVisible: true,
  }}
/>
```

## レスポンシブデザイン

### デスクトップとモバイルで異なるスタイル

```typescript
import { Platform } from 'react-native';

<Stack.Screen
  name="modal"
  options={{
    presentation: 'modal',
    webModalStyle: Platform.select({
      web: {
        width: '95vw',
        height: '95vh',
        maxWidth: 1200,
      },
      default: undefined,
    }),
  }}
/>
```

### メディアクエリの使用

```typescript
<Stack.Screen
  name="modal"
  options={{
    presentation: 'modal',
    webModalStyle: {
      width: '95vw',
      height: '95vh',
      '@media (max-width: 768px)': {
        width: '100vw',
        height: '100vh',
      },
    },
  }}
/>
```

## ネストされたナビゲーターのアンカリング

### anchor オプション

ネストされたナビゲーターに対してモーダルをアンカリングします。

```typescript
<Stack.Screen
  name="modal"
  options={{
    presentation: 'modal',
    anchor: '/home',
  }}
/>
```

### 使用例

```
app/
├── _layout.tsx
├── home/
│   ├── _layout.tsx
│   └── index.tsx
└── modal.tsx
```

```typescript
// app/_layout.tsx
<Stack>
  <Stack.Screen name="home" />
  <Stack.Screen
    name="modal"
    options={{
      presentation: 'modal',
      anchor: '/home',
    }}
  />
</Stack>
```

## グローバルCSS カスタマイズ

### CSS変数の使用

グローバルCSSでモーダルの外観をカスタマイズできます。

```css
/* global.css */
:root {
  --expo-router-modal-background: rgba(0, 0, 0, 0.5);
  --expo-router-modal-border-radius: 12px;
  --expo-router-modal-box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
}
```

### カスタムクラスの追加

```typescript
<Stack.Screen
  name="modal"
  options={{
    presentation: 'modal',
    webModalStyle: {
      className: 'custom-modal',
    },
  }}
/>
```

```css
/* global.css */
.custom-modal {
  border: 2px solid #f4511e;
  border-radius: 16px;
  box-shadow: 0 20px 40px rgba(244, 81, 30, 0.3);
}
```

## オーバーレイのカスタマイズ

### オーバーレイの背景色

```typescript
<Stack.Screen
  name="modal"
  options={{
    presentation: 'modal',
    webModalStyle: {
      overlay: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
      },
    },
  }}
/>
```

### オーバーレイのクリックイベント

```typescript
<Stack.Screen
  name="modal"
  options={{
    presentation: 'modal',
    webModalStyle: {
      overlay: {
        onPress: () => router.back(),
      },
    },
  }}
/>
```

## アニメーション

### トランジションアニメーション

```typescript
<Stack.Screen
  name="modal"
  options={{
    presentation: 'modal',
    animation: 'fade',  // 'slide_from_bottom' | 'fade' | 'none'
  }}
/>
```

### カスタムアニメーション

```css
/* global.css */
@keyframes modalSlideIn {
  from {
    transform: translateY(100%);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

.custom-modal {
  animation: modalSlideIn 0.3s ease-out;
}
```

## 完全なカスタマイズ例

### 高度にカスタマイズされたモーダル

```typescript
// app/_layout.tsx
<Stack.Screen
  name="modal"
  options={{
    presentation: 'modal',
    title: 'Custom Modal',
    headerStyle: {
      backgroundColor: '#f4511e',
    },
    headerTintColor: '#fff',
    webModalStyle: {
      width: '90vw',
      height: '85vh',
      maxWidth: 1000,
      maxHeight: 700,
      border: 'none',
      borderRadius: 16,
      boxShadow: '0 20px 40px rgba(0, 0, 0, 0.2)',
      overlay: {
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
      },
    },
    sheetAllowedDetents: 'fitToContents',
    sheetCornerRadius: 16,
    sheetGrabberVisible: true,
  }}
/>
```

### モーダル画面

```typescript
// app/modal.tsx
import { View, Text, ScrollView, Button, StyleSheet } from 'react-native';
import { router } from 'expo-router';

export default function CustomModalScreen() {
  return (
    <View style={styles.container}>
      <ScrollView style={styles.content}>
        <Text style={styles.title}>Custom Modal</Text>
        <Text style={styles.description}>
          This is a highly customized modal with responsive design.
        </Text>
        {/* モーダルコンテンツ */}
      </ScrollView>
      <View style={styles.footer}>
        <Button title="Close" onPress={() => router.back()} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  description: {
    fontSize: 16,
    color: '#666',
    marginBottom: 20,
  },
  footer: {
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
});
```

## ベストプラクティス

### 1. レスポンシブデザイン

デスクトップとモバイルで適切なサイズを設定してください。

```typescript
webModalStyle: {
  width: '95vw',
  height: '95vh',
  maxWidth: 1200,
  '@media (max-width: 768px)': {
    width: '100vw',
    height: '100vh',
  },
}
```

### 2. アクセシビリティ

閉じるボタンを明確に表示してください。

### 3. パフォーマンス

大きなモーダルには、遅延読み込みを使用してください。

### 4. コンシステンシー

アプリ全体で一貫したモーダルスタイルを使用してください。

## まとめ

Expo RouterのWebモーダルは、以下の機能を提供します：

1. **柔軟なプレゼンテーションスタイル**: modal、formSheet、transparentModal
2. **カスタマイズ可能**: webModalStyleとCSS変数
3. **レスポンシブデザイン**: デスクトップとモバイルで最適化
4. **アンカリング**: ネストされたナビゲーターのサポート
5. **アニメーション**: トランジションとカスタムアニメーション

これらの機能を活用して、モダンで美しいWebモーダルエクスペリエンスを提供できます。
