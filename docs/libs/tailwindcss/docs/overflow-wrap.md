# Overflow Wrap

オーバーフローする要素内の単語内での改行を制御するためのユーティリティ。

## クイックリファレンス

| クラス | スタイル |
|-------|--------|
| `wrap-break-word` | `overflow-wrap: break-word;` |
| `wrap-anywhere` | `overflow-wrap: anywhere;` |
| `wrap-normal` | `overflow-wrap: normal;` |

## 基本的な使い方

### 単語の途中で折り返し

`wrap-break-word` を使用して、必要に応じて単語内の文字間で改行を許可します。

```html
<p class="wrap-break-word">
  The longest word in any of the major English language dictionaries is
  pneumonoultramicroscopicsilicovolcanoconiosis, a word that refers to a lung
  disease contracted from the inhalation of very fine silica particles.
</p>
```

### 任意の場所で折り返し

`wrap-anywhere` を使用します。`wrap-break-word` と同様に動作しますが、ブラウザは要素のサイズを計算する際に単語の途中での改行を考慮します。

```html
<p class="wrap-anywhere">
  The longest word in any of the major English language dictionaries is
  pneumonoultramicroscopicsilicovolcanoconiosis, a word that refers to a lung
  disease contracted from the inhalation of very fine silica particles.
</p>
```

### 通常の折り返し

`wrap-normal` を使用して、スペース、ハイフン、句読点など自然なポイントでのみ改行を許可します。

```html
<p class="wrap-normal">
  The longest word in any of the major English language dictionaries is
  pneumonoultramicroscopicsilicovolcanoconiosis, a word that refers to a lung
  disease contracted from the inhalation of very fine silica particles.
</p>
```

## レスポンシブデザイン

`md:` のようなブレークポイントバリアントをプレフィックスとして付けることで、特定の画面サイズで適用できます。

```html
<p class="wrap-normal md:wrap-break-word">Lorem ipsum dolor sit amet...</p>
```

利用可能なすべてのブレークポイントオプションについては、[レスポンシブデザイン](/docs/responsive-design)のドキュメントを参照してください。
