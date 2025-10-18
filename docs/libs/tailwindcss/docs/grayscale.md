# Filter: Grayscale

要素にグレースケールフィルタを適用するためのユーティリティ。

## クイックリファレンス

| クラス | スタイル |
|--------|---------|
| `grayscale` | `filter: grayscale(100%);` |
| `grayscale-<number>` | `filter: grayscale(<number>%);` |
| `grayscale-(<custom-property>)` | `filter: grayscale(var(<custom-property>));` |
| `grayscale-[<value>]` | `filter: grayscale(<value>);` |

## 基本的な使い方

### グレースケールの適用

`grayscale-{percentage}`ユーティリティを使用して、要素にグレースケール効果を適用します。

```html
<img class="grayscale-0" src="/img/mountains.jpg" />
<img class="grayscale-25" src="/img/mountains.jpg" />
<img class="grayscale-50" src="/img/mountains.jpg" />
<img class="grayscale" src="/img/mountains.jpg" />
```

- `grayscale-0` - グレースケールなし(元の色)
- `grayscale-25` - 25%グレースケール
- `grayscale-50` - 50%グレースケール
- `grayscale` - 100%グレースケール(完全な白黒)

### グレースケールの削除

`grayscale-0`を使用して、グレースケールフィルタを削除します。

```html
<img class="grayscale md:grayscale-0" src="/img/mountains.jpg" />
```

## カスタム値の適用

### 任意の値

テーマに含まれていないグレースケール値を使用する必要がある場合は、角括弧を使用して任意の値でプロパティを生成します。

```html
<img class="grayscale-[0.5]" src="/img/mountains.jpg" />
```

### CSS変数の使用

CSS変数を使用してグレースケール値をカスタマイズできます。

```html
<img class="grayscale-(--my-grayscale)" src="/img/mountains.jpg" />
```

## 条件付き適用

### Hover、Focus、その他の状態

`hover:`修飾子を使用して、ホバー時にグレースケールを適用または削除します。

```html
<img class="grayscale hover:grayscale-0" src="/img/mountains.jpg" />
```

トランジションを追加すると、よりスムーズな効果が得られます。

```html
<img class="grayscale hover:grayscale-0 transition-all duration-300" src="/img/mountains.jpg" />
```

## レスポンシブデザイン

特定のブレークポイントでのみグレースケールユーティリティを適用するには、`md:`のようなブレークポイント修飾子をプレフィックスとして追加します。

```html
<img class="grayscale md:grayscale-0" src="/img/mountains.jpg" />
```

## 関連ユーティリティ

- [Sepia](/docs/sepia)
- [Hue Rotate](/docs/hue-rotate)
