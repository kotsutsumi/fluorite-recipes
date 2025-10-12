# mdx-components.js

`mdx-components.js`（または`.tsx`）ファイルは、Next.js App RouterでMDXを使用する場合に**必須**です。このファイルは、プロジェクトのルートに配置する必要があり、`useMDXComponents()`という単一の関数をエクスポートする必要があります。

## 説明

`mdx-components.js`ファイルは、Next.jsアプリケーションでMDXを設定するために必要です。これにより、MDXコンテンツのカスタムコンポーネントやスタイルを定義できます。

### 基本的な使用方法

```ts title="mdx-components.ts"
import type { MDXComponents } from 'mdx/types'

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    ...components,
  }
}
```

### TypeScriptの例

```tsx title="mdx-components.tsx"
import type { MDXComponents } from 'mdx/types'

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    ...components,
  }
}
```

## 関数

### `useMDXComponents()`

この関数は、MDXコンテンツで使用されるコンポーネントをカスタマイズするために使用されます。

**パラメータ:**

- `components`: MDXコンポーネントのオブジェクト

**戻り値:**

- カスタマイズされたMDXコンポーネントのオブジェクト

## 例

### カスタム見出しコンポーネント

```tsx title="mdx-components.tsx"
import type { MDXComponents } from 'mdx/types'

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    h1: ({ children }) => (
      <h1 className="text-4xl font-bold text-blue-600">{children}</h1>
    ),
    h2: ({ children }) => (
      <h2 className="text-3xl font-semibold text-blue-500">{children}</h2>
    ),
    ...components,
  }
}
```

### カスタム画像コンポーネント

```tsx title="mdx-components.tsx"
import Image from 'next/image'
import type { MDXComponents } from 'mdx/types'

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    img: (props) => (
      <Image
        sizes="100vw"
        style={{ width: '100%', height: 'auto' }}
        {...(props as any)}
      />
    ),
    ...components,
  }
}
```

### カスタムコードブロック

```tsx title="mdx-components.tsx"
import type { MDXComponents } from 'mdx/types'

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    code: ({ children, className }) => (
      <code className={`${className} bg-gray-100 rounded px-1 py-0.5`}>
        {children}
      </code>
    ),
    pre: ({ children }) => (
      <pre className="bg-gray-900 text-white p-4 rounded-lg overflow-x-auto">
        {children}
      </pre>
    ),
    ...components,
  }
}
```

### すべてのHTML要素のカスタマイズ

```tsx title="mdx-components.tsx"
import type { MDXComponents } from 'mdx/types'
import Image from 'next/image'

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    h1: ({ children }) => <h1 className="text-4xl font-bold">{children}</h1>,
    h2: ({ children }) => <h2 className="text-3xl font-bold">{children}</h2>,
    p: ({ children }) => <p className="my-4 leading-7">{children}</p>,
    a: ({ href, children }) => (
      <a href={href} className="text-blue-500 hover:underline">
        {children}
      </a>
    ),
    img: (props) => (
      <Image
        sizes="100vw"
        style={{ width: '100%', height: 'auto' }}
        {...(props as any)}
      />
    ),
    ul: ({ children }) => <ul className="list-disc ml-6 my-4">{children}</ul>,
    ol: ({ children }) => (
      <ol className="list-decimal ml-6 my-4">{children}</ol>
    ),
    blockquote: ({ children }) => (
      <blockquote className="border-l-4 border-gray-300 pl-4 italic my-4">
        {children}
      </blockquote>
    ),
    ...components,
  }
}
```

## 知っておくべきこと

- **必須ファイル**: Next.js App RouterでMDXを使用する場合、このファイルは必須です
- **配置場所**: プロジェクトのルートディレクトリに配置する必要があります
- **ファイル名**: `mdx-components.js`または`mdx-components.tsx`である必要があります
- **関数名**: エクスポートする関数は`useMDXComponents`という名前である必要があります
- **TypeScript**: TypeScriptを使用する場合は、`mdx/types`から`MDXComponents`型をインポートします

## MDXの設定

MDXを使用するには、プロジェクトに`@next/mdx`パッケージをインストールし、`next.config.js`で設定する必要があります。

```bash
npm install @next/mdx @mdx-js/loader @mdx-js/react
```

```js title="next.config.js"
const withMDX = require('@next/mdx')()

/** @type {import('next').NextConfig} */
const nextConfig = {
  pageExtensions: ['js', 'jsx', 'ts', 'tsx', 'md', 'mdx'],
}

module.exports = withMDX(nextConfig)
```

## バージョン履歴

| バージョン | 変更内容                     |
| ---------- | ---------------------------- |
| `v13.1.2`  | `mdx-components.js`が導入されました |
