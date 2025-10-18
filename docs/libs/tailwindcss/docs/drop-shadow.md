# Filter: Drop Shadow

要素にドロップシャドウフィルタを適用するためのユーティリティ。

## クイックリファレンス

| クラス | スタイル |
|--------|---------|
| `drop-shadow-xs` | `filter: drop-shadow(0 1px 1px rgb(0 0 0 / 0.05));` |
| `drop-shadow-sm` | `filter: drop-shadow(0 1px 2px rgb(0 0 0 / 0.1));` |
| `drop-shadow-md` | `filter: drop-shadow(0 4px 3px rgb(0 0 0 / 0.07));` |
| `drop-shadow-lg` | `filter: drop-shadow(0 10px 8px rgb(0 0 0 / 0.04));` |
| `drop-shadow-xl` | `filter: drop-shadow(0 20px 13px rgb(0 0 0 / 0.03));` |
| `drop-shadow-2xl` | `filter: drop-shadow(0 25px 25px rgb(0 0 0 / 0.15));` |
| `drop-shadow-none` | `filter: drop-shadow(0 0 #0000);` |
| `drop-shadow-[<value>]` | `filter: drop-shadow(<value>);` |

## 基本的な使い方

### ドロップシャドウの追加

`drop-shadow-{size}`ユーティリティを使用して、要素にドロップシャドウを追加します。特に不規則な形状のSVGやテキスト要素に有効です。

```html
<svg class="drop-shadow-md">...</svg>
<svg class="drop-shadow-lg">...</svg>
<svg class="drop-shadow-xl">...</svg>
```

### シャドウの削除

`drop-shadow-none`を使用して、ドロップシャドウを削除します。

```html
<svg class="drop-shadow-lg md:drop-shadow-none">...</svg>
```

## 不透明度の変更

`drop-shadow-{size}/{opacity}`修飾子を使用して、ドロップシャドウの不透明度を制御します。

```html
<svg class="drop-shadow-xl/25">...</svg>
<svg class="drop-shadow-xl/50">...</svg>
<svg class="drop-shadow-xl/75">...</svg>
```

## シャドウの色

シャドウの色を変更するには、`drop-shadow-{color}`ユーティリティを使用します。

```html
<svg class="fill-cyan-500 drop-shadow-lg drop-shadow-cyan-500/50">...</svg>
```

色と不透明度を組み合わせることもできます。

```html
<svg class="drop-shadow-lg drop-shadow-indigo-500/50">...</svg>
```

## カスタム値の適用

### 任意の値

テーマに含まれていないドロップシャドウ値を使用する必要がある場合は、角括弧を使用して任意の値でプロパティを生成します。

```html
<svg class="drop-shadow-[0_35px_35px_rgba(0,0,0,0.25)]">...</svg>
```

### CSS変数の使用

CSS変数を使用してドロップシャドウをカスタマイズできます。

```html
<svg class="drop-shadow-(--my-drop-shadow)">...</svg>
```

## レスポンシブデザイン

特定のブレークポイントでのみドロップシャドウユーティリティを適用するには、`md:`のようなブレークポイント修飾子をプレフィックスとして追加します。

```html
<svg class="drop-shadow-md md:drop-shadow-xl">...</svg>
```

## テーマのカスタマイズ

`@theme`ディレクティブを使用して、ドロップシャドウのスケールをカスタマイズできます。

```css
@theme {
  --drop-shadow-3xl: 0 35px 35px rgb(0 0 0 / 0.25);
}
```

## Box Shadowとの違い

- `drop-shadow`は要素の実際の形状に従います(SVGパスなど)
- `box-shadow`は要素の境界ボックスに従います
- 不規則な形状には`drop-shadow`を使用することをお勧めします
- 通常の要素には`box-shadow`の方がパフォーマンスが良い場合があります

## 関連ユーティリティ

- [Box Shadow](/docs/box-shadow)
- [Blur](/docs/blur)
