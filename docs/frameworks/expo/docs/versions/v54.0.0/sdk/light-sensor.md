# Expo LightSensor

## 概要

デバイスの光センサーへのアクセスを提供するライブラリで、現在はAndroidでのみ利用可能です。

## 主な機能

- 周囲の光レベルの監視が可能
- 照度をルクス（lx）で測定
- リアルタイムのセンサーデータ更新を提供

## インストール

```bash
npx expo install expo-sensors
```

## 使用例

```javascript
import { useState, useEffect } from 'react';
import { LightSensor } from 'expo-sensors';

export default function App() {
  const [{ illuminance }, setData] = useState({ illuminance: 0 });

  const subscribe = () => {
    return LightSensor.addListener(sensorData => {
      setData(sensorData);
    });
  };

  useEffect(() => {
    const subscription = subscribe();
    return () => subscription.remove();
  }, []);

  // コンポーネントをレンダリング
}
```

## 主要なAPIメソッド

- `addListener()`: 光センサーの更新を購読
- `isAvailableAsync()`: センサーの利用可能性を確認
- `setUpdateInterval()`: センサーの更新頻度を設定
- `requestPermissionsAsync()`: センサーアクセスのパーミッションを要求

## 制限事項

- Androidデバイスでのみサポート
- Android 12以降では200msの更新間隔制限がある
- 高いサンプリングレートにはアクセスに特定のパーミッションが必要

## 重要な注意事項

- 使用前に必ずセンサーの利用可能性を確認してください
- センサーデータへのアクセスにはパーミッションが必要な場合があります
