# マニュアルインストール

## Tailwind CSSの追加

コンポーネントはTailwind CSSを使用してスタイル付けされています。プロジェクトにTailwind CSSをインストールする必要があります。

[Tailwind CSSのインストール手順に従ってください。](https://tailwindcss.com/docs/installation)

## 依存関係の追加

プロジェクトに以下の依存関係を追加します：

pnpmnpmyarnbun

```bash
pnpm add class-variance-authority clsx tailwind-merge lucide-react tw-animate-css
```

## パスエイリアスの設定

`tsconfig.json`ファイルでパスエイリアスを設定します。

tsconfig.json

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

`@`エイリアスは推奨設定です。他のエイリアスを使用することもできます。

## スタイルの設定

styles/globals.cssファイルに以下を追加します。テーマ設定のCSSの変数の詳細は、[テーマセクション](/docs/theming)で学べます。

src/styles/globals.css

```css
@import "tailwindcss";
@import "tw-animate-css";

@layer base {
  :root {
    --background: 0 0% 100%;
    --foreground: 0 0% 3.9%;
    --card: 0 0% 100%;
    --card-foreground: 0 0% 3.9%;
    --popover: 0 0% 100%;
    --popover-foreground: 0 0% 3.9%;
    --primary: 0 0% 9%;
    --primary-foreground: 0 0% 98%;
    --secondary: 0 0% 96.1%;
    --secondary-foreground: 0 0% 9%;
    --muted: 0 0% 96.1%;
    --muted-foreground: 0 0% 45.1%;
    --accent: 0 0% 96.1%;
    --accent-foreground: 0 0% 9%;
    --destructive: 0 84.2% 60.2%;
    --destructive-foreground: 0 0% 98%;
    --border: 0 0% 89.8%;
    --input: 0 0% 89.8%;
    --ring: 0 0% 3.9%;
    --chart-1: 12 76% 61%;
    --chart-2: 173 58% 39%;
    --chart-3: 197 37% 24%;
    --chart-4: 43 74% 66%;
    --chart-5: 27 87% 67%;
    --radius: 0.5rem;
  }
  .dark {
    --background: 0 0% 3.9%;
    --foreground: 0 0% 98%;
    --card: 0 0% 3.9%;
    --card-foreground: 0 0% 98%;
    --popover: 0 0% 3.9%;
    --popover-foreground: 0 0% 98%;
    --primary: 0 0% 98%;
    --primary-foreground: 0 0% 9%;
    --secondary: 0 0% 14.9%;
    --secondary-foreground: 0 0% 98%;
    --muted: 0 0% 14.9%;
    --muted-foreground: 0 0% 63.9%;
    --accent: 0 0% 14.9%;
    --accent-foreground: 0 0% 98%;
    --destructive: 0 62.8% 30.6%;
    --destructive-foreground: 0 0% 98%;
    --border: 0 0% 14.9%;
    --input: 0 0% 14.9%;
    --ring: 0 0% 83.1%;
    --chart-1: 220 70% 50%;
    --chart-2: 160 60% 45%;
    --chart-3: 30 80% 55%;
    --chart-4: 280 65% 60%;
    --chart-5: 340 75% 55%;
  }
}

@layer base {
  * {
    @apply border-border;
  }
  body {
    @apply bg-background text-foreground;
  }
}
```

## cnヘルパーの追加

lib/utils.ts

```typescript
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
```

## `components.json`ファイルの作成

プロジェクトのルートに`components.json`ファイルを作成します。

components.json

```json
{
  "$schema": "https://ui.shadcn.com/schema.json",
  "style": "new-york",
  "rsc": true,
  "tsx": true,
  "tailwind": {
    "config": "tailwind.config.js",
    "css": "src/styles/globals.css",
    "baseColor": "neutral",
    "cssVariables": true
  },
  "aliases": {
    "components": "@/components",
    "utils": "@/lib/utils"
  }
}
```

## コンポーネントの追加

これで、プロジェクトにコンポーネントを追加できます。

```bash
pnpm dlx shadcn@latest add button
```

上記のコマンドは、`Button`コンポーネントをプロジェクトに追加します。

## まとめ

マニュアルインストールでは、Tailwind CSS、必要な依存関係、パスエイリアス、スタイル設定、ユーティリティ関数、設定ファイルを手動で設定します。この方法は、プロジェクトの構造を完全に制御したい場合に適しています。
