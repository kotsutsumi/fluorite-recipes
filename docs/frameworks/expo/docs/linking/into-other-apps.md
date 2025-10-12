# 他のアプリへのリンク

アプリからURLを開く主な方法は2つあります：

1. `expo-linking` APIの使用
2. Expo Routerの`Link`コンポーネントの使用

## 一般的なURLスキーム

| スキーム | 説明 | 例 |
|---------|------|-----|
| `https` / `http` | Webブラウザアプリを開く | `https://expo.dev` |
| `mailto` | メールアプリを開く | `mailto:support@expo.dev` |
| `tel` | 電話アプリを開く | `tel:+123456789` |
| `sms` | SMSアプリを開く | `sms:+123456789` |

## expo-linking APIを使用した例

```typescript
import { Button, View, StyleSheet } from 'react-native';
import * as Linking from 'expo-linking';

export default function Home() {
  return (
    <View style={styles.container}>
      <Button
        title="URLを開く"
        onPress={() => Linking.openURL('https://expo.dev/')}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
```

## カスタムURLスキーム

一部のサービスは、ディープリンク用のカスタムURLスキームを提供しています。例えば、Uberは乗車地点と降車地点を指定するためのカスタムスキームを提供しています。

## アプリ内ブラウザ

`expo-web-browser`を使用して、アプリ内ブラウザでURLを開くことができます。これは認証などのシナリオに便利です。

```typescript
import * as WebBrowser from 'expo-web-browser';

// アプリ内ブラウザでURLを開く
export default function App() {
  const handlePress = async () => {
    await WebBrowser.openBrowserAsync('https://expo.dev');
  };

  return (
    <Button title="Webページを開く" onPress={handlePress} />
  );
}
```

### アプリ内ブラウザの利点

- **認証フロー**: OAuth認証などで便利
- **ユーザーエクスペリエンス**: アプリを離れずにWebコンテンツを閲覧
- **制御**: ブラウザの動作をより細かく制御可能

## まとめ

Expoは、他のアプリやWebサイトへのリンクを処理するための包括的なユーティリティを提供します。`expo-linking`と`expo-web-browser`を適切に使用することで、シームレスなユーザーエクスペリエンスを実現できます。
