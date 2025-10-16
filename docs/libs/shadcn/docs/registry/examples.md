# レジストリアイテムの例

## 概要

このページは、shadcn/ui のレジストリアイテムの様々な例を提供します。各例は、カスタムレジストリの構築方法を示しています。

## レジストリアイテムの例

### 1. スタイル

カスタムスタイルの追加方法：

```json
{
  "name": "custom-style",
  "type": "registry:style",
  "files": [
    {
      "path": "styles/custom.css",
      "type": "registry:style"
    }
  ]
}
```

### 2. テーマ

テーマカラーの定義：

```json
{
  "name": "dark-theme",
  "type": "registry:theme",
  "cssVars": {
    "light": {
      "--background": "0 0% 100%",
      "--foreground": "222.2 84% 4.9%"
    },
    "dark": {
      "--background": "222.2 84% 4.9%",
      "--foreground": "210 40% 98%"
    }
  }
}
```

### 3. ブロック

複雑なコンポーネントブロック：

```json
{
  "name": "dashboard-block",
  "type": "registry:block",
  "files": [
    {
      "path": "blocks/dashboard.tsx",
      "type": "registry:component"
    }
  ],
  "registryDependencies": ["card", "button"]
}
```

### 4. CSS変数

CSS変数の定義：

```json
{
  "name": "custom-colors",
  "type": "registry:ui",
  "cssVars": {
    "light": {
      "--primary": "210 40% 98%"
    },
    "dark": {
      "--primary": "222.2 47.4% 11.2%"
    }
  }
}
```

### 5. カスタムCSS

カスタムCSSの追加：

```json
{
  "name": "animations",
  "type": "registry:style",
  "files": [
    {
      "path": "styles/animations.css",
      "type": "registry:style",
      "content": "@keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }"
    }
  ]
}
```

### 6. ユーティリティ

ユーティリティ関数：

```json
{
  "name": "cn-utils",
  "type": "registry:lib",
  "files": [
    {
      "path": "lib/utils.ts",
      "type": "registry:lib"
    }
  ]
}
```

### 7. CSSインポート

CSSファイルのインポート：

```json
{
  "name": "global-styles",
  "type": "registry:style",
  "files": [
    {
      "path": "styles/globals.css",
      "type": "registry:style"
    }
  ]
}
```

### 8. プラグイン

Tailwindプラグインの追加：

```json
{
  "name": "custom-plugin",
  "type": "registry:ui",
  "tailwind": {
    "plugins": ["@tailwindcss/typography"]
  }
}
```

### 9. アニメーション

アニメーションの定義：

```json
{
  "name": "slide-animations",
  "type": "registry:ui",
  "tailwind": {
    "config": {
      "theme": {
        "extend": {
          "keyframes": {
            "slideIn": {
              "0%": { "transform": "translateX(-100%)" },
              "100%": { "transform": "translateX(0)" }
            }
          }
        }
      }
    }
  }
}
```

### 10. 環境変数

環境変数の使用：

```json
{
  "name": "api-config",
  "type": "registry:lib",
  "files": [
    {
      "path": "lib/config.ts",
      "type": "registry:lib"
    }
  ],
  "docs": "API_KEY環境変数を設定してください"
}
```

## まとめ

これらの例は、shadcn/uiレジストリシステムの柔軟性を示しています。これらのパターンを使用して、独自のカスタムレジストリを構築できます。
