# TanStack Start

## プロジェクトの作成

TanStack Start プロジェクトを作成するには、TanStack Start ウェブサイトの[スクラッチからプロジェクトをビルド](https://tanstack.com/start/latest/docs/framework/react/build-from-scratch)ガイドに従ってください。

**まだ Tailwind を追加しないでください。次のステップで Tailwind v4 をインストールします。**

## Tailwind の追加

`tailwindcss` とその依存関係をインストールします。

pnpmnpmyarnbun

```bash
pnpm add tailwindcss @tailwindcss/postcss postcss
```

## `postcss.config.ts` の作成

プロジェクトのルートに `postcss.config.ts` ファイルを作成します。

postcss.config.ts

```typescript
export default {
  plugins: {
    "@tailwindcss/postcss": {},
  },
}
```

## `app/styles/app.css` の作成

`app/styles` ディレクトリに `app.css` ファイルを作成し、`tailwindcss` をインポートします。

app/styles/app.css

```css
@import "tailwindcss" source("../");
```

## `app.css` のインポート

app/routes/__root.tsx

```typescript
import type { ReactNode } from "react"
import { createRootRoute, Outlet } from "@tanstack/react-router"
import { Meta, Scripts } from "@tanstack/start"
import appCss from "@/styles/app.css?url"

export const Route = createRootRoute({
  head: () => ({
    meta: [
      {
        charSet: "utf-8",
      },
      {
        name: "viewport",
        content: "width=device-width, initial-scale=1",
      },
      {
        title: "TanStack Start",
      },
    ],
    links: [
      {
        rel: "stylesheet",
        href: appCss,
      },
    ],
  }),
  component: RootComponent,
})

function RootComponent() {
  return (
    <RootDocument>
      <Outlet />
    </RootDocument>
  )
}

function RootDocument({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html>
      <head>
        <Meta />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  )
}
```

## CLIの実行

プロジェクトをセットアップするために、`shadcn` initコマンドを実行します：

```bash
pnpm dlx shadcn@latest init
```

## コンポーネントの追加

プロジェクトにコンポーネントを追加できます。

```bash
pnpm dlx shadcn@latest add button
```
