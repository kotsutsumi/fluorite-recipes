# Margin

要素のマージンを制御するためのユーティリティ。

## クイックリファレンス

### 基本的なマージンクラス

| クラス | スタイル |
|-------|--------|
| `m-<number>` | `margin: calc(var(--spacing) * <number>);` |
| `-m-<number>` | `margin: calc(var(--spacing) * -<number>);` |
| `m-auto` | `margin: auto;` |
| `m-px` | `margin: 1px;` |
| `-m-px` | `margin: -1px;` |

### 方向別マージンクラス

| クラス | スタイル |
|-------|--------|
| `mx-<number>` | `margin-inline: calc(var(--spacing) * <number>);` |
| `my-<number>` | `margin-block: calc(var(--spacing) * <number>);` |
| `mt-<number>` | `margin-top: calc(var(--spacing) * <number>);` |
| `mr-<number>` | `margin-right: calc(var(--spacing) * <number>);` |
| `mb-<number>` | `margin-bottom: calc(var(--spacing) * <number>);` |
| `ml-<number>` | `margin-left: calc(var(--spacing) * <number>);` |
| `ms-<number>` | `margin-inline-start: calc(var(--spacing) * <number>);` |
| `me-<number>` | `margin-inline-end: calc(var(--spacing) * <number>);` |

## 基本的な使い方

### 基本的なマージン

`m-<number>` を使用して、すべての辺にマージンを追加します。

```html
<div class="m-8">m-8</div>
```

### 単一辺のマージン

`mt-`、`mr-`、`mb-`、`ml-` を使用して、個々の辺のマージンを制御します。

```html
<div class="mt-6">mt-6</div>
<div class="mr-4">mr-4</div>
<div class="mb-8">mb-8</div>
<div class="ml-2">ml-2</div>
```

### 水平および垂直マージン

`mx-<number>` を使用して水平方向のマージンを、`my-<number>` を使用して垂直方向のマージンを設定します。

```html
<div class="mx-8">mx-8</div>
<div class="my-8">my-8</div>
```

### 負のマージン

マージンの値を負にするには、クラス名の前にダッシュを付けます。

```html
<div class="-mt-8">-mt-8</div>
<div class="-mx-4">-mx-4</div>
```

### 自動マージン

`m-auto` を使用して、要素を中央に配置します。

```html
<div class="mx-auto">mx-auto</div>
```

### 論理プロパティ

`ms-<number>` を使用してインライン開始のマージンを、`me-<number>` を使用してインライン終了のマージンを設定します。これらは書字方向を考慮します。

```html
<div class="ms-4">ms-4</div>
<div class="me-4">me-4</div>
```

## カスタム値の適用

任意の値を使用する必要がある場合は、角括弧を使用してその場でプロパティを生成できます。

```html
<div class="m-[2.75rem]">
  <!-- ... -->
</div>
```

CSS変数を参照することもできます。

```html
<div class="m-(--my-margin)">
  <!-- ... -->
</div>
```

## レスポンシブデザイン

プレフィックスを使用して、特定のブレークポイントでのみユーティリティを適用できます。

```html
<div class="m-4 md:m-8">
  <!-- ... -->
</div>
```

利用可能なすべてのブレークポイントオプションについては、[レスポンシブデザイン](/docs/responsive-design)のドキュメントを参照してください。
