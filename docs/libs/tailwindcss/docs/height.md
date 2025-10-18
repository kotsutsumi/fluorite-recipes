# Height

要素の高さを設定するためのユーティリティ。

## クイックリファレンス

| クラス | スタイル |
|-------|--------|
| `h-<number>` | `height: calc(var(--spacing) * <number>);` |
| `h-<fraction>` | `height: calc(<fraction> * 100%);` |
| `h-auto` | `height: auto;` |
| `h-px` | `height: 1px;` |
| `h-full` | `height: 100%;` |
| `h-screen` | `height: 100vh;` |
| `h-dvh` | `height: 100dvh;` |
| `h-dvw` | `height: 100dvw;` |
| `h-lvh` | `height: 100lvh;` |
| `h-lvw` | `height: 100lvw;` |
| `h-svh` | `height: 100svh;` |
| `h-svw` | `height: 100svw;` |
| `h-min` | `height: min-content;` |
| `h-max` | `height: max-content;` |
| `h-fit` | `height: fit-content;` |
| `h-lh` | `height: 1lh;` |
| `h-(<custom-property>)` | `height: var(<custom-property>);` |
| `h-[<value>]` | `height: <value>;` |

## 基本的な使い方

### 固定高さ

`h-<number>` ユーティリティを使用して、スペーシングスケールに基づいた固定の高さを設定します。

```html
<div class="h-96">h-96</div>
<div class="h-80">h-80</div>
<div class="h-64">h-64</div>
```

### パーセンテージ高さ

`h-full` または `h-<fraction>` ユーティリティを使用します。

```html
<div class="h-full">h-full</div>
<div class="h-1/2">h-1/2</div>
<div class="h-1/3">h-1/3</div>
```

### ビューポート高さ

`h-screen` を使用して、要素をビューポートの全高に伸ばします。

```html
<div class="h-screen">h-screen</div>
```

### 動的ビューポート高さ

モバイルブラウザのアドレスバーを考慮した動的なビューポート高さを使用できます。

```html
<div class="h-dvh">h-dvh</div>
<div class="h-svh">h-svh（小）</div>
<div class="h-lvh">h-lvh（大）</div>
```

### コンテンツベースの高さ

`h-min`、`h-max`、`h-fit` を使用して、コンテンツに基づいた高さを設定します。

```html
<div class="h-min">h-min</div>
<div class="h-max">h-max</div>
<div class="h-fit">h-fit</div>
```

### 自動高さ

`h-auto` を使用して、ブラウザが高さを計算できるようにします。

```html
<div class="h-auto">h-auto</div>
```

## カスタム値の適用

任意の値を使用する必要がある場合は、角括弧を使用してその場でプロパティを生成できます。

```html
<div class="h-[32rem]">
  <!-- ... -->
</div>
```

CSS変数を参照することもできます。

```html
<div class="h-(--my-height)">
  <!-- ... -->
</div>
```

## レスポンシブデザイン

プレフィックスを使用して、特定のブレークポイントでのみユーティリティを適用できます。

```html
<div class="h-48 md:h-64 lg:h-96">
  <!-- ... -->
</div>
```

利用可能なすべてのブレークポイントオプションについては、[レスポンシブデザイン](/docs/responsive-design)のドキュメントを参照してください。
