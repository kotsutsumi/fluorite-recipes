# Transform

要素を変形させるためのユーティリティです。

## クイックリファレンス

| クラス | スタイル |
|-------|---------|
| `transform-(<custom-property>)` | `transform: var(<custom-property>);` |
| `transform-[<value>]` | `transform: <value>;` |
| `transform-none` | `transform: none;` |
| `transform-gpu` | `transform: translateZ(0);` |
| `transform-cpu` | CPUベースのレンダリングを強制 |

## 基本的な使い方

### ハードウェアアクセラレーション

`transform-gpu`を使用して、`translateZ(0)`でハードウェアアクセラレーションを有効にします。

```html
<div class="scale-150 transform-gpu">
  <!-- ... -->
</div>
```

### 変形を削除する

`transform-none`を使用して、すべての変形を削除します。

```html
<div class="skew-y-3 md:transform-none">
  <!-- ... -->
</div>
```

### カスタム変形

`transform-[<value>]`を使用して、カスタム変形を適用します。

```html
<div class="transform-[matrix(1,2,3,4,5,6)]">
  <!-- ... -->
</div>
```

## カスタム値の適用

任意の値を使用する必要がある場合は、角括弧を使用してその場でプロパティを生成します。

```html
<div class="transform-[rotate(30deg)_scale(1.5)]">
  <!-- ... -->
</div>
```

CSS変数を使用することもできます。

```html
<div class="transform-(--my-transform)">
  <!-- ... -->
</div>
```

## レスポンシブデザイン

特定のブレークポイントでのみ変形を適用するには、既存のユーティリティクラスの前に`md:`などのレスポンシブプレフィックスを追加します。

```html
<div class="transform-none md:transform-gpu">
  <!-- ... -->
</div>
```

## 関連ユーティリティ

- [Skew](/docs/skew)
- [Transform Origin](/docs/transform-origin)
