# List Style Position

リスト内の箇条書きや番号の位置を制御するためのユーティリティ。

## クイックリファレンス

| クラス | スタイル |
|-------|--------|
| `list-inside` | `list-style-position: inside;` |
| `list-outside` | `list-style-position: outside;` |

## 基本的な使い方

### インサイド配置

`list-inside` を使用して、マーカーをコンテンツボックスの内側に配置します。

```html
<ul class="list-inside">
  <li>5 cups chopped Porcini mushrooms</li>
  <li>1/2 cup of olive oil</li>
  <li>3lb of celery</li>
</ul>
```

### アウトサイド配置

`list-outside` を使用して、マーカーをコンテンツボックスの外側に配置します。

```html
<ul class="list-outside">
  <li>5 cups chopped Porcini mushrooms</li>
  <li>1/2 cup of olive oil</li>
  <li>3lb of celery</li>
</ul>
```

## レスポンシブデザイン

`md:` のようなブレークポイントバリアントをプレフィックスとして付けることで、特定の画面サイズで適用できます。

```html
<ul class="list-outside md:list-inside">
  <li>5 cups chopped Porcini mushrooms</li>
  <li>1/2 cup of olive oil</li>
  <li>3lb of celery</li>
</ul>
```

利用可能なすべてのブレークポイントオプションについては、[レスポンシブデザイン](/docs/responsive-design)のドキュメントを参照してください。
