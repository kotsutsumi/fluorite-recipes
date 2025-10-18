# Padding

要素のパディングを制御するためのユーティリティ。

## クイックリファレンス

| クラス | スタイル |
|-------|--------|
| `p-<number>` | `padding: calc(var(--spacing) * <number>);` |
| `p-px` | `padding: 1px;` |
| `p-(<custom-property>)` | `padding: var(<custom-property>);` |
| `p-[<value>]` | `padding: <value>;` |
| `px-<number>` | `padding-inline: calc(var(--spacing) * <number>);` |
| `py-<number>` | `padding-block: calc(var(--spacing) * <number>);` |
| `ps-<number>` | `padding-inline-start: calc(var(--spacing) * <number>);` |
| `pe-<number>` | `padding-inline-end: calc(var(--spacing) * <number>);` |
| `pt-<number>` | `padding-top: calc(var(--spacing) * <number>);` |
| `pr-<number>` | `padding-right: calc(var(--spacing) * <number>);` |
| `pb-<number>` | `padding-bottom: calc(var(--spacing) * <number>);` |
| `pl-<number>` | `padding-left: calc(var(--spacing) * <number>);` |

## 基本的な使い方

### 基本的なパディング

`p-<number>` を使用して、すべての辺にパディングを追加します。

```html
<div class="p-8">p-8</div>
```

### 単一辺のパディング

`pt-`、`pr-`、`pb-`、`pl-` を使用して、個々の辺のパディングを制御します。

```html
<div class="pt-6">pt-6</div>
<div class="pr-4">pr-4</div>
<div class="pb-8">pb-8</div>
<div class="pl-2">pl-2</div>
```

### 水平および垂直パディング

`px-<number>` を使用して水平方向のパディングを、`py-<number>` を使用して垂直方向のパディングを設定します。

```html
<div class="px-8">px-8</div>
<div class="py-8">py-8</div>
```

### 論理プロパティ

`ps-<number>` を使用してインライン開始のパディングを、`pe-<number>` を使用してインライン終了のパディングを設定します。これらは書字方向を考慮します。

```html
<div class="ps-4">ps-4</div>
<div class="pe-4">pe-4</div>
```

## カスタム値の適用

任意の値を使用する必要がある場合は、角括弧を使用してその場でプロパティを生成できます。

```html
<div class="p-[2.75rem]">
  <!-- ... -->
</div>
```

CSS変数を参照することもできます。

```html
<div class="p-(--my-padding)">
  <!-- ... -->
</div>
```

## レスポンシブデザイン

プレフィックスを使用して、特定のブレークポイントでのみユーティリティを適用できます。

```html
<div class="p-4 md:p-8">
  <!-- ... -->
</div>
```

利用可能なすべてのブレークポイントオプションについては、[レスポンシブデザイン](/docs/responsive-design)のドキュメントを参照してください。
