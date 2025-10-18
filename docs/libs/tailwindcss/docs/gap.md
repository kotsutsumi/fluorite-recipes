# Gap

グリッドとフレックスボックスアイテム間の溝（ガター）を制御するためのユーティリティ。

## クイックリファレンス

| クラス | スタイル |
|-------|--------|
| `gap-<number>` | `gap: calc(var(--spacing) * <value>);` |
| `gap-(<custom-property>)` | `gap: var(<custom-property>);` |
| `gap-[<value>]` | `gap: <value>;` |
| `gap-x-<number>` | `column-gap: calc(var(--spacing) * <value>);` |
| `gap-x-(<custom-property>)` | `column-gap: var(<custom-property>);` |
| `gap-x-[<value>]` | `column-gap: <value>;` |
| `gap-y-<number>` | `row-gap: calc(var(--spacing) * <value>);` |
| `gap-y-(<custom-property>)` | `row-gap: var(<custom-property>);` |
| `gap-y-[<value>]` | `row-gap: <value>;` |

## 基本的な使い方

### 基本例

`gap-<number>` ユーティリティを使用して、グリッドとフレックスボックスレイアウトの行と列の間の間隔を変更します。

```html
<div class="grid grid-cols-2 gap-4">
  <div>01</div>
  <div>02</div>
  <div>03</div>
  <div>04</div>
</div>
```

### 行と列の間隔を個別に変更

`gap-x-<number>` と `gap-y-<number>` を使用して、列の間隔と行の間隔を個別に制御します。

```html
<div class="grid grid-cols-3 gap-x-8 gap-y-4">
  <div>01</div>
  <div>02</div>
  <div>03</div>
  <div>04</div>
  <div>05</div>
  <div>06</div>
</div>
```

## カスタム値の適用

任意の値を使用する必要がある場合は、角括弧を使用してその場でプロパティを生成できます。

```html
<div class="gap-[2rem]">
  <!-- ... -->
</div>
```

CSS変数を参照することもできます。

```html
<div class="gap-(--my-gap)">
  <!-- ... -->
</div>
```

## レスポンシブデザイン

プレフィックスを使用して、特定のブレークポイントでのみユーティリティを適用できます。

```html
<div class="grid grid-cols-2 gap-4 md:gap-8">
  <!-- ... -->
</div>
```

利用可能なすべてのブレークポイントオプションについては、[レスポンシブデザイン](/docs/responsive-design)のドキュメントを参照してください。
