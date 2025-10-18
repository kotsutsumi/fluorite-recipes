# Text Decoration Line

テキスト装飾のスタイルを制御するためのユーティリティ。

## クイックリファレンス

| クラス | スタイル |
|-------|--------|
| `underline` | `text-decoration-line: underline;` |
| `overline` | `text-decoration-line: overline;` |
| `line-through` | `text-decoration-line: line-through;` |
| `no-underline` | `text-decoration-line: none;` |

## 基本的な使い方

### 下線

`underline` を使用して、テキストに下線を追加します。

```html
<p class="underline">The quick brown fox jumps over the lazy dog.</p>
```

### 上線

`overline` を使用して、テキストに上線を追加します。

```html
<p class="overline">The quick brown fox jumps over the lazy dog.</p>
```

### 取り消し線

`line-through` を使用して、テキストに取り消し線を追加します。

```html
<p class="line-through">The quick brown fox jumps over the lazy dog.</p>
```

### 下線の削除

`no-underline` を使用して、テキスト装飾を削除します。

```html
<a href="#" class="no-underline">The quick brown fox jumps over the lazy dog.</a>
```

## レスポンシブデザイン

`md:` のようなブレークポイントバリアントをプレフィックスとして付けることで、特定の画面サイズで適用できます。

```html
<a class="no-underline md:underline" href="#">Lorem ipsum dolor sit amet...</a>
```

利用可能なすべてのブレークポイントオプションについては、[レスポンシブデザイン](/docs/responsive-design)のドキュメントを参照してください。

## ホバー、フォーカス、その他の状態

`hover:` や `focus:` などのバリアントを使用して、異なる状態でテキスト装飾を条件付きで適用します。

```html
<a href="#" class="no-underline hover:underline">
  quick brown fox
</a>
```

利用可能なすべての状態修飾子については、[ホバー、フォーカス、その他の状態](/docs/hover-focus-and-other-states)のドキュメントを参照してください。
