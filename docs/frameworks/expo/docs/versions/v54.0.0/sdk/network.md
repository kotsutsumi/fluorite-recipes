# Network

デバイスのネットワーク情報へのアクセスを提供するライブラリです。

## 概要

`expo-network` は、デバイスのネットワーク情報へのアクセスを提供するライブラリです。デバイスのIPアドレスの取得、ネットワーク接続状態の確認、機内モードのステータス検出、ネットワーク状態の変更の監視が可能です。

## 主な機能

- デバイスのIPアドレスを取得
- ネットワーク接続状態を確認
- 機内モードのステータスを検出
- ネットワーク状態の変更を監視

## インストール

```bash
npx expo install expo-network
```

## 使用方法

### IPアドレスの取得

```javascript
import * as Network from 'expo-network';

async function getIPAddress() {
  const ip = await Network.getIpAddressAsync();
  console.log('IPアドレス:', ip);
}
```

### ネットワーク状態の取得

```javascript
import * as Network from 'expo-network';

async function checkNetworkState() {
  const networkState = await Network.getNetworkStateAsync();

  console.log('接続タイプ:', networkState.type);
  console.log('接続状態:', networkState.isConnected);
  console.log('インターネット接続:', networkState.isInternetReachable);
}
```

### 機内モードの確認（Android）

```javascript
import * as Network from 'expo-network';
import { Platform } from 'react-native';

async function checkAirplaneMode() {
  if (Platform.OS === 'android') {
    const isAirplaneMode = await Network.isAirplaneModeEnabledAsync();
    console.log('機内モード:', isAirplaneMode);
  }
}
```

### ネットワーク状態の変更を監視

```javascript
import { useEffect } from 'react';
import * as Network from 'expo-network';

function NetworkMonitor() {
  useEffect(() => {
    const subscription = Network.addNetworkStateListener(({ type, isConnected, isInternetReachable }) => {
      console.log('ネットワークタイプ:', type);
      console.log('接続状態:', isConnected);
      console.log('インターネット到達可能:', isInternetReachable);
    });

    return () => subscription.remove();
  }, []);

  return null;
}
```

## API

### メソッド

#### `getIpAddressAsync()`

デバイスのIPv4アドレスを取得します。

**戻り値:**
- `Promise<string>` - IPアドレス文字列

#### `getNetworkStateAsync()`

現在のネットワーク接続状態を取得します。

**戻り値:**
- `Promise<NetworkState>` - ネットワーク状態オブジェクト

#### `isAirplaneModeEnabledAsync()`

機内モードが有効かどうかを確認します（Androidのみ）。

**戻り値:**
- `Promise<boolean>` - 機内モードが有効な場合は `true`

**プラットフォーム:** Android

#### `addNetworkStateListener(listener)`

ネットワーク状態の変更を監視します。

**パラメータ:**
- `listener: (state: NetworkState) => void` - 状態変更時のコールバック

**戻り値:**
- `Subscription` - サブスクリプションオブジェクト

## 型定義

### NetworkState

```typescript
{
  type: NetworkStateType;
  isConnected: boolean | null;
  isInternetReachable: boolean | null;
}
```

**プロパティ:**
- `type`: ネットワーク接続のタイプ
- `isConnected`: ネットワークに接続されているか
- `isInternetReachable`: インターネットに到達可能か

### NetworkStateType

```typescript
enum NetworkStateType {
  NONE = 'NONE',           // 接続なし
  UNKNOWN = 'UNKNOWN',     // 不明
  CELLULAR = 'CELLULAR',   // モバイルデータ
  WIFI = 'WIFI',           // Wi-Fi
  BLUETOOTH = 'BLUETOOTH', // Bluetooth
  ETHERNET = 'ETHERNET',   // イーサネット
  VPN = 'VPN',            // VPN
  WIMAX = 'WIMAX',        // WiMAX
  OTHER = 'OTHER',        // その他
}
```

### Subscription

```typescript
{
  remove: () => void;  // リスナーを削除
}
```

## 実用例

### 接続状態の表示

```javascript
import { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import * as Network from 'expo-network';

function NetworkStatusIndicator() {
  const [networkState, setNetworkState] = useState(null);

  useEffect(() => {
    // 初期状態を取得
    const getInitialState = async () => {
      const state = await Network.getNetworkStateAsync();
      setNetworkState(state);
    };

    getInitialState();

    // 状態変更を監視
    const subscription = Network.addNetworkStateListener((state) => {
      setNetworkState(state);
    });

    return () => subscription.remove();
  }, []);

  if (!networkState) {
    return <Text>読み込み中...</Text>;
  }

  const getStatusColor = () => {
    if (!networkState.isConnected) return '#FF0000';
    if (!networkState.isInternetReachable) return '#FFA500';
    return '#00FF00';
  };

  const getStatusText = () => {
    if (!networkState.isConnected) return 'オフライン';
    if (!networkState.isInternetReachable) return 'インターネット未接続';
    return 'オンライン';
  };

  return (
    <View style={styles.container}>
      <View style={[styles.indicator, { backgroundColor: getStatusColor() }]} />
      <Text style={styles.text}>{getStatusText()}</Text>
      <Text style={styles.type}>接続タイプ: {networkState.type}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
  },
  indicator: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 8,
  },
  text: {
    fontSize: 16,
    fontWeight: 'bold',
    marginRight: 8,
  },
  type: {
    fontSize: 14,
    color: '#666',
  },
});
```

### オフライン時の処理

```javascript
import { useState, useEffect } from 'react';
import { View, Text, Button, Alert } from 'react-native';
import * as Network from 'expo-network';

function DataFetchComponent() {
  const [isOnline, setIsOnline] = useState(true);

  useEffect(() => {
    const subscription = Network.addNetworkStateListener(({ isInternetReachable }) => {
      setIsOnline(isInternetReachable ?? false);
    });

    return () => subscription.remove();
  }, []);

  const fetchData = async () => {
    if (!isOnline) {
      Alert.alert(
        'オフライン',
        'インターネット接続を確認してください。'
      );
      return;
    }

    // データを取得
    try {
      const response = await fetch('https://api.example.com/data');
      const data = await response.json();
      console.log(data);
    } catch (error) {
      console.error('データ取得エラー:', error);
    }
  };

  return (
    <View>
      {!isOnline && (
        <View style={{ backgroundColor: '#FFA500', padding: 10 }}>
          <Text style={{ color: 'white', textAlign: 'center' }}>
            オフラインモード
          </Text>
        </View>
      )}
      <Button title="データを取得" onPress={fetchData} disabled={!isOnline} />
    </View>
  );
}
```

### ネットワークタイプの判定

```javascript
import * as Network from 'expo-network';

async function checkNetworkQuality() {
  const networkState = await Network.getNetworkStateAsync();

  switch (networkState.type) {
    case Network.NetworkStateType.WIFI:
      console.log('高速接続');
      return 'high';

    case Network.NetworkStateType.CELLULAR:
      console.log('モバイルデータ接続');
      return 'medium';

    case Network.NetworkStateType.NONE:
      console.log('接続なし');
      return 'none';

    default:
      console.log('不明な接続');
      return 'unknown';
  }
}
```

### IPアドレスの表示

```javascript
import { useState, useEffect } from 'react';
import { View, Text } from 'react-native';
import * as Network from 'expo-network';

function IPAddressDisplay() {
  const [ipAddress, setIpAddress] = useState(null);

  useEffect(() => {
    const getIP = async () => {
      try {
        const ip = await Network.getIpAddressAsync();
        setIpAddress(ip);
      } catch (error) {
        console.error('IPアドレス取得エラー:', error);
      }
    };

    getIP();
  }, []);

  return (
    <View>
      <Text>IPアドレス: {ipAddress || '取得中...'}</Text>
    </View>
  );
}
```

## プラットフォーム固有の動作

### Android

- すべての機能が完全にサポートされています
- `isAirplaneModeEnabledAsync()` はAndroidでのみ利用可能です
- 必要な許可: `ACCESS_NETWORK_STATE`、`ACCESS_WIFI_STATE`

### iOS

- 主要な機能がサポートされています
- 機内モードの検出は利用できません
- 一部のネットワークタイプは `UNKNOWN` として報告される場合があります

### Web

- 限定的なサポート
- 基本的なネットワーク状態の検出のみ
- IPアドレスの取得は制限があります

### tvOS

- 基本的なネットワーク機能をサポート
- プラットフォーム固有の制限がある場合があります

## 許可

### Android

```xml
<uses-permission android:name="android.permission.ACCESS_NETWORK_STATE" />
<uses-permission android:name="android.permission.ACCESS_WIFI_STATE" />
```

これらの許可は、`expo-network` をインストールすると自動的に追加されます。

## ベストプラクティス

1. **接続チェック**: ネットワーク操作の前に接続状態を確認
2. **オフライン対応**: オフライン時の適切な処理を実装
3. **状態監視**: アプリのライフサイクル全体でネットワーク状態を監視
4. **ユーザーフィードバック**: ネットワーク状態をユーザーに明確に伝える

## エラーハンドリング

```javascript
import * as Network from 'expo-network';

async function safeNetworkCheck() {
  try {
    const networkState = await Network.getNetworkStateAsync();

    if (!networkState.isConnected) {
      console.warn('ネットワークに接続されていません');
      return false;
    }

    if (!networkState.isInternetReachable) {
      console.warn('インターネットに到達できません');
      return false;
    }

    return true;
  } catch (error) {
    console.error('ネットワーク状態の取得エラー:', error);
    return false;
  }
}
```

## 既知の制限事項

- Webプラットフォームでは機能が制限されています
- 一部のネットワークタイプは正確に検出されない場合があります
- VPN接続時は、実際のネットワークタイプが隠される場合があります

## サポートプラットフォーム

- Android
- iOS
- tvOS
- Web（限定サポート）

## バンドルバージョン

~8.0.7
