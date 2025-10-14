# Updates

`expo-updates`は、アプリケーションコードへのリモートアップデートを可能にするライブラリです。開発者がモバイルアプリへのアップデートを管理および配信できるようにします。

## プラットフォームの互換性

- Android
- iOS
- tvOS

## 主な機能

- アプリケーションコードへのリモートアップデートの管理
- アップデートサービスとの通信によるアップデート情報の取得
- 自動および手動のアップデートチェックのサポート
- EAS Updateとの互換性

## インストール

```bash
npx expo install expo-updates
```

## 基本的な設定

### app.json / app.config.js

```json
{
  "expo": {
    "updates": {
      "url": "https://u.expo.dev/[your-project-id]",
      "enabled": true,
      "checkAutomatically": "ON_LOAD",
      "fallbackToCacheTimeout": 0
    },
    "runtimeVersion": {
      "policy": "appVersion"
    }
  }
}
```

## Runtime Versionポリシー

Runtime Versionは、アプリのバージョンとアップデートの互換性を定義します。

### 1. appVersion

プロジェクトの現在のバージョンを使用します。

```json
{
  "runtimeVersion": {
    "policy": "appVersion"
  }
}
```

### 2. nativeVersion

バージョンとビルド番号を組み合わせます。

```json
{
  "runtimeVersion": {
    "policy": "nativeVersion"
  }
}
```

### 3. fingerprint (推奨)

ランタイムバージョンを自動的に計算します。

```json
{
  "runtimeVersion": {
    "policy": "fingerprint"
  }
}
```

## 使用例

### アップデートの確認と適用

```javascript
import * as Updates from 'expo-updates';
import { useEffect } from 'react';
import { Button, View, Text } from 'react-native';

export default function App() {
  useEffect(() => {
    async function checkForUpdates() {
      try {
        const update = await Updates.checkForUpdateAsync();
        if (update.isAvailable) {
          await Updates.fetchUpdateAsync();
          await Updates.reloadAsync();
        }
      } catch (error) {
        alert(`アップデートの取得エラー: ${error}`);
      }
    }
    checkForUpdates();
  }, []);

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>アプリケーション</Text>
    </View>
  );
}
```

### 手動アップデート

```javascript
import * as Updates from 'expo-updates';
import { Button, View } from 'react-native';

export default function UpdateButton() {
  const handleUpdate = async () => {
    try {
      const update = await Updates.checkForUpdateAsync();
      if (update.isAvailable) {
        await Updates.fetchUpdateAsync();
        // ユーザーに通知
        alert('アップデートがダウンロードされました。アプリを再起動します。');
        await Updates.reloadAsync();
      } else {
        alert('アップデートはありません');
      }
    } catch (error) {
      alert(`エラー: ${error.message}`);
    }
  };

  return (
    <View>
      <Button title="アップデートを確認" onPress={handleUpdate} />
    </View>
  );
}
```

## API

### `checkForUpdateAsync()`

利用可能なアップデートを確認します。

#### 戻り値

`Promise<UpdateCheckResult>` - アップデート情報を含むオブジェクトを解決するPromise

```javascript
const { isAvailable, manifest } = await Updates.checkForUpdateAsync();
```

### `fetchUpdateAsync()`

利用可能なアップデートをダウンロードします。

#### 戻り値

`Promise<UpdateFetchResult>` - ダウンロード結果を解決するPromise

```javascript
const result = await Updates.fetchUpdateAsync();
```

### `reloadAsync()`

新しいアップデートでアプリをリロードします。

#### 戻り値

`Promise<void>` - リロードが開始されたときに解決するPromise

```javascript
await Updates.reloadAsync();
```

### `useUpdates()`

アップデート状態を管理するためのReact Hook。

#### 戻り値

アップデート情報を含むオブジェクト

```javascript
const {
  currentlyRunning,
  isUpdateAvailable,
  isUpdatePending,
} = Updates.useUpdates();
```

## 重要な定数

### `Updates.isEnabled`

アップデートが有効かどうかを示すブール値。

```javascript
if (Updates.isEnabled) {
  // アップデート機能を実行
}
```

### `Updates.updateId`

現在のアップデートの一意の識別子。

```javascript
const currentUpdateId = Updates.updateId;
```

### `Updates.runtimeVersion`

現在のランタイムバージョン。

```javascript
const version = Updates.runtimeVersion;
```

### `Updates.channel`

現在のアップデートチャネル。

```javascript
const channel = Updates.channel;
```

## 設定オプション

### checkAutomatically

アップデートを自動的に確認するタイミングを設定します。

- **ON_LOAD**: アプリの起動時（デフォルト）
- **ON_ERROR_RECOVERY**: エラー後
- **WIFI_ONLY**: WiFi接続時のみ
- **NEVER**: 手動のみ

```json
{
  "updates": {
    "checkAutomatically": "ON_LOAD"
  }
}
```

### fallbackToCacheTimeout

アップデートのタイムアウト時間（ミリ秒）。

```json
{
  "updates": {
    "fallbackToCacheTimeout": 30000
  }
}
```

### codeSigningCertificate

コード署名証明書のパス（セキュリティ強化用）。

```json
{
  "updates": {
    "codeSigningCertificate": "./path/to/certificate.pem",
    "codeSigningMetadata": {
      "keyid": "main",
      "alg": "rsa-v1_5-sha256"
    }
  }
}
```

## テスト

### 開発環境でのテスト

アップデート機能のほとんどのメソッドは、リリースビルドでのみ動作します。

```javascript
if (__DEV__) {
  console.log('開発モードではアップデートは無効です');
} else {
  // アップデート機能を実行
}
```

### EAS Updateを使用したテスト

1. EAS Updateを設定
2. アップデートを公開
3. リリースビルドでテスト

```bash
# アップデートを公開
eas update --branch production --message "バグ修正"
```

## ベストプラクティス

1. **ユーザー体験を考慮**: アップデートのダウンロード中にローディングインジケーターを表示
2. **エラーハンドリング**: ネットワークエラーや失敗を適切に処理
3. **段階的なロールアウト**: 最初は小規模なユーザーグループでテスト
4. **バックアップ戦略**: 問題が発生した場合のロールバック計画を用意
5. **通知**: 重要なアップデートをユーザーに通知
6. **テスト**: 本番環境に展開する前に十分にテスト

## イベントリスナー

### アップデートイベント

```javascript
import * as Updates from 'expo-updates';

// アップデートが利用可能になったときに通知
Updates.addListener((event) => {
  if (event.type === Updates.UpdateEventType.UPDATE_AVAILABLE) {
    console.log('アップデートが利用可能です');
  }
  if (event.type === Updates.UpdateEventType.ERROR) {
    console.error('アップデートエラー:', event.message);
  }
});
```

## トラブルシューティング

### アップデートが適用されない

1. `Updates.isEnabled`が`true`であることを確認
2. リリースビルドを使用していることを確認
3. ランタイムバージョンの互換性を確認
4. ネットワーク接続を確認

### エラーハンドリング

```javascript
try {
  const update = await Updates.checkForUpdateAsync();
  if (update.isAvailable) {
    await Updates.fetchUpdateAsync();
    await Updates.reloadAsync();
  }
} catch (error) {
  if (error.code === 'ERR_UPDATES_DISABLED') {
    console.log('アップデートが無効です');
  } else if (error.code === 'ERR_UPDATES_CHECK') {
    console.log('アップデートの確認に失敗しました');
  } else {
    console.error('予期しないエラー:', error);
  }
}
```

## 関連リソース

- [EAS Update](https://docs.expo.dev/eas-update/introduction/)
- [Runtime Version](https://docs.expo.dev/eas-update/runtime-versions/)
- [アップデート戦略](https://docs.expo.dev/eas-update/deployment-patterns/)
