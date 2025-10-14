# Notifications

ローカル通知とプッシュ通知のスケジュール、管理、および処理を行うライブラリです。

## インストール

```bash
npx expo install expo-notifications
```

## 主な機能

- ローカル通知とプッシュ通知のスケジュール
- iOSとAndroid向けのプッシュトークンの取得
- 通知権限の管理
- 通知インタラクションの処理
- カテゴリを使用したインタラクティブ通知の作成
- 通知チャンネルのカスタマイズ（Android）

## プラットフォーム

- Android（実機のみ）
- iOS（実機のみ）

## 基本的な使用例

```javascript
import * as Notifications from 'expo-notifications';

// 通知ハンドラーの設定
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false
  })
});

// 通知のスケジュール
async function scheduleNotification() {
  await Notifications.scheduleNotificationAsync({
    content: {
      title: "通知タイトル",
      body: "通知本文"
    },
    trigger: {
      seconds: 60 // 1分後にトリガー
    }
  });
}
```

## 重要な注意事項

- プッシュ通知には開発ビルドが必要です
- ローカル通知はExpo Goで動作します
- 完全な機能を使用するには設定が必要です

## 主要なAPI

### 通知のスケジュール

`scheduleNotificationAsync()`メソッドを使用して通知をスケジュールします：

```javascript
await Notifications.scheduleNotificationAsync({
  content: {
    title: "タイトル",
    body: "本文",
    data: { key: 'value' }
  },
  trigger: {
    seconds: 60
  }
});
```

### 通知権限

通知権限を要求し、管理します：

```javascript
const { status } = await Notifications.requestPermissionsAsync();
if (status !== 'granted') {
  alert('通知権限が必要です！');
}
```

### プッシュトークンの取得

プッシュ通知用のトークンを取得します：

```javascript
const token = await Notifications.getExpoPushTokenAsync({
  projectId: 'your-project-id'
});
console.log(token);
```

### 通知リスナー

通知を受信したとき、またはユーザーが通知を操作したときにリスナーを設定します：

```javascript
// 通知受信リスナー
Notifications.addNotificationReceivedListener(notification => {
  console.log('通知を受信:', notification);
});

// 通知応答リスナー
Notifications.addNotificationResponseReceivedListener(response => {
  console.log('ユーザーが通知を操作:', response);
});
```

## 設定

### Android

Android用に通知チャンネルを設定します：

```javascript
await Notifications.setNotificationChannelAsync('default', {
  name: 'default',
  importance: Notifications.AndroidImportance.MAX,
  vibrationPattern: [0, 250, 250, 250],
  lightColor: '#FF231F7C',
});
```

### iOS

iOSの場合、`app.json`で通知設定を構成します：

```json
{
  "expo": {
    "plugins": [
      [
        "expo-notifications",
        {
          "sounds": ["./assets/notification-sound.wav"]
        }
      ]
    ]
  }
}
```

## ベストプラクティス

1. **権限を早期に要求**: アプリの起動時に通知権限を要求します
2. **通知ハンドラーの設定**: アプリがフォアグラウンドにあるときの通知の動作を定義します
3. **リスナーのクリーンアップ**: コンポーネントのアンマウント時にリスナーを削除します
4. **エラー処理**: 通知操作を適切なエラー処理でラップします

## トラブルシューティング

- **プッシュ通知が届かない**: 開発ビルドを使用していることを確認し、適切な権限が付与されていることを確認してください
- **ローカル通知が表示されない**: 通知権限が付与されていること、および通知ハンドラーが正しく設定されていることを確認してください
- **バックグラウンドでの問題**: バックグラウンドモードが適切に設定されていることを確認してください（iOSの場合）

このライブラリは、プラットフォーム全体で通知を処理するための包括的なインターフェースを提供します。
