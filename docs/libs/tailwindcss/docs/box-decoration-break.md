# Box Decoration Break

## 概要

`box-decoration-break`ユーティリティは、要素のフラグメントが複数の行、カラム、またはページにわたってどのようにレンダリングされるかを制御します。

## 利用可能なクラス

- `box-decoration-clone`：`box-decoration-break: clone;`
- `box-decoration-slice`：`box-decoration-break: slice;`

## 主要機能

これらのユーティリティは、要素が複数の行に分割されたときに、background、border、box-shadow、paddingなどのプロパティがどのように適用されるかを決定します。

## 使用例

```html
<span class="box-decoration-slice bg-linear-to-r from-indigo-600 to-pink-500 px-2 text-white">
  Hello<br />World
</span>

<span class="box-decoration-clone bg-linear-to-r from-indigo-600 to-pink-500 px-2 text-white">
  Hello<br />World
</span>
```

## レスポンシブデザイン

`md:box-decoration-clone`のようなブレークポイントバリアントを使用して、特定の画面サイズでユーティリティを適用できます。

## 関連ユーティリティ

- break-inside
- box-sizing

このドキュメントは、これらのユーティリティが異なるコンテキストでフラグメント化された要素のレンダリングをどのように変更するかについて明確な説明を提供しています。
