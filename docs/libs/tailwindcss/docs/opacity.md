# Opacity

要素の不透明度を制御するためのユーティリティ。

## クイックリファレンス

| クラス | スタイル |
|--------|---------|
| `opacity-<number>` | `opacity: <number>%;` |
| `opacity-(<custom-property>)` | `opacity: var(<custom-property>);` |
| `opacity-[<value>]` | `opacity: <value>;` |

## 基本的な使い方

### 不透明度の設定

`opacity-{percentage}`ユーティリティを使用して、要素の不透明度を制御します。

```html
<div class="opacity-100 ...">100%不透明</div>
<div class="opacity-75 ...">75%不透明</div>
<div class="opacity-50 ...">50%不透明</div>
<div class="opacity-25 ...">25%不透明</div>
<div class="opacity-0 ...">0%不透明（完全に透明）</div>
```

## 条件付き適用

### Hover、Focus、その他の状態

`hover:`や`focus:`などの修飾子を使用して、特定の状態でのみ不透明度ユーティリティを条件付きで適用します。

```html
<div class="opacity-50 hover:opacity-100 ...">
  <!-- ホバー時に完全に不透明になります -->
</div>
```

### Disabled状態

`disabled:`修飾子を使用して、無効な要素に不透明度を適用します。

```html
<input class="opacity-100 disabled:opacity-75 ..." type="text" />
```

## カスタム値の適用

### 任意の値

テーマに含まれていない不透明度値を使用する必要がある場合は、角括弧を使用して任意の値でプロパティを生成します。

```html
<button class="opacity-[.67] ...">
  <!-- 67%の不透明度 -->
</button>
```

### CSS変数の使用

CSS変数を使用して不透明度値をカスタマイズできます。

```html
<button class="opacity-(--my-opacity) ...">
  <!-- CSS変数を使用 -->
</button>
```

## レスポンシブデザイン

特定のブレークポイントでのみ不透明度ユーティリティを適用するには、`md:`のようなブレークポイント修飾子をプレフィックスとして追加します。

```html
<button class="opacity-50 md:opacity-100 ...">
  <!-- 中サイズの画面以上で不透明度が変わります -->
</button>
```

## 関連ユーティリティ

- [Text Shadow](/docs/text-shadow)
- [Mix Blend Mode](/docs/mix-blend-mode)
