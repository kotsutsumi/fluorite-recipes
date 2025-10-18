# Font Family

要素のフォントファミリーを制御するためのユーティリティ。

## クイックリファレンス

| クラス | スタイル |
|-------|--------|
| `font-sans` | `font-family: var(--font-sans);` |
| `font-serif` | `font-family: var(--font-serif);` |
| `font-mono` | `font-family: var(--font-mono);` |
| `font-(family-name:<custom-property>)` | `font-family: var(<custom-property>);` |
| `font-[<value>]` | `font-family: <value>;` |

## 基本的な使い方

### サンセリフ体

`font-sans` を使用して、サンセリフ体のフォントスタックを適用します。

```html
<p class="font-sans">The quick brown fox jumps over the lazy dog.</p>
```

デフォルトでは、`ui-sans-serif, system-ui, sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol', 'Noto Color Emoji'` のフォントスタックが使用されます。

### セリフ体

`font-serif` を使用して、セリフ体のフォントスタックを適用します。

```html
<p class="font-serif">The quick brown fox jumps over the lazy dog.</p>
```

デフォルトでは、`ui-serif, Georgia, Cambria, 'Times New Roman', Times, serif` のフォントスタックが使用されます。

### モノスペース

`font-mono` を使用して、等幅フォントのフォントスタックを適用します。

```html
<p class="font-mono">The quick brown fox jumps over the lazy dog.</p>
```

デフォルトでは、`ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace` のフォントスタックが使用されます。

## カスタム値の適用

任意の値を使用する必要がある場合は、角括弧を使用してその場でプロパティを生成できます。

```html
<p class="font-[Open_Sans]">Lorem ipsum dolor sit amet...</p>
```

CSS変数を参照することもできます。

```html
<p class="font-(family-name:--my-font)">Lorem ipsum dolor sit amet...</p>
```

## レスポンシブデザイン

プレフィックスを使用して、特定のブレークポイントでのみユーティリティを適用できます。

```html
<p class="font-sans md:font-serif">Lorem ipsum dolor sit amet...</p>
```

利用可能なすべてのブレークポイントオプションについては、[レスポンシブデザイン](/docs/responsive-design)のドキュメントを参照してください。

## テーマのカスタマイズ

テーマ変数を使用してフォントファミリーユーティリティをカスタマイズできます。

```css
@theme {
  --font-display: "Oswald", sans-serif;
  --font-display--font-feature-settings: "cv02", "cv03", "cv04", "cv11";
  --font-display--font-variation-settings: "opsz" 32;
}
```

カスタムフォントを使用する場合は、`font-display` などのクラスが生成されます。

```html
<p class="font-display">カスタムフォント</p>
```
