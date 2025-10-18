# List Style Type

リストのマーカースタイルを制御するためのユーティリティ。

## クイックリファレンス

| クラス | スタイル |
|-------|--------|
| `list-disc` | `list-style-type: disc;` |
| `list-decimal` | `list-style-type: decimal;` |
| `list-none` | `list-style-type: none;` |
| `list-(<custom-property>)` | `list-style-type: var(<custom-property>);` |
| `list-[<value>]` | `list-style-type: <value>;` |

## 基本的な使い方

### ディスクマーカー

`list-disc` を使用して、箇条書き記号を表示します。

```html
<ul class="list-disc">
  <li>5 cups chopped Porcini mushrooms</li>
  <li>1/2 cup of olive oil</li>
  <li>3lb of celery</li>
</ul>
```

### 数字マーカー

`list-decimal` を使用して、番号付きリストを作成します。

```html
<ol class="list-decimal">
  <li>5 cups chopped Porcini mushrooms</li>
  <li>1/2 cup of olive oil</li>
  <li>3lb of celery</li>
</ol>
```

### マーカーなし

`list-none` を使用して、リストマーカーを削除します。

```html
<ul class="list-none">
  <li>5 cups chopped Porcini mushrooms</li>
  <li>1/2 cup of olive oil</li>
  <li>3lb of celery</li>
</ul>
```

## カスタム値の適用

カスタムマーカースタイルには `list-[<value>]` を使用します。

```html
<ol class="list-[upper-roman]">
  <li>最初の項目</li>
  <li>2番目の項目</li>
  <li>3番目の項目</li>
</ol>
```

```html
<ol class="list-[lower-alpha]">
  <li>最初の項目</li>
  <li>2番目の項目</li>
  <li>3番目の項目</li>
</ol>
```

CSS変数の場合は、`list-(<custom-property>)` 構文を使用します。

```html
<ol class="list-(--my-marker)">
  <li>項目1</li>
  <li>項目2</li>
</ol>
```

## レスポンシブデザイン

`md:` のようなブレークポイントバリアントをプレフィックスとして付けることで、特定の画面サイズで適用できます。

```html
<ul class="list-none md:list-disc">
  <li>5 cups chopped Porcini mushrooms</li>
  <li>1/2 cup of olive oil</li>
  <li>3lb of celery</li>
</ul>
```

利用可能なすべてのブレークポイントオプションについては、[レスポンシブデザイン](/docs/responsive-design)のドキュメントを参照してください。
