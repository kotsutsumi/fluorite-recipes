# Remix

Remixアプリケーションにダークモードを追加する

## Tailwind CSSファイルの変更

`:root[class~="dark"]` をTailwind CSSファイルに追加します。これにより、htmlの要素に `dark` クラスを使用してダークモードのスタイルを適用できます。

`app/tailwind.css`

```css
@layer base {
  :root {
    --background: 0 0% 100%;
    --foreground: 222.2 84% 4.9%;

    /* その他のカラー変数 */
  }

  .dark, :root[class~="dark"] {
    --background: 222.2 84% 4.9%;
    --foreground: 210 40% 98%;

    /* その他のカラー変数 */
  }
}
```

## remix-themesのインストール

まず、`remix-themes` をインストールします：

```bash
pnpm add remix-themes
```

## セッションストレージとテーマセッションリゾルバの作成

セッションストレージとテーマセッションリゾルバを設定します。

`app/sessions.server.tsx`

```typescript
import { createCookieSessionStorage } from "@remix-run/node"
import { createThemeSessionResolver } from "remix-themes"

const sessionStorage = createCookieSessionStorage({
  cookie: {
    name: "theme",
    path: "/",
    httpOnly: true,
    sameSite: "lax",
    secrets: ["s3cr3t"],
    // Set domain and secure only if in production
    ...(process.env.NODE_ENV === "production"
      ? { domain: "your-domain.com", secure: true }
      : {}),
  },
})

export const themeSessionResolver = createThemeSessionResolver(sessionStorage)
```

## Remix Themesの設定

ルートレイアウトに `ThemeProvider` を追加します。

`app/root.tsx`

```typescript
import { LoaderFunctionArgs } from "@remix-run/node"
import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLoaderData,
} from "@remix-run/react"
import clsx from "clsx"
import {
  PreventFlashOnWrongTheme,
  ThemeProvider,
  useTheme,
} from "remix-themes"

import { themeSessionResolver } from "./sessions.server"

export async function loader({ request }: LoaderFunctionArgs) {
  const { getTheme } = await themeSessionResolver(request)
  return {
    theme: getTheme(),
  }
}

export default function AppWithProviders() {
  const data = useLoaderData<typeof loader>()
  return (
    <ThemeProvider specifiedTheme={data.theme} themeAction="/action/set-theme">
      <App />
    </ThemeProvider>
  )
}

export function App() {
  const data = useLoaderData<typeof loader>()
  const [theme] = useTheme()
  return (
    <html lang="en" className={clsx(theme)}>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <PreventFlashOnWrongTheme ssrTheme={Boolean(data.theme)} />
        <Links />
      </head>
      <body>
        <Outlet />
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  )
}
```

## アクションルートの追加

`app/routes/action.set-theme.ts` にファイルを作成します。このルートは、ユーザーがテーマを変更したときに優先テーマをセッションストレージに保存するために使用されます。

```typescript
import { createThemeAction } from "remix-themes"

import { themeSessionResolver } from "../sessions.server"

export const action = createThemeAction(themeSessionResolver)
```

## モードトグルの追加

サイト上にモードトグルを配置し、ライトモードとダークモードを切り替えられるようにします。

`app/components/mode-toggle.tsx`

```typescript
import { Moon, Sun } from "lucide-react"
import { Theme, useTheme } from "remix-themes"

import { Button } from "./ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu"

export function ModeToggle() {
  const [, setTheme] = useTheme()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon">
          <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          <span className="sr-only">テーマを切り替え</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => setTheme(Theme.LIGHT)}>
          ライト
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme(Theme.DARK)}>
          ダーク
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
```
