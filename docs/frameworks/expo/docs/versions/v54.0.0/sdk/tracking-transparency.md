# TrackingTransparency

`expo-tracking-transparency`は、アプリのトラッキング権限を管理するためのライブラリです。広告識別子へのアクセスとトラッキング同意メカニズムを提供し、主にiOSデバイスを対象としています。

## プラットフォームの互換性

- Android
- iOS

## 主な機能

- ユーザーのトラッキング権限の管理
- 広告識別子の取得
- iOS 14.5以降のトラッキング透明性要件への対応

## インストール

```bash
npx expo install expo-tracking-transparency
```

## 基本的な使用方法

```javascript
import { useEffect } from 'react';
import { requestTrackingPermissionsAsync } from 'expo-tracking-transparency';

export default function App() {
  useEffect(() => {
    (async () => {
      const { status } = await requestTrackingPermissionsAsync();
      if (status === 'granted') {
        console.log('ユーザーがデータトラッキングの許可を付与しました');
      }
    })();
  }, []);

  return (
    // アプリのコンテンツ
  );
}
```

## API

### `getAdvertisingId()`

デバイスの広告IDを取得します。

#### 戻り値

`Promise<string>` - 広告IDを解決するPromise

### `requestTrackingPermissionsAsync()`

ユーザーにトラッキング権限を要求します。

#### 戻り値

`Promise<PermissionResponse>` - 権限のステータスを含むオブジェクトを解決するPromise

#### PermissionResponse

- **status** (`PermissionStatus`) - 権限のステータス（`granted`、`denied`、`undetermined`など）
- **expires** (`string`) - 権限の有効期限（該当する場合）
- **granted** (`boolean`) - 権限が付与されているかどうか
- **canAskAgain** (`boolean`) - 再度権限を要求できるかどうか

### `getTrackingPermissionsAsync()`

現在のトラッキング権限のステータスを確認します。

#### 戻り値

`Promise<PermissionResponse>` - 権限のステータスを含むオブジェクトを解決するPromise

## 設定

`app.json`に以下を追加します:

```json
{
  "expo": {
    "plugins": [
      [
        "expo-tracking-transparency",
        {
          "userTrackingPermission": "この識別子は、パーソナライズされた広告を配信するために使用されます。"
        }
      ]
    ]
  }
}
```

### 設定プロパティ

#### `userTrackingPermission` (string)

iOSの`NSUserTrackingUsageDescription`に表示されるメッセージ。ユーザーにトラッキングの目的を説明します。

## プラットフォーム固有の注意事項

### iOS

- iOS 14.5以降では、`NSUserTrackingUsageDescription`がInfo.plistに必要です
- この権限要求は、アプリがユーザーや他社のアプリやWebサイトでのユーザーのアクティビティをトラッキングするために必要です

### Android

- `com.google.android.gms.permission.AD_ID`権限が追加されます
- Android 12以降では、この権限により広告IDへのアクセスが可能になります

## ベストプラクティス

1. **透明性**: トラッキングの目的をユーザーに明確に説明してください
2. **タイミング**: 適切なタイミングで権限を要求してください（アプリ起動直後ではなく、コンテキストがある時）
3. **代替手段**: トラッキングが拒否された場合の代替機能を提供してください
4. **プライバシー**: ユーザーのプライバシー設定を尊重してください

## 重要な注意事項

- トラッキング権限が拒否された場合でも、アプリは正常に動作する必要があります
- 広告識別子は、ユーザーがトラッキングを許可した場合にのみ利用可能です
- すべてのプラットフォームでユーザーのプライバシー設定を尊重してください
- App Storeのレビューガイドラインに準拠してください

## トラッキングステータス

### PermissionStatus値

- **granted**: ユーザーがトラッキングを許可しました
- **denied**: ユーザーがトラッキングを拒否しました
- **undetermined**: ユーザーにまだ尋ねていません
- **restricted**: トラッキングが制限されています（ペアレンタルコントロールなど）

## 関連リソース

- [Appleのトラッキング透明性ガイドライン](https://developer.apple.com/app-store/user-privacy-and-data-use/)
- [Googleの広告IDポリシー](https://support.google.com/googleplay/android-developer/answer/6048248)
