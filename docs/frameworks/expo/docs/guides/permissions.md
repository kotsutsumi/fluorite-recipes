# パーミッション

ネイティブアプリで機密性の高いデバイス情報（位置情報や連絡先など）へのアクセスが必要な場合、アプリは最初にユーザーの許可を求める必要があります。

## Androidパーミッション

パーミッションは、アプリ設定の`android.permissions`と`android.blockedPermissions`を使用して設定します。

### パーミッションの追加

```json
{
  "android": {
    "permissions": ["android.permission.SCHEDULE_EXACT_ALARM"]
  }
}
```

### 重要なポイント

#### 自動追加

ほとんどのパーミッションは、ライブラリによって自動的に追加されます。

#### パーミッションの削除

不要なパーミッションを削除するには、`android.blockedPermissions`を使用します：

```json
{
  "android": {
    "blockedPermissions": [
      "android.permission.ACCESS_FINE_LOCATION"
    ]
  }
}
```

### Androidパーミッションのベストプラクティス

- **最小限のパーミッション**: アプリに必要な最小限のパーミッションのみをリクエスト
- **実行時リクエスト**: 危険なパーミッションは実行時にリクエスト
- **説明の提供**: パーミッションが必要な理由をユーザーに説明

## iOSパーミッション

iOSでは、`ios.infoPlist`を使用してパーミッションメッセージを設定します。

### 基本的な設定

```json
{
  "ios": {
    "infoPlist": {
      "NSCameraUsageDescription": "このアプリは、イベントチケットのバーコードをスキャンするためにカメラを使用します。"
    }
  }
}
```

### 一般的なiOSパーミッション

| キー | 説明 |
|-----|------|
| `NSCameraUsageDescription` | カメラアクセス |
| `NSMicrophoneUsageDescription` | マイクアクセス |
| `NSPhotoLibraryUsageDescription` | 写真ライブラリアクセス |
| `NSLocationWhenInUseUsageDescription` | 使用中の位置情報アクセス |
| `NSLocationAlwaysUsageDescription` | 常時位置情報アクセス |
| `NSContactsUsageDescription` | 連絡先アクセス |
| `NSCalendarsUsageDescription` | カレンダーアクセス |
| `NSRemindersUsageDescription` | リマインダーアクセス |
| `NSMotionUsageDescription` | モーションと フィットネスアクセス |

### 設定プラグインを使用した設定

設定プラグインを通じてパーミッションを設定することもできます：

```json
{
  "plugins": [
    [
      "expo-media-library",
      {
        "photosPermission": "$(PRODUCT_NAME)が写真にアクセスすることを許可します。",
        "savePhotosPermission": "$(PRODUCT_NAME)が写真を保存することを許可します。"
      }
    ]
  ]
}
```

## Webパーミッション

Webパーミッションは、セキュアなコンテキスト（https://またはlocalhost）からのみリクエストできます。

### 一般的なWebパーミッション

- **位置情報**: Geolocation API
- **カメラ/マイク**: MediaDevices API
- **通知**: Notifications API
- **クリップボード**: Clipboard API

## パーミッションのリセット

異なるパーミッションシナリオをテストするには：

### ネイティブアプリ

アプリをアンインストールして再インストールします。

### Expo Go

1. Expo Goからアプリを削除
2. `npx expo start`を実行して再インストール

## 注意事項

> **警告**: 不適切に設定されたパーミッションは、App Storeの審査で却下される可能性があります。

### パーミッションの説明

パーミッションの説明は以下のようにしてください：

- **明確で具体的**: パーミッションが必要な理由を具体的に説明
- **ユーザーフレンドリー**: 技術的な用語を避け、わかりやすい言葉を使用
- **正直**: 実際の使用目的を正直に伝える

## まとめ

パーミッションは、ユーザーのプライバシーを保護する重要な仕組みです。適切に設定し、ユーザーに明確な説明を提供することで、信頼性の高いアプリを構築できます。
