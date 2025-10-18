# Max Width

要素の最大幅を設定するためのユーティリティ。

## クイックリファレンス

| クラス | スタイル |
|-------|--------|
| `max-w-<number>` | `max-width: calc(var(--spacing) * <number>);` |
| `max-w-<fraction>` | `max-width: calc(<fraction> * 100%);` |
| `max-w-none` | `max-width: none;` |
| `max-w-full` | `max-width: 100%;` |
| `max-w-min` | `max-width: min-content;` |
| `max-w-max` | `max-width: max-content;` |
| `max-w-fit` | `max-width: fit-content;` |
| `max-w-prose` | `max-width: 65ch;` |

### コンテナスケールクラス

| クラス | 最大幅 |
|-------|-------|
| `max-w-3xs` | `16rem (256px)` |
| `max-w-2xs` | `18rem (288px)` |
| `max-w-xs` | `20rem (320px)` |
| `max-w-sm` | `24rem (384px)` |
| `max-w-md` | `28rem (448px)` |
| `max-w-lg` | `32rem (512px)` |
| `max-w-xl` | `36rem (576px)` |
| `max-w-2xl` | `42rem (672px)` |
| `max-w-3xl` | `48rem (768px)` |
| `max-w-4xl` | `56rem (896px)` |
| `max-w-5xl` | `64rem (1024px)` |
| `max-w-6xl` | `72rem (1152px)` |
| `max-w-7xl` | `80rem (1280px)` |

## 基本的な使い方

### 固定最大幅

`max-w-<number>` を使用して、スペーシングスケールに基づいた固定の最大幅を設定します。

```html
<div class="max-w-96">max-w-96</div>
<div class="max-w-80">max-w-80</div>
<div class="max-w-64">max-w-64</div>
```

### フル最大幅

`max-w-full` を使用して、最大幅を100%に設定します。

```html
<div class="max-w-full">max-w-full</div>
```

### コンテナスケール

`max-w-xs`、`max-w-sm`、`max-w-md` などを使用して、コンテナスケールに基づいた最大幅を設定します。

```html
<div class="max-w-xs">max-w-xs</div>
<div class="max-w-md">max-w-md</div>
<div class="max-w-xl">max-w-xl</div>
```

### Prose（文章）

`max-w-prose` を使用して、読みやすい文章の幅（約65文字）に制限します。

```html
<div class="max-w-prose">
  <p>長い文章...</p>
</div>
```

### コンテンツベースの最大幅

`max-w-min`、`max-w-max`、`max-w-fit` を使用して、コンテンツに基づいた最大幅を設定します。

```html
<div class="max-w-min">max-w-min</div>
<div class="max-w-max">max-w-max</div>
<div class="max-w-fit">max-w-fit</div>
```

## カスタム値の適用

任意の値を使用する必要がある場合は、角括弧を使用してその場でプロパティを生成できます。

```html
<div class="max-w-[32rem]">
  <!-- ... -->
</div>
```

CSS変数を参照することもできます。

```html
<div class="max-w-(--my-max-width)">
  <!-- ... -->
</div>
```

## レスポンシブデザイン

プレフィックスを使用して、特定のブレークポイントでのみユーティリティを適用できます。

```html
<div class="max-w-sm md:max-w-md lg:max-w-lg">
  <!-- ... -->
</div>
```

利用可能なすべてのブレークポイントオプションについては、[レスポンシブデザイン](/docs/responsive-design)のドキュメントを参照してください。
