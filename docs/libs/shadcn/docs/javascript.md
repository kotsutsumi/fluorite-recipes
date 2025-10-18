# JavaScript - shadcn/ui

このページでは、shadcn/ui を JavaScript プロジェクトで使用する方法について説明しています。

## 概要

このプロジェクトとコンポーネントは TypeScript で記述されていますが、JavaScript バージョンのコンポーネントも提供されています。JavaScript バージョンは [CLI](/docs/cli) を通じて利用可能です。

## TypeScriptとJavaScriptの選択

shadcn/uiは、TypeScriptとJavaScriptの両方をサポートしています：

### TypeScript（推奨）
- 型安全性
- より良いIDE補完
- リファクタリングが容易
- 実行時エラーの削減

### JavaScript
- セットアップが簡単
- TypeScriptの知識不要
- 既存のJavaScriptプロジェクトに適合

## JavaScriptモードの設定

### 1. components.jsonの設定

TypeScript を使用しない場合、`components.json` ファイルで `tsx` フラグを無効にできます：

```json
{
  "style": "default",
  "tailwind": {
    "config": "tailwind.config.js",
    "css": "src/app/globals.css",
    "baseColor": "zinc",
    "cssVariables": true
  },
  "rsc": false,
  "tsx": false,
  "aliases": {
    "utils": "~/lib/utils",
    "components": "~/components"
  }
}
```

### 2. インポートエイリアスの設定

インポートエイリアスを設定するには、以下の `jsconfig.json` を使用できます：

```json
{
  "compilerOptions": {
    "paths": {
      "@/*": ["./*"]
    }
  }
}
```

### 3. より詳細な設定

プロジェクトルートに`jsconfig.json`を作成：

```json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"],
      "@/components/*": ["./src/components/*"],
      "@/lib/*": ["./src/lib/*"],
      "@/hooks/*": ["./src/hooks/*"]
    },
    "target": "es2017",
    "lib": ["es2017", "dom", "dom.iterable"],
    "module": "commonjs",
    "jsx": "react-jsx",
    "moduleResolution": "node",
    "resolveJsonModule": true,
    "allowSyntheticDefaultImports": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true
  },
  "include": [
    "src/**/*",
    ".next/types/**/*.js"
  ],
  "exclude": [
    "node_modules"
  ]
}
```

## JavaScriptでのコンポーネント使用

### コンポーネントの追加

CLIを使用してコンポーネントを追加すると、自動的にJavaScript版が追加されます：

```bash
npx shadcn@latest add button
```

### コンポーネントの使用例

#### Button Component

```jsx
import { Button } from "@/components/ui/button"

export default function MyComponent() {
  return (
    <Button onClick={() => console.log("clicked")}>
      クリック
    </Button>
  )
}
```

#### Card Component

```jsx
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

export default function MyCard() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>カードタイトル</CardTitle>
        <CardDescription>カードの説明</CardDescription>
      </CardHeader>
      <CardContent>
        <p>カードのコンテンツ</p>
      </CardContent>
      <CardFooter>
        <p>カードのフッター</p>
      </CardFooter>
    </Card>
  )
}
```

#### Form with useState

```jsx
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export default function LoginForm() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  const handleSubmit = (e) => {
    e.preventDefault()
    console.log({ email, password })
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className="space-y-4">
        <div>
          <Label htmlFor="email">メール</Label>
          <Input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div>
          <Label htmlFor="password">パスワード</Label>
          <Input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <Button type="submit">ログイン</Button>
      </div>
    </form>
  )
}
```

## PropTypesの使用

型チェックのために、PropTypesを使用できます：

```bash
npm install prop-types
```

```jsx
import PropTypes from "prop-types"
import { Button } from "@/components/ui/button"

function CustomButton({ children, variant, onClick }) {
  return (
    <Button variant={variant} onClick={onClick}>
      {children}
    </Button>
  )
}

CustomButton.propTypes = {
  children: PropTypes.node.isRequired,
  variant: PropTypes.oneOf(["default", "destructive", "outline", "ghost"]),
  onClick: PropTypes.func,
}

CustomButton.defaultProps = {
  variant: "default",
  onClick: undefined,
}

export default CustomButton
```

## JSDocの使用

JSDocコメントを使用して型情報を提供できます：

```jsx
/**
 * カスタムボタンコンポーネント
 * @param {Object} props - コンポーネントのプロパティ
 * @param {React.ReactNode} props.children - ボタンの内容
 * @param {"default"|"destructive"|"outline"|"ghost"} [props.variant="default"] - ボタンのスタイル
 * @param {() => void} [props.onClick] - クリックハンドラー
 * @returns {JSX.Element}
 */
function CustomButton({ children, variant = "default", onClick }) {
  return (
    <Button variant={variant} onClick={onClick}>
      {children}
    </Button>
  )
}

export default CustomButton
```

## フレームワーク別の設定

### Next.js (JavaScript)

```javascript
// next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
}

module.exports = nextConfig
```

### Vite (JavaScript)

```javascript
// vite.config.js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
})
```

### Create React App (JavaScript)

```javascript
// craco.config.js (Create React App with CRACO)
const path = require('path')

module.exports = {
  webpack: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },
}
```

## よくある質問

### Q: すべてのコンポーネントはJavaScriptで動作しますか？
A: はい、すべてのshadcn/uiコンポーネントはJavaScriptバージョンがあります。

### Q: JavaScriptからTypeScriptに移行できますか？
A: はい、段階的に移行できます。ファイルを`.jsx`から`.tsx`に変更し、型を追加していきます。

### Q: パフォーマンスに違いはありますか？
A: いいえ、JavaScriptとTypeScriptのパフォーマンスは実行時には同じです。TypeScriptはビルド時に型チェックを行います。

### Q: IDEの補完は機能しますか？
A: はい、`jsconfig.json`を正しく設定すれば、VSCodeなどのIDEでインポートパスの補完が機能します。

## 推奨事項

**プロジェクトでは TypeScript の使用を推奨していますが**、JavaScript での利用も完全にサポートされています。

### TypeScriptを推奨する理由

1. **型安全性:** 実行時エラーを減らす
2. **より良いツールサポート:** IDEの補完とリファクタリング
3. **ドキュメント化:** コードが自己文書化される
4. **チーム開発:** 大規模プロジェクトでの保守性向上

### JavaScriptが適している場合

1. **小規模プロジェクト:** プロトタイプやスモールスケール
2. **学習目的:** Reactの基本を学ぶ段階
3. **レガシーコードベース:** 既存のJavaScriptプロジェクト
4. **迅速な開発:** 素早くMVPを構築

## リソース

- [JavaScript Documentation](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
- [JSDoc Documentation](https://jsdoc.app/)
- [PropTypes Documentation](https://reactjs.org/docs/typechecking-with-proptypes.html)
- [jsconfig.json Reference](https://code.visualstudio.com/docs/languages/jsconfig)

## デプロイメント

### Vercelでshadcn/uiアプリをデプロイ

OpenAI、Sonos、Adobeなどに信頼されています。Vercelは、アプリと機能を大規模にデプロイするためのツールとインフラストラクチャを提供します。

JavaScriptプロジェクトもTypeScriptプロジェクトと同様に簡単にデプロイできます。

[Vercelにデプロイ](https://vercel.com/new?utm_source=shadcn_site&utm_medium=web&utm_campaign=docs_cta_deploy_now_callout)

## クレジット

[shadcn](https://twitter.com/shadcn)が[Vercel](https://vercel.com/new?utm_source=shadcn_site&utm_medium=web&utm_campaign=docs_cta_deploy_now_callout)で作成。ソースコードは[GitHub](https://github.com/shadcn-ui/ui)で利用可能です。