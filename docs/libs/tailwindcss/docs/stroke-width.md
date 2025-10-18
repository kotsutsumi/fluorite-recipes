# Stroke Width

SVG要素のストローク幅をスタイリングするためのユーティリティです。

## クイックリファレンス

| クラス | スタイル |
|-------|---------|
| `stroke-<number>` | `stroke-width: <number>;` |
| `stroke-(length:<custom-property>)` | `stroke-width: var(<custom-property>);` |
| `stroke-[<value>]` | `stroke-width: <value>;` |

## 基本的な使い方

### 基本的な使用例

`stroke-*`ユーティリティを使用して、SVG要素のストローク幅を設定します。

```html
<svg class="stroke-blue-500 stroke-1" fill="none" viewBox="0 0 100 100">
  <circle cx="50" cy="50" r="40" />
</svg>

<svg class="stroke-blue-500 stroke-2" fill="none" viewBox="0 0 100 100">
  <circle cx="50" cy="50" r="40" />
</svg>

<svg class="stroke-blue-500 stroke-4" fill="none" viewBox="0 0 100 100">
  <circle cx="50" cy="50" r="40" />
</svg>
```

## カスタム値の適用

任意の値を使用する必要がある場合は、角括弧を使用してその場でプロパティを生成します。

```html
<svg class="stroke-[1.5]" fill="none" viewBox="0 0 100 100">
  <circle cx="50" cy="50" r="40" />
</svg>
```

CSS変数を使用することもできます。

```html
<svg class="stroke-(length:--my-stroke-width)" fill="none" viewBox="0 0 100 100">
  <circle cx="50" cy="50" r="40" />
</svg>
```

## レスポンシブデザイン

特定のブレークポイントでのみストローク幅を適用するには、既存のユーティリティクラスの前に`md:`などのレスポンシブプレフィックスを追加します。

```html
<svg class="stroke-1 md:stroke-2" fill="none" viewBox="0 0 100 100">
  <circle cx="50" cy="50" r="40" />
</svg>
```

## ホバー、フォーカス、その他の状態

`hover:`などの状態バリアントを使用して、異なる状態でストローク幅を条件付きで適用します。

```html
<svg class="stroke-1 hover:stroke-2" fill="none" viewBox="0 0 100 100">
  <circle cx="50" cy="50" r="40" />
</svg>
```

## 使用例

### アイコンセット

Heroiconsなどのアイコンセットで一貫したストローク幅を使用。

```html
<svg class="size-6 stroke-gray-700 stroke-1.5" fill="none" viewBox="0 0 24 24">
  <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
</svg>

<svg class="size-6 stroke-gray-700 stroke-1.5" fill="none" viewBox="0 0 24 24">
  <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
</svg>
```

### インタラクティブなアイコン

ホバー時にストローク幅が変わるアイコン。

```html
<button class="group">
  <svg class="size-8 stroke-blue-500 stroke-2 group-hover:stroke-3 transition-all" fill="none" viewBox="0 0 24 24">
    <path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
  </svg>
</button>
```

### グラフィック要素

異なるストローク幅を持つグラフィック。

```html
<svg viewBox="0 0 200 200" class="w-48 h-48">
  <circle cx="100" cy="100" r="80" class="stroke-blue-500 fill-none stroke-1" />
  <circle cx="100" cy="100" r="60" class="stroke-green-500 fill-none stroke-2" />
  <circle cx="100" cy="100" r="40" class="stroke-red-500 fill-none stroke-4" />
</svg>
```

### 細い線のイラスト

詳細なイラストには細いストロークを使用。

```html
<svg class="w-full h-auto stroke-gray-800 stroke-0.5" fill="none" viewBox="0 0 400 300">
  <path d="M10 150 Q 100 50, 200 150 T 390 150" stroke-linecap="round" />
  <circle cx="200" cy="150" r="100" />
</svg>
```

## テーマのカスタマイズ

カスタムストローク幅をテーマに追加できます。

```css
@theme {
  --stroke-width-custom: 2.5;
}
```

## 注意事項

ストローク幅は、SVG要素の視覚的な太さに影響します。細すぎるストロークは一部のディスプレイで見にくくなる可能性があるため、アクセシビリティを考慮してください。

## 関連ユーティリティ

- [Stroke](/docs/stroke)
- [Fill](/docs/fill)
