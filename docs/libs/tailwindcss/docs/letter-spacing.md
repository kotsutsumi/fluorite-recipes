# Letter Spacing

要素のトラッキング（字間）を制御するためのユーティリティ。

## クイックリファレンス

| クラス | スタイル |
|-------|--------|
| `tracking-tighter` | `letter-spacing: var(--tracking-tighter); /* -0.05em */` |
| `tracking-tight` | `letter-spacing: var(--tracking-tight); /* -0.025em */` |
| `tracking-normal` | `letter-spacing: var(--tracking-normal); /* 0em */` |
| `tracking-wide` | `letter-spacing: var(--tracking-wide); /* 0.025em */` |
| `tracking-wider` | `letter-spacing: var(--tracking-wider); /* 0.05em */` |
| `tracking-widest` | `letter-spacing: var(--tracking-widest); /* 0.1em */` |

## 基本的な使い方

### 字間の設定

`tracking-{size}` ユーティリティを使用して、要素の字間を制御します。

```html
<p class="tracking-tighter">The quick brown fox jumps over the lazy dog.</p>
<p class="tracking-tight">The quick brown fox jumps over the lazy dog.</p>
<p class="tracking-normal">The quick brown fox jumps over the lazy dog.</p>
<p class="tracking-wide">The quick brown fox jumps over the lazy dog.</p>
<p class="tracking-wider">The quick brown fox jumps over the lazy dog.</p>
<p class="tracking-widest">The quick brown fox jumps over the lazy dog.</p>
```

## カスタム値の適用

任意の値を使用する必要がある場合は、角括弧を使用してその場でプロパティを生成できます。

```html
<p class="tracking-[.25em]">Lorem ipsum dolor sit amet...</p>
```

CSS変数を参照することもできます。

```html
<p class="tracking-(--my-tracking)">Lorem ipsum dolor sit amet...</p>
```

## レスポンシブデザイン

プレフィックスを使用して、特定のブレークポイントでのみユーティリティを適用できます。

```html
<p class="tracking-tight md:tracking-wide">Lorem ipsum dolor sit amet...</p>
```

利用可能なすべてのブレークポイントオプションについては、[レスポンシブデザイン](/docs/responsive-design)のドキュメントを参照してください。

## テーマのカスタマイズ

テーマ変数を使用して字間をカスタマイズできます。

```css
@theme {
  --tracking-tightest: -0.075em;
}
```

## 注意事項

- 負の値およびカスタムの字間値をサポート
- レスポンシブバリアントと組み合わせて使用可能
- テーマ設定で簡単にカスタマイズ可能
