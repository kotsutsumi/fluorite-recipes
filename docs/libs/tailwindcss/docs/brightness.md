# Filter: Brightness

要素に明るさフィルタを適用するためのユーティリティ。

## クイックリファレンス

| クラス | スタイル |
|--------|---------|
| `brightness-<number>` | `filter: brightness(<number>%);` |
| `brightness-(<custom-property>)` | `filter: brightness(var(<custom-property>));` |
| `brightness-[<value>]` | `filter: brightness(<value>);` |

## 基本的な使い方

### 明るさの調整

`brightness-{percentage}`ユーティリティを使用して、要素の明るさを調整します。

```html
<img class="brightness-50" src="/img/mountains.jpg" />
<img class="brightness-100" src="/img/mountains.jpg" />
<img class="brightness-125" src="/img/mountains.jpg" />
<img class="brightness-200" src="/img/mountains.jpg" />
```

- `brightness-50` - 50%の明るさ(暗くなります)
- `brightness-100` - 100%の明るさ(元の状態)
- `brightness-125` - 125%の明るさ(やや明るくなります)
- `brightness-200` - 200%の明るさ(非常に明るくなります)

## カスタム値の適用

### 任意の値

テーマに含まれていない明るさ値を使用する必要がある場合は、角括弧を使用して任意の値でプロパティを生成します。

```html
<img class="brightness-[1.75]" src="/img/mountains.jpg" />
```

### CSS変数の使用

CSS変数を使用して明るさ値をカスタマイズできます。

```html
<img class="brightness-(--my-brightness)" src="/img/mountains.jpg" />
```

## レスポンシブデザイン

特定のブレークポイントでのみ明るさユーティリティを適用するには、`md:`のようなブレークポイント修飾子をプレフィックスとして追加します。

```html
<img class="brightness-50 md:brightness-150" src="/img/mountains.jpg" />
```

## 関連ユーティリティ

- [Blur](/docs/blur)
- [Contrast](/docs/contrast)
