# Mask Mode

要素のマスクモードを制御するためのユーティリティ。

## クイックリファレンス

| クラス | スタイル |
|--------|---------|
| `mask-alpha` | `mask-mode: alpha;` |
| `mask-luminance` | `mask-mode: luminance;` |
| `mask-match` | `mask-mode: match-source;` |

## 基本的な使い方

### アルファモード

`mask-alpha`を使用して、マスクの不透明度を使用して可視性を決定します。

```html
<div class="mask-alpha mask-r-from-black mask-r-from-50% mask-r-to-transparent bg-[url(/img/mountains.jpg)] ..."></div>
```

アルファモードでは、マスク画像の透明度が要素の可視性を制御します。完全に不透明な領域は完全に表示され、完全に透明な領域は非表示になります。

### ルミナンスモード

`mask-luminance`を使用して、マスクの輝度値を使用して可視性を決定します。

```html
<div class="mask-luminance mask-r-from-white mask-r-from-50% mask-r-to-black bg-[url(/img/mountains.jpg)] ..."></div>
```

ルミナンスモードでは、マスク画像の明るさが要素の可視性を制御します。白い領域は完全に表示され、黒い領域は非表示になります。グレースケールカラーを使用すると、最も予測可能な結果が得られます。

### マッチソースモード

`mask-match`を使用して、マスクソースのタイプに基づいてモードを自動的に決定します。

```html
<div class="mask-match ..."></div>
```

## 実践例

### アルファとルミナンスの比較

```html
<!-- アルファモード: 黒から透明へのグラデーント -->
<div class="mask-alpha mask-r-from-black mask-r-to-transparent ..."></div>

<!-- ルミナンスモード: 白から黒へのグラデーント -->
<div class="mask-luminance mask-r-from-white mask-r-to-black ..."></div>
```

アルファモードでは黒と透明の組み合わせを使用し、ルミナンスモードでは白と黒の組み合わせを使用することに注意してください。

## レスポンシブデザイン

特定のブレークポイントでのみマスクモードユーティリティを適用するには、`md:`のようなブレークポイント修飾子をプレフィックスとして追加します。

```html
<div class="mask-alpha md:mask-luminance ...">
  <!-- ... -->
</div>
```

## 関連ユーティリティ

- [Mask Image](/docs/mask-image)
- [Mask Origin](/docs/mask-origin)
