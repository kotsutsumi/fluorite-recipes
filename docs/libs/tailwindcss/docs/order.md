# Order

フレックスおよびグリッドアイテムの順序を制御するためのユーティリティ。

## クイックリファレンス

| クラス | スタイル |
|-------|--------|
| `order-<number>` | `order: <number>;` |
| `-order-<number>` | `order: calc(<number> * -1);` |
| `order-first` | `order: -9999;` |
| `order-last` | `order: 9999;` |
| `order-none` | `order: 0;` |
| `order-(<custom-property>)` | `order: var(<custom-property>);` |
| `order-[<value>]` | `order: <value>;` |

## 基本的な使い方

### 明示的にソート順を設定

`order-<number>` ユーティリティを使用して、フレックスおよびグリッドアイテムを異なる順序でレンダリングします。

```html
<div class="flex justify-between ...">
  <div class="order-3 ...">01</div>
  <div class="order-1 ...">02</div>
  <div class="order-2 ...">03</div>
</div>
```

### アイテムを最初または最後に配置

`order-first` と `order-last` を使用して、アイテムを最初または最後にレンダリングします。

```html
<div class="flex justify-between ...">
  <div class="order-last ...">01</div>
  <div class="...">02</div>
  <div class="order-first ...">03</div>
</div>
```

### 負の値の使用

負の順序値を使用するには、クラス名の前にダッシュを付けます。

```html
<div class="-order-1">
  <!-- ... -->
</div>
```

## カスタム値の適用

任意の値を使用する必要がある場合は、角括弧を使用してその場でプロパティを生成できます。

```html
<div class="order-[min(var(--total-items),10)] ...">
  <!-- ... -->
</div>
```

CSS変数を参照することもできます。

```html
<div class="order-(--my-order) ...">
  <!-- ... -->
</div>
```

## レスポンシブデザイン

プレフィックスを使用して、特定のブレークポイントでのみユーティリティを適用できます。

```html
<div class="order-last md:order-first ...">
  <!-- ... -->
</div>
```

利用可能なすべてのブレークポイントオプションについては、[レスポンシブデザイン](/docs/responsive-design)のドキュメントを参照してください。
