# Vertical Align

インラインまたはテーブルセル要素の垂直方向の配置を制御するためのユーティリティ。

## クイックリファレンス

| クラス | スタイル |
|-------|--------|
| `align-baseline` | `vertical-align: baseline;` |
| `align-top` | `vertical-align: top;` |
| `align-middle` | `vertical-align: middle;` |
| `align-bottom` | `vertical-align: bottom;` |
| `align-text-top` | `vertical-align: text-top;` |
| `align-text-bottom` | `vertical-align: text-bottom;` |
| `align-sub` | `vertical-align: sub;` |
| `align-super` | `vertical-align: super;` |

## 基本的な使い方

### ベースライン揃え

`align-baseline` を使用して、要素のベースラインを親のベースラインに揃えます。

```html
<span class="inline-block align-baseline">The quick brown fox...</span>
```

### 上揃え

`align-top` を使用して、要素の上端を行全体の上端に揃えます。

```html
<span class="inline-block align-top">The quick brown fox...</span>
```

### 中央揃え

`align-middle` を使用して、要素の中央を親の中央に揃えます。

```html
<span class="inline-block align-middle">The quick brown fox...</span>
```

### 下揃え

`align-bottom` を使用して、要素の下端を行全体の下端に揃えます。

```html
<span class="inline-block align-bottom">The quick brown fox...</span>
```

### テキスト上端揃え

`align-text-top` を使用して、要素の上端を親のフォントの上端に揃えます。

```html
<span class="inline-block align-text-top">The quick brown fox...</span>
```

### テキスト下端揃え

`align-text-bottom` を使用して、要素の下端を親のフォントの下端に揃えます。

```html
<span class="inline-block align-text-bottom">The quick brown fox...</span>
```

### 下付き文字

`align-sub` を使用して、要素を下付き文字として配置します。

```html
<p>H<span class="align-sub">2</span>O</p>
```

### 上付き文字

`align-super` を使用して、要素を上付き文字として配置します。

```html
<p>E = mc<span class="align-super">2</span></p>
```

## カスタム値の適用

完全にカスタムの垂直配置には `align-[<value>]` を使用します。

```html
<span class="align-[4px]">Lorem ipsum dolor sit amet...</span>
```

CSS変数の場合は、`align-(<custom-property>)` 構文を使用します。

```html
<span class="align-(--my-alignment)">Lorem ipsum dolor sit amet...</span>
```

## レスポンシブデザイン

`md:` のようなブレークポイントバリアントをプレフィックスとして付けることで、特定の画面サイズで適用できます。

```html
<span class="align-middle md:align-top">Lorem ipsum dolor sit amet...</span>
```

利用可能なすべてのブレークポイントオプションについては、[レスポンシブデザイン](/docs/responsive-design)のドキュメントを参照してください。
