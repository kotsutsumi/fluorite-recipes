# WebBrowser

`expo-web-browser`は、システムのWebブラウザへのアクセスを提供するライブラリです。Android、iOS、Webでクロスプラットフォームに対応し、Webページを開いたり、認証セッションを処理したり、ブラウザの操作を管理したりできます。

## プラットフォームの互換性

- Android
- iOS
- Web

## 主な機能

- システムブラウザを使用してWebページを開く
- 認証セッションのサポート
- プラットフォーム間でのリダイレクト処理
- プラットフォーム固有のブラウザコントロール

## インストール

```bash
npx expo install expo-web-browser
```

## 基本的な使用方法

```javascript
import * as WebBrowser from 'expo-web-browser';
import { Button, View } from 'react-native';

export default function App() {
  const handlePress = async () => {
    let result = await WebBrowser.openBrowserAsync('https://expo.dev');
    console.log(result);
  };

  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Button title="ブラウザを開く" onPress={handlePress} />
    </View>
  );
}
```

## API

### `openBrowserAsync(url, options)`

指定されたURLをシステムブラウザで開きます。

#### パラメータ

##### `url` (必須)

- **型**: `string`
- **説明**: 開くURL

```javascript
await WebBrowser.openBrowserAsync('https://expo.dev');
```

##### `options` (オプション)

ブラウザの動作と外観をカスタマイズするオプション。

#### Options

##### `toolbarColor` (Android)

- **型**: `string`
- **説明**: ツールバーの色（16進数形式）

```javascript
await WebBrowser.openBrowserAsync('https://expo.dev', {
  toolbarColor: '#6200EE',
});
```

##### `secondaryToolbarColor` (Android)

- **型**: `string`
- **説明**: セカンダリツールバーの色

```javascript
await WebBrowser.openBrowserAsync('https://expo.dev', {
  secondaryToolbarColor: '#03DAC6',
});
```

##### `controlsColor` (iOS)

- **型**: `string`
- **説明**: コントロール要素の色

```javascript
await WebBrowser.openBrowserAsync('https://expo.dev', {
  controlsColor: '#000000',
});
```

##### `showTitle` (Android)

- **型**: `boolean`
- **デフォルト**: `true`
- **説明**: ページタイトルを表示するかどうか

```javascript
await WebBrowser.openBrowserAsync('https://expo.dev', {
  showTitle: false,
});
```

##### `presentationStyle` (iOS)

- **型**: `string`
- **値**: `'automatic' | 'fullScreen' | 'pageSheet' | 'formSheet' | 'overFullScreen'`
- **説明**: プレゼンテーションスタイル

```javascript
await WebBrowser.openBrowserAsync('https://expo.dev', {
  presentationStyle: 'pageSheet',
});
```

##### `dismissButtonStyle` (iOS)

- **型**: `string`
- **値**: `'done' | 'close' | 'cancel'`
- **説明**: 閉じるボタンのスタイル

```javascript
await WebBrowser.openBrowserAsync('https://expo.dev', {
  dismissButtonStyle: 'close',
});
```

##### `readerMode` (iOS)

- **型**: `boolean`
- **デフォルト**: `false`
- **説明**: リーダーモードを有効にするかどうか

```javascript
await WebBrowser.openBrowserAsync('https://expo.dev', {
  readerMode: true,
});
```

##### `enableBarCollapsing` (Android)

- **型**: `boolean`
- **デフォルト**: `false`
- **説明**: ツールバーの折りたたみを有効にするかどうか

```javascript
await WebBrowser.openBrowserAsync('https://expo.dev', {
  enableBarCollapsing: true,
});
```

##### `showInRecents` (Android)

- **型**: `boolean`
- **デフォルト**: `false`
- **説明**: 最近使ったアプリに表示するかどうか

```javascript
await WebBrowser.openBrowserAsync('https://expo.dev', {
  showInRecents: true,
});
```

##### `windowFeatures` (Web)

- **型**: `string | object`
- **説明**: ウィンドウの機能（サイズ、位置など）

```javascript
await WebBrowser.openBrowserAsync('https://expo.dev', {
  windowFeatures: { width: 800, height: 600 },
});
```

#### 戻り値

`Promise<WebBrowserResult>` - ブラウザの結果を含むオブジェクトを解決するPromise

##### WebBrowserResult

- **type** (`string`) - 結果のタイプ（`'cancel'`、`'dismiss'`など）

```javascript
const result = await WebBrowser.openBrowserAsync('https://expo.dev');
console.log('結果タイプ:', result.type);
```

### `openAuthSessionAsync(url, redirectUrl, options)`

認証セッションを開きます。

#### パラメータ

- **url** (`string`) - 認証URL
- **redirectUrl** (`string`) - リダイレクトURL（オプション）
- **options** (`object`) - オプション設定

```javascript
const result = await WebBrowser.openAuthSessionAsync(
  'https://example.com/auth',
  'myapp://redirect'
);
```

#### 戻り値

`Promise<WebBrowserAuthSessionResult>` - 認証結果を含むオブジェクトを解決するPromise

##### WebBrowserAuthSessionResult

- **type** (`string`) - 結果のタイプ（`'success'`、`'cancel'`など）
- **url** (`string`) - リダイレクトURL（成功時）

```javascript
const result = await WebBrowser.openAuthSessionAsync(
  'https://example.com/auth',
  'myapp://redirect'
);

if (result.type === 'success') {
  console.log('認証URL:', result.url);
}
```

### `dismissBrowser()`

開いているブラウザセッションを閉じます。

```javascript
WebBrowser.dismissBrowser();
```

### `maybeCompleteAuthSession(options)`

Web認証セッションを完了します（主にWeb用）。

#### パラメータ

- **options** (`object`) - オプション設定
  - **skipRedirectCheck** (`boolean`) - リダイレクトチェックをスキップするかどうか

```javascript
WebBrowser.maybeCompleteAuthSession();
```

### `warmUpAsync(browserPackage)` (Android)

ブラウザを事前にウォームアップします。

#### パラメータ

- **browserPackage** (`string`) - ブラウザパッケージ名（オプション）

```javascript
await WebBrowser.warmUpAsync();
```

### `coolDownAsync(browserPackage)` (Android)

ブラウザのウォームアップを解除します。

#### パラメータ

- **browserPackage** (`string`) - ブラウザパッケージ名（オプション）

```javascript
await WebBrowser.coolDownAsync();
```

## プラットフォーム固有の動作

### Android

- Chrome Custom Tabsを使用
- ツールバーのカスタマイズが可能
- ブラウザの事前ウォームアップをサポート

```javascript
await WebBrowser.openBrowserAsync('https://expo.dev', {
  toolbarColor: '#6200EE',
  enableBarCollapsing: true,
  showInRecents: false,
});
```

### iOS

- SFSafariViewControllerまたはASWebAuthenticationSessionを使用
- プレゼンテーションスタイルのカスタマイズが可能
- リーダーモードをサポート

```javascript
await WebBrowser.openBrowserAsync('https://expo.dev', {
  controlsColor: '#000000',
  presentationStyle: 'pageSheet',
  dismissButtonStyle: 'close',
  readerMode: true,
});
```

### Web

- ポップアップウィンドウをサポート
- セキュアオリジン要件（HTTPS）
- ウィンドウサイズとポジションのカスタマイズ

```javascript
await WebBrowser.openBrowserAsync('https://expo.dev', {
  windowFeatures: {
    width: 800,
    height: 600,
    left: 100,
    top: 100,
  },
});
```

## 認証の使用例

### OAuth認証

```javascript
import * as WebBrowser from 'expo-web-browser';

WebBrowser.maybeCompleteAuthSession();

const handleLogin = async () => {
  const authUrl = 'https://example.com/oauth/authorize?client_id=...&redirect_uri=myapp://';

  const result = await WebBrowser.openAuthSessionAsync(
    authUrl,
    'myapp://'
  );

  if (result.type === 'success') {
    // URLからトークンを抽出
    const url = new URL(result.url);
    const token = url.searchParams.get('token');
    console.log('トークン:', token);
  }
};
```

### 外部認証プロバイダー

```javascript
import * as WebBrowser from 'expo-web-browser';
import { makeRedirectUri } from 'expo-auth-session';

const redirectUri = makeRedirectUri({
  scheme: 'myapp',
});

const handleGoogleLogin = async () => {
  const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=...&redirect_uri=${redirectUri}&response_type=token`;

  const result = await WebBrowser.openAuthSessionAsync(
    authUrl,
    redirectUri
  );

  if (result.type === 'success') {
    // 認証成功
    console.log('認証URL:', result.url);
  }
};
```

## カスタムブラウザUI

### Androidのカスタマイズ

```javascript
await WebBrowser.openBrowserAsync('https://expo.dev', {
  toolbarColor: '#6200EE',
  secondaryToolbarColor: '#03DAC6',
  enableBarCollapsing: true,
  showTitle: true,
});
```

### iOSのカスタマイズ

```javascript
await WebBrowser.openBrowserAsync('https://expo.dev', {
  controlsColor: '#007AFF',
  presentationStyle: 'pageSheet',
  dismissButtonStyle: 'done',
  readerMode: false,
});
```

## エラーハンドリング

```javascript
const openBrowserWithErrorHandling = async (url) => {
  try {
    const result = await WebBrowser.openBrowserAsync(url);

    if (result.type === 'cancel') {
      console.log('ユーザーがキャンセルしました');
    } else if (result.type === 'dismiss') {
      console.log('ブラウザが閉じられました');
    }
  } catch (error) {
    console.error('ブラウザのオープンエラー:', error);
    alert('Webページを開けませんでした');
  }
};
```

## ベストプラクティス

1. **セキュリティ**: HTTPSを使用し、信頼できるURLのみを開く
2. **ユーザー体験**: ブラウザを開く前にユーザーに通知
3. **エラーハンドリング**: すべてのエラーケースを適切に処理
4. **認証**: 認証フローには`openAuthSessionAsync`を使用
5. **プラットフォーム対応**: プラットフォーム固有の機能を適切に使用

## よくある使用例

### ヘルプページを開く

```javascript
const openHelp = async () => {
  await WebBrowser.openBrowserAsync('https://myapp.com/help');
};
```

### 利用規約を表示

```javascript
const openTerms = async () => {
  await WebBrowser.openBrowserAsync('https://myapp.com/terms', {
    readerMode: true, // iOS
    toolbarColor: '#6200EE', // Android
  });
};
```

### 外部リンクを開く

```javascript
import { Linking, Platform } from 'react-native';
import * as WebBrowser from 'expo-web-browser';

const openExternalLink = async (url) => {
  if (Platform.OS === 'web') {
    Linking.openURL(url);
  } else {
    await WebBrowser.openBrowserAsync(url);
  }
};
```

## 制限事項

- Webではセキュアオリジン（HTTPS）が必要
- 一部の機能はプラットフォーム固有
- ディープリンクとリダイレクトの処理が必要

## トラブルシューティング

### ブラウザが開かない

1. URLが正しい形式であることを確認
2. HTTPSを使用していることを確認（Webの場合）
3. アプリの権限を確認

### 認証が完了しない

1. リダイレクトURIが正しく設定されているか確認
2. `maybeCompleteAuthSession`を呼び出しているか確認
3. URLスキームが`app.json`に登録されているか確認

## 関連リソース

- [AuthSession](./auth-session/)
- [Linking](https://reactnative.dev/docs/linking)
- [Chrome Custom Tabs (Android)](https://developer.chrome.com/docs/android/custom-tabs/)
- [SFSafariViewController (iOS)](https://developer.apple.com/documentation/safariservices/sfsafariviewcontroller)
