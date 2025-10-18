# Perspective

3D空間に配置された要素のパースペクティブを制御するためのユーティリティです。

## クイックリファレンス

| クラス | スタイル |
|-------|---------|
| `perspective-dramatic` | `perspective: var(--perspective-dramatic); /* 100px */` |
| `perspective-near` | `perspective: var(--perspective-near); /* 300px */` |
| `perspective-normal` | `perspective: var(--perspective-normal); /* 500px */` |
| `perspective-midrange` | `perspective: var(--perspective-midrange); /* 800px */` |
| `perspective-distant` | `perspective: var(--perspective-distant); /* 1200px */` |
| `perspective-none` | `perspective: none;` |
| `perspective-(<custom-property>)` | `perspective: var(<custom-property>);` |
| `perspective-[<value>]` | `perspective: <value>;` |

## 基本的な使い方

### パースペクティブを設定する

`perspective-*`ユーティリティを使用して、z平面が画面からどれだけ近いか遠いかを制御します。

```html
<div class="perspective-normal">
  <div class="rotate-y-45">
    <img src="/img/mountains.jpg" />
  </div>
</div>

<div class="perspective-distant">
  <div class="rotate-y-45">
    <img src="/img/mountains.jpg" />
  </div>
</div>
```

### パースペクティブを削除する

`perspective-none`を使用して、パースペクティブを削除します。

```html
<div class="perspective-none">
  <!-- ... -->
</div>
```

## カスタム値の適用

任意の値を使用する必要がある場合は、角括弧を使用してその場でプロパティを生成します。

```html
<div class="perspective-[750px]">
  <!-- ... -->
</div>
```

CSS変数を使用することもできます。

```html
<div class="perspective-(--my-perspective)">
  <!-- ... -->
</div>
```

## レスポンシブデザイン

特定のブレークポイントでのみパースペクティブを適用するには、既存のユーティリティクラスの前に`md:`などのレスポンシブプレフィックスを追加します。

```html
<div class="perspective-normal md:perspective-distant">
  <!-- ... -->
</div>
```

## テーマのカスタマイズ

カスタムパースペクティブ値をテーマに追加できます。

```css
@theme {
  --perspective-remote: 1800px;
}
```

## 関連ユーティリティ

- [Backface Visibility](/docs/backface-visibility)
- [Perspective Origin](/docs/perspective-origin)
