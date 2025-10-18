# Transition Delay

CSSトランジションの遅延を制御するためのユーティリティです。

## クイックリファレンス

| クラス | スタイル |
|-------|---------|
| `delay-<number>` | `transition-delay: <number>ms;` |
| `delay-(<custom-property>)` | `transition-delay: var(<custom-property>);` |
| `delay-[<value>]` | `transition-delay: <value>;` |

## 基本的な使い方

### 基本的な使用例

`delay-*`ユーティリティを使用して、トランジションの遅延時間を制御します。

```html
<button class="transition delay-150 duration-300 ease-in-out">ボタン A</button>
<button class="transition delay-300 duration-300 ease-in-out">ボタン B</button>
<button class="transition delay-700 duration-300 ease-in-out">ボタン C</button>
```

## カスタム値の適用

任意の値を使用する必要がある場合は、角括弧を使用してその場でプロパティを生成します。

```html
<button class="delay-[1s,250ms]">
  <!-- ... -->
</button>
```

CSS変数を使用することもできます。

```html
<button class="delay-(--my-delay)">
  <!-- ... -->
</button>
```

## レスポンシブデザイン

特定のブレークポイントでのみトランジション遅延を適用するには、既存のユーティリティクラスの前に`md:`などのレスポンシブプレフィックスを追加します。

```html
<button class="delay-0 md:delay-300">
  <!-- ... -->
</button>
```

## 関連ユーティリティ

- [Transition Property](/docs/transition-property)
- [Transition Duration](/docs/transition-duration)
- [Transition Timing Function](/docs/transition-timing-function)
