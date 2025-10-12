# src フォルダ

Next.jsプロジェクトでは、アプリケーションコードをプロジェクト設定ファイルから分離するために、`src`ディレクトリを使用できます。

## 概要

`src`フォルダは、Next.jsアプリケーションの代替プロジェクト構造です。多くの開発者やチームが好む、アプリケーションコードを専用の`src`ディレクトリに配置する方法を提供します。

## 使い方

プロジェクトのルートに`app`または`pages`ディレクトリを配置する代わりに、`src/app`または`src/pages`ディレクトリに配置できます。

```
my-next-app/
├── src/
│   └── app/
│       ├── layout.tsx
│       ├── page.tsx
│       └── ...
├── public/
├── next.config.js
├── package.json
└── tsconfig.json
```

## 重要な考慮事項

### `public`ディレクトリ

`public`ディレクトリは、プロジェクトのルートに残す必要があります。`src/public`に移動することはできません。

```
my-next-app/
├── src/
│   └── app/
├── public/          # ルートに配置
│   ├── favicon.ico
│   └── images/
├── next.config.js
└── package.json
```

### 設定ファイル

以下の設定ファイルはプロジェクトのルートに残す必要があります：

- `next.config.js`
- `package.json`
- `tsconfig.json`
- `.eslintrc.json`
- `.env`、`.env.local`、`.env.*`ファイル
- その他の設定ファイル

```
my-next-app/
├── src/
│   └── app/
├── public/
├── next.config.js     # ルートに配置
├── package.json       # ルートに配置
├── tsconfig.json      # ルートに配置
├── .eslintrc.json     # ルートに配置
└── .env               # ルートに配置
```

### 優先順位

ルートディレクトリに`app`または`pages`が存在する場合、それらは`src/app`または`src/pages`よりも優先されます。

```
# ❌ 混在させないでください
my-next-app/
├── app/               # これが使用されます
│   └── page.tsx
├── src/
│   └── app/           # これは無視されます
│       └── page.tsx
```

`src`フォルダを使用する場合は、すべてのアプリケーションコードを`src`内に配置してください。

```
# ✅ 正しい使い方
my-next-app/
├── src/
│   └── app/           # これが使用されます
│       └── page.tsx
├── public/
└── next.config.js
```

## 追加のフォルダ

`src`ディレクトリを使用する場合、他のアプリケーションフォルダも`src`内に移動できます：

```
my-next-app/
├── src/
│   ├── app/
│   │   ├── layout.tsx
│   │   └── page.tsx
│   ├── components/      # コンポーネントフォルダ
│   │   ├── Header.tsx
│   │   └── Footer.tsx
│   ├── lib/            # ユーティリティフォルダ
│   │   └── utils.ts
│   └── styles/         # スタイルフォルダ
│       └── globals.css
├── public/
└── next.config.js
```

## Middlewareの配置

`src`フォルダを使用する場合、`middleware.ts`（または`middleware.js`）ファイルは`src`ディレクトリ内に配置する必要があります。

```
my-next-app/
├── src/
│   ├── middleware.ts   # ここに配置
│   └── app/
│       ├── layout.tsx
│       └── page.tsx
├── public/
└── next.config.js
```

## TypeScriptパス設定

`src`フォルダを使用する場合、`tsconfig.json`のパスエイリアスを更新する必要がある場合があります。

```json
// tsconfig.json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    }
  }
}
```

これにより、インポートで`@/`エイリアスを使用できます：

```tsx
// src/app/page.tsx
import { Button } from '@/components/Button'
import { formatDate } from '@/lib/utils'

export default function HomePage() {
  return (
    <div>
      <Button>Click me</Button>
    </div>
  )
}
```

## Tailwind CSSの設定

Tailwind CSSを使用している場合、`tailwind.config.js`の`content`セクションを更新して`src`ディレクトリを含める必要があります。

```js
// tailwind.config.js
module.exports = {
  content: [
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
```

## ESLintの設定

ESLintを使用している場合、`.eslintrc.json`の設定を更新する必要がある場合があります。

```json
// .eslintrc.json
{
  "extends": "next/core-web-vitals",
  "settings": {
    "import/resolver": {
      "typescript": {
        "project": "./tsconfig.json"
      }
    }
  }
}
```

## 実用例

### App Routerでの`src`フォルダ

```
my-next-app/
├── src/
│   └── app/
│       ├── layout.tsx
│       ├── page.tsx
│       ├── about/
│       │   └── page.tsx
│       └── blog/
│           ├── page.tsx
│           └── [slug]/
│               └── page.tsx
├── public/
│   ├── favicon.ico
│   └── images/
├── next.config.js
├── package.json
└── tsconfig.json
```

### コンポーネントとユーティリティを含む構造

```
my-next-app/
├── src/
│   ├── app/
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   └── dashboard/
│   │       └── page.tsx
│   ├── components/
│   │   ├── ui/
│   │   │   ├── Button.tsx
│   │   │   └── Card.tsx
│   │   └── layout/
│   │       ├── Header.tsx
│   │       └── Footer.tsx
│   ├── lib/
│   │   ├── utils.ts
│   │   └── api.ts
│   └── styles/
│       └── globals.css
├── public/
└── next.config.js
```

## 利点

### 明確な分離

アプリケーションコードとプロジェクト設定を明確に分離できます。

```
my-next-app/
├── src/                  # アプリケーションコード
│   └── app/
├── public/               # 静的ファイル
├── next.config.js        # 設定
├── package.json          # 依存関係
└── tsconfig.json         # TypeScript設定
```

### クリーンなルートディレクトリ

プロジェクトのルートディレクトリがクリーンで、設定ファイルのみが含まれます。

### チームの慣習

多くの開発者やチームが、アプリケーションコードを専用のディレクトリに配置することを好みます。

## 移行ガイド

既存のNext.jsプロジェクトを`src`フォルダ構造に移行する手順：

### ステップ1：`src`ディレクトリを作成

```bash
mkdir src
```

### ステップ2：`app`または`pages`を移動

```bash
mv app src/
# または
mv pages src/
```

### ステップ3：他のアプリケーションフォルダを移動（オプション）

```bash
mv components src/
mv lib src/
mv styles src/
```

### ステップ4：Middlewareを移動（存在する場合）

```bash
mv middleware.ts src/
# または
mv middleware.js src/
```

### ステップ5：設定ファイルを更新

`tsconfig.json`、`tailwind.config.js`などの設定ファイルを更新して、新しいパス構造を反映させます。

### ステップ6：動作確認

```bash
npm run dev
```

開発サーバーを起動して、すべてが正しく動作することを確認します。

## 注意事項

### `public`ディレクトリは移動しない

`public`ディレクトリは常にプロジェクトのルートに残す必要があります。

### 設定ファイルは移動しない

Next.jsの設定ファイルや環境変数ファイルはルートに残す必要があります。

### 混在させない

`app`または`pages`ディレクトリをルートと`src`の両方に配置しないでください。一方のみを使用してください。

## バージョン履歴

| バージョン | 変更内容 |
| --- | --- |
| `v13.0.0` | App Router で `src` フォルダがサポート |
| `v9.1.0` | `src` フォルダが正式にサポート |
