# Mask Composite

複数のマスクがどのように組み合わされるかを制御するためのユーティリティ。

## クイックリファレンス

| クラス | スタイル |
|--------|---------|
| `mask-add` | `mask-composite: add;` |
| `mask-subtract` | `mask-composite: subtract;` |
| `mask-intersect` | `mask-composite: intersect;` |
| `mask-exclude` | `mask-composite: exclude;` |

## 基本的な使い方

### マスクの追加

`mask-add`を使用して、複数のマスクレイヤーを追加します。

```html
<div class="mask-add ..."></div>
```

### マスクの減算

`mask-subtract`を使用して、重なり合うマスク領域を削除します。

```html
<div class="mask-subtract ..."></div>
```

### マスクの交差

`mask-intersect`を使用して、重なり合うマスク領域のみを表示します。

```html
<div class="mask-intersect ..."></div>
```

### マスクの除外

`mask-exclude`を使用して、マスク間で共有されていない領域を表示します。

```html
<div class="mask-exclude ..."></div>
```

## 実践例

### 複数のマスクの組み合わせ

複数のマスク画像を使用し、`mask-composite`で組み合わせ方法を制御します。

```html
<div class="mask-[url(/circle1.png),url(/circle2.png)] mask-subtract ...">
  <!-- 2つの円形マスクの減算 -->
</div>
```

### 複雑なマスク効果

`mask-intersect`を使用して、複雑なマスク効果を作成します。

```html
<div class="mask-[url(/gradient.png),url(/shape.png)] mask-intersect ...">
  <!-- グラデーションとシェイプの交差 -->
</div>
```

## レスポンシブデザイン

特定のブレークポイントでのみマスクコンポジットユーティリティを適用するには、`md:`のようなブレークポイント修飾子をプレフィックスとして追加します。

```html
<div class="mask-add md:mask-subtract ...">
  <!-- ... -->
</div>
```

## 関連ユーティリティ

- [Mask Clip](/docs/mask-clip)
- [Mask Image](/docs/mask-image)
