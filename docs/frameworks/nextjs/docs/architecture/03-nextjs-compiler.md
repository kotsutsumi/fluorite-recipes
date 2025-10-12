# Next.js Compiler

Next.js Compilerは、[SWC](http://swc.rs/)を使用してRustで書かれており、Next.jsアプリケーションを本番用に変換およびミニファイできます。これは、個々のファイルのBabelに代わるものであり、本番ビルドのTerserに代わるものです。

Next.js Compilerを使用したコンパイルは、Babelより17倍速く、Next.js 12以降デフォルトで有効になっています。既存のBabel設定がある場合、またはサポートされていない機能を使用している場合、アプリケーションはNext.js Compilerをオプトアウトし、Babelを使用し続けます。

## なぜSWCなのか？

[SWC](http://swc.rs/)は、次世代の高速開発ツールの基盤となる拡張可能なRustベースのプラットフォームです。

SWCは、コンパイル、ミニファイケーション、バンドリングなどに使用でき、拡張するように設計されています。これは、コード変換（組み込みまたはカスタム）を実行するために呼び出すことができるものです。これらの変換の実行は、Next.jsのような上位レベルのツールを通じて行われます。

いくつかの理由でSWC上にビルドすることを選択しました:

- **拡張性:** SWCは、ライブラリをフォークしたり設計上の制約を回避したりする必要なく、Next.js内でCrateとして使用できます。
- **パフォーマンス:** SWCに切り替えることで、Next.jsで約3倍速いFast Refreshと約5倍速いビルドを実現でき、さらに最適化の余地があります。
- **WebAssembly:** RustのWASMサポートは、すべての可能なプラットフォームをサポートし、Next.jsの開発をどこにでも持っていくために不可欠です。
- **コミュニティ:** Rustのコミュニティとエコシステムは素晴らしく、成長し続けています。

## サポートされている機能

### Styled Components

`babel-plugin-styled-components`をNext.js Compilerに移植する作業を進めています。

まず、Next.jsの最新バージョンに更新してください: `npm install next@latest`。次に、`next.config.js`ファイルを更新してください:

```js filename="next.config.js"
module.exports = {
  compiler: {
    styledComponents: true,
  },
}
```

高度な使用例の場合、styled-components コンパイルの個々のプロパティを設定できます。

> 注: `minify`、`transpileTemplateLiterals`、および`pure`はまだ実装されていません。進捗状況は[こちら](https://github.com/vercel/next.js/issues/30802)で追跡できます。`ssr`および`displayName`変換は、Next.jsで`styled-components`を使用するための主な要件です。

```js filename="next.config.js"
module.exports = {
  compiler: {
    // オプションのドキュメント: https://styled-components.com/docs/tooling#babel-plugin を参照
    styledComponents: {
      // 開発中はデフォルトで有効、本番では無効にしてファイルサイズを削減,
      // この設定はすべての環境でデフォルトを上書きします。
      displayName?: boolean,
      // デフォルトで有効。
      ssr?: boolean,
      // デフォルトで有効。
      fileName?: boolean,
      // デフォルトで空。
      topLevelImportPaths?: string[],
      // デフォルトは["index"]。
      meaninglessFileNames?: string[],
      // デフォルトで有効。
      cssProp?: boolean,
      // デフォルトで空。
      namespace?: string,
      // まだサポートされていません。
      minify?: boolean,
      // まだサポートされていません。
      transpileTemplateLiterals?: boolean,
      // まだサポートされていません。
      pure?: boolean,
    },
  },
}
```

### Jest

Next.js CompilerはテストをトランスパイルでBabelなしでJestとシームレスに動作します。

まず、Next.jsの最新バージョンに更新してください: `npm install next@latest`。次に、`jest.config.js`ファイルを更新してください:

```js filename="jest.config.js"
const nextJest = require('next/jest')

// next.config.jsとNext.js app をロードできるようにするためのNext.jsアプリへのパスを提供
const createJestConfig = nextJest({ dir: './' })

// Jestに渡したいカスタム設定
const customJestConfig = {
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
}

// createJestConfigは、Next.jsが非同期設定の読み込みを処理できるようにするためにエクスポートされます
module.exports = createJestConfig(customJestConfig)
```

### Relay

[Relay](https://relay.dev/)サポートを有効にするには:

```js filename="next.config.js"
module.exports = {
  compiler: {
    relay: {
      // これはrelay.config.jsと一致する必要があります
      src: './',
      artifactDirectory: './__generated__',
      language: 'typescript',
      eagerEsModules: false,
    },
  },
}
```

> **知っておくと良いこと**: Next.jsでは、`pages`ディレクトリ内のすべてのJavaScriptファイルはルートと見なされます。したがって、`relay-compiler`の場合、`artifactDirectory`設定は`pages`の外に指定する必要があります。そうしないと、`relay-compiler`は`__generated__`ディレクトリ内のソースファイルの隣にファイルを生成し、このファイルがルートと見なされ、本番ビルドが壊れます。

### React プロパティの削除

JSXプロパティを削除できます。これはテストでよく使用されます。`babel-plugin-react-remove-properties`に似ています。

デフォルトの正規表現`^data-test`に一致するプロパティを削除するには:

```js filename="next.config.js"
module.exports = {
  compiler: {
    reactRemoveProperties: true,
  },
}
```

カスタムプロパティを削除するには:

```js filename="next.config.js"
module.exports = {
  compiler: {
    // ここで定義された正規表現はRustで処理されるため、
    // JavaScriptの `RegExp`とは構文が異なります。https://docs.rs/regex を参照してください。
    reactRemoveProperties: { properties: ['^data-custom$'] },
  },
}
```

### コンソールの削除

この変換により、アプリケーションコード内のすべての`console.*`呼び出しを削除できます（`node_modules`内ではありません）。`babel-plugin-transform-remove-console`に似ています。

すべての`console.*`呼び出しを削除:

```js filename="next.config.js"
module.exports = {
  compiler: {
    removeConsole: true,
  },
}
```

`console.error`以外の`console.*`出力を削除:

```js filename="next.config.js"
module.exports = {
  compiler: {
    removeConsole: {
      exclude: ['error'],
    },
  },
}
```

### レガシーデコレーター

Next.jsは、`jsconfig.json`または`tsconfig.json`の`experimentalDecorators`を自動的に検出します。レガシーデコレーターは、古いバージョンのライブラリ（`mobx`など）でよく使用されます。

このフラグは、既存のアプリケーションとの互換性のためにのみサポートされています。新しいアプリケーションでレガシーデコレーターを使用することはお勧めしません。

まず、Next.jsの最新バージョンに更新してください: `npm install next@latest`。次に、`jsconfig.json`または`tsconfig.json`ファイルを更新してください:

```js
{
  "compilerOptions": {
    "experimentalDecorators": true
  }
}
```

### importSource

Next.jsは、`jsconfig.json`または`tsconfig.json`の`jsxImportSource`を自動的に検出し、それを適用します。これは、[Theme UI](https://theme-ui.com)のようなライブラリでよく使用されます。

まず、Next.jsの最新バージョンに更新してください: `npm install next@latest`。次に、`jsconfig.json`または`tsconfig.json`ファイルを更新してください:

```js
{
  "compilerOptions": {
    "jsxImportSource": "theme-ui"
  }
}
```

### Emotion

`@emotion/babel-plugin`をNext.js Compilerに移植する作業を進めています。

まず、Next.jsの最新バージョンに更新してください: `npm install next@latest`。次に、`next.config.js`ファイルを更新してください:

```js filename="next.config.js"

module.exports = {
  compiler: {
    emotion: boolean | {
      // デフォルトは true。開発時は無効、本番時は有効にしてファイルサイズを削減します。
      sourceMap?: boolean,
      // デフォルトは 'dev-only'。
      autoLabel?: 'never' | 'dev-only' | 'always',
      // デフォルトは '[local]'。
      // 許可される値: `[local]` `[filename]` および `[dirname]`
      // このオプションは、autoLabelが'dev-only'または'always'に設定されている場合にのみ機能します。
      // 結果のラベルの形式を定義できます。
      // 形式は、文字列リテラルの部分を含む変数部分を介して定義されます。
      // 例えば labelFormat: "my-classname--[local]"、ここで[local]は結果に置き換えられる変数部分です。
      labelFormat?: string,
      // デフォルトは undefined。
      // このオプションを使用すると、コンパイラーにどのimportをどのように見るべきかを伝えることができます。
      // 例えばemotionのすべてのexportを使用するが、ビルドしたくない場合に使用できます。
      importMap?: {
        [packageName: string]: {
          [exportName: string]: {
            canonicalImport?: [string, string],
            styledBaseImport?: [string, string],
          }
        }
      },
    },
  },
}
```

### ミニフィケーション

Next.jsのswcコンパイラーは、v13から本番ビルドのミニフィケーションに使用されます。これはTerserよりも7倍速いです。

何らかの理由でTerserがまだ必要な場合は、これを設定できます。

```js filename="next.config.js"
module.exports = {
  swcMinify: false,
}
```

### モジュールトランスパイレーション

Next.jsは、ローカルパッケージ（monoreposなど）または外部依存関係（`node_modules`）から依存関係を自動的にトランスパイルおよびバンドルできます。これは、`next-transpile-modules`パッケージに代わるものです。

```js filename="next.config.js"
module.exports = {
  transpilePackages: ['@acme/ui', 'lodash-es'],
}
```

### Modularize Imports

このオプションは、バージョン13.5で[`optimizePackageImports`](/docs/app/api-reference/config/next-config-js/optimizePackageImports)に置き換えられました。より多くのパッケージで動作し、手動設定が不要な新しいオプションにアップグレードすることをお勧めします。

## 実験的な機能

### SWC トレースプロファイリング

SWCの内部変換トレースをchromitraceプロファイルとして生成できます。

```js filename="next.config.js"
module.exports = {
  experimental: {
    swcTraceProfiling: true,
  },
}
```

有効にすると、swcは`.next/`下に`swc-trace-profile-${timestamp}.json`という名前のトレースを生成します。Chromeのtrace viewer（chrome://tracing/、https://ui.perfetto.dev/）、または互換性のあるflamegraphビューア（https://www.speedscope.app/）は、生成されたトレースをロードおよび視覚化できます。

### SWC プラグイン（実験的）

wasm を使用して書かれたSWCの実験的なプラグインサポートを使用して、変換動作をカスタマイズするように swc の変換を設定できます。

```js filename="next.config.js"
module.exports = {
  experimental: {
    swcPlugins: [
      [
        'plugin',
        {
          ...pluginOptions,
        },
      ],
    ],
  },
}
```

`swcPlugins`は、プラグインを設定するためのタプルの配列を受け入れます。プラグインのタプルには、プラグインへのパスとプラグイン設定のオブジェクトが含まれています。プラグインへのパスには、npm モジュールパッケージ名または`.wasm`バイナリ自体への絶対パスを指定できます。

## サポートされていない機能

アプリケーションに`.babelrc`ファイルがある場合、Next.jsは個々のファイルの変換に**Babel を使用する**ように自動的にフォールバックします。これにより、カスタムBabelプラグインを利用する既存のアプリケーションとの後方互換性が保証されます。

カスタムBabel設定を使用している場合は、[設定を共有してください](https://github.com/vercel/next.js/discussions/30174)。できるだけ多くの一般的に使用されるBabel変換を移植するとともに、将来的にプラグインをサポートするよう取り組んでいます。

## バージョン履歴

| バージョン | 変更内容                                                                                                                                                              |
| ---------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `v13.1.0`  | [Module Transpilation](https://nextjs.org/blog/next-13-1#import-resolution-for-smaller-bundles)および[Modularize Imports](https://nextjs.org/blog/next-13-1#import-resolution-for-smaller-bundles)が安定版。 |
| `v13.0.0`  | SWC Minifierがデフォルトで有効になりました。                                                                                                                                |
| `v12.3.0`  | SWC Minifierが[安定版](https://nextjs.org/blog/next-12-3#swc-minifier-stable)。                                                                                         |
| `v12.2.0`  | [SWC Plugins](#swc-plugins-experimental)実験的サポートが追加されました。                                                                                                  |
| `v12.1.0`  | Styled Components、Jest、Relay、Remove React Properties、Legacy Decorators、Remove Console、およびjsxImportSourceのサポートが追加されました。                              |
| `v12.0.0`  | Next.js Compilerが[導入](https://nextjs.org/blog/next-12)されました。                                                                                                   |
