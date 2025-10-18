# Animation

CSSアニメーションで要素をアニメーション化するためのユーティリティです。

## クイックリファレンス

| クラス | スタイル |
|-------|---------|
| `animate-spin` | 回転アニメーション（1秒、線形、無限） |
| `animate-ping` | ピンアニメーション（スケールとフェード） |
| `animate-pulse` | パルスアニメーション（フェードイン・アウト） |
| `animate-bounce` | バウンスアニメーション |
| `animate-none` | アニメーションを削除 |

## 基本的な使い方

### スピンアニメーション（ローディングインジケーター）

`animate-spin`を使用して、ローディングインジケーターに連続的な回転アニメーションを追加します。

```html
<button type="button" class="bg-indigo-500 text-white px-4 py-2 rounded" disabled>
  <svg class="mr-3 size-5 animate-spin text-white" viewBox="0 0 24 24">
    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
  </svg>
  処理中...
</button>
```

### ピンアニメーション（通知バッジ）

`animate-ping`を使用して、通知バッジにピンアニメーションを追加します。

```html
<span class="relative flex size-3">
  <span class="absolute inline-flex h-full w-full animate-ping rounded-full bg-sky-400 opacity-75"></span>
  <span class="relative inline-flex size-3 rounded-full bg-sky-500"></span>
</span>
```

### パルスアニメーション（スケルトンローダー）

`animate-pulse`を使用して、スケルトンローダーにフェードアニメーションを追加します。

```html
<div class="animate-pulse border border-blue-300 shadow rounded-md p-4 max-w-sm w-full mx-auto">
  <div class="flex space-x-4">
    <div class="rounded-full bg-slate-200 h-10 w-10"></div>
    <div class="flex-1 space-y-6 py-1">
      <div class="h-2 bg-slate-200 rounded"></div>
      <div class="space-y-3">
        <div class="grid grid-cols-3 gap-4">
          <div class="h-2 bg-slate-200 rounded col-span-2"></div>
          <div class="h-2 bg-slate-200 rounded col-span-1"></div>
        </div>
        <div class="h-2 bg-slate-200 rounded"></div>
      </div>
    </div>
  </div>
</div>
```

### バウンスアニメーション

`animate-bounce`を使用して、要素に上下のバウンスアニメーションを追加します。

```html
<svg class="animate-bounce w-6 h-6 text-amber-900" fill="none" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" viewBox="0 0 24 24" stroke="currentColor">
  <path d="M19 14l-7 7m0 0l-7-7m7 7V3"></path>
</svg>
```

### モーション削減のサポート

`motion-reduce:`バリアントを使用して、ユーザーがモーション削減を要求した場合にアニメーションを無効化します。

```html
<button class="animate-bounce motion-reduce:animate-none">
  <!-- ... -->
</button>
```

## カスタム値の適用

任意の値を使用する必要がある場合は、角括弧を使用してその場でプロパティを生成します。

```html
<div class="animate-[wiggle_1s_ease-in-out_infinite]">
  <!-- ... -->
</div>
```

## テーマのカスタマイズ

カスタムアニメーションをテーマに追加できます。

```css
@theme {
  --animate-wiggle: wiggle 1s ease-in-out infinite;
  @keyframes wiggle {
    0%, 100% { transform: rotate(-3deg); }
    50% { transform: rotate(3deg); }
  }
}
```

## レスポンシブデザイン

特定のブレークポイントでのみアニメーションを適用するには、既存のユーティリティクラスの前に`md:`などのレスポンシブプレフィックスを追加します。

```html
<div class="animate-none md:animate-spin">
  <!-- ... -->
</div>
```
