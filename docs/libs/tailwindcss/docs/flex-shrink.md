# Flex Shrink

フレックスアイテムの縮小を制御するためのユーティリティ。

## クイックリファレンス

| クラス | スタイル |
|-------|--------|
| `shrink` | `flex-shrink: 1;` |
| `shrink-<number>` | `flex-shrink: <number>;` |
| `shrink-[<value>]` | `flex-shrink: <value>;` |
| `shrink-(<custom-property>)` | `flex-shrink: var(<custom-property>);` |

## 基本的な使い方

### フレックスアイテムの縮小を許可

`shrink` を使用して、必要に応じてフレックスアイテムが縮小できるようにします。

```html
<div class="flex ...">
  <div class="h-14 w-14 flex-none ...">01</div>
  <div class="h-14 w-64 shrink ...">02</div>
  <div class="h-14 w-14 flex-none ...">03</div>
</div>
```

### アイテムの縮小を防止

`shrink-0` を使用して、フレックスアイテムの縮小を防ぎます。

```html
<div class="flex ...">
  <div class="h-16 flex-1 ...">01</div>
  <div class="h-16 w-32 shrink-0 ...">02</div>
  <div class="h-16 flex-1 ...">03</div>
</div>
```

## カスタム値の適用

任意の値を使用する必要がある場合は、角括弧を使用してその場でプロパティを生成できます。

```html
<div class="shrink-[calc(100vw-var(--sidebar))] ...">
  <!-- ... -->
</div>
```

CSS変数を参照することもできます。

```html
<div class="shrink-(--my-shrink) ...">
  <!-- ... -->
</div>
```

## レスポンシブデザイン

`md:` のようなブレークポイントバリアントをプレフィックスとして付けることで、中サイズ以上の画面でのみユーティリティを適用できます。

```html
<div class="shrink-0 md:shrink ...">
  <!-- ... -->
</div>
```

利用可能なすべてのブレークポイントオプションについては、[レスポンシブデザイン](/docs/responsive-design)のドキュメントを参照してください。

## 関連ユーティリティ

- [flex](/docs/flex)
- [flex-grow](/docs/flex-grow)
- [flex-basis](/docs/flex-basis)
