# Flex Grow

フレックスアイテムの伸長を制御するためのユーティリティ。

## クイックリファレンス

| クラス | スタイル |
|-------|--------|
| `grow` | `flex-grow: 1;` |
| `grow-<number>` | `flex-grow: <number>;` |
| `grow-[<value>]` | `flex-grow: <value>;` |
| `grow-(<custom-property>)` | `flex-grow: var(<custom-property>);` |

## 基本的な使い方

### アイテムの伸長を許可

`grow` を使用して、フレックスアイテムが利用可能なスペースを埋めるように伸長できるようにします。

```html
<div class="flex ...">
  <div class="size-14 flex-none ...">01</div>
  <div class="size-14 grow ...">02</div>
  <div class="size-14 flex-none ...">03</div>
</div>
```

### 係数に基づいてアイテムを伸長

`grow-<number>` を使用して、フレックスアイテムを比例的に伸長させます。

```html
<div class="flex ...">
  <div class="size-14 grow-3 ...">01</div>
  <div class="size-14 grow-7 ...">02</div>
  <div class="size-14 grow-3 ...">03</div>
</div>
```

### アイテムの伸長を防止

`grow-0` を使用して、フレックスアイテムの伸長を防ぎます。

```html
<div class="flex ...">
  <div class="size-14 grow ...">01</div>
  <div class="size-14 grow-0 ...">02</div>
  <div class="size-14 grow ...">03</div>
</div>
```

## カスタム値の適用

任意の値を使用する必要がある場合は、角括弧を使用してその場でプロパティを生成できます。

```html
<div class="grow-[25vw] ...">
  <!-- ... -->
</div>
```

CSS変数を参照することもできます。

```html
<div class="grow-(--my-grow) ...">
  <!-- ... -->
</div>
```

## レスポンシブデザイン

プレフィックスを使用して、特定のブレークポイントでのみユーティリティを適用できます。

```html
<div class="grow-0 md:grow ...">
  <!-- ... -->
</div>
```

利用可能なすべてのブレークポイントオプションについては、[レスポンシブデザイン](/docs/responsive-design)のドキュメントを参照してください。

## 関連ユーティリティ

- [flex](/docs/flex)
- [flex-shrink](/docs/flex-shrink)
- [flex-basis](/docs/flex-basis)
