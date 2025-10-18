# Text Transform

テキストの大文字・小文字変換を制御するためのユーティリティ。

## クイックリファレンス

| クラス | スタイル |
|-------|--------|
| `uppercase` | `text-transform: uppercase;` |
| `lowercase` | `text-transform: lowercase;` |
| `capitalize` | `text-transform: capitalize;` |
| `normal-case` | `text-transform: none;` |

## 基本的な使い方

### 大文字変換

`uppercase` を使用して、テキストをすべて大文字にします。

```html
<p class="uppercase">The quick brown fox jumps over the lazy dog.</p>
```

### 小文字変換

`lowercase` を使用して、テキストをすべて小文字にします。

```html
<p class="lowercase">The quick brown fox jumps over the lazy dog.</p>
```

### 単語の先頭を大文字に

`capitalize` を使用して、各単語の先頭文字を大文字にします。

```html
<p class="capitalize">The quick brown fox jumps over the lazy dog.</p>
```

### 通常のケース

`normal-case` を使用して、テキストを元のケースに戻します。

```html
<p class="normal-case">The quick brown fox jumps over the lazy dog.</p>
```

## レスポンシブデザイン

`md:` のようなブレークポイントバリアントをプレフィックスとして付けることで、特定の画面サイズで適用できます。

```html
<p class="capitalize md:uppercase">Lorem ipsum dolor sit amet...</p>
```

利用可能なすべてのブレークポイントオプションについては、[レスポンシブデザイン](/docs/responsive-design)のドキュメントを参照してください。

## ホバー、フォーカス、その他の状態

`hover:` や `focus:` などのバリアントを使用して、異なる状態でテキスト変換を条件付きで適用します。

```html
<p class="capitalize hover:uppercase">ホバーして大文字に変換</p>
```

利用可能なすべての状態修飾子については、[ホバー、フォーカス、その他の状態](/docs/hover-focus-and-other-states)のドキュメントを参照してください。
