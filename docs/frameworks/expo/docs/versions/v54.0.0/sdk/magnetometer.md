# Magnetometer

デバイスの磁力計センサーにアクセスして磁場の変化を測定するライブラリです。

## 概要

`expo-sensors` の `Magnetometer` モジュールは、デバイスの磁力計センサーにアクセスして、マイクロテスラ（μT）単位で磁場の変化を測定する機能を提供します。校正済み（`Magnetometer`）と未校正（`MagnetometerUncalibrated`）の両方の磁場測定をサポートしています。

## 主な機能

- 校正済みと未校正の磁場測定をサポート
- AndroidとiOSで動作
- x、y、z軸の磁場強度測定を提供

## インストール

```bash
npx expo install expo-sensors
```

## 使用方法

### 基本的な磁力計の使用

```javascript
import { useState, useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Magnetometer } from 'expo-sensors';

export default function Compass() {
  const [{ x, y, z }, setData] = useState({
    x: 0,
    y: 0,
    z: 0,
  });
  const [subscription, setSubscription] = useState(null);

  const subscribe = () => {
    setSubscription(
      Magnetometer.addListener(result => {
        setData(result);
      })
    );
  };

  const unsubscribe = () => {
    subscription && subscription.remove();
    setSubscription(null);
  };

  useEffect(() => {
    subscribe();
    return () => unsubscribe();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.text}>磁力計:</Text>
      <Text style={styles.text}>x: {x.toFixed(2)}</Text>
      <Text style={styles.text}>y: {y.toFixed(2)}</Text>
      <Text style={styles.text}>z: {z.toFixed(2)}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  text: {
    fontSize: 18,
    textAlign: 'center',
  },
});
```

### 更新間隔の設定

```javascript
import { Magnetometer } from 'expo-sensors';

// 更新間隔を100msに設定
Magnetometer.setUpdateInterval(100);
```

### センサーの可用性確認

```javascript
import { Magnetometer } from 'expo-sensors';

async function checkAvailability() {
  const isAvailable = await Magnetometer.isAvailableAsync();
  if (isAvailable) {
    console.log('磁力計は利用可能です');
  } else {
    console.log('磁力計は利用できません');
  }
}
```

## API

### Magnetometer (校正済み)

#### `addListener(listener)`

磁力計の更新を監視します。

**パラメータ:**
- `listener: (data: MagnetometerMeasurement) => void` - 磁力計データを受け取るコールバック関数

**戻り値:**
- `Subscription` - サブスクリプションオブジェクト

#### `setUpdateInterval(intervalMs)`

センサーの更新頻度を設定します。

**パラメータ:**
- `intervalMs: number` - 更新間隔（ミリ秒）

#### `isAvailableAsync()`

磁力計センサーの利用可能性を確認します。

**戻り値:**
- `Promise<boolean>` - センサーが利用可能な場合は `true`

#### `removeAllListeners()`

すべてのリスナーを削除します。

#### `requestPermissionsAsync()`

センサーアクセスの許可をリクエストします。

**戻り値:**
- `Promise<PermissionResponse>` - 許可の状態

### MagnetometerUncalibrated (未校正)

校正されていない生の磁力計データにアクセスする場合は、`MagnetometerUncalibrated` を使用します。

```javascript
import { MagnetometerUncalibrated } from 'expo-sensors';

const subscription = MagnetometerUncalibrated.addListener(result => {
  console.log(result.x, result.y, result.z);
});
```

## 型定義

### MagnetometerMeasurement

```typescript
{
  x: number;        // x軸の磁場強度（μT）
  y: number;        // y軸の磁場強度（μT）
  z: number;        // z軸の磁場強度（μT）
  timestamp: number; // 測定のタイムスタンプ
}
```

### Subscription

```typescript
{
  remove: () => void; // リスナーを削除
}
```

## 測定の詳細

- **単位**: マイクロテスラ（μT）
- **軸**: x、y、z軸の値とタイムスタンプを提供
- **更新間隔**: `setUpdateInterval()` で設定可能
- **Android 12以降の制限**: 200msの更新間隔制限があります

## 重要な注意事項

1. **センサーの可用性**: 使用前に必ずセンサーの可用性を確認してください
2. **許可**: Android 12以降で高いサンプリングレートを使用する場合、追加の許可が必要な場合があります
3. **更新間隔**: Android 12以降では、高頻度の更新には制限があります
4. **バッテリー消費**: 高頻度の更新はバッテリー消費が増加する可能性があります

## プラットフォーム固有の動作

### Android

- Android 12以降では、200msの更新間隔制限があります
- 高頻度のセンサー更新には `HIGH_SAMPLING_RATE_SENSORS` 許可が必要な場合があります

### iOS

- 磁力計は大部分のiOSデバイスで利用可能です
- デバイスの向きや環境によって測定値が影響を受ける可能性があります

## 実用例

### コンパスの実装

```javascript
import { useState, useEffect } from 'react';
import { Magnetometer } from 'expo-sensors';

function useCompass() {
  const [heading, setHeading] = useState(0);

  useEffect(() => {
    const subscription = Magnetometer.addListener(({ x, y }) => {
      // x軸とy軸から方位角を計算
      let angle = Math.atan2(y, x) * (180 / Math.PI);
      if (angle < 0) {
        angle += 360;
      }
      setHeading(Math.round(angle));
    });

    return () => subscription.remove();
  }, []);

  return heading;
}

function CompassComponent() {
  const heading = useCompass();

  return (
    <View>
      <Text>方位: {heading}°</Text>
    </View>
  );
}
```

## サポートプラットフォーム

- Android
- iOS
