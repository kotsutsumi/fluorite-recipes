# Filter: Blur

要素にぼかしフィルタを適用するためのユーティリティ。

## クイックリファレンス

| クラス | スタイル |
|--------|---------|
| `blur-xs` | `filter: blur(var(--blur-xs)); /* 4px */` |
| `blur-sm` | `filter: blur(var(--blur-sm)); /* 8px */` |
| `blur-md` | `filter: blur(var(--blur-md)); /* 12px */` |
| `blur-lg` | `filter: blur(var(--blur-lg)); /* 16px */` |
| `blur-xl` | `filter: blur(var(--blur-xl)); /* 24px */` |
| `blur-2xl` | `filter: blur(var(--blur-2xl)); /* 40px */` |
| `blur-3xl` | `filter: blur(var(--blur-3xl)); /* 64px */` |
| `blur-none` | `filter: ;` |
| `blur-(<custom-property>)` | `filter: blur(var(<custom-property>));` |
| `blur-[<value>]` | `filter: blur(<value>);` |

## 基本的な使い方

### ぼかしの適用

`blur-{size}`ユーティリティを使用して、要素に異なる強度のぼかし効果を適用します。

```html
<img class="blur-none" src="/img/mountains.jpg" />
<img class="blur-sm" src="/img/mountains.jpg" />
<img class="blur-lg" src="/img/mountains.jpg" />
<img class="blur-2xl" src="/img/mountains.jpg" />
```

### ぼかしの削除

`blur-none`を使用して、ぼかしフィルタを削除します。

```html
<img class="blur-md md:blur-none" src="/img/mountains.jpg" />
```

## カスタム値の適用

### 任意の値

テーマに含まれていないぼかし値を使用する必要がある場合は、角括弧を使用して任意の値でプロパティを生成します。

```html
<img class="blur-[2px]" src="/img/mountains.jpg" />
```

### CSS変数の使用

CSS変数を使用してぼかし値をカスタマイズできます。

```html
<img class="blur-(--my-blur)" src="/img/mountains.jpg" />
```

## レスポンシブデザイン

特定のブレークポイントでのみぼかしユーティリティを適用するには、`md:`のようなブレークポイント修飾子をプレフィックスとして追加します。

```html
<img class="blur-sm md:blur-lg" src="/img/mountains.jpg" />
```

## テーマのカスタマイズ

`@theme`ディレクティブを使用して、ぼかしのスケールをカスタマイズできます。

```css
@theme {
  --blur-2xs: 2px;
}
```

## 関連ユーティリティ

- [Backdrop Blur](/docs/backdrop-blur)
- [Drop Shadow](/docs/drop-shadow)
