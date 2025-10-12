# browserDebugInfoInTerminal

この機能は現在実験的であり、変更される可能性があるため、本番環境での使用は推奨されません。試してみて、[GitHub](https://github.com/vercel/next.js/issues)でフィードバックを共有してください。

`experimental.browserDebugInfoInTerminal` オプションは、ブラウザで発生したコンソール出力とランタイムエラーを開発サーバーのターミナルに転送します。

このオプションはデフォルトで無効になっています。有効にした場合、開発モードでのみ機能します。

## 使用方法

転送を有効にする：

```typescript
import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  experimental: {
    browserDebugInfoInTerminal: true,
  },
}

export default nextConfig
```

### シリアライゼーションの制限

深くネストされたオブジェクト/配列は**適切なデフォルト値**を使用して切り捨てられます。これらの制限を調整できます：

- **depthLimit**: （オプション）ネストされたオブジェクト/配列の文字列化の深さ制限。デフォルト: 5
- **edgeLimit**: （オプション）オブジェクトまたは配列ごとに含めるプロパティまたは要素の最大数。デフォルト: 100

```typescript
import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  experimental: {
    browserDebugInfoInTerminal: {
      depthLimit: 5,
      edgeLimit: 100,
    },
  },
}

export default nextConfig
```

### ソースの場所

この機能が有効な場合、ソースの場所はデフォルトで含まれます。

```typescript
'use client'

export default function Home() {
  return (
    <button
      type="button"
      onClick={() => {
        console.log('Hello World')
      }}
    >
      Click me
    </button>
  )
}
```

ボタンをクリックすると、ターミナルに次のメッセージが出力されます：

```
[browser] Hello World (app/page.tsx:8:17)
```

それらを抑制するには、`showSourceLocation: false` を設定します。

- **showSourceLocation**: 利用可能な場合にソースの場所情報を含めます。

```typescript
import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  experimental: {
    browserDebugInfoInTerminal: {
      showSourceLocation: false,
    },
  },
}

export default nextConfig
```
