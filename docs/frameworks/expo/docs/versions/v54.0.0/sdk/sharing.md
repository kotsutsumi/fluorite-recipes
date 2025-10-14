# Sharing

異なるアプリケーション間でファイルを共有するためのライブラリです。

## インストール

ターミナルで以下のコマンドを実行してライブラリをインストールします。

```bash
npx expo install expo-sharing
```

## 概要

`expo-sharing`は、Android、iOS、Webプラットフォームでファイルを他のアプリケーションと共有する機能を提供します。

## プラットフォームサポート

- Android
- iOS
- Web

## Web上の制限事項

- ブラウザサポートが限定的です
- HTTPSが必要です
- Web上ではローカルファイルを共有できません

## API リファレンス

### isAvailableAsync()

共有APIが使用可能かどうかを確認します。

```javascript
const isAvailable = await Sharing.isAvailableAsync();
```

**戻り値**: 共有機能が利用可能な場合は`true`を返すPromise。

### shareAsync(url, options)

ファイルの共有ダイアログを開きます。

```javascript
await Sharing.shareAsync(localFileUri, options);
```

**パラメータ**:
- `url` (string): ローカルファイルのURL
- `options` (オプション): 共有の設定

**戻り値**: 完了時にresolveされるPromise。

## 共有オプション

プラットフォーム固有の設定:

- `anchor` (iOS): iPadでのポップオーバー表示位置
- `dialogTitle` (Android/Web): 共有ダイアログのタイトル
- `mimeType` (Android): ファイルのMIMEタイプ
- `UTI` (iOS): Uniform Type Identifier

## 使用例

```javascript
import * as Sharing from 'expo-sharing';

const shareFile = async (fileUri) => {
  const isAvailable = await Sharing.isAvailableAsync();

  if (isAvailable) {
    await Sharing.shareAsync(fileUri, {
      dialogTitle: 'ファイルを共有'
    });
  }
};
```

## 重要な注意事項

- 現在、アプリ**から**の共有のみをサポートしています
- Web共有には互換性の慎重な確認が必要です
- ローカルファイルのURIを使用する必要があります
