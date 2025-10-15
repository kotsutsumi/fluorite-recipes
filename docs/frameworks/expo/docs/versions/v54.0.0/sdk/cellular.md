# Cellular

ユーザーの携帯電話サービスプロバイダーに関する情報を提供するAPIです。Android、iOS、Webで利用可能です。

## インストール

```bash
npx expo install expo-cellular
```

## 設定

Androidの場合、`AndroidManifest.xml`に以下のパーミッションを追加してください：

```xml
<uses-permission android:name="android.permission.READ_PHONE_STATE" />
```

## API

```javascript
import * as Cellular from 'expo-cellular';
```

## メソッド

### `Cellular.allowsVoipAsync()`

キャリアがVoIP通話を許可しているかどうかを確認します。

**戻り値**

`Promise<boolean | null>` - キャリアがVoIP通話を許可している場合は`true`、許可していない場合は`false`を返します。情報が利用できない場合は`null`を返します。

---

### `Cellular.getCarrierNameAsync()`

携帯電話サービスプロバイダーの名前を返します。

**戻り値**

`Promise<string | null>` - キャリア名を表す文字列、または情報が利用できない場合は`null`を返します。

---

### `Cellular.getCellularGenerationAsync()`

携帯電話ネットワークの世代を返します。

**戻り値**

`Promise<CellularGeneration | null>` - 携帯電話ネットワークの世代を返します。情報が利用できない場合は`null`を返します。

---

### `Cellular.getIsoCountryCodeAsync()`

キャリアのISO国コードを返します。

**戻り値**

`Promise<string | null>` - 2文字のISO国コードを表す文字列、または情報が利用できない場合は`null`を返します。

---

### `Cellular.getMobileCountryCodeAsync()`

モバイル国コード(MCC)を返します。

**戻り値**

`Promise<string | null>` - モバイル国コードを表す文字列、または情報が利用できない場合は`null`を返します。

---

### `Cellular.getMobileNetworkCodeAsync()`

モバイルネットワークコード(MNC)を返します。

**戻り値**

`Promise<string | null>` - モバイルネットワークコードを表す文字列、または情報が利用できない場合は`null`を返します。

## 型

### `CellularGeneration`

携帯電話ネットワークの世代を表す列挙型です。

```typescript
enum CellularGeneration {
  UNKNOWN = 0,
  CELLULAR_2G = 1,
  CELLULAR_3G = 2,
  CELLULAR_4G = 3,
  CELLULAR_5G = 4
}
```

- **UNKNOWN** - ネットワーク世代が不明
- **CELLULAR_2G** - 2Gネットワーク
- **CELLULAR_3G** - 3Gネットワーク
- **CELLULAR_4G** - 4G/LTEネットワーク
- **CELLULAR_5G** - 5Gネットワーク

## パーミッション

### Android

- `READ_PHONE_STATE` - 電話の状態情報へのアクセスに必要

### iOS

特別なパーミッションは必要ありません。

## 使用例

```javascript
import * as Cellular from 'expo-cellular';
import { useEffect, useState } from 'react';
import { Text, View } from 'react-native';

export default function App() {
  const [carrierName, setCarrierName] = useState(null);
  const [generation, setGeneration] = useState(null);

  useEffect(() => {
    (async () => {
      const name = await Cellular.getCarrierNameAsync();
      const gen = await Cellular.getCellularGenerationAsync();

      setCarrierName(name);
      setGeneration(gen);
    })();
  }, []);

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>キャリア: {carrierName}</Text>
      <Text>ネットワーク世代: {generation}</Text>
    </View>
  );
}
```

## プラットフォームサポート

- Android
- iOS
- Web（機能制限あり）
