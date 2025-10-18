# Filter: Saturate

要素に彩度フィルタを適用するためのユーティリティ。

## クイックリファレンス

| クラス | スタイル |
|--------|---------|
| `saturate-<number>` | `filter: saturate(<number>%);` |
| `saturate-(<custom-property>)` | `filter: saturate(var(<custom-property>));` |
| `saturate-[<value>]` | `filter: saturate(<value>);` |

## 基本的な使い方

### 彩度の調整

`saturate-{percentage}`ユーティリティを使用して、要素の彩度を調整します。

```html
<img class="saturate-50" src="/img/mountains.jpg" />
<img class="saturate-100" src="/img/mountains.jpg" />
<img class="saturate-150" src="/img/mountains.jpg" />
<img class="saturate-200" src="/img/mountains.jpg" />
```

- `saturate-50` - 50%の彩度(低彩度)
- `saturate-100` - 100%の彩度(元の状態)
- `saturate-150` - 150%の彩度(やや高彩度)
- `saturate-200` - 200%の彩度(非常に高彩度)

### 彩度の削除(0%彩度)

`saturate-0`を使用すると、完全に彩度を失い、グレースケールと同様の効果が得られます。

```html
<img class="saturate-0" src="/img/mountains.jpg" />
```

## カスタム値の適用

### 任意の値

テーマに含まれていない彩度値を使用する必要がある場合は、角括弧を使用して任意の値でプロパティを生成します。

```html
<img class="saturate-[.25]" src="/img/mountains.jpg" />
```

### CSS変数の使用

CSS変数を使用して彩度値をカスタマイズできます。

```html
<img class="saturate-(--my-saturation)" src="/img/mountains.jpg" />
```

## 条件付き適用

### Hover、Focus、その他の状態

`hover:`修飾子を使用して、ホバー時に彩度を変更します。

```html
<img class="saturate-50 hover:saturate-100 transition-all" src="/img/mountains.jpg" />
```

## レスポンシブデザイン

特定のブレークポイントでのみ彩度ユーティリティを適用するには、`md:`のようなブレークポイント修飾子をプレフィックスとして追加します。

```html
<img class="saturate-50 md:saturate-150" src="/img/mountains.jpg" />
```

## 関連ユーティリティ

- [Hue Rotate](/docs/hue-rotate)
- [Grayscale](/docs/grayscale)
- [Invert](/docs/invert)
