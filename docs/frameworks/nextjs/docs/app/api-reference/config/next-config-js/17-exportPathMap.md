# exportPathMap

これはレガシーAPIであり、推奨されなくなりました。下位互換性のためにサポートされています。

> この機能は `next export` 専用であり、現在は `pages` での `getStaticPaths` または `app` での `generateStaticParams` が推奨され、**非推奨**となっています。

`exportPathMap` を使用すると、エクスポート中に使用されるリクエストパスからページの宛先へのマッピングを指定できます。`exportPathMap` で定義されたパスは、[`next dev`](/docs/app/api-reference/cli/next#next-dev-options)を使用する際にも利用可能です。

例を使って説明しましょう。次のページを持つアプリの場合のカスタム `exportPathMap` を作成します：

- `pages/index.js`
- `pages/about.js`
- `pages/post.js`

`next.config.js` を開いて、次の `exportPathMap` 設定を追加します：

```javascript
module.exports = {
  exportPathMap: async function (
    defaultPathMap,
    { dev, dir, outDir, distDir, buildId }
  ) {
    return {
      '/': { page: '/' },
      '/about': { page: '/about' },
      '/p/hello-nextjs': { page: '/post', query: { title: 'hello-nextjs' } },
      '/p/learn-nextjs': { page: '/post', query: { title: 'learn-nextjs' } },
      '/p/deploy-nextjs': { page: '/post', query: { title: 'deploy-nextjs' } },
    }
  },
}
```

> **知っておくと良いこと**: `exportPathMap` の `query` フィールドは、[自動的に静的最適化されたページ](/docs/pages/building-your-application/rendering/automatic-static-optimization)や[`getStaticProps` ページ](/docs/pages/building-your-application/data-fetching/get-static-props)では使用できません。これらはビルド時にHTMLファイルとしてレンダリングされ、`next export` 中に追加のクエリ情報を提供できないためです。

ページはその後HTMLファイルとしてエクスポートされます。例えば、`/about` は `/about.html` になります。
