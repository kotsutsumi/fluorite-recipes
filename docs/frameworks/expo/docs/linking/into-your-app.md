# アプリへのリンク

## ディープリンクの主要な手順

### 1. アプリ設定にカスタムスキームを追加

`app.json`または`app.config.js`にカスタムスキームを追加します：

```json
{
  "expo": {
    "scheme": "myapp"
  }
}
```

### 2. ディープリンクのテスト

`npx uri-scheme`を使用してディープリンクをテストします：

```bash
# iOSでテスト
npx uri-scheme open myapp://somepath/details --ios

# Androidでテスト
npx uri-scheme open myapp://somepath/details --android
```

## URLの処理

`Linking.useURL()`フックを使用して、着信リンクをキャプチャします：

```typescript
import * as Linking from 'expo-linking';
import { Text, View } from 'react-native';

export default function Home() {
  const url = Linking.useURL();

  if (url) {
    const { hostname, path, queryParams } = Linking.parse(url);
    console.log(`アプリにリンクされました: hostname=${hostname}, path=${path}`);

    // URLに基づいて適切な画面に遷移
  }

  return (
    <View>
      <Text>現在のURL: {url || 'なし'}</Text>
    </View>
  );
}
```

## URLの解析

`Linking.parse()`を使用してURLを解析できます：

```typescript
const { hostname, path, queryParams } = Linking.parse('myapp://home/details?id=123');

console.log(hostname); // 'home'
console.log(path); // 'details'
console.log(queryParams); // { id: '123' }
```

## 重要な注意事項

### Android App Links / iOS Universal Linksの推奨

ほとんどのアプリでは、[Android App/iOS Universal Links](/linking/overview#universal-linking)の使用を検討してください。

### 制限事項

- **ディープリンクはアプリがインストールされている場合のみ機能**
- アプリがインストールされていない場合、ディープリンクは機能しません

### Expo Goの制約

Expo Goはデフォルトで`exp://`スキームを使用します。本番アプリでは開発ビルドを使用してください。

## 代替リンク戦略

アプリがインストールされていない場合の代替策として、以下のようなアトリビューションサービスの使用を検討してください：

- **Branch**: ディープリンクとアトリビューション
- **Adjust**: アプリアトリビューション
- **AppsFlyer**: モバイルアトリビューション

## まとめ

ディープリンクは、ユーザーをアプリ内の特定のコンテンツに直接誘導する強力な機能です。カスタムスキームを適切に設定し、URLを処理することで、シームレスなユーザーエクスペリエンスを実現できます。
