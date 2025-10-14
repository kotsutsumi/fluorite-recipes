# react-native-webview

`react-native-webview` は、ネイティブビュー内でWebコンテンツをレンダリングするためのReact Nativeライブラリです。

## 概要

- AndroidとiOSをサポート
- 現在のバンドルバージョン: 13.15.0

## インストール

```bash
npx expo install react-native-webview
```

## 基本的な使用例

### Web URLの読み込み

```javascript
import { WebView } from 'react-native-webview';

export default function App() {
  return (
    <WebView
      style={styles.container}
      source={{ uri: 'https://expo.dev' }}
    />
  );
}
```

### インラインHTMLのレンダリング

```javascript
import { WebView } from 'react-native-webview';

export default function App() {
  return (
    <WebView
      style={styles.container}
      originWhitelist={['*']}
      source={{ html: '<h1><center>Hello world</center></h1>' }}
    />
  );
}
```

## 主な機能

### URLの読み込み

外部のWebサイトやWebアプリケーションをアプリ内で表示できます。

```javascript
<WebView source={{ uri: 'https://example.com' }} />
```

### HTMLコンテンツのレンダリング

HTMLコンテンツを直接レンダリングできます。

```javascript
<WebView
  originWhitelist={['*']}
  source={{ html: '<h1>カスタムHTML</h1>' }}
/>
```

### JavaScriptの実行

WebView内でJavaScriptコードを実行できます。

```javascript
<WebView
  source={{ uri: 'https://example.com' }}
  injectedJavaScript={`
    console.log('Hello from WebView!');
    true;
  `}
/>
```

## 主なプロパティ

### source

表示するコンテンツのソース:

- `{ uri: 'https://...' }`: Web URL
- `{ html: '...' }`: HTMLコンテンツ

### originWhitelist

許可するオリジンのリスト。デフォルトは `['http://*', 'https://*']`。

### injectedJavaScript

ページ読み込み時に実行されるJavaScriptコード。

### onMessage

WebViewからReact Nativeへメッセージを送信する際のハンドラー。

```javascript
<WebView
  onMessage={(event) => {
    console.log(event.nativeEvent.data);
  }}
/>
```

## 高度な使用例

### WebViewとReact Native間の通信

```javascript
import { WebView } from 'react-native-webview';
import { useState } from 'react';

export default function App() {
  const [message, setMessage] = useState('');

  return (
    <WebView
      source={{ uri: 'https://example.com' }}
      onMessage={(event) => {
        setMessage(event.nativeEvent.data);
      }}
      injectedJavaScript={`
        window.ReactNativeWebView.postMessage('Hello from WebView!');
        true;
      `}
    />
  );
}
```

## その他のリソース

- [公式ドキュメント](https://github.com/react-native-webview/react-native-webview/blob/master/docs/Guide.md) - 詳細なガイド
- [GitHub Repository](https://github.com/react-native-webview/react-native-webview) - ソースコードとissue
- [npm Package](https://www.npmjs.com/package/react-native-webview) - パッケージ情報

## 概要

このドキュメントは、React NativeアプリケーションにWebViewを統合するための簡単なガイドを提供しています。WebViewを使用することで、既存のWebコンテンツやWebアプリケーションをネイティブアプリに簡単に組み込むことができます。
