# Filter: Invert

要素に色の反転フィルタを適用するためのユーティリティ。

## クイックリファレンス

| クラス | スタイル |
|--------|---------|
| `invert` | `filter: invert(100%);` |
| `invert-<number>` | `filter: invert(<number>%);` |
| `invert-(<custom-property>)` | `filter: invert(var(<custom-property>));` |
| `invert-[<value>]` | `filter: invert(<value>);` |

## 基本的な使い方

### 色の反転

`invert-{percentage}`ユーティリティを使用して、要素の色を反転させます。

```html
<img class="invert-0" src="/img/mountains.jpg" />
<img class="invert-20" src="/img/mountains.jpg" />
<img class="invert" src="/img/mountains.jpg" />
```

- `invert-0` - 反転なし(元の色)
- `invert-20` - 20%反転
- `invert` - 100%反転(完全に反転)

### 反転の削除

`invert-0`を使用して、色の反転フィルタを削除します。

```html
<img class="invert md:invert-0" src="/img/mountains.jpg" />
```

## カスタム値の適用

### 任意の値

テーマに含まれていない反転値を使用する必要がある場合は、角括弧を使用して任意の値でプロパティを生成します。

```html
<img class="invert-[.25]" src="/img/mountains.jpg" />
```

### CSS変数の使用

CSS変数を使用して反転値をカスタマイズできます。

```html
<img class="invert-(--my-invert)" src="/img/mountains.jpg" />
```

## 実践例

### ダークモードでの使用

ダークモードで画像を反転させると便利な場合があります。

```html
<img class="dark:invert" src="/img/logo.jpg" />
```

### アイコンの反転

黒いアイコンを白い背景で使用している場合、色を反転させることができます。

```html
<img class="invert" src="/img/icon.svg" />
```

## レスポンシブデザイン

特定のブレークポイントでのみ反転ユーティリティを適用するには、`md:`のようなブレークポイント修飾子をプレフィックスとして追加します。

```html
<img class="invert md:invert-0" src="/img/mountains.jpg" />
```

## 関連ユーティリティ

- [Hue Rotate](/docs/hue-rotate)
- [Saturate](/docs/saturate)
