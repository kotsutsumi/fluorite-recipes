# Text Align

テキストの配置を制御するためのユーティリティ。

## クイックリファレンス

| クラス | スタイル |
|-------|--------|
| `text-left` | `text-align: left;` |
| `text-center` | `text-align: center;` |
| `text-right` | `text-align: right;` |
| `text-justify` | `text-align: justify;` |
| `text-start` | `text-align: start;` |
| `text-end` | `text-align: end;` |

## 基本的な使い方

### 左揃え

`text-left` を使用して、テキストを左揃えにします。

```html
<p class="text-left">So I started to walk into the water...</p>
```

### 中央揃え

`text-center` を使用して、テキストを中央揃えにします。

```html
<p class="text-center">So I started to walk into the water...</p>
```

### 右揃え

`text-right` を使用して、テキストを右揃えにします。

```html
<p class="text-right">So I started to walk into the water...</p>
```

### 均等割り付け

`text-justify` を使用して、テキストを均等割り付けにします。

```html
<p class="text-justify">So I started to walk into the water...</p>
```

### 開始位置揃え

`text-start` を使用して、テキストを開始位置（LTRの場合は左、RTLの場合は右）に揃えます。

```html
<p class="text-start">So I started to walk into the water...</p>
```

### 終了位置揃え

`text-end` を使用して、テキストを終了位置（LTRの場合は右、RTLの場合は左）に揃えます。

```html
<p class="text-end">So I started to walk into the water...</p>
```

## レスポンシブデザイン

`md:` のようなブレークポイントバリアントをプレフィックスとして付けることで、特定の画面サイズで適用できます。

```html
<p class="text-left md:text-center">Lorem ipsum dolor sit amet...</p>
```

利用可能なすべてのブレークポイントオプションについては、[レスポンシブデザイン](/docs/responsive-design)のドキュメントを参照してください。
