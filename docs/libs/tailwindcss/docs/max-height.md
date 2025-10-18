# Max Height

要素の最大高さを設定するためのユーティリティ。

## クイックリファレンス

| クラス | スタイル |
|-------|--------|
| `max-h-<number>` | `max-height: calc(var(--spacing) * <number>);` |
| `max-h-<fraction>` | `max-height: calc(<fraction> * 100%);` |
| `max-h-none` | `max-height: none;` |
| `max-h-px` | `max-height: 1px;` |
| `max-h-full` | `max-height: 100%;` |
| `max-h-screen` | `max-height: 100vh;` |
| `max-h-dvh` | `max-height: 100dvh;` |
| `max-h-dvw` | `max-height: 100dvw;` |
| `max-h-lvh` | `max-height: 100lvh;` |
| `max-h-lvw` | `max-height: 100lvw;` |
| `max-h-svh` | `max-height: 100svh;` |
| `max-h-svw` | `max-height: 100svw;` |
| `max-h-min` | `max-height: min-content;` |
| `max-h-max` | `max-height: max-content;` |
| `max-h-fit` | `max-height: fit-content;` |
| `max-h-lh` | `max-height: 1lh;` |
| `max-h-(<custom-property>)` | `max-height: var(<custom-property>);` |
| `max-h-[<value>]` | `max-height: <value>;` |

## 基本的な使い方

### 固定最大高さ

`max-h-<number>` ユーティリティを使用して、固定の最大高さを設定します。

```html
<div class="h-96 ...">
  <div class="h-full max-h-80 ...">max-h-80</div>
</div>
```

### フル最大高さ

`max-h-full` を使用して、最大高さを100%に設定します。

```html
<div class="max-h-full">max-h-full</div>
```

### ビューポート最大高さ

`max-h-screen` を使用して、最大高さをビューポートの全高に設定します。

```html
<div class="max-h-screen">max-h-screen</div>
```

### 動的ビューポート最大高さ

モバイルブラウザのアドレスバーを考慮した動的なビューポート高さを使用できます。

```html
<div class="max-h-dvh">max-h-dvh</div>
<div class="max-h-svh">max-h-svh（小）</div>
<div class="max-h-lvh">max-h-lvh（大）</div>
```

### コンテンツベースの最大高さ

`max-h-min`、`max-h-max`、`max-h-fit` を使用して、コンテンツに基づいた最大高さを設定します。

```html
<div class="max-h-min">max-h-min</div>
<div class="max-h-max">max-h-max</div>
<div class="max-h-fit">max-h-fit</div>
```

### 制限なし

`max-h-none` を使用して、最大高さの制限を解除します。

```html
<div class="max-h-none">max-h-none</div>
```

## カスタム値の適用

任意の値を使用する必要がある場合は、角括弧を使用してその場でプロパティを生成できます。

```html
<div class="max-h-[32rem]">
  <!-- ... -->
</div>
```

CSS変数を参照することもできます。

```html
<div class="max-h-(--my-max-height)">
  <!-- ... -->
</div>
```

## レスポンシブデザイン

プレフィックスを使用して、特定のブレークポイントでのみユーティリティを適用できます。

```html
<div class="max-h-48 md:max-h-64 lg:max-h-full">
  <!-- ... -->
</div>
```

利用可能なすべてのブレークポイントオプションについては、[レスポンシブデザイン](/docs/responsive-design)のドキュメントを参照してください。
