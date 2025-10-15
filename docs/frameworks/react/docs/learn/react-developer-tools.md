# React Developer Tools

React Developer Tools を使うことで、React の[コンポーネント](/learn/your-first-component)を調査し、[props](/learn/passing-props-to-a-component) や [state](/learn/state-a-components-memory) を編集し、パフォーマンスの問題を特定できます。

## このページで学ぶこと

- React Developer Tools をインストールする方法

## ブラウザ拡張機能

React を使ったウェブサイトをデバッグする最も簡単な方法は、React Developer Tools というブラウザ拡張機能をインストールすることです。これは複数の人気のブラウザで利用可能です：

- [**Chrome** 用にインストール](https://chrome.google.com/webstore/detail/react-developer-tools/fmkadmapgofadopljbjfkapdkoienihi?hl=en)
- [**Firefox** 用にインストール](https://addons.mozilla.org/en-US/firefox/addon/react-devtools/)
- [**Edge** 用にインストール](https://microsoftedge.microsoft.com/addons/detail/react-developer-tools/gpphkfbcpidddadnkolkpfckpihlkkil)

これで、**React で構築されたウェブサイト**を訪れると、_Components_ と _Profiler_ パネルが表示されるようになります。

![React Developer Tools 拡張機能](/images/docs/react-devtools-extension.png)

### Safari および他のブラウザ

他のブラウザ（例えば Safari）の場合、[`react-devtools`](https://www.npmjs.com/package/react-devtools) の npm パッケージをインストールします：

```bash
# Yarn
yarn global add react-devtools

# Npm
npm install -g react-devtools
```

次に、ターミナルから開発者ツールを開きます：

```bash
react-devtools
```

次に、ウェブサイトの `<head>` の先頭に次の `<script>` タグを追加して、ウェブサイトを接続します：

```html {3}
<html>
  <head>
    <script src="http://localhost:8097"></script>
  </head>
  <body>
    <!-- ... -->
  </body>
</html>
```

ブラウザでウェブサイトを再読み込みして、開発者ツールで表示します。

![React Developer Tools スタンドアロン](/images/docs/react-devtools-standalone.png)

## モバイル（React Native）

[React Native](https://reactnative.dev/) で構築されたアプリを調査するには、React Developer Tools と緊密に統合された [React Native DevTools](https://reactnative.dev/docs/react-native-devtools) を使用できます。すべての機能はブラウザ拡張機能と同じように動作し、React Native 固有の機能（レイアウト検査など）を含みます。

[React Native DevTools のインストールと使用方法の詳細はこちら](https://reactnative.dev/docs/react-native-devtools)

> **注意**
>
> React Native バージョン 0.76 以前の場合は、上記の Safari セクションで説明したスタンドアロン React DevTools を使用してください。

## React Developer Tools の使い方

### コンポーネントツリーの検査

React Developer Tools をインストールすると、ブラウザの開発者ツールに **Components** タブが表示されます。このタブでは、React コンポーネントツリーを検査できます。

![React DevTools の Components タブ](/images/docs/react-devtools-components.png)

- コンポーネントツリーをナビゲートする
- コンポーネントの props、state、hooks を表示する
- 選択したコンポーネントまでコンポーネントツリーをフィルタリングする
- コンポーネント名でコンポーネントを検索する

### Props と State の編集

コンポーネントを選択すると、その props と state を右側のパネルで編集できます。これは、コンポーネントがさまざまな状態でどのように動作するかをテストするのに役立ちます。

### パフォーマンスの測定

**Profiler** タブでは、React アプリのレンダリングパフォーマンスを測定できます。

![React DevTools の Profiler タブ](/images/docs/react-devtools-profiler.png)

1. 記録ボタンをクリックしてプロファイリングを開始する
2. アプリと対話する
3. 停止ボタンをクリックしてプロファイリングを停止する
4. 各コンポーネントのレンダリング時間を分析する

これにより、アプリのどの部分が遅いかを特定し、パフォーマンスの最適化が必要な場所を見つけることができます。

### コンポーネントのハイライト

設定で「Highlight updates when components render」を有効にすると、コンポーネントが再レンダリングされるたびに画面上でハイライトされます。これは、不要な再レンダリングを検出するのに役立ちます。

## トラブルシューティング

### ページに React が検出されない

React Developer Tools をインストールしたが、訪れたページで React が検出されない場合：

1. ページが実際に React を使用しているか確認する
2. 開発ビルドを使用しているか確認する（本番ビルドでは一部の機能が制限されます）
3. ページを再読み込みする
4. ブラウザ拡張機能が最新であることを確認する

### 複数の React インスタンス

同じページに複数の React インスタンスがある場合、React Developer Tools は混乱する可能性があります。これは通常、npm リンクを使用する場合や、モノレポ環境で発生します。可能な限り、1 つの React インスタンスのみを使用するようにしてください。

## さらに学ぶ

- [React Developer Tools の公式ドキュメント](https://github.com/facebook/react/tree/main/packages/react-devtools)
- [React DevTools チュートリアル動画](https://react.dev/learn/react-developer-tools)
- [パフォーマンスの最適化](/reference/react/Profiler)
