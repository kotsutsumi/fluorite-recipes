# iOSの機能

EAS Buildでサポートされている組み込みのiOS機能と、それらを有効または無効にする方法について学びます。

* * *

iOSのエンタイトルメントを変更すると、本番ビルドを作成する前に、この変更をAppleのサーバーでリモートで更新する必要があります。EAS Buildは、`eas build`を実行すると、ローカルのエンタイトルメント設定とApple Developer Console上の機能を自動的に同期します。機能は、Appleが提供するWebサービスで、AWSやFirebaseサービスのようなものと考えてください。

> この機能は`EXPO_NO_CAPABILITY_SYNC=1 eas build`で無効にできます

## エンタイトルメント

Expoアプリでは、エンタイトルメントはイントロスペクトされたapp configから読み取られます。編集するには、app configファイルの[`ios.entitlements`](/versions/latest/config/app#entitlements)フィールドを参照してください。イントロスペクトされた設定を見るには、プロジェクトで`npx expo config --type introspect`を実行し、結果の`ios.entitlements`オブジェクトを確認してください。

bare React Nativeアプリでは、エンタイトルメントはios/\*\*/\*.entitlementsファイルから読み取られます。

## 有効化

サポートされているエンタイトルメントがエンタイトルメントファイルに存在する場合、`eas build`を実行するとApple Developer Consoleで有効になります。機能がすでに有効になっている場合、EAS Buildはスキップします。

## 無効化

アプリでリモートで機能が有効になっているが、ネイティブエンタイトルメントファイルに存在しない場合、`eas build`を実行すると自動的に無効になります。

## サポートされている機能

EAS Buildは、組み込みサポートがある機能のみを有効にします。サポートされていないエンタイトルメントは、[Apple Developer Console](https://developer.apple.com/account/resources/identifiers/list)を介して手動で有効にする必要があります。

### サポートされている機能の一覧

- **Wi-Fi Information**: `com.apple.developer.networking.wifi-info`
- **App Attest**: `com.apple.developer.devicecheck.appattest-environment`
- **App Groups**: `com.apple.security.application-groups`
- **Apple Pay**: `com.apple.developer.in-app-payments`
- **Associated Domains**: `com.apple.developer.associated-domains`
- **AutoFill Credential Provider**: `com.apple.developer.authentication-services.autofill-credential-provider`
- **ClassKit**: `com.apple.developer.ClassKit-environment`
- **Communication Notifications**: `com.apple.developer.usernotifications.communication`
- **Data Protection**: `com.apple.developer.default-data-protection`
- **Family Controls**: `com.apple.developer.family-controls`
- **Game Center**: `com.apple.developer.game-center`
- **HealthKit**: `com.apple.developer.healthkit`
- **HomeKit**: `com.apple.developer.homekit`
- **Hotspot**: `com.apple.developer.networking.HotspotConfiguration`
- **iCloud**: `com.apple.developer.icloud-services`
- **In-App Purchase**: `com.apple.developer.in-app-payments`
- **Inter-App Audio**: `inter-app-audio`
- **Maps**: `com.apple.developer.maps`
- **Multipath**: `com.apple.developer.networking.multipath`
- **Network Extensions**: `com.apple.developer.networking.networkextension`
- **NFC Tag Reading**: `com.apple.developer.nfc.readersession.formats`
- **Personal VPN**: `com.apple.developer.networking.vpn.api`
- **Push Notifications**: `aps-environment`
- **Sign In with Apple**: `com.apple.developer.applesignin`
- **SiriKit**: `com.apple.developer.siri`
- **System Extension**: `com.apple.developer.system-extension.install`
- **Time Sensitive Notifications**: `com.apple.developer.usernotifications.time-sensitive`
- **Wallet**: `com.apple.developer.pass-type-identifiers`
- **WeatherKit**: `com.apple.developer.weatherkit`

## 機能識別子

Merchant ID、App Group、CloudKit Containerはすべて自動的に登録され、アプリに割り当てられます。これらの割り当てにはApple cookiesの認証が必要です。

### App Groupsの設定例

```json
{
  "ios": {
    "entitlements": {
      "com.apple.security.application-groups": [
        "group.com.example.myapp"
      ]
    }
  }
}
```

### Push Notificationsの設定例

```json
{
  "ios": {
    "entitlements": {
      "aps-environment": "production"
    }
  }
}
```

## トラブルシューティング

機能の同期に問題がある場合：

1. Apple Developer Consoleで機能が正しく設定されていることを確認
2. エンタイトルメントファイルの構文が正しいことを確認
3. `eas build`を再実行して同期を試行
4. 必要に応じて、環境変数`EXPO_NO_CAPABILITY_SYNC=1`で自動同期を無効にして手動設定

このドキュメントは、EAS BuildでiOSの機能を管理するための完全なリファレンスを提供します。
