# Width

要素の幅を設定するためのユーティリティ。

## 説明

Tailwind CSSの幅ユーティリティは、固定スペーシング、パーセンテージ、コンテナスケール、ビューポート測定、カスタム値など、さまざまな方法で要素の幅を制御できます。

## クイックリファレンス

### 基本的な幅クラス

| クラス | スタイル |
|-------|--------|
| `w-<number>` | `width: calc(var(--spacing) * <number>);` |
| `w-<fraction>` | `width: calc(<fraction> * 100%);` |
| `w-auto` | `width: auto;` |
| `w-full` | `width: 100%;` |
| `w-screen` | `width: 100vw;` |
| `w-min` | `width: min-content;` |
| `w-max` | `width: max-content;` |
| `w-fit` | `width: fit-content;` |

### コンテナスケールクラス

| クラス | 幅 |
|-------|-------|
| `w-3xs` | `16rem (256px)` |
| `w-2xs` | `18rem (288px)` |
| `w-xs` | `20rem (320px)` |
| `w-sm` | `24rem (384px)` |
| `w-md` | `28rem (448px)` |
| `w-lg` | `32rem (512px)` |
| `w-xl` | `36rem (576px)` |
| `w-2xl` | `42rem (672px)` |
| `w-3xl` | `48rem (768px)` |
| `w-4xl` | `56rem (896px)` |
| `w-5xl` | `64rem (1024px)` |
| `w-6xl` | `72rem (1152px)` |
| `w-7xl` | `80rem (1280px)` |

## 基本的な使い方

### 固定幅

`w-<number>` を使用して、スペーシングスケールに基づいた固定幅を設定します。

```html
<div class="w-96">w-96</div>
<div class="w-80">w-80</div>
<div class="w-64">w-64</div>
```

### パーセンテージ幅

`w-<fraction>` を使用して、パーセンテージベースの幅を設定します。

```html
<div class="w-1/2">w-1/2</div>
<div class="w-1/3">w-1/3</div>
<div class="w-2/3">w-2/3</div>
<div class="w-1/4">w-1/4</div>
```

### フル幅

`w-full` を使用して、親要素の幅いっぱいに要素を伸ばします。

```html
<div class="w-full">w-full</div>
```

### ビューポート幅

`w-screen` を使用して、要素をビューポートの全幅に伸ばします。

```html
<div class="w-screen">w-screen</div>
```

### コンテンツベースの幅

`w-min`、`w-max`、`w-fit` を使用して、コンテンツに基づいた幅を設定します。

```html
<div class="w-min">w-min</div>
<div class="w-max">w-max</div>
<div class="w-fit">w-fit</div>
```

## カスタム値の適用

任意の値を使用する必要がある場合は、角括弧を使用してその場でプロパティを生成できます。

```html
<div class="w-[32rem]">
  <!-- ... -->
</div>
```

CSS変数を参照することもできます。

```html
<div class="w-(--my-width)">
  <!-- ... -->
</div>
```

## レスポンシブデザイン

プレフィックスを使用して、特定のブレークポイントでのみユーティリティを適用できます。

```html
<div class="w-full md:w-1/2 lg:w-1/3">
  <!-- ... -->
</div>
```

利用可能なすべてのブレークポイントオプションについては、[レスポンシブデザイン](/docs/responsive-design)のドキュメントを参照してください。
