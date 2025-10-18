# Transform Style

要素の子要素を3D空間に配置するかどうかを制御するためのユーティリティです。

## クイックリファレンス

| クラス | スタイル |
|-------|---------|
| `transform-3d` | `transform-style: preserve-3d;` |
| `transform-flat` | `transform-style: flat;` |

## 基本的な使い方

### 3D変形を保持する

`transform-3d`を使用して、子要素を3D空間に配置します。

```html
<div class="perspective-normal transform-3d">
  <div class="translate-z-12 rotate-x-45">
    子要素は3D空間で変形されます
  </div>
</div>
```

### フラットな変形

`transform-flat`を使用して、子要素を2D空間に配置します。これがデフォルトの動作です。

```html
<div class="perspective-normal transform-flat">
  <div class="translate-z-12 rotate-x-45">
    子要素は2D空間で変形されます
  </div>
</div>
```

## レスポンシブデザイン

特定のブレークポイントでのみ変形スタイルを適用するには、既存のユーティリティクラスの前に`md:`などのレスポンシブプレフィックスを追加します。

```html
<div class="transform-flat md:transform-3d">
  <!-- ... -->
</div>
```

## 重要な注意事項

このユーティリティがない場合、子要素は2D空間でのみ変形され、3D空間では変形されません。3D変形を適切に表示するには、親要素に`transform-3d`を適用する必要があります。

## 関連ユーティリティ

- [Transform Origin](/docs/transform-origin)
- [Translate](/docs/translate)
