# ナビゲーションを追加

この章では、Expo Routerを使用してExpoアプリにナビゲーションを追加する方法を学びます。

## Expo Routerの基本

Expo Routerは、React NativeとWebアプリ用のファイルベースのルーティングフレームワークで、主要な規則があります：

- `app`ディレクトリ：ルートとレイアウトを含みます
- ルートレイアウト：`app/_layout.tsx`は共有UI要素を定義します
- ファイル名の規則：
  - インデックスファイルは親ディレクトリのルートと一致
  - ルートファイルはReactコンポーネントをエクスポート
- Android、iOS、Web全体で統一されたナビゲーション

## スタックに新しい画面を追加

`app/about.tsx`を作成：

```typescript
import { Text, View, StyleSheet } from 'react-native';

export default function AboutScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>About画面</Text>
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
});
```

`app/_layout.tsx`を更新：

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

## 画面間のナビゲート

`app/index.tsx`を`Link`コンポーネントで更新：

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
