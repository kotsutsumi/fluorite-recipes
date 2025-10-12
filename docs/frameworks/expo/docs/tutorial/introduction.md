# チュートリアル：React NativeとExpoの使用

Android、iOS、WebでExpoを使用して実行されるユニバーサルアプリを構築する方法に関するReact Nativeチュートリアルの紹介。

## React NativeとExpoチュートリアルについて

このチュートリアルの目的は、Expoを使い始め、Expo SDKに慣れることです。以下のトピックをカバーします：

- TypeScriptを有効にしたデフォルトテンプレートを使用してアプリを作成
- Expo Routerを使用した2画面のボトムタブレイアウトを実装
- アプリレイアウトを分解してflexboxで実装
- 各プラットフォームのシステムUIを使用してメディアライブラリから画像を選択
- React Nativeの`<Modal>`と`<FlatList>`コンポーネントを使用してステッカーモーダルを作成
- タッチジェスチャーを追加してステッカーと相互作用
- サードパーティライブラリを使用してスクリーンショットをキャプチャしてディスクに保存
- Android、iOS、Web間のプラットフォームの違いを処理
- ステータスバー、スプラッシュスクリーン、アプリアイコンを設定

チュートリアルは自己ペースで、完了までに最大2時間かかります。初心者向けに9つの章に分かれています。

## このチュートリアルの使用方法

チュートリアルは「実践による学習」を重視しています。重要なコード変更は緑色で強調表示され、ホバーまたはタップして変更の詳細を確認できます。

コード例：

```javascript
import { StyleSheet, Text, View } from 'react-native';

export default function Index() {
  return (
    <View style={styles.container}>
      <Text>Hello world!</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
```

チュートリアルの完全なソースコードは[GitHub](https://github.com/expo/examples/tree/master/stickersmash)で入手できます。

## 次のステップ

[新しいExpoアプリを作成することから始めましょう](/tutorial/create-your-first-app)
