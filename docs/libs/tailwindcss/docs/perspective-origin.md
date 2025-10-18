# Perspective Origin

3D空間に配置された要素のパースペクティブ原点を制御するためのユーティリティです。

## クイックリファレンス

| クラス | スタイル |
|-------|---------|
| `perspective-origin-center` | `perspective-origin: center;` |
| `perspective-origin-top` | `perspective-origin: top;` |
| `perspective-origin-top-right` | `perspective-origin: top right;` |
| `perspective-origin-right` | `perspective-origin: right;` |
| `perspective-origin-bottom-right` | `perspective-origin: bottom right;` |
| `perspective-origin-bottom` | `perspective-origin: bottom;` |
| `perspective-origin-bottom-left` | `perspective-origin: bottom left;` |
| `perspective-origin-left` | `perspective-origin: left;` |
| `perspective-origin-top-left` | `perspective-origin: top left;` |
| `perspective-origin-(<custom-property>)` | `perspective-origin: var(<custom-property>);` |
| `perspective-origin-[<value>]` | `perspective-origin: <value>;` |

## 基本的な使い方

### パースペクティブ原点を設定する

`perspective-origin-*`ユーティリティを使用して、パースペクティブの消失点を制御します。

```html
<div class="perspective-normal perspective-origin-top">
  <div class="rotate-x-45">
    <img src="/img/mountains.jpg" />
  </div>
</div>

<div class="perspective-normal perspective-origin-bottom-right">
  <div class="rotate-x-45">
    <img src="/img/mountains.jpg" />
  </div>
</div>
```

## カスタム値の適用

任意の値を使用する必要がある場合は、角括弧を使用してその場でプロパティを生成します。

```html
<div class="perspective-origin-[200%_150%]">
  <!-- ... -->
</div>
```

CSS変数を使用することもできます。

```html
<div class="perspective-origin-(--my-origin)">
  <!-- ... -->
</div>
```

## レスポンシブデザイン

特定のブレークポイントでのみパースペクティブ原点を適用するには、既存のユーティリティクラスの前に`md:`などのレスポンシブプレフィックスを追加します。

```html
<div class="perspective-origin-center md:perspective-origin-bottom-left">
  <!-- ... -->
</div>
```

## 関連ユーティリティ

- [Perspective](/docs/perspective)
- [Rotate](/docs/rotate)
