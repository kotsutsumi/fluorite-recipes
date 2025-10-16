# Astro

Astroアプリケーションにダークモードを追加する

## インラインテーマスクリプトの作成

ページの読み込み時にテーマの設定を処理するインラインスクリプトを追加します。このスクリプトは以下の機能を提供します：

- ローカルストレージからテーマ設定を読み込み
- システムの環境設定に基づくテーマの自動検出
- テーマ変更の監視とローカルストレージへの保存

`src/pages/index.astro`

```astro
---
import '../styles/globals.css'
---

<script is:inline>
	const getThemePreference = () => {
		if (typeof localStorage !== 'undefined' && localStorage.getItem('theme')) {
			return localStorage.getItem('theme');
		}
		return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
	};
	const isDark = getThemePreference() === 'dark';
	document.documentElement.classList[isDark ? 'add' : 'remove']('dark');

	if (typeof localStorage !== 'undefined') {
		const observer = new MutationObserver(() => {
			const isDark = document.documentElement.classList.contains('dark');
			localStorage.setItem('theme', isDark ? 'dark' : 'light');
		});
		observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
	}
</script>

<html lang="en">
	<body>
		<h1>Astro</h1>
	</body>
</html>
```

## モードトグルの追加

ユーザーがライトモードとダークモードを切り替えられるトグルコンポーネントを作成します。

`src/components/ModeToggle.tsx`

```tsx
import * as React from "react"
import { Moon, Sun } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export function ModeToggle() {
  const [theme, setThemeState] = React.useState<
    "theme-light" | "dark" | "system"
  >("theme-light")

  React.useEffect(() => {
    const isDarkMode = document.documentElement.classList.contains("dark")
    setThemeState(isDarkMode ? "dark" : "theme-light")
  }, [])

  React.useEffect(() => {
    const isDark =
      theme === "dark" ||
      (theme === "system" &&
        window.matchMedia("(prefers-color-scheme: dark)").matches)
    document.documentElement.classList[isDark ? "add" : "remove"]("dark")
  }, [theme])

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon">
          <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          <span className="sr-only">テーマを切り替え</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => setThemeState("theme-light")}>
          ライト
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setThemeState("dark")}>
          ダーク
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setThemeState("system")}>
          システム
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
```
