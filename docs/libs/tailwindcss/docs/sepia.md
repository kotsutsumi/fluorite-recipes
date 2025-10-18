# Filter: Sepia

要素にセピア調フィルタを適用するためのユーティリティ。

## クイックリファレンス

| クラス | スタイル |
|--------|---------|
| `sepia` | `filter: sepia(100%);` |
| `sepia-<number>` | `filter: sepia(<number>%);` |
| `sepia-(<custom-property>)` | `filter: sepia(var(<custom-property>));` |
| `sepia-[<value>]` | `filter: sepia(<value>);` |

## 基本的な使い方

### セピア調の適用

`sepia-{percentage}`ユーティリティを使用して、要素にセピア調の効果を適用します。

```html
<img class="sepia-0" src="/img/mountains.jpg" />
<img class="sepia-50" src="/img/mountains.jpg" />
<img class="sepia" src="/img/mountains.jpg" />
```

- `sepia-0` - セピア調なし(元の色)
- `sepia-50` - 50%セピア調
- `sepia` - 100%セピア調(完全なセピア色)

### セピア調の削除

`sepia-0`を使用して、セピア調フィルタを削除します。

```html
<img class="sepia md:sepia-0" src="/img/mountains.jpg" />
```

## カスタム値の適用

### 任意の値

テーマに含まれていないセピア値を使用する必要がある場合は、角括弧を使用して任意の値でプロパティを生成します。

```html
<img class="sepia-[.25]" src="/img/mountains.jpg" />
```

### CSS変数の使用

CSS変数を使用してセピア値をカスタマイズできます。

```html
<img class="sepia-(--my-sepia)" src="/img/mountains.jpg" />
```

## 実践例

### ビンテージ効果

セピア調と他のフィルタを組み合わせて、ビンテージ写真のような効果を作成できます。

```html
<img class="sepia contrast-125 brightness-110" src="/img/mountains.jpg" />
```

### ホバー効果

ホバー時にセピア調を適用または削除します。

```html
<img class="hover:sepia transition-all duration-300" src="/img/mountains.jpg" />
```

## レスポンシブデザイン

特定のブレークポイントでのみセピアユーティリティを適用するには、`md:`のようなブレークポイント修飾子をプレフィックスとして追加します。

```html
<img class="sepia md:sepia-0" src="/img/mountains.jpg" />
```

## 関連ユーティリティ

- [Grayscale](/docs/grayscale)
- [Saturate](/docs/saturate)
- [Backdrop Filter](/docs/backdrop-sepia)
