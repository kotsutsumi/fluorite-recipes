以下は、ダークモードに関するshadcn/uiのドキュメントページの日本語訳です：

# ダークモード

サイトにダークモードを追加する方法について説明します。

## 概要

shadcn/uiは、さまざまなフレームワークでダークモードをサポートしています。各フレームワークには、最適化された実装方法があります。

## サポートされているフレームワーク

### Next.js
Next.jsアプリケーションでダークモードを実装する方法。`next-themes`ライブラリを使用した実装が推奨されます。

[Next.jsのダークモード実装手順を見る](/docs/dark-mode/next)

### Vite
Viteプロジェクトでダークモードを実装する方法。React + Viteの組み合わせで動作します。

[Viteのダークモード実装手順を見る](/docs/dark-mode/vite)

### Astro
Astroサイトでダークモードを実装する方法。静的サイトとSSRの両方をサポートします。

[Astroのダークモード実装手順を見る](/docs/dark-mode/astro)

### Remix
Remixアプリケーションでダークモードを実装する方法。サーバーサイドレンダリングに対応しています。

[Remixのダークモード実装手順を見る](/docs/dark-mode/remix)

## ダークモードの実装パターン

### 1. CSSクラスベース（推奨）
`.dark`クラスを使用してダークモードを切り替えます。これは最も柔軟な方法です。

```css
:root {
  --background: oklch(1 0 0);
  --foreground: oklch(0.16 0 0);
}

.dark {
  --background: oklch(0.16 0 0);
  --foreground: oklch(0.98 0 0);
}
```

### 2. メディアクエリベース
OSのシステム設定に基づいて自動的に切り替えます。

```css
@media (prefers-color-scheme: dark) {
  :root {
    --background: oklch(0.16 0 0);
    --foreground: oklch(0.98 0 0);
  }
}
```

### 3. データ属性ベース
`data-theme`属性を使用してテーマを切り替えます。

```html
<html data-theme="dark">
  <!-- コンテンツ -->
</html>
```

## 一般的な実装手順

### 1. テーマプロバイダーのインストール

```bash
npm install next-themes
```

### 2. テーマプロバイダーの設定

```typescript
import { ThemeProvider } from "next-themes"

function App({ Component, pageProps }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <Component {...pageProps} />
    </ThemeProvider>
  )
}
```

### 3. テーマ切り替えコンポーネントの作成

```typescript
import { useTheme } from "next-themes"

function ThemeToggle() {
  const { theme, setTheme } = useTheme()

  return (
    <button onClick={() => setTheme(theme === "dark" ? "light" : "dark")}>
      テーマを切り替え
    </button>
  )
}
```

### 4. CSS変数の定義

`globals.css`にライトモードとダークモードの変数を定義します：

```css
:root {
  --background: oklch(1 0 0);
  --foreground: oklch(0.16 0 0);
  /* その他の変数 */
}

.dark {
  --background: oklch(0.16 0 0);
  --foreground: oklch(0.98 0 0);
  /* その他の変数 */
}
```

## テーマ切り替えUIコンポーネント

### ボタン式

```typescript
import { Moon, Sun } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useTheme } from "next-themes"

export function ModeToggle() {
  const { theme, setTheme } = useTheme()

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={() => setTheme(theme === "light" ? "dark" : "light")}
    >
      <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
      <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
      <span className="sr-only">テーマを切り替え</span>
    </Button>
  )
}
```

### ドロップダウンメニュー式

```typescript
import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export function ModeToggle() {
  const { setTheme } = useTheme()

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
        <DropdownMenuItem onClick={() => setTheme("light")}>
          ライト
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("dark")}>
          ダーク
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("system")}>
          システム
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
```

## システムテーマの検出

ユーザーのOSテーマ設定を自動的に検出して適用できます：

```typescript
<ThemeProvider attribute="class" defaultTheme="system" enableSystem>
  <App />
</ThemeProvider>
```

これにより、以下の動作が可能になります：
- ユーザーがテーマを選択していない場合、システムのテーマを使用
- システムのテーマが変更されたときに自動更新
- ユーザーが明示的にテーマを選択した場合は、その選択を優先

## ベストプラクティス

### 1. ちらつき防止
初期読み込み時のテーマちらつきを防ぐため、スクリプトを`<head>`に追加：

```html
<script>
  try {
    const theme = localStorage.getItem('theme')
    if (theme === 'dark' || (!theme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
      document.documentElement.classList.add('dark')
    }
  } catch (e) {}
</script>
```

### 2. アクセシビリティ
テーマ切り替えボタンに適切なラベルを提供：

```html
<button aria-label="ダークモードに切り替え">
  <Moon />
</button>
```

### 3. 永続化
ユーザーのテーマ選択をlocalStorageに保存：

```typescript
const [theme, setTheme] = useState(() => {
  return localStorage.getItem('theme') || 'system'
})

useEffect(() => {
  localStorage.setItem('theme', theme)
}, [theme])
```

### 4. コントラスト
両方のテーマで十分なコントラストを確保：
- ライトモード：ダークテキスト + ライト背景
- ダークモード：ライトテキスト + ダーク背景

## トラブルシューティング

### ちらつきが発生する
- テーマプロバイダーがルートレベルで設定されているか確認
- SSR環境では、`suppressHydrationWarning`を使用

### テーマが切り替わらない
- CSS変数が正しく定義されているか確認
- `.dark`クラスが`<html>`または`<body>`に適用されているか確認

### システムテーマが機能しない
- `enableSystem`が`true`に設定されているか確認
- ブラウザがmedia queryをサポートしているか確認

## ナビゲーション

- [前のページ: テーマ](/docs/theming)
- [次のページ: CLI](/docs/cli)

## デプロイメント

### Vercelでshadcn/uiアプリをデプロイ

OpenAI、Sonos、Adobeなどに信頼されている Vercel は、アプリと機能を大規模にデプロイするためのツールとインフラストラクチャを提供します。

[Vercelにデプロイ](https://vercel.com/new?utm_source=shadcn_site&utm_medium=web&utm_campaign=docs_cta_deploy_now_callout)

## クレジット

[shadcn](https://twitter.com/shadcn)が[Vercel](https://vercel.com/new?utm_source=shadcn_site&utm_medium=web&utm_campaign=docs_cta_deploy_now_callout)で作成。ソースコードは[GitHub](https://github.com/shadcn-ui/ui)で利用可能です。