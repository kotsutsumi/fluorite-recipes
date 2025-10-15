# Constants

アプリのインストール期間中一定のままであるシステム情報を提供するAPIです。

## インストール

```bash
npx expo install expo-constants
```

**バンドルバージョン:** ~18.0.9

## 使用方法

```javascript
import Constants from 'expo-constants';

console.log(Constants.expoConfig);
console.log(Constants.executionEnvironment);
```

## API

```javascript
import Constants from 'expo-constants';
```

## プロパティ

### `Constants.appOwnership`

**型:** `string | null`

アプリの所有権を示します。`expo`、`standalone`、`guest`のいずれかになります。

---

### `Constants.deviceName`

**型:** `string | null`

デバイスのユーザー定義名です。

---

### `Constants.deviceYearClass`

**型:** `number | null`

デバイスの年式クラスを示します。

---

### `Constants.executionEnvironment`

**型:** `ExecutionEnvironment`

アプリの実行環境を示します。

---

### `Constants.expoConfig`

**型:** `ExpoConfig | null`

app.jsonまたはapp.configからのExpo設定オブジェクトです。

---

### `Constants.expoRuntimeVersion`

**型:** `string | null`

Expoランタイムのバージョンです。

---

### `Constants.expoVersion`

**型:** `string | null`

Expoクライアントアプリのバージョンです。

---

### `Constants.installationId`

**型:** `string`

アプリインストールの一意の識別子です。アプリが再インストールされると変更されます。

---

### `Constants.isDetached`

**型:** `boolean | null`

アプリがExpoクライアントから切り離されているかどうかを示します。

---

### `Constants.isDevice`

**型:** `boolean`

アプリが実際のデバイスで実行されているかどうかを示します。シミュレーターやエミュレーターの場合は`false`です。

---

### `Constants.linkingUri`

**型:** `string`

ディープリンクに使用されるURIスキームです。

---

### `Constants.manifest`

**型:** `Manifest | null`

**非推奨:** 代わりに`expoConfig`を使用してください。

アプリのマニフェストオブジェクトです。

---

### `Constants.nativeAppVersion`

**型:** `string | null`

ネイティブアプリのバージョン文字列です。

---

### `Constants.nativeBuildVersion`

**型:** `string | null`

ネイティブアプリのビルドバージョンです。

---

### `Constants.platform`

**型:** `PlatformManifest`

プラットフォーム固有の追加情報です。

---

### `Constants.sessionId`

**型:** `string`

現在のアプリセッションの一意の識別子です。

---

### `Constants.statusBarHeight`

**型:** `number`

デバイスのステータスバーの高さ（ピクセル単位）です。

---

### `Constants.systemFonts`

**型:** `string[]`

デバイスで利用可能なシステムフォントのリストです。

---

### `Constants.systemVersion`

**型:** `string | null`

オペレーティングシステムのバージョンです。

---

### `Constants.webViewUserAgent`

**型:** `string | null`

システムWebViewのユーザーエージェント文字列です。

## メソッド

### `Constants.getWebViewUserAgentAsync()`

システムWebViewのユーザーエージェント文字列を非同期で取得します。

**戻り値**

`Promise<string | null>` - ユーザーエージェント文字列を含むPromiseを返します。

## 型

### `ExecutionEnvironment`

実行環境を表す列挙型です。

```typescript
enum ExecutionEnvironment {
  Bare = 'bare',
  Standalone = 'standalone',
  StoreClient = 'storeClient'
}
```

- **Bare** - 標準のReact Native環境
- **Standalone** - スタンドアロンアプリモード
- **StoreClient** - アプリストア配信モード

### `PlatformManifest`

プラットフォーム固有の情報を表す型です。

```typescript
interface PlatformManifest {
  ios?: {
    buildNumber: string | null;
    platform: string;
    model: string | null;
    userInterfaceIdiom: string;
    systemVersion: string;
  };
  android?: {
    versionCode: number;
  };
  web?: {
    ua: string;
  };
}
```

## 使用例

### デバイス情報の表示

```javascript
import Constants from 'expo-constants';
import { Text, View } from 'react-native';

export default function App() {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>デバイス名: {Constants.deviceName}</Text>
      <Text>システムバージョン: {Constants.systemVersion}</Text>
      <Text>実際のデバイス: {Constants.isDevice ? 'はい' : 'いいえ'}</Text>
      <Text>ステータスバーの高さ: {Constants.statusBarHeight}px</Text>
    </View>
  );
}
```

### Expo設定へのアクセス

```javascript
import Constants from 'expo-constants';

const config = Constants.expoConfig;
console.log('アプリ名:', config?.name);
console.log('スラグ:', config?.slug);
console.log('バージョン:', config?.version);
```

## プラットフォームサポート

- Android
- iOS
- tvOS
- Web
