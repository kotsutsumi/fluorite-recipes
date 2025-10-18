# Line Height

テキスト要素の行間（垂直方向の間隔）を制御するためのユーティリティ。

## クイックリファレンス

| クラス | スタイル |
|-------|--------|
| `text-<size>/<number>` | フォントサイズと行の高さを設定 |
| `leading-none` | `line-height: 1;` |
| `leading-<number>` | スペーシング変数に基づいて行の高さを計算 |
| `leading-[<value>]` | カスタムの行の高さの値 |

## 基本的な使い方

### フォントサイズと行の高さの同時設定

`text-{size}/{number}` を使用して、フォントサイズと行の高さを同時に設定します。

```html
<p class="text-sm/6">The quick brown fox jumps over the lazy dog.</p>
<p class="text-sm/7">The quick brown fox jumps over the lazy dog.</p>
<p class="text-base/loose">The quick brown fox jumps over the lazy dog.</p>
```

### 独立した行の高さの設定

`leading-{number}` を使用して、フォントサイズとは別に行の高さを設定します。

```html
<p class="text-sm leading-6">The quick brown fox jumps over the lazy dog.</p>
<p class="text-sm leading-7">The quick brown fox jumps over the lazy dog.</p>
<p class="text-sm leading-8">The quick brown fox jumps over the lazy dog.</p>
```

### デフォルトの行間の削除

`leading-none` を使用して、行の高さをフォントサイズと同じに設定します。

```html
<p class="text-2xl leading-none">The quick brown fox jumps over the lazy dog.</p>
```

## カスタム値の適用

完全にカスタムの行の高さには `leading-[<value>]` を使用します。

```html
<p class="leading-[1.5]">Lorem ipsum dolor sit amet...</p>
<p class="leading-[2rem]">Lorem ipsum dolor sit amet...</p>
```

CSS変数の場合は、`leading-(<custom-property>)` 構文を使用します。

```html
<p class="leading-(--my-line-height)">Lorem ipsum dolor sit amet...</p>
```

## レスポンシブデザイン

`md:` のようなブレークポイントバリアントをプレフィックスとして付けることで、特定の画面サイズで適用できます。

```html
<p class="leading-6 md:leading-8">Lorem ipsum dolor sit amet...</p>
```

利用可能なすべてのブレークポイントオプションについては、[レスポンシブデザイン](/docs/responsive-design)のドキュメントを参照してください。
