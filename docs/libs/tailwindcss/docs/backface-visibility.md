# Backface Visibility

要素の背面が表示されるかどうかを制御するためのユーティリティです。

## クイックリファレンス

| クラス | スタイル |
|-------|---------|
| `backface-hidden` | `backface-visibility: hidden;` |
| `backface-visible` | `backface-visibility: visible;` |

## 基本的な使い方

### 背面を非表示にする

`backface-hidden`を使用して、要素が回転したときに背面を非表示にします。

```html
<div class="size-20 perspective-normal">
  <div class="translate-z-12 rotate-x-0 bg-sky-300/75 backface-hidden">1</div>
  <div class="translate-z-12 rotate-x-90 bg-sky-300/75 backface-hidden">2</div>
  <div class="translate-z-12 rotate-x-180 bg-sky-300/75 backface-hidden">3</div>
  <div class="translate-z-12 rotate-x-270 bg-sky-300/75 backface-hidden">4</div>
</div>
```

### 背面を表示する

`backface-visible`を使用して、要素が回転したときに背面を表示します。

```html
<div class="size-20 perspective-normal">
  <div class="translate-z-12 rotate-x-0 bg-sky-300/75 backface-visible">1</div>
  <div class="translate-z-12 rotate-x-90 bg-sky-300/75 backface-visible">2</div>
  <div class="translate-z-12 rotate-x-180 bg-sky-300/75 backface-visible">3</div>
  <div class="translate-z-12 rotate-x-270 bg-sky-300/75 backface-visible">4</div>
</div>
```

## レスポンシブデザイン

特定のブレークポイントでのみ背面の可視性を適用するには、既存のユーティリティクラスの前に`md:`などのレスポンシブプレフィックスを追加します。

```html
<div class="backface-visible md:backface-hidden">
  <!-- ... -->
</div>
```

## 関連ユーティリティ

- [Animation](/docs/animation)
- [Perspective](/docs/perspective)
