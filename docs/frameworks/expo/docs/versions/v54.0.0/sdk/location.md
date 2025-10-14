# Location

地理位置情報機能を提供するライブラリです。

## 概要

`expo-location` は、モバイルおよびWebアプリケーションに地理位置情報機能を提供するライブラリです。現在位置の取得、位置情報の更新イベントの監視、バックグラウンド位置追跡、ジオフェンシングなどをサポートします。

## 主な機能

- 地理位置情報の読み取り
- 現在位置のポーリング
- 位置更新イベントの購読
- バックグラウンド位置追跡のサポート
- ジオフェンシング機能
- クロスプラットフォーム対応（Android、iOS、Web）

## インストール

```bash
npx expo install expo-location
```

## 使用方法

### 基本的な位置情報の取得

```javascript
import * as Location from 'expo-location';

async function getCurrentLocation() {
  // 位置情報の許可をリクエスト
  let { status } = await Location.requestForegroundPermissionsAsync();
  if (status !== 'granted') {
    console.log('位置情報の許可が拒否されました');
    return;
  }

  // 現在位置を取得
  let location = await Location.getCurrentPositionAsync({});
  console.log(location.coords.latitude, location.coords.longitude);
}
```

### 位置情報の監視

```javascript
import { useState, useEffect } from 'react';
import * as Location from 'expo-location';

function LocationWatcher() {
  const [location, setLocation] = useState(null);

  useEffect(() => {
    let subscription;

    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        return;
      }

      subscription = await Location.watchPositionAsync(
        {
          accuracy: Location.Accuracy.High,
          timeInterval: 1000,
          distanceInterval: 10,
        },
        (newLocation) => {
          setLocation(newLocation);
        }
      );
    })();

    return () => {
      if (subscription) {
        subscription.remove();
      }
    };
  }, []);

  return (
    <View>
      {location && (
        <Text>
          緯度: {location.coords.latitude}, 経度: {location.coords.longitude}
        </Text>
      )}
    </View>
  );
}
```

### ジオコーディング

```javascript
import * as Location from 'expo-location';

// 住所から座標を取得
async function geocodeAddress(address) {
  const result = await Location.geocodeAsync(address);
  console.log(result[0].latitude, result[0].longitude);
}

// 座標から住所を取得
async function reverseGeocode(latitude, longitude) {
  const result = await Location.reverseGeocodeAsync({
    latitude,
    longitude,
  });
  console.log(result[0].city, result[0].country);
}
```

## API

### パーミッション

#### `requestForegroundPermissionsAsync()`

フォアグラウンドでの位置情報アクセス許可をリクエストします。

**戻り値:**
- `Promise<PermissionResponse>` - 許可の状態

#### `requestBackgroundPermissionsAsync()`

バックグラウンドでの位置情報アクセス許可をリクエストします。

**戻り値:**
- `Promise<PermissionResponse>` - 許可の状態

### 位置情報の取得

#### `getCurrentPositionAsync(options?)`

デバイスの現在位置を取得します。

**パラメータ:**
- `options` (optional) - 位置情報取得のオプション
  - `accuracy` - 精度レベル
  - `timeInterval` - 最大待機時間（ミリ秒）

**戻り値:**
- `Promise<LocationObject>` - 位置情報オブジェクト

#### `watchPositionAsync(options, callback)`

位置情報の更新を監視します。

**パラメータ:**
- `options` - 監視オプション
  - `accuracy` - 精度レベル
  - `timeInterval` - 更新間隔（ミリ秒）
  - `distanceInterval` - 更新距離（メートル）
- `callback` - 位置更新時のコールバック関数

**戻り値:**
- `Promise<LocationSubscription>` - サブスクリプションオブジェクト

### ジオコーディング

#### `geocodeAsync(address)`

住所を座標に変換します。

**パラメータ:**
- `address` - 住所文字列

**戻り値:**
- `Promise<LocationGeocodedAddress[]>` - 座標の配列

#### `reverseGeocodeAsync(location)`

座標を住所に変換します。

**パラメータ:**
- `location` - 緯度と経度を含むオブジェクト

**戻り値:**
- `Promise<LocationGeocodedAddress[]>` - 住所情報の配列

### バックグラウンド位置追跡

#### `startLocationUpdatesAsync(taskName, options)`

バックグラウンドでの位置追跡を開始します。

**パラメータ:**
- `taskName` - タスク名
- `options` - 追跡オプション

#### `stopLocationUpdatesAsync(taskName)`

バックグラウンドでの位置追跡を停止します。

**パラメータ:**
- `taskName` - タスク名

### ジオフェンシング

#### `startGeofencingAsync(taskName, regions)`

ジオフェンシングを開始します。

**パラメータ:**
- `taskName` - タスク名
- `regions` - 監視する地理的領域の配列

**戻り値:**
- `Promise<void>`

## 精度レベル

位置情報の精度レベルは以下から選択できます：

- `Accuracy.Lowest` - 約3キロメートル
- `Accuracy.Low` - 約1キロメートル
- `Accuracy.Balanced` - 約100メートル
- `Accuracy.High` - 約10メートル
- `Accuracy.Highest` - 利用可能な最高精度
- `Accuracy.BestForNavigation` - ナビゲーション用の最高精度

## 型定義

### LocationObject

```typescript
{
  coords: {
    latitude: number;
    longitude: number;
    altitude: number | null;
    accuracy: number | null;
    altitudeAccuracy: number | null;
    heading: number | null;
    speed: number | null;
  };
  timestamp: number;
}
```

### LocationGeocodedAddress

```typescript
{
  city: string | null;
  country: string | null;
  district: string | null;
  isoCountryCode: string | null;
  name: string | null;
  postalCode: string | null;
  region: string | null;
  street: string | null;
  subregion: string | null;
  timezone: string | null;
}
```

## 重要な考慮事項

- 明示的なユーザー許可が必要です
- パフォーマンスとバッテリー使用量は精度レベルによって異なります
- プラットフォーム固有の動作と制限があります
- ジオフェンシングはAndroidで最大100件、iOSで最大20件の領域をサポートします
- バックグラウンド位置追跡には追加の設定と許可が必要です

## プラットフォーム固有の動作

### iOS

- バックグラウンド位置追跡には `NSLocationAlwaysAndWhenInUseUsageDescription` が必要です
- ジオフェンシングは最大20の領域に制限されています

### Android

- バックグラウンド位置追跡には `ACCESS_BACKGROUND_LOCATION` 許可が必要です
- ジオフェンシングは最大100の領域をサポートします
- Android 12以降では、更新間隔に200msの制限があります

## サポートプラットフォーム

- Android
- iOS
- Web
