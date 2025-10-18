# Line Clamp

テキストを特定の行数で切り詰めるためのユーティリティ。

## クイックリファレンス

| クラス | スタイル |
|-------|--------|
| `line-clamp-<number>` | 指定された行数でテキストを切り詰める |
| `line-clamp-none` | 行の切り詰めを解除 |
| `line-clamp-[<value>]` | カスタムの行数で切り詰め |

## 基本的な使い方

### テキストの切り詰め

`line-clamp-{number}` を使用して、テキストを特定の行数で切り詰めます。

```html
<p class="line-clamp-3">
  長いテキストがここに入ります。このテキストは3行以降が切り詰められて、
  省略記号（...）が表示されます。これにより、一貫したレイアウトを
  維持しながら、長いコンテンツを扱うことができます。
</p>
```

### 行の切り詰めの解除

`line-clamp-none` を使用して、行の切り詰めを解除します。

```html
<p class="line-clamp-3 lg:line-clamp-none">
  このテキストは小さい画面では3行で切り詰められますが、
  大きい画面では全文が表示されます。
</p>
```

## カスタム値の適用

完全にカスタムの行数には `line-clamp-[<value>]` を使用します。

```html
<p class="line-clamp-[10]">Lorem ipsum dolor sit amet...</p>
```

動的な値にはCSS変数を使用できます。

```html
<p class="line-clamp-[calc(var(--characters)/100)]">Lorem ipsum dolor sit amet...</p>
```

## レスポンシブデザイン

`md:` のようなブレークポイントバリアントをプレフィックスとして付けることで、特定の画面サイズで適用できます。

```html
<div class="line-clamp-3 md:line-clamp-4">Lorem ipsum dolor sit amet...</div>
```

利用可能なすべてのブレークポイントオプションについては、[レスポンシブデザイン](/docs/responsive-design)のドキュメントを参照してください。
