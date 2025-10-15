# NetInfo

`@react-native-community/netinfo`は、クロスプラットフォームのネットワーク情報APIです。

## プラットフォームの互換性

| Android | iOS | tvOS | Web |
|---------|-----|------|-----|
| ✅ | ✅ | ✅ | ✅ |

## バージョン情報

バンドルされているバージョン: **11.4.1**

## インストール

```bash
npx expo install @react-native-community/netinfo
```

## 基本的な使用方法

### ネットワーク状態を一度取得

```javascript
import NetInfo from '@react-native-community/netinfo';

// ネットワーク状態を一度取得
NetInfo.fetch().then(state => {
  console.log('Connection type', state.type);
  console.log('Is connected?', state.isConnected);
});
```

### ネットワーク状態の変更を監視

```javascript
import NetInfo from '@react-native-community/netinfo';

// ネットワーク状態の変更を購読
const unsubscribe = NetInfo.addEventListener(state => {
  console.log('Connection type', state.type);
  console.log('Is connected?', state.isConnected);
});

// 不要になったら購読解除
unsubscribe();
```

## SSIDへのアクセス

Wi-FiのSSID情報にアクセスするには、追加の設定が必要です:

### 要件
- 位置情報のパーミッションが必要

### iOS固有の設定
- Wi-Fi info entitlementを追加する必要があります
- App IdentifierでAccess Wi-Fi Informationを確認してください
- アプリを再ビルドする必要があります

## 主な機能

- ネットワーク接続タイプの検出（WiFi、セルラー、なしなど）
- 接続状態の監視
- リアルタイムのネットワーク状態の変更通知
- クロスプラットフォーム対応

## 重要な注意事項

- 既存のReact Nativeアプリの場合は、`expo`がインストールされていることを確認してください
- プラットフォーム固有の追加の設定については、ライブラリのREADMEを参照してください

## さらに詳しく

このドキュメントは、React Nativeアプリケーションにネットワーク情報追跡を統合するための包括的なガイダンスを提供します。

## リソース

- [GitHub リポジトリ](https://github.com/react-native-netinfo/react-native-netinfo)
- [npm パッケージ](https://www.npmjs.com/package/@react-native-community/netinfo)
