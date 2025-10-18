# White Space

要素のホワイトスペースプロパティを制御するためのユーティリティ。

## クイックリファレンス

| クラス | スタイル |
|-------|--------|
| `whitespace-normal` | `white-space: normal;` |
| `whitespace-nowrap` | `white-space: nowrap;` |
| `whitespace-pre` | `white-space: pre;` |
| `whitespace-pre-line` | `white-space: pre-line;` |
| `whitespace-pre-wrap` | `white-space: pre-wrap;` |
| `whitespace-break-spaces` | `white-space: break-spaces;` |

## 基本的な使い方

### 通常

`whitespace-normal` を使用して、テキストを要素内で通常通り折り返します。改行とスペースは折りたたまれます。

```html
<p class="whitespace-normal">
  Lorem ipsum dolor sit amet,
  consectetur adipiscing elit.
</p>
```

### 折り返しなし

`whitespace-nowrap` を使用して、テキストの折り返しを防ぎます。改行とスペースは折りたたまれます。

```html
<p class="whitespace-nowrap">
  Lorem ipsum dolor sit amet, consectetur adipiscing elit.
</p>
```

### Pre

`whitespace-pre` を使用して、改行とスペースを正確に保持します。テキストの折り返しはありません。

```html
<pre class="whitespace-pre">
  Lorem ipsum dolor sit amet,
  consectetur adipiscing elit.
</pre>
```

### Pre Line

`whitespace-pre-line` を使用して、改行を保持しますがスペースは折りたたまれます。通常のテキスト折り返しが許可されます。

```html
<p class="whitespace-pre-line">
  Lorem ipsum dolor sit amet,
  consectetur adipiscing elit.
</p>
```

### Pre Wrap

`whitespace-pre-wrap` を使用して、改行とスペースの両方を保持します。通常のテキスト折り返しが許可されます。

```html
<p class="whitespace-pre-wrap">
  Lorem ipsum dolor sit amet,
  consectetur adipiscing elit.
</p>
```

### Break Spaces

`whitespace-break-spaces` を使用して、改行とスペースを保持します。行末のホワイトスペースが次の行に折り返されます。

```html
<p class="whitespace-break-spaces">
  Lorem ipsum dolor sit amet,
  consectetur adipiscing elit.
</p>
```

## レスポンシブデザイン

`md:` のようなブレークポイントバリアントをプレフィックスとして付けることで、特定の画面サイズで適用できます。

```html
<p class="whitespace-pre md:whitespace-normal">
  Lorem ipsum dolor sit amet,
  consectetur adipiscing elit.
</p>
```

利用可能なすべてのブレークポイントオプションについては、[レスポンシブデザイン](/docs/responsive-design)のドキュメントを参照してください。
