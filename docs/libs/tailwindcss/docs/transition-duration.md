# Transition Duration

CSSトランジションの継続時間を制御するためのユーティリティです。

## クイックリファレンス

| クラス | スタイル |
|-------|---------|
| `duration-<number>` | `transition-duration: <number>ms;` |
| `duration-initial` | `transition-duration: initial;` |
| `duration-(<custom-property>)` | `transition-duration: var(<custom-property>);` |
| `duration-[<value>]` | `transition-duration: <value>;` |

## 基本的な使い方

### 基本的な使用例

`duration-*`ユーティリティを使用して、トランジションの継続時間を制御します。

```html
<button class="transition duration-150 ease-in-out">ボタン A</button>
<button class="transition duration-300 ease-in-out">ボタン B</button>
<button class="transition duration-700 ease-in-out">ボタン C</button>
```

## カスタム値の適用

任意の値を使用する必要がある場合は、角括弧を使用してその場でプロパティを生成します。

```html
<button class="duration-[1s,15s]">
  <!-- ... -->
</button>
```

CSS変数を使用することもできます。

```html
<button class="duration-(--my-duration)">
  <!-- ... -->
</button>
```

## レスポンシブデザイン

特定のブレークポイントでのみトランジション継続時間を適用するには、既存のユーティリティクラスの前に`md:`などのレスポンシブプレフィックスを追加します。

```html
<button class="duration-0 md:duration-150">
  <!-- ... -->
</button>
```

## 関連ユーティリティ

- [Transition Property](/docs/transition-property)
- [Transition Behavior](/docs/transition-behavior)
- [Transition Timing Function](/docs/transition-timing-function)
- [Transition Delay](/docs/transition-delay)
