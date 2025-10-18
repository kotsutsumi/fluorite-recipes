# Font Style

テキストのスタイルを制御するためのユーティリティ。

## クイックリファレンス

| クラス | スタイル |
|-------|--------|
| `italic` | `font-style: italic;` |
| `not-italic` | `font-style: normal;` |

## 基本的な使い方

### テキストのイタリック化

`italic` ユーティリティを使用して、テキストをイタリック体にします。

```html
<p class="italic ...">The quick brown fox ...</p>
```

### 通常のテキスト表示

`not-italic` ユーティリティを使用して、テキストを通常のスタイルで表示します。これは、イタリック体をリセットする必要がある場合に便利です。

```html
<p class="not-italic ...">The quick brown fox ...</p>
```

## レスポンシブデザイン

`md:` のようなブレークポイントバリアントをプレフィックスとして付けることで、中サイズ以上の画面でのみユーティリティを適用できます。

```html
<p class="italic md:not-italic ...">Lorem ipsum dolor sit amet...</p>
```

利用可能なすべてのブレークポイントオプションについては、[レスポンシブデザイン](/docs/responsive-design)のドキュメントを参照してください。

## 関連ユーティリティ

- [font-smoothing](/docs/font-smoothing)
- [font-weight](/docs/font-weight)
