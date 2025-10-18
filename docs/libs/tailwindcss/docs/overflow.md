# Overflow

## Overflowユーティリティの概要

Tailwindは、コンテンツが要素のコンテナを超えた場合の処理方法を制御するユーティリティを提供します。

## 主要なクラス

- `overflow-auto`：コンテンツがオーバーフローしたときにスクロールバーを追加
- `overflow-hidden`：コンテナを超えるコンテンツをクリップ
- `overflow-visible`：コンテナの外側でコンテンツが表示されることを許可
- `overflow-clip`：コンテナの境界でコンテンツをクリップ
- `overflow-scroll`：常にスクロールバーを表示

## 方向別のOverflowクラス

- `overflow-x-auto`/`overflow-y-auto`：必要に応じて水平/垂直スクロール
- `overflow-x-hidden`/`overflow-y-hidden`：水平/垂直コンテンツのクリップ
- `overflow-x-scroll`/`overflow-y-scroll`：常に水平/垂直スクロールバーを表示

## 主な例

### 1. オーバーフローするコンテンツを表示

```html
<div class="overflow-visible ...">  <!-- コンテンツがコンテナを超えて拡張される可能性があります --></div>
```

### 2. オーバーフローするコンテンツを非表示

```html
<div class="overflow-hidden ...">  <!-- コンテンツがコンテナのエッジでクリップされます --></div>
```

### 3. 必要に応じてスクロール

```html
<div class="overflow-auto ...">  <!-- コンテンツがオーバーフローした場合にのみスクロールバーが表示されます --></div>
```

## 追加情報

- ブレークポイントプレフィックスを使用したレスポンシブデザインをサポート
- コンテンツの表示とスクロール動作の細かい制御を提供
