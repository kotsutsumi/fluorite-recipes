# Isolation

## 概要

要素が明示的に新しいスタッキングコンテキストを作成すべきかどうかを制御するユーティリティです。

## 利用可能なクラス

- `isolate`：`isolation: isolate;`を設定
- `isolation-auto`：`isolation: auto;`を設定

## 使用例

### 基本的な例

`isolate`と`isolation-auto`ユーティリティを使用してスタッキングコンテキストを制御：

```html
<div class="isolate ...">  <!-- ... --></div>
```

### レスポンシブデザイン

レスポンシブブレークポイントバリアントでisolationユーティリティを適用できます：

```html
<div class="isolate md:isolation-auto ...">  <!-- ... --></div>
```

## 追加情報

- レスポンシブデザインブレークポイントと使用可能
- 要素のスタッキングとレイヤリングを制御するのに役立ちます
- TailwindのLayoutユーティリティの一部

## 関連ユーティリティ

- clear
- object-fit

このドキュメントは、Tailwind CSSでisolationユーティリティを使用する方法について、スタッキングコンテキストの作成と管理におけるそれらの適用を示す明確な説明を提供しています。
