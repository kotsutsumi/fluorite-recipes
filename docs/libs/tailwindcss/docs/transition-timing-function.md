# Transition Timing Function

CSSトランジションのイージングを制御するためのユーティリティです。

## クイックリファレンス

| クラス | スタイル |
|-------|---------|
| `ease-linear` | `transition-timing-function: linear;` |
| `ease-in` | `transition-timing-function: var(--ease-in);` |
| `ease-out` | `transition-timing-function: var(--ease-out);` |
| `ease-in-out` | `transition-timing-function: var(--ease-in-out);` |
| `ease-initial` | `transition-timing-function: initial;` |
| `ease-(<custom-property>)` | `transition-timing-function: var(<custom-property>);` |
| `ease-[<value>]` | `transition-timing-function: <value>;` |

## 基本的な使い方

### 異なるイージング曲線を使用

`ease-*`ユーティリティを使用して、トランジションのイージング曲線を制御します。

```html
<button class="transition duration-300 ease-in">イーズイン</button>
<button class="transition duration-300 ease-out">イーズアウト</button>
<button class="transition duration-300 ease-in-out">イーズインアウト</button>
```

- `ease-in`: ゆっくり始まり、速く終わる
- `ease-out`: 速く始まり、ゆっくり終わる
- `ease-in-out`: ゆっくり始まり終わり、中間が速い

## カスタム値の適用

任意の値を使用する必要がある場合は、角括弧を使用してその場でプロパティを生成します。

```html
<button class="ease-[cubic-bezier(0.95,0.05,0.795,0.035)]">
  <!-- ... -->
</button>
```

CSS変数を使用することもできます。

```html
<button class="ease-(--my-ease)">
  <!-- ... -->
</button>
```

## レスポンシブデザイン

特定のブレークポイントでのみトランジションタイミング関数を適用するには、既存のユーティリティクラスの前に`md:`などのレスポンシブプレフィックスを追加します。

```html
<button class="ease-in md:ease-out">
  <!-- ... -->
</button>
```

## テーマのカスタマイズ

カスタムイージング曲線をテーマに追加できます。

```css
@theme {
  --ease-in-expo: cubic-bezier(0.95, 0.05, 0.795, 0.035);
}
```

## 関連ユーティリティ

- [Transition Property](/docs/transition-property)
- [Transition Duration](/docs/transition-duration)
- [Transition Delay](/docs/transition-delay)
