# Min Width

要素の最小幅を設定するためのユーティリティ。

## クイックリファレンス

| クラス | スタイル |
|-------|--------|
| `min-w-<number>` | `min-width: calc(var(--spacing) * <number>);` |
| `min-w-<fraction>` | `min-width: calc(<fraction> * 100%);` |
| `min-w-full` | `min-width: 100%;` |
| `min-w-min` | `min-width: min-content;` |
| `min-w-max` | `min-width: max-content;` |
| `min-w-fit` | `min-width: fit-content;` |

### コンテナスケールクラス

| クラス | 最小幅 |
|-------|-------|
| `min-w-3xs` | `16rem (256px)` |
| `min-w-2xs` | `18rem (288px)` |
| `min-w-xs` | `20rem (320px)` |
| `min-w-sm` | `24rem (384px)` |
| `min-w-md` | `28rem (448px)` |
| `min-w-lg` | `32rem (512px)` |
| `min-w-xl` | `36rem (576px)` |
| `min-w-2xl` | `42rem (672px)` |
| `min-w-3xl` | `48rem (768px)` |
| `min-w-4xl` | `56rem (896px)` |
| `min-w-5xl` | `64rem (1024px)` |
| `min-w-6xl` | `72rem (1152px)` |
| `min-w-7xl` | `80rem (1280px)` |

## 基本的な使い方

### 固定最小幅

`min-w-<number>` を使用して、スペーシングスケールに基づいた固定の最小幅を設定します。

```html
<div class="min-w-96">min-w-96</div>
<div class="min-w-80">min-w-80</div>
<div class="min-w-64">min-w-64</div>
```

### フル最小幅

`min-w-full` を使用して、最小幅を100%に設定します。

```html
<div class="min-w-full">min-w-full</div>
```

### コンテンツベースの最小幅

`min-w-min`、`min-w-max`、`min-w-fit` を使用して、コンテンツに基づいた最小幅を設定します。

```html
<div class="min-w-min">min-w-min</div>
<div class="min-w-max">min-w-max</div>
<div class="min-w-fit">min-w-fit</div>
```

## カスタム値の適用

任意の値を使用する必要がある場合は、角括弧を使用してその場でプロパティを生成できます。

```html
<div class="min-w-[32rem]">
  <!-- ... -->
</div>
```

CSS変数を参照することもできます。

```html
<div class="min-w-(--my-min-width)">
  <!-- ... -->
</div>
```

## レスポンシブデザイン

プレフィックスを使用して、特定のブレークポイントでのみユーティリティを適用できます。

```html
<div class="min-w-0 md:min-w-full">
  <!-- ... -->
</div>
```

利用可能なすべてのブレークポイントオプションについては、[レスポンシブデザイン](/docs/responsive-design)のドキュメントを参照してください。
