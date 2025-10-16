# テーマ設定

CSSの変数とカラーユーティリティを使用したテーマ設定について説明します。

## テーマ設定の方法

shadcn/uiでは、テーマ設定に2つの方法があります：

### 1. CSSの変数（推奨）
CSS変数を使用してテーマを定義します。これにより、動的なテーマ切り替えとカスタマイズが容易になります。

`components.json`ファイルで`tailwind.cssVariables`を`true`に設定します：

```json
{
  "tailwind": {
    "cssVariables": true
  }
}
```

### 2. ユーティリティクラス
Tailwindのユーティリティクラスを直接使用します。

`components.json`ファイルで`tailwind.cssVariables`を`false`に設定します：

```json
{
  "tailwind": {
    "cssVariables": false
  }
}
```

## 命名規則

背景色と前景色のための簡単な命名規則を使用します：

- **`background`** - コンポーネントの背景色
- **`foreground`** - テキストの色（前景色）

### 使用例

```html
<div className="bg-primary text-primary-foreground">Hello</div>
```

このパターンは、すべてのカラートークンで一貫しています：
- `bg-secondary` / `text-secondary-foreground`
- `bg-accent` / `text-accent-foreground`
- `bg-destructive` / `text-destructive-foreground`

## デフォルトのカラー変数

### ライトモード（:root）

```css
:root {
  --background: oklch(1 0 0);
  --foreground: oklch(0.16 0 0);
  --card: oklch(1 0 0);
  --card-foreground: oklch(0.16 0 0);
  --popover: oklch(1 0 0);
  --popover-foreground: oklch(0.16 0 0);
  --primary: oklch(0.21 0 0);
  --primary-foreground: oklch(0.98 0 0);
  --secondary: oklch(0.96 0 0);
  --secondary-foreground: oklch(0.16 0 0);
  --muted: oklch(0.96 0 0);
  --muted-foreground: oklch(0.47 0 0);
  --accent: oklch(0.96 0 0);
  --accent-foreground: oklch(0.16 0 0);
  --destructive: oklch(0.59 0.24 29);
  --destructive-foreground: oklch(0.98 0 0);
  --border: oklch(0.89 0 0);
  --input: oklch(0.89 0 0);
  --ring: oklch(0.21 0 0);
  --radius: 0.5rem;
}
```

### ダークモード（.dark）

```css
.dark {
  --background: oklch(0.16 0 0);
  --foreground: oklch(0.98 0 0);
  --card: oklch(0.16 0 0);
  --card-foreground: oklch(0.98 0 0);
  --popover: oklch(0.16 0 0);
  --popover-foreground: oklch(0.98 0 0);
  --primary: oklch(0.98 0 0);
  --primary-foreground: oklch(0.21 0 0);
  --secondary: oklch(0.23 0 0);
  --secondary-foreground: oklch(0.98 0 0);
  --muted: oklch(0.23 0 0);
  --muted-foreground: oklch(0.67 0 0);
  --accent: oklch(0.23 0 0);
  --accent-foreground: oklch(0.98 0 0);
  --destructive: oklch(0.46 0.21 27);
  --destructive-foreground: oklch(0.98 0 0);
  --border: oklch(0.23 0 0);
  --input: oklch(0.23 0 0);
  --ring: oklch(0.84 0 0);
}
```

## カスタマイズ可能な変数

`:root`と`.dark`セクションで定義された変数を使用して、以下をカスタマイズできます：

### カラー変数
- `--background` / `--foreground` - ページの背景とテキスト
- `--primary` / `--primary-foreground` - プライマリアクション
- `--secondary` / `--secondary-foreground` - セカンダリアクション
- `--accent` / `--accent-foreground` - アクセントカラー
- `--muted` / `--muted-foreground` - ミュートされた要素
- `--destructive` / `--destructive-foreground` - 破壊的アクション
- `--card` / `--card-foreground` - カードコンポーネント
- `--popover` / `--popover-foreground` - ポップオーバーコンポーネント
- `--border` - ボーダーカラー
- `--input` - 入力ボーダーカラー
- `--ring` - フォーカスリングカラー

### その他の変数
- `--radius` - ボーダー半径

## 新しい色の追加

新しい色を追加するには、以下の手順に従います：

### 1. CSSファイルに色を追加

```css
:root {
  --warning: oklch(0.84 0.16 84);
  --warning-foreground: oklch(0.28 0.07 46);
}

.dark {
  --warning: oklch(0.28 0.07 46);
  --warning-foreground: oklch(0.84 0.16 84);
}
```

### 2. tailwind.config.jsに色を追加

```js
module.exports = {
  theme: {
    extend: {
      colors: {
        warning: "hsl(var(--warning))",
        "warning-foreground": "hsl(var(--warning-foreground))",
      }
    }
  }
}
```

### 3. コンポーネントで使用

```html
<div className="bg-warning text-warning-foreground">
  Warning message
</div>
```

## ベースカラー

プロジェクトのベースカラーパレットを選択できます。利用可能なオプション：

### Neutral（中立）
バランスの取れたグレースケールパレット。

### Stone（石）
暖かみのあるグレースケールパレット。

### Zinc（亜鉛）
クールで洗練されたグレースケールパレット。

### Slate（スレート）
青みがかったグレースケールパレット。

### Gray（グレー）
クラシックなグレースケールパレット。

ベースカラーは`components.json`で設定します：

```json
{
  "tailwind": {
    "baseColor": "zinc"
  }
}
```

## OKLCHカラースペース

shadcn/uiは、OKLCHカラースペースを使用します。これは、知覚的に均一なカラースペースで、以下の利点があります：

- **知覚的に均一:** 数値の変化が視覚的な変化と一致
- **予測可能な明度:** 明度値がすべての色相で一貫
- **広い色域:** より鮮やかな色を表現可能
- **簡単な操作:** 色の調整が直感的

### OKLCH構文

```css
oklch(L C H)
```

- **L (Lightness):** 明度（0-1）
- **C (Chroma):** 彩度（0-0.4程度）
- **H (Hue):** 色相（0-360度）

## テーマのカスタマイズ例

### 企業ブランドカラーの適用

```css
:root {
  --primary: oklch(0.45 0.25 252); /* 企業のブルー */
  --primary-foreground: oklch(1 0 0);
  --secondary: oklch(0.35 0.15 162); /* 企業のグリーン */
  --secondary-foreground: oklch(1 0 0);
}
```

### 高コントラストテーマ

```css
:root {
  --background: oklch(1 0 0);
  --foreground: oklch(0 0 0);
  --primary: oklch(0 0 0);
  --primary-foreground: oklch(1 0 0);
  /* その他の色も高コントラストに調整 */
}
```

### パステルテーマ

```css
:root {
  --primary: oklch(0.75 0.1 220);
  --secondary: oklch(0.75 0.1 160);
  --accent: oklch(0.75 0.1 40);
  /* 明度を高く、彩度を低くしてパステル調に */
}
```

## ベストプラクティス

1. **一貫性:** すべての色に対してforeground色を定義
2. **アクセシビリティ:** 十分なコントラスト比を確保（WCAG AA基準：4.5:1以上）
3. **テスト:** ライトモードとダークモードの両方でテスト
4. **ドキュメント化:** カスタムカラーの使用目的を文書化

## デプロイメント

### Vercelでshadcn/uiアプリをデプロイ

OpenAI、Sonos、Adobeなどに信頼されています。Vercelは、アプリと機能を大規模にデプロイするためのツールとインフラストラクチャを提供します。

[Vercelにデプロイ](https://vercel.com/new?utm_source=shadcn_site&utm_medium=web&utm_campaign=docs_cta_deploy_now_callout)

## クレジット

[shadcn](https://twitter.com/shadcn)が[Vercel](https://vercel.com/new?utm_source=shadcn_site&utm_medium=web&utm_campaign=docs_cta_deploy_now_callout)で作成。ソースコードは[GitHub](https://github.com/shadcn-ui/ui)で利用可能です。