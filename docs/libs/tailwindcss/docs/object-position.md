# Object Position

## 概要

Tailwind CSSは、置換された要素のコンテンツがそのコンテナ内でどのように配置されるかを制御するユーティリティを提供します。

## 利用可能なクラス

- `object-top-left`：`object-position: top left;`
- `object-top`：`object-position: top;`
- `object-top-right`：`object-position: top right;`
- `object-left`：`object-position: left;`
- `object-center`：`object-position: center;`
- `object-right`：`object-position: right;`
- `object-bottom-left`：`object-position: bottom left;`
- `object-bottom`：`object-position: bottom;`
- `object-bottom-right`：`object-position: bottom right;`

## カスタム値

- `object-(<custom-property>)`：CSS変数を使用
- `object-[<value>]`：完全にカスタムな位置の値を設定

## 使用例

### 基本的な使用法

異なるobject-positionユーティリティを使用して、コンテナ内の画像を配置する方法を示します。

### レスポンシブデザイン

`md:`のようなレスポンシブプレフィックスと組み合わせて、異なる画面サイズで異なる配置を適用できます。

例：

```html
<img class="object-center md:object-top ..." src="/img/mountains.jpg" />
```

## 関連ユーティリティ

- object-fit
- overflow

このドキュメントは、Tailwindのユーティリティクラスを使用して画像の配置を制御するための包括的なガイドを提供しています。
