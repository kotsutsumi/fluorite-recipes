# Font Size

要素のフォントサイズを制御するためのユーティリティ。

## クイックリファレンス

| クラス | スタイル |
|-------|--------|
| `text-xs` | `font-size: var(--text-xs); /* 0.75rem (12px) */` |
| `text-sm` | `font-size: var(--text-sm); /* 0.875rem (14px) */` |
| `text-base` | `font-size: var(--text-base); /* 1rem (16px) */` |
| `text-lg` | `font-size: var(--text-lg); /* 1.125rem (18px) */` |
| `text-xl` | `font-size: var(--text-xl); /* 1.25rem (20px) */` |
| `text-2xl` | `font-size: var(--text-2xl); /* 1.5rem (24px) */` |
| `text-3xl` | `font-size: var(--text-3xl); /* 1.875rem (30px) */` |
| `text-4xl` | `font-size: var(--text-4xl); /* 2.25rem (36px) */` |
| `text-5xl` | `font-size: var(--text-5xl); /* 3rem (48px) */` |
| `text-6xl` | `font-size: var(--text-6xl); /* 3.75rem (60px) */` |
| `text-7xl` | `font-size: var(--text-7xl); /* 4.5rem (72px) */` |
| `text-8xl` | `font-size: var(--text-8xl); /* 6rem (96px) */` |
| `text-9xl` | `font-size: var(--text-9xl); /* 8rem (128px) */` |

## 基本的な使い方

### フォントサイズの設定

`text-{size}` ユーティリティを使用して、要素のフォントサイズを制御します。

```html
<p class="text-xs">The quick brown fox jumps over the lazy dog.</p>
<p class="text-sm">The quick brown fox jumps over the lazy dog.</p>
<p class="text-base">The quick brown fox jumps over the lazy dog.</p>
<p class="text-lg">The quick brown fox jumps over the lazy dog.</p>
<p class="text-xl">The quick brown fox jumps over the lazy dog.</p>
<p class="text-2xl">The quick brown fox jumps over the lazy dog.</p>
<p class="text-3xl">The quick brown fox jumps over the lazy dog.</p>
```

## カスタム値の適用

任意の値を使用する必要がある場合は、角括弧を使用してその場でプロパティを生成できます。

```html
<p class="text-[14px]">Lorem ipsum dolor sit amet...</p>
```

CSS変数を参照することもできます。

```html
<p class="text-(--my-font-size)">Lorem ipsum dolor sit amet...</p>
```

## レスポンシブデザイン

プレフィックスを使用して、特定のブレークポイントでのみユーティリティを適用できます。

```html
<p class="text-base md:text-lg lg:text-xl">
  Lorem ipsum dolor sit amet...
</p>
```

利用可能なすべてのブレークポイントオプションについては、[レスポンシブデザイン](/docs/responsive-design)のドキュメントを参照してください。

## テーマのカスタマイズ

テーマ変数を使用してフォントサイズをカスタマイズできます。

```css
@theme {
  --text-2xs: 0.625rem; /* 10px */
  --text-10xl: 10rem; /* 160px */
}
```
