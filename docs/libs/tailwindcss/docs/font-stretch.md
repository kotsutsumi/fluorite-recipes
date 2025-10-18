# Font Stretch

フォントフェイスの幅を選択するためのユーティリティ。

## クイックリファレンス

| クラス | スタイル |
|-------|--------|
| `font-stretch-ultra-condensed` | `font-stretch: ultra-condensed; /* 50% */` |
| `font-stretch-extra-condensed` | `font-stretch: extra-condensed; /* 62.5% */` |
| `font-stretch-condensed` | `font-stretch: condensed; /* 75% */` |
| `font-stretch-semi-condensed` | `font-stretch: semi-condensed; /* 87.5% */` |
| `font-stretch-normal` | `font-stretch: normal; /* 100% */` |
| `font-stretch-semi-expanded` | `font-stretch: semi-expanded; /* 112.5% */` |
| `font-stretch-expanded` | `font-stretch: expanded; /* 125% */` |
| `font-stretch-extra-expanded` | `font-stretch: extra-expanded; /* 150% */` |
| `font-stretch-ultra-expanded` | `font-stretch: ultra-expanded; /* 200% */` |
| `font-stretch-<percentage>` | `font-stretch: <percentage>;` |
| `font-stretch-(<custom-property>)` | `font-stretch: var(<custom-property>);` |
| `font-stretch-[<value>]` | `font-stretch: <value>;` |

## 基本的な使い方

### フォントの幅の設定

`font-stretch-condensed` や `font-stretch-expanded` などのユーティリティを使用して、フォントフェイスの幅を設定します。

```html
<p class="font-stretch-ultra-condensed">The quick brown fox jumps over the lazy dog.</p>
<p class="font-stretch-extra-condensed">The quick brown fox jumps over the lazy dog.</p>
<p class="font-stretch-condensed">The quick brown fox jumps over the lazy dog.</p>
<p class="font-stretch-normal">The quick brown fox jumps over the lazy dog.</p>
<p class="font-stretch-expanded">The quick brown fox jumps over the lazy dog.</p>
<p class="font-stretch-extra-expanded">The quick brown fox jumps over the lazy dog.</p>
<p class="font-stretch-ultra-expanded">The quick brown fox jumps over the lazy dog.</p>
```

注: この機能を使用するには、フォントが複数の幅バリエーションをサポートしている必要があります。

## カスタム値の適用

任意の値を使用する必要がある場合は、角括弧を使用してその場でプロパティを生成できます。

```html
<p class="font-stretch-[115%]">Lorem ipsum dolor sit amet...</p>
```

CSS変数を参照することもできます。

```html
<p class="font-stretch-(--my-font-stretch)">Lorem ipsum dolor sit amet...</p>
```

## レスポンシブデザイン

プレフィックスを使用して、特定のブレークポイントでのみユーティリティを適用できます。

```html
<p class="font-stretch-normal md:font-stretch-expanded">
  Lorem ipsum dolor sit amet...
</p>
```

利用可能なすべてのブレークポイントオプションについては、[レスポンシブデザイン](/docs/responsive-design)のドキュメントを参照してください。
