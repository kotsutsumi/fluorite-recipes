# Filter: Contrast

要素にコントラストフィルタを適用するためのユーティリティ。

## クイックリファレンス

| クラス | スタイル |
|--------|---------|
| `contrast-<number>` | `filter: contrast(<number>%);` |
| `contrast-(<custom-property>)` | `filter: contrast(var(<custom-property>));` |
| `contrast-[<value>]` | `filter: contrast(<value>);` |

## 基本的な使い方

### コントラストの調整

`contrast-{percentage}`ユーティリティを使用して、要素のコントラストを調整します。

```html
<img class="contrast-50" src="/img/mountains.jpg" />
<img class="contrast-100" src="/img/mountains.jpg" />
<img class="contrast-125" src="/img/mountains.jpg" />
<img class="contrast-200" src="/img/mountains.jpg" />
```

- `contrast-50` - 50%のコントラスト(低コントラスト)
- `contrast-100` - 100%のコントラスト(元の状態)
- `contrast-125` - 125%のコントラスト(やや高コントラスト)
- `contrast-200` - 200%のコントラスト(非常に高コントラスト)

## カスタム値の適用

### 任意の値

テーマに含まれていないコントラスト値を使用する必要がある場合は、角括弧を使用して任意の値でプロパティを生成します。

```html
<img class="contrast-[.25]" src="/img/mountains.jpg" />
```

### CSS変数の使用

CSS変数を使用してコントラスト値をカスタマイズできます。

```html
<img class="contrast-(--my-contrast)" src="/img/mountains.jpg" />
```

## レスポンシブデザイン

特定のブレークポイントでのみコントラストユーティリティを適用するには、`md:`のようなブレークポイント修飾子をプレフィックスとして追加します。

```html
<img class="contrast-50 md:contrast-150" src="/img/mountains.jpg" />
```

## 関連ユーティリティ

- [Brightness](/docs/brightness)
- [Drop Shadow](/docs/drop-shadow)
