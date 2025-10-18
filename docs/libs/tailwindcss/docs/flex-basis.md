# Flex Basis

フレックスアイテムの初期サイズを制御するためのユーティリティ。

## クイックリファレンス

| クラス | スタイル |
|-------|--------|
| `basis-<number>` | `flex-basis: calc(var(--spacing) * <number>);` |
| `basis-<fraction>` | `flex-basis: calc(<fraction> * 100%);` |
| `basis-full` | `flex-basis: 100%;` |
| `basis-auto` | `flex-basis: auto;` |

### コンテナスケールクラス

| クラス | 値 |
|-------|-------|
| `basis-3xs` | `flex-basis: var(--container-3xs); /* 16rem (256px) */` |
| `basis-2xs` | `flex-basis: var(--container-2xs); /* 18rem (288px) */` |
| `basis-xs` | `flex-basis: var(--container-xs); /* 20rem (320px) */` |
| `basis-sm` | `flex-basis: var(--container-sm); /* 24rem (384px) */` |
| `basis-md` | `flex-basis: var(--container-md); /* 28rem (448px) */` |
| `basis-lg` | `flex-basis: var(--container-lg); /* 32rem (512px) */` |
| `basis-xl` | `flex-basis: var(--container-xl); /* 36rem (576px) */` |
| `basis-2xl` | `flex-basis: var(--container-2xl); /* 42rem (672px) */` |
| `basis-3xl` | `flex-basis: var(--container-3xl); /* 48rem (768px) */` |
| `basis-4xl` | `flex-basis: var(--container-4xl); /* 56rem (896px) */` |
| `basis-5xl` | `flex-basis: var(--container-5xl); /* 64rem (1024px) */` |
| `basis-6xl` | `flex-basis: var(--container-6xl); /* 72rem (1152px) */` |
| `basis-7xl` | `flex-basis: var(--container-7xl); /* 80rem (1280px) */` |

## 基本的な使い方

### スペーシングスケールの使用

`basis-{number}` ユーティリティを使用して、スペーシングスケールに基づいてフレックスアイテムの初期サイズを設定します。

```html
<div class="flex flex-row">
  <div class="basis-64">01</div>
  <div class="basis-64">02</div>
  <div class="basis-128">03</div>
</div>
```

### パーセンテージの使用

`basis-{fraction}` ユーティリティを使用して、パーセンテージベースでフレックスアイテムの初期サイズを設定します。

```html
<div class="flex flex-row">
  <div class="basis-1/3">01</div>
  <div class="basis-2/3">02</div>
</div>
```

## カスタム値の適用

任意の値を使用する必要がある場合は、角括弧を使用してその場でプロパティを生成できます。

```html
<div class="basis-[30vw]">...</div>
```

CSS変数を参照することもできます。

```html
<div class="basis-(--my-basis)">...</div>
```

## レスポンシブデザイン

プレフィックスを使用して、特定のブレークポイントでのみユーティリティを適用できます。

```html
<div class="flex flex-row">
  <div class="basis-1/4 md:basis-1/3">01</div>
  <div class="basis-1/4 md:basis-1/3">02</div>
  <div class="basis-1/2 md:basis-1/3">03</div>
</div>
```

利用可能なすべてのブレークポイントオプションについては、[レスポンシブデザイン](/docs/responsive-design)のドキュメントを参照してください。

## カスタマイズ

### コンテナとスペーシング変数のカスタマイズ

テーマ内でコンテナとスペーシング変数をカスタマイズできます。

```css
@theme {
  --container-sm: 30rem;
  --spacing-128: 32rem;
}
```
