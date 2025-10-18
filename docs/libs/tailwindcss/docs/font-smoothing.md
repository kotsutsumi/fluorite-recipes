# Font Smoothing

要素のフォントスムージングを制御するためのユーティリティ。

## クイックリファレンス

| クラス | スタイル |
|-------|--------|
| `antialiased` | `-webkit-font-smoothing: antialiased;`<br>`-moz-osx-font-smoothing: grayscale;` |
| `subpixel-antialiased` | `-webkit-font-smoothing: auto;`<br>`-moz-osx-font-smoothing: auto;` |

## 基本的な使い方

### グレースケールアンチエイリアス

`antialiased` ユーティリティを使用して、グレースケールアンチエイリアスを使用してテキストをレンダリングします。

```html
<p class="antialiased ...">The quick brown fox ...</p>
```

### サブピクセルアンチエイリアス

`subpixel-antialiased` ユーティリティを使用して、サブピクセルアンチエイリアスを使用してテキストをレンダリングします。

```html
<p class="subpixel-antialiased ...">The quick brown fox ...</p>
```

## レスポンシブデザイン

`md:` のようなブレークポイントバリアントをプレフィックスとして付けることで、特定の画面サイズで適用できます。

```html
<p class="antialiased md:subpixel-antialiased ...">
  Lorem ipsum dolor sit amet...
</p>
```

利用可能なすべてのブレークポイントオプションについては、[レスポンシブデザイン](/docs/responsive-design)のドキュメントを参照してください。

## 関連ユーティリティ

- [font-size](/docs/font-size)
- [font-style](/docs/font-style)
