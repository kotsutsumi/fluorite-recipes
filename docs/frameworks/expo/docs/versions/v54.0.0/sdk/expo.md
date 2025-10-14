---
title: 博覧会
description: Expo および関連パッケージの一般的なメソッドとタイプのセット。
sourceCodeUrl: 'https://github.com/expo/expo/tree/sdk-54/packages/expo'
packageName: 'expo'
iconUrl: '/static/images/packages/expo.png'
platforms: ['android', 'ios', 'tvos', 'web']
---

import APISection from '~/components/plugins/APISection';
import { APIInstallSection } from '~/components/plugins/InstallSection';
import { Collapsible } from '~/ui/components/Collapsible';
import { CODE } from '~/ui/components/Text';

## インストール

<APIInstallSection hideBareInstructions />

## API

```tsx
import * as Expo from 'expo';
```

### `expo/fetch` API

`expo/fetch` は、Web 環境とモバイル環境全体で一貫して動作する [WinterCG 準拠の Fetch API](https://fetch.spec.Wintercg.org/) を提供し、Expo アプリケーション内で標準化されたクロスプラットフォームのフェッチ エクスペリエンスを保証します。

```ts Streaming fetch
import { fetch } from 'expo/fetch';

const resp = await fetch('https://httpbin.org/drip?numbytes=512&duration=2', {
  headers: { Accept: 'text/event-stream' },
});
const reader = resp.body.getReader();
const chunks = [];
while (true) {
  const { done, value } = await reader.read();
  if (done) {
    break;
  }
  chunks.push(value);
}
const buffer = new Uint8Array(chunks.reduce((acc, chunk) => acc + chunk.length, 0));
console.log(buffer.length); // 512
```

### エンコーディング API

`TextEncoder` および `TextDecoder` は、さまざまな文字エンコーディングでテキストをエンコードおよびデコードする方法を提供する組み込み API です。すべてのプラットフォームで利用できます。 Web および Node.js については、[ブラウザーとサーバー ランタイムのサポート](https://caniuse.com/textencoder) を参照してください。

```ts TextEncoder and TextDecoder
// [104, 101, 108, 108, 111]
const hello = new TextEncoder().encode('hello');

// "hello"
const text = new TextDecoder().decode(hello);
```

`TextEncoder` API は、Hermes エンジンに含まれています。 [Hermes GitHub リポジトリ内の TextEncoder.cpp のソース コード](https://github.com/facebook/hermes/blob/9e2bbf8eda15936ee00aee4f8e024ceaa7cd800d/lib/VM/JSLib/TextEncoder.cpp#L1) を参照してください。

`TextDecoder` API は、ネイティブ プラットフォームでは [仕様準拠](https://encoding.spec.whatwg.org/#textdecoder) ではありません。 UTF-8 エンコードのみがサポートされています。より多くのエンコーディングのサポートが必要な場合は、[`text-encoding`](https://www.npmjs.com/package/text-encoding) のようなポリフィルを使用してください。

これらの API に相当するストリームの `TextEncoderStream` および `TextDecoderStream` も、すべてのプラットフォームで利用できます。これらを使用すると、テキストをストリーミング方式でエンコードおよびデコードできるため、一度にすべてをメモリにロードせずに大量のデータを処理する場合に役立ちます。

```ts TextEncoderStream
const encoder = new TextEncoderStream();
const stream = new ReadableStream({
  start(controller) {
    controller.enqueue('Hello');
    controller.enqueue('World');
    controller.close();
  },
});
const reader = stream.pipeThrough(encoder).getReader();
reader.read().then(({ done, value }) => {
  console.log(value); // Uint8Array [72, 101, 108, 108, 111]
});
```

### ストリーム API

標準 Web ストリームのグローバル サポートは、Web プラットフォームとサーバー プラットフォームの動作に合わせてネイティブ プラットフォームで利用できます。特定の Web および Node.js サポートについては、[ブラウザーおよびサーバー ランタイム サポート](https://caniuse.com/streams) を参照してください。 EAS ホスティング サーバー ランタイムには、標準 Web ストリーム API のサポートも含まれています。

`ReadableStream`、`WritableStream`、および `TransformStream` クラスにグローバルにアクセスします。

```js ReadableStream
const stream = new ReadableStream({
  start(controller) {
    controller.enqueue('Hello');
    controller.enqueue('World');
    controller.close();
  },
});
const reader = stream.getReader();
reader.read().then(({ done, value }) => {
  console.log(value); // Hello
});
reader.read().then(({ done, value }) => {
  console.log(value); // World
});
```

### URL API

`URL` は、すべてのプラットフォームで標準 API を提供します。

ネイティブ プラットフォームでは、組み込みの `URL` および `URLSearchParams` 実装が `react-native` の shim を置き換えます。 Web および Node.js については、[ブラウザーおよびサーバー ランタイムのサポート](https://caniuse.com/url) を参照してください。

```ts URL and URLSearchParams
const url = new URL('https://expo.dev');

const params = new URLSearchParams();
```

Expo の組み込み `URL` サポートは、完全に [仕様に準拠](https://developer.mozilla.org/en-US/docs/Web/API/URL) するよう努めます。唯一の例外は、ネイティブ プラットフォームがホスト名で [非 ASCII 文字](https://unicode.org/reports/tr46/) を現在サポートしていないことです。

```ts Non-ASCII characters
console.log(new URL('http://🥓').toString());

// This outputs the following:
// - Web, Node.js: http://xn--pr9h/
// - Android, iOS: http://🥓/
```

<APISection packageName="expo" />

## よくある質問

プロジェクトでの `expo` パッケージの使用に関するよくある質問。

<Collapsible summary={<><CODE>rootRegisterComponent</CODE> setup for existing React Native projects</>}>

React Native プロジェクトのネイティブ ディレクトリ (**android** および **ios**) を手動で管理している場合は、以下の手順に従って `registerRootComponent` 関数を設定する必要があります。これは、Expo モジュールが正しく動作するために必要です。

**アンドロイド**

`getMainComponentName` 関数で `main` という名前を使用するように **android/app/src/main/your-package/MainActivity.java** ファイルを更新します。

```diff android/app/src/main/your-package/MainActivity.java
  @Override
  protected String getMainComponentName() {
+    return "main";
  }
```

**iOS**

`application:didFinishLaunchingWithOptions:` 関数の `createRootViewWithBridge:bridge moduleName:@"main" initialProperties:initProps` 行で **moduleName** `main` を使用するように iOS **ios/your-project/AppDelegate.(m|mm|swift)** ファイルを更新します。

</Collapsible>

<Collapsible summary="メイン アプリ ファイルに App.js または app/_layout.tsx 以外の名前を付けたい場合はどうすればよいですか?">

**[Expo Router](/router/introduction/)** を使用しないプロジェクトの場合は、**package.json** の `"main"` をプロジェクト内の任意のファイルに設定できます。これを行う場合は、`registerRootComponent` を使用する必要があります。カスタム エントリ ファイルを使用している場合、`export default` はこのコンポーネントをアプリのルートにしません。

たとえば、**src/main.jsx** をアプリのエントリ ファイルにするとします。もしかしたら、プロジェクトのルートに JavaScript ファイルを置くことを好まないかもしれません。まず、**package.json** でこれを設定します。

```json package.json
{
  "main": "src/main.jsx"
}
```

次に、**src/main.jsx** で、必ず `registerRootComponent` を呼び出し、アプリのルートでレンダリングするコンポーネントを渡します。

```jsx src/main.jsx
import { registerRootComponent } from 'expo';
import { View } from 'react-native';

function App() {
  return <View />;
}

registerRootComponent(App);
```

**[Expo Router](/router/introduction/)** を使用するプロジェクトの場合、[Expo Router のインストール ガイド](/router/installation/#custom-entry-point-to-initialize-and-load) の次の手順に従ってカスタム エントリ ポイントを作成できます。 Expo Router プロジェクトで最上位の **src** ディレクトリを使用する場合の詳細については、[src ディレクトリ リファレンス](/router/reference/src-directory/) を参照してください。

</Collapsible>
