# Rotate

2Dおよび3D空間で要素を回転させるためのユーティリティです。

## クイックリファレンス

| クラス | スタイル |
|-------|---------|
| `rotate-none` | `rotate: none;` |
| `rotate-<number>` | `rotate: <number>deg;` |
| `-rotate-<number>` | `rotate: calc(<number>deg * -1);` |
| `rotate-x-<number>` | `rotate: <number>deg 0 0;` |
| `rotate-y-<number>` | `rotate: 0 <number>deg 0;` |
| `rotate-z-<number>` | `rotate: 0 0 <number>deg;` |
| `rotate-(<custom-property>)` | `rotate: var(<custom-property>);` |
| `rotate-[<value>]` | `rotate: <value>;` |

## 基本的な使い方

### 基本的な回転

`rotate-*`ユーティリティを使用して、要素を時計回りに回転させます。

```html
<img class="rotate-0" src="/img/mountains.jpg" />
<img class="rotate-45" src="/img/mountains.jpg" />
<img class="rotate-90" src="/img/mountains.jpg" />
<img class="rotate-180" src="/img/mountains.jpg" />
```

### 反時計回りの回転

負の値を使用して、要素を反時計回りに回転させます。

```html
<img class="-rotate-45" src="/img/mountains.jpg" />
<img class="-rotate-90" src="/img/mountains.jpg" />
```

### 3D回転

`rotate-x-*`、`rotate-y-*`、`rotate-z-*`ユーティリティを組み合わせて、複雑な3D変形を作成します。

```html
<div class="perspective-normal">
  <img class="rotate-x-50 rotate-z-45" src="/img/mountains.jpg" />
</div>
```

## カスタム値の適用

任意の値を使用する必要がある場合は、角括弧を使用してその場でプロパティを生成します。

```html
<img class="rotate-[17deg]" src="/img/mountains.jpg" />
```

CSS変数を使用することもできます。

```html
<img class="rotate-(--my-rotation)" src="/img/mountains.jpg" />
```

## レスポンシブデザイン

特定のブレークポイントでのみ回転を適用するには、既存のユーティリティクラスの前に`md:`などのレスポンシブプレフィックスを追加します。

```html
<img class="rotate-0 md:rotate-45" src="/img/mountains.jpg" />
```

## ホバー、フォーカス、その他の状態

`hover:`などの状態バリアントを使用して、異なる状態で回転を条件付きで適用します。

```html
<img class="hover:rotate-45" src="/img/mountains.jpg" />
```
