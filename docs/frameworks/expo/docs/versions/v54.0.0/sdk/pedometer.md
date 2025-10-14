# Pedometer

デバイスの歩数カウントセンサーへのアクセスを提供するライブラリです。Androidでは`hardware.Sensor`を、iOSではCore Motionを使用します。

## インストール

```bash
npx expo install expo-sensors
```

## 概要

Pedometerライブラリを使用すると、以下のことができます：

- デバイスで歩数計が利用可能かどうかを確認
- 過去24時間の歩数を取得
- リアルタイムの歩数更新を監視

## 使用例

```javascript
import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Pedometer } from 'expo-sensors';

export default function App() {
  const [isPedometerAvailable, setIsPedometerAvailable] = useState('checking');
  const [pastStepCount, setPastStepCount] = useState(0);
  const [currentStepCount, setCurrentStepCount] = useState(0);

  useEffect(() => {
    const subscribe = async () => {
      const isAvailable = await Pedometer.isAvailableAsync();
      setIsPedometerAvailable(String(isAvailable));

      if (isAvailable) {
        const end = new Date();
        const start = new Date();
        start.setDate(end.getDate() - 1);

        const pastStepCountResult = await Pedometer.getStepCountAsync(start, end);
        if (pastStepCountResult) {
          setPastStepCount(pastStepCountResult.steps);
        }

        return Pedometer.watchStepCount(result => {
          setCurrentStepCount(result.steps);
        });
      }
    };

    const subscription = subscribe();
    return () => subscription.then(s => s && s.remove());
  }, []);

  return (
    <View style={styles.container}>
      <Text>歩数計利用可能: {isPedometerAvailable}</Text>
      <Text>過去24時間の歩数: {pastStepCount}</Text>
      <Text>現在の歩数: {currentStepCount}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
```

## API

### `Pedometer.isAvailableAsync()`

デバイスで歩数計が有効になっているかどうかを確認します。

**戻り値:**
- `Promise<boolean>` - 歩数計が利用可能な場合は`true`を返します。

```javascript
const isAvailable = await Pedometer.isAvailableAsync();
console.log('歩数計利用可能:', isAvailable);
```

### `Pedometer.getStepCountAsync(start, end)`

2つの日付間の歩数を取得します。

**パラメータ:**
- `start` (Date) - 開始日時
- `end` (Date) - 終了日時

**戻り値:**
- `Promise<PedometerResult>` - 歩数を含むオブジェクト

**重要:** iOSでは、過去7日間のデータのみ取得できます。

```javascript
const end = new Date();
const start = new Date();
start.setDate(end.getDate() - 1);

const result = await Pedometer.getStepCountAsync(start, end);
console.log('歩数:', result.steps);
```

### `Pedometer.watchStepCount(callback)`

歩数計の更新をサブスクライブします。

**パラメータ:**
- `callback` (function) - 更新時に呼び出される関数

**戻り値:**
- `EventSubscription` - サブスクリプションオブジェクト

**注意:** アプリがバックグラウンドにあるときは、更新は配信されません。

```javascript
const subscription = Pedometer.watchStepCount(result => {
  console.log('現在の歩数:', result.steps);
});

// クリーンアップ
subscription.remove();
```

## 権限

### `Pedometer.getPermissionsAsync()`

現在の歩数計権限を取得します。

**戻り値:**
- `Promise<PermissionResponse>` - 権限ステータス

### `Pedometer.requestPermissionsAsync()`

歩数計権限を要求します。

**戻り値:**
- `Promise<PermissionResponse>` - 権限ステータス

```javascript
const { status } = await Pedometer.requestPermissionsAsync();
if (status === 'granted') {
  console.log('権限が付与されました');
}
```

## 重要な制限事項

1. **バックグラウンド更新なし**: アプリがバックグラウンドにあるときは、歩数計の更新は配信されません
2. **Android**: Health Connect APIの使用が推奨されます
3. **iOS**: 歩数データは過去7日間に制限されます

## プラットフォーム固有の考慮事項

### Android
- Androidでは、より包括的なデータアクセスのためにHealth Connect APIを使用することが推奨されます
- センサーは`hardware.Sensor`を使用します

### iOS
- Core Motionフレームワークを使用します
- データは過去7日間に制限されます
- より正確なデータのために、より長い時間間隔でクエリを実行することが推奨されます

## ベストプラクティス

1. **利用可能性の確認**: 歩数計を使用する前に、必ず利用可能性を確認してください
2. **リスナーのクリーンアップ**: コンポーネントのアンマウント時にサブスクリプションを削除してください
3. **権限の処理**: ユーザーに権限の必要性を説明してください
4. **エラー処理**: 歩数計が利用できない場合の処理を実装してください

このライブラリは、モバイルプラットフォーム全体で歩数追跡を行うための包括的なインターフェースを提供します。
