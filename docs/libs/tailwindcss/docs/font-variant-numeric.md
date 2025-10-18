# Font Variant Numeric

数字のバリアントを制御するためのユーティリティ。

## クイックリファレンス

| クラス | スタイル |
|-------|--------|
| `normal-nums` | `font-variant-numeric: normal;` |
| `ordinal` | `font-variant-numeric: ordinal;` |
| `slashed-zero` | `font-variant-numeric: slashed-zero;` |
| `lining-nums` | `font-variant-numeric: lining-nums;` |
| `oldstyle-nums` | `font-variant-numeric: oldstyle-nums;` |
| `proportional-nums` | `font-variant-numeric: proportional-nums;` |
| `tabular-nums` | `font-variant-numeric: tabular-nums;` |
| `diagonal-fractions` | `font-variant-numeric: diagonal-fractions;` |
| `stacked-fractions` | `font-variant-numeric: stacked-fractions;` |

## 基本的な使い方

### 序数グリフの使用

`ordinal` ユーティリティを使用して、対応フォントで序数マーカー用の特別なグリフを有効にします。

```html
<p class="ordinal ...">1st</p>
```

### スラッシュ付きゼロの使用

`slashed-zero` ユーティリティを使用して、対応フォントでスラッシュ付きのゼロを強制的に表示します。

```html
<p class="slashed-zero ...">0</p>
```

### ライニング数字

`lining-nums` を使用して、ベースラインで揃えられた数字グリフを使用します。

```html
<p class="lining-nums ...">1234567890</p>
```

### オールドスタイル数字

`oldstyle-nums` を使用して、ディセンダー付きの数字グリフを使用します。

```html
<p class="oldstyle-nums ...">1234567890</p>
```

### プロポーショナル数字とタブラー数字

異なる数字の幅スタイルを示します。

```html
<p class="proportional-nums ...">12121</p>
<p class="proportional-nums ...">90909</p>

<p class="tabular-nums ...">12121</p>
<p class="tabular-nums ...">90909</p>
```

`proportional-nums` は各数字が異なる幅を持ちますが、`tabular-nums` はすべての数字が同じ幅になり、表形式のデータに便利です。

### 分数表記

`diagonal-fractions` または `stacked-fractions` を使用して、分数の表示方法を制御します。

```html
<p class="diagonal-fractions ...">1/2 3/4</p>
<p class="stacked-fractions ...">1/2 3/4</p>
```

### 通常の数字にリセット

`normal-nums` を使用して、数字のバリアント設定を通常の状態にリセットします。

```html
<p class="normal-nums ...">1234567890</p>
```

## レスポンシブデザイン

プレフィックスを使用して、特定のブレークポイントでのみユーティリティを適用できます。

```html
<p class="proportional-nums md:tabular-nums ...">
  1234567890
</p>
```

利用可能なすべてのブレークポイントオプションについては、[レスポンシブデザイン](/docs/responsive-design)のドキュメントを参照してください。
