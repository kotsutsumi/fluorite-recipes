# Stroke

SVG要素のストロークをスタイリングするためのユーティリティです。

## クイックリファレンス

| クラス | スタイル |
|-------|---------|
| `stroke-none` | `stroke: none;` |
| `stroke-inherit` | `stroke: inherit;` |
| `stroke-current` | `stroke: currentColor;` |
| `stroke-transparent` | `stroke: transparent;` |
| `stroke-black` | `stroke: var(--color-black);` |
| `stroke-white` | `stroke: var(--color-white);` |
| `stroke-<color>-<shade>` | 各種カラーパレットのストローク色 |
| `stroke-(<custom-property>)` | `stroke: var(<custom-property>);` |
| `stroke-[<value>]` | `stroke: <value>;` |

## 基本的な使い方

### 基本的なSVGストローク

`stroke-*`ユーティリティを使用して、SVG要素のストローク色を設定します。

```html
<svg class="stroke-cyan-500" fill="none" viewBox="0 0 100 100">
  <circle cx="50" cy="50" r="40" stroke-width="2" />
</svg>

<svg class="stroke-blue-500" fill="none" viewBox="0 0 100 100">
  <circle cx="50" cy="50" r="40" stroke-width="2" />
</svg>

<svg class="stroke-purple-500" fill="none" viewBox="0 0 100 100">
  <circle cx="50" cy="50" r="40" stroke-width="2" />
</svg>
```

### 現在のテキストカラーを使用

`stroke-current`を使用して、SVGのストロークを現在のテキストカラーに設定します。

```html
<button class="bg-white text-pink-600 hover:bg-pink-600 hover:text-white">
  <svg class="size-5 stroke-current" fill="none" viewBox="0 0 24 24">
    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
  </svg>
  ファイルをダウンロード
</button>
```

### ストロークなし

`stroke-none`を使用して、SVG要素のストロークを削除します。

```html
<svg class="stroke-none fill-blue-500" viewBox="0 0 100 100">
  <circle cx="50" cy="50" r="40" />
</svg>
```

## カスタム値の適用

任意の値を使用する必要がある場合は、角括弧を使用してその場でプロパティを生成します。

```html
<svg class="stroke-[#243c5a]" fill="none" viewBox="0 0 100 100">
  <circle cx="50" cy="50" r="40" stroke-width="2" />
</svg>
```

CSS変数を使用することもできます。

```html
<svg class="stroke-(--my-color)" fill="none" viewBox="0 0 100 100">
  <circle cx="50" cy="50" r="40" stroke-width="2" />
</svg>
```

## レスポンシブデザイン

特定のブレークポイントでのみストロークを適用するには、既存のユーティリティクラスの前に`md:`などのレスポンシブプレフィックスを追加します。

```html
<svg class="stroke-blue-500 md:stroke-green-500" fill="none" viewBox="0 0 100 100">
  <circle cx="50" cy="50" r="40" stroke-width="2" />
</svg>
```

## ホバー、フォーカス、その他の状態

`hover:`などの状態バリアントを使用して、異なる状態でストロークを条件付きで適用します。

```html
<svg class="stroke-blue-500 hover:stroke-blue-700" fill="none" viewBox="0 0 100 100">
  <circle cx="50" cy="50" r="40" stroke-width="2" />
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
<svg class="stroke-regal-blue" fill="none" viewBox="0 0 100 100">
  <circle cx="50" cy="50" r="40" stroke-width="2" />
</svg>
```

## 使用例

### アウトラインアイコン

テキストカラーと連動するアウトラインアイコン。

```html
<button class="text-blue-600 hover:text-blue-800">
  <svg class="size-6 stroke-current" fill="none" viewBox="0 0 24 24" stroke-width="2">
    <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
  </svg>
</button>
```

### 円グラフ

複数の色を使用したSVGグラフィック。

```html
<svg viewBox="0 0 200 200" class="w-32 h-32">
  <circle cx="100" cy="100" r="80" class="stroke-blue-500 fill-none" stroke-width="20" />
  <circle cx="100" cy="100" r="60" class="stroke-green-500 fill-none" stroke-width="20" />
  <circle cx="100" cy="100" r="40" class="stroke-red-500 fill-none" stroke-width="20" />
</svg>
```

### Heroiconsのスタイリング

Heroiconsなどのアイコンライブラリで使用。

```html
<svg class="size-8 stroke-indigo-500" fill="none" viewBox="0 0 24 24" stroke-width="1.5">
  <path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
</svg>
```

## 関連ユーティリティ

- [Fill](/docs/fill)
- [Stroke Width](/docs/stroke-width)
