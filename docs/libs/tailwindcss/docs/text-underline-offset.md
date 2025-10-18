# Text Underline Offset

テキストの下線の垂直オフセットを制御するためのユーティリティ。

## クイックリファレンス

| クラス | スタイル |
|-------|--------|
| `underline-offset-<number>` | `text-underline-offset: <number>px;` |
| `-underline-offset-<number>` | `text-underline-offset: calc(<number>px * -1);` |
| `underline-offset-auto` | `text-underline-offset: auto;` |
| `underline-offset-(<custom-property>)` | `text-underline-offset: var(<custom-property>);` |
| `underline-offset-[<value>]` | `text-underline-offset: <value>;` |

## 基本的な使い方

### 下線のオフセットの設定

`underline-offset-{number}` を使用して、テキストの下線のオフセットを設定します。

```html
<p class="underline underline-offset-1">The quick brown fox jumps over the lazy dog.</p>
<p class="underline underline-offset-2">The quick brown fox jumps over the lazy dog.</p>
<p class="underline underline-offset-4">The quick brown fox jumps over the lazy dog.</p>
<p class="underline underline-offset-8">The quick brown fox jumps over the lazy dog.</p>
```

### 自動のオフセット

`underline-offset-auto` を使用して、ブラウザがデフォルトのオフセットを選択するようにします。

```html
<p class="underline underline-offset-auto">The quick brown fox jumps over the lazy dog.</p>
```

## カスタム値の適用

完全にカスタムのオフセットには `underline-offset-[<value>]` を使用します。

```html
<p class="underline underline-offset-[3px]">Lorem ipsum dolor sit amet...</p>
<p class="underline underline-offset-[0.5em]">Lorem ipsum dolor sit amet...</p>
```

CSS変数の場合は、`underline-offset-(<custom-property>)` 構文を使用します。

```html
<p class="underline underline-offset-(--my-underline-offset)">
  Lorem ipsum dolor sit amet...
</p>
```

## レスポンシブデザイン

`md:` のようなブレークポイントバリアントをプレフィックスとして付けることで、特定の画面サイズで適用できます。

```html
<p class="underline underline-offset-2 md:underline-offset-4">
  Lorem ipsum dolor sit amet...
</p>
```

利用可能なすべてのブレークポイントオプションについては、[レスポンシブデザイン](/docs/responsive-design)のドキュメントを参照してください。

## ホバー、フォーカス、その他の状態

`hover:` や `focus:` などのバリアントを使用して、異なる状態で下線のオフセットを条件付きで適用します。

```html
<a href="#" class="underline underline-offset-2 hover:underline-offset-4">
  リンク
</a>
```

利用可能なすべての状態修飾子については、[ホバー、フォーカス、その他の状態](/docs/hover-focus-and-other-states)のドキュメントを参照してください。
