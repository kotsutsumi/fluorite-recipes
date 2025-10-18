# Skew

変形で要素を傾斜させるためのユーティリティです。

## クイックリファレンス

| クラス | スタイル |
|-------|---------|
| `skew-<number>` | `transform: skewX(<number>deg) skewY(<number>deg);` |
| `-skew-<number>` | `transform: skewX(-<number>deg) skewY(-<number>deg);` |
| `skew-x-<number>` | `transform: skewX(<number>deg);` |
| `-skew-x-<number>` | `transform: skewX(-<number>deg);` |
| `skew-y-<number>` | `transform: skewY(<number>deg);` |
| `-skew-y-<number>` | `transform: skewY(-<number>deg);` |
| `skew-(<custom-property>)` | `transform: var(<custom-property>);` |
| `skew-[<value>]` | `transform: <value>;` |

## 基本的な使い方

### 要素を傾斜させる

`skew-x-*`および`skew-y-*`ユーティリティを使用して、要素を傾斜させます。

```html
<img class="skew-3" src="/img/mountains.jpg" />
<img class="-skew-x-12" src="/img/mountains.jpg" />
<img class="skew-y-6" src="/img/mountains.jpg" />
```

### 水平方向に傾斜させる

`skew-x-*`ユーティリティを使用して、要素を水平方向に傾斜させます。

```html
<img class="skew-x-0" src="/img/mountains.jpg" />
<img class="skew-x-3" src="/img/mountains.jpg" />
<img class="skew-x-6" src="/img/mountains.jpg" />
<img class="skew-x-12" src="/img/mountains.jpg" />
```

### 垂直方向に傾斜させる

`skew-y-*`ユーティリティを使用して、要素を垂直方向に傾斜させます。

```html
<img class="skew-y-0" src="/img/mountains.jpg" />
<img class="skew-y-3" src="/img/mountains.jpg" />
<img class="skew-y-6" src="/img/mountains.jpg" />
<img class="skew-y-12" src="/img/mountains.jpg" />
```

## カスタム値の適用

任意の値を使用する必要がある場合は、角括弧を使用してその場でプロパティを生成します。

```html
<img class="skew-[3.142rad]" src="/img/mountains.jpg" />
```

CSS変数を使用することもできます。

```html
<img class="skew-(--my-skew)" src="/img/mountains.jpg" />
```

## レスポンシブデザイン

特定のブレークポイントでのみ傾斜を適用するには、既存のユーティリティクラスの前に`md:`などのレスポンシブプレフィックスを追加します。

```html
<img class="skew-x-0 md:skew-x-6" src="/img/mountains.jpg" />
```

## ホバー、フォーカス、その他の状態

`hover:`などの状態バリアントを使用して、異なる状態で傾斜を条件付きで適用します。

```html
<img class="hover:skew-x-6" src="/img/mountains.jpg" />
```
