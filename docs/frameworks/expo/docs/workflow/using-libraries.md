# ライブラリの使用

## React Nativeコアライブラリ

React Nativeは、モバイルアプリ開発のための組み込みプリミティブを提供します：

- `<ActivityIndicator>` - ローディングインジケーター
- `<TextInput>` - テキスト入力フィールド
- `<Text>` - テキスト表示
- `<ScrollView>` - スクロール可能なビュー
- `<View>` - コンテナビュー

### 使用例

```javascript
import { Text, View } from 'react-native';

export default function App() {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Hello, world!</Text>
    </View>
  );
}
```

## Expo SDKライブラリ

Expo SDKは、React Nativeコアライブラリを拡張し、デバイスとシステム機能へのアクセスを提供します。

利用可能なライブラリは[APIリファレンス](/versions/latest)で確認できます。

## サードパーティライブラリ

### ライブラリの検索

適切なライブラリを見つけるには、以下のリソースを使用します：

1. **React Native Directory** - [reactnative.directory](https://reactnative.directory)
   - 最初に確認すべきリソース
   - Expoとの互換性情報を提供

2. **npmレジストリ** - もう1つのオプション

### 互換性の考慮事項

- **本番品質のアプリには開発ビルドを使用**
- **Expo Goはライブラリサポートが限定的**
- **ネイティブコード要件を確認**

### インストール

#### 推奨方法

```bash
npx expo install <library-name>
```

#### 例

```bash
npx expo install @react-navigation/native
```

### ヒント

#### ライブラリREADMEへの素早いアクセス

```bash
npx npm-home <package-name>
```

このコマンドで、ライブラリのREADMEにすぐアクセスできます。

#### 設定プラグイン

一部のライブラリは設定プラグインが必要な場合があります。

#### バージョンチェックの除外

`package.json`で`expo.install.exclude`を使用して、特定のライブラリをバージョンチェックから除外できます。

## まとめ

Expoでライブラリを使用する際は、以下を心がけてください：

1. **ライブラリの互換性を慎重に確認**
2. **Expoの推奨インストール方法を使用**（`npx expo install`）
3. **React Native Directoryで互換性情報を確認**
4. **本番アプリには開発ビルドを使用**

適切なライブラリ選択とインストール方法により、スムーズな開発体験が実現できます。
