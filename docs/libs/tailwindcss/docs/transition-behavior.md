# Transition Behavior

CSSトランジションの動作を制御するためのユーティリティです。

## クイックリファレンス

| クラス | スタイル |
|-------|---------|
| `transition-normal` | `transition-behavior: normal;` |
| `transition-discrete` | `transition-behavior: allow-discrete;` |

## 基本的な使い方

### 離散的なトランジションを許可

`transition-discrete`を使用して、非表示と表示の状態を切り替える要素のトランジションを有効にします。

```html
<input type="checkbox" id="example1" class="peer sr-only" />
<label for="example1" class="peer-checked:hidden">Show</label>
<div class="hidden peer-checked:block transition-discrete">
  コンテンツ
</div>

<input type="checkbox" id="example2" class="peer sr-only" />
<label for="example2" class="peer-checked:hidden">Show</label>
<div class="hidden opacity-0 peer-checked:block peer-checked:opacity-100 transition-discrete">
  トランジション付きコンテンツ
</div>
```

### 通常のトランジション動作

`transition-normal`を使用して、デフォルトのブラウザトランジション動作に戻します。

```html
<div class="transition-discrete md:transition-normal">
  <!-- ... -->
</div>
```

## レスポンシブデザイン

特定のブレークポイントでのみトランジション動作を適用するには、既存のユーティリティクラスの前に`md:`などのレスポンシブプレフィックスを追加します。

```html
<div class="transition-normal md:transition-discrete">
  <!-- ... -->
</div>
```

## 関連ユーティリティ

- [Transition Property](/docs/transition-property)
- [Transition Duration](/docs/transition-duration)
- [Transition Timing Function](/docs/transition-timing-function)
- [Transition Delay](/docs/transition-delay)
