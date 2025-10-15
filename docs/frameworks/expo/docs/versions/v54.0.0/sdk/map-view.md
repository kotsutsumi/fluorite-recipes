# react-native-maps

`react-native-maps` は、AndroidではGoogle Maps、iOSではApple MapsまたはGoogle Mapsを使用したMapコンポーネントを提供するライブラリです。

## 主な機能

- 追加のセットアップなしでExpo Goで動作
- AndroidとiOSの両方をサポート
- 本番アプリのデプロイには設定が必要

## インストール

```bash
npx expo install react-native-maps
```

## バンドルされているバージョン

現在のバンドルバージョン: 1.20.1

## 基本的な使用例

```javascript
import React from 'react';
import MapView from 'react-native-maps';
import { StyleSheet, View } from 'react-native';

export default function App() {
  return (
    <View style={styles.container}>
      <MapView style={styles.map} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  map: {
    width: '100%',
    height: '100%',
  },
});
```

## デプロイメント要件

### Android向け設定

1. Google Cloud APIプロジェクトを登録
2. Maps SDKを有効化
3. SHA-1証明書フィンガープリントを使用してAPIキーを作成
4. アプリ設定にAPIキーを追加

### iOS向け設定

1. Androidと同様のプロセス
2. プロジェクトを登録
3. Maps SDKを有効化
4. iOS専用のAPIキーを作成

## 追加の注意事項

- Google Mapsプロバイダーを明示的に使用する場合は、`provider={PROVIDER_GOOGLE}` を使用します
- 設定後はアプリのバイナリを再ビルドする必要があります

## リソース

- [公式ドキュメント](https://github.com/react-native-maps/react-native-maps) - 詳細な使用方法とAPIリファレンス
- [GitHub Repository](https://github.com/react-native-maps/react-native-maps) - ソースコードとissue
- [npm Package](https://www.npmjs.com/package/react-native-maps) - パッケージ情報
