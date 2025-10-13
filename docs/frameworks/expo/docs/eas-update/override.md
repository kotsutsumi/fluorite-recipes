# ランタイムでのアップデート設定のオーバーライド

## オーバーライド方法

### 1. リクエストヘッダーのオーバーライド（SDK 54+）

ランタイムでアップデートチャネルを変更：

```javascript
import * as Updates from 'expo-updates';

// チャネルを切り替え
Updates.setUpdateRequestHeadersOverride({ 'expo-channel-name': 'preview' });
await Updates.fetchUpdateAsync();
await Updates.reloadAsync();
```

**使用ケース**: `default`チャネルから`preview`チャネルへの切り替え

### 2. アップデートURLとヘッダーのオーバーライド（SDK 52+）

特定のアップデートをロードする高度な方法：

```javascript
Updates.setUpdateURLAndRequestHeadersOverride(url, headers);
```

**注意**: アンチブリッキング対策の無効化が必要（本番環境非推奨）

## セキュリティ考慮事項

- アンチブリッキング対策の無効化は潜在的なセキュリティリスクを伴う
- プレビュー/テスト環境でのみ推奨
- 以前のCodePush実装と同様のセキュリティモデル

## 推奨される使用方法

これらのメソッドは、制御されたプレビュー環境でのみ使用することを強く推奨します。
