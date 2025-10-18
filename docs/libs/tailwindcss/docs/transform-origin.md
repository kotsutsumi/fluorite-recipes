# Transform Origin

要素の変形の原点を指定するためのユーティリティです。

## クイックリファレンス

| クラス | スタイル |
|-------|---------|
| `origin-center` | `transform-origin: center;` |
| `origin-top` | `transform-origin: top;` |
| `origin-top-right` | `transform-origin: top right;` |
| `origin-right` | `transform-origin: right;` |
| `origin-bottom-right` | `transform-origin: bottom right;` |
| `origin-bottom` | `transform-origin: bottom;` |
| `origin-bottom-left` | `transform-origin: bottom left;` |
| `origin-left` | `transform-origin: left;` |
| `origin-top-left` | `transform-origin: top left;` |
| `origin-(<custom-property>)` | `transform-origin: var(<custom-property>);` |
| `origin-[<value>]` | `transform-origin: <value>;` |

## 基本的な使い方

### 変形の原点を設定する

`origin-*`ユーティリティを使用して、要素の変形の原点を制御します。

```html
<img class="origin-center rotate-45" src="/img/mountains.jpg" />
<img class="origin-top-left rotate-12" src="/img/mountains.jpg" />
<img class="origin-bottom -rotate-12" src="/img/mountains.jpg" />
```

### 中央を原点にする

`origin-center`を使用して、変形の原点を要素の中央に設定します。

```html
<img class="origin-center rotate-45" src="/img/mountains.jpg" />
```

### 左上を原点にする

`origin-top-left`を使用して、変形の原点を要素の左上隅に設定します。

```html
<img class="origin-top-left rotate-12" src="/img/mountains.jpg" />
```

### 下部を原点にする

`origin-bottom`を使用して、変形の原点を要素の下部に設定します。

```html
<img class="origin-bottom -rotate-12" src="/img/mountains.jpg" />
```

## カスタム値の適用

任意の値を使用する必要がある場合は、角括弧を使用してその場でプロパティを生成します。

```html
<img class="origin-[33%_75%]" src="/img/mountains.jpg" />
```

CSS変数を使用することもできます。

```html
<img class="origin-(--my-transform-origin)" src="/img/mountains.jpg" />
```

## レスポンシブデザイン

特定のブレークポイントでのみ変形の原点を適用するには、既存のユーティリティクラスの前に`md:`などのレスポンシブプレフィックスを追加します。

```html
<img class="origin-center md:origin-top" src="/img/mountains.jpg" />
```

## ホバー、フォーカス、その他の状態

`hover:`などの状態バリアントを使用して、異なる状態で変形の原点を条件付きで適用します。

```html
<img class="origin-center hover:origin-top-left rotate-12" src="/img/mountains.jpg" />
```
