# List Style Image

リストアイテムのマーカー画像を制御するためのユーティリティ。

## クイックリファレンス

| クラス | スタイル |
|-------|--------|
| `list-image-[<value>]` | `list-style-image: <value>;` |
| `list-image-(<custom-property>)` | `list-style-image: var(<custom-property>);` |
| `list-image-none` | `list-style-image: none;` |

## 基本的な使い方

### カスタムマーカー画像の設定

`list-image-[url(...)]` を使用して、リストアイテムにカスタムマーカー画像を設定します。

```html
<ul class="list-image-[url(/img/checkmark.png)]">
  <li>5 cups chopped Porcini mushrooms</li>
  <li>1/2 cup of olive oil</li>
  <li>3lb of celery</li>
</ul>
```

### CSS変数の使用

CSS変数でマーカー画像を制御します。

```html
<ul class="list-image-(--my-list-image)">
  <li>5 cups chopped Porcini mushrooms</li>
  <li>1/2 cup of olive oil</li>
  <li>3lb of celery</li>
</ul>
```

### マーカー画像の削除

`list-image-none` を使用して、既存のマーカー画像を削除します。

```html
<ul class="list-image-none">
  <li>5 cups chopped Porcini mushrooms</li>
  <li>1/2 cup of olive oil</li>
  <li>3lb of celery</li>
</ul>
```

## カスタム値の適用

任意の画像URLには `list-image-[<value>]` を使用します。

```html
<ul class="list-image-[url(data:image/svg+xml;base64,...)]">
  <li>項目1</li>
  <li>項目2</li>
</ul>
```

## レスポンシブデザイン

`md:` のようなブレークポイントバリアントをプレフィックスとして付けることで、特定の画面サイズで適用できます。

```html
<div class="list-image-none md:list-image-[url(/img/checkmark.png)]">
  <!-- ... -->
</div>
```

利用可能なすべてのブレークポイントオプションについては、[レスポンシブデザイン](/docs/responsive-design)のドキュメントを参照してください。
