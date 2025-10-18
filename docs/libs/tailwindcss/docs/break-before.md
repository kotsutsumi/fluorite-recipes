# Break Before

要素の前にカラムまたはページがどのように改行されるべきかを制御するユーティリティクラスです。

## 利用可能なクラス

- `break-before-auto`：デフォルトの改行動作
- `break-before-avoid`：要素の前の改行を防止
- `break-before-all`：要素の前に強制的に改行
- `break-before-avoid-page`：要素の前のページ改行を防止
- `break-before-page`：要素の前に強制的にページ改行
- `break-before-left`：左ページに改行
- `break-before-right`：右ページに改行
- `break-before-column`：新しいカラムに改行

## 使用例

```html
<div class="columns-2">
  <p>Well, let me tell you something, ...</p>
  <p class="break-before-column">Sure, go ahead, laugh...</p>
  <p>Maybe we can live without...</p>
  <p>Look. If you think this is...</p>
</div>
```

## レスポンシブデザイン

`md:break-before-auto`のようなブレークポイントバリアントを使用して、特定の画面サイズでユーティリティを適用できます。

## 関連ユーティリティ

- break-after
- break-inside
