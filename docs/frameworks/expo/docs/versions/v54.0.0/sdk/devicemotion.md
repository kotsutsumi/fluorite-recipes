# DeviceMotion

デバイスのモーションセンサーと方向センサーにアクセスするためのライブラリです。Android、iOS、Webプラットフォーム全体でデバイスのモーションデータにアクセスできます。

## 概要

DeviceMotionは、3つの軸を通じてモーションデータにアクセスできます：
- **X軸**: 左から右へ
- **Y軸**: 下から上へ
- **Z軸**: 画面を通して奥から手前へ

## インストール

```bash
npx expo install expo-sensors
```

## 使用方法

```javascript
import { DeviceMotion } from 'expo-sensors';
import { useEffect, useState } from 'react';

export default function App() {
  const [data, setData] = useState({});

  useEffect(() => {
    const subscription = DeviceMotion.addListener(devicemotionData => {
      setData(devicemotionData);
    });

    return () => subscription.remove();
  }, []);

  const { acceleration, rotation } = data;

  return (
    <View>
      <Text>X: {acceleration?.x}</Text>
      <Text>Y: {acceleration?.y}</Text>
      <Text>Z: {acceleration?.z}</Text>
    </View>
  );
}
```

## API

### メソッド

#### `addListener(listener: (data: DeviceMotionMeasurement) => void): Subscription`

モーションセンサーの更新を購読します。

**パラメータ:**
- `listener`: モーションデータを受け取るコールバック関数

**戻り値:**
- `remove()`メソッドを持つSubscriptionオブジェクト

#### `isAvailableAsync(): Promise<boolean>`

デバイスでセンサーが利用可能かどうかを確認します。

**戻り値:**
- センサーが利用可能な場合は`true`を返すPromise

#### `getPermissionsAsync(): Promise<PermissionResponse>`

センサーへのアクセス権限の現在の状態を確認します。

**戻り値:**
- 権限情報を含むPermissionResponseオブジェクトを返すPromise

#### `requestPermissionsAsync(): Promise<PermissionResponse>`

ユーザーにセンサーへのアクセス権限を要求します。

**戻り値:**
- 権限情報を含むPermissionResponseオブジェクトを返すPromise

#### `setUpdateInterval(intervalMs: number): void`

センサーの更新頻度を設定します。

**パラメータ:**
- `intervalMs`: 更新間隔（ミリ秒）

**注意:** Androidでは200ms未満の間隔は無視されます。

### 型定義

#### `DeviceMotionMeasurement`

```typescript
{
  acceleration: {
    x: number;
    y: number;
    z: number;
  } | null;
  accelerationIncludingGravity: {
    x: number;
    y: number;
    z: number;
  } | null;
  rotation: {
    alpha: number;
    beta: number;
    gamma: number;
  } | null;
  rotationRate: {
    alpha: number;
    beta: number;
    gamma: number;
  } | null;
  orientation: number;
}
```

**プロパティ:**

- `acceleration`: 重力を除いたデバイスの加速度（m/s²）
  - `x`: X軸方向の加速度
  - `y`: Y軸方向の加速度
  - `z`: Z軸方向の加速度

- `accelerationIncludingGravity`: 重力を含むデバイスの加速度（m/s²）

- `rotation`: 3D空間でのデバイスの向き（ラジアン）
  - `alpha`: Z軸周りの回転（0〜2π）
  - `beta`: X軸周りの回転（-π〜π）
  - `gamma`: Y軸周りの回転（-π/2〜π/2）

- `rotationRate`: デバイスの回転速度（度/秒）
  - `alpha`: Z軸周りの回転速度
  - `beta`: X軸周りの回転速度
  - `gamma`: Y軸周りの回転速度

- `orientation`: 画面の回転状態
  - `0`: ポートレート
  - `90`: 左に90度回転
  - `-90`: 右に90度回転
  - `180`: 上下逆

## プラットフォーム固有の設定

### iOS

iOSでは、`Info.plist`に`NSMotionUsageDescription`を追加する必要があります：

```json
{
  "expo": {
    "plugins": [
      [
        "expo-sensors",
        {
          "motionPermission": "デバイスのモーションデータへのアクセスを許可してください"
        }
      ]
    ]
  }
}
```

### Android

Androidでは、センサーの更新間隔に200msの制限があります。

### Web

Webプラットフォームでは：
- HTTPSが必要です
- ユーザーインタラクションが権限取得に必要です
- ブラウザとデバイスのサポート状況に依存します

## プラットフォーム互換性

| プラットフォーム | サポート |
|----------------|---------|
| Android        | ✅      |
| iOS            | ✅      |
| Web            | ✅      |

## 使用例

### 更新間隔の設定

```javascript
import { DeviceMotion } from 'expo-sensors';

// 100msごとに更新（Androidでは200ms）
DeviceMotion.setUpdateInterval(100);
```

### 権限の確認と要求

```javascript
import { DeviceMotion } from 'expo-sensors';

async function checkPermissions() {
  const { status } = await DeviceMotion.getPermissionsAsync();

  if (status !== 'granted') {
    const { status: newStatus } = await DeviceMotion.requestPermissionsAsync();
    return newStatus === 'granted';
  }

  return true;
}
```

### センサーの可用性確認

```javascript
import { DeviceMotion } from 'expo-sensors';

async function checkAvailability() {
  const isAvailable = await DeviceMotion.isAvailableAsync();

  if (!isAvailable) {
    console.log('デバイスモーションセンサーは利用できません');
  }
}
```

## 注意事項

- iOSでは、低電力モードでTaptic Engineが無効になる場合があります
- Webでは、ブラウザとデバイスのサポート状況を確認してください
- Androidでは、センサーの更新頻度に制限があります
- センサーデータを使用する前に、必ず可用性と権限を確認してください
