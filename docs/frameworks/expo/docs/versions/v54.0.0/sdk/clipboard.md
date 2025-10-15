# Clipboard

クリップボードのコンテンツを取得および設定するためのユニバーサルライブラリです。

## インストール

```bash
npx expo install expo-clipboard
```

## 使用方法

```javascript
import * as Clipboard from 'expo-clipboard';
import { useState } from 'react';
import { Button, Text, View } from 'react-native';

export default function App() {
  const [copiedText, setCopiedText] = useState('');

  const copyToClipboard = async () => {
    await Clipboard.setStringAsync('hello world');
  };

  const fetchCopiedText = async () => {
    const text = await Clipboard.getStringAsync();
    setCopiedText(text);
  };

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Button title="クリップボードにコピー" onPress={copyToClipboard} />
      <Button title="クリップボードから取得" onPress={fetchCopiedText} />
      <Text>コピーされたテキスト: {copiedText}</Text>
    </View>
  );
}
```

## API

```javascript
import * as Clipboard from 'expo-clipboard';
```

## メソッド

### `Clipboard.getImageAsync(options)`

クリップボードから画像を取得します。

**パラメータ**

- **options** (`GetImageOptions`、オプション) - 画像取得のオプション

**戻り値**

`Promise<GetImageResult>` - 画像データとメタデータを含むPromiseを返します。

---

### `Clipboard.getStringAsync()`

クリップボードからテキストコンテンツを取得します。

**戻り値**

`Promise<string>` - クリップボードのテキストコンテンツを含むPromiseを返します。

---

### `Clipboard.hasImageAsync()`

クリップボードに画像が含まれているかどうかを確認します。

**戻り値**

`Promise<boolean>` - クリップボードに画像が含まれている場合は`true`を返します。

---

### `Clipboard.hasStringAsync()`

クリップボードにテキストが含まれているかどうかを確認します。

**戻り値**

`Promise<boolean>` - クリップボードにテキストが含まれている場合は`true`を返します。

---

### `Clipboard.setImageAsync(image)`

クリップボードに画像を設定します。

**パラメータ**

- **image** (`string`) - 画像のファイルURLまたはbase64エンコードされた画像文字列

**戻り値**

`Promise<boolean>` - 画像が正常に設定された場合は`true`を返します。

---

### `Clipboard.setStringAsync(text, options)`

クリップボードにテキストコンテンツを設定します。

**パラメータ**

- **text** (`string`) - クリップボードに設定するテキスト
- **options** (`SetStringOptions`、オプション) - テキスト設定のオプション

**戻り値**

`Promise<boolean>` - テキストが正常に設定された場合は`true`を返します。

---

### `Clipboard.addClipboardListener(listener)`

クリップボードの変更を監視するリスナーを追加します。

**パラメータ**

- **listener** (`(event: ClipboardEvent) => void`) - クリップボードが変更されたときに呼び出されるコールバック関数

**戻り値**

`Subscription` - リスナーを削除するための`remove()`メソッドを持つサブスクリプションオブジェクト

---

### `Clipboard.removeClipboardListener(subscription)`

クリップボードリスナーを削除します。

**パラメータ**

- **subscription** (`Subscription`) - `addClipboardListener`から返されたサブスクリプションオブジェクト

## 型

### `GetImageOptions`

画像取得オプションを表す型です。

```typescript
interface GetImageOptions {
  format?: 'png' | 'jpeg';
}
```

### `GetImageResult`

画像取得結果を表す型です。

```typescript
interface GetImageResult {
  data: string;
  size: {
    width: number;
    height: number;
  };
}
```

### `SetStringOptions`

テキスト設定オプションを表す型です。

```typescript
interface SetStringOptions {
  inputFormat?: 'plain' | 'html';
}
```

## Web互換性に関する注意

Webプラットフォームでは、AsyncClipboard APIを使用しており、ブラウザ間で動作が異なる場合があります。一部のブラウザでは、ユーザーのジェスチャー（クリックなど）が必要な場合があります。

## プラットフォームサポート

- Android
- iOS
- Web
