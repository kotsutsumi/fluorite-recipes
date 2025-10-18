# Content

`::before` および `::after` 疑似要素のコンテンツを制御するためのユーティリティ。

## クイックリファレンス

| クラス | スタイル |
|-------|--------|
| `content-[<value>]` | `content: <value>;` |
| `content-(<custom-property>)` | `content: var(<custom-property>);` |
| `content-none` | `content: none;` |

## 基本的な使い方

### 疑似要素のコンテンツの設定

`content-[<value>]` を `before:` や `after:` バリアントと組み合わせて使用し、`::before` や `::after` 疑似要素のコンテンツを設定します。

```html
<p>
  Higher resolution means more than just a better-quality image. With a Retina
  6K display, <a class="text-blue-600 after:content-['_↗']" href="https://www.apple.com/pro-display-xdr/" target="_blank">Pro Display XDR</a>
  gives you nearly 40 percent more screen real estate than a 5K display.
</p>
```

### 属性値の参照

`content-[attr(...)]` を使用して、要素の属性値をコンテンツとして参照します。

```html
<p before="Hello World" class="before:content-[attr(before)]">
  <!-- 疑似要素に "Hello World" が表示されます -->
</p>
```

### スペースとアンダースコアの処理

任意の値内のスペースをアンダースコアで置き換えます。

```html
<div class="before:content-['Hello_World']">
  <!-- "Hello World" と表示されます（スペース付き） -->
</div>
```

実際のアンダースコアを使用するには、バックスラッシュでエスケープします。

```html
<div class="before:content-['Hello\_World']">
  <!-- "Hello_World" と表示されます（アンダースコア付き） -->
</div>
```

### コンテンツの削除

`content-none` を使用して、疑似要素のコンテンツを削除します。

```html
<p class="before:content-none">
  <!-- ::before 疑似要素にコンテンツがありません -->
</p>
```

## カスタム値の適用

任意の文字列やコンテンツ値には `content-[<value>]` を使用します。

```html
<div class="before:content-['★']">評価</div>
```

CSS変数の場合は、`content-(<custom-property>)` 構文を使用します。

```html
<div class="before:content-(--my-content)">
  <!-- CSS変数のコンテンツが表示されます -->
</div>
```

## レスポンシブデザイン

`md:` のようなブレークポイントバリアントをプレフィックスとして付けることで、特定の画面サイズで適用できます。

```html
<div class="before:content-['Mobile'] md:before:content-['Desktop']">
  <!-- 画面サイズに応じて異なるコンテンツが表示されます -->
</div>
```

利用可能なすべてのブレークポイントオプションについては、[レスポンシブデザイン](/docs/responsive-design)のドキュメントを参照してください。

## ホバー、フォーカス、その他の状態

`hover:` や `focus:` などのバリアントを使用して、異なる状態でコンテンツを条件付きで適用します。

```html
<div class="before:content-['☆'] hover:before:content-['★']">
  ホバーして星を変更
</div>
```

利用可能なすべての状態修飾子については、[ホバー、フォーカス、その他の状態](/docs/hover-focus-and-other-states)のドキュメントを参照してください。
