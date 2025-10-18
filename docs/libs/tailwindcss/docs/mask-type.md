# Mask Type

SVGマスクの解釈方法を制御するためのユーティリティ。

## クイックリファレンス

| クラス | スタイル |
|--------|---------|
| `mask-type-alpha` | `mask-type: alpha;` |
| `mask-type-luminance` | `mask-type: luminance;` |

## 基本的な使い方

### アルファタイプ

`mask-type-alpha`を使用して、不透明度を使用してマスクの可視性を決定します。

```html
<svg>
  <mask id="blob1" class="mask-type-alpha fill-gray-700/70">
    <path d="..."></path>
  </mask>
  <image href="/img/mountains.jpg" height="100%" width="100%" mask="url(#blob1)" />
</svg>
```

アルファタイプでは、マスクの不透明度が要素の可視性を制御します。完全に不透明な領域は完全に表示され、透明な領域は非表示になります。

### ルミナンスタイプ

`mask-type-luminance`を使用して、輝度値を使用してマスクの可視性を決定します。

```html
<svg>
  <mask id="blob2" class="mask-type-luminance fill-gray-700">
    <path d="..."></path>
  </mask>
  <image href="/img/mountains.jpg" height="100%" width="100%" mask="url(#blob2)" />
</svg>
```

ルミナンスタイプでは、マスクの明るさが要素の可視性を制御します。明るい領域は表示され、暗い領域は非表示になります。最も予測可能な結果を得るには、グレースケールカラーを使用してください。

## 実践例

### アルファとルミナンスの比較

```html
<!-- アルファタイプ -->
<svg>
  <mask id="alpha-mask" class="mask-type-alpha">
    <rect fill="rgba(0,0,0,0.7)" ... />
  </mask>
  <image mask="url(#alpha-mask)" ... />
</svg>

<!-- ルミナンスタイプ -->
<svg>
  <mask id="luminance-mask" class="mask-type-luminance">
    <rect fill="#B3B3B3" ... />
  </mask>
  <image mask="url(#luminance-mask)" ... />
</svg>
```

## レスポンシブデザイン

特定のブレークポイントでのみマスクタイプユーティリティを適用するには、`md:`のようなブレークポイント修飾子をプレフィックスとして追加します。

```html
<svg>
  <mask class="mask-type-alpha md:mask-type-luminance">
    <!-- ... -->
  </mask>
</svg>
```

## 使用上の注意

- `mask-type`プロパティは、SVG `<mask>`要素でのみ使用されます。
- ルミナンスモードを使用する場合、グレースケールカラーが最も予測可能な結果をもたらします。
- アルファモードは不透明度に基づき、ルミナンスモードは明るさに基づきます。

## 関連ユーティリティ

- [Mask Size](/docs/mask-size)
- [Filter](/docs/filter)
