# Color

要素のテキストカラーを制御するためのユーティリティ。

## クイックリファレンス

| クラス | 説明 |
|-------|--------|
| `text-{color}-{shade}` | 特定の色と濃淡を設定（例：`text-blue-600`） |
| `text-inherit` | 親要素から色を継承 |
| `text-current` | 現在の色を使用 |
| `text-transparent` | 透明なテキスト |
| `text-black` | 黒いテキスト |
| `text-white` | 白いテキスト |

## 基本的な使い方

### テキストカラーの設定

`text-{color}-{shade}` を使用して、テキストの色を設定します。

```html
<p class="text-blue-600">The quick brown fox jumps over the lazy dog.</p>
<p class="text-sky-400">The quick brown fox jumps over the lazy dog.</p>
<p class="text-emerald-500">The quick brown fox jumps over the lazy dog.</p>
```

### 不透明度の変更

`text-{color}-{shade}/{opacity}` を使用して、テキストカラーの不透明度を変更します。

```html
<p class="text-blue-600/100">不透明度100%</p>
<p class="text-blue-600/75">不透明度75%</p>
<p class="text-blue-600/50">不透明度50%</p>
<p class="text-blue-600/25">不透明度25%</p>
<p class="text-blue-600/0">不透明度0%</p>
```

### ダークモードでの色の変更

`dark:` プレフィックスを使用して、ダークモードでの色を設定します。

```html
<p class="text-blue-600 dark:text-sky-400">
  The quick brown fox jumps over the lazy dog.
</p>
```

## カスタム値の適用

完全にカスタムの色には `text-[<value>]` を使用します。

```html
<p class="text-[#50d71e]">Lorem ipsum dolor sit amet...</p>
<p class="text-[rgb(255,0,0)]">Lorem ipsum dolor sit amet...</p>
```

CSS変数の場合は、`text-(<custom-property>)` 構文を使用します。

```html
<p class="text-(--my-color)">Lorem ipsum dolor sit amet...</p>
```

## レスポンシブデザイン

`md:` のようなブレークポイントバリアントをプレフィックスとして付けることで、特定の画面サイズで適用できます。

```html
<p class="text-blue-600 md:text-green-600">Lorem ipsum dolor sit amet...</p>
```

利用可能なすべてのブレークポイントオプションについては、[レスポンシブデザイン](/docs/responsive-design)のドキュメントを参照してください。

## ホバー、フォーカス、その他の状態

`hover:` や `focus:` などのバリアントを使用して、異なる状態でテキストカラーを条件付きで適用します。

```html
<a href="#" class="text-blue-600 hover:text-blue-800">リンク</a>
```

利用可能なすべての状態修飾子については、[ホバー、フォーカス、その他の状態](/docs/hover-focus-and-other-states)のドキュメントを参照してください。
