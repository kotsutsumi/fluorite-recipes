# Sensors

加速度計、気圧計、デバイスモーション、ジャイロスコープ、光センサー、磁力計、歩数計などのデバイスセンサーへのアクセスを提供するライブラリです。

## 概要

Sensorsライブラリは、モバイルデバイスの様々なハードウェアセンサーへの統一されたアクセスを提供します。

## インストール

```bash
npx expo install expo-sensors
```

## プラットフォーム

- Android
- iOS
- Web（制限あり）

## 利用可能なセンサー

- **Accelerometer**: デバイスの加速度を測定
- **Barometer**: 大気圧を測定
- **DeviceMotion**: デバイスの動きと向きを追跡
- **Gyroscope**: デバイスの回転を測定
- **LightSensor**: 周囲の光レベルを測定
- **Magnetometer**: 磁場を測定
- **Pedometer**: 歩数をカウント

## インポート

```typescript
// すべてのセンサーをインポート
import * as Sensors from 'expo-sensors';

// または個別にインポート
import {
  Accelerometer,
  Barometer,
  DeviceMotion,
  Gyroscope,
  LightSensor,
  Magnetometer,
  Pedometer
} from 'expo-sensors';
```

## 権限

### Android
- Android 12以降では、センサーの更新レートが200Hzに制限されています
- より高い更新レートが必要な場合は、オプションの`HIGH_SAMPLING_RATE_SENSORS`権限を使用します

### iOS
- モーションデータにアクセスするには`NSMotionUsageDescription`が必要です

## 設定

`app.json`でセンサー権限を設定します：

```json
{
  "expo": {
    "plugins": [
      [
        "expo-sensors",
        {
          "motionPermission": "デバイスのモーションにアクセスを許可します"
        }
      ]
    ]
  }
}
```

## Accelerometer（加速度計）

デバイスの3軸（x、y、z）の加速度を測定します。

### 使用例

```typescript
import { Accelerometer } from 'expo-sensors';
import { useState, useEffect } from 'react';

export default function App() {
  const [data, setData] = useState({ x: 0, y: 0, z: 0 });

  useEffect(() => {
    const subscription = Accelerometer.addListener(accelerometerData => {
      setData(accelerometerData);
    });

    // 更新間隔を設定（ミリ秒）
    Accelerometer.setUpdateInterval(100);

    return () => subscription.remove();
  }, []);

  return (
    <View>
      <Text>x: {data.x.toFixed(2)}</Text>
      <Text>y: {data.y.toFixed(2)}</Text>
      <Text>z: {data.z.toFixed(2)}</Text>
    </View>
  );
}
```

### API

```typescript
// リスナーを追加
const subscription = Accelerometer.addListener(data => {
  console.log(data); // { x: number, y: number, z: number }
});

// 更新間隔を設定（ミリ秒）
Accelerometer.setUpdateInterval(100);

// 利用可能かチェック
const isAvailable = await Accelerometer.isAvailableAsync();

// クリーンアップ
subscription.remove();
```

## Barometer（気圧計）

大気圧を測定します。

### 使用例

```typescript
import { Barometer } from 'expo-sensors';
import { useState, useEffect } from 'react';

export default function App() {
  const [pressure, setPressure] = useState(0);

  useEffect(() => {
    const subscription = Barometer.addListener(({ pressure }) => {
      setPressure(pressure);
    });

    return () => subscription.remove();
  }, []);

  return (
    <View>
      <Text>気圧: {pressure.toFixed(2)} hPa</Text>
    </View>
  );
}
```

## DeviceMotion（デバイスモーション）

デバイスの動きと向きの総合的な情報を提供します。

### 使用例

```typescript
import { DeviceMotion } from 'expo-sensors';
import { useState, useEffect } from 'react';

export default function App() {
  const [data, setData] = useState({});

  useEffect(() => {
    const subscription = DeviceMotion.addListener(motionData => {
      setData(motionData);
    });

    DeviceMotion.setUpdateInterval(100);

    return () => subscription.remove();
  }, []);

  return (
    <View>
      <Text>加速度:</Text>
      <Text>x: {data.acceleration?.x.toFixed(2)}</Text>
      <Text>y: {data.acceleration?.y.toFixed(2)}</Text>
      <Text>z: {data.acceleration?.z.toFixed(2)}</Text>

      <Text>回転:</Text>
      <Text>alpha: {data.rotation?.alpha.toFixed(2)}</Text>
      <Text>beta: {data.rotation?.beta.toFixed(2)}</Text>
      <Text>gamma: {data.rotation?.gamma.toFixed(2)}</Text>
    </View>
  );
}
```

### DeviceMotionデータ構造

```typescript
{
  acceleration: { x: number, y: number, z: number },
  accelerationIncludingGravity: { x: number, y: number, z: number },
  rotation: { alpha: number, beta: number, gamma: number },
  rotationRate: { alpha: number, beta: number, gamma: number },
  orientation: number
}
```

## Gyroscope（ジャイロスコープ）

デバイスの回転速度を測定します。

### 使用例

```typescript
import { Gyroscope } from 'expo-sensors';
import { useState, useEffect } from 'react';

export default function App() {
  const [data, setData] = useState({ x: 0, y: 0, z: 0 });

  useEffect(() => {
    const subscription = Gyroscope.addListener(gyroscopeData => {
      setData(gyroscopeData);
    });

    Gyroscope.setUpdateInterval(100);

    return () => subscription.remove();
  }, []);

  return (
    <View>
      <Text>x: {data.x.toFixed(2)}</Text>
      <Text>y: {data.y.toFixed(2)}</Text>
      <Text>z: {data.z.toFixed(2)}</Text>
    </View>
  );
}
```

## LightSensor（光センサー）

周囲の光レベルを測定します（Androidのみ）。

### 使用例

```typescript
import { LightSensor } from 'expo-sensors';
import { useState, useEffect } from 'react';

export default function App() {
  const [illuminance, setIlluminance] = useState(0);

  useEffect(() => {
    const subscription = LightSensor.addListener(({ illuminance }) => {
      setIlluminance(illuminance);
    });

    return () => subscription.remove();
  }, []);

  return (
    <View>
      <Text>照度: {illuminance} lux</Text>
    </View>
  );
}
```

## Magnetometer（磁力計）

磁場を測定します。

### 使用例

```typescript
import { Magnetometer } from 'expo-sensors';
import { useState, useEffect } from 'react';

export default function App() {
  const [data, setData] = useState({ x: 0, y: 0, z: 0 });

  useEffect(() => {
    const subscription = Magnetometer.addListener(magnetometerData => {
      setData(magnetometerData);
    });

    Magnetometer.setUpdateInterval(100);

    return () => subscription.remove();
  }, []);

  return (
    <View>
      <Text>x: {data.x.toFixed(2)}</Text>
      <Text>y: {data.y.toFixed(2)}</Text>
      <Text>z: {data.z.toFixed(2)}</Text>
    </View>
  );
}
```

## 共通API

すべてのセンサー（Pedometer除く）は以下の共通APIを共有します：

```typescript
// リスナーを追加
const subscription = Sensor.addListener(callback);

// 更新間隔を設定（ミリ秒）
Sensor.setUpdateInterval(intervalMs);

// センサーが利用可能かチェック
const isAvailable = await Sensor.isAvailableAsync();

// リスナーを削除
subscription.remove();

// すべてのリスナーを削除
Sensor.removeAllListeners();
```

## 実用例

### シェイク検出

```typescript
import { Accelerometer } from 'expo-sensors';
import { useState, useEffect } from 'react';

const SHAKE_THRESHOLD = 1.5;

export default function ShakeDetector() {
  const [isShaking, setIsShaking] = useState(false);

  useEffect(() => {
    const subscription = Accelerometer.addListener(({ x, y, z }) => {
      const acceleration = Math.sqrt(x * x + y * y + z * z);

      if (acceleration > SHAKE_THRESHOLD) {
        setIsShaking(true);
        // シェイクアクションを実行
        console.log('デバイスがシェイクされました！');

        setTimeout(() => setIsShaking(false), 1000);
      }
    });

    Accelerometer.setUpdateInterval(100);

    return () => subscription.remove();
  }, []);

  return (
    <View>
      <Text>{isShaking ? 'シェイク検出！' : 'デバイスをシェイクしてください'}</Text>
    </View>
  );
}
```

### コンパス

```typescript
import { Magnetometer } from 'expo-sensors';
import { useState, useEffect } from 'react';

function calculateHeading(x: number, y: number): number {
  let angle = Math.atan2(y, x);
  let degrees = angle * (180 / Math.PI);
  return (degrees + 360) % 360;
}

export default function Compass() {
  const [heading, setHeading] = useState(0);

  useEffect(() => {
    const subscription = Magnetometer.addListener(({ x, y }) => {
      const heading = calculateHeading(x, y);
      setHeading(heading);
    });

    Magnetometer.setUpdateInterval(100);

    return () => subscription.remove();
  }, []);

  return (
    <View>
      <Text>方位: {heading.toFixed(0)}°</Text>
      <Text>{getDirection(heading)}</Text>
    </View>
  );
}

function getDirection(heading: number): string {
  if (heading >= 337.5 || heading < 22.5) return '北';
  if (heading >= 22.5 && heading < 67.5) return '北東';
  if (heading >= 67.5 && heading < 112.5) return '東';
  if (heading >= 112.5 && heading < 157.5) return '南東';
  if (heading >= 157.5 && heading < 202.5) return '南';
  if (heading >= 202.5 && heading < 247.5) return '南西';
  if (heading >= 247.5 && heading < 292.5) return '西';
  return '北西';
}
```

### 傾きベースのUI

```typescript
import { Accelerometer } from 'expo-sensors';
import { useState, useEffect } from 'react';
import { Animated, View } from 'react-native';

export default function TiltBall() {
  const [position] = useState(new Animated.ValueXY({ x: 0, y: 0 }));

  useEffect(() => {
    const subscription = Accelerometer.addListener(({ x, y }) => {
      Animated.spring(position, {
        toValue: { x: x * 100, y: -y * 100 },
        useNativeDriver: false,
      }).start();
    });

    Accelerometer.setUpdateInterval(16); // 60 FPS

    return () => subscription.remove();
  }, []);

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Animated.View
        style={{
          width: 50,
          height: 50,
          borderRadius: 25,
          backgroundColor: 'blue',
          transform: position.getTranslateTransform(),
        }}
      />
    </View>
  );
}
```

## ベストプラクティス

1. **クリーンアップ**: コンポーネントのアンマウント時に必ずリスナーを削除
2. **更新間隔の最適化**: バッテリー消費を考慮して適切な更新間隔を設定
3. **利用可能性チェック**: センサー使用前に利用可能性を確認
4. **パフォーマンス**: 重い計算をリスナー内で避ける
5. **エラー処理**: センサーアクセスを適切なエラー処理でラップ

## プラットフォーム固有の考慮事項

### Android
- Android 12+では200Hzの更新レート制限があります
- より高いレートには`HIGH_SAMPLING_RATE_SENSORS`権限が必要です
- 一部のセンサーはすべてのデバイスで利用できない場合があります

### iOS
- モーションデータへのアクセスにはユーザー権限が必要です
- センサーの精度はデバイスによって異なります
- バックグラウンドでのセンサーアクセスには追加設定が必要です

### Web
- 限定的なセンサーサポート
- HTTPSが必要です
- ブラウザの互換性を確認してください

## トラブルシューティング

- **センサーが利用できない**: `isAvailableAsync()`で利用可能性を確認
- **データが更新されない**: 更新間隔が適切に設定されているか確認
- **バッテリー消費が大きい**: 更新間隔を長くすることを検討

このライブラリは、複数のデバイスプラットフォーム全体でセンサーアクセスを行うための包括的なインターフェースを提供します。
