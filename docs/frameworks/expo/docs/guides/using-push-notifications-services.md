# プッシュ通知サービスを使用する

Expoアプリでプッシュ通知サービスを統合し、ユーザーエンゲージメントを向上させる方法を学びます。

## 概要

プッシュ通知は、ユーザーにタイムリーな情報を配信し、アプリへの再訪を促進する強力なツールです。

**主な用途**：
- ユーザーエンゲージメントの向上
- 重要な更新の通知
- マーケティングキャンペーン
- リアルタイムアラート
- トランザクション通知

**利用可能なサービス**：
- Expo Push Notifications（標準）
- OneSignal
- Braze
- Customer.io
- CleverTap
- Firebase Cloud Messaging（直接）
- Apple Push Notification service（直接）

## 前提条件

**必要なもの**：
- 物理デバイス（エミュレーター/シミュレーターでは動作しません）
- Apple Developer Account（iOS、有料アカウント必要）
- Firebase プロジェクト（Android FCM用）

**推奨ツール**：
- EAS Build（プロダクションビルド用）

## Expo Push Notificationsの使用

### ステップ1: ライブラリのインストール

```bash
# 必要なパッケージをインストール
npx expo install expo-notifications expo-device expo-constants
```

**インストールされるライブラリ**：
- `expo-notifications`: 通知の送受信
- `expo-device`: デバイスタイプの確認
- `expo-constants`: プロジェクト設定の取得

### ステップ2: app.jsonの設定

```json
{
  "expo": {
    "plugins": [
      [
        "expo-notifications",
        {
          "icon": "./assets/notification-icon.png",
          "color": "#ffffff",
          "sounds": ["./assets/notification-sound.wav"]
        }
      ]
    ],
    "android": {
      "googleServicesFile": "./google-services.json"
    },
    "ios": {
      "bundleIdentifier": "com.yourcompany.yourapp"
    }
  }
}
```

### ステップ3: 通知ハンドラーの設定

```typescript
// app/_layout.tsx
import { useEffect, useRef } from 'react';
import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

// 通知の表示方法を設定
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

export default function RootLayout() {
  const notificationListener = useRef<Notifications.Subscription>();
  const responseListener = useRef<Notifications.Subscription>();

  useEffect(() => {
    // 通知受信時のリスナー
    notificationListener.current =
      Notifications.addNotificationReceivedListener((notification) => {
        console.log('Notification received:', notification);
      });

    // 通知タップ時のリスナー
    responseListener.current =
      Notifications.addNotificationResponseReceivedListener((response) => {
        console.log('Notification tapped:', response);
        // ナビゲーション処理
      });

    return () => {
      notificationListener.current &&
        Notifications.removeNotificationSubscription(
          notificationListener.current
        );
      responseListener.current &&
        Notifications.removeNotificationSubscription(responseListener.current);
    };
  }, []);

  return (
    // レイアウトコンポーネント
  );
}
```

### ステップ4: パーミッションの要求

```typescript
// utils/notifications.ts
import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import { Platform } from 'react-native';

export async function registerForPushNotificationsAsync() {
  let token;

  // 物理デバイスかどうかを確認
  if (!Device.isDevice) {
    alert('プッシュ通知は物理デバイスでのみ動作します');
    return;
  }

  // パーミッションの確認
  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;

  // パーミッションがない場合はリクエスト
  if (existingStatus !== 'granted') {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }

  if (finalStatus !== 'granted') {
    alert('プッシュ通知のパーミッションが許可されませんでした');
    return;
  }

  // Expo Push Tokenを取得
  token = (await Notifications.getExpoPushTokenAsync({
    projectId: 'your-project-id', // EAS project ID
  })).data;

  console.log('Expo Push Token:', token);

  // Android固有の設定
  if (Platform.OS === 'android') {
    Notifications.setNotificationChannelAsync('default', {
      name: 'default',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#FF231F7C',
    });
  }

  return token;
}
```

### ステップ5: トークンをバックエンドに保存

```typescript
// utils/api.ts
export async function savePushToken(token: string, userId: string) {
  try {
    const response = await fetch('https://api.example.com/push-tokens', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${authToken}`,
      },
      body: JSON.stringify({
        token,
        userId,
        platform: Platform.OS,
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to save push token');
    }

    return response.json();
  } catch (error) {
    console.error('Error saving push token:', error);
    throw error;
  }
}
```

### ステップ6: 通知の送信（バックエンド）

```javascript
// server.js (Node.js)
const axios = require('axios');

async function sendPushNotification(expoPushToken, title, body, data) {
  const message = {
    to: expoPushToken,
    sound: 'default',
    title: title,
    body: body,
    data: data,
    priority: 'high',
    channelId: 'default',
  };

  try {
    const response = await axios.post(
      'https://exp.host/--/api/v2/push/send',
      message,
      {
        headers: {
          Accept: 'application/json',
          'Accept-encoding': 'gzip, deflate',
          'Content-Type': 'application/json',
        },
      }
    );

    console.log('Push notification sent:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error sending push notification:', error);
    throw error;
  }
}

// 使用例
sendPushNotification(
  'ExponentPushToken[xxxxxxxxxxxxxxxxxxxxxx]',
  '新しいメッセージ',
  'あなたに新しいメッセージが届きました',
  { screen: 'Messages', messageId: '123' }
);
```

### ステップ7: ローカル通知のスケジュール

```typescript
import * as Notifications from 'expo-notifications';

// 即座に通知
export async function scheduleImmediateNotification() {
  await Notifications.scheduleNotificationAsync({
    content: {
      title: "すぐに表示される通知",
      body: 'これはローカル通知です',
      data: { screen: 'Home' },
    },
    trigger: null, // 即座に表示
  });
}

// 5秒後に通知
export async function scheduleDelayedNotification() {
  await Notifications.scheduleNotificationAsync({
    content: {
      title: "遅延通知",
      body: '5秒後に表示されます',
    },
    trigger: {
      seconds: 5,
    },
  });
}

// 毎日午前9時に通知
export async function scheduleDailyNotification() {
  await Notifications.scheduleNotificationAsync({
    content: {
      title: "毎日のリマインダー",
      body: 'おはようございます！',
    },
    trigger: {
      hour: 9,
      minute: 0,
      repeats: true,
    },
  });
}

// すべてのスケジュール通知をキャンセル
export async function cancelAllNotifications() {
  await Notifications.cancelAllScheduledNotificationsAsync();
}
```

## OneSignalの使用

### ステップ1: OneSignalアカウントの作成

1. [OneSignal](https://onesignal.com/)にサインアップ
2. 新しいアプリを作成
3. プラットフォームを設定（iOS、Android）

### ステップ2: SDKのインストール

```bash
npx expo install onesignal-expo-plugin react-native-onesignal
```

### ステップ3: app.jsonの設定

```json
{
  "expo": {
    "plugins": [
      [
        "onesignal-expo-plugin",
        {
          "mode": "development",
          "devTeam": "YOUR_APPLE_DEV_TEAM_ID",
          "iPhoneDeploymentTarget": "13.0"
        }
      ]
    ]
  }
}
```

### ステップ4: 初期化

```typescript
// app/_layout.tsx
import { useEffect } from 'react';
import OneSignal from 'react-native-onesignal';

const ONESIGNAL_APP_ID = 'your-onesignal-app-id';

export default function RootLayout() {
  useEffect(() => {
    // OneSignalを初期化
    OneSignal.setAppId(ONESIGNAL_APP_ID);

    // パーミッションをリクエスト
    OneSignal.promptForPushNotificationsWithUserResponse();

    // 通知受信時のハンドラー
    OneSignal.setNotificationWillShowInForegroundHandler((notificationReceivedEvent) => {
      console.log('OneSignal notification:', notificationReceivedEvent);
      const notification = notificationReceivedEvent.getNotification();
      notificationReceivedEvent.complete(notification);
    });

    // 通知タップ時のハンドラー
    OneSignal.setNotificationOpenedHandler((openedEvent) => {
      console.log('OneSignal notification opened:', openedEvent);
      const { action, notification } = openedEvent;
      // ナビゲーション処理
    });
  }, []);

  return (
    // レイアウトコンポーネント
  );
}
```

### ステップ5: ユーザーの識別

```typescript
// ユーザーIDを設定
OneSignal.setExternalUserId('user-123');

// タグを設定
OneSignal.sendTags({
  user_type: 'premium',
  language: 'ja',
  interests: 'technology',
});

// サブスクリプション状態を確認
const deviceState = await OneSignal.getDeviceState();
console.log('Push enabled:', deviceState.isPushDisabled);
console.log('User ID:', deviceState.userId);
```

## Brazeの使用

### ステップ1: Brazeアカウントの作成

1. [Braze](https://www.braze.com/)にサインアップ
2. 新しいアプリを作成
3. API Keyを取得

### ステップ2: SDKのインストール

```bash
npm install @braze/expo-plugin @braze/react-native-sdk
```

### ステップ3: app.jsonの設定

```json
{
  "expo": {
    "plugins": [
      [
        "@braze/expo-plugin",
        {
          "androidApiKey": "YOUR_ANDROID_API_KEY",
          "iosApiKey": "YOUR_IOS_API_KEY",
          "baseUrl": "YOUR_SDK_ENDPOINT",
          "enableBrazeIosPush": true,
          "enableFirebaseCloudMessaging": true
        }
      ]
    ]
  }
}
```

### ステップ4: 初期化

```typescript
// app/_layout.tsx
import Braze from '@braze/react-native-sdk';

export default function RootLayout() {
  useEffect(() => {
    // アプリ内メッセージを有効化
    Braze.subscribeToInAppMessage((event) => {
      console.log('In-app message received:', event);
    });

    // コンテンツカードを購読
    Braze.subscribeToContentCardsUpdates((update) => {
      console.log('Content cards updated:', update.cards);
    });

    // プッシュ通知を購読
    Braze.subscribeToPushNotificationEvents((event) => {
      console.log('Push notification event:', event);
    });
  }, []);

  return (
    // レイアウトコンポーネント
  );
}
```

### ステップ5: ユーザー属性の設定

```typescript
import Braze from '@braze/react-native-sdk';

// ユーザーIDを設定
Braze.changeUser('user-123');

// ユーザー属性を設定
Braze.setFirstName('John');
Braze.setLastName('Doe');
Braze.setEmail('john@example.com');
Braze.setDateOfBirth(1990, 1, 15);

// カスタム属性を設定
Braze.setCustomUserAttribute('subscription_type', 'premium');
Braze.setCustomUserAttribute('language', 'ja');

// カスタムイベントをログ
Braze.logCustomEvent('purchase_completed', {
  product_id: 'prod-123',
  price: 99.99,
});
```

## Customer.ioの使用

### ステップ1: Customer.ioアカウントの作成

1. [Customer.io](https://customer.io/)にサインアップ
2. 新しいサイトを作成
3. API認証情報を取得

### ステップ2: SDKのインストール

```bash
npm install customerio-reactnative customerio-expo-plugin
```

### ステップ3: app.jsonの設定

```json
{
  "expo": {
    "plugins": [
      [
        "customerio-expo-plugin",
        {
          "android": {
            "googleServicesFile": "./google-services.json"
          }
        }
      ]
    ]
  }
}
```

### ステップ4: 初期化

```typescript
// app/_layout.tsx
import { CustomerIO, CioConfig } from 'customerio-reactnative';

const config: CioConfig = {
  siteId: 'YOUR_SITE_ID',
  apiKey: 'YOUR_API_KEY',
  region: 'US',
};

export default function RootLayout() {
  useEffect(() => {
    CustomerIO.initialize(config);
  }, []);

  return (
    // レイアウトコンポーネント
  );
}
```

### ステップ5: ユーザーの識別とイベント追跡

```typescript
import { CustomerIO } from 'customerio-reactnative';

// ユーザーを識別
CustomerIO.identify('user-123', {
  email: 'user@example.com',
  name: 'John Doe',
  plan: 'premium',
});

// イベントを追跡
CustomerIO.track('purchase_completed', {
  product_id: 'prod-123',
  price: 99.99,
  currency: 'USD',
});

// 画面表示を追跡
CustomerIO.screen('Product Details', {
  product_id: 'prod-123',
});
```

## ベストプラクティス

### 1. パーミッションの適切なタイミング

```typescript
// ✅ 推奨: 価値を提示してからリクエスト
export function OnboardingScreen() {
  const handleEnableNotifications = async () => {
    // ユーザーに利点を説明
    Alert.alert(
      '通知を有効にする',
      '重要な更新やお得な情報を受け取れます',
      [
        { text: 'キャンセル', style: 'cancel' },
        {
          text: '有効にする',
          onPress: async () => {
            await registerForPushNotificationsAsync();
          },
        },
      ]
    );
  };

  return (
    <Button title="通知を有効にする" onPress={handleEnableNotifications} />
  );
}

// ❌ 非推奨: アプリ起動直後にリクエスト
export function AppBad() {
  useEffect(() => {
    registerForPushNotificationsAsync(); // ユーザーに説明なし
  }, []);
}
```

### 2. 通知のセグメンテーション

```typescript
// ユーザーの興味に基づいて通知を送信
const sendSegmentedNotification = async () => {
  const users = await getUsersByInterest('technology');

  for (const user of users) {
    await sendPushNotification(
      user.pushToken,
      '新しいテクノロジー記事',
      'あなたの興味に合った記事が投稿されました',
      { article_id: '123' }
    );
  }
};
```

### 3. 通知頻度の管理

```typescript
// 過度な通知を防ぐ
const canSendNotification = async (userId: string): Promise<boolean> => {
  const lastSent = await getLastNotificationTime(userId);
  const hoursSinceLastSent = (Date.now() - lastSent) / (1000 * 60 * 60);

  // 最後の通知から6時間以内は送信しない
  return hoursSinceLastSent >= 6;
};
```

### 4. ディープリンクの実装

```typescript
import * as Linking from 'expo-linking';
import { useRouter } from 'expo-router';

export default function App() {
  const router = useRouter();

  useEffect(() => {
    const responseListener =
      Notifications.addNotificationResponseReceivedListener((response) => {
        const data = response.notification.request.content.data;

        // 通知のデータに基づいて画面に遷移
        if (data.screen) {
          router.push(data.screen);
        }

        if (data.url) {
          Linking.openURL(data.url);
        }
      });

    return () => {
      Notifications.removeNotificationSubscription(responseListener);
    };
  }, []);

  return (
    // アプリコンテンツ
  );
}
```

## トラブルシューティング

### 問題1: 通知が受信されない

**原因**: パーミッションが許可されていない

**解決策**：
```typescript
// パーミッション状態を確認
const checkPermissions = async () => {
  const { status } = await Notifications.getPermissionsAsync();
  console.log('Permission status:', status);

  if (status !== 'granted') {
    const { status: newStatus } = await Notifications.requestPermissionsAsync();
    console.log('New permission status:', newStatus);
  }
};
```

### 問題2: iOSでトークンが取得できない

**原因**: Apple Developer Accountが正しく設定されていない

**解決策**：
- Bundle Identifierが正しいか確認
- Signing Certificateが有効か確認
- EAS Buildを使用してビルド

### 問題3: Androidで通知が表示されない

**原因**: 通知チャンネルが設定されていない

**解決策**：
```typescript
// Android通知チャンネルを設定
if (Platform.OS === 'android') {
  await Notifications.setNotificationChannelAsync('default', {
    name: 'Default',
    importance: Notifications.AndroidImportance.MAX,
    vibrationPattern: [0, 250, 250, 250],
    lightColor: '#FF231F7C',
    sound: 'default',
  });
}
```

## まとめ

Expoでのプッシュ通知実装は、以下の機能を提供します：

### 利用可能なサービス
- **Expo Push Notifications**: 標準、簡単なセットアップ、無料
- **OneSignal**: 高度なセグメンテーション、A/Bテスト、無料プランあり
- **Braze**: マーケティングオートメーション、アプリ内メッセージ
- **Customer.io**: ユーザー行動ベースの自動化、イベント追跡

### セットアップステップ
1. ライブラリのインストールとConfig Plugin設定
2. パーミッションのリクエスト
3. プッシュトークンの取得と保存
4. 通知ハンドラーの実装
5. バックエンドからの通知送信

### ベストプラクティス
- 適切なタイミングでパーミッションをリクエスト
- 通知のセグメンテーションと個人化
- 通知頻度の管理
- ディープリンクの実装
- 物理デバイスでのテスト

これらのパターンを活用して、ユーザーエンゲージメントを高める効果的なプッシュ通知システムを構築できます。
