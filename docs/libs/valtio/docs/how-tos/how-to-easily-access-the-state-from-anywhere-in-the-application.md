# アプリケーション内のどこからでも簡単にstateにアクセスする方法

大規模なアプリケーションで作業する場合、コードを別々のファイルやディレクトリに整理することが一般的な方法であり、Valtioの**state**も例外ではありません。場合によっては、stateオブジェクトを独自のファイルに配置したい場合があります。独自のファイルに分離した後、アプリケーション内のどこからでも簡単にアクセスする方法が必要になります。

## Path Aliasesを使用してstateにアクセスする

stateが`/src/state.js`に配置され、`/src/really/deep/nested/file/myfile.js`にあるファイルで作業していると想像してください。stateのインポートは次のようになります：
`import state from '../../../../state';` これは、アプリケーション内の異なる場所で使用される場合、特に多くの頭脳計算を引き起こす可能性があります。

これに対する解決策は**Path Aliases**を使用することです。これはパスをよりシンプルな文字列にマッピングし、インポートはアプリケーション全体で次のようになります：

`import { state } from '@state';`

## JS ConfigとBabel Configの使用

1. `/src/state`ファイルを作成し、Valtioの**state**を配置します：

```js
import { proxy, useSnapshot, subscribe } from 'valtio'
const state = proxy({
  foos: [],
  bar: { ... },
  boo: false
})
export { state, useSnapshot, subscribe }
```

2. `/jsconfig.json`ファイル（またはTypeScriptを使用している場合は`/tsconfig.json`）を作成します：

```json
{
  "compilerOptions": {
    "baseUrl": "src",
    "paths": {
      "@state/*": ["./state/*"],
      "@mypath/*": ["./my/deep/path*"],
      "@anotherpath/*": ["./my/another/deep/path*"]
    }
  },
  "exclude": ["node_modules"]
}
```

> 💡 TypeScriptを使用していますか？参考リンクは以下です
>
> https://www.totaltypescript.com/tsconfig-cheat-sheet
> https://github.com/tsconfig/bases
