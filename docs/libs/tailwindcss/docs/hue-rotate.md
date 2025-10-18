# Filter: Hue Rotate

要素に色相回転フィルタを適用するためのユーティリティ。

## クイックリファレンス

| クラス | スタイル |
|--------|---------|
| `hue-rotate-<number>` | `filter: hue-rotate(<number>deg);` |
| `-hue-rotate-<number>` | `filter: hue-rotate(calc(<number>deg * -1));` |
| `hue-rotate-(<custom-property>)` | `filter: hue-rotate(var(<custom-property>));` |
| `hue-rotate-[<value>]` | `filter: hue-rotate(<value>);` |

## 基本的な使い方

### 色相の回転

`hue-rotate-{degrees}`ユーティリティを使用して、色相環を回転させることで要素の色を変換します。

```html
<img class="hue-rotate-15" src="/img/mountains.jpg" />
<img class="hue-rotate-90" src="/img/mountains.jpg" />
<img class="hue-rotate-180" src="/img/mountains.jpg" />
<img class="hue-rotate-270" src="/img/mountains.jpg" />
```

- `hue-rotate-15` - 15度回転
- `hue-rotate-90` - 90度回転
- `hue-rotate-180` - 180度回転
- `hue-rotate-270` - 270度回転

### 負の値

負の値を使用して、色相環を逆方向に回転させます。

```html
<img class="-hue-rotate-15" src="/img/mountains.jpg" />
<img class="-hue-rotate-45" src="/img/mountains.jpg" />
<img class="-hue-rotate-90" src="/img/mountains.jpg" />
```

## カスタム値の適用

### 任意の値

テーマに含まれていない色相回転値を使用する必要がある場合は、角括弧を使用して任意の値でプロパティを生成します。

```html
<img class="hue-rotate-[3.142rad]" src="/img/mountains.jpg" />
```

度数だけでなく、ラジアンやターン(turn)単位も使用できます。

```html
<img class="hue-rotate-[0.5turn]" src="/img/mountains.jpg" />
```

### CSS変数の使用

CSS変数を使用して色相回転値をカスタマイズできます。

```html
<img class="hue-rotate-(--my-hue-rotate)" src="/img/mountains.jpg" />
```

## レスポンシブデザイン

特定のブレークポイントでのみ色相回転ユーティリティを適用するには、`md:`のようなブレークポイント修飾子をプレフィックスとして追加します。

```html
<img class="hue-rotate-90 md:hue-rotate-0" src="/img/mountains.jpg" />
```

## 関連ユーティリティ

- [Grayscale](/docs/grayscale)
- [Invert](/docs/invert)
- [Saturate](/docs/saturate)
