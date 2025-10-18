# Vite

## プロジェクトの作成

Viteを使用して新しいReactプロジェクトを作成します。**React + TypeScript**テンプレートを選択します：

pnpmnpmyarnbun

```bash
pnpm create vite@latest
```

### Tailwind CSSの追加

pnpmnpmyarnbun

```bash
pnpm add tailwindcss @tailwindcss/vite
```

`src/index.css`のすべての内容を以下に置き換えます：

src/index.css

```css
@import "tailwindcss";
```

### tsconfig.jsonファイルの編集

現在のViteのバージョンでは、TypeScript設定が3つのファイルに分割されており、そのうち2つを編集する必要があります。`tsconfig.json`と`tsconfig.app.json`の`compilerOptions`セクションに`baseUrl`と`paths`プロパティを追加します。

### vite.config.tsの更新

パスを解決するために、以下のコードを`vite.config.ts`に追加します：

pnpmnpmyarnbun

```bash
pnpm add -D @types/node
```

vite.config.ts

```typescript
import path from "path"
import tailwindcss from "@tailwindcss/vite"
import react from "@vitejs/plugin-react"
import { defineConfig } from "vite"

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
})
```

### CLIの実行

プロジェクトをセットアップするために、`shadcn` initコマンドを実行します：

pnpmnpmyarnbun

```bash
pnpm dlx shadcn@latest init
```

いくつかの質問に答えて`components.json`を設定します。

### コンポーネントの追加

プロジェクトにコンポーネントを追加できます。

```bash
pnpm dlx shadcn@latest add button
```

上記のコマンドは、`Button`コンポーネントをプロジェクトに追加します。
