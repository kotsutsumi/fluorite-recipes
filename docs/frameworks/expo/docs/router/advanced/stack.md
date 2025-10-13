# Stack Navigator

Expo RouterのStackナビゲーターを使用して、画面間のナビゲーションを管理します。

## Stackナビゲーターとは

Stackナビゲーターは、アプリ内の画面間のナビゲーションを管理する基本的な方法です。ファイルベースのルーティングを使用して、簡単にスタックナビゲーションを実装できます。

## 基本的な設定

### プロジェクト構造

```
app/
  _layout.tsx         # スタックレイアウト
  index.tsx           # ホーム画面
  about.tsx           # About画面
  details.tsx         # 詳細画面
```

### 基本的なStack

```typescript
// app/_layout.tsx
import { Stack } from 'expo-router';

export default function Layout() {
  return <Stack />;
}
```

この基本設定により、`app`ディレクトリ内のすべてのファイルがスタックナビゲーションで管理されます。

## ヘッダーのカスタマイズ

### 静的なスクリーンオプション

すべての画面に共通のオプションを設定します。

```typescript
// app/_layout.tsx
import { Stack } from 'expo-router';

export default function Layout() {
  return (
    <Stack
      screenOptions={{
        headerStyle: {
          backgroundColor: '#f4511e',
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      }}
    />
  );
}
```

### 個別の画面オプション

特定の画面にカスタムオプションを設定します。

```typescript
// app/_layout.tsx
import { Stack } from 'expo-router';

export default function Layout() {
  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          title: 'Home',
          headerStyle: { backgroundColor: '#f4511e' },
          headerTintColor: '#fff',
        }}
      />
      <Stack.Screen
        name="about"
        options={{
          title: 'About Us',
        }}
      />
      <Stack.Screen
        name="details"
        options={{
          title: 'Details',
          headerBackTitle: 'Back',
        }}
      />
    </Stack>
  );
}
```

### 動的なスクリーンオプション

画面内から動的にオプションを設定します。

```typescript
// app/details.tsx
import { Stack, useLocalSearchParams } from 'expo-router';
import { View, Text } from 'react-native';

export default function DetailsScreen() {
  const { id } = useLocalSearchParams();

  return (
    <>
      <Stack.Screen
        options={{
          title: `Detail ${id}`,
        }}
      />
      <View>
        <Text>Details for item {id}</Text>
      </View>
    </>
  );
}
```

## ヘッダーボタンのカスタマイズ

### 右側のボタン

```typescript
// app/_layout.tsx
import { Stack } from 'expo-router';
import { Button } from 'react-native';

export default function Layout() {
  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          title: 'Home',
          headerRight: () => (
            <Button
              title="Info"
              onPress={() => alert('This is a button!')}
            />
          ),
        }}
      />
    </Stack>
  );
}
```

### 左側のボタン

```typescript
<Stack.Screen
  name="index"
  options={{
    title: 'Home',
    headerLeft: () => (
      <Button
        title="Menu"
        onPress={() => alert('Menu!')}
      />
    ),
  }}
/>
```

### カスタム戻るボタン

```typescript
import { Stack, useRouter } from 'expo-router';
import { TouchableOpacity, Text } from 'react-native';

export default function Layout() {
  const router = useRouter();

  return (
    <Stack>
      <Stack.Screen
        name="details"
        options={{
          headerLeft: () => (
            <TouchableOpacity onPress={() => router.back()}>
              <Text style={{ color: '#fff', marginLeft: 10 }}>← Back</Text>
            </TouchableOpacity>
          ),
        }}
      />
    </Stack>
  );
}
```

## ナビゲーション操作

### dismiss

最後の画面を閉じます。

```typescript
import { router } from 'expo-router';

<Button
  title="Close"
  onPress={() => router.dismiss()}
/>
```

### dismissTo

特定のルートまで画面を閉じます。

```typescript
import { router } from 'expo-router';

<Button
  title="Go back to Home"
  onPress={() => router.dismissTo('/home')}
/>
```

### dismissAll

スタックの最初の画面に戻ります。

```typescript
import { router } from 'expo-router';

<Button
  title="Go to Root"
  onPress={() => router.dismissAll()}
/>
```

## プレゼンテーションモード

### モーダル

```typescript
<Stack.Screen
  name="modal"
  options={{
    presentation: 'modal',
    title: 'Modal Screen',
  }}
/>
```

### カード（デフォルト）

```typescript
<Stack.Screen
  name="details"
  options={{
    presentation: 'card',
  }}
/>
```

### 透過モーダル

```typescript
<Stack.Screen
  name="transparent-modal"
  options={{
    presentation: 'transparentModal',
  }}
/>
```

## アニメーション

### スライドアニメーション

```typescript
<Stack.Screen
  name="details"
  options={{
    animation: 'slide_from_right',
  }}
/>
```

### フェードアニメーション

```typescript
<Stack.Screen
  name="details"
  options={{
    animation: 'fade',
  }}
/>
```

### カスタムアニメーション

```typescript
<Stack.Screen
  name="details"
  options={{
    animation: 'flip',
  }}
/>
```

利用可能なアニメーション：
- `slide_from_right`（デフォルト）
- `slide_from_left`
- `slide_from_bottom`
- `fade`
- `fade_from_bottom`
- `flip`
- `simple_push`
- `none`

## ジェスチャー設定

### スワイプジェスチャーの無効化

```typescript
<Stack.Screen
  name="details"
  options={{
    gestureEnabled: false,
  }}
/>
```

### フルスクリーンスワイプ

```typescript
<Stack.Screen
  name="details"
  options={{
    fullScreenGestureEnabled: true,
  }}
/>
```

## ヘッダーの非表示

### 特定の画面でヘッダーを非表示

```typescript
<Stack.Screen
  name="index"
  options={{
    headerShown: false,
  }}
/>
```

### すべての画面でヘッダーを非表示

```typescript
<Stack
  screenOptions={{
    headerShown: false,
  }}
/>
```

## ステータスバー設定

### ステータスバーの色

```typescript
<Stack.Screen
  name="index"
  options={{
    statusBarStyle: 'light',
    statusBarColor: '#f4511e',
  }}
/>
```

### ステータスバーの非表示

```typescript
<Stack.Screen
  name="index"
  options={{
    statusBarHidden: true,
  }}
/>
```

## iOS 26のLiquid Glassエフェクト

iOS 26以降、ヘッダーにLiquid Glassエフェクトが追加されました。

### エフェクトの無効化（オプション1）

`UIDesignRequiresCompatibility`を使用：

```typescript
// app.json
{
  "expo": {
    "ios": {
      "infoPlist": {
        "UIDesignRequiresCompatibility": true
      }
    }
  }
}
```

### JavaScriptベースのナビゲーションに切り替え（オプション2）

```typescript
<Stack.Screen
  name="index"
  options={{
    headerTransparent: true,
    headerBlurEffect: 'systemMaterial',
  }}
/>
```

## カスタムヘッダー

### 完全カスタムヘッダー

```typescript
import { Stack } from 'expo-router';
import { View, Text, StyleSheet } from 'react-native';

export default function Layout() {
  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          header: () => (
            <View style={styles.header}>
              <Text style={styles.headerText}>Custom Header</Text>
            </View>
          ),
        }}
      />
    </Stack>
  );
}

const styles = StyleSheet.create({
  header: {
    height: 60,
    backgroundColor: '#f4511e',
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 10,
  },
  headerText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
});
```

## スクリーンオプションの完全な例

```typescript
// app/_layout.tsx
import { Stack } from 'expo-router';

export default function Layout() {
  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          title: 'Home',
          headerStyle: {
            backgroundColor: '#f4511e',
          },
          headerTintColor: '#fff',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
          headerRight: () => (
            <Button title="Info" onPress={() => {}} />
          ),
          animation: 'slide_from_right',
          presentation: 'card',
          gestureEnabled: true,
          statusBarStyle: 'light',
        }}
      />
      <Stack.Screen
        name="modal"
        options={{
          presentation: 'modal',
          title: 'Modal',
          headerLeft: () => null,
        }}
      />
    </Stack>
  );
}
```

## ベストプラクティス

### 1. 一貫したスタイル

アプリ全体で一貫したヘッダースタイルを使用してください。

```typescript
<Stack
  screenOptions={{
    headerStyle: { backgroundColor: '#f4511e' },
    headerTintColor: '#fff',
  }}
/>
```

### 2. 戻るボタンのテキスト

iOS 以外では、戻るボタンのテキストをカスタマイズしても効果がありません。

```typescript
<Stack.Screen
  name="details"
  options={{
    headerBackTitle: 'Back', // iOSのみ
  }}
/>
```

### 3. モーダルの適切な使用

モーダルは、一時的なタスクや重要なアクションに使用してください。

```typescript
<Stack.Screen
  name="edit-profile"
  options={{
    presentation: 'modal',
    title: 'Edit Profile',
  }}
/>
```

## まとめ

Expo RouterのStackナビゲーターは、以下の機能を提供します：

1. **ファイルベースのルーティング**: シンプルな設定
2. **カスタマイズ可能なヘッダー**: スタイル、ボタン、タイトル
3. **柔軟なナビゲーション**: push、replace、dismiss操作
4. **アニメーション**: 複数のトランジションオプション
5. **プレゼンテーションモード**: カード、モーダル、透過モーダル
6. **ジェスチャーサポート**: スワイプナビゲーション

これらの機能を活用して、直感的で美しいナビゲーションエクスペリエンスを提供できます。
