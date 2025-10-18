# Text Decoration Thickness

テキスト装飾の太さを制御するためのユーティリティ。

## クイックリファレンス

| クラス | スタイル |
|-------|--------|
| `decoration-<number>` | `text-decoration-thickness: <number>px;` |
| `decoration-from-font` | `text-decoration-thickness: from-font;` |
| `decoration-auto` | `text-decoration-thickness: auto;` |
| `decoration-(length:<custom-property>)` | `text-decoration-thickness: var(<custom-property>);` |
| `decoration-[<value>]` | `text-decoration-thickness: <value>;` |

## 基本的な使い方

### 装飾の太さの設定

`decoration-{number}` を使用して、テキスト装飾の太さを設定します。

```html
<p class="underline decoration-1">The quick brown fox jumps over the lazy dog.</p>
<p class="underline decoration-2">The quick brown fox jumps over the lazy dog.</p>
<p class="underline decoration-4">The quick brown fox jumps over the lazy dog.</p>
<p class="underline decoration-8">The quick brown fox jumps over the lazy dog.</p>
```

### フォントから太さを取得

`decoration-from-font` を使用して、フォントファイルから装飾の太さを取得します。

```html
<p class="underline decoration-from-font">The quick brown fox jumps over the lazy dog.</p>
```

### 自動の太さ

`decoration-auto` を使用して、ブラウザがデフォルトの装飾の太さを選択するようにします。

```html
<p class="underline decoration-auto">The quick brown fox jumps over the lazy dog.</p>
```

## カスタム値の適用

完全にカスタムの太さには `decoration-[<value>]` を使用します。

```html
<p class="underline decoration-[0.25rem]">Lorem ipsum dolor sit amet...</p>
<p class="underline decoration-[3px]">Lorem ipsum dolor sit amet...</p>
```

CSS変数の場合は、`decoration-(length:<custom-property>)` 構文を使用します。

```html
<p class="underline decoration-(length:--my-decoration-thickness)">
  Lorem ipsum dolor sit amet...
</p>
```

## レスポンシブデザイン

`md:` のようなブレークポイントバリアントをプレフィックスとして付けることで、特定の画面サイズで適用できます。

```html
<p class="underline decoration-2 md:decoration-4">Lorem ipsum dolor sit amet...</p>
```

利用可能なすべてのブレークポイントオプションについては、[レスポンシブデザイン](/docs/responsive-design)のドキュメントを参照してください。

## ホバー、フォーカス、その他の状態

`hover:` や `focus:` などのバリアントを使用して、異なる状態で装飾の太さを条件付きで適用します。

```html
<a href="#" class="underline decoration-2 hover:decoration-4">リンク</a>
```

利用可能なすべての状態修飾子については、[ホバー、フォーカス、その他の状態](/docs/hover-focus-and-other-states)のドキュメントを参照してください。
