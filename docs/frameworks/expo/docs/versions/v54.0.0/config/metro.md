---
title: メトロ.config.js
description: Metro で利用可能な構成のリファレンス。
---

import { BookOpen02Icon } from '@expo/styleguide-icons/outline/BookOpen02Icon';

import { BoxLink } from '~/ui/components/BoxLink';
import { FileTree } from '~/ui/components/FileTree';
import { Terminal } from '~/ui/components/Snippet';

**metro.config.js** の詳細については、[Metro のカスタマイズ ガイド](/guides/customizing-metro/) を参照してください。

## 環境変数

Expo CLI は **.env** ファイルから環境変数をロードできます。 Expo CLI で環境変数を使用する方法について詳しくは、[環境変数ガイド](/guides/environment-variables/) をご覧ください。

EAS CLI は、コンパイルとバンドルのために Expo CLI を呼び出す場合を除き、環境変数に異なるメカニズムを使用します。 [EAS の環境変数](/build-reference/variables/) について詳しく学習してください。

古いプロジェクトを移行する場合は、**.gitignore** に次のコードを追加して、ローカル環境ファイルを無視する必要があります。

```sh .gitignore
# local env files
.env*.local
```

### dotenv ファイルの無効化

Expo CLI コマンドを呼び出す前に `EXPO_NO_DOTENV` 環境変数を有効にすることで、Expo CLI で Dotenv ファイルの読み込みを完全に無効にすることができます。

<Terminal
  cmd={[
    '# All users can run cross-env, followed by the Expo CLI command',
    '$ npx cross-env EXPO_NO_DOTENV=1 expo start',
    '# Alternatively, macOS and Linux users can define the environment variable, then run npx, followed by the Expo CLI command',
    '$ EXPO_NO_DOTENV=1 npx expo start',
  ]}
/>

### `EXPO_PUBLIC_` 接頭辞が付いたクライアント環境変数の無効化

`EXPO_PUBLIC_` というプレフィックスが付いた環境変数は、ビルド時にアプリに公開されます。たとえば、`EXPO_PUBLIC_API_KEY` は `process.env.EXPO_PUBLIC_API_KEY` として使用できます。

クライアント環境変数のインライン化は、環境変数 `EXPO_NO_CLIENT_ENV_VARS=1` を使用して無効にできます。これは、バンドルを実行する前に定義する必要があります。

<Terminal
  cmd={[
    '# All users can run cross-env, followed by the Expo CLI command',
    '$ npx cross-env EXPO_NO_CLIENT_ENV_VARS=1 expo start',
    '# Alternatively, macOS and Linux users can define the environment variable, then run npx, followed by the Expo CLI command',
    '$ EXPO_NO_CLIENT_ENV_VARS=1 npx expo start',
  ]}
/>

## CSS

> **情報** CSS サポートは開発中であり、現在は Web でのみ機能します。

Expo はプロジェクト内の CSS をサポートします。任意のコンポーネントから CSS ファイルをインポートできます。 CSS モジュールもサポートされています。

CSS サポートはデフォルトで有効になっています。 Metro 設定で `isCSSEnabled` を設定することで、この機能を無効にできます。

```js metro.config.js
/** @type {import('expo/metro-config').MetroConfig} */
const config = getDefaultConfig(__dirname, {
  // Disable CSS support.
  isCSSEnabled: false,
});
```

### グローバル CSS

> **警告** グローバル スタイルは Web 専用です。使用すると、アプリケーションの視覚的にネイティブとの相違が生じます。

任意のコンポーネントから CSS ファイルをインポートできます。 CSS はページ全体に適用されます。

ここでは、クラス名 `.container` のグローバル スタイルを定義します。

```css styles.css
.container {
  background-color: red;
}
```

次に、スタイルシートをインポートして `.container` を使用することで、コンポーネント内でクラス名を使用できます。

```jsx App.js|collapseHeight=470
import './styles.css';
import { View } from 'react-native';

export default function App() {
  return (
    <>
      {/* Use `className` to assign the style with React DOM components. */}
      <div className="container">Hello World</div>

      {/* Use `style` with the following syntax to append class names in React Native for web. */}
      <View
        style={{
          $$css: true,
          _: 'container',
        }}>
        Hello World
      </View>
    </>
  );
}
```

他のノード モジュールと同様に、ライブラリで提供されているスタイルシートをインポートすることもできます。

```js index.js
// Applies the styles app-wide.
import 'emoji-mart/css/emoji-mart.css';
```

- ネイティブでは、すべてのグローバル スタイルシートが自動的に無視されます。
- グローバル スタイルシートではホット リロードがサポートされており、ファイルを保存するだけで変更が適用されます。

### CSS モジュール

> **警告** ネイティブ用の CSS モジュールは開発中であり、現在は Web 上でのみ動作します。

CSS モジュールは、CSS の範囲を特定のコンポーネントに限定する方法です。これは、名前の衝突を回避し、スタイルが目的のコンポーネントにのみ適用されるようにするのに役立ちます。

Expo では、CSS モジュールは `.module.css` 拡張子を持つファイルを作成することで定義されます。ファイルは任意のコンポーネントからインポートできます。エクスポートされた値は、クラス名をキーとして、Web のみのスコープ名を値として持つオブジェクトです。インポート `unstable_styles` を使用して、`react-native-web` セーフ スタイルにアクセスできます。

CSS モジュールはプラットフォーム拡張機能をサポートしており、さまざまなプラットフォームにさまざまなスタイルを定義できます。たとえば、`module.ios.css` ファイルと `module.android.css` ファイルを定義して、それぞれ Android と iOS のスタイルを定義できます。拡張子を付けずにインポートする必要があります。例:

```diff App.js
// Importing `./App.module.ios.css`:
- import styles from './App.module.css';
+ import styles from './App.module';
```

拡張子を反転すると、たとえば `App.ios.module.css` は機能せず、`App.ios.module` という名前のユニバーサル モジュールが作成されます。

> React Native または React Native for Web コンポーネントの `className` プロパティにスタイルを渡すことはできません。代わりに、`style` プロパティを使用する必要があります。

```jsx App.js|collapseHeight=470
import styles, { unstable_styles } from './App.module.css';

export default function Page() {
  return (
    <>
      <Text
        style={{
          // This is how react-native-web class names are applied
          $$css: true,
          _: styles.text,
        }}>
        Hello World
      </Text>
      <Text style={unstable_styles.text}>Hello World</Text>
      {/* Web-only usage: */}
      <p className={styles.text}>Hello World</p>
    </>
  );
}
```

```css App.module.css
.text {
  color: red;
}
```

- Web では、すべての CSS 値が利用可能です。 CSS は、React Native Web `StyleSheet` API のように処理されたり、自動プレフィックスが付加されたりしません。 `postcss.config.js` を使用して CSS に自動プレフィックスを付けることができます。
- CSS モジュールは内部で [lightningcss](https://github.com/parcel-bundler/lightningcss) を使用します。サポートされていない機能については [問題](https://github.com/parcel-bundler/lightningcss/issues) を確認してください。

### PostCSS

[PostCSS](https://github.com/postcss/postcss) は、`postcss.config.json` ファイルをプロジェクトのルートに追加することでカスタマイズできます。このファイルは、PostCSS 構成オブジェクトを返す関数をエクスポートする必要があります。例えば：

```json postcss.config.json
{
  "plugins": {
    "tailwindcss": {}
  }
}
```

`postcss.config.json` と `postcss.config.js` の両方がサポートされていますが、`postcss.config.json` を使用するとより優れたキャッシュが可能になります。

Expo CLI は、[browserslist](https://browsersl.ist/) のサポートが組み込まれている CSS ベンダー プレフィックスを自動的に処理します。 `autoprefixer` を追加すると機能が重複し、バンドルの速度が低下するため、追加は避けてください。

#### 更新後のキャッシュのリセット

Post CSS または `browserslist` 設定を変更するには、Metro キャッシュをクリアする必要があります。

<Terminal
  cmd={['$ npx expo start --clear', '$ npx expo export --clear']}
  cmdCopy="npx expo start --clear && npx expo export --clear"
/>

### ブラウザリスト

Expo には、Rust ベースの CSS パーサーを介した自動 [browserslist](https://browsersl.ist/) サポートがあります。 **package.json** ファイルに **browserslist** フィールドを追加することで、CSS ベンダー プレフィックスとブラウザ サポートをカスタマイズできます。例えば：

```json package.json
{
  "browserslist": [">0.2%", "not dead", "not op_mini all"]
}
```

### サス

Expo Metro は SCSS/SASS を_部分的に_サポートしています。

セットアップするには、`sass` パッケージをプロジェクトにインストールします。

<Terminal cmd={['$ yarn add -D sass']} />

次に、**metro.config.js** ファイルで [CSS がセットアップされている](#css) ことを確認します。

- `sass` がインストールされている場合、拡張子のないモジュールは `scss`、`sass`、`css` の順序で解決されます。
- `sass` ファイルでは意図した構文のみを使用してください。
- scss/sass ファイル内から他のファイルをインポートすることは現在サポートされていません。

### 追い風

> **情報** 標準の Tailwind CSS は Web プラットフォームのみをサポートします。ユニバーサル サポートの場合は、[NativeWind](https://www.nativewind.dev/) などのライブラリを使用します。これにより、Tailwind CSS を使用してスタイル付きの React Native コンポーネントを作成できます。

<BoxLink
  title="追い風 CSS"
  description="Expo プロジェクトで Tailwind CSS を構成して使用する方法を学びます。"
  href="/guides/tailwind/"
  Icon={BookOpen02Icon}
/>

## Babel トランスフォーマーの拡張

Expo の Metro 構成では、カスタム `transformer.babelTransformerPath` 値を使用して、`expo-babel-preset` が常に使用され、Web/Node.js 環境がサポートされるようにします。

Babel トランスフォーマを拡張する場合は、`metro-react-native-babel-transformer` ではなく `@expo/metro-config/babel-transformer` から上流のトランスフォーマをインポートします。例えば：

```js metro.transformer.js
const upstreamTransformer = require('@expo/metro-config/babel-transformer');

module.exports.transform = async ({ src, filename, options }) => {
  // Do something custom for SVG files...
  if (filename.endsWith('.svg')) {
    src = '...';
  }
  // Pass the source through the upstream Expo transformer.
  return upstreamTransformer.transform({ src, filename, options });
};
```

## カスタム解決

Expo CLI は、デフォルトの Metro リゾルバーを拡張して、Web、サーバー、tsconfig エイリアスのサポートなどの機能を追加します。同様に、`config.resolver.resolveRequest` 関数をチェーンすることで、Metro のデフォルトの解決動作をカスタマイズできます。

```tsx metro.config.js|collapseHeight=470
const { getDefaultConfig } = require('expo/metro-config');

/** @type {import('expo/metro-config').MetroConfig} */
const config = getDefaultConfig(__dirname);

config.resolver.resolveRequest = (context, moduleName, platform) => {
  if (moduleName.startsWith('my-custom-resolver:')) {
    // Logic to resolve the module name to a file path...
    // NOTE: Throw an error if there is no resolution.
    return {
      filePath: 'path/to/file',
      type: 'sourceFile',
    };
  }

  // Ensure you call the default resolver.
  return context.resolveRequest(context, moduleName, platform);
};

module.exports = config;
```

従来のバンドラーとは異なり、Metro はすべてのプラットフォームで同じリゾルバー機能を共有しました。その結果、`context` オブジェクトを使用して、リクエストごとに解像度設定を動的に変更できます。

### モックモジュール

特定のプラットフォームでモジュールを空にしたい場合は、リゾルバーから `type: 'empty'` オブジェクトを返すことができます。次の例では、Web 上で `lodash` が空になります。

```ts metro.config.js
const { getDefaultConfig } = require('expo/metro-config');

/** @type {import('expo/metro-config').MetroConfig} */
const config = getDefaultConfig(__dirname);

config.resolver.resolveRequest = (context, moduleName, platform) => {
  if (platform === 'web' && moduleName === 'lodash') {
    return {
      type: 'empty',
    };
  }

  // Ensure you call the default resolver.
  return context.resolveRequest(context, moduleName, platform);
};

module.exports = config;
```

この手法は、Webpack または Vite で空の外部を使用するのと同等ですが、特定のプラットフォームをターゲットにできるという追加の利点があります。

### 仮想モジュール

Metro は現時点では仮想モジュールをサポートしていません。同様の動作を実現するために使用できる手法の 1 つは、`node_modules/.cache/...` ディレクトリにモジュールを作成し、解決をそのファイルにリダイレクトすることです。

次の例では、`node_modules/.cache/virtual/virtual-module.js` にモジュールを作成し、`virtual:my-module` の解決をそのファイルにリダイレクトします。

```ts metro.config.js
const path = require('path');
const fs = require('fs');

const { getDefaultConfig } = require('expo/metro-config');

/** @type {import('expo/metro-config').MetroConfig} */
const config = getDefaultConfig(__dirname);

const virtualPath = path.resolve(__dirname, 'node_modules/.cache/virtual/virtual-module.js');

// Create the virtual module in a generated directory...
fs.mkdirSync(path.dirname(virtualPath), { recursive: true });
fs.writeFileSync(virtualPath, 'export default "Hello World";');

config.resolver.resolveRequest = (context, moduleName, platform) => {
  if (moduleName === 'virtual:my-module') {
    return {
      filePath: virtualPath,
      type: 'sourceFile',
    };
  }

  // Ensure you call the default resolver.
  return context.resolveRequest(context, moduleName, platform);
};

module.exports = config;
```

これを使用して、カスタム インポートで `externals` をエミュレートできます。たとえば、`require('expo')` を `SystemJS.require('expo')` などのカスタムにリダイレクトする場合は、`SystemJS.require('expo')` をエクスポートする仮想モジュールを作成し、`expo` の解決をそのファイルにリダイレクトできます。

## カスタム変換

> 変換は Metro に大量にキャッシュされます。何かを更新する場合は、`--clear` フラグを使用して更新を確認します。たとえば、`npx expo start --clear` です。

Metro には、ファイルを変換するための表現力豊かなプラグイン システムがありません。代わりに、[**babel.config.js**](../config/babel/) と呼び出し元オブジェクトを使用して変換をカスタマイズすることを選択します。

```js babel.config.js
module.exports = function (api) {
  // Get the platform that Expo CLI is transforming for.
  const platform = api.caller(caller => (caller ? caller.platform : 'ios'));

  // Detect if the bundling operation is for Hermes engine or not, e.g. `'hermes'` | `undefined`.
  const engine = api.caller(caller => (caller ? caller.engine : null));

  // Is bundling for a server environment, e.g. API Routes.
  const isServer = api.caller(caller => (caller ? caller.isServer : false));

  // Is bundling for development or production.
  const isDev = api.caller(caller =>
    caller
      ? caller.isDev
      : process.env.BABEL_ENV === 'development' || process.env.NODE_ENV === 'development'
  );

  // Ensure the config is not cached otherwise the platform will not be updated.
  api.cache(false);
  // You can alternatively provide a more robust CONFIG cache invalidation:
  // api.cache.invalidate(() => platform);

  return {
    presets: ['babel-preset-expo'],
    plugins: [
      // Add a plugin based on the platform...
      platform === 'web' && 'my-plugin',

      // Ensure you filter out falsy values.
    ].filter(Boolean),
  };
};
```

呼び出し元に `engine`、`platform`、`bundler` などがない場合は、トランスフォーマーに `@expo/metro-config/babel-transformer` を使用していることを確認してください。カスタム トランスフォーマーを使用している場合は、Expo トランスフォーマーを拡張する必要がある場合があります。

可能であれば、常にリゾルバーにカスタム ロジックを実装するようにしてください。キャッシュははるかに単純で、推論が容易です。たとえば、インポートを再マップする必要がある場合、考えられるすべてのインポート メソッドを解析してトランスフォーマーで再マップするよりも、リゾルバーを使用して静的ファイルに解決する方が簡単かつ高速です。

デフォルトの Babel プリセットとして常に `babel-preset-expo` を使用します。これにより、変換が常に Expo ランタイムと互換性を持つことが保証されます。 `babel-preset-expo` は、呼び出し元の入力をすべて内部的に使用して、特定のプラットフォーム、エンジン、環境に合わせて最適化します。

## Node.js ビルトイン

サーバー環境にバンドルする場合、Expo の Metro 構成は、現在の Node.js バージョンに基づいて Node.js 組み込みモジュール (`fs`、`path`、`node:crypto` など) の外部化を自動的にサポートします。 CLI がブラウザ環境にバンドルされている場合、ビルトインはまずモジュールがローカルにインストールされているかどうかを確認し、次に空の shim にフォールバックします。たとえば、ブラウザで使用するために `path` をインストールした場合、これを使用できます。そうでない場合、モジュールは自動的にスキップされます。

## 環境設定

> **情報** これらの環境変数はテスト環境では定義されません。

Expo の Metro config は、環境変数を介してクライアント バンドルで使用できるビルド設定を挿入します。すべての変数はインライン化され、動的に使用できません。たとえば、`process.env["EXPO_BASE_URL"]` は機能しません。

- `process.env.EXPO_BASE_URL` は、`experiments.baseUrl` で定義されたベース URL を公開します。これは、デプロイメント用の実稼働ベース URL を尊重するために、Expo Router で使用されます。

## バンドルの分割

Expo CLI は、本番環境での非同期インポートに基づいて、Web バンドルを複数のチャンクに自動的に分割します。この機能を使用するには、`@expo/metro-runtime` をエントリ バンドル (Expo Router でデフォルトで利用可能) のどこかにインストールしてインポートする必要があります。

非同期バンドルの共有依存関係は、リクエストの数を減らすために単一のチャンクにマージされます。たとえば、`lodash` をインポートする 2 つの非同期バンドルがある場合、ライブラリは 1 つの初期チャンクにマージされます。

チャンク分割ヒューリスティックはカスタマイズできません。例えば：

<FileTree files={['math.js', 'index.js']} />

```js math.js
export function add(a, b) {
  return a + b;
}
```

```js index.js
import '@expo/metro-runtime';

// This will be split into a separate chunk.
import('./math').then(math => {
  console.log(math.add(1, 2));
});
```

`npx expo export -p web` を実行すると、バンドルは複数のファイルに分割され、エントリ バンドルがメイン HTML ファイルに追加されます。 `@expo/metro-runtime` は、非同期バンドルをロードして評価するランタイム コードを追加します。

## ソースマップのデバッグID

バンドルが外部ソース マップとともにエクスポートされる場合、[**Debug ID**](https://sentry.engineering/blog/the-case-for-debug-ids) 注釈がファイルの末尾に追加され、ファイルを対応付けるためにソース マップ内の一致する `debugId` が追加されます。ソース マップがエクスポートされない場合、またはインライン ソース マップが使用される場合、この注釈は追加されません。

```js
// <all source code>

//# debugId=<deterministic chunk hash>
```

関連する `*.js.map` または `*.hbc.map` ソース マップは、同等の `debugId` プロパティを含む JSON ファイルになります。 `debugId` は、あらゆる場合に一致を保証するために、hermes バイトコードの生成前に挿入されます。

`debugId` は、外部バンドル分割参照を含まないバンドルの内容の確定的ハッシュです。これはチャンク ファイル名の作成に使用される値と同じですが、UUID としてフォーマットされます。たとえば、`431b98e2-c997-4975-a3d9-2987710abd44` です。

`@expo/metro-config` は、`npx expo export` および `npx expo export:embed` 中に `debugId` を挿入します。 `npx expo export:embed` での追加の最適化手順 (Hermes バイトコード生成など) では、`debugId` を手動で挿入する必要があります。

## Metro にはランタイムが必要です

必要に応じて、環境変数 `EXPO_USE_METRO_REQUIRE=1` を使用してカスタム Metro `require` 実装を有効にすることができます。このランタイムには次の機能があります。

- 人間が判読できる文字列モジュール ID により、モジュール欠落エラーを追跡しやすくなります。
- 実行間およびモジュール間で同じである決定的な ID (開発中の React Server コンポーネントに必要)。
- 従来の RAM バンドルのサポートを削除しました。

## Magic インポートのコメント

> すべてのプラットフォームで SDK 52 から利用可能。

Workers や Node.js などのサーバー環境は、実行時に任意のファイルのインポートをサポートしているため、Metro の require システムを使用する代わりに、`import` 構文をそのまま維持することをお勧めします。 `import()` ステートメント内の `/* @metro-ignore */` コメントを使用して動的インポートをオプトアウトできます。

```js
// Manually ensure `./my-module.js` is included in the correct spot relative to the module.
const myModule = await import(/* @metro-ignore */ './my-module.js');
```

Expo CLI は `./my-module.js` 依存関係をスキップし、開発者が出力バンドルに手動で追加したものと想定します。内部的には、これはリクエストに基づいてファイル間を動的に切り替えるカスタム サーバー コードをエクスポートするために使用されます。 `import()` は通常、Hermes が有効になっている React Native では使用できないため、ネイティブ バンドルにはこの構文を使用しないでください。

多くの React ライブラリには、同様の動作を実現するために Webpack `/* webpackIgnore: true */` コメントが同梱されています。ギャップを埋めるために、Webpack のコメントのサポートも追加しましたが、アプリ内で同等の Metro を使用することをお勧めします。

## ESモジュールの解像度

> このセクションは、SDK 53 からすべてのプラットフォームに適用されます。

Metro は、ES モジュール `import` と CommonJS `require` を別々の解決戦略で解決します。

以前、Metro は、ES モジュールをサポートするためのいくつかの追加を加えて、従来の Node.js モジュール解決戦略 (v12 より前の Node.js バージョンと一致) を適用していました。この解決戦略では、Metro は `node_modules`、JS ファイルからモジュールを解決しますが、オプションで `.js` などの拡張子を省略し、`main`、`module`、`react-native` などの `package.json` フィールドを使用します。

現在、最新の ES モジュール解決戦略により、Metro は `node_modules` からモジュールを解決し、`exports`、[パッケージが公開するサブパスのネストされたマップ](https://nodejs.org/api/packages.html#conditional-exports)、`main` などのさまざまな `package.json` フィールドと一致します。

パッケージのインポート方法に応じて、これら 2 つの解決戦略のいずれかが使用されます。通常、(`require` ではなく) Node モジュールから `import` を使用してインポートされたファイルは、ES モジュールの解決戦略を使用し、通常のクラシック Node.js 解決にフォールバックします。 ES モジュール解決で解決されなかったファイル、または CommonJS `require` でインポートされたファイルは、従来の解決戦略を使用します。

### `package.json:exports`

ES モジュールの解決を実行するとき、Metro は `package.json:exports` 条件マップを調べます。これは、インポートのサブパスと条件をノード モジュール パッケージ内のファイルにマッピングします。

たとえば、**index.js** ファイルを常に公開し、Metro の従来の CommonJS モジュール解像度と一致するパッケージでは、`default` 条件を使用してマップを指定できます。

```json
{
  "exports": {
    "default": "./index.js"
  }
}
```

ただし、CommonJS と ES モジュールの両方のエントリポイントを提供するパッケージは、`import` および `require` 条件を使用したマッピングを提供する場合があります。

```json
{
  "exports": {
    "import": "./index.mjs",
    "require": "./index.cjs"
  }
}
```

デフォルトでは、Metro はプラットフォームに応じてさまざまな条件と一致し、解決が CommonJS `require` 呼び出しから開始されたか ES Modules `import` ステートメントから開始されたかに応じて条件を変更します。

ネイティブ プラットフォームの場合は `react-native` 条件が追加され、Web エクスポートの場合は `browser` 条件が追加され、サーバー エクスポート (API ルートや React Server 関数など) の場合は `node`、`react-server`、および `workerd` 条件が追加されます。これらの条件は、定義されている順序で照合されるのではなく、`package.json:exports` マップ内のプロパティの順序と照合されます。

TypeScript は、ES モジュールの解決を Metro とは別に実行し、`compilerOptions.moduleResolution` 構成オプションが `"bundler"` (Metro の動作により一致する) または `"node16"` / `"nodenext"` に設定されている場合、`package.json:exports` マップも尊重します。ただし、TypeScript は `types` 条件にも一致します。そのため、パッケージがエクスポート マップの最初に `types` 条件を配置しないと、型が正しく解決されない可能性があります。

エクスポート マップにはサブパスが含まれる場合があるため、パッケージのインポートはパッケージのモジュール フォルダー内のファイルと一致する必要はなくなり、「リダイレクトされた」インポートになる可能性があります。 `'package/submodule'` をインポートすると、`package.json:exports` で指定されている場合、**node_modules/package/submodule.js** とは異なるファイルと一致する可能性があります。

```json
{
  "exports": {
    ".": "./index.js",
    "./submodule": "./submodule/submodule.js"
  }
}
```

新しい ES モジュール解決戦略に互換性がない、または準備ができていないパッケージが発生した場合は、その `package.json` ファイルにパッチを適用し、その `package.json:exports` 条件マップを追加または修正することで問題を解決できる可能性があります。ただし、`unstable_enablePackageExports` オプションを無効にすることで、Metro が解像度で `package.json:exports` マップを使用しないようにすることもできます。

```js metro.config.js
const { getDefaultConfig } = require('expo/metro-config');

/** @type {import('expo/metro-config').MetroConfig} */
const config = getDefaultConfig(__dirname);

config.resolver.unstable_enablePackageExports = false;

module.exports = config;
```

## アセットのインポート

アセットがインポートされると、アセットのインポートに必要なデータを表す仮想モジュールが作成されます。

ネイティブ プラットフォームでは、アセットは `1`、`2`、`3` などの数値 ID になり、`require("@react-native/assets-registry/registry").getAssetByID(<NUMBER>)` を使用して検索できます。 Web プラットフォームとサーバー プラットフォームでは、ファイルの種類に応じてアセットが変わります。ファイルが画像の場合、アセットは `{ uri: string, width?: number, height?: number }` になります。それ以外の場合、アセットはアセットのリモート URL を表す `string` になります。

アセットは次のように使用できます。

```jsx
import { Image } from 'react-native';

import asset from './img.png';

function Demo() {
  return <Image source={asset} />;
}
```

API ルートでは、アセットのタイプが数値ではないと常に想定できます。

```js
import asset from './img.png';

export async function GET(req: Request) {
  const ImageData = await fetch(
    new URL(
      // Access the asset URI.
      asset.uri,
      // Append to the current request URL origin.
      req.url
    )
  ).then(res => res.arrayBuffer());

  return new Response(ImageData, {
    headers: {
      'Content-Type': 'image/png',
    },
  });
}
```

## ウェブワーカー

> **重要** この機能は実験的なものであり、重大な変更が行われる可能性があります。

```ts
new Worker(new URL('./worker', window.location.href));
```

Expo Metro には実験的な Web ワーカーのサポートがあります。この機能は現在 Web のみであり、ネイティブでは機能しません。ネイティブで使用すると、「プロパティ 'Worker' が存在しません」というエラーが発生します。

Web ワーカーを使用すると、Web 上の別のスレッドに作業をオフロードして、メイン スレッドの応答性を維持できます。これは、画像処理、暗号化、またはメインスレッドをブロックしてしまうその他のタスクなど、計算量の多いタスクに役立ちます。

ワーカーは `Blob` を使用してインラインで生成できますが、TypeScript や他のモジュールのインポートなどの最新の機能を利用したい場合もあります。

Web ワーカーは Expo バンドル分割サポートに依存しているため、Expo Router を使用するか、`@expo/metro-runtime` をインストールしてインポートする必要があります。また、環境 `EXPO_NO_METRO_LAZY=1` を Web ワーカーで使用することもできません。

数値を 2 倍にするワーカーの次の例を考えてみましょう。

```ts worker.ts
self.onmessage = ({ data }) => {
  const result = data * 2; // Example: double the number
  self.postMessage(result);
};
```

このワーカー ファイルは、メイン アプリに `Worker` としてインポートできます。

```ts
// worker is of type `Worker`
const worker = new Worker(new URL('./worker', window.location.href));

worker.onmessage = ({ data }) => {
  console.log(`Worker responded: ${data}`);
};

worker.postMessage(5);
```

Expo CLI は舞台裏で次のようなコードを生成しています。

```ts
const worker = new Worker(
  new URL('/worker.bundle?platform=web&dev=true&etc', window.location.href)
);
```

生成されたバンドル URL は、ワーカーが正しくロードされバンドルされるように、開発/運用に基づいて変更されます。従来のバンドル分割とは異なり、ワーカー ファイルにはすべてのモジュールの独自のコピーが含まれている必要があり、メイン バンドル内の共通モジュールに依存することはできません。

ネイティブ API `Worker` は従来、React Native では使用できず、Expo SDK によっても提供されませんでした。そのため、このバンドル機能は技術的にはすべてのプラットフォームで機能しますが、Web でのみ役立ちます。ネイティブ プラットフォームもサポートしたい場合は、理論的には `Worker` API をポリフィルするネイティブ Expo モジュールを作成できます。あるいは、React Native Reanimated の「ワークレット」API を使用して、ネイティブ上の別のスレッドに作業をオフロードすることもできます。

あるいは、最初に変換された JS ファイルを **public** ディレクトリに置き、次に変数を使用してワーカー インポート内でそれを参照することにより、パブリック パスを使用してワーカーをインポートすることもできます。

```ts
// Will avoid the transform and use the public path directly.
const worker = new Worker('/worker.js');

// The variable breaks the transform causing the literal path to be used instead of the transformed path.
const path = '/worker.js';

const anotherWorker = new Worker(new URL(path, window.location.href));
```

`Worker` コンストラクターでの変数の使用はバンドルではサポートされていません。内部 URL を検査するには、内部構文 `require.unstable_resolveWorker('./path/to/worker.js')` を使用して URL フラグメントを取得します。

## 単純なワークフローのセットアップ

> このガイドはバージョン管理されており、Expo をアップグレード/ダウングレードするときに再度参照する必要があります。または、[Expo Prebuild](/workflow/prebuild) を使用して完全に自動セットアップを行います。

[Expo Prebuild](/workflow/prebuild) を使用しないプロジェクトは、プロジェクトのバンドルに常に Expo Metro 構成が使用されるようにネイティブ ファイルを構成する必要があります。

{/* これを行わないと、[aliases](/guides/typescript/#path-aliases-optional)、[absolute imports](/guides/typescript/#absolute-imports-optional)、アセット ハッシュなどの機能が機能しなくなります。 */}

これらの変更は、`npx react-native bundle` と `npx react-native start` をそれぞれ `npx expo export:embed` と `npx expo start` に置き換えることを目的としています。

### メトロ.config.js

**metro.config.js** が `expo/metro-config` を拡張していることを確認します。

```js metro.config.js
const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

module.exports = config;
```

### `android/app/build.gradle`

Android **app/build.gradle** は、実稼働バンドルに Expo CLI を使用するように構成する必要があります。 `react` 構成オブジェクトを変更します。

```diff android/app/build.gradle
react {
  ...
+     // Use Expo CLI to bundle the app, this ensures the Metro config
+     // works correctly with Expo projects.
+     cliFile = new File(["node", "--print", "require.resolve('@expo/cli')"].execute(null, rootDir).text.trim())
+     bundleCommand = "export:embed"
}
```

### `ios/<Project>.xcodeproj/project.pbxproj`

**ios/&lt;Project&gt;.xcodeproj/project.pbxproj** ファイルで、次のスクリプトを置き換えます。

#### 「パッケージャーの開始」スクリプト

**「Start Packager」** スクリプトを削除します。開発サーバーは、アプリの実行前または実行後に `npx expo` で起動する必要があります。

```diff Start Packager
-    FD10A7F022414F080027D42C /* Start Packager */ = {
-			isa = PBXShellScriptBuildPhase;
-			alwaysOutOfDate = 1;
-			buildActionMask = 2147483647;
-			files = (
-			);
-			inputFileListPaths = (
-			);
-			inputPaths = (
-			);
-			name = "Start Packager";
-			outputFileListPaths = (
-			);
-			outputPaths = (
-			);
-			runOnlyForDeploymentPostprocessing = 0;
-			shellPath = /bin/sh;
-			shellScript = "if [[ -f \"$PODS_ROOT/../.xcode.env\" ]]; then\n  source \"$PODS_ROOT/../.xcode.env\"\nfi\nif [[ -f \"$PODS_ROOT/../.xcode.env.updates\" ]]; then\n  source \"$PODS_ROOT/../.xcode.env.updates\"\nfi\nif [[ -f \"$PODS_ROOT/../.xcode.env.local\" ]]; then\n  source \"$PODS_ROOT/../.xcode.env.local\"\nfi\n\nexport RCT_METRO_PORT=\"${RCT_METRO_PORT:=8081}\"\necho \"export RCT_METRO_PORT=${RCT_METRO_PORT}\" > `$NODE_BINARY --print \"require('path').dirname(require.resolve('react-native/package.json')) + '/scripts/.packager.env'\"`\nif [ -z \"${RCT_NO_LAUNCH_PACKAGER+xxx}\" ] ; then\n  if nc -w 5 -z localhost ${RCT_METRO_PORT} ; then\n    if ! curl -s \"http://localhost:${RCT_METRO_PORT}/status\" | grep -q \"packager-status:running\" ; then\n      echo \"Port ${RCT_METRO_PORT} already in use, packager is either not running or not running correctly\"\n      exit 2\n    fi\n  else\n    open `$NODE_BINARY --print \"require('path').dirname(require.resolve('expo/package.json')) + '/scripts/launchPackager.command'\"` || echo \"Can't start packager automatically\"\n  fi\nfi\n";
-			showEnvVarsInLog = 0;
-		};
```

#### 「React Native コードとイメージをバンドルする」スクリプト

```diff Bundle React Native code and images
+			shellScript = "if [[ -f \"$PODS_ROOT/../.xcode.env\" ]]; then\n  source \"$PODS_ROOT/../.xcode.env\"\nfi\nif [[ -f \"$PODS_ROOT/../.xcode.env.local\" ]]; then\n  source \"$PODS_ROOT/../.xcode.env.local\"\nfi\n\n# The project root by default is one level up from the ios directory\nexport PROJECT_ROOT=\"$PROJECT_DIR\"/..\n\nif [[ \"$CONFIGURATION\" = *Debug* ]]; then\n  export SKIP_BUNDLING=1\nfi\nif [[ -z \"$ENTRY_FILE\" ]]; then\n  # Set the entry JS file using the bundler's entry resolution.\n  export ENTRY_FILE=\"$(\"$NODE_BINARY\" -e \"require('expo/scripts/resolveAppEntry')\" \"$PROJECT_ROOT\" ios absolute | tail -n 1)\"\nfi\n\nif [[ -z \"$CLI_PATH\" ]]; then\n  # Use Expo CLI\n  export CLI_PATH=\"$(\"$NODE_BINARY\" --print \"require.resolve('@expo/cli')\")\"\nfi\nif [[ -z \"$BUNDLE_COMMAND\" ]]; then\n  # Default Expo CLI command for bundling\n  export BUNDLE_COMMAND=\"export:embed\"\nfi\n\n`\"$NODE_BINARY\" --print \"require('path').dirname(require.resolve('react-native/package.json')) + '/scripts/react-native-xcode.sh'\"`\n\n";
```

あるいは、Xcode プロジェクトで **「React Native コードとイメージのバンドル」** ビルド フェーズを選択し、次の変更を追加します。

```diff Bundle React Native code and images
if [[ -f "$PODS_ROOT/../.xcode.env" ]]; then
  source "$PODS_ROOT/../.xcode.env"
fi
if [[ -f "$PODS_ROOT/../.xcode.env.local" ]]; then
  source "$PODS_ROOT/../.xcode.env.local"
fi

# The project root by default is one level up from the ios directory
export PROJECT_ROOT="$PROJECT_DIR"/..

if [[ "$CONFIGURATION" = *Debug* ]]; then
  export SKIP_BUNDLING=1
fi
+ if [[ -z "$ENTRY_FILE" ]]; then
+   # Set the entry JS file using the bundler's entry resolution.
+   export ENTRY_FILE="$("$NODE_BINARY" -e "require('expo/scripts/resolveAppEntry')" "$PROJECT_ROOT" ios absolute | tail -n 1)"
+ fi

+ if [[ -z "$CLI_PATH" ]]; then
+   # Use Expo CLI
+   export CLI_PATH="$("$NODE_BINARY" --print "require.resolve('@expo/cli')")"
+ fi
+ if [[ -z "$BUNDLE_COMMAND" ]]; then
+   # Default Expo CLI command for bundling
+   export BUNDLE_COMMAND="export:embed"
+ fi

`"$NODE_BINARY" --print "require('path').dirname(require.resolve('react-native/package.json')) + '/scripts/react-native-xcode.sh'"`
```

> `CLI_PATH`、`BUNDLE_COMMAND`、`ENTRY_FILE` 環境変数を設定して、これらのデフォルトを上書きできます。

### カスタムエントリーファイル

デフォルトでは、React Native はルート `index.js` ファイル (または `index.ios.js` などのプラットフォーム固有のバリエーション) としての使用のみをサポートします。 Expo プロジェクトでは任意のエントリー ファイルを使用できますが、これには追加の基本セットアップが必要です。

＃＃＃＃ 発達

開発モード エントリ ファイルは、[`expo-dev-client`](../sdk/dev-client/) パッケージを使用して有効にできます。あるいは、次の構成を追加することもできます。

```diff ios/<Project>/AppDelegate.mm
- (NSURL *)sourceURLForBridge:(RCTBridge *)bridge
{
#if DEBUG
-  return [[RCTBundleURLProvider sharedSettings] jsBundleURLForBundleRoot:@"index"];
+  return [[RCTBundleURLProvider sharedSettings] jsBundleURLForBundleRoot:@".expo/.virtual-metro-entry"];
#else
  return [[NSBundle mainBundle] URLForResource:@"main" withExtension:@"jsbundle"];
#endif
}
```

```diff android/app/src/main/java/<Project>/MainApplication.java
@Override
protected String getJSMainModuleName() {
-  return "index";
+  return ".expo/.virtual-metro-entry";
}
```

＃＃＃＃ 生産

**ios/&lt;Project&gt;.xcodeproj/project.pbxproj** ファイルで、**「Bundle React Native code and Images」** スクリプトを置き換えて、Metro を使用して `$ENTRY_FILE` を設定します。

```diff ios/<Project>/project.pbxproj
+			shellScript = "if [[ -f \"$PODS_ROOT/../.xcode.env\" ]]; then\n  source \"$PODS_ROOT/../.xcode.env\"\nfi\nif [[ -f \"$PODS_ROOT/../.xcode.env.local\" ]]; then\n  source \"$PODS_ROOT/../.xcode.env.local\"\nfi\n\n# The project root by default is one level up from the ios directory\nexport PROJECT_ROOT=\"$PROJECT_DIR\"/..\n\nif [[ \"$CONFIGURATION\" = *Debug* ]]; then\n  export SKIP_BUNDLING=1\nfi\nif [[ -z \"$ENTRY_FILE\" ]]; then\n  # Set the entry JS file using the bundler's entry resolution.\n  export ENTRY_FILE=\"$(\"$NODE_BINARY\" -e \"require('expo/scripts/resolveAppEntry')\" \"$PROJECT_ROOT\" ios absolute | tail -n 1)\"\nfi\n\nif [[ -z \"$CLI_PATH\" ]]; then\n  # Use Expo CLI\n  export CLI_PATH=\"$(\"$NODE_BINARY\" --print \"require.resolve('@expo/cli')\")\"\nfi\nif [[ -z \"$BUNDLE_COMMAND\" ]]; then\n  # Default Expo CLI command for bundling\n  export BUNDLE_COMMAND=\"export:embed\"\nfi\n\n`\"$NODE_BINARY\" --print \"require('path').dirname(require.resolve('react-native/package.json')) + '/scripts/react-native-xcode.sh'\"`\n\n";
```

Android **app/build.gradle** は、Metro モジュール解決を使用してルート エントリ ファイルを見つけるように構成する必要があります。 `react` 構成オブジェクトを変更します。

```diff app/build.gradle
+ def projectRoot = rootDir.getAbsoluteFile().getParentFile().getAbsolutePath()

react {
+    entryFile = file(["node", "-e", "require('expo/scripts/resolveAppEntry')", projectRoot, "android", "absolute"].execute(null, rootDir).text.trim())
}
```
