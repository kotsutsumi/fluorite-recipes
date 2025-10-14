# Gyroscope

デバイスのジャイロスコープセンサーにアクセスするためのライブラリです。デバイスの回転速度を測定できます。

## 概要

Gyroscopeは、`expo-sensors`パッケージの一部として提供され、デバイスの3軸（x、y、z）周りの回転速度をラジアン/秒単位で測定します。

## プラットフォーム互換性

| プラットフォーム | サポート |
|----------------|---------|
| Android        | ✅      |
| iOS            | ✅ (デバイスのみ) |
| Web            | ✅      |

## インストール

```bash
npx expo install expo-sensors
```

## 基本的な使用方法

```javascript
import { Gyroscope } from 'expo-sensors';
import { useState, useEffect } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function App() {
  const [{ x, y, z }, setData] = useState({
    x: 0,
    y: 0,
    z: 0,
  });
  const [subscription, setSubscription] = useState(null);

  const _slow = () => Gyroscope.setUpdateInterval(1000);
  const _fast = () => Gyroscope.setUpdateInterval(16);

  const _subscribe = () => {
    setSubscription(
      Gyroscope.addListener(gyroscopeData => {
        setData(gyroscopeData);
      })
    );
  };

  const _unsubscribe = () => {
    subscription && subscription.remove();
    setSubscription(null);
  };

  useEffect(() => {
    _subscribe();
    return () => _unsubscribe();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Gyroscope:</Text>
      <Text style={styles.text}>x: {x.toFixed(2)}</Text>
      <Text style={styles.text}>y: {y.toFixed(2)}</Text>
      <Text style={styles.text}>z: {z.toFixed(2)}</Text>
      <View style={styles.buttonContainer}>
        <TouchableOpacity onPress={subscription ? _unsubscribe : _subscribe} style={styles.button}>
          <Text>{subscription ? '停止' : '開始'}</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={_slow} style={[styles.button, styles.middleButton]}>
          <Text>遅く</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={_fast} style={styles.button}>
          <Text>速く</Text>
        </TouchableOpacity>
      </View>
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
    textAlign: 'center',
    fontSize: 18,
    marginVertical: 5,
  },
  buttonContainer: {
    flexDirection: 'row',
    alignItems: 'stretch',
    marginTop: 20,
  },
  button: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#eee',
    padding: 15,
  },
  middleButton: {
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderColor: '#ccc',
  },
});
```

## API

### メソッド

#### `Gyroscope.addListener(listener)`

ジャイロスコープの更新を購読します。

```javascript
const subscription = Gyroscope.addListener(data => {
  console.log('X:', data.x);
  console.log('Y:', data.y);
  console.log('Z:', data.z);
});
```

**パラメータ:**
- `listener`: ジャイロスコープデータを受け取るコールバック関数

**戻り値:**
- `Subscription`オブジェクト（`remove()`メソッドを持つ）

#### `Gyroscope.removeAllListeners()`

すべてのリスナーを削除します。

```javascript
Gyroscope.removeAllListeners();
```

#### `Gyroscope.setUpdateInterval(intervalMs)`

センサーの更新間隔を設定します。

```javascript
// 100msごとに更新
Gyroscope.setUpdateInterval(100);

// 16msごとに更新（約60 FPS）
Gyroscope.setUpdateInterval(16);
```

**パラメータ:**
- `intervalMs`: 更新間隔（ミリ秒）

**注意:** Androidでは200ms未満の間隔は無視される場合があります。

#### `Gyroscope.isAvailableAsync()`

デバイスでジャイロスコープが利用可能かどうかを確認します。

```javascript
const isAvailable = await Gyroscope.isAvailableAsync();

if (isAvailable) {
  console.log('ジャイロスコープが利用可能です');
} else {
  console.log('ジャイロスコープは利用できません');
}
```

**戻り値:**
- センサーが利用可能な場合は`true`を返すPromise

#### `Gyroscope.getPermissionsAsync()`

センサーへのアクセス権限の現在の状態を取得します。

```javascript
const { status } = await Gyroscope.getPermissionsAsync();
console.log('権限ステータス:', status);
```

**戻り値:**
- `PermissionResponse`オブジェクトを返すPromise

#### `Gyroscope.requestPermissionsAsync()`

ユーザーにセンサーへのアクセス権限を要求します。

```javascript
const { status } = await Gyroscope.requestPermissionsAsync();

if (status === 'granted') {
  console.log('権限が許可されました');
} else {
  console.log('権限が拒否されました');
}
```

**戻り値:**
- `PermissionResponse`オブジェクトを返すPromise

### 型定義

#### `GyroscopeData`

```typescript
type GyroscopeData = {
  x: number;
  y: number;
  z: number;
  timestamp: number;
};
```

**プロパティ:**
- `x`: X軸周りの回転速度（ラジアン/秒）
- `y`: Y軸周りの回転速度（ラジアン/秒）
- `z`: Z軸周りの回転速度（ラジアン/秒）
- `timestamp`: 測定のタイムスタンプ

## 使用例

### センサーの可用性確認

```javascript
import { Gyroscope } from 'expo-sensors';
import { useEffect, useState } from 'react';
import { Text, View } from 'react-native';

export default function GyroscopeAvailability() {
  const [available, setAvailable] = useState(false);

  useEffect(() => {
    async function checkAvailability() {
      const isAvailable = await Gyroscope.isAvailableAsync();
      setAvailable(isAvailable);
    }

    checkAvailability();
  }, []);

  return (
    <View>
      <Text>
        ジャイロスコープ: {available ? '利用可能' : '利用不可'}
      </Text>
    </View>
  );
}
```

### 権限の管理

```javascript
import { Gyroscope } from 'expo-sensors';
import { useEffect, useState } from 'react';
import { Alert, Button, View } from 'react-native';

export default function GyroscopePermissions() {
  const [hasPermission, setHasPermission] = useState(null);

  useEffect(() => {
    checkPermission();
  }, []);

  const checkPermission = async () => {
    const { status } = await Gyroscope.getPermissionsAsync();
    setHasPermission(status === 'granted');
  };

  const requestPermission = async () => {
    const { status } = await Gyroscope.requestPermissionsAsync();

    if (status === 'granted') {
      setHasPermission(true);
      Alert.alert('成功', '権限が許可されました');
    } else {
      Alert.alert('エラー', '権限が拒否されました');
    }
  };

  if (hasPermission === null) {
    return null;
  }

  if (!hasPermission) {
    return (
      <View>
        <Button
          title="ジャイロスコープ権限を要求"
          onPress={requestPermission}
        />
      </View>
    );
  }

  return <View>{/* ジャイロスコープを使用するコンポーネント */}</View>;
}
```

### 回転の検出

```javascript
import { Gyroscope } from 'expo-sensors';
import { useState, useEffect } from 'react';
import { Text, View, StyleSheet } from 'react-native';

export default function RotationDetector() {
  const [rotation, setRotation] = useState('静止');
  const THRESHOLD = 0.5; // ラジアン/秒

  useEffect(() => {
    const subscription = Gyroscope.addListener(({ x, y, z }) => {
      if (Math.abs(x) > THRESHOLD) {
        setRotation('X軸周りの回転');
      } else if (Math.abs(y) > THRESHOLD) {
        setRotation('Y軸周りの回転');
      } else if (Math.abs(z) > THRESHOLD) {
        setRotation('Z軸周りの回転');
      } else {
        setRotation('静止');
      }
    });

    Gyroscope.setUpdateInterval(100);

    return () => subscription.remove();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.text}>状態: {rotation}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontSize: 24,
  },
});
```

### カスタムフックの作成

```javascript
import { Gyroscope } from 'expo-sensors';
import { useState, useEffect } from 'react';

export function useGyroscope(updateInterval = 100) {
  const [data, setData] = useState({
    x: 0,
    y: 0,
    z: 0,
  });
  const [isAvailable, setIsAvailable] = useState(false);

  useEffect(() => {
    async function checkAvailability() {
      const available = await Gyroscope.isAvailableAsync();
      setIsAvailable(available);
    }

    checkAvailability();
  }, []);

  useEffect(() => {
    if (!isAvailable) return;

    Gyroscope.setUpdateInterval(updateInterval);

    const subscription = Gyroscope.addListener(gyroscopeData => {
      setData(gyroscopeData);
    });

    return () => subscription.remove();
  }, [isAvailable, updateInterval]);

  return { data, isAvailable };
}

// 使用例
export default function App() {
  const { data, isAvailable } = useGyroscope(100);

  if (!isAvailable) {
    return <Text>ジャイロスコープは利用できません</Text>;
  }

  return (
    <View>
      <Text>X: {data.x.toFixed(2)}</Text>
      <Text>Y: {data.y.toFixed(2)}</Text>
      <Text>Z: {data.z.toFixed(2)}</Text>
    </View>
  );
}
```

### デバイスの向きの推定

```javascript
import { Gyroscope } from 'expo-sensors';
import { useState, useEffect } from 'react';
import { Text, View } from 'react-native';

export default function OrientationEstimator() {
  const [orientation, setOrientation] = useState({ x: 0, y: 0, z: 0 });

  useEffect(() => {
    let lastUpdate = Date.now();

    const subscription = Gyroscope.addListener(({ x, y, z }) => {
      const now = Date.now();
      const dt = (now - lastUpdate) / 1000; // 秒単位
      lastUpdate = now;

      // 角度を積分（簡易的な方法）
      setOrientation(prev => ({
        x: prev.x + x * dt,
        y: prev.y + y * dt,
        z: prev.z + z * dt,
      }));
    });

    Gyroscope.setUpdateInterval(16);

    return () => subscription.remove();
  }, []);

  return (
    <View>
      <Text>推定角度（ラジアン）:</Text>
      <Text>X: {orientation.x.toFixed(2)}</Text>
      <Text>Y: {orientation.y.toFixed(2)}</Text>
      <Text>Z: {orientation.z.toFixed(2)}</Text>
    </View>
  );
}
```

## プラットフォーム固有の考慮事項

### Android

- センサーの更新間隔に200msの制限があります
- 一部のデバイスではジャイロスコープが利用できない場合があります
- 使用前に`isAvailableAsync()`で確認することを推奨します

### iOS

- シミュレーターではジャイロスコープは利用できません
- 実機でのテストが必要です
- バックグラウンドでセンサーを使用する場合は追加の設定が必要です

### Web

- HTTPSが必要です
- ユーザーインタラクション（クリックなど）が権限取得に必要な場合があります
- ブラウザとデバイスのサポート状況に依存します

## ベストプラクティス

1. **可用性の確認**: 使用前に必ず`isAvailableAsync()`で確認
2. **適切な更新間隔**: 必要最小限の更新頻度を使用してバッテリーを節約
3. **リスナーのクリーンアップ**: コンポーネントのアンマウント時にリスナーを削除
4. **権限の管理**: 必要に応じて権限を要求し、ユーザーに説明を提供
5. **エラーハンドリング**: センサーが利用できない場合の適切な処理

## 注意事項

- ジャイロスコープデータはドリフト（時間経過による誤差の蓄積）が発生します
- 正確な向きの追跡には、加速度計や磁力計との組み合わせ（センサーフュージョン）が推奨されます
- バッテリー消費に注意してください
- センサーデータの解釈には適切なフィルタリングが必要な場合があります

## トラブルシューティング

### センサーが動作しない

```javascript
// 問題: センサーの可用性を確認していない
const subscription = Gyroscope.addListener(data => {
  // ...
});

// 解決: 可用性を確認
const isAvailable = await Gyroscope.isAvailableAsync();
if (isAvailable) {
  const subscription = Gyroscope.addListener(data => {
    // ...
  });
}
```

### 更新が遅い

```javascript
// 問題: デフォルトの更新間隔が使用されている
Gyroscope.addListener(data => {
  // ...
});

// 解決: 更新間隔を設定
Gyroscope.setUpdateInterval(16); // 約60 FPS
Gyroscope.addListener(data => {
  // ...
});
```

### メモリリーク

```javascript
// 問題: リスナーが削除されていない
useEffect(() => {
  Gyroscope.addListener(data => {
    // ...
  });
  // クリーンアップなし
}, []);

// 解決: リスナーを適切に削除
useEffect(() => {
  const subscription = Gyroscope.addListener(data => {
    // ...
  });

  return () => subscription.remove();
}, []);
```

## 関連センサー

- **Accelerometer**: デバイスの加速度を測定
- **Magnetometer**: 磁場を測定（コンパス機能）
- **DeviceMotion**: 複合的なモーションデータ
- **Barometer**: 気圧を測定

## 関連リソース

- [センサーフュージョン](https://en.wikipedia.org/wiki/Sensor_fusion)
- [ジャイロスコープの原理](https://en.wikipedia.org/wiki/Gyroscope)
- [モーションセンサーのベストプラクティス](https://developer.android.com/guide/topics/sensors/sensors_motion)
