# Text Decoration Style

テキスト装飾のスタイルを制御するためのユーティリティ。

## クイックリファレンス

| クラス | スタイル |
|-------|--------|
| `decoration-solid` | `text-decoration-style: solid;` |
| `decoration-double` | `text-decoration-style: double;` |
| `decoration-dotted` | `text-decoration-style: dotted;` |
| `decoration-dashed` | `text-decoration-style: dashed;` |
| `decoration-wavy` | `text-decoration-style: wavy;` |

## 基本的な使い方

### 実線の装飾

`decoration-solid` を使用して、実線のテキスト装飾を設定します。

```html
<p class="underline decoration-solid">The quick brown fox jumps over the lazy dog.</p>
```

### 二重線の装飾

`decoration-double` を使用して、二重線のテキスト装飾を設定します。

```html
<p class="underline decoration-double">The quick brown fox jumps over the lazy dog.</p>
```

### 点線の装飾

`decoration-dotted` を使用して、点線のテキスト装飾を設定します。

```html
<p class="underline decoration-dotted">The quick brown fox jumps over the lazy dog.</p>
```

### 破線の装飾

`decoration-dashed` を使用して、破線のテキスト装飾を設定します。

```html
<p class="underline decoration-dashed">The quick brown fox jumps over the lazy dog.</p>
```

### 波線の装飾

`decoration-wavy` を使用して、波線のテキスト装飾を設定します。

```html
<p class="underline decoration-wavy">The quick brown fox jumps over the lazy dog.</p>
```

## レスポンシブデザイン

`md:` のようなブレークポイントバリアントをプレフィックスとして付けることで、特定の画面サイズで適用できます。

```html
<p class="underline decoration-solid md:decoration-dashed">
  Lorem ipsum dolor sit amet...
</p>
```

利用可能なすべてのブレークポイントオプションについては、[レスポンシブデザイン](/docs/responsive-design)のドキュメントを参照してください。

## ホバー、フォーカス、その他の状態

`hover:` や `focus:` などのバリアントを使用して、異なる状態で装飾スタイルを条件付きで適用します。

```html
<a href="#" class="underline decoration-solid hover:decoration-wavy">
  リンク
</a>
```

利用可能なすべての状態修飾子については、[ホバー、フォーカス、その他の状態](/docs/hover-focus-and-other-states)のドキュメントを参照してください。
