# Font Weight

要素のフォントの太さを制御するためのユーティリティ。

## クイックリファレンス

| クラス | スタイル |
|-------|--------|
| `font-thin` | `font-weight: 100;` |
| `font-extralight` | `font-weight: 200;` |
| `font-light` | `font-weight: 300;` |
| `font-normal` | `font-weight: 400;` |
| `font-medium` | `font-weight: 500;` |
| `font-semibold` | `font-weight: 600;` |
| `font-bold` | `font-weight: 700;` |
| `font-extrabold` | `font-weight: 800;` |
| `font-black` | `font-weight: 900;` |
| `font-(<custom-property>)` | `font-weight: var(<custom-property>);` |
| `font-[<value>]` | `font-weight: <value>;` |

## 基本的な使い方

### フォントの太さの設定

`font-thin` や `font-bold` などのユーティリティを使用して、フォントの太さを設定します。

```html
<p class="font-thin">The quick brown fox jumps over the lazy dog.</p>
<p class="font-extralight">The quick brown fox jumps over the lazy dog.</p>
<p class="font-light">The quick brown fox jumps over the lazy dog.</p>
<p class="font-normal">The quick brown fox jumps over the lazy dog.</p>
<p class="font-medium">The quick brown fox jumps over the lazy dog.</p>
<p class="font-semibold">The quick brown fox jumps over the lazy dog.</p>
<p class="font-bold">The quick brown fox jumps over the lazy dog.</p>
<p class="font-extrabold">The quick brown fox jumps over the lazy dog.</p>
<p class="font-black">The quick brown fox jumps over the lazy dog.</p>
```

## カスタム値の適用

完全にカスタムのフォントの太さには `font-[<value>]` を使用します。

```html
<p class="font-[1000]">Lorem ipsum dolor sit amet...</p>
```

CSS変数の場合は、`font-(weight:<custom-property>)` 構文を使用します。

```html
<p class="font-(weight:--my-font-weight)">Lorem ipsum dolor sit amet...</p>
```

## レスポンシブデザイン

`md:` のようなブレークポイントバリアントをプレフィックスとして付けることで、特定の画面サイズで適用できます。

```html
<p class="font-normal md:font-bold">Lorem ipsum dolor sit amet...</p>
```

利用可能なすべてのブレークポイントオプションについては、[レスポンシブデザイン](/docs/responsive-design)のドキュメントを参照してください。
