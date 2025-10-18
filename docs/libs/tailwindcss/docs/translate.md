# Translate

要素を移動させるためのユーティリティです。

## クイックリファレンス

| クラス | スタイル |
|-------|---------|
| `translate-<number>` | スペーシングスケールを使用して要素を移動 |
| `translate-x-<number>` | 水平方向に移動 |
| `translate-y-<number>` | 垂直方向に移動 |
| `translate-z-<number>` | Z軸方向に移動 |
| `-translate-<number>` | 負の方向に移動 |
| `translate-(<custom-property>)` | `translate: var(<custom-property>);` |
| `translate-[<value>]` | `translate: <value>;` |

## 基本的な使い方

### スペーシングスケールを使用した移動

`translate-*`ユーティリティを使用して、スペーシングスケールに基づいて要素を移動します。

```html
<img class="-translate-6" src="/img/mountains.jpg" />
<img class="translate-2" src="/img/mountains.jpg" />
<img class="translate-8" src="/img/mountains.jpg" />
```

### パーセンテージを使用した移動

分数値を使用して、要素のサイズに基づいてパーセンテージで移動します。

```html
<img class="-translate-1/4" src="/img/mountains.jpg" />
<img class="translate-1/2" src="/img/mountains.jpg" />
<img class="translate-full" src="/img/mountains.jpg" />
```

### 水平方向に移動

`translate-x-*`ユーティリティを使用して、要素を水平方向に移動します。

```html
<img class="translate-x-4" src="/img/mountains.jpg" />
<img class="-translate-x-8" src="/img/mountains.jpg" />
```

### 垂直方向に移動

`translate-y-*`ユーティリティを使用して、要素を垂直方向に移動します。

```html
<img class="translate-y-6" src="/img/mountains.jpg" />
<img class="-translate-y-4" src="/img/mountains.jpg" />
```

### Z軸方向に移動

`translate-z-*`ユーティリティを使用して、要素をZ軸方向に移動します。親要素に`transform-3d`が必要です。

```html
<div class="perspective-normal transform-3d">
  <img class="translate-z-4" src="/img/mountains.jpg" />
</div>
```

## カスタム値の適用

任意の値を使用する必要がある場合は、角括弧を使用してその場でプロパティを生成します。

```html
<img class="translate-x-[50%]" src="/img/mountains.jpg" />
<img class="translate-y-[3.23rem]" src="/img/mountains.jpg" />
```

CSS変数を使用することもできます。

```html
<img class="translate-(--my-translate)" src="/img/mountains.jpg" />
```

## レスポンシブデザイン

特定のブレークポイントでのみ移動を適用するには、既存のユーティリティクラスの前に`md:`などのレスポンシブプレフィックスを追加します。

```html
<img class="translate-x-0 md:translate-x-4" src="/img/mountains.jpg" />
```

## ホバー、フォーカス、その他の状態

`hover:`などの状態バリアントを使用して、異なる状態で移動を条件付きで適用します。

```html
<img class="hover:translate-y-1" src="/img/mountains.jpg" />
```
