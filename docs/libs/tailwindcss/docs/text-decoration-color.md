# Text Decoration Color

テキスト装飾の色を制御するためのユーティリティ。

## クイックリファレンス

| クラス | 説明 |
|-------|--------|
| `decoration-inherit` | テキスト装飾の色を継承に設定 |
| `decoration-current` | テキスト装飾の色を現在の色に設定 |
| `decoration-transparent` | テキスト装飾の色を透明に設定 |
| `decoration-{color}-{shade}` | 特定の色と濃淡を設定（例：`decoration-sky-500`） |

## 基本的な使い方

### 装飾の色の設定

`decoration-{color}-{shade}` を使用して、テキスト装飾の色を設定します。

```html
<p>
  I'm Derek, an astro-engineer based in Tattooine. I like to build X-Wings
  at <a class="underline decoration-sky-500">My Company, Inc</a>.
</p>
```

```html
<p>
  I'm Derek, an astro-engineer based in Tattooine. I like to build X-Wings
  at <a class="underline decoration-pink-500">My Company, Inc</a>.
</p>
```

### 不透明度の変更

`decoration-{color}-{shade}/{opacity}` を使用して、装飾の色の不透明度を変更します。

```html
<p>
  I'm Derek, an astro-engineer based in Tattooine. I like to build X-Wings
  at <a class="underline decoration-sky-500/100">My Company, Inc</a>.
</p>
<p>
  I'm Derek, an astro-engineer based in Tattooine. I like to build X-Wings
  at <a class="underline decoration-sky-500/75">My Company, Inc</a>.
</p>
<p>
  I'm Derek, an astro-engineer based in Tattooine. I like to build X-Wings
  at <a class="underline decoration-sky-500/50">My Company, Inc</a>.
</p>
<p>
  I'm Derek, an astro-engineer based in Tattooine. I like to build X-Wings
  at <a class="underline decoration-sky-500/30">My Company, Inc</a>.
</p>
```

## カスタム値の適用

完全にカスタムの色には `decoration-[<value>]` を使用します。

```html
<p class="underline decoration-[#50d71e]">Lorem ipsum dolor sit amet...</p>
```

CSS変数の場合は、`decoration-(<custom-property>)` 構文を使用します。

```html
<p class="underline decoration-(--my-color)">Lorem ipsum dolor sit amet...</p>
```

## レスポンシブデザイン

`md:` のようなブレークポイントバリアントをプレフィックスとして付けることで、特定の画面サイズで適用できます。

```html
<p class="underline decoration-blue-400 md:decoration-blue-600">
  Lorem ipsum dolor sit amet...
</p>
```

利用可能なすべてのブレークポイントオプションについては、[レスポンシブデザイン](/docs/responsive-design)のドキュメントを参照してください。

## ホバー、フォーカス、その他の状態

`hover:` や `focus:` などのバリアントを使用して、異なる状態で装飾の色を条件付きで適用します。

```html
<a href="#" class="underline decoration-blue-500 hover:decoration-pink-500">
  リンク
</a>
```

利用可能なすべての状態修飾子については、[ホバー、フォーカス、その他の状態](/docs/hover-focus-and-other-states)のドキュメントを参照してください。
