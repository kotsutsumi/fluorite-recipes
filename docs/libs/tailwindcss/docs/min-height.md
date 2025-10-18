# Min Height

要素の最小高さを設定するためのユーティリティ。

## クイックリファレンス

| クラス | スタイル |
|-------|--------|
| `min-h-<number>` | `min-height: calc(var(--spacing) * <number>);` |
| `min-h-<fraction>` | `min-height: calc(<fraction> * 100%);` |
| `min-h-px` | `min-height: 1px;` |
| `min-h-full` | `min-height: 100%;` |
| `min-h-screen` | `min-height: 100vh;` |
| `min-h-dvh` | `min-height: 100dvh;` |
| `min-h-dvw` | `min-height: 100dvw;` |
| `min-h-lvh` | `min-height: 100lvh;` |
| `min-h-lvw` | `min-height: 100lvw;` |
| `min-h-svw` | `min-height: 100svw;` |
| `min-h-svh` | `min-height: 100svh;` |
| `min-h-auto` | `min-height: auto;` |
| `min-h-min` | `min-height: min-content;` |
| `min-h-max` | `min-height: max-content;` |
| `min-h-fit` | `min-height: fit-content;` |
| `min-h-lh` | `min-height: 1lh;` |
| `min-h-(<custom-property>)` | `min-height: var(<custom-property>);` |
| `min-h-[<value>]` | `min-height: <value>;` |

## 基本的な使い方

### 固定最小高さ

`min-h-<number>` ユーティリティを使用して、スペーシングスケールに基づいた固定の最小高さを設定します。

```html
<div class="min-h-96">min-h-96</div>
<div class="min-h-80">min-h-80</div>
<div class="min-h-64">min-h-64</div>
```

### フル最小高さ

`min-h-full` を使用して、最小高さを100%に設定します。

```html
<div class="min-h-full">min-h-full</div>
```

### ビューポート最小高さ

`min-h-screen` を使用して、最小高さをビューポートの全高に設定します。

```html
<div class="min-h-screen">min-h-screen</div>
```

### 動的ビューポート最小高さ

モバイルブラウザのアドレスバーを考慮した動的なビューポート高さを使用できます。

```html
<div class="min-h-dvh">min-h-dvh</div>
<div class="min-h-svh">min-h-svh（小）</div>
<div class="min-h-lvh">min-h-lvh（大）</div>
```

### コンテンツベースの最小高さ

`min-h-min`、`min-h-max`、`min-h-fit` を使用して、コンテンツに基づいた最小高さを設定します。

```html
<div class="min-h-min">min-h-min</div>
<div class="min-h-max">min-h-max</div>
<div class="min-h-fit">min-h-fit</div>
```

## カスタム値の適用

任意の値を使用する必要がある場合は、角括弧を使用してその場でプロパティを生成できます。

```html
<div class="min-h-[32rem]">
  <!-- ... -->
</div>
```

CSS変数を参照することもできます。

```html
<div class="min-h-(--my-min-height)">
  <!-- ... -->
</div>
```

## レスポンシブデザイン

プレフィックスを使用して、特定のブレークポイントでのみユーティリティを適用できます。

```html
<div class="min-h-0 md:min-h-screen">
  <!-- ... -->
</div>
```

利用可能なすべてのブレークポイントオプションについては、[レスポンシブデザイン](/docs/responsive-design)のドキュメントを参照してください。
