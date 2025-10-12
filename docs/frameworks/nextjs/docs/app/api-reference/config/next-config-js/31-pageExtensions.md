# pageExtensions

`next.config.js` の `pageExtensions` オプションを使用すると、Next.js がページに使用するデフォルトのファイル拡張子を変更できます。

## デフォルト拡張子

デフォルトの拡張子は次のとおりです:
- `.tsx`
- `.ts`
- `.jsx`
- `.js`

## 設定例

これらの拡張子を拡張または変更して、マークダウンなどの他のファイルタイプを含めることができます:

```javascript
const nextConfig = {
  pageExtensions: ['js', 'jsx', 'ts', 'tsx', 'md', 'mdx']
}
```

## MDX の統合

この設定により、Next.js は標準の JavaScript/TypeScript 拡張子に加えて、Markdown (`.md` および `.mdx`) ファイルを有効なページファイルとして認識します。

### MDX プラグインの使用例

```javascript
const withMDX = require('@next/mdx')()

const nextConfig = {
  pageExtensions: ['js', 'jsx', 'ts', 'tsx', 'md', 'mdx']
}

module.exports = withMDX(nextConfig)
```

この例は、`withMDX` プラグインを使用して MDX サポートを統合し、実際の Next.js プロジェクトでページ拡張子を拡張する方法を示しています。

## 柔軟性

この設定は柔軟で、開発者が Next.js がアプリケーション内のページファイルを識別および処理する方法をカスタマイズできるようにします。
