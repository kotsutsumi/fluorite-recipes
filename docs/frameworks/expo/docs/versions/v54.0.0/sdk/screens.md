# react-native-screens

`react-native-screens` は、より優れたオペレーティングシステムの動作と画面最適化のためのネイティブ画面プリミティブを提供するライブラリです。主にライブラリ作成者向けで、Android、iOS、tvOS、Webプラットフォームをサポートしています。

## 概要

このライブラリは、通常の `<View>` コンポーネントをネイティブの画面表現に置き換え、画面のレンダリングと動作を最適化します。

## 主な機能

- 通常の `<View>` コンポーネントをネイティブの画面表現に置き換え
- React Navigationの `createNativeStackNavigator` 用のネイティブコンポーネントを提供

## インストール

```bash
npx expo install react-native-screens
```

### 注意事項

既存のReact Nativeアプリの場合、追加のインストール手順が必要になる場合があります。

## 重要な詳細

- **バンドルされているバージョン**: ~4.16.0
- **主な対象**: ライブラリ作成者向け
- **目的**: 画面レンダリングと動作の最適化を支援

## React Navigationとの統合

このライブラリは、React Navigationの `createNativeStackNavigator` と組み合わせて使用されることが多く、ネイティブナビゲーションエクスペリエンスを提供します。

```javascript
import { createNativeStackNavigator } from '@react-navigation/native-stack';

const Stack = createNativeStackNavigator();

function App() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="Details" component={DetailsScreen} />
    </Stack.Navigator>
  );
}
```

## ドキュメントとリソース

- [公式ドキュメント](https://docs.swmansion.com/react-native-screens/) - 詳細な使用方法とAPIリファレンス
- [GitHub Repository](https://github.com/software-mansion/react-native-screens) - ソースコードとissue
- [npm Package](https://www.npmjs.com/package/react-native-screens) - パッケージ情報

## 概要

このライブラリは、ネイティブプラットフォームの機能を活用することで、React Nativeアプリケーションでの画面処理を改善するように設計されています。
