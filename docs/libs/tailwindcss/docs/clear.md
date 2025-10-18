# Clear

## 概要

`clear`ユーティリティは、フロートされた要素の周りでコンテンツがどのように回り込むかを制御します。

## 利用可能なクラス

- `clear-left`：`clear: left;`
- `clear-right`：`clear: right;`
- `clear-both`：`clear: both;`
- `clear-start`：`clear: inline-start;`
- `clear-end`：`clear: inline-end;`
- `clear-none`：`clear: none;`

## 使用例

### 左のクリア

左にフロートされた要素の下に要素を配置：

```html
<article>
  <img class="float-left ..." src="/img/snow-mountains.jpg" />
  <img class="float-right ..." src="/img/green-mountains.jpg" />
  <p class="clear-left ...">Maybe we can live without libraries...</p>
</article>
```

### 右のクリア

右にフロートされた要素の下に要素を配置：

```html
<article>
  <img class="float-left ..." src="/img/green-mountains.jpg" />
  <img class="float-right ..." src="/img/snow-mountains.jpg" />
  <p class="clear-right ...">Maybe we can live without libraries...</p>
</article>
```

### すべてのクリア

すべてのフロートされた要素の下に要素を配置：

```html
<article>
  <img class="float-left ..." src="/img/snow-mountains.jpg" />
  <img class="float-right ..." src="/img/green-mountains.jpg" />
  <p class="clear-both ...">Maybe we can live without libraries...</p>
</article>
```

### 論理プロパティ

テキスト方向に対応したクリアには`clear-start`と`clear-end`を使用：

```html
<article dir="rtl">
  <img class="float-left ..." src="/img/green-mountains.jpg" />
  <img class="float-right ..." src="/img/green-mountains.jpg" />
  <p class="clear-end ...">ربما يم</p>
</article>
```
