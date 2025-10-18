# Top / Right / Bottom / Left

## 概要

Tailwind CSSは、top、right、bottom、left、およびinsetクラスを使用して、配置された要素の配置を制御するユーティリティを提供します。

## 主な機能

- 正確な数値と分数値を使用した要素の配置制御
- 正と負の配置のサポート
- 柔軟な配置オプション：
  - `inset-<number>`
  - `top-<number>`
  - `right-<number>`
  - `bottom-<number>`
  - `left-<number>`

## クラスとスタイルの例

### 基本的な配置

```html
<!-- 左上隅に固定 -->
<div class="absolute top-0 left-0 size-16">01</div>

<!-- 上端にまたがる -->
<div class="absolute inset-x-0 top-0 h-16">02</div>

<!-- 親要素全体を埋める -->
<div class="absolute inset-0">05</div>
```

### 負の値

```html
<div class="relative size-32">
  <div class="absolute -top-4 -left-4 size-14"></div>
</div>
```

### 論理プロパティ

テキスト方向に適応する`start-`と`end-`ユーティリティのサポート：

```html
<div dir="ltr">
  <div class="absolute start-0 top-0 size-14"></div>
</div>
```

### カスタム値

```html
<div class="inset-[3px]">...</div>
<div class="inset-(--my-position)">...</div>
```

## レスポンシブデザイン

`md:top-6`のようなブレークポイントバリアントを使用して、特定の画面サイズでユーティリティを適用します。

## カスタマイズ

配置ユーティリティは`--spacing`テーマ変数によって駆動され、テーマ設定でカスタマイズできます。
