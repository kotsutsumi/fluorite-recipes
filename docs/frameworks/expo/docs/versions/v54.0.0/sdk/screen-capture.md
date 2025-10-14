# ScreenCapture

アプリ画面をキャプチャまたは録画から保護するためのライブラリです。

## 概要

ScreenCaptureライブラリを使用すると、以下の2つの主要なユースケースで画面を保護できます：

1. 機密情報の保護（パスワード、クレジットカードデータなど）
2. 有料コンテンツの録画防止

## インストール

```bash
npx expo install expo-screen-capture
```

## プラットフォーム

- Android
- iOS

## 主な機能

- 画面キャプチャと録画の防止
- スクリーンショット検出コールバックの追加
- AndroidとiOS向けのプラットフォーム固有の保護
- アプリスイッチャーでのプライバシー保護

## 基本的な使用例

### フックを使用した画面キャプチャの防止

```typescript
import { usePreventScreenCapture } from 'expo-screen-capture';
import { Text, View } from 'react-native';

export default function ScreenCaptureExample() {
  usePreventScreenCapture();

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>この画面は録画できません！</Text>
    </View>
  );
}
```

### 手動で画面キャプチャを制御

```typescript
import React, { useEffect } from 'react';
import * as ScreenCapture from 'expo-screen-capture';
import { Button, View } from 'react-native';

export default function ScreenCaptureExample() {
  const activate = async () => {
    await ScreenCapture.preventScreenCaptureAsync();
  };

  const deactivate = async () => {
    await ScreenCapture.allowScreenCaptureAsync();
  };

  return (
    <View>
      <Button title="保護を有効化" onPress={activate} />
      <Button title="保護を無効化" onPress={deactivate} />
    </View>
  );
}
```

## API

### `ScreenCapture.preventScreenCaptureAsync(key?)`

画面キャプチャをブロックします。

**パラメータ:**
- `key` (string, optional): 複数の保護を管理するための一意のキー

**戻り値:**
- `Promise<void>`

```typescript
await ScreenCapture.preventScreenCaptureAsync('payment-screen');
```

### `ScreenCapture.allowScreenCaptureAsync(key?)`

画面キャプチャを再度有効にします。

**パラメータ:**
- `key` (string, optional): 無効化する保護のキー

**戻り値:**
- `Promise<void>`

```typescript
await ScreenCapture.allowScreenCaptureAsync('payment-screen');
```

### `ScreenCapture.usePreventScreenCapture(key?)`

コンポーネントがマウントされている間、画面キャプチャを防止するReactフックです。

**パラメータ:**
- `key` (string, optional): 保護を識別するキー

```typescript
import { usePreventScreenCapture } from 'expo-screen-capture';

function SecureScreen() {
  usePreventScreenCapture('secure-screen');

  return <View>{/* 保護されたコンテンツ */}</View>;
}
```

### `ScreenCapture.addScreenshotListener(listener)`

スクリーンショットが撮られたときを検出します。

**パラメータ:**
- `listener` (function): スクリーンショット時に呼び出されるコールバック関数

**戻り値:**
- `Subscription`: サブスクリプションオブジェクト

```typescript
const subscription = ScreenCapture.addScreenshotListener(() => {
  alert('スクリーンショットが撮られました！');
});

// クリーンアップ
subscription.remove();
```

### `ScreenCapture.removeScreenshotListener(subscription)`

スクリーンショットリスナーを削除します。

**パラメータ:**
- `subscription` (Subscription): 削除するサブスクリプション

```typescript
subscription.remove();
```

## Android固有の機能

### `ScreenCapture.enableAppSwitcherProtectionAsync()` (Android)

アプリスイッチャーでプライバシー保護を追加します。

**戻り値:**
- `Promise<void>`

```typescript
if (Platform.OS === 'android') {
  await ScreenCapture.enableAppSwitcherProtectionAsync();
}
```

### `ScreenCapture.disableAppSwitcherProtectionAsync()` (Android)

アプリスイッチャー保護を無効化します。

**戻り値:**
- `Promise<void>`

```typescript
if (Platform.OS === 'android') {
  await ScreenCapture.disableAppSwitcherProtectionAsync();
}
```

## 権限

### `ScreenCapture.getPermissionsAsync()`

現在のスクリーンショット検出権限を取得します。

**戻り値:**
- `Promise<PermissionResponse>`

```typescript
const { status } = await ScreenCapture.getPermissionsAsync();
console.log('権限ステータス:', status);
```

### `ScreenCapture.requestPermissionsAsync()`

スクリーンショット検出権限を要求します（Android 14+で必要）。

**戻り値:**
- `Promise<PermissionResponse>`

```typescript
const { status } = await ScreenCapture.requestPermissionsAsync();
if (status === 'granted') {
  console.log('権限が付与されました');
}
```

## 実用例

### 決済画面の保護

```typescript
import React from 'react';
import { usePreventScreenCapture } from 'expo-screen-capture';
import { View, Text, TextInput, Button } from 'react-native';

export default function PaymentScreen() {
  usePreventScreenCapture();

  return (
    <View style={{ padding: 20 }}>
      <Text>クレジットカード情報</Text>
      <TextInput placeholder="カード番号" secureTextEntry />
      <TextInput placeholder="CVV" secureTextEntry />
      <Button title="支払う" onPress={() => {}} />
    </View>
  );
}
```

### スクリーンショット検出

```typescript
import React, { useEffect } from 'react';
import * as ScreenCapture from 'expo-screen-capture';
import { View, Text, Alert } from 'react-native';

export default function SecureContentScreen() {
  useEffect(() => {
    const subscription = ScreenCapture.addScreenshotListener(() => {
      Alert.alert(
        'スクリーンショットが検出されました',
        'このコンテンツはスクリーンショットで共有できません。',
        [{ text: 'OK' }]
      );
    });

    return () => subscription.remove();
  }, []);

  return (
    <View>
      <Text>プレミアムコンテンツ</Text>
    </View>
  );
}
```

### 条件付き保護

```typescript
import React, { useState } from 'react';
import * as ScreenCapture from 'expo-screen-capture';
import { View, Button, Text } from 'react-native';

export default function ConditionalProtection() {
  const [isProtected, setIsProtected] = useState(false);

  const toggleProtection = async () => {
    if (isProtected) {
      await ScreenCapture.allowScreenCaptureAsync();
      setIsProtected(false);
    } else {
      await ScreenCapture.preventScreenCaptureAsync();
      setIsProtected(true);
    }
  };

  return (
    <View style={{ padding: 20 }}>
      <Text>
        保護ステータス: {isProtected ? '有効' : '無効'}
      </Text>
      <Button
        title={isProtected ? '保護を無効化' : '保護を有効化'}
        onPress={toggleProtection}
      />
    </View>
  );
}
```

### 複数画面での保護管理

```typescript
import React from 'react';
import { usePreventScreenCapture } from 'expo-screen-capture';
import { View, Text } from 'react-native';

function SecureScreen1() {
  usePreventScreenCapture('screen1');
  return <View><Text>保護された画面 1</Text></View>;
}

function SecureScreen2() {
  usePreventScreenCapture('screen2');
  return <View><Text>保護された画面 2</Text></View>;
}
```

## プラットフォーム固有の考慮事項

### iOS
- iOS 11+で動作
- スクリーンショット検出は信頼性が高い
- 録画検出は制限される場合があります

### Android
- Android 5.0+で動作
- スクリーンショット検出にはAndroid 14+で権限が必要
- 一部のデバイスでは録画を完全に防止できない場合があります

## ベストプラクティス

1. **選択的な使用**: 機密コンテンツがある画面でのみ保護を有効化
2. **ユーザーへの通知**: なぜスクリーンショットがブロックされているかを明確に説明
3. **適切なクリーンアップ**: コンポーネントのアンマウント時にリスナーを削除
4. **権限の処理**: Androidで必要な権限を適切に要求
5. **フォールバック**: 保護が利用できない場合の代替策を提供

## トラブルシューティング

- **保護が機能しない**: プラットフォーム固有の要件を確認してください
- **権限エラー**: Android 14+で権限が付与されていることを確認してください
- **リスナーが呼び出されない**: サブスクリプションが適切にクリーンアップされていることを確認してください

このライブラリは、Expoアプリケーションで画面キャプチャ保護を実装するための包括的なガイダンスを提供します。
