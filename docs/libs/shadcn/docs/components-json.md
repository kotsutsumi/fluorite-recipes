# components.json

## 概要

`components.json` ファイルは、プロジェクトの設定を保持するファイルです。

**注意:** `components.json` ファイルはオプションであり、CLIを使用してコンポーネントを追加する場合にのみ必要です。コピー＆ペーストでコンポーネントを追加する場合は不要です。

## ファイルの場所

プロジェクトのルートディレクトリに配置されます：

```
my-project/
├── components.json
├── package.json
└── ...
```

## 基本構造

```json
{
  "$schema": "https://ui.shadcn.com/schema.json",
  "style": "new-york",
  "tailwind": {
    "config": "tailwind.config.js",
    "css": "src/app/globals.css",
    "baseColor": "zinc",
    "cssVariables": true,
    "prefix": ""
  },
  "rsc": true,
  "tsx": true,
  "aliases": {
    "utils": "@/lib/utils",
    "components": "@/components",
    "ui": "@/components/ui",
    "lib": "@/lib",
    "hooks": "@/hooks"
  }
}
```

## 設定項目の詳細

### $schema
JSONスキーマの参照パスを指定します。これにより、IDEで自動補完とバリデーションが有効になります。

```json
"$schema": "https://ui.shadcn.com/schema.json"
```

### style
コンポーネントのスタイルを設定します。

利用可能な値：
- `default` - デフォルトスタイル
- `new-york` - New Yorkスタイル（推奨）

```json
"style": "new-york"
```

### tailwind
Tailwind CSSの設定を構成します。

#### config
Tailwindの設定ファイルのパスを指定します。

```json
"config": "tailwind.config.js"
```

#### css
Tailwind CSSをインポートするCSSファイルのパスを指定します。

```json
"css": "src/app/globals.css"
```

#### baseColor
デフォルトのカラーパレットを設定します。

利用可能な値：
- `neutral`
- `gray`
- `zinc`
- `slate`
- `stone`

```json
"baseColor": "zinc"
```

#### cssVariables
テーマ設定の方法を選択します。

- `true` - CSS変数を使用（推奨）
- `false` - Tailwindユーティリティクラスを使用

```json
"cssVariables": true
```

#### prefix
Tailwind CSSユーティリティクラスに接頭辞を追加します。

```json
"prefix": "tw-"
```

例：`tw-bg-primary`、`tw-text-foreground`

### rsc
React Server Componentsのサポートを有効/無効にします。

```json
"rsc": true
```

- `true` - Server Componentsをサポート（Next.js 13+）
- `false` - Client Componentsのみ

### tsx
TypeScriptまたはJavaScriptコンポーネントを選択します。

```json
"tsx": true
```

- `true` - TypeScript（.tsx）コンポーネント
- `false` - JavaScript（.jsx）コンポーネント

### aliases
インポートエイリアスの設定。これらはTypeScriptの`paths`設定と一致する必要があります。

```json
"aliases": {
  "utils": "@/lib/utils",
  "components": "@/components",
  "ui": "@/components/ui",
  "lib": "@/lib",
  "hooks": "@/hooks"
}
```

使用例：
```typescript
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { useToast } from "@/hooks/use-toast"
```

### registries
複数のリソースレジストリを設定可能です。プライベートレジストリの認証や環境変数の利用をサポートします。

```json
"registries": [
  {
    "name": "shadcn",
    "url": "https://ui.shadcn.com/r"
  },
  {
    "name": "acme",
    "url": "https://registry.acme.com",
    "token": "${ACME_REGISTRY_TOKEN}"
  }
]
```

## 実例

### Next.js プロジェクト

```json
{
  "$schema": "https://ui.shadcn.com/schema.json",
  "style": "new-york",
  "tailwind": {
    "config": "tailwind.config.ts",
    "css": "app/globals.css",
    "baseColor": "zinc",
    "cssVariables": true
  },
  "rsc": true,
  "tsx": true,
  "aliases": {
    "utils": "@/lib/utils",
    "components": "@/components",
    "ui": "@/components/ui"
  }
}
```

### Vite + React プロジェクト

```json
{
  "$schema": "https://ui.shadcn.com/schema.json",
  "style": "default",
  "tailwind": {
    "config": "tailwind.config.js",
    "css": "src/index.css",
    "baseColor": "slate",
    "cssVariables": true
  },
  "rsc": false,
  "tsx": true,
  "aliases": {
    "utils": "@/lib/utils",
    "components": "@/components"
  }
}
```

### JavaScript プロジェクト

```json
{
  "$schema": "https://ui.shadcn.com/schema.json",
  "style": "new-york",
  "tailwind": {
    "config": "tailwind.config.js",
    "css": "src/app/globals.css",
    "baseColor": "neutral",
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

## TypeScript設定との統合

`components.json`のaliases設定は、`tsconfig.json`または`jsconfig.json`の`paths`設定と一致する必要があります。

### tsconfig.json

```json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    }
  }
}
```

### jsconfig.json

```json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["./*"]
    }
  }
}
```

## CLIコマンドでの使用

`components.json`は、shadcn CLIコマンドによって読み取られ、使用されます：

```bash
# components.jsonの設定を使用してコンポーネントを追加
npx shadcn@latest add button

# components.jsonの設定を更新
npx shadcn@latest init
```

## ベストプラクティス

1. **バージョン管理:** `components.json`をバージョン管理システムにコミットします
2. **一貫性:** aliasesとTypeScript pathsを一致させます
3. **環境変数:** プライベートレジストリのトークンには環境変数を使用します
4. **ドキュメント化:** カスタム設定をチームと共有します

## トラブルシューティング

### インポートエラー
aliasesとTypeScript/JSConfig pathsが一致しているか確認してください。

### スタイリング問題
Tailwind設定ファイルとCSSファイルのパスが正しいか確認してください。

### レジストリ接続エラー
レジストリURLとトークン（必要な場合）が正しいか確認してください。

## デプロイメント

### Vercelでshadcn/uiアプリをデプロイ

OpenAI、Sonos、Adobeなどに信頼されています。Vercelは、アプリと機能を大規模にデプロイするためのツールとインフラストラクチャを提供します。

[Vercelにデプロイ](https://vercel.com/new?utm_source=shadcn_site&utm_medium=web&utm_campaign=docs_cta_deploy_now_callout)

## クレジット

[shadcn](https://twitter.com/shadcn)が[Vercel](https://vercel.com/new?utm_source=shadcn_site&utm_medium=web&utm_campaign=docs_cta_deploy_now_callout)で作成。ソースコードは[GitHub](https://github.com/shadcn-ui/ui)で利用可能です。