# Text Wrap

単語の折り返し方法を制御するためのユーティリティ。

## クイックリファレンス

| クラス | スタイル |
|-------|--------|
| `text-wrap` | `text-wrap: wrap;` |
| `text-nowrap` | `text-wrap: nowrap;` |
| `text-balance` | `text-wrap: balance;` |
| `text-pretty` | `text-wrap: pretty;` |

## 基本的な使い方

### テキストの折り返しを許可

`text-wrap` を使用して、テキストを論理的なポイントで複数行に折り返します。

```html
<article class="text-wrap">
  <h3>Beloved Manhattan soup stand closes</h3>
  <p>New Yorkers are facing the winter chill with less warmth this year...</p>
</article>
```

### テキストの折り返しを防止

`text-nowrap` を使用して、テキストの折り返しを防ぎます。

```html
<article class="text-nowrap">
  <h3>Beloved Manhattan soup stand closes</h3>
  <p>New Yorkers are facing the winter chill with less warmth this year...</p>
</article>
```

### バランスの取れたテキスト折り返し

`text-balance` を使用して、テキストを行間で均等に分散します。

```html
<article>
  <h3 class="text-balance">Beloved Manhattan soup stand closes</h3>
</article>
```

**注意:** ブラウザは、テキストバランシングを約6行以下に制限します。見出しに最適です。

### きれいなテキスト折り返し

`text-pretty` を使用して、改善されたテキストレイアウトを実現します。

```html
<article>
  <h3 class="text-pretty">Beloved Manhattan soup stand closes</h3>
  <p class="text-pretty">
    New Yorkers are facing the winter chill with less warmth this year...
  </p>
</article>
```

## レスポンシブデザイン

`md:` のようなブレークポイントバリアントをプレフィックスとして付けることで、特定の画面サイズで適用できます。

```html
<article>
  <h3 class="text-wrap md:text-balance">
    Beloved Manhattan soup stand closes
  </h3>
</article>
```

利用可能なすべてのブレークポイントオプションについては、[レスポンシブデザイン](/docs/responsive-design)のドキュメントを参照してください。
