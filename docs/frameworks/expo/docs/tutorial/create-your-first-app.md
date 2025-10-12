# 最初のアプリを作成

## 前提条件

開始するには、以下が必要です：
- 物理デバイスにインストールされたExpo Go
- Node.js（LTSバージョン）
- VS Codeまたは別のコードエディタ
- macOS、Linux、またはWindowsのターミナル

このチュートリアルでは、TypeScriptとReactに精通していることを前提としています。

## 新しいExpoアプリを初期化

`create-expo-app`を使用して新しいプロジェクトを作成します：

```terminal
# StickerSmashという名前のプロジェクトを作成
npx create-expo-app@latest StickerSmash

# プロジェクトディレクトリに移動
cd StickerSmash
```

### デフォルトテンプレートの利点
- Expoパッケージを使用したReact Nativeプロジェクトを作成
- 推奨ツールが含まれています
- 複数のプラットフォーム向けに設定されています
- デフォルトでTypeScriptが設定されています

## アセットをダウンロード

[アセットアーカイブをダウンロード](/static/images/tutorial/sticker-smash-assets.zip)して：
1. アーカイブを解凍
2. プロジェクトのimagesディレクトリのデフォルトアセットを置き換え
3. コードエディタでプロジェクトを開く

## reset-projectスクリプトを実行

```terminal
npm run reset-project
```

このスクリプトはボイラープレートコードを削除し、appディレクトリに2つのファイルのみを残します。

## アプリを実行

```terminal
npx expo start
```

- モバイルでExpo Goを使用してQRコードをスキャン
- ターミナルで'w'を押してWebで実行

## Indexスクリーンを編集

`app/index.tsx`を変更：

```typescript
import { Text, View, StyleSheet } from 'react-native';

export default function Index() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>ホーム画面</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#25292e',
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    color: '#fff',
  },
});
```

## まとめ

新しいExpoプロジェクトを作成し、React Nativeコンポーネントを使用して、StickerSmashアプリを開発する準備が整いました。
