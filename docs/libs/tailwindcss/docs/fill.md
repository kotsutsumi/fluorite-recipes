# Fill

SVG要素の塗りつぶしをスタイリングするためのユーティリティです。

## クイックリファレンス

| クラス | スタイル |
|-------|---------|
| `fill-none` | `fill: none;` |
| `fill-inherit` | `fill: inherit;` |
| `fill-current` | `fill: currentColor;` |
| `fill-transparent` | `fill: transparent;` |
| `fill-black` | `fill: var(--color-black);` |
| `fill-white` | `fill: var(--color-white);` |
| `fill-<color>-<shade>` | 各種カラーパレットの塗りつぶし色 |
| `fill-(<custom-property>)` | `fill: var(<custom-property>);` |
| `fill-[<value>]` | `fill: <value>;` |

## 基本的な使い方

### 基本的なSVG塗りつぶし

`fill-*`ユーティリティを使用して、SVG要素の塗りつぶし色を設定します。

```html
<svg class="fill-blue-500" viewBox="0 0 100 100">
  <circle cx="50" cy="50" r="40" />
</svg>

<svg class="fill-green-500" viewBox="0 0 100 100">
  <circle cx="50" cy="50" r="40" />
</svg>

<svg class="fill-red-500" viewBox="0 0 100 100">
  <circle cx="50" cy="50" r="40" />
</svg>
```

### 現在のテキストカラーを使用

`fill-current`を使用して、SVGの塗りつぶしを現在のテキストカラーに設定します。

```html
<button class="bg-white text-indigo-600 hover:bg-indigo-600 hover:text-white">
  <svg class="size-5 fill-current" viewBox="0 0 20 20">
    <path d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"/>
  </svg>
  更新を確認
</button>
```

### 塗りつぶしなし

`fill-none`を使用して、SVG要素の塗りつぶしを削除します。

```html
<svg class="fill-none stroke-blue-500" viewBox="0 0 100 100">
  <circle cx="50" cy="50" r="40" stroke-width="2" />
</svg>
```

## カスタム値の適用

任意の値を使用する必要がある場合は、角括弧を使用してその場でプロパティを生成します。

```html
<svg class="fill-[#243c5a]" viewBox="0 0 100 100">
  <circle cx="50" cy="50" r="40" />
</svg>
```

CSS変数を使用することもできます。

```html
<svg class="fill-(--my-color)" viewBox="0 0 100 100">
  <circle cx="50" cy="50" r="40" />
</svg>
```

## レスポンシブデザイン

特定のブレークポイントでのみ塗りつぶしを適用するには、既存のユーティリティクラスの前に`md:`などのレスポンシブプレフィックスを追加します。

```html
<svg class="fill-blue-500 md:fill-green-500" viewBox="0 0 100 100">
  <circle cx="50" cy="50" r="40" />
</svg>
```

## ホバー、フォーカス、その他の状態

`hover:`などの状態バリアントを使用して、異なる状態で塗りつぶしを条件付きで適用します。

```html
<svg class="fill-blue-500 hover:fill-blue-700" viewBox="0 0 100 100">
  <circle cx="50" cy="50" r="40" />
</svg>
```

## テーマのカスタマイズ

カスタムカラーをテーマに追加できます。

```css
@theme {
  --color-regal-blue: #243c5a;
}
```

その後、カスタムカラーを使用できます。

```html
<svg class="fill-regal-blue" viewBox="0 0 100 100">
  <circle cx="50" cy="50" r="40" />
</svg>
```

## 使用例

### アイコンボタン

テキストカラーと連動するアイコン。

```html
<button class="text-blue-600 hover:text-blue-800">
  <svg class="size-6 fill-current" viewBox="0 0 24 24">
    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
  </svg>
</button>
```

### カラフルなロゴ

複数の色を使用したSVGロゴ。

```html
<svg viewBox="0 0 200 200" class="w-32 h-32">
  <circle cx="100" cy="100" r="80" class="fill-blue-500" />
  <circle cx="100" cy="100" r="60" class="fill-white" />
  <circle cx="100" cy="100" r="40" class="fill-red-500" />
</svg>
```

## 関連ユーティリティ

- [Stroke](/docs/stroke)
- [Stroke Width](/docs/stroke-width)
