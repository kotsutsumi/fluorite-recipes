# Maps

AndroidではGoogle Maps、iOSではApple Mapsへのアクセスを提供するライブラリです。

## 概要

`expo-maps` は、プラットフォーム固有のマップサポート（AndroidではGoogle Maps、iOSではApple Maps）を提供するライブラリです。現在アルファステージにあり、開発ビルドが必要です。

## 主な機能

- プラットフォーム固有のマップサポート（Android: Google Maps、iOS: Apple Maps）
- マーカー、円、ポリゴン、ポリラインのサポート
- カスタマイズ可能なマッププロパティとUI設定
- 位置情報アクセスの許可管理

## 重要な注意事項

- 現在アルファバージョンです
- Expo Goでは利用できません
- 開発ビルドが必要です
- 破壊的変更が発生する可能性があります

## インストール

```bash
npx expo install expo-maps
```

## 設定

### Android（Google Maps）の設定

1. Google Cloud Platform でプロジェクトを作成
2. Maps SDK for Android を有効化
3. APIキーを取得
4. `app.json` に設定を追加:

```json
{
  "expo": {
    "plugins": [
      [
        "expo-maps",
        {
          "googleMapsApiKey": "YOUR_GOOGLE_MAPS_API_KEY"
        }
      ]
    ]
  }
}
```

### iOS（Apple Maps）の設定

Apple Mapsは追加の設定なしで動作しますが、位置情報の許可が必要な場合は `app.json` で設定します:

```json
{
  "expo": {
    "plugins": [
      [
        "expo-maps",
        {
          "locationPermission": "このアプリは位置情報を使用します"
        }
      ]
    ]
  }
}
```

## 使用方法

### 基本的なマップの表示

```javascript
import { Platform, StyleSheet, View } from 'react-native';
import { AppleMaps, GoogleMaps } from 'expo-maps';

export default function App() {
  if (Platform.OS === 'ios') {
    return (
      <AppleMaps.View
        style={styles.map}
        initialCameraPosition={{
          center: { latitude: 35.6762, longitude: 139.6503 },
          zoom: 15,
        }}
      />
    );
  } else if (Platform.OS === 'android') {
    return (
      <GoogleMaps.View
        style={styles.map}
        initialCameraPosition={{
          center: { latitude: 35.6762, longitude: 139.6503 },
          zoom: 15,
        }}
      />
    );
  }

  return <View style={styles.map} />;
}

const styles = StyleSheet.create({
  map: {
    flex: 1,
  },
});
```

### マーカーの追加

```javascript
import { GoogleMaps } from 'expo-maps';

function MapWithMarkers() {
  return (
    <GoogleMaps.View style={{ flex: 1 }}>
      <GoogleMaps.Marker
        coordinate={{ latitude: 35.6762, longitude: 139.6503 }}
        title="東京"
        description="日本の首都"
      />
      <GoogleMaps.Marker
        coordinate={{ latitude: 35.0116, longitude: 135.7681 }}
        title="京都"
        description="古都"
      />
    </GoogleMaps.View>
  );
}
```

### 円の描画

```javascript
import { GoogleMaps } from 'expo-maps';

function MapWithCircle() {
  return (
    <GoogleMaps.View style={{ flex: 1 }}>
      <GoogleMaps.Circle
        center={{ latitude: 35.6762, longitude: 139.6503 }}
        radius={1000}
        fillColor="rgba(255, 0, 0, 0.2)"
        strokeColor="red"
        strokeWidth={2}
      />
    </GoogleMaps.View>
  );
}
```

### ポリゴンの描画

```javascript
import { GoogleMaps } from 'expo-maps';

function MapWithPolygon() {
  const coordinates = [
    { latitude: 35.6762, longitude: 139.6503 },
    { latitude: 35.6862, longitude: 139.6603 },
    { latitude: 35.6762, longitude: 139.6703 },
  ];

  return (
    <GoogleMaps.View style={{ flex: 1 }}>
      <GoogleMaps.Polygon
        coordinates={coordinates}
        fillColor="rgba(0, 0, 255, 0.2)"
        strokeColor="blue"
        strokeWidth={2}
      />
    </GoogleMaps.View>
  );
}
```

### ポリラインの描画

```javascript
import { GoogleMaps } from 'expo-maps';

function MapWithPolyline() {
  const coordinates = [
    { latitude: 35.6762, longitude: 139.6503 },
    { latitude: 35.6862, longitude: 139.6603 },
    { latitude: 35.6962, longitude: 139.6703 },
  ];

  return (
    <GoogleMaps.View style={{ flex: 1 }}>
      <GoogleMaps.Polyline
        coordinates={coordinates}
        strokeColor="green"
        strokeWidth={3}
      />
    </GoogleMaps.View>
  );
}
```

## API

### GoogleMaps.View (Android)

**Props:**
- `initialCameraPosition` - 初期カメラ位置
- `mapType` - マップタイプ（'normal' | 'satellite' | 'hybrid' | 'terrain'）
- `showsUserLocation` - ユーザー位置の表示
- `showsCompass` - コンパスの表示
- `showsScale` - スケールの表示
- `rotateEnabled` - 回転の有効化
- `scrollEnabled` - スクロールの有効化
- `zoomEnabled` - ズームの有効化

### AppleMaps.View (iOS)

**Props:**
- `initialCameraPosition` - 初期カメラ位置
- `mapType` - マップタイプ（'standard' | 'satellite' | 'hybrid'）
- `showsUserLocation` - ユーザー位置の表示
- `showsCompass` - コンパスの表示
- `showsScale` - スケールの表示
- `rotateEnabled` - 回転の有効化
- `scrollEnabled` - スクロールの有効化
- `zoomEnabled` - ズームの有効化

### Marker

**Props:**
- `coordinate` - マーカーの座標
- `title` - マーカーのタイトル
- `description` - マーカーの説明
- `icon` - カスタムアイコン（オプション）
- `draggable` - ドラッグ可能か
- `onPress` - タップ時のコールバック

### Circle

**Props:**
- `center` - 円の中心座標
- `radius` - 半径（メートル）
- `fillColor` - 塗りつぶし色
- `strokeColor` - 枠線の色
- `strokeWidth` - 枠線の幅

### Polygon

**Props:**
- `coordinates` - 座標の配列
- `fillColor` - 塗りつぶし色
- `strokeColor` - 枠線の色
- `strokeWidth` - 枠線の幅

### Polyline

**Props:**
- `coordinates` - 座標の配列
- `strokeColor` - 線の色
- `strokeWidth` - 線の幅

## 型定義

### CameraPosition

```typescript
{
  center: {
    latitude: number;
    longitude: number;
  };
  zoom: number;
  bearing?: number;  // カメラの方位（度）
  tilt?: number;     // カメラの傾き（度）
}
```

### Coordinate

```typescript
{
  latitude: number;
  longitude: number;
}
```

## プラットフォーム固有の考慮事項

### Android（Google Maps）

- Google Cloud Platform のAPIキーが必要
- Maps SDK for Android の有効化が必要
- 開発ビルドが必要

### iOS（Apple Maps）

- 追加のAPIキーは不要
- 位置情報の許可が必要な場合は設定が必要
- 開発ビルドが必要

## 許可

### Android

```xml
<uses-permission android:name="android.permission.ACCESS_FINE_LOCATION" />
<uses-permission android:name="android.permission.ACCESS_COARSE_LOCATION" />
```

### iOS

```json
{
  "expo": {
    "ios": {
      "infoPlist": {
        "NSLocationWhenInUseUsageDescription": "このアプリは位置情報を使用します"
      }
    }
  }
}
```

## ベストプラクティス

1. **プラットフォーム分岐**: iOS と Android で適切なマップコンポーネントを使用
2. **パフォーマンス**: 多数のマーカーを表示する場合はクラスタリングを検討
3. **許可管理**: 位置情報の許可を適切に処理
4. **エラーハンドリング**: APIキーの設定ミスなどに対処

## 既知の制限事項

- アルファバージョンのため、APIが変更される可能性があります
- Expo Goでは動作しません
- 一部の高度な機能はまだサポートされていません

## サポートプラットフォーム

- Android: サポート（Google Maps）
- iOS: サポート（Apple Maps）
