# Text Indent

ブロック内のテキストの前に表示される空白の量を制御するためのユーティリティ。

## クイックリファレンス

| クラス | スタイル |
|-------|--------|
| `indent-<number>` | `text-indent: calc(var(--spacing) * <number>)` |
| `-indent-<number>` | `text-indent: calc(var(--spacing) * -<number>)` |
| `indent-px` | `text-indent: 1px` |
| `-indent-px` | `text-indent: -1px` |
| `indent-(<custom-property>)` | `text-indent: var(<custom-property>)` |
| `indent-[<value>]` | `text-indent: <value>` |

## 基本的な使い方

### インデントの追加

`indent-{number}` を使用して、テキストにインデントを追加します。

```html
<p class="indent-8">
  So I started to walk into the water. I won't lie to you boys, I was terrified.
  But I pressed on, and as I made my way past the breakers a strange calm came
  over me. I don't know if it was divine intervention or the kinship of all
  living things but I tell you Jerry at that moment, I <em>was</em> a marine
  biologist.
</p>
```

```html
<p class="indent-16">
  So I started to walk into the water. I won't lie to you boys, I was terrified.
  But I pressed on, and as I made my way past the breakers a strange calm came
  over me.
</p>
```

### 負のインデント

ダッシュプレフィックスを使用して、負のインデント値を設定します。

```html
<p class="-indent-8">
  So I started to walk into the water. I won't lie to you boys, I was terrified.
  But I pressed on, and as I made my way past the breakers a strange calm came
  over me.
</p>
```

## カスタム値の適用

完全にカスタムのインデントには `indent-[<value>]` を使用します。

```html
<p class="indent-[50%]">Lorem ipsum dolor sit amet...</p>
<p class="indent-[3rem]">Lorem ipsum dolor sit amet...</p>
```

CSS変数の場合は、`indent-(<custom-property>)` 構文を使用します。

```html
<p class="indent-(--my-indent)">Lorem ipsum dolor sit amet...</p>
```

## レスポンシブデザイン

`md:` のようなブレークポイントバリアントをプレフィックスとして付けることで、特定の画面サイズで適用できます。

```html
<p class="indent-4 md:indent-8">Lorem ipsum dolor sit amet...</p>
```

利用可能なすべてのブレークポイントオプションについては、[レスポンシブデザイン](/docs/responsive-design)のドキュメントを参照してください。
