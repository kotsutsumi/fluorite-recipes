# Scale

要素をスケーリングするためのユーティリティです。

## クイックリファレンス

| クラス | スタイル |
|-------|---------|
| `scale-none` | `scale: none;` |
| `scale-<number>` | `scale: <number>% <number>%;` |
| `-scale-<number>` | `scale: calc(<number>% * -1);` |
| `scale-x-<number>` | `scale: <number>% var(--tw-scale-y);` |
| `scale-y-<number>` | `scale: var(--tw-scale-x) <number>%;` |
| `scale-(<custom-property>)` | `scale: var(<custom-property>);` |
| `scale-[<value>]` | `scale: <value>;` |

## 基本的な使い方

### 要素をスケーリングする

`scale-*`ユーティリティを使用して、要素を拡大または縮小します。

```html
<img class="scale-75" src="/img/mountains.jpg" />
<img class="scale-100" src="/img/mountains.jpg" />
<img class="scale-125" src="/img/mountains.jpg" />
```

### 水平方向にスケーリングする

`scale-x-*`ユーティリティを使用して、要素を水平方向にのみスケーリングします。

```html
<img class="scale-x-50" src="/img/mountains.jpg" />
<img class="scale-x-100" src="/img/mountains.jpg" />
<img class="scale-x-150" src="/img/mountains.jpg" />
```

### 垂直方向にスケーリングする

`scale-y-*`ユーティリティを使用して、要素を垂直方向にのみスケーリングします。

```html
<img class="scale-y-50" src="/img/mountains.jpg" />
<img class="scale-y-100" src="/img/mountains.jpg" />
<img class="scale-y-150" src="/img/mountains.jpg" />
```

### 負のスケール

負の値を使用して、要素を反転してスケーリングします。

```html
<img class="-scale-100" src="/img/mountains.jpg" />
<img class="-scale-x-100" src="/img/mountains.jpg" />
```

## カスタム値の適用

任意の値を使用する必要がある場合は、角括弧を使用してその場でプロパティを生成します。

```html
<img class="scale-[1.23]" src="/img/mountains.jpg" />
```

CSS変数を使用することもできます。

```html
<img class="scale-(--my-scale)" src="/img/mountains.jpg" />
```

## レスポンシブデザイン

特定のブレークポイントでのみスケールを適用するには、既存のユーティリティクラスの前に`md:`などのレスポンシブプレフィックスを追加します。

```html
<img class="scale-100 md:scale-125" src="/img/mountains.jpg" />
```

## ホバー、フォーカス、その他の状態

`hover:`などの状態バリアントを使用して、異なる状態でスケールを条件付きで適用します。

```html
<img class="scale-100 hover:scale-110" src="/img/mountains.jpg" />
```
