# Filter

要素に視覚効果を適用するためのフィルタユーティリティ。

## クイックリファレンス

| クラス | スタイル |
|--------|---------|
| `filter-none` | `filter: none;` |
| `filter-(<custom-property>)` | `filter: var(<custom-property>);` |
| `filter-[<value>]` | `filter: <value>;` |

## 利用可能なフィルタ

Tailwindは以下のフィルタユーティリティを提供しています:

- **Blur** - ぼかし効果
- **Brightness** - 明るさ調整
- **Contrast** - コントラスト調整
- **Drop Shadow** - ドロップシャドウ
- **Grayscale** - グレースケール変換
- **Hue Rotate** - 色相回転
- **Invert** - 色の反転
- **Saturate** - 彩度調整
- **Sepia** - セピア調変換

## 基本的な使い方

### フィルタの適用

個別のフィルタユーティリティを使用して、要素に視覚効果を適用します。

```html
<img class="blur-xs" src="image.jpg" />
<img class="grayscale" src="image.jpg" />
<img class="brightness-150" src="image.jpg" />
```

### 複数のフィルタの組み合わせ

複数のフィルタユーティリティを組み合わせて、より複雑な効果を作成できます。

```html
<img class="blur-xs grayscale" src="image.jpg" />
<img class="brightness-150 contrast-125" src="image.jpg" />
```

### フィルタの削除

`filter-none`を使用して、要素からすべてのフィルタを削除します。

```html
<img class="blur-md brightness-150 invert md:filter-none" src="image.jpg" />
```

レスポンシブブレークポイントで特に便利で、特定の画面サイズでフィルタを無効にできます。

## カスタムフィルタの適用

### 任意の値

角括弧を使用して、カスタムフィルタ値を適用します。

```html
<img class="filter-[url('filters.svg#filter-id')]" src="image.jpg" />
```

### CSS変数の使用

CSS変数を使用してフィルタをカスタマイズできます。

```html
<img class="filter-(--my-custom-filter)" src="image.jpg" />
```

## 条件付き適用

### Hover、Focus、その他の状態

`hover:`や`focus:`などの修飾子を使用して、特定の状態でのみフィルタを適用します。

```html
<img class="hover:blur-sm" src="image.jpg" />
<img class="focus:brightness-125" src="image.jpg" />
```

### 複数の状態

```html
<img class="grayscale hover:grayscale-0 transition-all" src="image.jpg" />
```

## レスポンシブデザイン

特定のブレークポイントでのみフィルタユーティリティを適用するには、`md:`のようなブレークポイント修飾子をプレフィックスとして追加します。

```html
<img class="blur-md md:blur-none" src="image.jpg" />
```

## 個別のフィルタユーティリティ

各フィルタタイプの詳細については、以下のドキュメントを参照してください:

- [Blur](/docs/blur)
- [Brightness](/docs/brightness)
- [Contrast](/docs/contrast)
- [Drop Shadow](/docs/drop-shadow)
- [Grayscale](/docs/grayscale)
- [Hue Rotate](/docs/hue-rotate)
- [Invert](/docs/invert)
- [Saturate](/docs/saturate)
- [Sepia](/docs/sepia)

## 関連ユーティリティ

- [Backdrop Filter](/docs/backdrop-blur) - 背景に対するフィルタ効果
