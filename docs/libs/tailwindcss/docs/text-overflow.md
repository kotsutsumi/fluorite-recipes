# Text Overflow

要素内でテキストがオーバーフローする際の処理方法を制御するためのユーティリティ。

## クイックリファレンス

| クラス | スタイル |
|-------|--------|
| `truncate` | `overflow: hidden; text-overflow: ellipsis; white-space: nowrap;` |
| `text-ellipsis` | `text-overflow: ellipsis;` |
| `text-clip` | `text-overflow: clip;` |

## 基本的な使い方

### テキストの切り詰め

`truncate` を使用して、テキストの折り返しを防ぎ、省略記号を追加します。

```html
<p class="truncate">
  The longest word in any of the major English language dictionaries is
  pneumonoultramicroscopicsilicovolcanoconiosis, a word that refers to a lung
  disease contracted from the inhalation of very fine silica particles.
</p>
```

### 省略記号の追加

`text-ellipsis` を使用して、オーバーフローするテキストを省略記号で切り詰めます。

```html
<p class="overflow-hidden text-ellipsis">
  The longest word in any of the major English language dictionaries is
  pneumonoultramicroscopicsilicovolcanoconiosis, a word that refers to a lung
  disease contracted from the inhalation of very fine silica particles.
</p>
```

### テキストのクリップ

`text-clip` を使用して、コンテンツエリアの制限でテキストを切り詰めます。

```html
<p class="overflow-hidden text-clip">
  The longest word in any of the major English language dictionaries is
  pneumonoultramicroscopicsilicovolcanoconiosis, a word that refers to a lung
  disease contracted from the inhalation of very fine silica particles.
</p>
```

## レスポンシブデザイン

`md:` のようなブレークポイントバリアントをプレフィックスとして付けることで、特定の画面サイズで適用できます。

```html
<p class="text-ellipsis md:text-clip">Lorem ipsum dolor sit amet...</p>
```

利用可能なすべてのブレークポイントオプションについては、[レスポンシブデザイン](/docs/responsive-design)のドキュメントを参照してください。

## ホバー、フォーカス、その他の状態

`hover:` や `focus:` などのバリアントを使用して、異なる状態でテキストオーバーフローを条件付きで適用します。

```html
<p class="truncate hover:text-clip">ホバーして切り詰めを変更</p>
```

利用可能なすべての状態修飾子については、[ホバー、フォーカス、その他の状態](/docs/hover-focus-and-other-states)のドキュメントを参照してください。
