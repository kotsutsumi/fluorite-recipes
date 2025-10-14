# Device

物理デバイスに関するシステム情報へのアクセスを提供するユニバーサルライブラリです。

## インストール

```bash
npx expo install expo-device
```

**バンドルバージョン:** ~8.0.9

## 使用方法

```javascript
import * as Device from 'expo-device';
import { Text, View } from 'react-native';

export default function App() {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>
        {Device.manufacturer}: {Device.modelName}
      </Text>
      <Text>OS: {Device.osName} {Device.osVersion}</Text>
      <Text>デバイスタイプ: {Device.deviceType}</Text>
    </View>
  );
}
```

## API

```javascript
import * as Device from 'expo-device';
```

## 定数

### `Device.brand`

**型:** `string | null`

デバイスのブランド名です（例: "google"、"Apple"）。

---

### `Device.deviceName`

**型:** `string | null`

人間が読みやすい形式のデバイス名です。

---

### `Device.deviceType`

**型:** `DeviceType | null`

デバイスのタイプです（PHONE、TABLET、TVなど）。

---

### `Device.deviceYearClass`

**型:** `number | null`

デバイスの年式クラスです。

---

### `Device.isDevice`

**型:** `boolean`

アプリが実際のデバイスで実行されているかどうかを示します。シミュレーターやエミュレーターの場合は`false`です。

---

### `Device.manufacturer`

**型:** `string | null`

デバイスの製造元です。

---

### `Device.modelId`

**型:** `string | null`

デバイスのモデル識別子です（例: "iPhone13,4"）。

---

### `Device.modelName`

**型:** `string | null`

人間が読みやすい形式のデバイスモデル名です（例: "iPhone 12 Pro"）。

---

### `Device.osBuildFingerprint`

**型:** `string | null`

**Android専用**

OSビルドのフィンガープリントです。

---

### `Device.osBuildId`

**型:** `string | null`

OSビルドのIDです。

---

### `Device.osInternalBuildId`

**型:** `string | null`

OS内部ビルドのIDです。

---

### `Device.osName`

**型:** `string | null`

オペレーティングシステムの名前です（例: "iOS"、"Android"）。

---

### `Device.osVersion`

**型:** `string | null`

オペレーティングシステムのバージョン文字列です。

---

### `Device.platformApiLevel`

**型:** `number | null`

**Android専用**

プラットフォームAPIレベルです。

---

### `Device.productName`

**型:** `string | null`

デバイスの製品名です。

---

### `Device.supportedCpuArchitectures`

**型:** `string[] | null`

サポートされているCPUアーキテクチャの配列です。

---

### `Device.totalMemory`

**型:** `number | null`

デバイスの総メモリ容量（バイト単位）です。

## メソッド

### `Device.getDeviceTypeAsync()`

デバイスのタイプを判定します。

**戻り値**

`Promise<DeviceType>` - デバイスタイプを返します。

---

### `Device.getMaxMemoryAsync()`

利用可能な最大メモリ容量を取得します。

**戻り値**

`Promise<number>` - 最大メモリ容量（バイト単位）を返します。

---

### `Device.getPlatformFeaturesAsync()`

プラットフォーム固有の機能を取得します。

**戻り値**

`Promise<string[]>` - サポートされている機能の配列を返します。

---

### `Device.getUptimeAsync()`

デバイスが最後に再起動されてからの稼働時間を取得します。

**戻り値**

`Promise<number>` - 稼働時間（ミリ秒単位）を返します。

---

### `Device.hasPlatformFeatureAsync(feature)`

特定のプラットフォーム機能がサポートされているかどうかを確認します。

**パラメータ**

- **feature** (`string`) - 確認する機能の名前

**戻り値**

`Promise<boolean>` - 機能がサポートされている場合は`true`を返します。

---

### `Device.isRootedExperimentalAsync()`

デバイスがルート化またはジェイルブレイクされているかどうかを確認します。

> **注意:** この機能は実験的であり、100%の精度を保証するものではありません。

**戻り値**

`Promise<boolean>` - ルート化されている場合は`true`を返します。

---

### `Device.isSideLoadingEnabledAsync()`

**Android専用**

サイドローディングが有効になっているかどうかを確認します。

**戻り値**

`Promise<boolean>` - サイドローディングが有効な場合は`true`を返します。

## 型

### `DeviceType`

デバイスタイプを表す列挙型です。

```typescript
enum DeviceType {
  UNKNOWN = 0,
  PHONE = 1,
  TABLET = 2,
  DESKTOP = 3,
  TV = 4
}
```

- **UNKNOWN** - 不明なデバイスタイプ
- **PHONE** - スマートフォン
- **TABLET** - タブレット
- **DESKTOP** - デスクトップコンピューター
- **TV** - テレビまたはセットトップボックス

## 使用例

### デバイス情報の表示

```javascript
import * as Device from 'expo-device';
import { useEffect, useState } from 'react';
import { Text, View } from 'react-native';

export default function App() {
  const [deviceType, setDeviceType] = useState(null);
  const [uptime, setUptime] = useState(null);

  useEffect(() => {
    (async () => {
      const type = await Device.getDeviceTypeAsync();
      const uptimeMs = await Device.getUptimeAsync();

      setDeviceType(type);
      setUptime(Math.floor(uptimeMs / 1000 / 60)); // 分単位に変換
    })();
  }, []);

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>ブランド: {Device.brand}</Text>
      <Text>製造元: {Device.manufacturer}</Text>
      <Text>モデル: {Device.modelName}</Text>
      <Text>OS: {Device.osName} {Device.osVersion}</Text>
      <Text>デバイスタイプ: {deviceType}</Text>
      <Text>実際のデバイス: {Device.isDevice ? 'はい' : 'いいえ'}</Text>
      <Text>稼働時間: {uptime}分</Text>
    </View>
  );
}
```

### プラットフォーム機能の確認

```javascript
import * as Device from 'expo-device';

const hasFeature = await Device.hasPlatformFeatureAsync('android.hardware.camera');
console.log('カメラサポート:', hasFeature);
```

### ルート化の検出

```javascript
import * as Device from 'expo-device';

const isRooted = await Device.isRootedExperimentalAsync();
if (isRooted) {
  console.log('⚠️ デバイスがルート化されています');
}
```

## プラットフォームサポート

- Android
- iOS
- tvOS
- Web

## プラットフォーム固有の注意事項

### iOS

- `osBuildFingerprint`は利用できません
- `platformApiLevel`は利用できません
- `isSideLoadingEnabledAsync`は利用できません

### Android

- すべての機能が利用可能です
- `platformApiLevel`はAndroid APIレベルを返します

### Web

- 機能が制限されています
- 一部のプロパティは`null`を返す場合があります
