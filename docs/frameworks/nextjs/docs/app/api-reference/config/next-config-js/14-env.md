# env

これはレガシーAPIであり、推奨されなくなりました。下位互換性のためにサポートされています。

> [Next.js 9.4](https://nextjs.org/blog/next-9-4)のリリース以降、[環境変数の追加](/docs/app/guides/environment-variables)のためのより直感的で人間工学的なエクスペリエンスが提供されています。ぜひお試しください！

> **知っておくと良いこと**: この方法で指定された環境変数は**常に**JavaScriptバンドルに含まれます。環境変数名の前に `NEXT_PUBLIC_` を付けるのは、[環境または.envファイルを通じて指定する](/docs/app/guides/environment-variables)場合にのみ効果があります。

JavaScriptバンドルに環境変数を追加するには、`next.config.js` を開いて `env` 設定を追加します：

```javascript
module.exports = {
  env: {
    customKey: 'my-value',
  },
}
```

これで、コード内で `process.env.customKey` にアクセスできるようになります。例：

```javascript
function Page() {
  return <h1>The value of customKey is: {process.env.customKey}</h1>
}

export default Page
```

Next.jsはビルド時に `process.env.customKey` を `'my-value'` に置き換えます。webpackの[DefinePlugin](https://webpack.js.org/plugins/define-plugin/)の性質上、`process.env` 変数を分割代入しようとしても機能しません。

例えば、次の行：

```javascript
return <h1>The value of customKey is: {process.env.customKey}</h1>
```

は最終的に次のようになります：

```javascript
return <h1>The value of customKey is: {'my-value'}</h1>
```
